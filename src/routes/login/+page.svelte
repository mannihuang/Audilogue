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

  let isFetching = false;

  async function handleSubmit() {
    eApi.set(ElevenLabsApi($elevenlabsApiKey));
    try {
      isFetching = true;
      const fetchedUserInfo = await $eApi.getUserInfoAsync();
      const fetchedVoices = await $eApi.getVoicesAsync();
      userSubscriptionInfo.set(fetchedUserInfo.subscription);
      allVoices.set(fetchedVoices.map((fvc) => ({ ...fvc, color: generateRandomHex() })));
      goto('/workspace');
    } catch (getVoicesError) {
      setError(getVoicesError);
    } finally {
      isFetching = false;
    }
  }
</script>

<div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 50px">
  <div class="mdc-typography--headline3">Audiologue</div>
  <Card padded style="width: 500px;">
    <Content>
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={$elevenlabsApiKey}
        label="Your ElevenLabs API key"
      />
    </Content>
    <Actions>
      <Button on:click={handleSubmit} variant="unelevated">
        {#if isFetching}
          Loading...
        {:else}
          Submit
        {/if}
      </Button>
    </Actions>
  </Card>
</div>
