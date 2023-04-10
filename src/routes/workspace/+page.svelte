<script lang="ts">
  import Drawer, { AppContent, Content, Header, Title } from '@smui/drawer';
  import Card from '@smui/card';
  import Button, { Label, Icon } from '@smui/button';
  import TextEditor from '../../components/pageComponents/workspace/TextEditor.svelte';
  import TextSelection from '../../components/pageComponents/workspace/TextSelection.svelte';
  import { currentSpeechText, paragraphs, selectedSpeeches, speeches } from '../../store/speeches';
  import SpeechGeneration from '../../components/pageComponents/SpeechGeneration.svelte';
  import VoiceSelection from '../../components/pageComponents/VoiceSelection.svelte';
  import PlayAll from '../../components/pageComponents/workspace/PlayAll.svelte';
  import DownloadAll from '../../components/pageComponents/workspace/DownloadAll.svelte';
  import Usage from '../../components/pageComponents/Usage.svelte';
  import { goto } from '$app/navigation';
  import { eApi } from '../../store/user';
  import { PAGE_URLS } from '../../types/enums';
  import { onMount } from 'svelte';
  import ImportExport from '../../components/pageComponents/workspace/ImportExport.svelte';

  onMount(() => {
    if (!$eApi) {
      goto(PAGE_URLS.LOGIN);
    }
  });

  let showTips = false;
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
        <Title>{$currentSpeechText}</Title>
        <span>({$currentSpeechText.length} characters)</span>
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
      {#if $paragraphs.length > 0}
        <div class="mdc-typography--body1" style="display: flex; gap: 10px; align-items: center;">
          <Button on:click={() => (showTips = !showTips)} variant="outlined">
            <Icon class="material-icons">tips_and_updates</Icon>
            <Label>Tips</Label>
          </Button>
          {#if showTips}
            <div>
              <ul>
                <li>Hold Ctrl/Cmd and click to select multiple lines</li>
                <li>You can change the color for voices, by clicking on them in the legend.</li>
              </ul>
            </div>
          {/if}
        </div>
        <div class="custom-divider" />
        <TextSelection />
        <div class="custom-divider" />
        {#if $speeches.some(sp => sp.generationHistory.length > 0)}
          <PlayAll />
          <br />
          <DownloadAll />
          <div class="custom-divider" />
        {/if}
      {/if}
      <ImportExport />
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
