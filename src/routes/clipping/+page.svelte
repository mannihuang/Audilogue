<script lang="ts">
  import { onMount } from 'svelte';
  import { setError } from '../../store/error';
  import axios from 'axios';
  import { cutAudio } from '$lib/utils/audio';
  import WaveSurfer, { type WaveSurferEvents } from 'wavesurfer.js';
  import type Player from 'wavesurfer.js/dist/player';

  let audioContext: AudioContext;
  let wsurfer1: Player<WaveSurferEvents>;
  let duration: number = 0;
  let currentTime: number = 0;
  let hoverTime: number = 0;
  let audioSegments: Player<WaveSurferEvents>[];
  let audioArrayBuffer: ArrayBuffer;

  let playAudio = () => {};
  let stopAudio = () => {};
  let pauseAudio = () => {};
  let seekStartAudio = () => {};
  let seekEndAudio = () => {};
  let splitCurrentAudio = () => {};

  onMount(async () => {
    // const audio = new Audio();
    // audio.controls = true;
    // audio.src = '/examples/audio/audio.wav';
    const url = 'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_500KB_MP3.mp3';
    try {
      const fetchAudioResponse = await axios.get(url, {
        headers: {
          'Content-Type': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      });
      console.log({ fetchAudioResponse });
      audioArrayBuffer = fetchAudioResponse.data;
      const blobUrl = URL.createObjectURL(new Blob([audioArrayBuffer]));
      console.log({ blobUrl });
      const wsurfer1 = WaveSurfer.create({
        container: `#waveform`,
        waveColor: 'violet',
        progressColor: 'purple',
      });

      console.log({ audioArrayBuffer });
      await wsurfer1.load(blobUrl);

      duration = wsurfer1.getDuration();
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

      splitCurrentAudio = () => {
        console.log('SPLITTING');
        // audioSegments.push(wsurfer1);
      };

      wsurfer1.on('timeupdate', (newTime: number) => {
        currentTime = newTime;
        hoverTime = newTime;
      });

      wsurfer1.on('drag', (relativeX: number) => {
        hoverTime = relativeX * duration;
      });
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
  <!-- <audio
    id="originalAudio"
    controls
    src="https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_500KB_MP3.mp3"
  />
  <audio id="copiedAudio" controls /> -->
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
  <button>Split</button>
  <div id="waveform" />
</div>
