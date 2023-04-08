<script lang="ts">
  import Select, { Option } from '@smui/select';
  import { allVoices } from '../../store/user';
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

<div class="columns margins" style="justify-content: flex-start;">
  <div>
    <Select value={currentVoiceId} label="Select voice">
      {#each $allVoices as voice}
        <Option value={voice.voice_id} on:click={() => handleVoiceSelect(voice.voice_id)}>
          {voice.name}
        </Option>
      {/each}
    </Select>
  </div>
</div>
