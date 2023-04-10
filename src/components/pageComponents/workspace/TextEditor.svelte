<script lang="ts">
  import Button from '@smui/button/src/Button.svelte';
  import Textfield from '@smui/textfield';
  import { paragraphs, speeches } from '../../../store/speeches';
	import { v4 as uuidv4 } from "uuid";

  let inputText = '"What should I type?" asked Susan, eyeing the empty text field.\n"Your own story," replied John.\n"Got it. Thanks," Susan said.\n"No problem. Remember, this is just some sample text," John advised.\nWith that, Susan began to type, letting her own ideas and voice take over.';

	function isAQuote(text: string) {
		return /"([^"]+)"/g.test(text);
	}

  function handleClickParse() {
    const rawParagraphs = inputText.split("\n");
    paragraphs.set(rawParagraphs.map(rawPg => {
      const paraSpeeches = rawPg.replaceAll('\u201C','"').replaceAll('\u201D','"').split(/("(?:[^"]|"")*")/);
      return {
        id: uuidv4(),
        speeches: paraSpeeches.map(pgsp => {
          return {
            id: uuidv4(),
            text: pgsp,
            isInSpeechMarks: isAQuote(pgsp),
            generationHistory: [],
          }
        }),
      }
    }))
  }
</script>

<div style="display: flex; flex-direction: column; gap: 10px;">
  <Textfield textarea bind:value={inputText} label="Story text" style="width: 100%" input$rows={8}/>
  <div style="display: flex; align-items: center">
    <Button on:click={handleClickParse} variant="unelevated" style="width: 100px">Parse</Button>
    {#if $speeches.some(sp => !!sp.voiceId)}
      &nbsp; &nbsp;
      <span class="mdc-typography--body1" style="color: red">Warning: Click "parse" again will erase your current work</span>
    {/if}
  </div>
</div>
