<script>
  import { eApi } from '../store/user';
  import { goto } from '$app/navigation';
  import { PAGE_URLS } from '../types/enums';
  import { onMount } from 'svelte';
  onMount(() => {
    if (!$eApi) {
      goto(PAGE_URLS.LOGIN);
    } else {
      goto(PAGE_URLS.WORKSPACE);
    }
  });
</script>

<div class="mdc-typography--body1">Redirecting...</div>
