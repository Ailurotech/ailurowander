<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Section from '../common/Section.svelte';
  import PhotoGalleryPopup from '../atoms/PhotoGalleryPopup.svelte';

  export let tour: Tour;

  // Track expanded states for accommodations
  $: expandedAccommodation = Object.fromEntries(
    uniqueAccommodations.map((_, index) => [index, true])
  );

  // Gallery state
  let galleryOpen = false;
  let galleryImages: string[] = [];
  let galleryInitialIndex = 0;

  // Safely handle accommodations
  $: accommodations = Array.isArray(tour?.itinerary) 
    ? tour.itinerary
        .filter(day => day && typeof day === 'object' && day.accommodation && day.accommodation.name)
        .map(day => day.accommodation)
    : [];

  $: uniqueAccommodations = (() => {
    if (!accommodations || !Array.isArray(accommodations)) return [];
    return [...new Map(accommodations.map(acc => [acc.name, acc])).values()];
  })();

  function toggleAccommodation(index: number) {
    expandedAccommodation[index] = !expandedAccommodation[index];
    expandedAccommodation = { ...expandedAccommodation };
  }

  function openAccommodationGallery(index: number, imageIndex: number) {
    const accommodation = uniqueAccommodations[index];
    if (accommodation?.images && Array.isArray(accommodation.images)) {
      galleryImages = accommodation.images;
      galleryInitialIndex = imageIndex;
      galleryOpen = true;
    }
  }

  function closeGallery() {
    galleryOpen = false;
  }
</script>

<!-- Accommodations Section -->
{#if uniqueAccommodations.length > 0}
  <Section
    title={$t('tour_detail.accommodations')}
    subtitle="Carefully selected hotels for your comfort"
    background="white"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      {#each uniqueAccommodations as accommodation, index}
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold">{accommodation.name}</h3>
            </div>
            <button
              class="text-primary hover:text-primary-dark transition-colors"
              on:click={() => toggleAccommodation(index)}
            >
              <svg
                class="h-5 w-5 transition-transform duration-200 {expandedAccommodation[index]
                  ? 'rotate-180'
                  : ''}"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div
            class="overflow-hidden transition-all duration-300 ease-in-out {expandedAccommodation[index]
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0'}"
          >
            <div class="space-y-4">
              {#if accommodation.description}
                <p class="text-gray-600">{accommodation.description}</p>
              {/if}
              
              {#if accommodation.images && accommodation.images.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {#each accommodation.images as image, imgIndex}
                    <div class="aspect-[4/3] w-full">
                      <img
                        src={image}
                        alt="Hotel: {accommodation.name}"
                        class="w-full h-full object-cover rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                        on:click={() => openAccommodationGallery(index, imgIndex)}
                      />
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </Section>

  <!-- Photo Gallery Popup -->
  <PhotoGalleryPopup
    images={galleryImages}
    initialIndex={galleryInitialIndex}
    isOpen={galleryOpen}
    on:close={closeGallery}
  />
{/if}