<script lang="ts">
  import Drawer, { AppContent, Content, Header, Title } from '@smui/drawer';
  import Card from '@smui/card';
  import IconButton from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import TextEditor from '../../components/pageComponents/workspace/TextEditor.svelte';
  import TextSelection from '../../components/pageComponents/workspace/TextSelection.svelte';
  import { currentSpeech, selectedSpeeches } from '../../store/speeches';
  import SpeechGeneration from '../../components/pageComponents/SpeechGeneration.svelte';
  import VoiceSelection from '../../components/pageComponents/VoiceSelection.svelte';
  import PlayAll from '../../components/pageComponents/workspace/PlayAll.svelte';
  import DownloadAll from '../../components/pageComponents/workspace/DownloadAll.svelte';
  import Usage from '../../components/pageComponents/Usage.svelte';
</script>

<div>
  <Drawer
    variant="dismissible"
    open={$selectedSpeeches.length > 0}
    style="width: 350px; padding: 15px;"
  >
    <Usage />
    <VoiceSelection />
    {#if $selectedSpeeches.length == 1}
      <Header style="text-align: center;">
        <Title>{$currentSpeech.text}</Title>
      </Header>
      <Content>
        <SpeechGeneration />
      </Content>
    {/if}
  </Drawer>

  <AppContent class="app-content">
    <Card style="padding: 20px">
      <TextEditor />
    </Card>
    <br />
    <Card style="padding: 20px">
      <div class="mdc-typography--body1">
        <Wrapper>
          <IconButton class="material-icons" title="Tip">tips_and_updates</IconButton>
          <Tooltip xPos="end" yPos="above">
            Hold Ctrl/Cmd and click to select multiple lines
          </Tooltip>
        </Wrapper>
      </div>
      <TextSelection />
      <div class="custom-divider" />
      <PlayAll />
      <br />
      <DownloadAll />
    </Card>
  </AppContent>
</div>

<style>
  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
    padding: 50px;
    padding-left: 140px;
  }

  .custom-divider {
    height: 1px;
    width: 100%;
    border-bottom: solid 1px grey;
    margin: 15px 0;
  }
</style>
