<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../../../components/atoms/Section.svelte';
  import Button from '../../../../components/atoms/Button.svelte';
  import Divider from '../../../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../../../components/atoms/ChineseIcon.svelte';
  import { onMount } from 'svelte';
  
  // Form state
  let tourData = {
    title: '',
    description: '',
    shortDescription: '',
    duration: { days: 0, nights: 0 },
    price: { amount: 0, currency: 'USD' },
    destination: '',
    maxGroupSize: 10,
    inclusions: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
    exclusions: ['International flights', 'Travel insurance', 'Personal expenses'],
    itinerary: [{ day: 1, title: 'Arrival Day', description: 'Welcome to China! Transfer to hotel and rest.' }],
    images: { main: '', gallery: [] as string[] },
    featured: false,
    discount: 0,
    tags: [] as string[]
  };
  
  // Destination state
  let showDestinationDropdown = false;
  let isLoadingDestinations = true;
  let destinationError = '';
  let previousDestinations: string[] = [];
  
  // Load previous destinations on component mount
  onMount(async () => {
    try {
      const response = await fetch('/api/tours/destinations');
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      previousDestinations = await response.json();
    } catch (error) {
      console.error('Error loading destinations:', error);
      destinationError = 'Failed to load previous destinations';
    } finally {
      isLoadingDestinations = false;
    }
  });
  
  // Handle destination selection
  function selectDestination(destination: string) {
    tourData.destination = destination;
    showDestinationDropdown = false;
  }
  
  // Filter destinations based on input
  $: filteredDestinations = tourData.destination
    ? previousDestinations.filter(dest => 
        dest.toLowerCase().includes(tourData.destination.toLowerCase())
      )
    : previousDestinations;
  
  // Load existing destinations on component mount
  let existingDestinations: string[] = [];
  let newDestination = '';
  
  // Handle adding new destination
  async function addNewDestination() {
    if (!newDestination.trim()) return;

    try {
      const response = await fetch('/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDestination.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to add destination');
      }

      const addedDestination = await response.json();
      existingDestinations = [...existingDestinations, addedDestination.name];
      tourData.destination = addedDestination.name;
      newDestination = '';
      showDestinationDropdown = false;
    } catch (error) {
      console.error('Error adding destination:', error);
      destinationError = 'Failed to add new destination';
    }
  }
  
  // Destination search state
  let destinationSearch = '';
  let destinationSuggestions: Array<{ description: string; place_id: string }> = [];
  let showDestinationSuggestions = false;
  let isSearching = false;
  let searchError = '';
  
  // Google Places API configuration
  const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  const CHINA_BOUNDS = {
    north: 53.5586,
    south: 18.1597,
    east: 135.0260,
    west: 73.4467
  };
  
  // Common destinations in China
  const commonDestinations = [
    'Beijing',
    'Shanghai',
    'Xian',
    'Chengdu',
    'Guilin',
    'Hangzhou',
    'Suzhou',
    'Lhasa',
    'Harbin',
    'Kunming',
    'Zhangjiajie',
    'Huangshan',
    'Yangtze River',
    'Great Wall',
    'Forbidden City',
    'Terracotta Warriors',
    'Panda Base',
    'West Lake',
    'Yellow Mountain',
    'Tibet'
  ];
  
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
  
  // Form validation state
  let errors = {};
  let isSubmitting = false;
  let submitSuccess = false;
  let submitError = '';
  
  // Add these variables at the top of the script section
  let mainImageFile: File | null = null;
  let galleryImageFiles: File[] = [];
  let mainImagePreview: string | null = null;
  let galleryImagePreviews: string[] = [];
  
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
  
  // Handle destination search with Google Places API
  async function handleDestinationSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    destinationSearch = input.value;
    
    if (destinationSearch.length < 2) {
      showDestinationSuggestions = false;
      return;
    }

    isSearching = true;
    searchError = '';

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
        `input=${encodeURIComponent(destinationSearch)}` +
        `&key=${GOOGLE_PLACES_API_KEY}` +
        `&components=country:cn` + // Restrict to China
        `&bounds=${CHINA_BOUNDS.north},${CHINA_BOUNDS.east}|${CHINA_BOUNDS.south},${CHINA_BOUNDS.west}` +
        `&types=(cities|locality|sublocality|administrative_area_level_1)`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        destinationSuggestions = data.predictions.map((prediction: any) => ({
          description: prediction.description,
          place_id: prediction.place_id
        }));
        showDestinationSuggestions = true;
      } else {
        destinationSuggestions = [];
        showDestinationSuggestions = false;
      }
    } catch (error) {
      console.error('Error searching destinations:', error);
      searchError = 'Failed to search destinations. Please try again.';
      showDestinationSuggestions = false;
    } finally {
      isSearching = false;
    }
  }

  // Get place details
  async function getPlaceDetails(placeId: string) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}` +
        `&key=${GOOGLE_PLACES_API_KEY}` +
        `&fields=formatted_address,name`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch place details');
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
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
      
      // Validate main image
      if (!mainImageFile) {
        throw new Error('Please upload a main image');
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
      
      // Add images
      formData.append('mainImage', mainImageFile);
      galleryImageFiles.forEach(file => {
        formData.append('galleryImages', file);
      });
      
      // Make an API call to create the tour
      const response = await fetch('/api/tours/create', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Failed to create tour: ${response.status}`);
      }
      
      const newTour = await response.json();
      console.log('Tour created successfully:', newTour);
      
      // Reset form after successful submission
      submitSuccess = true;
      tourData = {
        title: '',
        description: '',
        shortDescription: '',
        duration: { days: 0, nights: 0 },
        price: { amount: 0, currency: 'USD' },
        destination: '',
        maxGroupSize: 10,
        inclusions: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
        exclusions: ['International flights', 'Travel insurance', 'Personal expenses'],
        itinerary: [{ day: 1, title: 'Arrival Day', description: 'Welcome to China! Transfer to hotel and rest.' }],
        images: { main: '', gallery: [] as string[] },
        featured: false,
        discount: 0,
        tags: [] as string[]
      };
      selectedIcon = 'great-wall';
      mainImageFile = null;
      galleryImageFiles = [];
      mainImagePreview = null;
      galleryImagePreviews = [];
      
    } catch (error) {
      submitError = error instanceof Error ? error.message : 'Failed to create tour. Please try again.';
      console.error('Error creating tour:', error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Add New Tour | Agent Dashboard</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<Section variant="light" spacing="md">
  <svelte:fragment slot="header">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-heading font-bold">Add New Tour</h1>
      <Button href="/agent/tours" variant="outline">Back to Tours</Button>
    </div>
    <Divider type="simple" />
  </svelte:fragment>
  
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
            Tour was successfully created!
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
          <div class="relative">
            <input 
              type="text" 
              id="destination" 
              bind:value={tourData.destination}
              on:focus={() => showDestinationDropdown = true}
              required
              class="input w-full" 
              placeholder="Enter or select a destination"
            />
            {#if showDestinationDropdown && previousDestinations.length > 0}
              <div class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-neutral-200 max-h-60 overflow-y-auto">
                {#if isLoadingDestinations}
                  <div class="p-4 text-center text-neutral-500">
                    Loading destinations...
                  </div>
                {:else if filteredDestinations.length === 0}
                  <div class="p-4 text-center text-neutral-500">
                    No matching destinations found
                  </div>
                {:else}
                  <div class="py-1">
                    <div class="px-4 py-2 text-sm font-medium text-neutral-500 border-b border-neutral-200">
                      Previous destinations
                    </div>
                    {#each filteredDestinations as destination}
                      <button
                        type="button"
                        class="w-full px-4 py-2 text-left hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
                        on:click={() => selectDestination(destination)}
                      >
                        {destination}
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
            {#if destinationError}
              <p class="text-sm text-red-500 mt-1">{destinationError}</p>
            {/if}
          </div>
          <p class="text-xs text-neutral-500 mt-1">Enter a new destination or select from previously used locations.</p>
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
          <label for="icon" class="form-label">Tour Icon</label>
          <div class="grid grid-cols-5 gap-2 mt-2">
            {#each availableIcons as icon}
              <button 
                type="button"
                class="flex flex-col items-center p-2 rounded border {selectedIcon === icon.name ? 'border-primary bg-primary/5' : 'border-neutral-200'}"
                on:click={() => selectedIcon = icon.name}
              >
                <ChineseIcon icon={icon.name} size="md" color={selectedIcon === icon.name ? '#B91C1C' : '#292524'} />
                <span class="text-xs mt-1">{icon.label}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div class="form-group">
          <label for="price" class="form-label">Price*</label>
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
                placeholder="Amount"
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
      
      <div class="form-group">
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
        <h2 class="text-xl font-heading font-bold">Itinerary</h2>
        <Button 
          variant="secondary" 
          size="sm" 
          on:click={addItineraryDay} 
          type="button"
        >
          Add Day
        </Button>
      </div>
      
      {#each tourData.itinerary as day, index}
        <div class="border border-neutral-200 rounded-md p-4 mb-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold">Day {day.day}</h3>
            {#if tourData.itinerary.length > 1}
              <button 
                type="button" 
                class="text-red-500 hover:text-red-700"
                on:click={() => removeItineraryDay(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            {/if}
          </div>
          
          <div class="form-group mb-3">
            <label class="form-label">Day Title*</label>
            <input 
              type="text" 
              bind:value={day.title} 
              required
              class="input w-full" 
              placeholder="e.g. Forbidden City & Temple of Heaven"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Day Description*</label>
            <textarea 
              bind:value={day.description} 
              required
              class="input w-full h-24" 
              placeholder="Details about activities, meals, accommodations, etc."
            ></textarea>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Inclusions & Exclusions -->
    <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
      <h2 class="text-xl font-heading font-bold mb-4">Inclusions & Exclusions</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Included -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">What's Included</h3>
            <button 
              type="button" 
              class="text-primary"
              on:click={addIncludedItem}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {#each tourData.inclusions as item, index}
            <div class="flex items-center mb-2">
              <input 
                type="text" 
                bind:value={tourData.inclusions[index]} 
                class="input w-full" 
                placeholder="e.g. Breakfast at hotel"
              />
              <button 
                type="button" 
                class="ml-2 text-red-500 hover:text-red-700"
                on:click={() => removeIncludedItem(index)}
                disabled={tourData.inclusions.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          {/each}
        </div>
        
        <!-- Not Included -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">What's Not Included</h3>
            <button 
              type="button" 
              class="text-primary"
              on:click={addNotIncludedItem}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {#each tourData.exclusions as item, index}
            <div class="flex items-center mb-2">
              <input 
                type="text" 
                bind:value={tourData.exclusions[index]} 
                class="input w-full" 
                placeholder="e.g. International flights"
              />
              <button 
                type="button" 
                class="ml-2 text-red-500 hover:text-red-700"
                on:click={() => removeNotIncludedItem(index)}
                disabled={tourData.exclusions.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- Images -->
    <div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
      <h2 class="text-xl font-heading font-bold mb-4">Images</h2>
      
      <div class="form-group">
        <label for="main-image" class="form-label">Main Image*</label>
        <div class="mt-2">
          <input 
            type="file" 
            id="main-image" 
            accept="image/*"
            on:change={handleMainImageChange}
            required
            class="hidden"
          />
          <label 
            for="main-image" 
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg class="h-5 w-5 mr-2 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose Main Image
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
        
        {#if galleryImagePreviews.length > 0}
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
          {isSubmitting ? 'Creating Tour...' : 'Create Tour'}
        </Button>
      </div>
    </div>
  </form>
</Section> 