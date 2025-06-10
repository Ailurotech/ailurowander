<script lang="ts">
  import { onMount } from 'svelte';
  
  // Province data structure
  interface Province {
    id: string;
    name: string;
    description: string;
  }
  
  
  let hoveredProvince: Province | null = null;
  let svgContent = '';
  
  async function loadSvg() {
    try {
      const response = await fetch('/chinaHigh.svg');
      svgContent = await response.text();
      
      // Create a temporary div to parse the SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgContent;
      
      // Get the SVG element
      const svg = tempDiv.querySelector('svg');
      if (svg) {
        // Set viewBox to show the entire map
        svg.setAttribute('viewBox', '0 0 1000 800');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('class', 'china-map');
      }
      
      // Add hover effects to all paths
      const paths = tempDiv.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('class', 'province-path');
        path.setAttribute('fill', '#e5e7eb');
        path.setAttribute('stroke', '#9ca3af');
        path.setAttribute('stroke-width', '1');

        // Get the title from the path's title element
        const titleElement = path.querySelector('title');
        const title = titleElement ? titleElement.textContent : path.getAttribute('title') || 'Unknown Province';
        
        // Debug log
        console.log('Path found:', {
          id: path.id,
          title: title,
          hasTitleElement: !!titleElement,
          titleAttribute: path.getAttribute('title')
        });

        path.addEventListener('mouseenter', () => {
          console.log('Mouse entered path:', title);
          hoveredProvince = {
            id: path.id || (title as string).toLowerCase().replace(/\s+/g, '-'),
            name: title as string,
            description: `Explore tours and attractions in ${title}`
          };
        });

        path.addEventListener('mouseleave', () => {
          console.log('Mouse left path:', title);
          hoveredProvince = null;
        });
      });
      
      // Update the SVG content
      svgContent = tempDiv.innerHTML;
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  }
  
  onMount(() => {
    loadSvg();
  });
</script>

<div class="relative w-full h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
  <div class="w-full h-full flex items-center justify-center">
    {@html svgContent}
  </div>
  
  <!-- Province Description Panel -->
  {#if hoveredProvince}
    <div 
      class="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl p-4 transform transition-all duration-300"
      style="max-height: calc(100% - 2rem); overflow-y: auto;"
    >
      <h3 class="text-xl font-bold mb-2">{hoveredProvince.name}</h3>
      <p class="text-neutral-600">{hoveredProvince.description}</p>
      <a 
        href="/tours/{hoveredProvince.id}" 
        class="mt-4 inline-block text-red-600 hover:text-red-700 font-medium"
      >
        View Tours →
      </a>
    </div>
  {/if}
</div>

<style>
  :global(.china-map) {
    width: 100%;
    height: 100%;
    min-width: 800px;
    min-height: 600px;
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