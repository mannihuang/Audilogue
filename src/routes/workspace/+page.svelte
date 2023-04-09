<script lang="ts">
  import Drawer, { AppContent, Content, Header, Title } from '@smui/drawer';
  import TextEditor from '../../components/pageComponents/workspace/TextEditor.svelte';
  import TextSelection from '../../components/pageComponents/workspace/TextSelection.svelte';
  import { currentSpeech, selectedSpeeches } from '../../store/speeches';
  import SpeechGeneration from '../../components/pageComponents/SpeechGeneration.svelte';
  import VoiceSelection from '../../components/pageComponents/VoiceSelection.svelte';

</script>

<div>
  <Drawer variant="dismissible" open={$selectedSpeeches.length > 0} style="width: 300px">
    <VoiceSelection></VoiceSelection>
    {#if $selectedSpeeches.length == 1}
      <Header>
        <Title>{$currentSpeech.text}</Title>
      </Header>
      <Content>
        <SpeechGeneration></SpeechGeneration>
      </Content>
    {/if}
  </Drawer>

  <AppContent class="app-content">
    <TextEditor></TextEditor>
    <TextSelection></TextSelection>
  </AppContent>
</div>

<style>
  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
    padding: 50px;
    padding-left: 90px;
  }
</style>
