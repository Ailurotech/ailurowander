<script lang="ts">
  import { onMount } from 'svelte';
  import { getImageUrl } from '../../utils/imageUrl';

  interface Province {
    id: string;
    name: string;
    description: string;
  }

  let hoveredProvince: Province | null = null;
  let currentProvinceTours = [];
  let svgContent = '';
  let viewBox = { x: 0, y: 0, width: 1000, height: 800 };

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startViewBox = { x: 0, y: 0 };

  let mouseX = 0;
  let mouseY = 0;
  let popupX = 0;
  let popupY = 0;
  let popupHovering = false;
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;
  let imageIndexes: Record<string, number> = {};

  const tourData = {
    Beijing: {
      province: 'Beijing',
      slug: 'classic-beijing-tour',
      images: [
        'https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/tours/Beijing/Beijing/beijing1.jpg',
        'https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/tours/Beijing/Beijing/beijing2.jpg',
        'https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/tours/Beijing/Beijing/beijing3.jpg'
      ],
      hotSpots: ['Great Wall', 'Forbidden City', 'Temple of Heaven'],
      days: '5 days',
      views: 1200,
    },
    Shanghai: {
      province: 'Shanghai',
      slug: 'shanghai-highlights-tour',
      images: ['https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/shanghai1.jpg'],
      hotSpots: ['The Bund', 'Yu Garden'],
      days: '4 days',
      views: 900,
    },
    Xian: {
      province: 'Shaanxi',
      slug: 'xian-terracotta-warriors',
      images: ['https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/tours/681f08e84fc6c82c8274c00b/1746864360745-169lzaqzkrs.jpg'],
      hotSpots: ['Terracotta Army', 'Ancient City Wall'],
      days: '3 days',
      views: 800,
    },
    Chengdu: {
      province: 'Sichuan',
      images: ['https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/chengdu1.jpg'],
      hotSpots: ['Panda Base', 'Jinli Street'],
      days: '3 days',
      views: 700,
    },
    Leshan: {
      province: 'Sichuan',
      images: ['https://ailurowander-images.s3.ap-southeast-2.amazonaws.com/leshan.jpg'],
      hotSpots: ['Leshan Giant Buddha'],
      days: '1 day',
      views: 400,
    }
  };

  let totalViews = Object.values(tourData).reduce((acc, t) => acc + t.views, 0);

  function handleGlobalMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function animateResetView() {
    const duration = 300; // ms
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);

    const start = { ...viewBox };
    const end = { x: 0, y: 0, width: 1000, height: 800 };

    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;

      viewBox = {
        x: start.x + (end.x - start.x) * progress,
        y: start.y + (end.y - start.y) * progress,
        width: start.width + (end.width - start.width) * progress,
        height: start.height + (end.height - start.height) * progress
      };

      updateViewBox();

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  function showPopupForProvince(name: string, id = '', description = '') {
    hoveredProvince = { id, name, description };
    const popupWidth = 420;
    const popupHeight = 500;

    const container = document.querySelector('.china-map')?.parentElement;
    const rect = container?.getBoundingClientRect();

    let relativeMouseX = mouseX - (rect?.left ?? 0);
    let relativeMouseY = mouseY - (rect?.top ?? 0);

    let desiredX = relativeMouseX + 10;
    let desiredY = relativeMouseY + 10;

    if (desiredX + popupWidth > container?.clientWidth) {
      desiredX = relativeMouseX - popupWidth - 10;
    }
    if (desiredY + popupHeight > container?.clientHeight) {
      desiredY = relativeMouseY - popupHeight - 10;
    }

    popupX = Math.max(10, Math.min(desiredX, (container?.clientWidth ?? window.innerWidth) - popupWidth - 10));
    popupY = Math.max(10, Math.min(desiredY, (container?.clientHeight ?? window.innerHeight) - popupHeight - 10));

    currentProvinceTours = Object.entries(tourData)
      .filter(([_, t]) => t.province === name)
      .map(([city, data]) => {
        imageIndexes[city] = 0;
        return { city, ...data };
      });

    if (closeTimeout) clearTimeout(closeTimeout);
  }

    function hidePopupWithDelay() {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        if (!popupHovering) {
          hoveredProvince = null;
          currentProvinceTours = [];
        }
      }, 1500);
    }

    function changeImageIndex(city: string, direction: 'prev' | 'next') {
      const max = tourData[city]?.images.length || 0;
      if (max === 0) return;

      const current = imageIndexes[city] ?? 0;
      if (direction === 'next') {
        imageIndexes[city] = (current + 1) % max;
      } else {
        imageIndexes[city] = (current - 1 + max) % max;
      }
    }

  async function loadSvg() {
    const response = await fetch('/chinaHigh.svg');
    const raw = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = raw;

    const svg = tempDiv.querySelector('svg');
    if (svg) {
      svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('class', 'china-map');

      const paths = svg.querySelectorAll('path');
      paths.forEach((path) => {
        path.classList.add('province-path');
      });
    }

    return tempDiv.innerHTML;
  }

  function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startViewBox = { x: viewBox.x, y: viewBox.y };
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging) return;
    const deltaX = (event.clientX - startX) * (viewBox.width / event.currentTarget.clientWidth);
    const deltaY = (event.clientY - startY) * (viewBox.height / event.currentTarget.clientHeight);

    viewBox = {
      ...viewBox,
      x: startViewBox.x - deltaX,
      y: startViewBox.y - deltaY
    };

    updateViewBox();
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomFactor = 0.1;
    const delta = event.deltaY > 0 ? 1 : -1;

    const zoomCenterX = event.offsetX / event.currentTarget.clientWidth * viewBox.width + viewBox.x;
    const zoomCenterY = event.offsetY / event.currentTarget.clientHeight * viewBox.height + viewBox.y;

    const newWidth = viewBox.width * (1 + zoomFactor * delta);
    const newHeight = viewBox.height * (1 + zoomFactor * delta);

    viewBox = {
      x: zoomCenterX - (zoomCenterX - viewBox.x) * (newWidth / viewBox.width),
      y: zoomCenterY - (zoomCenterY - viewBox.y) * (newHeight / viewBox.height),
      width: newWidth,
      height: newHeight
    };

    updateViewBox();
  }

  function updateViewBox() {
    const svg = document.querySelector('.china-map') as SVGElement;
    if (svg) {
      svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    }
  }

  function resetViewBox() {
    viewBox = { x: 0, y: 0, width: 1000, height: 800 };
    updateViewBox();
  }

  onMount(async () => {
    svgContent = await loadSvg();
    requestAnimationFrame(() => {
      const paths = document.querySelectorAll('.province-path');
      paths.forEach((path) => {
        const title = path.getAttribute('title') || 'Unknown Province';
        path.addEventListener('mouseenter', () => {
          showPopupForProvince(title, path.id || '', `Explore tours in ${title}`);
        });
        path.addEventListener('mouseleave', hidePopupWithDelay);
      });
    });
  });
