<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Section from '../common/Section.svelte';

  export let tour: Tour;
  export let onImageClick: (index: number) => void;

  // Build a combined, flat list of all tour-related images
  $: allImages = (() => {
    const images: string[] = [];
    if (tour?.images?.main) images.push(tour.images.main);
    if (Array.isArray(tour?.images?.gallery)) images.push(...tour.images.gallery);
    if (Array.isArray(tour?.itinerary)) {
      for (const day of tour.itinerary) {
        if (day?.image) images.push(day.image);
        if (day?.accommodation?.images && Array.isArray(day.accommodation.images)) {
          images.push(...day.accommodation.images.filter(Boolean) as string[]);
        }
        if (Array.isArray(day?.meals)) {
          for (const meal of day.meals) {
            if (Array.isArray(meal?.images)) images.push(...(meal.images.filter(Boolean) as string[]));
          }
        }
      }
    }
    return images.filter(Boolean);
  })();
</script>

<!-- Photo Gallery -->
{#if allImages && allImages.length > 0}
  <Section
    title={$t('tour_detail.photo_gallery')}
    subtitle={$t('tour_detail.gallery_subtitle')}
    background="white"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-16">
      {#each allImages as image, index}
        <button
          type="button"
          class="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          on:click={() => onImageClick(index)}
        >
          <img
            src={image}
            alt={`${tour.title} - Image ${index + 1}`}
            class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </button>
      {/each}
    </div>
  </Section>
{/if}
