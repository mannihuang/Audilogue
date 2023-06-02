<script lang="ts">
  import { onMount } from 'svelte';
  import { setError } from '../../store/error';
  import axios from 'axios';
  import { cutAudio } from '$lib/utils/audio';

  let audioContext: AudioContext;

  async function fetchAudio(url: string) {
    try {
      const fetchAudioResponse = await axios.get(url, {
        headers: {
          Accept: 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
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

  async function playAudio() {
    const audioSrc = document.getElementById('originalAudio')?.getAttribute('src') || '';
    console.log({ audioSrc });
    const audioData = await fetchAudio(audioSrc);
    console.log({ audioData });
    const originalAudioBuffer = await audioContext.decodeAudioData(audioData);
    const returnedAudioBuffer = cutAudio(originalAudioBuffer, 15, 20);

    console.log('Got the decoded buffer now play the song', returnedAudioBuffer);
    const newSource = audioContext.createBufferSource();
    newSource.buffer = returnedAudioBuffer;
    newSource.connect(audioContext.destination);
    newSource.loop = true;
    newSource.start();
  }

  const initProgress = async () => {
    try {
      const waveSurfer = (await import('wavesurfer.js')).default;
      const audio = waveSurfer.create({
        container: `#waveform`,
        waveColor: 'violet',
        progressColor: 'purple'
      });
      audio.load('https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_500KB_MP3.mp3');
    } catch (error) {
      console.error(error);
    }
  };

  onMount(() => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    initProgress();
  });
</script>

<div>
  hello
  <audio
    id="originalAudio"
    controls
    src="https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_500KB_MP3.mp3"
  />
  <audio id="copiedAudio" controls />
  <button on:click={playAudio}> Play </button>
  <div id="waveform" />
</div>
