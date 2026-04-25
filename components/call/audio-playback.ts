export interface AudioPlayback {
  init(): Promise<void>;
  enqueue(base64Pcm: string): void;
  clear(): void;
  close(): void;
  onPlaybackStart: (() => void) | null;
  onPlaybackEnd: (() => void) | null;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function createAudioPlayback(): AudioPlayback {
  let audioContext: AudioContext | null = null;
  let workletNode: AudioWorkletNode | null = null;

  const playback: AudioPlayback = {
    onPlaybackStart: null,
    onPlaybackEnd: null,

    async init() {
      audioContext = new AudioContext({ sampleRate: 24000 });

      await audioContext.audioWorklet.addModule('/playback-worklet.js');
      workletNode = new AudioWorkletNode(audioContext, 'audio-playback-processor');

      workletNode.port.onmessage = (event: MessageEvent) => {
        if (event.data.event === 'playbackStart') {
          playback.onPlaybackStart?.();
        } else if (event.data.event === 'playbackEnd') {
          playback.onPlaybackEnd?.();
        }
      };

      workletNode.connect(audioContext.destination);

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    },

    enqueue(base64Pcm: string) {
      if (!workletNode) return;

      const arrayBuffer = base64ToArrayBuffer(base64Pcm);
      const int16 = new Int16Array(arrayBuffer);
      const float32 = new Float32Array(int16.length);

      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      workletNode.port.postMessage(float32, [float32.buffer]);
    },

    clear() {
      if (!workletNode) return;
      workletNode.port.postMessage({ command: 'clear' });
    },

    close() {
      if (workletNode) {
        workletNode.disconnect();
        workletNode = null;
      }

      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    },
  };

  return playback;
}
