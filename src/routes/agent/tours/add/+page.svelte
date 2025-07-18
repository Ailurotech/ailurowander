<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../../../components/atoms/Section.svelte';
  import TourFormShared from '../../../../components/organisms/TourFormShared.svelte';
  import { goto } from '$app/navigation';
  
  // Form submission state
  let isSubmitting = false;
  let submitMessage = '';
  let submitError = '';
  
  // Handle form submission
  async function handleSubmit(event: CustomEvent) {
    const { formData } = event.detail;
    
    isSubmitting = true;
    submitError = '';
    submitMessage = '';
    
    try {
      const response = await fetch('/api/tours/create', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        submitMessage = $t('agent.tours.success');
        // Redirect to tours page after a short delay
        setTimeout(() => {
          goto('/agent/tours');
        }, 2000);
      } else {
        submitError = result.error || $t('agent.tours.error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      submitError = $t('agent.tours.error');
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
  <title>{$t('agent.tours.add_new')} | {$t('site.title')}</title>
</svelte:head>

<Section variant="light" className="py-8">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-heading font-bold mb-2">{$t('agent.tours.add_new')}</h1>
        <p class="text-neutral-600">{$t('agent.tours.create_new_tour_description')}</p>
      </div>
      
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
        mode="add"
        {isSubmitting}
        on:submit={handleSubmit}
        on:error={handleError}
      />
      </div>
    </div>
</Section> 