<script lang="ts">
  export let quote: string;
  export let name: string;
  export let location: string;
  export let rating: number = 5;
</script>

<div class="card bg-base-100 shadow-md">
  <div class="card-body">
    <div class="rating rating-sm mb-4">
      {#each Array(5) as _, i}
        <input
          type="radio"
          name="rating-{name}"
          class="mask mask-star-2 bg-yellow-400"
          checked={i < rating}
          disabled
        />
      {/each}
    </div>
    <p class="text-gray-600 mb-4">"{quote}"</p>
    <div class="flex items-center">
      <div class="font-medium">
        <p class="text-gray-900">{name}</p>
        <p class="text-gray-500 text-sm">from {location}</p>
      </div>
    </div>
  </div>
</div>
