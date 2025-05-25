<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Section from '../../../../../components/atoms/Section.svelte';
  import Button from '../../../../../components/atoms/Button.svelte';
  import Divider from '../../../../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../../../../components/atoms/ChineseIcon.svelte';
  import { goto } from '$app/navigation';
  
  // Tour ID from URL
  const tourId = $page.params.id;
  
  // Form state with default values (will be replaced with actual tour data)
  let tourData: {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    duration: { days: number; nights: number };
    price: { amount: number; currency: string };
    destination: string;
    maxGroupSize: number;
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary: { day: number; title: string; description: string }[];
    images: { main: string; gallery: string[] };
    featured: boolean;
    discount: number;
    tags: string[];
  } = {
    _id: '',
    title: '',
    description: '',
    shortDescription: '',
    duration: { days: 0, nights: 0 },
    price: { amount: 0, currency: 'USD' },
    destination: '',
    maxGroupSize: 10,
    highlights: [],
    inclusions: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
    exclusions: ['International flights', 'Travel insurance', 'Personal expenses'],
    itinerary: [{ day: 1, title: 'Arrival Day', description: 'Welcome to China! Transfer to hotel and rest.' }],
    images: { main: '', gallery: [] },
    featured: false,
    discount: 0,
    tags: []
  };
  
  // Available icons for tour selection
  const availableIcons = [
    { name: 'great-wall' as const, label: 'Great Wall' },
    { name: 'forbidden-city' as const, label: 'Forbidden City' },
    { name: 'terracotta' as const, label: 'Terracotta Warriors' },
    { name: 'temple' as const, label: 'Temple' },
    { name: 'pagoda' as const, label: 'Pagoda' },
    { name: 'dragon' as const, label: 'Dragon' },
    { name: 'panda' as const, label: 'Panda' },
    { name: 'lantern' as const, label: 'Lantern' },
    { name: 'bamboo' as const, label: 'Bamboo' },
    { name: 'mountains' as const, label: 'Mountains' }
  ];
  
  // Selected tour icon
  let selectedIcon: 'great-wall' | 'forbidden-city' | 'terracotta' | 
                   'temple' | 'pagoda' | 'dragon' | 'panda' | 
                   'lantern' | 'bamboo' | 'mountains' = 'great-wall';
  
  // Form state
  let isLoading = true;
  let loadError = '';
  let errors = {};
  let isSubmitting = false;
  let submitSuccess = false;
  let submitError = '';
  
  // Add these variables at the top of the script section
  let mainImageFile: File | null = null;
  let galleryImageFiles: File[] = [];
  let mainImagePreview: string | null = null;
  let galleryImagePreviews: string[] = [];
  
  // Load tour data
  async function loadTourData() {
    isLoading = true;
    loadError = '';
    
    try {
      console.log(`Loading tour data for ID: ${tourId}`);
      const response = await fetch(`/api/tours/${tourId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load tour: ${response.status}`);
      }
      
      const tour = await response.json();
      console.log('Tour data loaded:', tour);
      
      // Map the API data to our form structure
      tourData = {
        _id: tour._id || '',
        title: tour.title || '',
        description: tour.description || '',
        shortDescription: tour.shortDescription || '',
        duration: tour.duration || { days: 0, nights: 0 },
        price: tour.price || { amount: 0, currency: 'USD' },
        destination: tour.destination || '',
        maxGroupSize: tour.maxGroupSize || 10,
        inclusions: tour.inclusions || ['Hotel accommodation', 'English speaking guide', 'Transportation'],
        exclusions: tour.exclusions || ['International flights', 'Travel insurance', 'Personal expenses'],
        itinerary: tour.itinerary || [{ day: 1, title: 'Arrival Day', description: 'Welcome to China! Transfer to hotel and rest.' }],
        images: tour.images || { main: '', gallery: [] },
        featured: tour.featured || false,
        discount: tour.discount || 0,
        tags: tour.tags || [],
        highlights: tour.highlights || []
      };
      
      // Set the icon
      selectedIcon = tour.iconType || 'great-wall';
      
    } catch (error) {
      console.error('Error loading tour:', error);
      loadError = error instanceof Error ? error.message : 'Failed to load tour data';
    } finally {
      isLoading = false;
    }
  }
  
  // Add a new itinerary day
  function addItineraryDay() {
    const newDay = tourData.itinerary.length + 1;
    tourData.itinerary = [...tourData.itinerary, { 
      day: newDay, 
      title: `Day ${newDay}`, 
      description: '' 
    }];
  }
  
  // Remove an itinerary day
  function removeItineraryDay(index: number) {
    tourData.itinerary = tourData.itinerary.filter((_, i) => i !== index);
    // Update day numbers
    tourData.itinerary = tourData.itinerary.map((item, i) => ({
      ...item,
      day: i + 1
    }));
  }
  
  // Add a new included item
  function addIncludedItem() {
    tourData.inclusions = [...tourData.inclusions, ''];
  }
  
  // Remove an included item
  function removeIncludedItem(index: number) {
    tourData.inclusions = tourData.inclusions.filter((_, i) => i !== index);
  }
  
  // Add a new not included item
  function addNotIncludedItem() {
    tourData.exclusions = [...tourData.exclusions, ''];
  }
  
  // Remove a not included item
  function removeNotIncludedItem(index: number) {
    tourData.exclusions = tourData.exclusions.filter((_, i) => i !== index);
  }
  
  // Add a new highlight item
  function addHighlightItem() {
    tourData.highlights = [...tourData.highlights, ''];
  }
  
  // Remove a highlight item
  function removeHighlightItem(index: number) {
    tourData.highlights = tourData.highlights.filter((_, i) => i !== index);
  }
  
  // Add these functions before handleSubmit
  function handleMainImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      mainImageFile = input.files[0];
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        mainImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(mainImageFile);
    }
  }

  function handleGalleryImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      galleryImageFiles = [...galleryImageFiles, ...newFiles];
      
      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          galleryImagePreviews = [...galleryImagePreviews, e.target?.result as string];
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function removeGalleryImage(index: number) {
    galleryImageFiles = galleryImageFiles.filter((_, i) => i !== index);
    galleryImagePreviews = galleryImagePreviews.filter((_, i) => i !== index);
  }
  
  // Update the handleSubmit function
  async function handleSubmit() {
    isSubmitting = true;
    submitSuccess = false;
    submitError = '';
    
    try {
      // Validate required fields
      if (!tourData.title || !tourData.description || !tourData.destination) {
        throw new Error('Please fill out all required fields');
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add tour data
      formData.append('title', tourData.title);
      formData.append('description', tourData.description);
      formData.append('shortDescription', tourData.shortDescription);
      formData.append('destination', tourData.destination);
      formData.append('durationDays', tourData.duration.days.toString());
      formData.append('durationNights', tourData.duration.nights.toString());
      formData.append('price', tourData.price.amount.toString());
      formData.append('featured', tourData.featured.toString());
      formData.append('itinerary', JSON.stringify(tourData.itinerary));
      
      // Add highlights
      tourData.highlights.forEach(item => {
        formData.append('highlights', item);
      });
      
      // Add inclusions and exclusions
      tourData.inclusions.forEach(item => {
        formData.append('included', item);
      });
      tourData.exclusions.forEach(item => {
        formData.append('notIncluded', item);
      });
      
      // Add images if they've been changed
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      }
      galleryImageFiles.forEach(file => {
        formData.append('galleryImages', file);
      });
      
      // Make an API call to update the tour
      const response = await fetch(`/api/tours/${tourData._id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Failed to update tour: ${response.status}`);
      }
      
      const updatedTour = await response.json();
      console.log('Tour updated successfully:', updatedTour);
      
      // Show success message
      submitSuccess = true;
      
      // Wait for 2 seconds to show the success message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate back to tours page
      goto('/agent/tours');
      
    } catch (error) {
      submitError = error instanceof Error ? error.message : 'Failed to update tour. Please try again.';
      console.error('Error updating tour:', error);
    } finally {
      isSubmitting = false;
    }
  }
  
  // Load tour data on component mount
  onMount(() => {
    loadTourData();
  });
