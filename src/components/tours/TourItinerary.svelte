<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Section from '../common/Section.svelte';
  import PhotoGalleryPopup from '../atoms/PhotoGalleryPopup.svelte';

  export let tour: Tour;

  // Track expanded states for meals only
  let expandedMeals: Record<number, boolean> = {};

  // Gallery state
  let galleryOpen = false;
  let galleryImages: string[] = [];
  let galleryInitialIndex = 0;

  function toggleMeals(dayIndex: number) {
    expandedMeals[dayIndex] = !expandedMeals[dayIndex];
    expandedMeals = { ...expandedMeals };
  }

  function openMealGallery(dayIndex: number, mealIndex: number, imageIndex: number) {
    const meal = tour.itinerary[dayIndex].meals?.[mealIndex];
    if (meal?.images) {
      galleryImages = meal.images;
      galleryInitialIndex = imageIndex;
      galleryOpen = true;
    }
  }

  function openDayImageGallery(dayIndex: number) {
    const day = tour.itinerary[dayIndex];
    if (day.image) {
      galleryImages = [day.image];
      galleryInitialIndex = 0;
      galleryOpen = true;
    }
  }

  function closeGallery() {
    galleryOpen = false;
  }
</script>

<!-- Itinerary -->
<Section
  title={$t('tour_detail.itinerary')}
  subtitle={$t('tour_detail.itinerary_subtitle')}
  background="white"
>
  <div class="space-y-8 mb-16">
    {#each tour.itinerary || [] as day, index}
      <div
        class="relative pl-8 border-l-2 border-primary pb-8 {index === tour.itinerary.length - 1
          ? 'border-transparent'
          : ''}"
      >
        <div
          class="absolute -left-4 top-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          {day.day}
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Content Section -->
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2">{day.title}</h3>
              <p class="mb-4">{day.description}</p>


              {#if day.meals && day.meals.length > 0}
                <div class="mt-4">
                  <button
                    class="flex items-center justify-between w-full text-left text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    on:click={() => toggleMeals(index)}
                  >
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-2 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="font-medium">{$t('tour_detail.meals')} ({day.meals.length})</span
                      >
                    </div>
                    <svg
                      class="h-4 w-4 transition-transform duration-200 {expandedMeals[index]
                        ? 'rotate-90'
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div
                    class="overflow-hidden transition-all duration-300 ease-in-out {expandedMeals[
                      index
                    ]
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-0 opacity-0'}"
                  >
                    <div class="mt-3 pl-6 space-y-3">
                      {#each day.meals as meal, mealIndex}
                        <div class="p-3 bg-gray-50 rounded-lg">
                          <h5 class="font-medium text-sm text-gray-800 mb-1">{meal.name}</h5>
                          {#if meal.description}
                            <p class="text-sm text-gray-600 mb-2">{meal.description}</p>
                          {/if}
                          {#if meal.images && meal.images.length > 0}
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-md">
                              {#each meal.images as image, imgIndex}
                                <div class="aspect-square w-full max-w-[80px]">
                                  <img
                                    src={image}
                                    alt="Meal: {meal.name}"
                                    class="w-full h-full object-cover rounded-md shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
                                    on:click={() => openMealGallery(index, mealIndex, imgIndex)}
                                  />
                                </div>
                              {/each}
                            </div>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Image Section -->
            {#if day.image}
              <div class="md:w-80 md:flex-shrink-0">
                <img
                  src={day.image}
                  alt="Day {day.day} - {day.title}"
                  class="w-full h-48 md:h-full md:min-h-[200px] object-cover rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  on:click={() => openDayImageGallery(index)}
                />
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
