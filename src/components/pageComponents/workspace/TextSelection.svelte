<script lang="ts">
  import {
    appendToSelectedSpeeches,
    paragraphs,
    removeFromSelectedSpeeches,
    selectedSpeeches,
    setCurrentSpeech
  } from '../../../store/speeches';
  import { allVoices } from '../../../store/user';
  import type { ISpeech } from '../../../types/custom';

  function handleSpeechSelect(event: any, speech: ISpeech) {
    if (event.ctrlKey || event.metaKey) {
      // already contains this speech
      if ($selectedSpeeches.some((sp) => sp.id == speech.id)) {
        removeFromSelectedSpeeches(speech.id);
      } else {
        appendToSelectedSpeeches(speech);
      }
      console.log({ $selectedSpeeches });
      return;
    }
    selectedSpeeches.set([speech]);
    // const voiceInitial = $savedVoices.find((vc) => vc.voice_id == speech.voiceId);
    setCurrentSpeech(speech.id);
    // stability = voiceInitial?.settings?.stability * 100;
    // similarityBoost = voiceInitial?.settings?.similarity_boost * 100;
  }

  function getSpeechStyling(speech: ISpeech) {
    let baseStyling = `
        cursor: pointer;
        background-color: ${
          $allVoices.find((vc) => vc.voice_id == speech.voiceId)?.color || 'lightgrey'
        };
    `;
    const showBorder = $selectedSpeeches.some((ssp) => ssp.id == speech.id);
    const borderColor = !speech.currentGeneration ? 'red' : 'blue';

    return !showBorder ? baseStyling : `${baseStyling} border: solid 2px ${borderColor}`;
  }
</script>

<div>
  {#each $paragraphs as pg, index}
    <p>
      {#each pg.speeches as pgsp, i}
        {#if pgsp.isInSpeechMarks}
          {#key $selectedSpeeches}
            <span
              on:click={(event) => handleSpeechSelect(event, pgsp)}
              style={`${getSpeechStyling(pgsp)}`}
            >
              {pgsp.text}
            </span>
          {/key}
        {:else}
          <span>{pgsp.text}</span>
        {/if}
      {/each}
    </p>
  {/each}
</div>