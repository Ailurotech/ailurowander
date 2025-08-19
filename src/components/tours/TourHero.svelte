<script lang="ts">
  import type { Tour } from '$lib/types/tour';
  import ChineseIcon from '../atoms/ChineseIcon.svelte';

  export let tour: Tour;
  export let onImageClick: () => void;

  // Determine which icon to use based on tour name/location
  const getIconForTour = (title: string) => {
    if (title.toLowerCase().includes('beijing') || title.toLowerCase().includes('great wall'))
      return { icon: 'great-wall' as const, color: '#B91C1C' };
    if (title.toLowerCase().includes('xian') || title.toLowerCase().includes('terracotta'))
      return { icon: 'terracotta' as const, color: '#B45309' };
    if (title.toLowerCase().includes('shanghai'))
      return { icon: 'forbidden-city' as const, color: '#0F766E' };
    if (title.toLowerCase().includes('yangtze'))
      return { icon: 'mountains' as const, color: '#0F766E' };
    if (title.toLowerCase().includes('chengdu') || title.toLowerCase().includes('panda'))
      return { icon: 'panda' as const, color: '#B45309' };

    // Default icon
    return { icon: 'temple' as const, color: '#B91C1C' };
  };

  const iconData = getIconForTour(tour.title);
</script>

<!-- Hero Section with Main Image -->
<div class="relative min-h-[60vh]">
  <div class="absolute inset-0 bg-black/30 z-10"></div>
  <img
    src={tour.images.main}
    alt={tour.title}
    class="absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
    on:click={onImageClick}
  />
  <div
    class="relative z-20 container mx-auto px-4 flex flex-col justify-center items-center h-[60vh] text-white text-center"
  >
    <div class="inline-flex items-center mb-4">
      <ChineseIcon icon={iconData.icon} color="white" size="lg" />
      <span class="ml-2 text-lg font-medium">{tour.destination}</span>
    </div>
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">{tour.title}</h1>
    <p class="text-xl max-w-2xl mb-8">{tour.subtitle || tour.description}</p>
    <div class="flex flex-wrap gap-4 items-center justify-center">
      <div class="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
        <span class="mr-2">⏱️</span>
        <span>{tour.duration.days} days, {tour.duration.nights} nights</span>
      </div>
      {#if tour.featured}
        <div class="flex items-center bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2">
          <span class="mr-2">⭐</span>
          <span>Featured Tour</span>
        </div>
      {/if}
    </div>
  </div>
</div>
