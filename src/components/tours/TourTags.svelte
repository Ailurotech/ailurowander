<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Badge from '../atoms/Badge.svelte';

  export let tour: Tour;
</script>

<!-- Tags -->
{#if tour.tags && tour.tags.length > 0}
  <div class="mb-16">
    <h3 class="text-xl font-bold mb-4">{$t('tour_detail.topics')}</h3>
    <div class="flex flex-wrap gap-2">
      {#each tour.tags as tag}
        <Badge variant="accent">{tag}</Badge>
      {/each}
    </div>
  </div>
{/if}
