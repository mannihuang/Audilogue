<script lang="ts">
  import { userSubscriptionInfo } from '../../store/user';
  const WARNING_PERCENTAGE_THRESHOLD = 0.2;

  $: charactersRemaining =
    $userSubscriptionInfo?.character_limit - $userSubscriptionInfo?.character_count;

  $: percentageLeft = charactersRemaining / $userSubscriptionInfo?.character_limit;

  $: containerStyling = `
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    border: solid 2px ${percentageLeft < WARNING_PERCENTAGE_THRESHOLD ? 'red' : 'black'};
    color: ${percentageLeft < WARNING_PERCENTAGE_THRESHOLD ? 'red' : 'black'};
    `;
</script>

{#if !!$userSubscriptionInfo}
  <div class="mdc-typography--body1" style={containerStyling}>
    Characters remaining: {charactersRemaining} / {$userSubscriptionInfo.character_limit}
  </div>
  <br/>
{/if}
