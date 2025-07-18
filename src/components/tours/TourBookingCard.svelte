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
      minimumFractionDigits: 0
    }).format(price);
  };
</script>

<!-- Booking Card -->
<div class="card bg-white shadow-xl p-6 border border-gray-100 h-min sticky top-8">
  <h3 class="text-2xl font-bold mb-4">{$t('tour_detail.book_tour')}</h3>
  <div class="chinese-divider"></div>
  
  <div class="mb-6">
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-600">{$t('tour_detail.starting_from')}</span>
      <span class="text-2xl font-bold text-primary">{formatPrice(tour.price.amount, tour.price.currency)}</span>
    </div>
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-600">{$t('tour_detail.duration')}</span>
      <span>{tour.duration.days} {$t('tours.days')}, {tour.duration.nights} {$t('tours.nights')}</span>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-gray-600">{$t('tour_detail.group_size')}</span>
      <span>{$t('tours.up_to')} 15 {$t('tours.people')}</span>
    </div>
  </div>
  
  <div class="flex flex-col gap-4">
    <Button variant="primary" fullWidth={true}>{$t('tours.book_now')}</Button>
    <Button variant="outline" fullWidth={true}>{$t('tour_detail.request_private')}</Button>
  </div>
  
  <div class="mt-6 text-sm text-gray-500">
    <p class="flex items-center mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {$t('tour_detail.free_cancellation')}
    </p>
    <p class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {$t('tour_detail.customer_support')}
    </p>
  </div>
</div> 