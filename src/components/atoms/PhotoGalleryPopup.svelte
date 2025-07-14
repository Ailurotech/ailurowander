<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  
  export let images: string[] = [];
  export let initialIndex: number = 0;
  export let isOpen: boolean = false;
  
  const dispatch = createEventDispatcher();
  
  let currentIndex = initialIndex;
  
  // Update current index when initial index changes
  $: if (isOpen && initialIndex !== currentIndex) {
    currentIndex = initialIndex;
  }
  
  // Ensure we have valid images array and current index
  $: if (images && images.length > 0) {
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }
  } else {
    currentIndex = 0;
  }
  
  // Debug logging
  $: if (isOpen) {
    console.log('Gallery opened with images:', images, 'Current index:', currentIndex, 'Images length:', images?.length);
  }
  
  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        previous();
        break;
      case 'ArrowRight':
        next();
        break;
    }
  }
  
  // Handle click outside to close
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }
  
  function close() {
    dispatch('close');
  }
  
  function previous() {
    console.log('Previous clicked');
    if (!images || images.length === 0) {
      console.log('No images available');
      return;
    }
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    console.log('Previous: currentIndex:', currentIndex, 'newIndex:', newIndex, 'total images:', images.length);
    currentIndex = newIndex;
  }
  
  function next() {
    console.log('Next clicked');
    if (!images || images.length === 0) {
      console.log('No images available');
      return;
    }
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    console.log('Next: currentIndex:', currentIndex, 'newIndex:', newIndex, 'total images:', images.length);
    currentIndex = newIndex;
  }
  
  function goToImage(index: number) {
    console.log('Go to image clicked, index:', index);
    if (!images || images.length === 0) return;
    if (index < 0 || index >= images.length) return;
    if (index === currentIndex) return;
    
    currentIndex = index;
    console.log('Go to image: new index:', currentIndex, 'Total images:', images.length);
  }
  
  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if isOpen && images && images.length > 0}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="Photo gallery"
  >
    <!-- Modal -->
    <div class="relative max-w-4xl max-h-full w-full h-full flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center text-white mb-4">
        <div class="text-lg font-medium">
          Image {currentIndex + 1} of {images.length}
          <div class="text-sm text-gray-300">Debug: Index {currentIndex}, Total {images.length}</div>
          <button 
            type="button" 
            on:click={() => { 
              console.log('Test button clicked'); 
              currentIndex = (currentIndex + 1) % images.length; 
            }}
            class="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          >
            Test Next
          </button>
        </div>
        <button
          type="button"
          on:click={close}
          class="text-white hover:text-gray-300 transition-colors"
          aria-label="Close gallery"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Main Image Container -->
      <div class="flex-1 relative flex items-center justify-center">
        <!-- Previous Button -->
        {#if images.length > 1}
          <button
            type="button"
            on:click={() => { 
              console.log('Previous button clicked');
              previous(); 
            }}
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        {/if}
        
        <!-- Current Image -->
        <div class="relative w-full h-full flex items-center justify-center">
          {#if images[currentIndex]}
            <img
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              on:error={(e) => {
                console.error('Image failed to load:', images[currentIndex]);
                const target = e.target as HTMLImageElement;
                if (target) {
                  target.style.display = 'none';
                }
              }}
            />
          {:else}
            <div class="text-white text-center">
              <p>No image available</p>
              <p class="text-sm">Index: {currentIndex}, Total: {images.length}</p>
            </div>
          {/if}
        </div>
        
        <!-- Next Button -->
        {#if images.length > 1}
          <button
            type="button"
            on:click={() => { 
              console.log('Next button clicked');
              next(); 
            }}
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all z-10 cursor-pointer"
            aria-label="Next image"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/if}
      </div>
      
      <!-- Thumbnail Navigation -->
      {#if images.length > 1}
        <div class="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2">
          {#each images as image, index}
            <button
              type="button"
              on:click={() => { 
                console.log('Thumbnail clicked, index:', index);
                goToImage(index); 
              }}
              class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all {currentIndex === index ? 'border-white' : 'border-transparent hover:border-gray-300'}"
              aria-label={`Go to image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                class="w-full h-full object-cover"
                on:error={(e) => {
                  console.error('Thumbnail failed to load:', image);
                  const target = e.target as HTMLImageElement;
                  if (target) {
                    target.style.display = 'none';
                  }
                }}
              />
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{:else if isOpen}
  <!-- Fallback when no images -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div class="bg-white rounded-lg p-8 text-center">
      <h3 class="text-xl font-bold mb-4">No Images Available</h3>
      <p class="text-gray-600 mb-4">There are no images to display in the gallery.</p>
      <button
        type="button"
        on:click={close}
        class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
      >
        Close
      </button>
    </div>
  </div>
{/if} 