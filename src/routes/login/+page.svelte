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
      allVoices.set(
        fetchedVoices.map((fvc) => {
          const voiceLocal = $allVoices.find(vc => vc.voice_id == fvc.voice_id);
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
      <ol style="margin: 0; padding: 20px 30px">
        <li>Make sure you have an ElevenLabs account</li>
        <li>Desired voices should already be cloned or generated in ElevenLabs</li>
        <li>
          Copy your API key by going to "Profile" and unhiding it:
          <ol style="list-style-type: lower-alpha">
            <li>
              <img src="./api_key1.png" width="500" />
            </li>
            <br />
            <li>
              <img src="./api_key2.png" width="500" />
            </li>
          </ol>
        </li>
        <li>Paste your API key in the input area above.</li>
      </ol>
      <div style="width: 100%">
        <span style="text-decoration: underline;"> Notes and disclaimers </span>
        <br />
        <ul>
          <li>
            Source code for this project is available
            <a href="https://github.com/mannihuang/Audilogue">here</a>.
          </li>
          <li>
            Using your own API key, means that each audio generation will consume characters from
            your account usage.
          </li>
          <li>
            Audilogue is a tool for simplifying the repeitive nature of generating audio with
            ElevenLabs. We are not responsible for your audio generations and what you may choose to
            use such audio for.
          </li>
        </ul>
      </div>
    </div>
  </Card>
</div>
