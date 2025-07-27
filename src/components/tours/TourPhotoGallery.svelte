<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Section from '../common/Section.svelte';

  export let tour: Tour;
  export let onImageClick: (index: number) => void;
</script>

<!-- Photo Gallery -->
{#if tour.images.gallery && tour.images.gallery.length > 0}
  <Section
    title={$t('tour_detail.photo_gallery')}
    subtitle={$t('tour_detail.gallery_subtitle')}
    background="white"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-16">
      {#each tour.images.gallery as image, index}
        <div
          class="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <img
            src={image}
            alt={`${tour.title} - Image ${index + 1}`}
            class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
            on:click={() => onImageClick(index + 1)}
          />
        </div>
      {/each}
    </div>
  </Section>
{/if}
