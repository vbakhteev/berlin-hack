export interface AudioCapture {
  start(): Promise<void>;
  stop(): void;
  setMuted(muted: boolean): void;
  onChunk: ((base64Pcm: string) => void) | null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createAudioCapture(): AudioCapture {
  let audioContext: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let workletNode: AudioWorkletNode | null = null;
  let scriptProcessor: ScriptProcessorNode | null = null;
  let sourceNode: MediaStreamAudioSourceNode | null = null;
  let fallbackMuted = false;

  const capture: AudioCapture = {
    onChunk: null,

    async start() {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      audioContext = new AudioContext({ sampleRate: 16000 });
      sourceNode = audioContext.createMediaStreamSource(stream);

      if (audioContext.audioWorklet) {
        // AudioWorklet path
        await audioContext.audioWorklet.addModule('/audio-worklet.js');
        workletNode = new AudioWorkletNode(audioContext, 'audio-capture-processor');

        workletNode.port.onmessage = (event: MessageEvent) => {
          const buffer: ArrayBuffer = event.data;
          if (capture.onChunk) {
            capture.onChunk(arrayBufferToBase64(buffer));
          }
        };

        sourceNode.connect(workletNode);
      } else {
        // ScriptProcessorNode fallback for old browsers
        const bufferSize = 4096;
        scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

        scriptProcessor.onaudioprocess = (event: AudioProcessingEvent) => {
          if (fallbackMuted) return;

          const input = event.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          if (capture.onChunk) {
            capture.onChunk(arrayBufferToBase64(int16.buffer));
          }
        };

        sourceNode.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
      }

      // Resume AudioContext (required for iOS Safari)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    },

    stop() {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }

      if (sourceNode) {
        sourceNode.disconnect();
        sourceNode = null;
      }

      if (workletNode) {
        workletNode.disconnect();
        workletNode = null;
      }

      if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
      }

      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    },

    setMuted(muted: boolean) {
      if (workletNode) {
        workletNode.port.postMessage({ mute: muted });
      }
      fallbackMuted = muted;
    },
  };

  return capture;
}
