<script lang="ts">
  import Textfield from '@smui/textfield';

  let apiKey = '';
</script>

<div class="margins">
  <Textfield
    style="width: 100%;"
    helperLine$style="width: 100%;"
    bind:value={apiKey}
    label="Your ElevenLabs API key"
  />
</div>
