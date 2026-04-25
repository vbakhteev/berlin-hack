export class VideoPipeline {
  private mediaStream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onFrame: ((base64: string) => void) | null = null;

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startedAt: number | null = null;
  private _blobPending = false;

  async start(
    videoElement: HTMLVideoElement,
    onFrame: (base64: string) => void,
    fps = 1
  ): Promise<void> {
    this.onFrame = onFrame;
    this.videoEl = videoElement;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: true,
    });

    // stop() may have been called while the camera permission dialog was open
    if (this.videoEl === null) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    this.mediaStream = stream;
    videoElement.srcObject = this.mediaStream;
    await videoElement.play();

    this.canvas = document.createElement("canvas");
    this.canvas.width = 640;
    this.canvas.height = 480;

    this.intervalId = setInterval(() => this.captureFrame(), 1000 / fps);

    // Start recording
    this.recordedChunks = [];
    this.startedAt = Date.now();
    const mimeType = pickMimeType();
    try {
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 500_000,
        audioBitsPerSecond: 64_000,
      });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };
      recorder.start(1000); // collect chunks every 1s
      this.mediaRecorder = recorder;
    } catch (e) {
      console.warn("[VideoPipeline] MediaRecorder failed to start:", e);
    }
  }

  private captureFrame(): void {
    if (!this.videoEl || !this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(this.videoEl, 0, 0, 640, 480);
    const dataUrl = this.canvas.toDataURL("image/jpeg", 0.7);
    const base64 = dataUrl.split(",")[1];
    this.onFrame?.(base64);
  }

  stopAndGetBlob(): Promise<{ blob: Blob; durationSec: number } | null> {
    // Guard against concurrent calls — only the first caller gets the blob
    if (this._blobPending) return Promise.resolve(null);
    this._blobPending = true;

    return new Promise((resolve) => {
      const durationSec = this.startedAt
        ? Math.round((Date.now() - this.startedAt) / 1000)
        : 0;

      this._stopFrames();

      const recorder = this.mediaRecorder;
      this.mediaRecorder = null;

      if (!recorder || recorder.state === "inactive") {
        this._stopStream();
        const chunks = this.recordedChunks;
        this.recordedChunks = [];
        this._blobPending = false;
        if (chunks.length === 0) { resolve(null); return; }
        resolve({ blob: new Blob(chunks, { type: chunks[0].type }), durationSec });
        return;
      }

      recorder.onstop = () => {
        this._stopStream();
        const chunks = this.recordedChunks;
        this.recordedChunks = [];
        this._blobPending = false;
        if (chunks.length === 0) { resolve(null); return; }
        resolve({ blob: new Blob(chunks, { type: chunks[0].type }), durationSec });
      };
      recorder.stop();
    });
  }

  stop(): void {
    this._stopFrames();
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    // Don't clear chunks if stopAndGetBlob() is in progress — it owns them
    if (!this._blobPending) this.recordedChunks = [];
    this._stopStream();
  }

  private _stopFrames(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    this.canvas = null;
  }

  private _stopStream(): void {
    this.mediaStream?.getTracks().forEach((t) => t.stop());
    if (this.videoEl) this.videoEl.srcObject = null;
    this.mediaStream = null;
    this.videoEl = null;
    this.startedAt = null;
  }

  getStream(): MediaStream | null {
    return this.mediaStream;
  }
}

function pickMimeType(): string | null {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
  }
  return null;
}
