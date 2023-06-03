function getAudioUri(audioData: ArrayBuffer) {
  const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(audioData)));
  return `data:audio/mpeg;base64,${base64Data}`;
}

function setAndPlayAudio(elementSelector: string, audioSrc: string): HTMLAudioElement {
  if (!elementSelector.startsWith("#")) {
    throw new Error("Selector not an id");
  }
  const id = elementSelector.substring(1);
  const player = document.getElementById(id) as HTMLAudioElement;
  player.src = audioSrc;
  setTimeout(() => {
    player.play();
  }, 1200);
  return player;
}

function cutAudio(audioBuffer: AudioBuffer, start: number, end: number): AudioBuffer {
  const audioContext = new AudioContext();
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;

  // Calculate the start and end sample positions
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);

  // Calculate the duration of the cut audio
  const duration = end - start;

  // Create a new AudioBuffer for the cut audio
  const cutBuffer = audioContext.createBuffer(channels, duration * sampleRate, sampleRate);

  // Copy the samples from the original buffer to the cut buffer
  for (let channel = 0; channel < channels; channel++) {
    const originalData = audioBuffer.getChannelData(channel);
    const cutData = cutBuffer.getChannelData(channel);

    for (let i = startSample, j = 0; i < endSample; i++, j++) {
      cutData[j] = originalData[i];
    }
  }

  return cutBuffer;
}

function interleaveChannelData(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const frameCount = audioBuffer.length;
  const interleaved = new Float32Array(frameCount * numberOfChannels);

  for (let i = 0; i < frameCount; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      interleaved[i * numberOfChannels + channel] = audioBuffer.getChannelData(channel)[i];
    }
  }

  return interleaved;
}


function float32ArrayToAudioBuffer(float32Array) {
  const audioBuffer = new AudioBuffer({
    numberOfChannels: 2,
    length: float32Array.length / 2,
    sampleRate: 44100 // Adjust according to your audio sample rate
  });

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = float32Array[i * audioBuffer.numberOfChannels + channel];
    }
  }

  return audioBuffer;
}

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0)
  wavBytes.set(new Uint8Array(buffer), headerBytes.length)

  return wavBytes
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
  const numFrames =      options.numFrames
  const numChannels =    options.numChannels || 2
  const sampleRate =     options.sampleRate || 44100
  const bytesPerSample = options.isFloat? 4 : 2
  const format =         options.isFloat? 3 : 1

  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numFrames * blockAlign

  const buffer = new ArrayBuffer(44)
  const dv = new DataView(buffer)

  let p = 0

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i))
    }
    p += s.length
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true)
    p += 4
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true)
    p += 2
  }

  writeString('RIFF')              // ChunkID
  writeUint32(dataSize + 36)       // ChunkSize
  writeString('WAVE')              // Format
  writeString('fmt ')              // Subchunk1ID
  writeUint32(16)                  // Subchunk1Size
  writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels)         // NumChannels
  writeUint32(sampleRate)          // SampleRate
  writeUint32(byteRate)            // ByteRate
  writeUint16(blockAlign)          // BlockAlign
  writeUint16(bytesPerSample * 8)  // BitsPerSample
  writeString('data')              // Subchunk2ID
  writeUint32(dataSize)            // Subchunk2Size

  return new Uint8Array(buffer)
}






function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  var view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) { // Raw PCM
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}

function interleave (inputL, inputR) {
  var length = inputL.length + inputR.length
  var result = new Float32Array(length)

  var index = 0
  var inputIndex = 0

  while (index < length) {
    result[index++] = inputL[inputIndex]
    result[index++] = inputR[inputIndex]
    inputIndex++
  }
  return result
}

function writeFloat32 (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}

function floatTo16BitPCM (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
}

function writeString (view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}


function audioBufferToWav (buffer, opt) {
  opt = opt || {}

  var numChannels = buffer.numberOfChannels
  var sampleRate = buffer.sampleRate
  var format = opt.float32 ? 3 : 1
  var bitDepth = format === 3 ? 32 : 16

  const interleavedChannelData = interleaveChannelData(buffer);

  return encodeWAV(interleavedChannelData, format, sampleRate, numChannels, bitDepth)
}

function audioBufferToBlob(audioBuffer: AudioBuffer): Blob {
  const wav = audioBufferToWav(audioBuffer, {});
  console.log({ wav });
  const blob = new window.Blob([new DataView(wav)], {
    type: 'audio/wav'
  });
  return blob;
}

export { getAudioUri, setAndPlayAudio, cutAudio, interleaveChannelData, float32ArrayToAudioBuffer, getWavBytes, audioBufferToBlob };
