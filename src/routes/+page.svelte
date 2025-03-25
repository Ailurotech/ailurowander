<script lang="ts">
  import { t } from '$lib/i18n';
  import ParallaxHero from '../components/molecules/ParallaxHero.svelte';
  import Section from '../components/atoms/Section.svelte';
  import TourCard from '../components/organisms/TourCard.svelte';
  import Card from '../components/molecules/Card.svelte';
  import Divider from '../components/atoms/Divider.svelte';
  import Button from '../components/atoms/Button.svelte';
  import ChineseIcon from '../components/atoms/ChineseIcon.svelte';
  import DestinationCard from '../components/home/DestinationCard.svelte';
  import TestimonialCard from '../components/home/TestimonialCard.svelte';
  import Newsletter from '../components/common/Newsletter.svelte';
  import { onMount } from 'svelte';
  
  // Declare tours state
  let featuredTours: Array<{
    id: number | string;
    title: string;
    description: string;
    image: string;
    duration: string;
    price: number;
    location?: string;
    rating?: number;
    discount?: number;
    isPopular?: boolean;
    isLoading?: boolean;
  }> = [];
  
  let isLoadingTours = true;
  let tourLoadError = '';
  
  // Load tours from API
  async function loadFeaturedTours() {
    isLoadingTours = true;
    
    try {
      // Fetch featured tours from API
      const response = await fetch('/api/tours?featured=true');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tours: ${response.status}`);
      }
      
      const apiTours = await response.json();
      
      // Transform API tours to match our component's expected format
      featuredTours = apiTours.map(tour => ({
        id: tour._id, 
        title: tour.title,
        description: tour.shortDescription || tour.description.substring(0, 120) + '...',
        image: tour.images?.main || '/images/placeholder.jpg',
        duration: tour.duration?.days ? `${tour.duration.days} days` : 'Multiple days',
        price: tour.price?.amount || 0,
        location: tour.destination,
        isPopular: tour.featured,
        discount: tour.discount || 0
      }));
      
    } catch (error) {
      console.error('Error loading tours:', error);
      tourLoadError = error instanceof Error ? error.message : 'Failed to load tours';
      
      // Use placeholder loading skeletons if error occurs
      featuredTours = Array(4).fill({
        id: 0,
        title: '',
        description: '',
        image: '',
        duration: '',
        price: 0,
        isLoading: true
      });
    } finally {
      isLoadingTours = false;
    }
  }
  
  // Load featured tours on component mount
  onMount(() => {
    loadFeaturedTours();
  });

  // Destinations data for showcase
  const destinations = [
    { name: 'Beijing', image: '/images/beijing-dest.jpg' },
    { name: 'Shanghai', image: '/images/shanghai-dest.jpg' },
    { name: 'Xian', image: '/images/xian-dest.jpg' },
    { name: 'Guilin', image: '/images/guilin-dest.jpg' },
    { name: 'Chengdu', image: '/images/chengdu-dest.jpg' },
    { name: 'Hong Kong', image: '/images/hongkong-dest.jpg' },
  ];
  
  // Testimonial data
  const testimonials = [
    {
      quote: "Our tour of Beijing and the Great Wall exceeded all expectations. Our guide's knowledge made the history come alive, and the accommodations were fantastic.",
      name: "Sarah Johnson",
      location: "United States",
      rating: 5
    },
    {
      quote: "The Yangtze River cruise was the highlight of our trip. The scenery was breathtaking, and the entire experience was perfectly organized. We'll definitely be back!",
      name: "Thomas Müller",
      location: "Germany",
      rating: 5
    },
    {
      quote: "As a solo traveler, I was nervous about visiting China, but AiluroWander made it so easy. From the food to the sights, every moment was special.",
      name: "Yuki Tanaka",
      location: "Japan",
      rating: 5
    }
  ];
</script>

<svelte:head>
  <title>{$t('site.title')}</title>
  <meta name="description" content={$t('site.description')} />
</svelte:head>

<!-- Hero Section with Parallax Effect -->
<ParallaxHero 
  title={$t('home.hero.title')}
  subtitle={$t('home.hero.subtitle')}
  image="/images/china.png"
  height="lg"
  primaryCta={{ text: $t('home.hero.cta_primary'), href: '/tours' }}
  secondaryCta={{ text: $t('home.hero.cta_secondary'), href: '/contact' }}
/>

<!-- Featured Tours with Grid Showcase -->
<Section 
  variant="light" 
  spacing="lg"
  id="featured-tours"
>
  <svelte:fragment slot="header">
    <div class="text-center mb-12">
      <h2 class="mb-3">{$t('home.featured.title')}</h2>
      <p class="text-lg text-neutral-700 max-w-2xl mx-auto">{$t('home.featured.subtitle')}</p>
      <Divider type="symbol" symbol="✦" className="mt-6" />
    </div>
  </svelte:fragment>
  
  {#if isLoadingTours}
    <div class="grid-showcase">
      {#each Array(4) as _, i}
        <TourCard tour={{
          id: i,
          title: '',
          description: '',
          image: '',
          duration: '',
          price: 0,
          isLoading: true
        }} />
      {/each}
    </div>
  {:else if tourLoadError}
    <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
      <p class="text-red-700">
        {tourLoadError}
      </p>
      <button 
        class="mt-2 text-primary font-medium" 
        on:click={loadFeaturedTours}
      >
        Try Again
      </button>
    </div>
  {:else if featuredTours.length === 0}
    <div class="text-center py-8">
      <p>No featured tours available at the moment. Please check back later.</p>
    </div>
  {:else}
    <div class="grid-showcase">
      {#each featuredTours as tour}
        <TourCard {tour} />
      {/each}
    </div>
  {/if}
  
  <div class="text-center mt-12">
    <Button href="/tours" variant="primary" size="lg">{$t('home.featured.view_all')}</Button>
  </div>
</Section>

<!-- Popular Destinations -->
<Section 
  variant="light" 
  spacing="lg"
>
  <svelte:fragment slot="header">
    <div class="text-center mb-12">
      <h2 class="mb-3">{$t('home.destinations.title')}</h2>
      <p class="text-lg text-neutral-700 max-w-2xl mx-auto">{$t('home.destinations.subtitle')}</p>
    </div>
  </svelte:fragment>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each destinations as destination}
      <DestinationCard {destination} />
    {/each}
  </div>
</Section>

<!-- Testimonials -->
<Section 
  variant="light" 
  spacing="lg"
>
  <svelte:fragment slot="header">
    <div class="text-center mb-12">
      <h2 class="mb-3">{$t('home.testimonials.title')}</h2>
      <p class="text-lg text-neutral-700 max-w-2xl mx-auto">{$t('home.testimonials.subtitle')}</p>
    </div>
  </svelte:fragment>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each testimonials as testimonial}
      <TestimonialCard 
        quote={testimonial.quote}
        name={testimonial.name}
        location={testimonial.location}
        rating={testimonial.rating}
      />
    {/each}
  </div>
</Section>

<!-- Newsletter -->
<Newsletter background="#541212" />
