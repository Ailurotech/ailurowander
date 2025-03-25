<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Section from '../../../../../components/atoms/Section.svelte';
  import Button from '../../../../../components/atoms/Button.svelte';
  import Divider from '../../../../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../../../../components/atoms/ChineseIcon.svelte';
  
  // Tour ID from URL
  const tourId = $page.params.id;
  
  // Form state with default values (will be replaced with actual tour data)
  let tourData = {
    title: '',
    description: '',
    shortDescription: '',
    duration: { days: 0, nights: 0 },
    price: { amount: 0, currency: 'USD' },
    destination: '',
    maxGroupSize: 10,
    included: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
    notIncluded: ['International flights', 'Travel insurance', 'Personal expenses'],
    itinerary: [{ day: 1, title: 'Arrival Day', description: 'Welcome to China! Transfer to hotel and rest.' }],
    images: { main: '', gallery: [] as string[] },
    featured: false,
    discount: 0,
    tags: [] as string[]
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
        title: tour.title || '',
        description: tour.description || '',
        shortDescription: tour.shortDescription || '',
        duration: tour.duration || { days: 0, nights: 0 },
        price: tour.price || { amount: 0, currency: 'USD' },
        destination: tour.destination || '',
        maxGroupSize: tour.maxGroupSize || 10,
        included: tour.included || ['Hotel accommodation', 'English speaking guide', 'Transportation'],
        notIncluded: tour.notIncluded || ['International flights', 'Travel insurance', 'Personal expenses'],
        itinerary: tour.itinerary || [{ day: 1, title: 'Arrival Day', description: 'Welcome to China! Transfer to hotel and rest.' }],
        images: tour.images || { main: '', gallery: [] },
        featured: tour.featured || false,
        discount: tour.discount || 0,
        tags: tour.tags || []
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
    tourData.included = [...tourData.included, ''];
  }
  
  // Remove an included item
  function removeIncludedItem(index: number) {
    tourData.included = tourData.included.filter((_, i) => i !== index);
  }
  
  // Add a new not included item
  function addNotIncludedItem() {
    tourData.notIncluded = [...tourData.notIncluded, ''];
  }
  
  // Remove a not included item
  function removeNotIncludedItem(index: number) {
    tourData.notIncluded = tourData.notIncluded.filter((_, i) => i !== index);
  }
  
  // Handle form submission for updating tour
  async function handleSubmit() {
    isSubmitting = true;
    submitSuccess = false;
    submitError = '';
    
    try {
      // Validate required fields
      if (!tourData.title || !tourData.description || !tourData.destination) {
        throw new Error('Please fill out all required fields');
      }
      
      // Ensure required values are numbers
      if (isNaN(tourData.duration.days) || tourData.duration.days <= 0) {
        throw new Error('Please enter a valid duration in days');
      }
      
      if (isNaN(tourData.price.amount) || tourData.price.amount < 0) {
        throw new Error('Please enter a valid price amount');
      }
      
      // Ensure gallery is an array of strings
      if (!Array.isArray(tourData.images.gallery)) {
        tourData.images.gallery = [];
      }
      
      // Format and add tags if destination is not already in tags
      if (!tourData.tags.includes(tourData.destination)) {
        tourData.tags = [tourData.destination, ...tourData.tags];
      }
      
      // Format data for submission
      const formattedTourData = {
        ...tourData,
        iconType: selectedIcon,
      };
      
      console.log('Updating tour data:', formattedTourData);
      
      // Make an API call to update the tour
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedTourData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Failed to update tour: ${response.status}`);
      }
      
      const updatedTour = await response.json();
      console.log('Tour updated successfully:', updatedTour);
      
      // Show success message
      submitSuccess = true;
      
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
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">
              Tour was successfully updated!
            </p>
            <div class="mt-2">
              <Button href="/agent/tours" variant="secondary" size="sm">Return to Tours</Button>
            </div>
          </div>
        </div>
      </div>
    {/if}
    
    {#if submitError}
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {submitError}
            </p>
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
              {#each tourData.included as item, index}
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    bind:value={tourData.included[index]} 
                    required
                    class="input flex-grow" 
                    placeholder="e.g. Hotel accommodations"
                  />
                  <button 
                    type="button"
                    class="btn btn--outline text-red-600 border-red-600 px-3"
                    on:click={() => removeIncludedItem(index)}
                    disabled={tourData.included.length === 1}
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
              {#each tourData.notIncluded as item, index}
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    bind:value={tourData.notIncluded[index]} 
                    required
                    class="input flex-grow" 
                    placeholder="e.g. International flights"
                  />
                  <button 
                    type="button"
                    class="btn btn--outline text-red-600 border-red-600 px-3"
                    on:click={() => removeNotIncludedItem(index)}
                    disabled={tourData.notIncluded.length === 1}
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
          <label for="main-image" class="form-label">Main Image URL*</label>
          <input 
            type="text" 
            id="main-image" 
            bind:value={tourData.images.main} 
            required
            class="input w-full" 
            placeholder="e.g. https://example.com/image.jpg"
          />
          <p class="text-xs text-neutral-500 mt-1">Enter the URL for the main image. For a real application, this would be an image upload function.</p>
        </div>
        
        <div class="form-group mt-4">
          <label class="form-label">Gallery Images</label>
          <div class="space-y-3">
            {#each tourData.images.gallery as image, index}
              <div class="flex gap-2">
                <input 
                  type="text" 
                  bind:value={tourData.images.gallery[index]} 
                  class="input flex-grow" 
                  placeholder="Image URL"
                />
                <button 
                  type="button"
                  class="btn btn--outline text-red-600 border-red-600 px-3"
                  on:click={() => tourData.images.gallery = tourData.images.gallery.filter((_, i) => i !== index)}
                >
                  Remove
                </button>
              </div>
            {/each}
            <button 
              type="button"
              class="btn btn--outline w-full"
              on:click={() => tourData.images.gallery = [...tourData.images.gallery, '']}
            >
              Add Gallery Image
            </button>
          </div>
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