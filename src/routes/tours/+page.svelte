<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../components/common/Section.svelte';
  import TourCard from '../../components/tours/TourCard.svelte';
  import Hero from '../../components/common/Hero.svelte';
  import type { TourSummary } from '$lib/types/tour';
  import { onMount } from 'svelte';

  // Data loaded from +page.ts
  export let data: {
    tours: TourSummary[];
    query: string;
    error?: string;
  };

  // Client-side state
  let tours: TourSummary[] = [];
  let isLoading = true;
  let error: string | null = null;
  let searchQuery = data.query;

  // Load tours on component mount
  onMount(async () => {
    await loadTours();
  });

  async function loadTours() {
    isLoading = true;
    error = null;

    try {
      const apiUrl = searchQuery
        ? `/api/tours?query=${encodeURIComponent(searchQuery)}`
        : '/api/tours';

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to load tours');
      }

      tours = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load tours';
      tours = [];
    } finally {
      isLoading = false;
    }
  }

  // Handle search form submission
  function handleSearch(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    searchQuery = (formData.get('query') as string) || '';
    loadTours();
  }
</script>

<svelte:head>
  <title>{$t('nav.tours')} | {$t('site.title')}</title>
  <meta name="description" content="Explore our collection of tours across China" />
</svelte:head>

<Hero
  title={$t('tours.page.title')}
  subtitle={$t('tours.page.subtitle')}
  backgroundImage="/images/tours-hero.png"
  primaryCta={{ text: 'Browse All Tours', href: '#tours-listing' }}
/>

<div id="tours-listing">
  <Section
    title={$t('tours.page.available_tours')}
    subtitle={$t('tours.page.available_tours_subtitle')}
    background="white"
  >
    <!-- Search form -->
    <div class="mb-8">
      <form class="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" on:submit={handleSearch}>
        <input
          type="text"
          name="query"
          value={searchQuery}
          placeholder={$t('tours.page.search_placeholder')}
          class="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" class="btn btn-primary" disabled={isLoading}>
          {isLoading ? $t('tours.page.searching') : $t('tours.page.search_button')}
        </button>
        {#if searchQuery}
          <button
            type="button"
            class="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
            on:click={() => {
              searchQuery = '';
              loadTours();
            }}
          >
            {$t('tours.page.clear')}
          </button>
        {/if}
      </form>
    </div>

    <!-- Loading state -->
    {#if isLoading}
      <div class="text-center py-12">
        <div
          class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary hover:bg-primary-dark transition ease-in-out duration-150 cursor-not-allowed"
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {$t('tours.page.loading')}
        </div>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    {:else if tours.length === 0}
      <div class="text-center py-12">
        <h3 class="text-2xl font-bold mb-4">{$t('tours.page.no_tours_found')}</h3>
        <p class="text-gray-600 mb-6">
          {#if searchQuery}
            {$t('tours.page.no_search_results').replace('{query}', searchQuery)}
          {:else}
            {$t('tours.page.no_tours_message')}
          {/if}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each tours as tour}
          <TourCard
            tour={{
              id: tour._id?.toString() || '',
              title: tour.title,
              description: tour.description,
              image: tour.image || '/images/placeholder.jpg',
              duration: tour.duration,
              price: tour.price,
              location: tour.destination,
              isPopular: tour.featured,
            }}
          />
        {/each}
      </div>
    {/if}
  </Section>
</div>
