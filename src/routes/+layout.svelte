<script>
  import { onMount } from 'svelte';
  import ErrorDisplay from '../components/global/ErrorDisplay.svelte';
  import { allVoices, userSubscriptionInfo } from '../store/user';
  import { LocalStorageKeys, readFromLocalStorage, saveToLocalStorage } from '$lib/utils/storage';

  onMount(() => {
    const loadedSubscriptionInfo = readFromLocalStorage(LocalStorageKeys.SubscriptionInfo);
    const loadedVoices = readFromLocalStorage(LocalStorageKeys.Voices);

    userSubscriptionInfo.set(loadedSubscriptionInfo);
    allVoices.set(loadedVoices);

    userSubscriptionInfo.subscribe((newSubInfo) => {
      saveToLocalStorage(LocalStorageKeys.SubscriptionInfo, newSubInfo);
    });
    allVoices.subscribe((newVoicesArr) => {
      saveToLocalStorage(LocalStorageKeys.Voices, newVoicesArr);
    });
  });
</script>

<div class="app">
  <main>
    <slot />
  </main>
  <ErrorDisplay />
  <footer />
</div>
