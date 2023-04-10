<script lang="ts">
  import { onMount } from 'svelte';
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import ErrorDisplay from '../components/global/ErrorDisplay.svelte';
  import { allVoices, userSubscriptionInfo } from '../store/user';
  import { LocalStorageKeys, readFromLocalStorage, saveToLocalStorage } from '$lib/utils/storage';
  import { paragraphs, speeches } from '../store/speeches';
  import type { ISpeech } from '../types/custom';

  let isDarkMode = false;

  onMount(() => {
    const loadedSubscriptionInfo = readFromLocalStorage(LocalStorageKeys.SubscriptionInfo);
    const loadedVoices = readFromLocalStorage(LocalStorageKeys.Voices);
    const loadedParagraphs = readFromLocalStorage(LocalStorageKeys.Paragraphs);

    userSubscriptionInfo.set(loadedSubscriptionInfo);
    allVoices.set(loadedVoices);
    paragraphs.set(loadedParagraphs);

    userSubscriptionInfo.subscribe((newSubInfo) => {
      saveToLocalStorage(LocalStorageKeys.SubscriptionInfo, newSubInfo);
    });
    allVoices.subscribe((newVoicesArr) => {
      saveToLocalStorage(LocalStorageKeys.Voices, newVoicesArr);
    });

    paragraphs.subscribe((newParagraphs) => {
      saveToLocalStorage(LocalStorageKeys.Paragraphs, newParagraphs);
      speeches.set(
        $paragraphs.reduce(
          (accumulatedSpeeches, currentPara) => [...accumulatedSpeeches, ...currentPara.speeches],
          [] as ISpeech[]
        )
      );
    });
  });

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
  }
</script>

<svelte:head>
  <!-- SMUI Styles -->
  <link rel="stylesheet" href={isDarkMode ? '/smui-dark.css' : '/smui.css'} />
  <!-- Fonts -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />

  <!-- Material Typography -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/@material/typography@14.0.0/dist/mdc.typography.css"
  />
</svelte:head>

<div class="app">
  <TopAppBar variant="static">
    <Row>
      <Section>
        <Title>Audilogue</Title>
      </Section>
      <Section align="end" toolbar>
        {#if isDarkMode}
          <Wrapper>
            <IconButton class="material-icons" aria-label="Light mode" on:click={toggleDarkMode}>
              light_mode
            </IconButton>
            <Tooltip xPos="start">Change to light mode</Tooltip>
          </Wrapper>
        {:else}
          <Wrapper>
            <IconButton class="material-icons" aria-label="Dark mode" on:click={toggleDarkMode}>
              dark_mode
            </IconButton>
            <Tooltip xPos="start">Change to dark mode</Tooltip>
          </Wrapper>
        {/if}
      </Section>
    </Row>
  </TopAppBar>
  <main>
    <slot />
  </main>
  <ErrorDisplay />
  <footer />
</div>
