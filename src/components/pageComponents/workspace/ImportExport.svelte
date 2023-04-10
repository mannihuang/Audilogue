<script lang="ts">
  import Button from '@smui/button/src/Button.svelte';
  import { allVoices } from '../../../store/user';
  import { paragraphs } from '../../../store/speeches';
  import { readFileAsTextAsync } from '$lib/utils/file';

  function downloadAllData() {
    const allDataJson = {
      allVoices: $allVoices,
      paragraphs: $paragraphs
    };

    console.log({ allDataJson });

    const blob = new Blob([JSON.stringify(allDataJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'audilogue_data.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
  }

  function handleClickImport() {
    const input = document.getElementById('file-input');
    input?.click();

    input.addEventListener('change', function () {
      readFileAsTextAsync(this.files[0]).then(redFileResponse => {
        console.log({ redFileResponse })
        const importedDataJSON = JSON.parse(redFileResponse);
        console.log({ importedDataJSON });
        
        // allVoices.set(importedDataJSON?.allVoices);
        paragraphs.set(importedDataJSON?.paragraphs);
      })
    });
  }
</script>

<div>
  <input type="file" id="file-input" style="display:none" accept="application/JSON"/>
  <Button variant="outlined" on:click={handleClickImport}>Import Data</Button>
  &nbsp;&nbsp;
  <Button variant="unelevated" on:click={downloadAllData}>Export Data</Button>
</div>
