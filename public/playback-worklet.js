class AudioPlaybackProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 240000;
    this._buffer = new Float32Array(this._bufferSize);
    this._writePos = 0;
    this._readPos = 0;
    this._count = 0;
    this._wasPlaying = false;
    this._emptyFrames = 0;
    // ~300ms holdoff at 24kHz/128 samples per frame = ~56 frames
    this._endHoldoff = 56;

    this.port.onmessage = (e) => {
      if (e.data.command === 'clear') {
        this._writePos = 0;
        this._readPos = 0;
        this._count = 0;
        this._emptyFrames = 0;
        if (this._wasPlaying) {
          this.port.postMessage({ event: 'playbackEnd' });
          this._wasPlaying = false;
        }
        return;
      }
      const chunk = e.data;
      for (let i = 0; i < chunk.length; i++) {
        this._buffer[this._writePos] = chunk[i];
        this._writePos = (this._writePos + 1) % this._bufferSize;
      }
      this._count += chunk.length;
      if (this._count > this._bufferSize) {
        this._count = this._bufferSize;
        this._readPos = this._writePos;
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0][0];
    if (!output) return true;

    for (let i = 0; i < output.length; i++) {
      if (this._count > 0) {
        output[i] = this._buffer[this._readPos];
        this._readPos = (this._readPos + 1) % this._bufferSize;
        this._count--;
      } else {
        output[i] = 0;
      }
    }

    const hasData = this._count > 0;

    if (hasData) {
      this._emptyFrames = 0;
      if (!this._wasPlaying) {
        this.port.postMessage({ event: 'playbackStart' });
        this._wasPlaying = true;
      }
    } else if (this._wasPlaying) {
      this._emptyFrames++;
      if (this._emptyFrames >= this._endHoldoff) {
        this.port.postMessage({ event: 'playbackEnd' });
        this._wasPlaying = false;
        this._emptyFrames = 0;
      }
    }

    return true;
  }
}

registerProcessor('audio-playback-processor', AudioPlaybackProcessor);
