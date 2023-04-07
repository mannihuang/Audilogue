<script lang="ts">
  import { paragraphs } from "../../../store/speeches";
    
</script>

<div>
    {#each $paragraphs as pg, index}
        <p>
            {#each pg.speeches as pgsp, i}
                <span>{pgsp.text}</span>
            {/each}
        </p>
    {/each}
</div>