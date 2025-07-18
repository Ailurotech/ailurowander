<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Section from '../../../../../components/atoms/Section.svelte';
  import TourFormShared from '../../../../../components/organisms/TourFormShared.svelte';
  import { goto } from '$app/navigation';
  import type { TourFormData } from '$lib/types/tour';
  
  // Tour ID from URL
  const tourId = $page.params.id;
  
  // Form state
  let isLoading = true;
  let isSubmitting = false;
  let submitMessage = '';
  let submitError = '';
  let loadError = '';
  let tourData: Partial<TourFormData> = {};
  
  // Load tour data on mount
  onMount(async () => {
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        loadError = errorData.error || 'Failed to load tour data';
        return;
      }
      
      // API returns tour data directly, not wrapped in success/data
      const tour = await response.json();
      tourData = tour;
      
    } catch (error) {
      console.error('Load error:', error);
      loadError = 'Failed to load tour data';
    } finally {
      isLoading = false;
    }
  });
  
  // Handle form submission
  async function handleSubmit(event: CustomEvent) {
    const { formData } = event.detail;
    
    isSubmitting = true;
    submitError = '';
    submitMessage = '';
    
    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        submitError = errorData.error || $t('agent.tours.edit_tour.update_failed');
        return;
      }
      
      // API returns updated tour directly on success
      const updatedTour = await response.json();
      submitMessage = $t('agent.tours.edit_tour.update_success');
      
      // Redirect to tours page after a short delay
      setTimeout(() => {
        goto('/agent/tours');
      }, 2000);
      
    } catch (error) {
      console.error('Submit error:', error);
      submitError = $t('agent.tours.edit_tour.update_failed');
    } finally {
      isSubmitting = false;
    }
  }
  
  // Handle form errors
  function handleError(event: CustomEvent) {
    submitError = event.detail.message;
  }
</script>

<svelte:head>
  <title>{$t('agent.tours.edit_tour.title')} | {$t('site.title')}</title>
</svelte:head>

<Section variant="light" className="py-8">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <a 
            href="/agent/tours" 
            class="text-primary hover:text-primary-dark flex items-center"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {$t('agent.tours.edit_tour.back_to_tours')}
          </a>
        </div>
        <h1 class="text-3xl font-heading font-bold mb-2">{$t('agent.tours.edit_tour.title')}</h1>
        <p class="text-neutral-600">Update your tour details and settings</p>
      </div>
      
      <!-- Loading State -->
      {#if isLoading}
        <div class="flex items-center justify-center py-12">
          <div class="text-center">
            <svg class="animate-spin h-8 w-8 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-neutral-600">{$t('agent.tours.edit_tour.loading')}</p>
          </div>
        </div>
      {:else if loadError}
        <!-- Load Error -->
        <div class="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-red-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="text-red-800 font-medium">Error Loading Tour</h3>
              <p class="text-red-700 mt-1">{loadError}</p>
            </div>
          </div>
        </div>
      {:else}
        <!-- Success/Error Messages -->
        {#if submitMessage}
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-green-800 font-medium">{submitMessage}</span>
            </div>
          </div>
        {/if}
        
        {#if submitError}
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-red-800 font-medium">{submitError}</span>
            </div>
          </div>
        {/if}
        
        <!-- Tour Form -->
        <TourFormShared 
          mode="edit"
          initialData={tourData}
          {isSubmitting}
          on:submit={handleSubmit}
          on:error={handleError}
        />
      {/if}
    </div>
  </div>
</Section> 