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
        // First chunk of a new response — add human-like thinking delay (1.5–3s)
        this.responseStarted = true;
        const delay = 1500 + Math.random() * 1500;
        setTimeout(() => this.playNext(), delay);
      }
      // Subsequent chunks while delay is pending: just sit in queue
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

  // Dial tone (425Hz — German standard) followed by headset connect crackle
  playDialToneAndCrackle(): void {
    if (!this.audioContext) this.init();
    const ctx = this.audioContext!;

    // 425Hz dial tone, 0.8s
    const toneRate = ctx.sampleRate;
    const toneSamples = Math.floor(toneRate * 0.8);
    const toneBuf = ctx.createBuffer(1, toneSamples, toneRate);
    const toneData = toneBuf.getChannelData(0);
    for (let i = 0; i < toneSamples; i++) {
      const fade = i < 800 ? i / 800 : i > toneSamples - 800 ? (toneSamples - i) / 800 : 1;
      toneData[i] = 0.25 * Math.sin(2 * Math.PI * 425 * (i / toneRate)) * fade;
    }

    // Short crackle burst — headset plugging in
    const crackleSamples = Math.floor(toneRate * 0.07);
    const crackleBuf = ctx.createBuffer(1, crackleSamples, toneRate);
    const crackleData = crackleBuf.getChannelData(0);
    for (let i = 0; i < crackleSamples; i++) {
      crackleData[i] = (Math.random() * 2 - 1) * 0.2 * Math.pow(1 - i / crackleSamples, 3);
    }

    const toneSource = ctx.createBufferSource();
    toneSource.buffer = toneBuf;
    toneSource.connect(ctx.destination);
    toneSource.start();

    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuf;
    crackleSource.connect(ctx.destination);
    // Crackle plays right after tone ends
    crackleSource.start(ctx.currentTime + 0.85);
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
