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
    if (!this.isPlaying) this.playNext();
  }

  private playNext(): void {
    if (!this.audioContext || this.queue.length === 0) {
      this.isPlaying = false;
      this.onPlaybackEnd?.();
      return;
    }
    this.isPlaying = true;
    this.onPlaybackStart?.();
    const buffer = this.queue.shift()!;
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.onended = () => this.playNext();
    source.start();
  }

  stop(): void {
    this.queue = [];
    this.isPlaying = false;
    this.audioContext?.close();
    this.audioContext = null;
  }
}
