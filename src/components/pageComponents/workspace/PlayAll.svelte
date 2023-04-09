<script lang="ts">
  import Button from '@smui/button/src/Button.svelte';

  let audioUri = '';
</script>

<div style="display: flex; align-items: center; gap: 15px;">
  <Button variant="unelevated">Play all</Button>
  <audio src={audioUri} controls />
</div>
