class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._ring = new Float32Array(3200);
    this._writePos = 0;
    this._count = 0;
    this._muted = false;
    this.port.onmessage = (e) => {
      if (e.data.mute !== undefined) this._muted = e.data.mute;
    };
  }

  process(inputs) {
    const input = inputs[0][0];
    if (!input) return true;

    for (let i = 0; i < input.length; i++) {
      this._ring[this._writePos] = input[i];
      this._writePos = (this._writePos + 1) % 3200;
      this._count++;
    }

    while (this._count >= 1600) {
      if (!this._muted) {
        const int16 = new Int16Array(1600);
        const readStart = (this._writePos - this._count + 3200) % 3200;
        for (let i = 0; i < 1600; i++) {
          const s = Math.max(-1, Math.min(1, this._ring[(readStart + i) % 3200]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        this.port.postMessage(int16.buffer, [int16.buffer]);
      }
      this._count -= 1600;
    }

    return true;
  }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
