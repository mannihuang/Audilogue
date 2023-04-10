<script lang="ts">
  import Button from '@smui/button/src/Button.svelte';
  import JSZip from 'jszip';
  import { speeches } from '../../../store/speeches';
  import { allVoices } from '../../../store/user';
  import { trimText } from '$lib/utils/text';

  async function downloadAll() {
    const zip = new JSZip();
    let counter = 1;
    for (const speech of $speeches) {
      if (!speech.currentGeneration) {
        continue;
      }
      const speechSelectedGen = speech.generationHistory.find(
        (gen) => gen.id == speech.currentGeneration?.id
      );
      console.log({ speechSelectedGen });
      const blob = await (await fetch(speechSelectedGen!.audioUri)).blob();
      console.log({ blob });
      const textFileNameBit = trimText(speech.text);
      const voiceName = $allVoices.find((vc) => vc.voice_id == speech.voiceId)?.name;
      zip.file(`${counter}. ${voiceName} - ${textFileNameBit}.mp3`, blob, { base64: true });
      counter++;
    }

    const zipFolderData = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipFolderData);
    link.download = 'audilogue_project';
    link.click();
  }
</script>

<div>
  <Button variant="unelevated" on:click={downloadAll}>Download all</Button>
</div>
