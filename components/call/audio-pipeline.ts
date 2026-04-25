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
  private firstResponseNotBefore = 0; // absolute ms timestamp — don't play before this
  public onPlaybackStart: (() => void) | null = null;
  public onPlaybackEnd: (() => void) | null = null;

  constructor(sampleRate = 24000) {
    this.sampleRate = sampleRate;
  }

  init(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
    }
  }

  enqueue(base64Audio: string): void {
    if (!this.audioContext) this.init();
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
          // Subsequent responses — bimodal: sometimes fast, sometimes slow, never uniform
          // 30%: quick (150–400ms), 50%: normal (600–1400ms), 20%: long (2200–3800ms)
          const r = Math.random();
          delay = r < 0.3
            ? 150 + Math.random() * 250
            : r < 0.8
              ? 600 + Math.random() * 800
              : 2200 + Math.random() * 1600;
        }
        setTimeout(() => this.playNext(), delay);
      }
    }
  }

  // Phone EQ + VoIP compression chain — makes voice sound like a real call
  private buildProcessingChain(): AudioNode {
    const ctx = this.audioContext!;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 300;
    highpass.Q.value = 0.7;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3400;
    lowpass.Q.value = 0.7;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    highpass.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(ctx.destination);

    return highpass;
  }

  private playNext(): void {
    if (!this.audioContext || this.queue.length === 0) {
      this.isPlaying = false;
      this.responseStarted = false;
      this.onPlaybackEnd?.();
      return;
    }
    this.isPlaying = true;
    this.onPlaybackStart?.();
    const buffer = this.queue.shift()!;
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    const inputNode = this.buildProcessingChain();
    source.connect(inputNode);
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

    // Crackle — headset pickup click
    const crackleSamples = Math.floor(rate * 0.08);
    const crackleBuf = ctx.createBuffer(1, crackleSamples, rate);
    const crackleData = crackleBuf.getChannelData(0);
    for (let i = 0; i < crackleSamples; i++) {
      crackleData[i] = (Math.random() * 2 - 1) * 0.25 * Math.pow(1 - i / crackleSamples, 2.5);
    }
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuf;
    crackleSource.connect(ctx.destination);
    crackleSource.start(t0 + crackleOffset);

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
    this.queue = [];
    this.isPlaying = false;
    this.responseStarted = false;
    this.audioContext?.close();
    this.audioContext = null;
  }
}
