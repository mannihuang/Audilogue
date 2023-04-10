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

export { getAudioUri, setAndPlayAudio };
