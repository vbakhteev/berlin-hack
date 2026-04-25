export interface CameraStream {
  start(videoElement: HTMLVideoElement): Promise<MediaStream>;
  stop(): void;
  onFrame: ((base64Jpeg: string) => void) | null;
}

export function createCameraStream(): CameraStream {
  let _stream: MediaStream | null = null;
  let _timer: ReturnType<typeof setInterval> | null = null;
  let _stopped = false;

  const cam: CameraStream = {
    onFrame: null,

    async start(videoElement: HTMLVideoElement): Promise<MediaStream> {
      _stopped = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      // D4 stop-guard: if stop() was called while getUserMedia was resolving,
      // kill the new stream immediately to avoid an orphaned camera LED.
      if (_stopped) {
        stream.getTracks().forEach((t) => t.stop());
        return stream;
      }

      _stream = stream;
      videoElement.srcObject = stream;
      await videoElement.play();

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d")!;

      _timer = setInterval(() => {
        ctx.drawImage(videoElement, 0, 0, 640, 480);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        const base64 = dataUrl.replace("data:image/jpeg;base64,", "");
        if (cam.onFrame) {
          cam.onFrame(base64);
        }
      }, 1000);

      return stream;
    },

    stop() {
      _stopped = true;

      if (_timer !== null) {
        clearInterval(_timer);
        _timer = null;
      }

      if (_stream) {
        _stream.getTracks().forEach((t) => t.stop());
        _stream = null;
      }
    },
  };

  return cam;
}
