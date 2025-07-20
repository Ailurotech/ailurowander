<script lang="ts">
  export let destination: {
    name: string;
    image: string;
  };
</script>

<div class="card h-64 image-full">
  <figure>
    <img src={destination.image} alt={destination.name} class="w-full h-full object-cover" />
  </figure>
  <div class="card-body justify-end">
    <h3 class="card-title text-white">{destination.name}</h3>
  </div>
</div>
