<script lang="ts">
  import Button from '@smui/button/src/Button.svelte';
  import { currentSpeech, setCurrentSpeech, speeches } from '../../../store/speeches';
  import { setAndPlayAudio } from '$lib/utils/audio';

  function getNextSpeechWithGenerationIndex(startingIndex = 0) {
    let j = startingIndex;
    while(j < $speeches.length - 1) {
      j++;
      if(!!$speeches[j].currentGeneration) {
        // return $speeches[j];
        return j;
      }
    }
    return -1;
  }

  function playAll() {
    console.log("Playing all...");
    let currIndex = getNextSpeechWithGenerationIndex(0);
    setCurrentSpeech($speeches[currIndex].id);
    const player = setAndPlayAudio("#dialogPlayer", $currentSpeech.currentGeneration!.audioUri);
    player.onended = () => {
      const nextIndex = getNextSpeechWithGenerationIndex(currIndex);
      console.log({ nextIndex, currIndex });
      if(nextIndex == currIndex) {
        return;
      }
      setCurrentSpeech($speeches[nextIndex].id);
      setAndPlayAudio("#dialogPlayer", $currentSpeech.currentGeneration!.audioUri);
      currIndex = nextIndex;
    }
  }

</script>

<div style="display: flex; align-items: center; gap: 15px;">
  <Button variant="unelevated" disabled={!$speeches.some(sp => !!sp.currentGeneration)} on:click={playAll}>Play all</Button>
  <audio id="dialogPlayer" controls />
</div>