</script>

<svelte:head>
  <title>Edit Tour | Agent Dashboard</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<Section variant="light" spacing="md">
  <svelte:fragment slot="header">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-heading font-bold">Edit Tour</h1>
      <Button href="/agent/tours" variant="outline">Back to Tours</Button>
    </div>
    <Divider type="simple" />
  </svelte:fragment>
  
  {#if isLoading}
    <div class="py-8 text-center">
      <p class="text-lg">Loading tour data...</p>
    </div>
  {:else if loadError}
    <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {loadError}
          </p>
          <div class="mt-2">
            <button 
              class="text-primary font-medium" 
              on:click={loadTourData}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    {#if submitSuccess}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div class="flex items-center justify-center mb-4">
            <svg class="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-center mb-2">Tour Updated Successfully!</h3>
          <p class="text-neutral-600 text-center">Redirecting to tours page...</p>
        </div>
      </div>
    {/if}
    
    {#if submitError}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div class="flex items-center justify-center mb-4">
            <svg class="h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-center mb-2">Update Failed</h3>
          <p class="text-neutral-600 text-center mb-4">{submitError}</p>
          <div class="flex justify-center">
            <button 
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              on:click={() => submitError = ''}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-8">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 class="text-xl font-heading font-bold mb-4">Basic Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="title" class="form-label">Tour Title*</label>
            <input 
              type="text" 
              id="title" 
              bind:value={tourData.title} 
              required
              class="input w-full" 
              placeholder="e.g. Classic Beijing & Shanghai Tour"
            />
          </div>
          
          <div class="form-group">
            <label for="destination" class="form-label">Main Location*</label>
            <input 
              type="text" 
              id="destination" 
              bind:value={tourData.destination} 
              required
              class="input w-full" 
              placeholder="e.g. Beijing, Shanghai"
            />
          </div>
          
          <div class="form-group">
            <label for="duration" class="form-label">Duration (Days/Nights)*</label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <input 
                  type="number" 
                  id="duration-days" 
                  bind:value={tourData.duration.days} 
                  required
                  min="1"
                  class="input w-full" 
                  placeholder="Days"
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
                  placeholder="Nights"
                />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="price" class="form-label">Price (USD)*</label>
            <input 
              type="number" 
              id="price" 
              bind:value={tourData.price.amount} 
              required
              min="0"
              class="input w-full" 
              placeholder="e.g. 1299"
            />
          </div>
          
          <div class="form-group">
            <label for="discount" class="form-label">Discount (USD)</label>
            <input 
              type="number" 
              id="discount" 
              bind:value={tourData.discount} 
              min="0"
              class="input w-full" 
              placeholder="e.g. 200"
            />
          </div>
          
          <div class="form-group">
            <label for="max-group-size" class="form-label">Max Group Size</label>
            <input 
              type="number" 
              id="max-group-size" 
              bind:value={tourData.maxGroupSize} 
              min="1"
              class="input w-full" 
              placeholder="e.g. 12"
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
              Featured Tour
            </label>
          </div>
          <p class="text-xs text-neutral-500 mt-1">Featured tours are highlighted on the home page.</p>
        </div>
      </div>
      
      <!-- Tour Icon Selection -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 class="text-xl font-heading font-bold mb-4">Tour Icon</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {#each availableIcons as icon}
            <button 
              type="button"
              class="flex flex-col items-center p-3 rounded-lg border-2 transition-colors {selectedIcon === icon.name ? 'border-primary bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'}"
              on:click={() => selectedIcon = icon.name}
            >
              <ChineseIcon icon={icon.name} size="lg" />
              <span class="mt-2 text-sm">{icon.label}</span>
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Tour Description -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 class="text-xl font-heading font-bold mb-4">Tour Description</h2>
        
        <div class="form-group">
          <label for="shortDescription" class="form-label">Short Description (Card Preview)*</label>
          <input 
            type="text" 
            id="shortDescription" 
            bind:value={tourData.shortDescription} 
            required
            class="input w-full" 
            placeholder="Brief description for tour cards (max 150 characters)"
            maxlength="150"
          />
          <div class="text-xs text-neutral-500 mt-1">
            {tourData.shortDescription.length}/150 characters
          </div>
        </div>
        
        <div class="form-group mt-4">
          <label for="description" class="form-label">Full Description*</label>
          <textarea 
            id="description" 
            bind:value={tourData.description} 
            required
            class="input w-full h-32" 
            placeholder="Detailed tour description with information about attractions, experience, etc."
          ></textarea>
        </div>
      </div>
      
      <!-- Tour Itinerary -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-heading font-bold">Tour Itinerary</h2>
          <button 
            type="button"
            class="btn btn--outline"
            on:click={addItineraryDay}
          >
            Add Day
          </button>
        </div>
        
        <div class="space-y-6">
          {#each tourData.itinerary as day, index}
            <div class="p-4 border border-neutral-200 rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-heading font-medium">Day {day.day}</h3>
                <button 
                  type="button"
                  class="text-red-600 hover:text-red-800"
                  on:click={() => removeItineraryDay(index)}
                  disabled={tourData.itinerary.length === 1}
                >
                  Remove
                </button>
              </div>
              
              <div class="form-group">
                <label for={`day-${index}-title`} class="form-label">Day Title*</label>
                <input 
                  type="text" 
                  id={`day-${index}-title`} 
                  bind:value={tourData.itinerary[index].title} 
                  required
                  class="input w-full" 
                  placeholder="e.g. Exploring the Forbidden City"
                />
              </div>
              
              <div class="form-group mt-3">
                <label for={`day-${index}-description`} class="form-label">Description*</label>
                <textarea 
                  id={`day-${index}-description`} 
                  bind:value={tourData.itinerary[index].description} 
                  required
                  class="input w-full h-24" 
                  placeholder="Describe the activities and sights for this day of the tour"
                ></textarea>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Tour Highlights -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-heading font-bold">Tour Highlights</h2>
          <button 
            type="button"
            class="btn btn--outline"
            on:click={addHighlightItem}
          >
            Add Highlight
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
                placeholder="e.g. Great Wall of China"
              />
              <button 
                type="button"
                class="btn btn--outline text-red-600 border-red-600 px-3"
                on:click={() => removeHighlightItem(index)}
              >
                Remove
              </button>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Inclusions & Exclusions -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 class="text-xl font-heading font-bold mb-4">Inclusions & Exclusions</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-heading font-medium">What's Included</h3>
              <button 
                type="button"
                class="text-xs btn btn--secondary"
                on:click={addIncludedItem}
              >
                Add Item
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
                    placeholder="e.g. Hotel accommodations"
                  />
                  <button 
                    type="button"
                    class="btn btn--outline text-red-600 border-red-600 px-3"
                    on:click={() => removeIncludedItem(index)}
                    disabled={tourData.inclusions.length === 1}
                  >
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-heading font-medium">What's Not Included</h3>
              <button 
                type="button"
                class="text-xs btn btn--secondary"
                on:click={addNotIncludedItem}
              >
                Add Item
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
                    placeholder="e.g. International flights"
                  />
                  <button 
                    type="button"
                    class="btn btn--outline text-red-600 border-red-600 px-3"
                    on:click={() => removeNotIncludedItem(index)}
                    disabled={tourData.exclusions.length === 1}
                  >
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Images -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 class="text-xl font-heading font-bold mb-4">Images</h2>
        
        <div class="form-group">
          <label for="main-image" class="form-label">Main Image</label>
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
              class="cursor-pointer inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg class="h-5 w-5 mr-2 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Change Main Image
            </label>
          </div>
          {#if mainImagePreview}
            <div class="mt-4">
              <img 
                src={mainImagePreview} 
                alt="Main image preview" 
                class="max-w-xs rounded-lg shadow-sm"
              />
            </div>
          {:else if tourData.images.main}
            <div class="mt-4">
              <img 
                src={tourData.images.main} 
                alt="Current main image" 
                class="max-w-xs rounded-lg shadow-sm"
              />
            </div>
          {/if}
        </div>
        
        <div class="form-group mt-6">
          <label class="form-label">Gallery Images</label>
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
              class="cursor-pointer inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg class="h-5 w-5 mr-2 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Gallery Images
            </label>
          </div>
          
          {#if galleryImagePreviews.length > 0 || tourData.images.gallery.length > 0}
            <div class="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each galleryImagePreviews as preview, index}
                <div class="relative group">
                  <img 
                    src={preview} 
                    alt="Gallery image preview" 
                    class="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button 
                    type="button"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    on:click={() => removeGalleryImage(index)}
                  >
                    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              {/each}
              {#each tourData.images.gallery as image, index}
                <div class="relative group">
                  <img 
                    src={image} 
                    alt="Gallery image" 
                    class="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button 
                    type="button"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    on:click={() => tourData.images.gallery = tourData.images.gallery.filter((_, i) => i !== index)}
                  >
                    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Tags -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <h2 class="text-xl font-heading font-bold mb-4">Tags for Search</h2>
        
        <div class="form-group">
          <label for="tags" class="form-label">Tags (comma separated)</label>
          <input 
            type="text" 
            id="tags" 
            class="input w-full" 
            placeholder="e.g. family, adventure, culture"
            value={tourData.tags.join(', ')}
            on:blur={(e) => {
              // Convert comma-separated tags to array
              const inputValue = (e.target as HTMLInputElement).value;
              tourData.tags = inputValue
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag !== '');
            }}
          />
          <p class="text-xs text-neutral-500 mt-1">These tags help users find your tour in searches. Enter multiple tags separated by commas.</p>
        </div>
      </div>
      
      <!-- Form Submit -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
        <div class="flex justify-end space-x-4">
          <Button 
            href="/agent/tours" 
            variant="outline" 
            type="button"
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating Tour...' : 'Update Tour'}
          </Button>
        </div>
      </div>
    </form>
  {/if}
</Section> 