<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../common/Section.svelte';
</script>

<!-- Related Tours -->
<Section title={$t('tour_detail.related_tours')} subtitle={$t('tour_detail.related_subtitle')} background="white">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Sample related tours - These would be dynamically populated -->
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
      <figure class="h-48">
        <img src="/images/tours/beijing.webp" alt="Beijing Tour" class="w-full h-full object-cover" />
      </figure>
      <div class="card-body">
        <h3 class="card-title">Beijing Explorer</h3>
        <p class="text-gray-600 mb-4">Discover the imperial wonders of China's capital</p>
        <div class="flex justify-between items-center">
          <span class="text-primary font-bold">$799</span>
          <span class="badge badge-outline">5 days</span>
        </div>
        <div class="card-actions justify-end mt-4">
          <a href="/tours/beijing-explorer" class="btn btn-secondary w-full">View Details</a>
        </div>
      </div>
    </div>
    
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
      <figure class="h-48">
        <img src="/images/tours/xian.jpg" alt="Xi'an Tour" class="w-full h-full object-cover" />
      </figure>
      <div class="card-body">
        <h3 class="card-title">Xi'an Discovery</h3>
        <p class="text-gray-600 mb-4">Journey to the ancient city and Terracotta Warriors</p>
        <div class="flex justify-between items-center">
          <span class="text-primary font-bold">$699</span>
          <span class="badge badge-outline">4 days</span>
        </div>
        <div class="card-actions justify-end mt-4">
          <a href="/tours/xian-discovery" class="btn btn-secondary w-full">View Details</a>
        </div>
      </div>
    </div>
    
    <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
      <figure class="h-48">
        <img src="/images/tours/shanghai.jpg" alt="Shanghai Tour" class="w-full h-full object-cover" />
      </figure>
      <div class="card-body">
        <h3 class="card-title">Shanghai Urban Adventure</h3>
        <p class="text-gray-600 mb-4">Experience the city where tradition meets modernity</p>
        <div class="flex justify-between items-center">
          <span class="text-primary font-bold">$749</span>
          <span class="badge badge-outline">4 days</span>
        </div>
        <div class="card-actions justify-end mt-4">
          <a href="/tours/shanghai-urban-adventure" class="btn btn-secondary w-full">View Details</a>
        </div>
      </div>
    </div>
  </div>
</Section> 