<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  
  export let tour: Tour;
</script>

<!-- Highlights -->
<div class="mb-12">
  <h2 class="text-2xl font-bold mb-6">{$t('tour_detail.highlights')}</h2>
  {#if tour.highlights && tour.highlights.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each tour.highlights as highlight}
        <div class="flex items-start">
          <div class="text-primary mr-3 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p>{highlight}</p>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-gray-600">Highlights information will be available soon.</p>
  {/if}
</div> 