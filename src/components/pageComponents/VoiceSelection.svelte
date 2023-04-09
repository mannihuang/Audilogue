<script lang="ts">
  import Select, { Option } from '@smui/select';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Menu from '@smui/menu';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import { voiceChoices, showSampleVoices, showUserClonedVoices, updateVoice } from '../../store/user';
  import { currentSpeech, selectedSpeeches, updateSpeechData } from '../../store/speeches';
  import { onDestroy } from 'svelte';
  import { Color, ColorInput } from 'color-picker-svelte'
  import type { IVoice } from '../../types/custom';

  let colorPickerStartingColor = "#FBFBFB";
  let colorPickerColor = new Color('#ff3d91')
  let colorPickerMenu: Menu;
  let colorPickerMenuAnchor: HTMLDivElement;
  let colorPickerMenuMarginTop = 100;
  let voiceBeingChanged: IVoice;

  $: {
    if(!!voiceBeingChanged) {
      updateVoice(voiceBeingChanged.voice_id, { color: colorPickerColor.toHexString() });
    }
  }

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
  
  function handleClickOnVoiceColor(event: MouseEvent, voice: IVoice) {
    colorPickerMenuMarginTop = event.clientY - 50;
    // colorPickerStartingColor = voice.color;
    colorPickerColor = new Color(voice.color);
    voiceBeingChanged = voice;
    console.log({ colorPickerStartingColor });
    colorPickerMenu.setOpen(true);
  }
</script>

<div style="display: flex; flex-direction: column; justify-content: center;">
  <FormField>
    <Checkbox bind:checked={$showSampleVoices} />
    <span slot="label">Show sample voices</span>
  </FormField>
  <FormField>
    <Checkbox bind:checked={$showUserClonedVoices} />
    <span slot="label">Show my cloned voices</span>
  </FormField>
  <div style="min-width: 100px;">
    <ul>
      {#each $voiceChoices as vc}
        <li style="display: flex; align-items: center">
          <Wrapper>
            <div
              on:click={(event) => handleClickOnVoiceColor(event, vc)}
              style="cursor: pointer; display: flex; align-items: center;"
            >
              <div style={`background-color: ${vc.color}; width: 15px; height: 15px;`} />
              &nbsp;
              <span class="mdc-typography--body1">{vc.name}</span>
            </div>

            <Tooltip xPos="end" yPos="above">
              Click to change color
            </Tooltip>
          </Wrapper>
          <Menu
            bind:this={colorPickerMenu}
            anchor={false}
            style={`padding: 20px; margin-top: ${colorPickerMenuMarginTop}px; height: 300px`}
          >
            <ColorInput bind:color={colorPickerColor} title="Color"/>
          </Menu>
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
