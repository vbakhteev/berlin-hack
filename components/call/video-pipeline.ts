export class VideoPipeline {
  private mediaStream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onFrame: ((base64: string) => void) | null = null;

  async start(
    videoElement: HTMLVideoElement,
    onFrame: (base64: string) => void,
    fps = 1
  ): Promise<void> {
    this.onFrame = onFrame;
    this.videoEl = videoElement;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
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

  stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.mediaStream?.getTracks().forEach((t) => t.stop());
    if (this.videoEl) this.videoEl.srcObject = null;
    this.intervalId = null;
    this.mediaStream = null;
    this.videoEl = null;
    this.canvas = null;
  }

  getStream(): MediaStream | null {
    return this.mediaStream;
  }
}
