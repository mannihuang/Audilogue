<script lang="ts">
  import Slider from '@smui/slider';
  import FormField from '@smui/form-field';
  import Textfield from '@smui/textfield';
  import Select, { Option } from '@smui/select';
  import Button from '@smui/button/src/Button.svelte';
  import { allVoices, eApi, userSubscriptionInfo } from '../../store/user';
  import { setError } from '../../store/error';
  import { appendToGenerationHistory, currentSpeech, currentSpeechText, updateSpeechData } from '../../store/speeches';
  import { getAudioUri, setAndPlayAudio } from '$lib/utils/audio';
  const DEFAULT_STABIILTY = 0;
  const DEFAULT_SIMILARITY_BOOST = 0;

  let stabilityValue = 0;
  let similarityBoostValue = 0;

  currentSpeech.subscribe(speechUpdated => {
    stabilityValue = Math.round(($allVoices.find(vc => vc.voice_id == speechUpdated.voiceId)?.settings.stability || DEFAULT_STABIILTY) * 100);
    similarityBoostValue = Math.round(($allVoices.find(vc => vc.voice_id == speechUpdated.voiceId)?.settings.similarity_boost || DEFAULT_SIMILARITY_BOOST) * 100);
  })

  async function handleClickGenerate() {
    console.log('Clicked generate...');
    try {
      const rawAudioData = await $eApi.textToSpeechAsync(
        $currentSpeech.voiceId || '',
        $currentSpeechText,
        {
          stability: stabilityValue / 100,
          similarity_boost: similarityBoostValue / 100
        }
      );
      console.log({ rawAudioData });
      const audioUri = getAudioUri(rawAudioData);
      console.log({ audioUri });
      setAndPlayAudio("#genPlayer", audioUri);
      appendToGenerationHistory($currentSpeech.id, audioUri);
      // Get user info again to update characters remaining
      const fetchedUserInfo = await $eApi.getUserInfoAsync();
      userSubscriptionInfo.set(fetchedUserInfo.subscription);
    } catch (generateAudioError) {
      console.error({ generateAudioError });
      setError(generateAudioError);
    }
  }

  function handleGenerationSelection(generationdId: string) {
    const foundGen = $currentSpeech.generationHistory.find(gn => gn.id == generationdId);
    setAndPlayAudio("#genPlayer", foundGen!.audioUri);
    updateSpeechData($currentSpeech.id, {
      voiceId: foundGen?.voiceId,
    })
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

  <Button
    on:click={handleClickGenerate}
    variant="unelevated"
    style="border-radius: 50px"
    disabled={!$currentSpeech.voiceId}
  >
    Generate
  </Button>

  <audio id="genPlayer" controls style="align-self: center" />

  {#if $currentSpeech.generationHistory.length > 0}  
    {#key $currentSpeech.id}
      <Select value={$currentSpeech.currentGeneration?.id} label="Select generation">
        {#each $currentSpeech.generationHistory as gen}
          <Option value={gen.id} on:click={() => handleGenerationSelection(gen.id)}>
            {gen.id}
          </Option>
        {/each}
      </Select>
    {/key}    
  {/if}
</div>
