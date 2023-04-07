<script lang="ts">
  import Button from '@smui/button/src/Button.svelte';
  import Textfield from '@smui/textfield';

  let inputText = '';
</script>

<div class="margins">
  <Textfield textarea bind:value={inputText} label="Story text" style="width: 100%" />
  <Button variant="unelevated">Parse</Button>
</div>
