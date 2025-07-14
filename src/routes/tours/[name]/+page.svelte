<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Section from '../../../components/common/Section.svelte';
  import Divider from '../../../components/atoms/Divider.svelte';
  import Badge from '../../../components/atoms/Badge.svelte';
  import Button from '../../../components/atoms/Button.svelte';
  import ChineseIcon from '../../../components/atoms/ChineseIcon.svelte';
  import PhotoGalleryPopup from '../../../components/atoms/PhotoGalleryPopup.svelte';
  
  // Data loaded from +page.ts
  export let data: {
    tour: Tour;
  };
  
  const { tour } = data;
  
  // Photo gallery popup state
  let isGalleryOpen = false;
  let galleryImages: string[] = [];
  let currentGalleryIndex = 0;
  
  // Open gallery popup
  function openGallery(index: number) {
    currentGalleryIndex = index;
    galleryImages = [tour.images.main, ...(tour.images.gallery || [])];
    isGalleryOpen = true;
  }
  
  // Close gallery popup
  function closeGallery() {
    isGalleryOpen = false;
  }
  
  // Format price with currency
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(price);
  };
  
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

<svelte:head>
  <title>{tour.title} | {$t('site.title')}</title>
  <meta name="description" content={tour.description} />
</svelte:head>

<!-- Hero Section with Main Image -->
<div class="relative min-h-[60vh]">
  <div class="absolute inset-0 bg-black/30 z-10"></div>
  <img 
    src={tour.images.main} 
    alt={tour.title} 
    class="absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
    on:click={() => openGallery(0)}
  />
  <div class="relative z-20 container mx-auto px-4 flex flex-col justify-center items-center h-[60vh] text-white text-center">
    <div class="inline-flex items-center mb-4">
      <ChineseIcon icon={iconData.icon} color="white" size="lg" />
      <span class="ml-2 text-lg font-medium">{tour.destination}</span>
    </div>
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">{tour.title}</h1>
    <p class="text-xl max-w-2xl mb-8">{tour.description}</p>
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

