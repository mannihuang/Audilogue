function getAudioUri(audioData: ArrayBuffer) {
  const base64Data = btoa(String.fromCharCode.apply(null, new Uint8Array(audioData)));
  return `data:audio/mpeg;base64,${base64Data}`;
}

function setAndPlayAudio(elementSelector: string, audioSrc: string): HTMLAudioElement {
  if(!elementSelector.startsWith("#")) {
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

export { getAudioUri, setAndPlayAudio, cutAudio };