</script>

<svelte:window on:mousemove={handleGlobalMouseMove} />

<div 
  class="relative w-full h-[600px] bg-white rounded-lg shadow-lg overflow-hidden"
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
  on:wheel={handleWheel}
>
  <button
    on:click={animateResetView}
    class="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
  >
    Reset View
  </button>

  <div class="w-full h-full flex items-center justify-center">
    {@html svgContent}
  </div>

  {#if hoveredProvince}
    <div 
      class="absolute z-[9999] bg-white border border-gray-300 rounded-xl shadow-2xl w-[420px] max-h-[520px] overflow-y-auto transition-all duration-300"
      style="top: {popupY}px; left: {popupX}px;"
      on:mouseenter={() => popupHovering = true}
      on:mouseleave={() => {
        popupHovering = false;
        hidePopupWithDelay();
      }}
    >
      <div class="p-5 space-y-5">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">
          {hoveredProvince.name} - Tours
        </div>

        {#if currentProvinceTours.length > 0}
          <div class="space-y-4">
            {#each currentProvinceTours as tour}
              <div class="rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-md transition-all bg-white">
                <div class="relative w-full h-36 bg-gray-100 overflow-hidden">
                  <img 
                    src={tour.images[imageIndexes[tour.city] ?? 0]} 
                    alt={tour.city} 
                    class="w-full h-full object-cover transition-opacity duration-300"
                    on:error={(e) => e.target.src = 'https://placehold.co/400x180?text=No+Image&font=roboto'} 
                  />

                  {#if tour.images.length > 1}
                    <button
                      class="absolute top-1/2 left-1 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center text-gray-800 hover:bg-opacity-90"
                      on:click={() => changeImageIndex(tour.city, 'prev')}
                    >‹</button>
                    <button
                      class="absolute top-1/2 right-1 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center text-gray-800 hover:bg-opacity-90"
                      on:click={() => changeImageIndex(tour.city, 'next')}
                    >›</button>
                  {/if}
                </div>

                <div class="p-4 space-y-2">
                  <div class="text-lg font-bold text-gray-800">{tour.city}</div>
                  <div class="text-sm text-gray-500 flex items-center gap-2">
                    <span>📅 {tour.days}</span>
                    <span>🔥 {(tour.views / totalViews * 10).toFixed(1)}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">Hot Spots:</span> {tour.hotSpots.join(', ')}
                  </div>
                  <a 
                    href={`/tours/${tour.slug}`}
                    class="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    target="_blank"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Explore {tour.city}
                  </a>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-gray-500 text-sm">No tour data available for this province.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.china-map) {
    width: 100%;
    height: 100%;
    min-width: 800px;
    min-height: 600px;
    cursor: grab;
  }

  :global(.china-map:active) {
    cursor: grabbing;
  }

  :global(.province-path) {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  :global(.province-path:hover) {
    fill: #dc2626 !important;
    stroke: #dc2626 !important;
  }
</style>