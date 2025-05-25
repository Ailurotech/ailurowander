<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../components/common/Section.svelte';
  import TourCard from '../../components/tours/TourCard.svelte';
  import Hero from '../../components/common/Hero.svelte';
  import type { TourSummary } from '$lib/types/tour';
  
  // Data loaded from +page.ts
  export let data: {
    tours: TourSummary[];
    query: string;
    error?: string;
  };
</script>

<svelte:head>
  <title>{$t('nav.tours')} | {$t('site.title')}</title>
  <meta name="description" content="Explore our collection of tours across China" />
</svelte:head>

<Hero 
  title="Explore Our Tours"
  subtitle="Discover the perfect journey through China's most inspiring destinations"
  backgroundImage="/images/tours-hero.jpg"
  primaryCta={{ text: "Browse All Tours", href: "#tours-listing" }}
/>

<div id="tours-listing">
  <Section 
    title="Available Tours"
    subtitle="Find your perfect adventure from our carefully curated collection of tours"
    background="white"
  >
    <!-- Search form -->
    <div class="mb-8">
      <form class="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <input 
          type="text" 
          name="query"
          value={data.query}
          placeholder="Search tours by destination or keyword" 
          class="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" class="btn btn-primary">Search</button>
        {#if data.query}
          <a href="/tours" class="btn bg-gray-300 hover:bg-gray-400 text-gray-800">Clear</a>
        {/if}
      </form>
    </div>

    {#if data.error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {data.error}
      </div>
    {/if}

    {#if data.tours.length === 0}
      <div class="text-center py-12">
        <h3 class="text-2xl font-bold mb-4">No tours found</h3>
        <p class="text-gray-600 mb-6">
          {#if data.query}
            We couldn't find any tours matching "{data.query}". Please try a different search term.
          {:else}
            We're currently updating our tour offerings. Please check back soon!
          {/if}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each data.tours as tour}
          <TourCard tour={{
            id: tour._id?.toString() || '',
            title: tour.title,
            description: tour.description,
            image: tour.image || '/images/placeholder.jpg',
            duration: tour.duration,
            price: tour.price,
            location: tour.destination,
            isPopular: tour.featured
          }} />
        {/each}
      </div>
    {/if}
  </Section>
</div> 