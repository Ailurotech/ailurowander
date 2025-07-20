<script lang="ts">
  import { t } from '$lib/i18n';
  import { createEventDispatcher } from 'svelte';
  import Button from '../atoms/Button.svelte';
  import TranslateButton from '../atoms/TranslateButton.svelte';
  import ChineseIcon from '../atoms/ChineseIcon.svelte';
  import type { TourFormData } from '$lib/types/tour';

  export let mode: 'add' | 'edit' = 'add';
  export let initialData: Partial<TourFormData> = {};
  export let isSubmitting = false;

  const dispatch = createEventDispatcher();

  // Initialize form data
  let tourData: TourFormData = {
    _id: initialData._id || '',
    title: initialData.title || '',
    description: initialData.description || '',
    duration: initialData.duration || { days: 0, nights: 0 },
    price: initialData.price || { amount: 0, currency: 'USD' },
    destination: initialData.destination || '',
    maxGroupSize: initialData.maxGroupSize || 10,
    highlights: initialData.highlights || [],
    inclusions: initialData.inclusions || [
      'Hotel accommodation',
      'English speaking guide',
      'Transportation',
    ],
    exclusions: initialData.exclusions || [
      'International flights',
      'Travel insurance',
      'Personal expenses',
    ],
    itinerary: initialData.itinerary || [
      {
        day: 1,
        title: 'Arrival Day',
        description: 'Welcome to China! Transfer to hotel and rest.',
        accommodation: { name: '', description: '', images: [] },
        meals: [],
      },
    ],
    images: initialData.images || { main: '', gallery: [] },
    featured: initialData.featured || false,
    discount: initialData.discount || 0,
    tags: initialData.tags || [],
  };

  // Available icons for tour selection
  const availableIcons = [
    { name: 'great-wall' as const, key: 'great_wall' },
    { name: 'forbidden-city' as const, key: 'forbidden_city' },
    { name: 'terracotta' as const, key: 'terracotta' },
    { name: 'temple' as const, key: 'temple' },
    { name: 'pagoda' as const, key: 'pagoda' },
    { name: 'dragon' as const, key: 'dragon' },
    { name: 'panda' as const, key: 'panda' },
    { name: 'lantern' as const, key: 'lantern' },
    { name: 'bamboo' as const, key: 'bamboo' },
    { name: 'mountains' as const, key: 'mountains' },
  ];

  let selectedIcon: (typeof availableIcons)[0]['name'] = 'great-wall';

  // Image handling state
  let mainImageFile: File | null = null;
  let galleryImageFiles: File[] = [];
  let mainImagePreview: string | null = null;
  let galleryImagePreviews: string[] = [];
  let itineraryImageFiles: (File | null)[] = [];
  let itineraryImagePreviews: (string | null)[] = [];
  let accommodationImageFiles: File[][] = [];
  let accommodationImagePreviews: string[][] = [];
  let mealsImageFiles: File[][][] = [];
  let mealsImagePreviews: string[][][] = [];

  // State for tracking removed existing images
  let removeMainImage = false;
  let removedGalleryImages: number[] = [];
  let removedItineraryImages: number[] = [];
  let removedAccommodationImages: { dayIndex: number; imageIndex: number }[] = [];
  let removedMealImages: { dayIndex: number; mealIndex: number; imageIndex: number }[] = [];

  // Initialize image arrays based on itinerary
  $: {
    if (tourData.itinerary) {
      const itineraryLength = tourData.itinerary.length;

      // Resize arrays if needed
      if (itineraryImageFiles.length !== itineraryLength) {
        itineraryImageFiles = new Array(itineraryLength).fill(null);
        itineraryImagePreviews = new Array(itineraryLength).fill(null);
        accommodationImageFiles = new Array(itineraryLength).fill([]);
        accommodationImagePreviews = new Array(itineraryLength).fill([]);
        mealsImageFiles = tourData.itinerary.map(day => (day.meals || []).map(() => []));
        mealsImagePreviews = tourData.itinerary.map(day => (day.meals || []).map(() => []));
      }
    }
  }

  // Helper functions
  function addItineraryDay() {
    const newDay = tourData.itinerary.length + 1;
    tourData.itinerary = [
      ...tourData.itinerary,
      {
        day: newDay,
        title: `Day ${newDay}`,
        description: '',
        accommodation: { name: '', description: '', images: [] },
        meals: [],
      },
    ];
  }

  function removeItineraryDay(index: number) {
    if (tourData.itinerary.length > 1) {
      tourData.itinerary = tourData.itinerary.filter((_, i) => i !== index);
      // Update day numbers
      tourData.itinerary.forEach((day, i) => {
        day.day = i + 1;
      });
    }
  }

  function addMeal(dayIndex: number) {
    if (!tourData.itinerary[dayIndex].meals) {
      tourData.itinerary[dayIndex].meals = [];
    }
    tourData.itinerary[dayIndex].meals = [
      ...(tourData.itinerary[dayIndex].meals || []),
      {
        name: '',
        description: '',
        images: [],
      },
    ];
  }

  function removeMeal(dayIndex: number, mealIndex: number) {
    if (tourData.itinerary[dayIndex].meals) {
      tourData.itinerary[dayIndex].meals = tourData.itinerary[dayIndex].meals!.filter(
        (_, i) => i !== mealIndex
      );
    }
  }

  function addHighlightItem() {
    tourData.highlights = [...tourData.highlights, ''];
  }

  function removeHighlightItem(index: number) {
    tourData.highlights = tourData.highlights.filter((_, i) => i !== index);
  }

  function addInclusionItem() {
    tourData.inclusions = [...tourData.inclusions, ''];
  }

  function removeInclusionItem(index: number) {
    if (tourData.inclusions.length > 1) {
      tourData.inclusions = tourData.inclusions.filter((_, i) => i !== index);
    }
  }

  function addExclusionItem() {
    tourData.exclusions = [...tourData.exclusions, ''];
  }

  function removeExclusionItem(index: number) {
    if (tourData.exclusions.length > 1) {
      tourData.exclusions = tourData.exclusions.filter((_, i) => i !== index);
    }
  }

  // Image handling functions
  function handleMainImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      mainImageFile = file;
      const reader = new FileReader();
      reader.onload = e => {
        mainImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function handleGalleryImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    galleryImageFiles = [...galleryImageFiles, ...files];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        galleryImagePreviews = [...galleryImagePreviews, e.target?.result as string];
      };
      reader.readAsDataURL(file);
    });
  }

  function removeGalleryImage(index: number) {
    galleryImageFiles = galleryImageFiles.filter((_, i) => i !== index);
    galleryImagePreviews = galleryImagePreviews.filter((_, i) => i !== index);
  }

  // Itinerary day image handling
  function handleItineraryImageChange(event: Event, dayIndex: number) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      itineraryImageFiles[dayIndex] = file;
      itineraryImageFiles = [...itineraryImageFiles];

      const reader = new FileReader();
      reader.onload = e => {
        itineraryImagePreviews[dayIndex] = e.target?.result as string;
        itineraryImagePreviews = [...itineraryImagePreviews];
      };
      reader.readAsDataURL(file);
    }
  }

  function removeItineraryImage(dayIndex: number) {
    itineraryImageFiles[dayIndex] = null;
    itineraryImagePreviews[dayIndex] = null;
    itineraryImageFiles = [...itineraryImageFiles];
    itineraryImagePreviews = [...itineraryImagePreviews];
  }

  // Functions for removing existing images
  function removeExistingMainImage() {
    removeMainImage = true;
  }

  function removeExistingGalleryImage(imageIndex: number) {
    removedGalleryImages = [...removedGalleryImages, imageIndex];
  }

  function removeExistingItineraryImage(dayIndex: number) {
    removedItineraryImages = [...removedItineraryImages, dayIndex];
  }

  function removeExistingAccommodationImage(dayIndex: number, imageIndex: number) {
    removedAccommodationImages = [...removedAccommodationImages, { dayIndex, imageIndex }];
  }

  function removeExistingMealImage(dayIndex: number, mealIndex: number, imageIndex: number) {
    removedMealImages = [...removedMealImages, { dayIndex, mealIndex, imageIndex }];
  }

  // Accommodation image handling
  function handleAccommodationImageChange(event: Event, dayIndex: number) {
    const target = event.target as HTMLInputElement;
    const newFiles = Array.from(target.files || []);
    accommodationImageFiles[dayIndex] = [...accommodationImageFiles[dayIndex], ...newFiles];
    accommodationImageFiles = [...accommodationImageFiles];

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        accommodationImagePreviews[dayIndex] = [
          ...accommodationImagePreviews[dayIndex],
          e.target?.result as string,
        ];
        accommodationImagePreviews = [...accommodationImagePreviews];
      };
      reader.readAsDataURL(file);
    });
  }

  function removeAccommodationImage(dayIndex: number, imageIndex: number) {
    accommodationImageFiles[dayIndex] = accommodationImageFiles[dayIndex].filter(
      (_, i) => i !== imageIndex
    );
    accommodationImagePreviews[dayIndex] = accommodationImagePreviews[dayIndex].filter(
      (_, i) => i !== imageIndex
    );
    accommodationImageFiles = [...accommodationImageFiles];
    accommodationImagePreviews = [...accommodationImagePreviews];
  }

  // Meal image handling
  function handleMealImageChange(event: Event, dayIndex: number, mealIndex: number) {
    const target = event.target as HTMLInputElement;
    const newFiles = Array.from(target.files || []);
    mealsImageFiles[dayIndex][mealIndex] = [...mealsImageFiles[dayIndex][mealIndex], ...newFiles];
    mealsImageFiles = [...mealsImageFiles];

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        mealsImagePreviews[dayIndex][mealIndex] = [
          ...mealsImagePreviews[dayIndex][mealIndex],
          e.target?.result as string,
        ];
        mealsImagePreviews = [...mealsImagePreviews];
      };
      reader.readAsDataURL(file);
    });
  }

  function removeMealImage(dayIndex: number, mealIndex: number, imageIndex: number) {
    mealsImageFiles[dayIndex][mealIndex] = mealsImageFiles[dayIndex][mealIndex].filter(
      (_, i) => i !== imageIndex
    );
    mealsImagePreviews[dayIndex][mealIndex] = mealsImagePreviews[dayIndex][mealIndex].filter(
      (_, i) => i !== imageIndex
    );
    mealsImageFiles = [...mealsImageFiles];
    mealsImagePreviews = [...mealsImagePreviews];
  }

  // Form validation
  function validateForm(): string | null {
    if (!tourData.title) return $t('agent.tours.validation.title_required');
    if (!tourData.description) return $t('agent.tours.validation.description_required');
    if (!tourData.destination) return $t('agent.tours.validation.destination_required');
    if (mode === 'add' && !mainImageFile) return $t('agent.tours.validation.main_image_required');
    return null;
  }

  // Handle form submission
  function handleSubmit() {
    const validationError = validateForm();
    if (validationError) {
      dispatch('error', { message: validationError });
      return;
    }

    const formData = new FormData();

    // Add basic tour data
    formData.append('title', tourData.title);
    formData.append('description', tourData.description);
    formData.append('destination', tourData.destination);
    formData.append('durationDays', tourData.duration.days.toString());
    formData.append('durationNights', tourData.duration.nights.toString());
    formData.append('price', tourData.price.amount.toString());
    formData.append('featured', tourData.featured.toString());
    formData.append('discount', tourData.discount.toString());
    formData.append('maxGroupSize', tourData.maxGroupSize.toString());

    // Add arrays
    tourData.highlights.forEach(item => formData.append('highlights', item));
    tourData.inclusions.forEach(item => formData.append('included', item));
    tourData.exclusions.forEach(item => formData.append('notIncluded', item));
    tourData.tags.forEach(tag => formData.append('tags', tag));

    // Add itinerary
    formData.append('itinerary', JSON.stringify(tourData.itinerary));

    // Add images
    if (mainImageFile) formData.append('mainImage', mainImageFile);
    galleryImageFiles.forEach(file => formData.append('galleryImages', file));

    // Add itinerary images
    itineraryImageFiles.forEach((file, index) => {
      if (file) formData.append(`itineraryImage_${index}`, file);
    });

    // Add accommodation images
    accommodationImageFiles.forEach((dayImages, dayIndex) => {
      dayImages.forEach((file, imgIndex) => {
        formData.append(`accommodationImage_${dayIndex}_${imgIndex}`, file);
      });
    });

    // Add meals images
    mealsImageFiles.forEach((dayMeals, dayIndex) => {
      dayMeals.forEach((mealImages, mealIndex) => {
        mealImages.forEach((file, imgIndex) => {
          formData.append(`mealImage_${dayIndex}_${mealIndex}_${imgIndex}`, file);
        });
      });
    });

    // Add information about removed existing images
    if (mode === 'edit') {
      formData.append('removeMainImage', removeMainImage.toString());
      formData.append('removedGalleryImages', JSON.stringify(removedGalleryImages));
      formData.append('removedItineraryImages', JSON.stringify(removedItineraryImages));
      formData.append('removedAccommodationImages', JSON.stringify(removedAccommodationImages));
      formData.append('removedMealImages', JSON.stringify(removedMealImages));
    }

    dispatch('submit', { formData, tourData });
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-8">
  <!-- Basic Information -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.basic_info')}</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="form-group">
        <label for="title" class="form-label">{$t('agent.tours.title_label')}*</label>
        <div class="flex gap-2">
          <input
            type="text"
            id="title"
            bind:value={tourData.title}
            required
            class="input flex-1"
            placeholder={$t('agent.tours.title_placeholder')}
          />
          <TranslateButton
            text={tourData.title}
            context="tour_title"
            category="tours"
            size="sm"
            on:apply={e => (tourData.title = e.detail.translation)}
          />
        </div>
      </div>

      <div class="form-group">
        <label for="destination" class="form-label">{$t('agent.tours.destination_label')}*</label>
        <div class="flex gap-2">
          <input
            type="text"
            id="destination"
            bind:value={tourData.destination}
            required
            class="input flex-1"
            placeholder={$t('agent.tours.destination_placeholder')}
          />
          <TranslateButton
            text={tourData.destination}
            context="tour_destination"
            category="destinations"
            size="sm"
            on:apply={e => (tourData.destination = e.detail.translation)}
          />
        </div>
      </div>

      <div class="form-group">
        <label for="duration" class="form-label">{$t('agent.tours.duration_label')}*</label>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              id="duration-days"
              bind:value={tourData.duration.days}
              required
              min="1"
              class="input w-full"
              placeholder={$t('agent.tours.days')}
            />
          </div>
          <div>
            <input
              type="number"
              id="duration-nights"
              bind:value={tourData.duration.nights}
              required
              min="0"
              class="input w-full"
              placeholder={$t('agent.tours.nights')}
            />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="price" class="form-label">{$t('agent.tours.price_label')}*</label>
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <input
              type="number"
              id="price-amount"
              bind:value={tourData.price.amount}
              required
              min="0"
              step="0.01"
              class="input w-full"
              placeholder={$t('agent.tours.amount')}
            />
          </div>
          <div>
            <select
              id="price-currency"
              bind:value={tourData.price.currency}
              required
              class="input w-full"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="discount" class="form-label">{$t('agent.tours.discount')}</label>
        <input
          type="number"
          id="discount"
          bind:value={tourData.discount}
          min="0"
          class="input w-full"
          placeholder={$t('agent.tours.discount_placeholder')}
        />
      </div>

      <div class="form-group">
        <label for="max-group-size" class="form-label">{$t('agent.tours.max_group_size')}</label>
        <input
          type="number"
          id="max-group-size"
          bind:value={tourData.maxGroupSize}
          min="1"
          class="input w-full"
          placeholder={$t('agent.tours.max_group_size_placeholder')}
        />
      </div>
    </div>

    <div class="form-group mt-4">
      <div class="flex items-center">
        <input
          type="checkbox"
          id="featured"
          bind:checked={tourData.featured}
          class="w-5 h-5 text-primary rounded focus:ring-primary"
        />
        <label for="featured" class="ml-2 text-sm font-medium text-neutral-700">
          {$t('agent.tours.featured')}
        </label>
      </div>
      <p class="text-xs text-neutral-500 mt-1">{$t('agent.tours.featured_description')}</p>
    </div>
  </div>

  <!-- Tour Icon Selection -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.icon_type')}</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {#each availableIcons as icon}
        <button
          type="button"
          class="flex flex-col items-center p-3 rounded-lg border-2 transition-colors {selectedIcon ===
          icon.name
            ? 'border-primary bg-primary-50'
            : 'border-neutral-200 hover:border-neutral-300'}"
          on:click={() => (selectedIcon = icon.name)}
        >
          <ChineseIcon icon={icon.name} size="lg" />
          <span class="mt-2 text-sm">{$t(`agent.tours.icons.${icon.key}`)}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Tour Description -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.description_label')}</h2>

    <div class="form-group">
      <label for="description" class="form-label">{$t('agent.tours.description_label')}*</label>
      <div class="flex gap-2">
        <textarea
          id="description"
          bind:value={tourData.description}
          required
          class="input flex-1 h-32"
          placeholder={$t('agent.tours.description_placeholder')}
        ></textarea>
        <TranslateButton
          text={tourData.description}
          context="tour_description"
          category="tours"
          size="sm"
          on:apply={e => (tourData.description = e.detail.translation)}
        />
      </div>
    </div>
  </div>

  <!-- Tour Itinerary with Accommodation and Meals -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-heading font-bold">{$t('agent.tours.itinerary_label')}</h2>
      <Button variant="secondary" size="sm" on:click={addItineraryDay} type="button">
        {$t('agent.tours.add_day')}
      </Button>
    </div>

    <div class="space-y-6">
      {#each tourData.itinerary as day, index}
        <div class="p-4 border border-neutral-200 rounded-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-heading font-medium">{$t('agent.tours.day')} {day.day}</h3>
            <button
              type="button"
              class="text-red-600 hover:text-red-800"
              on:click={() => removeItineraryDay(index)}
              disabled={tourData.itinerary.length === 1}
            >
              {$t('agent.tours.remove_day')}
            </button>
          </div>

          <div class="form-group">
            <label class="form-label">{$t('agent.tours.day_title')}*</label>
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={tourData.itinerary[index].title}
                required
                class="input flex-1"
                placeholder={$t('agent.tours.day_title_placeholder')}
              />
              <TranslateButton
                text={tourData.itinerary[index].title}
                context="itinerary_day_title"
                category="tours"
                size="sm"
                on:apply={e => (tourData.itinerary[index].title = e.detail.translation)}
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{$t('agent.tours.day_description')}*</label>
            <div class="flex gap-2">
              <textarea
                bind:value={tourData.itinerary[index].description}
                required
                class="input flex-1 h-24"
                placeholder={$t('agent.tours.day_description_placeholder')}
              ></textarea>
              <TranslateButton
                text={tourData.itinerary[index].description}
                context="itinerary_day_description"
                category="tours"
                size="sm"
                on:apply={e => (tourData.itinerary[index].description = e.detail.translation)}
              />
            </div>
          </div>

          <!-- Day Image -->
          <div class="form-group">
            <label for="day-image-{index}" class="form-label">{$t('agent.tours.day_image')}</label>
            <div class="mt-2">
              <input
                type="file"
                id="day-image-{index}"
                accept="image/*"
                on:change={e => handleItineraryImageChange(e, index)}
                class="hidden"
              />
              <label
                for="day-image-{index}"
                class="cursor-pointer inline-flex items-center px-3 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                <svg
                  class="h-4 w-4 mr-2 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {mode === 'edit'
                  ? $t('agent.tours.change_day_image')
                  : $t('agent.tours.select_day_image')}
              </label>
            </div>
            {#if itineraryImagePreviews[index]}
              <div class="mt-3 w-48">
                <div class="relative aspect-[4/3] w-full">
                  <img
                    src={itineraryImagePreviews[index]}
                    alt="Day {index + 1} image preview"
                    class="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    on:click={() => removeItineraryImage(index)}
                  >
                    <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            {:else if mode === 'edit' && day.image && !removedItineraryImages.includes(index)}
              <div class="mt-3 w-48">
                <div class="relative aspect-[4/3] w-full">
                  <img
                    src={day.image}
                    alt="Current day {index + 1} image"
                    class="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    on:click={() => removeExistingItineraryImage(index)}
                  >
                    <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div
                    class="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Existing
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- Accommodation Section -->
          <div class="form-group mt-6">
            <h4 class="font-medium mb-3">{$t('agent.tours.accommodation.title')}</h4>
            <div class="space-y-3">
              <div>
                <label class="form-label text-sm">{$t('agent.tours.accommodation.name')}</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    bind:value={day.accommodation!.name}
                    class="input flex-1 text-sm"
                    placeholder={$t('agent.tours.accommodation.name_placeholder')}
                  />
                  <TranslateButton
                    text={day.accommodation!.name || '酒店名称'}
                    context="accommodation_name"
                    category="hotels"
                    size="sm"
                    on:apply={e => (day.accommodation!.name = e.detail.translation)}
                  />
                </div>
              </div>
              <div>
                <label class="form-label text-sm"
                  >{$t('agent.tours.accommodation.description')}</label
                >
                <div class="flex gap-2">
                  <textarea
                    bind:value={day.accommodation!.description}
                    class="input flex-1 h-16 text-sm"
                    placeholder={$t('agent.tours.accommodation.description_placeholder')}
                  ></textarea>
                  <TranslateButton
                    text={day.accommodation!.description || '酒店描述'}
                    context="accommodation_description"
                    category="hotels"
                    size="sm"
                    on:apply={e => (day.accommodation!.description = e.detail.translation)}
                  />
                </div>
              </div>
              <div>
                <label class="form-label text-sm">{$t('agent.tours.accommodation.photos')}</label>
                <div class="mt-2">
                  <input
                    type="file"
                    id="accommodation-images-{index}"
                    accept="image/*"
                    multiple
                    on:change={e => handleAccommodationImageChange(e, index)}
                    class="hidden"
                  />
                  <label
                    for="accommodation-images-{index}"
                    class="cursor-pointer inline-flex items-center px-3 py-2 border border-neutral-300 rounded-md shadow-sm text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                  >
                    <svg
                      class="h-4 w-4 mr-2 text-neutral-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    {$t('agent.tours.accommodation.add_photos')}
                  </label>
                </div>
                {#if (accommodationImagePreviews[index] && accommodationImagePreviews[index].length > 0) || (mode === 'edit' && day.accommodation?.images && day.accommodation.images.length > 0)}
                  <div class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <!-- New uploaded images -->
                    {#if accommodationImagePreviews[index]}
                      {#each accommodationImagePreviews[index] as preview, imgIndex}
                        <div class="relative aspect-[4/3] w-full">
                          <img
                            src={preview}
                            alt="Accommodation preview {imgIndex + 1}"
                            class="w-full h-full object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs"
                            on:click={() => removeAccommodationImage(index, imgIndex)}
                          >
                            <svg
                              class="h-3 w-3"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      {/each}
                    {/if}

                    <!-- Existing images in edit mode -->
                    {#if mode === 'edit' && day.accommodation?.images}
                      {#each day.accommodation.images as existingImage, imgIndex}
                        {#if !removedAccommodationImages.some(removed => removed.dayIndex === index && removed.imageIndex === imgIndex)}
                          <div class="relative aspect-[4/3] w-full">
                            <img
                              src={existingImage}
                              alt="Existing accommodation image {imgIndex + 1}"
                              class="w-full h-full object-cover rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs"
                              on:click={() => removeExistingAccommodationImage(index, imgIndex)}
                            >
                              <svg
                                class="h-3 w-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                            <div
                              class="absolute bottom-1 left-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                            >
                              Existing
                            </div>
                          </div>
                        {/if}
                      {/each}
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Meals Section -->
          <div class="form-group mt-6">
            <div class="flex justify-between items-center mb-3">
              <h4 class="font-medium">{$t('agent.tours.meals.title')}</h4>
              <button
                type="button"
                class="text-xs btn btn--secondary"
                on:click={() => addMeal(index)}
              >
                {$t('agent.tours.meals.add_meal')}
              </button>
            </div>
            {#each day.meals || [] as meal, mealIndex}
              <div class="border border-neutral-100 rounded p-3 mb-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium"
                    >{$t('agent.tours.meals.meal_number')} {mealIndex + 1}</span
                  >
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-700 text-xs"
                    on:click={() => removeMeal(index, mealIndex)}
                    >{$t('agent.tours.meals.remove')}</button
                  >
                </div>
                <div class="space-y-2">
                  <div>
                    <label class="form-label text-xs">{$t('agent.tours.meals.meal_name')}</label>
                    <div class="flex gap-2">
                      <input
                        type="text"
                        bind:value={meal.name}
                        class="input flex-1 text-sm"
                        placeholder={$t('agent.tours.meals.meal_name_placeholder')}
                      />
                      <TranslateButton
                        text={meal.name || '餐食名称'}
                        context="meal_name"
                        category="food"
                        size="sm"
                        on:apply={e => (meal.name = e.detail.translation)}
                      />
                    </div>
                  </div>
                  <div>
                    <label class="form-label text-xs">{$t('agent.tours.meals.description')}</label>
                    <div class="flex gap-2">
                      <textarea
                        bind:value={meal.description}
                        class="input flex-1 h-12 text-sm"
                        placeholder={$t('agent.tours.meals.description_placeholder')}
                      ></textarea>
                      <TranslateButton
                        text={meal.description || '餐食描述'}
                        context="meal_description"
                        category="food"
                        size="sm"
                        on:apply={e => (meal.description = e.detail.translation)}
                      />
                    </div>
                  </div>
                  <div>
                    <label class="form-label text-xs">{$t('agent.tours.meals.photos')}</label>
                    <div class="mt-1">
                      <input
                        type="file"
                        id="meal-images-{index}-{mealIndex}"
                        accept="image/*"
                        multiple
                        on:change={e => handleMealImageChange(e, index, mealIndex)}
                        class="hidden"
                      />
                      <label
                        for="meal-images-{index}-{mealIndex}"
                        class="cursor-pointer inline-flex items-center px-2 py-1 border border-neutral-300 rounded-md shadow-sm text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                      >
                        <svg
                          class="h-3 w-3 mr-1 text-neutral-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        {$t('agent.tours.meals.add_photos')}
                      </label>
                    </div>
                    {#if (mealsImagePreviews[index] && mealsImagePreviews[index][mealIndex] && mealsImagePreviews[index][mealIndex].length > 0) || (mode === 'edit' && meal.images && meal.images.length > 0)}
                      <div class="mt-2 grid grid-cols-3 gap-1">
                        <!-- New uploaded images -->
                        {#if mealsImagePreviews[index] && mealsImagePreviews[index][mealIndex]}
                          {#each mealsImagePreviews[index][mealIndex] as preview, imgIndex}
                            <div class="relative aspect-[4/3] w-full">
                              <img
                                src={preview}
                                alt="Meal preview {imgIndex + 1}"
                                class="w-full h-full object-cover rounded shadow-sm"
                              />
                              <button
                                type="button"
                                class="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full text-xs"
                                on:click={() => removeMealImage(index, mealIndex, imgIndex)}
                              >
                                <svg
                                  class="h-2 w-2"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          {/each}
                        {/if}

                        <!-- Existing images in edit mode -->
                        {#if mode === 'edit' && meal.images}
                          {#each meal.images as existingImage, imgIndex}
                            {#if !removedMealImages.some(removed => removed.dayIndex === index && removed.mealIndex === mealIndex && removed.imageIndex === imgIndex)}
                              <div class="relative aspect-[4/3] w-full">
                                <img
                                  src={existingImage}
                                  alt="Existing meal image {imgIndex + 1}"
                                  class="w-full h-full object-cover rounded shadow-sm"
                                />
                                <button
                                  type="button"
                                  class="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full text-xs"
                                  on:click={() =>
                                    removeExistingMealImage(index, mealIndex, imgIndex)}
                                >
                                  <svg
                                    class="h-2 w-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                                <div
                                  class="absolute bottom-0 left-0 px-1 py-0.5 bg-blue-500 text-white text-xs rounded-tr"
                                >
                                  Existing
                                </div>
                              </div>
                            {/if}
                          {/each}
                        {/if}
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Tour Highlights -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-heading font-bold">{$t('agent.tours.highlights_label')}</h2>
      <button type="button" class="btn btn--outline" on:click={addHighlightItem}>
        {$t('agent.tours.add_highlight')}
      </button>
    </div>

    <div class="space-y-3">
      {#each tourData.highlights as item, index}
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={tourData.highlights[index]}
            required
            class="input flex-grow"
            placeholder={$t('agent.tours.highlights_placeholder')}
          />
          <TranslateButton
            text={tourData.highlights[index]}
            context="tour_highlight"
            category="tours"
            size="sm"
            on:apply={e => (tourData.highlights[index] = e.detail.translation)}
          />
          <button
            type="button"
            class="btn btn--outline text-red-600 border-red-600 px-3"
            on:click={() => removeHighlightItem(index)}
          >
            {$t('agent.tours.remove_highlight')}
          </button>
        </div>
      {/each}
    </div>
  </div>

  <!-- Inclusions & Exclusions -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <h2 class="text-xl font-heading font-bold mb-4">
      {$t('agent.tours.inclusions_label')} & {$t('agent.tours.exclusions_label')}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-heading font-medium">{$t('agent.tours.inclusions_label')}</h3>
          <button type="button" class="text-xs btn btn--secondary" on:click={addInclusionItem}>
            {$t('agent.tours.add_inclusion')}
          </button>
        </div>

        <div class="space-y-3">
          {#each tourData.inclusions as item, index}
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={tourData.inclusions[index]}
                required
                class="input flex-grow"
                placeholder={$t('agent.tours.inclusions_placeholder')}
              />
              <TranslateButton
                text={tourData.inclusions[index]}
                context="tour_inclusion"
                category="tours"
                size="sm"
                on:apply={e => (tourData.inclusions[index] = e.detail.translation)}
              />
              <button
                type="button"
                class="btn btn--outline text-red-600 border-red-600 px-3"
                on:click={() => removeInclusionItem(index)}
                disabled={tourData.inclusions.length === 1}
              >
                {$t('agent.tours.remove_inclusion')}
              </button>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-heading font-medium">{$t('agent.tours.exclusions_label')}</h3>
          <button type="button" class="text-xs btn btn--secondary" on:click={addExclusionItem}>
            {$t('agent.tours.add_exclusion')}
          </button>
        </div>

        <div class="space-y-3">
          {#each tourData.exclusions as item, index}
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={tourData.exclusions[index]}
                required
                class="input flex-grow"
                placeholder={$t('agent.tours.exclusions_placeholder')}
              />
              <TranslateButton
                text={tourData.exclusions[index]}
                context="tour_exclusion"
                category="tours"
                size="sm"
                on:apply={e => (tourData.exclusions[index] = e.detail.translation)}
              />
              <button
                type="button"
                class="btn btn--outline text-red-600 border-red-600 px-3"
                on:click={() => removeExclusionItem(index)}
                disabled={tourData.exclusions.length === 1}
              >
                {$t('agent.tours.remove_exclusion')}
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Images -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.images.title')}</h2>

    <div class="form-group">
      <label for="main-image" class="form-label">{$t('agent.tours.images.main_image')}</label>
      <div class="mt-2">
        <input
          type="file"
          id="main-image"
          accept="image/*"
          on:change={handleMainImageChange}
          class="hidden"
        />
        <label
          for="main-image"
          class="cursor-pointer inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
        >
          <svg
            class="h-5 w-5 mr-2 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {mode === 'edit'
            ? $t('agent.tours.images.change_main_image')
            : $t('agent.tours.select_image')}
        </label>
      </div>
      {#if mainImagePreview}
        <div class="mt-4 w-64">
          <div class="aspect-[4/3] w-full">
            <img
              src={mainImagePreview}
              alt="Main image preview"
              class="w-full h-full object-cover rounded-lg shadow-sm"
            />
          </div>
        </div>
      {:else if mode === 'edit' && tourData.images.main && !removeMainImage}
        <div class="mt-4 w-64">
          <div class="relative aspect-[4/3] w-full">
            <img
              src={tourData.images.main}
              alt="Current main image"
              class="w-full h-full object-cover rounded-lg shadow-sm"
            />
            <button
              type="button"
              class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              on:click={removeExistingMainImage}
            >
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div class="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
              Existing
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="form-group mt-6">
      <label for="gallery-images" class="form-label"
        >{$t('agent.tours.images.gallery_images')}</label
      >
      <div class="mt-2">
        <input
          type="file"
          id="gallery-images"
          accept="image/*"
          multiple
          on:change={handleGalleryImageChange}
          class="hidden"
        />
        <label
          for="gallery-images"
          class="cursor-pointer inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
        >
          <svg
            class="h-5 w-5 mr-2 text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {$t('agent.tours.images.add_gallery_images')}
        </label>
      </div>
      {#if galleryImagePreviews.length > 0 || (mode === 'edit' && tourData.images?.gallery?.length > 0)}
        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- New uploaded images -->
          {#each galleryImagePreviews as preview, index}
            <div class="relative aspect-[4/3] w-full">
              <img
                src={preview}
                alt="Gallery preview {index + 1}"
                class="w-full h-full object-cover rounded-lg shadow-sm"
              />
              <button
                type="button"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                on:click={() => removeGalleryImage(index)}
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          {/each}

          <!-- Existing images in edit mode -->
          {#if mode === 'edit' && tourData.images?.gallery}
            {#each tourData.images.gallery as existingImage, index}
              {#if !removedGalleryImages.includes(index)}
                <div class="relative aspect-[4/3] w-full">
                  <img
                    src={existingImage}
                    alt="Gallery image {index + 1}"
                    class="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    on:click={() => removeExistingGalleryImage(index)}
                  >
                    <svg
                      class="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div
                    class="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Existing
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Tags -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.tags_label')}</h2>

    <div class="form-group">
      <label for="tags" class="form-label">{$t('agent.tours.tags_label')} (comma separated)</label>
      <div class="flex gap-2">
        <input
          type="text"
          id="tags"
          class="input flex-1"
          placeholder={$t('agent.tours.tags_placeholder')}
          value={tourData.tags.join(', ')}
          on:blur={e => {
            const inputValue = (e.target as HTMLInputElement).value;
            tourData.tags = inputValue
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag !== '');
          }}
        />
        <TranslateButton
          text={tourData.tags.join(', ')}
          context="tour_tags"
          category="tags"
          size="sm"
          on:apply={e => {
            const translatedTags = e.detail.translation;
            tourData.tags = translatedTags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag !== '');
          }}
        />
      </div>
      <p class="text-xs text-neutral-500 mt-1">{$t('agent.tours.tags_description')}</p>
    </div>
  </div>

  <!-- Form Submit -->
  <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
    <div class="flex justify-end space-x-4">
      <Button href="/agent/tours" variant="outline" type="button">Cancel</Button>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {#if mode === 'add'}
          {isSubmitting ? $t('agent.tours.updating') : $t('agent.tours.submit')}
        {:else}
          {isSubmitting
            ? $t('agent.tours.edit_tour.updating')
            : $t('agent.tours.edit_tour.update_tour')}
        {/if}
      </Button>
    </div>
  </div>
</form>
