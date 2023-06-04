<script lang="ts">
  import { onMount } from 'svelte';
  import { setError } from '../../store/error';
  import axios from 'axios';
  import { cutAudio, audioBufferToBlob } from '$lib/utils/audio';
  import WaveSurfer, { type WaveSurferEvents } from 'wavesurfer.js';
  import type Player from 'wavesurfer.js/dist/player';

  let audioContext: AudioContext;
  let wsurfer1: Player<WaveSurferEvents>;
  let duration: number = 0;
  let currentTime: number = 0;
  let hoverTime: number = 0;
  let audioSegments: Player<WaveSurferEvents>[] = [];
  let audioArrayBuffer: ArrayBuffer;

  let playAudio = () => {};
  let stopAudio = () => {};
  let pauseAudio = () => {};
  let seekStartAudio = () => {};
  let seekEndAudio = () => {};
  let splitCurrentAudio = () => {};

  let waveContainerIds: string[] = [];

  onMount(async () => {
    async function createNewWavAsync(audioUrl: string) {
      const newWaveContainerId = `#waveform-${Math.floor(Math.random() * 10000000)}`;
      const newWaveContainer = document.createElement('div');
      newWaveContainer.className = "wave-container";
      newWaveContainer.id = newWaveContainerId;
      document.getElementById('wavesSection')?.appendChild(newWaveContainer);
      // setTimeout(async () => {
      const newWavSuf = WaveSurfer.create({
        container: newWaveContainer,
        waveColor: 'violet',
        progressColor: 'purple'
      });
      // newWavSuf.on('interaction', () => {
      //   newWavSuf.play();
      // });
      await newWavSuf.load(audioUrl);
      return newWavSuf;
    }

    const ogAudioUrl =
      'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_500KB_MP3.mp3';
    try {
      const fetchAudioResponse = await axios.get(ogAudioUrl, {
        headers: {
          'Content-Type': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      });
      console.log({ fetchAudioResponse });
      audioArrayBuffer = fetchAudioResponse.data;
      const blobUrl = URL.createObjectURL(new Blob([audioArrayBuffer]));
      console.log({ blobUrl });
      const wsurfer1 = await createNewWavAsync(ogAudioUrl);

      wsurfer1.on('timeupdate', (newTime: number) => {
        currentTime = newTime;
        hoverTime = newTime;
        console.log({ currentTime });
      });

      wsurfer1.on('drag', (relativeX: number) => {
        hoverTime = relativeX * duration;
      });

      duration = wsurfer1.getDuration();
      audioSegments = [wsurfer1];
      playAudio = () => {
        wsurfer1.play();
      };
      stopAudio = () => {
        wsurfer1.stop();
      };
      pauseAudio = () => {
        wsurfer1.pause();
      };

      seekStartAudio = () => {
        wsurfer1.seekTo(0);
      };

      seekEndAudio = () => {
        wsurfer1.seekTo(1);
      };

      splitCurrentAudio = async () => {
        console.log('SPLITTING');
        const srcAudioBuffer = wsurfer1.getDecodedData()!;
        console.log({ srcAudioBuffer });
        console.log({ currentTime });
        const firstHalfAudioBuffer = cutAudio(srcAudioBuffer, 0, currentTime);
        const secondHalfAudioBuffer = cutAudio(srcAudioBuffer, currentTime, duration);

        const firstHalfBlob = audioBufferToBlob(firstHalfAudioBuffer);
        const secondHalfBlob = audioBufferToBlob(secondHalfAudioBuffer);

        const firstHalfUrl = window.URL.createObjectURL(firstHalfBlob);
        const secondHalfUrl = window.URL.createObjectURL(secondHalfBlob);

        const firstHalfWave = await createNewWavAsync(firstHalfUrl);
        const secondHalfWave = await createNewWavAsync(secondHalfUrl);
        // Replace the current one with the two new halves
        audioSegments = [
          firstHalfWave,
          secondHalfWave,
        ]
        const waveContainerIds = audioSegments.map(wave => wave.getMediaElement().id);
        console.log({ waveContainerIds });
        // for(const ct of document.getElementsByClassName("wave-container")) {
        //   if(!waveContainerIds.includes(ct.id)) {
        //     ct.setAttribute("style", "display: none");
        //   }
        // }
        console.log({ audioSegments });
      };
    } catch (fetchAudioError) {
      console.error({ fetchAudioError });
      setError(fetchAudioError);
    }
  });

  async function fetchAudio(url: string) {
    try {
      const fetchAudioResponse = await axios.get(url, {
        headers: {
          Accept: 'audio/mpeg',
          'Access-Control-Allow-Origin': '*'
          // 'Access-Control-Allow-Headers': '*',
          // 'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
          // 'Access-Control-Allow-Credentials':  'true'
        },
        responseType: 'arraybuffer'
      });
      console.log({ fetchAudioResponse });
      return fetchAudioResponse.data;
    } catch (fetchAudioError) {
      console.error({ fetchAudioError });
      setError(fetchAudioError);
    }
  }

  // async function playAudio() {
  //   const audioSrc = document.getElementById('originalAudio')?.getAttribute('src') || '';
  //   console.log({ audioSrc });
  //   const audioData = await fetchAudio(audioSrc);
  //   console.log({ audioData });
  //   const originalAudioBuffer = await audioContext.decodeAudioData(audioData);
  //   const returnedAudioBuffer = cutAudio(originalAudioBuffer, 15, 20);

  //   console.log('Got the decoded buffer now play the song', returnedAudioBuffer);
  //   const newSource = audioContext.createBufferSource();
  //   newSource.buffer = returnedAudioBuffer;
  //   newSource.connect(audioContext.destination);
  //   newSource.loop = true;
  //   newSource.start();
  // }
</script>

<div>
  {currentTime} / {duration}
  <div>{hoverTime}</div>
  <button on:click={stopAudio}> Stop </button>
  <button on:click={playAudio}> Play </button>
  <button on:click={pauseAudio}> Pause </button>
  <!-- <button> Seek back </button>
  <button> Seek forward </button> -->
  <button on:click={seekStartAudio}> Seek start </button>
  <button on:click={seekEndAudio}> Seek end </button>
  <br /><br />
  <button on:click={splitCurrentAudio}>Split</button>
  <div id="wavesSection">
    <div id="waveform" />
  </div>
</div>
