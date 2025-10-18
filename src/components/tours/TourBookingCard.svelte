<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Button from '../atoms/Button.svelte';

  export let tour: Tour;

  // Format price with currency
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };
</script>

<!-- Booking Card -->
<div class="card bg-white shadow-xl p-6 border border-gray-100">
  <h3 class="text-2xl font-bold mb-4">{$t('tour_detail.book_tour')}</h3>
  <div class="chinese-divider"></div>

  <div class="mb-6">
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-600">{$t('tour_detail.starting_from')}</span>
      <span class="text-2xl font-bold text-primary"
        >{formatPrice(tour.price.amount, tour.price.currency)}</span
      >
    </div>
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-600">{$t('tour_detail.duration')}</span>
      <span
        >{tour.duration.days} {$t('tours.days')}, {tour.duration.nights} {$t('tours.nights')}</span
      >
    </div>
    <div class="flex justify-between items-center">
      <span class="text-gray-600">{$t('tour_detail.group_size')}</span>
      <span>
        {#if tour.maxGroupSize && tour.maxGroupSize > 0}
          {$t('tours.up_to')} {tour.maxGroupSize} {$t('tours.people')}
        {:else}
          {$t('tours.unlimited')}
        {/if}
      </span>
    </div>
  </div>

  <div class="mt-6 text-sm text-gray-500">
    <p class="flex items-center mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2 text-green-500"
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
      {$t('tour_detail.free_cancellation')}
    </p>
    <p class="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2 text-green-500"
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
      {$t('tour_detail.customer_support')}
    </p>
  </div>

  <!-- Contact Information Section -->
  <div class="mt-8 pt-6 border-t border-gray-200">
    <h4 class="text-lg font-semibold mb-3">{$t('contact.info.title')}</h4>
    <p class="text-gray-600 text-sm mb-4">{$t('contact.info.subtitle')}</p>
    
    <div class="space-y-3">
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span class="text-sm">{$t('contact.info.phone')}</span>
      </div>
      
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm">{$t('contact.info.hours')}</span>
      </div>
      
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="text-sm">
          <a href="https://wa.me/61474212611" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
            {$t('contact.info.whatsapp')}
          </a>
        </span>
        <br>
      </div>
    </div>
    
    <div class="mt-4">
      <Button variant="outline" fullWidth={true}>
        <a href="/contact">{$t('tour_detail.cta.contact_us')}</a>
      </Button>
    </div>
  </div>
</div>