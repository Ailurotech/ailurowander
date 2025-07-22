<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';

  export let tour: Tour;
</script>

<!-- Inclusions and Exclusions -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
  <!-- Inclusions -->
  <div class="bg-white p-8 rounded-lg shadow-md border border-gray-100">
    <h3 class="text-2xl font-bold mb-6 flex items-center">
      <span class="text-green-500 mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      {$t('tour_detail.included')}
    </h3>
    <ul class="space-y-3">
      {#each tour.inclusions || [] as item}
        <li class="flex items-start">
          <span class="text-green-500 mr-3 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span>{item}</span>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Exclusions -->
  <div class="bg-white p-8 rounded-lg shadow-md border border-gray-100">
    <h3 class="text-2xl font-bold mb-6 flex items-center">
      <span class="text-red-500 mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      {$t('tour_detail.not_included')}
    </h3>
    <ul class="space-y-3">
      {#each tour.exclusions || [] as item}
        <li class="flex items-start">
          <span class="text-red-500 mr-3 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
          </span>
          <span>{item}</span>
        </li>
      {/each}
    </ul>
  </div>
</div>
