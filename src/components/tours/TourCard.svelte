<script lang="ts">
  import { t } from '$lib/i18n';
  
  export let tour: {
    id: string | number;
    title: string;
    description: string;
    image: string;
    duration: string;
    price: number;
  };
</script>

<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
  <figure class="h-48">
    <img src={tour.image} alt={tour.title} class="w-full h-full object-cover" />
  </figure>
  <div class="card-body">
    <h3 class="card-title">{tour.title}</h3>
    <p class="text-gray-600 mb-4">{tour.description}</p>
    <div class="flex justify-between items-center">
      <span class="text-primary font-bold">${tour.price}</span>
      <span class="badge badge-outline">{tour.duration}</span>
    </div>
    <div class="card-actions justify-end mt-4">
      <a href={`/tours/${tour.id}`} class="btn btn-secondary w-full">
        {$t('home.featured.view_details')}
      </a>
    </div>
  </div>
</div> 