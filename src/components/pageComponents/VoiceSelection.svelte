<script lang="ts">
  import Select, { Option } from '@smui/select';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import { voiceChoices, showSampleVoices, showUserClonedVoices } from '../../store/user';
  import { currentSpeech, selectedSpeeches, updateSpeechData } from '../../store/speeches';
  import { onDestroy } from 'svelte';

  let currentVoiceId: string | undefined = '';
  const unsubscribeFromCurrentSpeech = currentSpeech.subscribe((newCurrentSpeech) => {
    currentVoiceId = newCurrentSpeech?.voiceId;
  });

  onDestroy(() => {
    unsubscribeFromCurrentSpeech();
  });

  function handleVoiceSelect(voiceId: string) {
    for (const ssp of $selectedSpeeches) {
      updateSpeechData(ssp.id, { voiceId });
    }
  }
</script>

<div style="display: flex; flex-direction: column; justify-content: center; padding: 15px">
  <FormField>
    <Checkbox bind:checked={$showSampleVoices} />
    <span slot="label">Show sample voices</span>
  </FormField>
  <FormField>
    <Checkbox bind:checked={$showUserClonedVoices} />
    <span slot="label">Show my cloned voices</span>
  </FormField>
  <div>
    <ul>
      {#each $voiceChoices as vc}
        <li style="display: flex; align-items: center">
          <div
            style={`background-color: ${vc.color}; width: 15px; height: 15px; cursor: pointer;`}
          />
          &nbsp;
          <span class="mdc-typography--body1">{vc.name}</span>
        </li>
      {/each}
    </ul>
  </div>
  <Select value={currentVoiceId} label="Select voice">
    {#each $voiceChoices as voice}
      <Option value={voice.voice_id} on:click={() => handleVoiceSelect(voice.voice_id)}>
        {voice.name}
      </Option>
    {/each}
  </Select>
</div>

<style lang="scss">
  ul {
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;

    li {
      list-style-type: none;
    }
  }
</style>
