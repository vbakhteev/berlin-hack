export class AudioPipeline {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private onChunk: ((base64: string) => void) | null = null;

  async start(onChunk: (base64: string) => void): Promise<void> {
    this.onChunk = onChunk;
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);

    // ScriptProcessorNode intentionally used over AudioWorklet — AudioWorklet is unavailable
    // on older iOS Safari versions (pre-17), which is the primary demo device risk (R1).
    // 4096 samples / 16000 Hz = 256ms chunks
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = this.floatToPcm16(inputData);
      const base64 = this.arrayBufferToBase64(pcm16.buffer as ArrayBuffer);
      this.onChunk?.(base64);
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  stop(): void {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.mediaStream?.getTracks().forEach((t) => t.stop());
    this.audioContext?.close();
    this.processor = null;
    this.source = null;
    this.mediaStream = null;
    this.audioContext = null;
  }

  private floatToPcm16(float32: Float32Array): Int16Array {
    const pcm16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private queue: AudioBuffer[] = [];
  private isPlaying = false;
  private sampleRate: number;
  private responseStarted = false;
  private ambientSource: AudioBufferSourceNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private firstResponseNotBefore = 0; // absolute ms timestamp — don't play before this
  private isFirstResponse = true; // for handset-lift volume ramp on greeting
  // turnComplete tracks whether the server has signalled end-of-turn for the
  // current Gemini response. Without this, playNext() would fire onPlaybackEnd
  // every time the chunk queue briefly drained mid-turn — half-duplexing the
  // mic mid-utterance and feeding Lina's own audio (post-echo-cancel) back into
  // the manual VAD, which sent bogus activityStart/End events and left Gemini
  // in a stuck state for the second turn. Initial value true = no turn in flight.
  private turnComplete = true;
  private endTimer: ReturnType<typeof setTimeout> | null = null;
  public onPlaybackStart: (() => void) | null = null;
  public onPlaybackEnd: (() => void) | null = null;

  get isBusy(): boolean {
    return this.isPlaying || this.queue.length > 0;
  }

  constructor(sampleRate = 24000) {
    this.sampleRate = sampleRate;
  }

  init(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
      this.startNoiseFloor();
    }
  }

  // Constant phone-band noise floor — bypasses the compressor so it never pumps.
  // ~-54dB white noise through phone bandpass (350–3000Hz), loops indefinitely.
  private startNoiseFloor(): void {
    if (!this.audioContext || this.noiseSource) return;
    const ctx = this.audioContext;
    const len = ctx.sampleRate * 2; // 2s loop to avoid audible pattern repetition
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 350;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3000;
    const gain = ctx.createGain();
    gain.gain.value = 0.0025;

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buf;
    this.noiseSource.loop = true;
    this.noiseSource.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    this.noiseSource.start();
  }

  enqueue(base64Audio: string): void {
    if (!this.audioContext) this.init();
    // New audio = a turn is in flight. Cancel any pending end-of-turn fire
    // queued by playNext() during a transient queue drain.
    this.turnComplete = false;
    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }
    const bytes = Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0));
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }
    const buffer = this.audioContext!.createBuffer(1, float32.length, this.sampleRate);
    buffer.copyToChannel(float32, 0);
    this.queue.push(buffer);

    if (!this.isPlaying) {
      if (!this.responseStarted) {
        this.responseStarted = true;
        const notBefore = this.firstResponseNotBefore;
        this.firstResponseNotBefore = 0;

        let delay: number;
        if (notBefore > 0) {
          // First response after pickup — wait for dial tone to finish, then speak quickly
          // (200–400ms after crackle, like someone who just answered)
          delay = Math.max(0, notBefore - Date.now()) + 200 + Math.random() * 200;
        } else {
          // Subsequent responses — keep it conversational, not robotic.
          // Gemini already adds ~500-1500ms processing latency so our client
          // delay stays small. 60%: near-instant (50-250ms), 40%: slight pause (300-600ms).
          const r = Math.random();
          delay = r < 0.6
            ? 50 + Math.random() * 200
            : 300 + Math.random() * 300;
        }
        setTimeout(() => this.playNext(), delay);
      }
    }
  }

  // Cheap 10€ headset chain — narrow bandpass, mid harshness, soft distortion, heavy compression
  private buildProcessingChain(): AudioNode {
    const ctx = this.audioContext!;

    // 20€ headset — slightly thin, mild hiss, no studio warmth. Still fully intelligible.
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 350;
    highpass.Q.value = 0.7;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3000;
    lowpass.Q.value = 0.7;

    // Very subtle mid presence — just enough to sound slightly "plasticky"
    const midHarsh = ctx.createBiquadFilter();
    midHarsh.type = "peaking";
    midHarsh.frequency.value = 2400;
    midHarsh.gain.value = 1.2;
    midHarsh.Q.value = 1.2;

    // Very light soft-clip — barely noticeable, just takes the edge off perfection
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(512);
    const k = 12;
    for (let i = 0; i < 512; i++) {
      const x = (i * 2) / 512 - 1;
      curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }
    shaper.curve = curve;
    shaper.oversample = "2x";

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 28;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.2;

    highpass.connect(midHarsh);
    midHarsh.connect(shaper);
    shaper.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(ctx.destination);

    return highpass;
  }

  // Server has signalled end-of-turn (turnComplete / generationComplete).
  // If the queue is already drained, fire onPlaybackEnd now; otherwise the
  // last call to playNext() will fire it once the buffers finish.
  markTurnComplete(): void {
    this.turnComplete = true;
    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }
    if (!this.isPlaying && this.queue.length === 0) {
      this.responseStarted = false;
      this.onPlaybackEnd?.();
    }
  }

  private playNext(): void {
    if (!this.audioContext || this.queue.length === 0) {
      this.isPlaying = false;
      this.responseStarted = false;
      if (this.turnComplete) {
        // True end-of-turn — fire immediately
        this.onPlaybackEnd?.();
      } else {
        // Mid-turn drain — wait for the next chunk OR for a server signal.
        // 250ms safety net: tight enough that the user can speak immediately
        // after Lina without their first words getting dropped while we wait
        // for a turnComplete that may arrive late or not at all. Cleared by
        // enqueue() if another audio chunk arrives within the window.
        this.endTimer = setTimeout(() => {
          this.endTimer = null;
          if (this.queue.length === 0 && !this.isPlaying) {
            this.turnComplete = true;
            this.onPlaybackEnd?.();
          }
        }, 250);
      }
      return;
    }
    this.isPlaying = true;
    this.onPlaybackStart?.();
    const buffer = this.queue.shift()!;
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    const inputNode = this.buildProcessingChain();

    // First response: simulate handset coming up to ear — 180ms ramp from quiet to full
    if (this.isFirstResponse) {
      this.isFirstResponse = false;
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(1.0, this.audioContext.currentTime + 0.18);
      source.connect(gainNode);
      gainNode.connect(inputNode);
    } else {
      source.connect(inputNode);
    }

    source.onended = () => this.playNext();
    source.start();
  }

  // German Rufton per ITU-T E.180: 425Hz, 1s on / 4s off cadence.
  // Using 1s on / 3s off for demo (feels authentic, slightly tighter than standard 4s).
  // Ring 1 @ 0.0s, Ring 2 @ 4.0s, Ring 3 @ 8.0s, crackle @ 9.4s
  playDialToneAndCrackle(): void {
    if (!this.audioContext) this.init();
    const ctx = this.audioContext!;
    const rate = ctx.sampleRate;
    const t0 = ctx.currentTime;

    const ringDuration = 1.0;  // 1s ring tone
    const ringGap = 3.0;       // 3s silence (standard is 4s, 3s feels natural for demo)
    const ringOffsets = [0, ringDuration + ringGap, (ringDuration + ringGap) * 2];
    const crackleOffset = ringOffsets[2] + ringDuration + 0.4; // 9.4s

    // Build ring buffer — 425Hz with short fade in/out to avoid click
    const ringSamples = Math.floor(rate * ringDuration);
    const ringBuf = ctx.createBuffer(1, ringSamples, rate);
    const ringData = ringBuf.getChannelData(0);
    const fadeSamples = Math.floor(rate * 0.02); // 20ms fade
    for (let i = 0; i < ringSamples; i++) {
      const fade = i < fadeSamples ? i / fadeSamples
        : i > ringSamples - fadeSamples ? (ringSamples - i) / fadeSamples : 1;
      ringData[i] = 0.28 * Math.sin(2 * Math.PI * 425 * (i / rate)) * fade;
    }

    for (const offset of ringOffsets) {
      const src = ctx.createBufferSource();
      src.buffer = ringBuf;
      src.connect(ctx.destination);
      src.start(t0 + offset);
    }

    // Handset pickup — plastic housing lifted off cradle:
    // Phase 1 (0–10ms):  initial plastic thud — low-mid impact ~350Hz, hard attack
    // Phase 2 (10–45ms): body resonance — plastic flex, decaying oscillation ~280Hz
    // Phase 3 (45–85ms): cradle settle — soft mechanical tail, very quiet
    const pickupDuration = 0.085;
    const pickupSamples = Math.floor(rate * pickupDuration);
    const clickBuf = ctx.createBuffer(1, pickupSamples, rate);
    const clickData = clickBuf.getChannelData(0);
    const p1End = Math.floor(rate * 0.010); // 10ms
    const p2End = Math.floor(rate * 0.045); // 45ms
    for (let i = 0; i < pickupSamples; i++) {
      let v = 0;
      if (i < p1End) {
        // Phase 1: sharp low thud — fast attack, quick decay, 350Hz plastic body hit
        const t = i / p1End;
        const env = Math.pow(1 - t, 1.5);
        v = 0.55 * env * Math.sin(2 * Math.PI * 350 * (i / rate));
        // small crunch texture on top
        v += 0.08 * env * (Math.random() * 2 - 1);
      } else if (i < p2End) {
        // Phase 2: plastic resonance — 280Hz body mode, slower exponential decay
        const t = (i - p1End) / (p2End - p1End);
        const env = Math.pow(1 - t, 2.2);
        v = 0.18 * env * Math.sin(2 * Math.PI * 280 * (i / rate));
        // slight 140Hz sub-harmonic for weight
        v += 0.06 * env * Math.sin(2 * Math.PI * 140 * (i / rate));
      } else {
        // Phase 3: soft settle — near silence, tiny random texture
        const t = (i - p2End) / (pickupSamples - p2End);
        v = 0.015 * Math.pow(1 - t, 3) * (Math.random() * 2 - 1);
      }
      clickData[i] = v;
    }
    const clickSource = ctx.createBufferSource();
    clickSource.buffer = clickBuf;
    // Low-pass to keep it warm/plastic, not bright/electrical
    const pickupLp = ctx.createBiquadFilter();
    pickupLp.type = "lowpass";
    pickupLp.frequency.value = 800;
    clickSource.connect(pickupLp);
    pickupLp.connect(ctx.destination);
    clickSource.start(t0 + crackleOffset);

    // Block Lina's first word until 600ms after crackle — she "picks up" then speaks
    this.firstResponseNotBefore = Date.now() + (crackleOffset + 0.6) * 1000;
  }

  // Quiet keyboard typing burst — played during tool calls (Lina is "entering data")
  playTypingBurst(durationMs = 2000): void {
    if (!this.audioContext) this.init();
    const ctx = this.audioContext!;
    const numClicks = 6 + Math.floor(Math.random() * 8);
    const interval = durationMs / numClicks;

    for (let i = 0; i < numClicks; i++) {
      const jitter = (Math.random() - 0.5) * interval * 0.4;
      const time = ctx.currentTime + (i * interval + jitter) / 1000;

      const clickSamples = Math.floor(ctx.sampleRate * 0.04);
      const clickBuf = ctx.createBuffer(1, clickSamples, ctx.sampleRate);
      const clickData = clickBuf.getChannelData(0);
      for (let j = 0; j < clickSamples; j++) {
        clickData[j] = (Math.random() * 2 - 1) * 0.06 * Math.exp(-j / (clickSamples * 0.25));
      }

      const gain = ctx.createGain();
      gain.gain.value = 0.4;

      const source = ctx.createBufferSource();
      source.buffer = clickBuf;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(time);
    }
  }

  // Synthesized office ambient — AC hum (60Hz) + low filtered room noise, loops indefinitely
  startOfficeAmbient(): void {
    if (!this.audioContext) this.init();
    const ctx = this.audioContext!;
    const rate = ctx.sampleRate;
    const len = rate * 4; // 4s loop
    const buf = ctx.createBuffer(1, len, rate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++) {
      // 60Hz AC hum + weak 120Hz harmonic
      const hum = Math.sin(2 * Math.PI * 60 * (i / rate)) * 0.007
               + Math.sin(2 * Math.PI * 120 * (i / rate)) * 0.003;
      const noise = (Math.random() * 2 - 1) * 0.005;
      data[i] = hum + noise;
    }
    // Smooth loop boundaries to avoid click
    const fade = Math.min(400, len / 4);
    for (let i = 0; i < fade; i++) {
      data[i] *= i / fade;
      data[len - 1 - i] *= i / fade;
    }

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;

    const gain = ctx.createGain();
    gain.gain.value = 1.0;

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.loop = true;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    this.ambientSource = source;
  }

  stopOfficeAmbient(): void {
    try { this.ambientSource?.stop(); } catch {}
    this.ambientSource = null;
  }

  stop(): void {
    this.stopOfficeAmbient();
    try { this.noiseSource?.stop(); } catch {}
    this.noiseSource = null;
    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }
    this.queue = [];
    this.isPlaying = false;
    this.responseStarted = false;
    this.turnComplete = true;
    this.audioContext?.close();
    this.audioContext = null;
  }
}
