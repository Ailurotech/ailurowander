<script lang="ts">
  import { t } from '$lib/i18n';
  import type { Tour } from '$lib/types/tour';
  import Button from '../atoms/Button.svelte';

  export let tour: Tour;

  // Define the pricing data type
  type PricingData = {
    departureDate: string;
    returnDate: string;
    currentPrice: number;
    originalPrice: number;
    availability: string;
    tag: string;
  };

  // Sample pricing data - in a real application this would come from an API
  let pricingData: PricingData[] = [
    {
      departureDate: "Thu, 19th Mar, 2026",
      returnDate: "Fri, 27th Mar, 2026",
      currentPrice: 5630,
      originalPrice: 5880,
      availability: "Available",
      tag: "OFFER"
    },
    {
      departureDate: "Wed, 1st Apr, 2026",
      returnDate: "Thu, 9th Apr, 2026",
      currentPrice: 5730,
      originalPrice: 5980,
      availability: "Available",
      tag: "OFFER"
    },
    {
      departureDate: "Sat, 2nd May, 2026",
      returnDate: "Sun, 10th May, 2026",
      currentPrice: 5880,
      originalPrice: 5880,
      availability: "Available",
      tag: ""
    },
    {
      departureDate: "Tue, 16th Jun, 2026",
      returnDate: "Wed, 24th Jun, 2026",
      currentPrice: 6130,
      originalPrice: 6380,
      availability: "Available",
      tag: "OFFER"
    },
    {
      departureDate: "Fri, 7th Aug, 2026",
      returnDate: "Sat, 15th Aug, 2026",
      currentPrice: 5980,
      originalPrice: 5980,
      availability: "Limited",
      tag: ""
    }
  ];

  // Format price with currency
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // State for filters
  let selectedDate = "All Dates";
  let selectedDeparture = "All";
  let rooms = 1;
  let guests = 2;
  let landOnly = false;
</script>

<!-- Pricing Overview Card (for sidebar) -->
<div class="card bg-white shadow-xl p-6 border border-gray-100 mb-8">
  <h3 class="text-xl font-bold mb-4">{$t('tours.pricing_availability.title')}</h3>
  <div class="chinese-divider"></div>

  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <span class="text-gray-600">{$t('tours.pricing_availability.from')}</span>
      <span class="text-2xl font-bold text-primary">
        {formatPrice(tour.price.amount, tour.price.currency)}
      </span>
    </div>
  </div>

  <div class="flex items-center text-sm text-gray-500 mb-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span>186 {$t('tours.pricing_availability.reviews')}</span>
  </div>

  <div class="text-sm text-gray-600 mb-6">
    <p class="mb-2">feefo**</p>
    <p>1300727998</p>
  </div>

  <Button variant="primary" fullWidth={true}>
    {$t('tours.pricing_availability.call_to_book')}
  </Button>
</div>

<!-- Main Pricing & Availability Section -->
<div class="mb-12">
  <h2 class="text-2xl font-bold mb-4">{$t('tours.pricing_availability.title')}</h2>
  
  <p class="mb-6 text-gray-700">
    {$t('tours.pricing_availability.description')}
  </p>

  <!-- Filters -->
  <div class="bg-gray-50 p-4 rounded-lg mb-6">
    <div class="flex flex-wrap gap-4 items-center">
      <div class="relative">
        <select class="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option>{selectedDate} ▼</option>
          <option>{$t('tours.pricing_availability.all_dates')}</option>
        </select>
      </div>
      
      <div class="relative">
        <select class="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option>{$t('tours.pricing_availability.departure')}: {selectedDeparture} ▼</option>
          <option>{$t('tours.pricing_availability.all_departures')}</option>
        </select>
      </div>
      
      <div class="relative">
        <select class="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option>{rooms} {$t('tours.pricing_availability.room')}, {guests} {$t('tours.pricing_availability.guests')} ▼</option>
          <option>1 {$t('tours.pricing_availability.room')}, 1 {$t('tours.pricing_availability.guest')}</option>
          <option>1 {$t('tours.pricing_availability.room')}, 2 {$t('tours.pricing_availability.guests')}</option>
          <option>2 {$t('tours.pricing_availability.rooms')}, 4 {$t('tours.pricing_availability.guests')}</option>
        </select>
      </div>
      
      <div class="flex items-center">
        <input 
          type="checkbox" 
          id="land-only" 
          bind:checked={landOnly}
          class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label for="land-only" class="ml-2 block text-sm text-gray-700">
          {$t('tours.pricing_availability.land_only')}
        </label>
      </div>
    </div>
  </div>

  <!-- Pricing Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 border-b text-left">{$t('tours.pricing_availability.depart_date')}</th>
          <th class="py-3 px-4 border-b text-left">{$t('tours.pricing_availability.return_date')}</th>
          <th class="py-3 px-4 border-b text-left">{$t('tours.pricing_availability.price')}</th>
          <th class="py-3 px-4 border-b text-left">{$t('tours.pricing_availability.availability')}</th>
        </tr>
      </thead>
      <tbody>
        {#each pricingData as item, i}
          <tr class="{i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            <td class="py-3 px-4 border-b">
              {#if item.tag}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  {item.tag}
                </span>
              {/if}
              {item.departureDate}
            </td>
            <td class="py-3 px-4 border-b">{item.returnDate}</td>
            <td class="py-3 px-4 border-b">
              <div class="flex flex-col">
                <span class="font-bold">{formatPrice(item.currentPrice)}pp</span>
                {#if item.originalPrice > item.currentPrice}
                  <span class="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}pp</span>
                {/if}
              </div>
            </td>
            <td class="py-3 px-4 border-b">
              <div class="flex items-center justify-between">
                <span class="{item.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'} font-medium">
                  {item.availability}
                </span>
                <Button size="sm" variant="primary">
                  {$t('tours.pricing_availability.book_online')}
                </Button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>