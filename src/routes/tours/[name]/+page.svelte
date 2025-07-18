<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import PhotoGalleryPopup from '../../../components/atoms/PhotoGalleryPopup.svelte';
  import TourHero from '../../../components/tours/TourHero.svelte';
  import TourContent from '../../../components/tours/TourContent.svelte';
  import TourHighlights from '../../../components/tours/TourHighlights.svelte';
  import TourBookingCard from '../../../components/tours/TourBookingCard.svelte';
  import TourItinerary from '../../../components/tours/TourItinerary.svelte';
  import TourInclusionsExclusions from '../../../components/tours/TourInclusionsExclusions.svelte';
  import TourPhotoGallery from '../../../components/tours/TourPhotoGallery.svelte';
  import TourTags from '../../../components/tours/TourTags.svelte';
  import TourCTA from '../../../components/tours/TourCTA.svelte';
  import RelatedTours from '../../../components/tours/RelatedTours.svelte';
  
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
</script>

<svelte:head>
  <title>{tour.title} | {$t('site.title')}</title>
  <meta name="description" content={tour.description} />
</svelte:head>

<TourHero {tour} onImageClick={() => openGallery(0)} />

<!-- Tour Information -->
<div class="container mx-auto px-4 py-12">
  <!-- Main Content and Booking Card -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
    <div class="lg:col-span-2">
      <TourContent {tour} />
      <TourHighlights {tour} />
    </div>
    
    <TourBookingCard {tour} />
  </div>
  
  <TourItinerary {tour} />
  
  <TourInclusionsExclusions {tour} />
  
  <TourPhotoGallery {tour} onImageClick={openGallery} />
  
  <TourTags {tour} />
  
  <TourCTA />
  
  <RelatedTours />
  
  <!-- Photo Gallery Popup -->
  <PhotoGalleryPopup
    images={galleryImages}
    initialIndex={currentGalleryIndex}
    isOpen={isGalleryOpen}
    on:close={closeGallery}
  />
</div> 