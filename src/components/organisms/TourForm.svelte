<script lang="ts">
  import { t } from '$lib/i18n';
  import { createEventDispatcher } from 'svelte';
  import Button from '../atoms/Button.svelte';
  import BasicInfoSection from './form-sections/BasicInfoSection.svelte';
  import ItinerarySection from './form-sections/ItinerarySection.svelte';
  import ImageUploadSection from './form-sections/ImageUploadSection.svelte';
  import HighlightsSection from './form-sections/HighlightsSection.svelte';
  import InclusionsExclusionsSection from './form-sections/InclusionsExclusionsSection.svelte';
  import TagsSection from './form-sections/TagsSection.svelte';
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
    shortDescription: initialData.shortDescription || '',
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

  // Image handling state
  let mainImageFile: File | null = null;
  let galleryImageFiles: File[] = [];
  let itineraryImageFiles: (File | null)[] = [];
  let accommodationImageFiles: File[][] = [];
  let mealsImageFiles: File[][][] = [];

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

    // Add tour data
    Object.entries(tourData).forEach(([key, value]) => {
      if (key === 'itinerary' || key === 'images') {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(
            `${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`,
            String(subValue)
          );
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

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

    dispatch('submit', { formData, tourData });
  }

  // Initialize image arrays when itinerary changes
  $: {
    if (tourData.itinerary) {
      const itineraryLength = tourData.itinerary.length;

      // Resize arrays if needed
      if (itineraryImageFiles.length !== itineraryLength) {
        itineraryImageFiles = new Array(itineraryLength).fill(null);
      }
      if (accommodationImageFiles.length !== itineraryLength) {
        accommodationImageFiles = Array.from({ length: itineraryLength }, () => []);
      }
      if (mealsImageFiles.length !== itineraryLength) {
        mealsImageFiles = tourData.itinerary.map(day => (day.meals || []).map(() => []));
      }
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-8">
  <BasicInfoSection bind:tourData {mode} />

  <ItinerarySection
    bind:tourData
    bind:itineraryImageFiles
    bind:accommodationImageFiles
    bind:mealsImageFiles
  />

  <HighlightsSection bind:highlights={tourData.highlights} />

  <InclusionsExclusionsSection
    bind:inclusions={tourData.inclusions}
    bind:exclusions={tourData.exclusions}
  />

  <ImageUploadSection
    bind:mainImageFile
    bind:galleryImageFiles
    existingMainImage={tourData.images.main}
    existingGalleryImages={tourData.images.gallery}
    {mode}
  />

  <TagsSection bind:tags={tourData.tags} />

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