<!-- Tour Information -->
<div class="container mx-auto px-4 py-12">
  <!-- Booking Summary Card -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
    <div class="lg:col-span-2">
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
    </div>
    
    <!-- Booking Card -->
    <div class="card bg-white shadow-xl p-6 border border-gray-100 h-min sticky top-8">
      <h3 class="text-2xl font-bold mb-4">{$t('tour_detail.book_tour')}</h3>
      <div class="chinese-divider"></div>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600">{$t('tour_detail.starting_from')}</span>
          <span class="text-2xl font-bold text-primary">{formatPrice(tour.price.amount, tour.price.currency)}</span>
        </div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600">{$t('tour_detail.duration')}</span>
          <span>{tour.duration.days} {$t('tours.days')}, {tour.duration.nights} {$t('tours.nights')}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">{$t('tour_detail.group_size')}</span>
          <span>{$t('tours.up_to')} 15 {$t('tours.people')}</span>
        </div>
      </div>
      
      <div class="flex flex-col gap-4">
        <Button variant="primary" fullWidth={true}>{$t('tours.book_now')}</Button>
        <Button variant="outline" fullWidth={true}>{$t('tour_detail.request_private')}</Button>
      </div>
      
      <div class="mt-6 text-sm text-gray-500">
        <p class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {$t('tour_detail.free_cancellation')}
        </p>
        <p class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {$t('tour_detail.customer_support')}
        </p>
      </div>
    </div>
  </div>
  
  <!-- Itinerary -->
  <Section title={$t('tour_detail.itinerary')} subtitle={$t('tour_detail.itinerary_subtitle')} background="white">
    <div class="space-y-8 mb-16">
      {#each tour.itinerary || [] as day, index}
        <div class="relative pl-8 border-l-2 border-primary pb-8 {index === tour.itinerary.length - 1 ? 'border-transparent' : ''}">
          <div class="absolute -left-4 top-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {day.day}
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 class="text-xl font-bold mb-2">{day.title}</h3>
            <p class="mb-4">{day.description}</p>
            
            {#if day.accommodation}
              <div class="flex items-center text-sm text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{$t('tour_detail.accommodation')}: {day.accommodation}</span>
              </div>
            {/if}
            
            {#if day.meals && day.meals.length > 0}
              <div class="flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{$t('tour_detail.meals')}: {day.meals.join(', ')}</span>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </Section>
  
  <!-- Inclusions and Exclusions -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
    <!-- Inclusions -->
    <div class="bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h3 class="text-2xl font-bold mb-6 flex items-center">
        <span class="text-green-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        {$t('tour_detail.included')}
      </h3>
      <ul class="space-y-3">
        {#each tour.inclusions || [] as item}
          <li class="flex items-start">
            <span class="text-green-500 mr-3 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Exclusions -->
    <div class="bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h3 class="text-2xl font-bold mb-6 flex items-center">
        <span class="text-red-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        {$t('tour_detail.not_included')}
      </h3>
      <ul class="space-y-3">
        {#each tour.exclusions || [] as item}
          <li class="flex items-start">
            <span class="text-red-500 mr-3 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  
  <!-- Photo Gallery -->
  {#if tour.images.gallery && tour.images.gallery.length > 0}
    <Section title={$t('tour_detail.photo_gallery')} subtitle={$t('tour_detail.gallery_subtitle')} background="white">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {#each tour.images.gallery as image, index}
          <div class="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <img 
              src={image} 
              alt={`${tour.title} - Image ${index + 1}`} 
              class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" 
              on:click={() => openGallery(index + 1)}
            />
          </div>
        {/each}
      </div>
    </Section>
  {/if}
  
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
  
  <!-- CTA Section -->
  <div class="bg-primary text-white rounded-2xl p-8 md:p-12 text-center mb-16">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">{$t('tour_detail.cta.title')}</h2>
    <p class="text-lg max-w-2xl mx-auto mb-8">{$t('tour_detail.cta.subtitle')}</p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <Button variant="accent" size="lg">{$t('tour_detail.cta.book_now')}</Button>
      <Button variant="outline" size="lg">{$t('tour_detail.cta.contact_us')}</Button>
    </div>
  </div>
  
  <!-- Related Tours -->
  <Section title={$t('tour_detail.related_tours')} subtitle={$t('tour_detail.related_subtitle')} background="white">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Sample related tours - These would be dynamically populated -->
      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
        <figure class="h-48">
          <img src="/images/tours/beijing.jpg" alt="Beijing Tour" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">Beijing Explorer</h3>
          <p class="text-gray-600 mb-4">Discover the imperial wonders of China's capital</p>
          <div class="flex justify-between items-center">
            <span class="text-primary font-bold">$799</span>
            <span class="badge badge-outline">5 days</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <a href="/tours/beijing-explorer" class="btn btn-secondary w-full">View Details</a>
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
        <figure class="h-48">
          <img src="/images/tours/xian.jpg" alt="Xi'an Tour" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">Xi'an Discovery</h3>
          <p class="text-gray-600 mb-4">Journey to the ancient city and Terracotta Warriors</p>
          <div class="flex justify-between items-center">
            <span class="text-primary font-bold">$699</span>
            <span class="badge badge-outline">4 days</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <a href="/tours/xian-discovery" class="btn btn-secondary w-full">View Details</a>
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
        <figure class="h-48">
          <img src="/images/tours/shanghai.jpg" alt="Shanghai Tour" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">Shanghai Urban Adventure</h3>
          <p class="text-gray-600 mb-4">Experience the city where tradition meets modernity</p>
          <div class="flex justify-between items-center">
            <span class="text-primary font-bold">$749</span>
            <span class="badge badge-outline">4 days</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <a href="/tours/shanghai-urban-adventure" class="btn btn-secondary w-full">View Details</a>
          </div>
        </div>
      </div>
    </div>
  </Section>
  
  <!-- Photo Gallery Popup -->
  <PhotoGalleryPopup
    images={galleryImages}
    initialIndex={currentGalleryIndex}
    isOpen={isGalleryOpen}
    on:close={closeGallery}
  />
</div> 