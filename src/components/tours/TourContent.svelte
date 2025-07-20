<script lang="ts">
  import type { Tour } from '$lib/types/tour';

  export let tour: Tour;
</script>

<!-- Long Description -->
{#if tour.longDescription}
  <div class="prose prose-lg max-w-none mb-12">
    <p>{tour.longDescription}</p>
  </div>
{:else}
  <div class="prose prose-lg max-w-none mb-12">
    <p>{tour.description}</p>
  </div>
{/if}
