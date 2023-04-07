<script lang="ts">
  import Snackbar, { Label, Actions } from '@smui/snackbar';
  import IconButton from '@smui/icon-button';
  import { globalError } from '../../store/error';

  let errorSnackbar: Snackbar;
  globalError.subscribe(updatedError => {
    errorSnackbar?.open();
  })
</script>

<Snackbar bind:this={errorSnackbar}>
  <Label>{$globalError.errorMessage}</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
</style>