<script lang="ts">
  import { goto } from '$app/navigation';
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  // import CircularProgress from '@smui/circular-progress';
  import Card, { Content, PrimaryAction, Actions, ActionButtons, ActionIcons } from '@smui/card';
  import { ElevenLabsApi } from '$lib/utils/api';
  import { setError } from '../../store/error';
  import { elevenlabsApiKey, allVoices, userSubscriptionInfo, eApi } from '../../store/user';
  import { generateRandomHex } from '$lib/utils/random';
  import Instructions from '../../components/pageComponents/login/Instructions.svelte';
  import Disclaimer from '../../components/pageComponents/login/Disclaimer.svelte';

  let isFetching = false;

  async function handleSubmit() {
    eApi.set(ElevenLabsApi($elevenlabsApiKey));
    try {
      isFetching = true;
      const fetchedUserInfo = await $eApi.getUserInfoAsync();
      const fetchedVoices = await $eApi.getVoicesAsync();
      userSubscriptionInfo.set(fetchedUserInfo.subscription);
      allVoices.set(
        fetchedVoices.map((fvc) => {
          const voiceLocal = $allVoices.find((vc) => vc.voice_id == fvc.voice_id);
          return {
            ...fvc,
            color: voiceLocal?.color || generateRandomHex(),
          };
        })
      );
      goto('/workspace');
    } catch (getVoicesError) {
      setError(getVoicesError);
    } finally {
      isFetching = false;
    }
  }
</script>

<div
  style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 100px;"
>
  <Card padded style="width: 700px;">
    <div class="mdc-typography--headline3" style="text-align: center;">Audilogue</div>
    <Content>
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={$elevenlabsApiKey}
        label="Your ElevenLabs API key"
        variant="filled"
      />
    </Content>
    <Actions style="padding-left: 15px">
      <Button on:click={handleSubmit} variant="unelevated">
        {#if isFetching}
          Loading...
        {:else}
          Submit
        {/if}
      </Button>
    </Actions>
    <div
      class="mdc-typography--body1"
      style="display: flex; flex-direction: column; align-items: center; padding: 20px;"
    >
      <Instructions />
      <div style="width: 100%">
        <span style="text-decoration: underline;"> Notes and disclaimers </span>
        <br />
        <Disclaimer />
      </div>
    </div>
  </Card>
</div>
