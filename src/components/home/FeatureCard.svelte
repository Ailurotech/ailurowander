<script lang="ts">
  export let title: string;
  export let description: string;
  export let icon: string;
</script>

<div class="text-center p-6">
  <div
    class="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4"
  >
    <slot name="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon} />
      </svg>
    </slot>
  </div>
  <h3 class="text-xl font-bold mb-2">{title}</h3>
  <p class="text-gray-600">{description}</p>
</div>
