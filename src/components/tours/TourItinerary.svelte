<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Section from '../common/Section.svelte';
  import PhotoGalleryPopup from '../atoms/PhotoGalleryPopup.svelte';

  export let tour: Tour;

  let galleryOpen = false;
  let galleryImages: string[] = [];
  let galleryInitialIndex = 0;

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

  const mealEmoji: Record<string, string> = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍜'
  };

  function mealKey(name = ''): string {
    const n = (name || '').trim();
    if (!n) return '';
    if (n.startsWith('agent.')) return n;
    return `agent.tours.meals.${n.toLowerCase()}`;
  }

  function trMeal(name = ''): string {
    const key = mealKey(name);
    if (!key) return '';
    const translated = $t(key);
    return translated === key ? name : translated;
  }

  function mealDisplayName(meal: unknown): string {
    if (typeof meal === 'string') return meal;
    if (meal && typeof meal === 'object' && 'name' in (meal as any)) {
      return (meal as any).name ?? '';
    }
    return '';
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
        class="relative pl-8 border-l-2 border-primary pb-8 {index === tour.itinerary.length - 1 ? 'border-transparent' : ''}"
      >
        <div
          class="absolute -left-4 top-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          {day.day}
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Content -->
            <div class="flex-1">
              <h3 class="text-xl font-bold mb-2">{day.title}</h3>
              <p class="mb-4">{day.description}</p>

              <!-- Meals Included Summary -->
              {#if day.includedMeals}
                <div class="mt-4 flex items-center gap-4 text-sm text-gray-700">
                  {#if day.includedMeals.breakfast}
                    <span class="inline-flex items-center gap-1">
                      {mealEmoji.breakfast} {$t('agent.tours.meals.breakfast') || 'Breakfast'}
                    </span>
                  {/if}
                  {#if day.includedMeals.lunch}
                    <span class="inline-flex items-center gap-1">
                      {mealEmoji.lunch} {$t('agent.tours.meals.lunch') || 'Lunch'}
                    </span>
                  {/if}
                  {#if day.includedMeals.dinner}
                    <span class="inline-flex items-center gap-1">
                      {mealEmoji.dinner} {$t('agent.tours.meals.dinner') || 'Dinner'}
                    </span>
                  {/if}
                </div>
              {:else if day.meals && day.meals.length > 0}
                <!-- 兼容旧数据：显示列表（无画廊） -->
                <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                  {#each day.meals as meal}
                    {#key meal}
                      {#if mealDisplayName(meal)}
                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded">
                          {mealEmoji[mealDisplayName(meal).toLowerCase()] || ''} {trMeal(mealDisplayName(meal))}
                        </span>
                      {/if}
                    {/key}
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Image -->
            {#if day.image}
              <div class="md:w-80 md:flex-shrink-0">
                <button
                  type="button"
                  class="w-full h-full"
                  on:click={() => openDayImageGallery(index)}
                  aria-label={`Open image for day ${day.day}`}
                >
                  <img
                    src={day.image}
                    alt="Day {day.day} - {day.title}"
                    class="w-full h-48 md:h-full md:min-h-[200px] object-cover rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  />
                </button>
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