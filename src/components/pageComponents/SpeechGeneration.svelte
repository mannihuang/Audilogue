<script lang="ts">
  import Slider from '@smui/slider';
  import FormField from '@smui/form-field';
  import Textfield from '@smui/textfield';
  import Button from '@smui/button/src/Button.svelte';
  import { eApi } from '../../store/user';
  import { setError } from '../../store/error';
  import { currentSpeech } from '../../store/speeches';

  let stabilityValue = 50;
  let similarityBoostValue = 50;
  let audioUri = '';

  async function handleClickGenerate() {
    console.log('Clicked generate...');
    try {
      const rawAudioData = await $eApi.textToSpeechAsync($currentSpeech.voiceId || "", $currentSpeech.text, {
        stability: stabilityValue / 100,
        similarity_boost: similarityBoostValue / 100
      });
      console.log({ rawAudioData });

    } catch (generateAudioError) {
      setError(generateAudioError);
    }
  }
</script>

<div style="display: flex; flex-direction: column; gap: 20px; margin: 0 25px 0 15px;">
  <FormField align="end" style="display: flex;">
    <Slider bind:value={stabilityValue} style="flex-grow: 1; margin-right: 0;" />
    <Textfield bind:value={stabilityValue} label="Stability" type="number" style="width: 85px" />
  </FormField>

  <FormField align="end" style="display: flex;">
    <Slider bind:value={similarityBoostValue} style="flex-grow: 1; margin-right: 0;" />
    <Textfield
      bind:value={similarityBoostValue}
      label="Similarity boost"
      type="number"
      style="width: 85px"
    />
  </FormField>

  <Button on:click={handleClickGenerate} variant="unelevated" style="border-radius: 50px">
    Generate
  </Button>

  <audio src={audioUri} controls style="align-self: center" />
</div>
