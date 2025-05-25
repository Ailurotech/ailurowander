<script lang="ts">
  import { t } from '$lib/i18n';
  import Card from '../../components/molecules/Card.svelte';
  import Badge from '../../components/atoms/Badge.svelte';
  import Divider from '../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../components/atoms/ChineseIcon.svelte';
  import LoadingSkeleton from '../../components/atoms/LoadingSkeleton.svelte';
  import { slugify } from '$lib/utils/slugify';
  
  export let tour: {
    id: string | number;
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
  };
  
  // Determine which icon to use based on tour name/location
  const getIconForTour = (title: string) => {
    if (title.toLowerCase().includes('beijing') || title.toLowerCase().includes('great wall')) 
      return { name: 'great-wall' as const, color: '#B91C1C' };
    if (title.toLowerCase().includes('xian') || title.toLowerCase().includes('terracotta')) 
      return { name: 'terracotta' as const, color: '#B45309' };
    if (title.toLowerCase().includes('shanghai')) 
      return { name: 'forbidden-city' as const, color: '#0F766E' };
    if (title.toLowerCase().includes('yangtze')) 
      return { name: 'mountains' as const, color: '#0F766E' };
    if (title.toLowerCase().includes('chengdu') || title.toLowerCase().includes('panda')) 
      return { name: 'panda' as const, color: '#B45309' };
      
    // Default icon
    return { name: 'temple' as const, color: '#B91C1C' };
  };
  
  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  const icon = getIconForTour(tour.title);
  const badge = tour.isPopular ? { text: 'Popular', variant: 'accent' as const } : null;
</script>

{#if tour.isLoading}
  <div class="card p-4 h-full">
    <LoadingSkeleton height="200px" className="mb-4" />
    <LoadingSkeleton width="70%" height="24px" className="mb-3" />
    <LoadingSkeleton width="100%" height="16px" className="mb-2" />
    <LoadingSkeleton width="90%" height="16px" className="mb-4" />
    <div class="flex justify-between">
      <LoadingSkeleton width="40%" height="20px" />
      <LoadingSkeleton width="30%" height="20px" />
    </div>
  </div>
{:else}
  <Card
    title={tour.title}
    description={tour.description}
    image={tour.image}
    imageAlt={`${tour.title} tour`}
    {badge}
    {icon}
    link={{ url: `/tours/${slugify(tour.title)}`, text: 'View Details' }}
    decorative={true}
  >
    <div class="flex flex-col">
      <Divider type="simple" className="my-3" />
      
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-1">
          <span class="text-secondary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span class="text-sm">{tour.duration}</span>
        </div>
        
        {#if tour.location}
          <div class="flex items-center gap-1">
            <span class="text-primary-dark">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span class="text-sm">{tour.location}</span>
          </div>
        {/if}
      </div>
    </div>
    
    <svelte:fragment slot="footer">
      <div class="flex items-end justify-between mt-4">
        <div>
          <p class="text-sm text-neutral-500">Starting from</p>
          <p class="text-xl font-bold text-primary">
            {formatPrice(tour.price)}
            {#if tour.discount}
              <span class="ml-2 text-sm line-through text-neutral-500">{formatPrice(tour.price + tour.discount)}</span>
            {/if}
          </p>
        </div>
        
        {#if tour.rating}
          <div class="flex items-center bg-accent/10 text-accent px-2 py-1 rounded">
            <span class="text-accent mr-1">★</span>
            <span class="font-medium">{tour.rating}</span>
          </div>
        {/if}
      </div>
    </svelte:fragment>
  </Card>
{/if} 