<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let images: string[] = [];
  export let initialIndex: number = 0;
  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();

  let currentIndex = 0;
  let initialized = false;

  // Touch/Swipe state
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwiping = false;

  // Swipe thresholds
  const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe
  const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity

  // Initialize current index when gallery opens for the first time
  $: if (isOpen && !initialized) {
    if (images && images.length > 0) {
      currentIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
    } else {
      currentIndex = 0;
    }
    initialized = true;
  } else if (!isOpen) {
    initialized = false;
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
    if (!images || images.length === 0) return;
    currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
  }

  function next() {
    if (!images || images.length === 0) return;
    currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
  }

  function goToImage(index: number) {
    if (!images || images.length === 0) return;
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
  }

  // Touch/Swipe handlers
  function handleTouchStart(event: TouchEvent) {
    if (!isOpen || images.length <= 1) return;

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isSwiping = true;
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isSwiping || !isOpen) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only prevent default if this is a horizontal swipe (to preserve vertical scrolling)
    if (absDeltaX > absDeltaY && absDeltaX > 10) {
      event.preventDefault();
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!isSwiping || !isOpen || images.length <= 1) {
      isSwiping = false;
      return;
    }

    const touch = event.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only trigger swipe if horizontal movement is greater than vertical (to avoid conflicts with scrolling)
    if (absDeltaX > absDeltaY && absDeltaX > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        previous();
      } else {
        // Swipe left - go to next image
        next();
      }
    }

    isSwiping = false;
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
          <div>Image {currentIndex + 1} of {images.length}</div>
          {#if images.length > 1}
            <div class="text-sm text-gray-300 md:hidden">Swipe left/right to navigate</div>
          {/if}
        </div>
        <button
          type="button"
          on:click={close}
          class="text-white hover:text-gray-300 transition-colors"
          aria-label="Close gallery"
        >
          <svg
            class="h-6 w-6"
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

      <!-- Main Image Container -->
      <div class="flex-1 relative flex items-center justify-center">
        <!-- Previous Button -->
        {#if images.length > 1}
          <button
            type="button"
            on:click={previous}
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        {/if}

        <!-- Current Image -->
        <div
          class="relative w-full h-full flex items-center justify-center touch-pan-y"
          on:touchstart={handleTouchStart}
          on:touchmove={handleTouchMove}
          on:touchend={handleTouchEnd}
        >
          {#if images[currentIndex]}
            <img
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              class="max-w-full max-h-full object-contain rounded-lg shadow-lg select-none"
              on:error={e => {
                const target = e.target as HTMLImageElement;
                if (target) {
                  target.style.display = 'none';
                }
              }}
            />
          {:else}
            <div class="text-white text-center">
              <p>No image available</p>
            </div>
          {/if}
        </div>

        <!-- Next Button -->
        {#if images.length > 1}
          <button
            type="button"
            on:click={next}
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all z-10 cursor-pointer"
            aria-label="Next image"
          >
            <svg
              class="h-6 w-6"
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
        {/if}
      </div>

      <!-- Thumbnail Navigation -->
      {#if images.length > 1}
        <div class="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2">
          {#each images as image, index}
            <button
              type="button"
              on:click={() => goToImage(index)}
              class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all {currentIndex ===
              index
                ? 'border-white'
                : 'border-transparent hover:border-gray-300'}"
              aria-label={`Go to image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                class="w-full h-full object-cover"
                on:error={e => {
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
