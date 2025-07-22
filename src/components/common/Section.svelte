<script lang="ts">
  export let title: string;
  export let subtitle: string = '';
  export let background: 'white' | 'gray' = 'white';
  export let centerTitle: boolean = true;
</script>

<section class="py-16 {background === 'gray' ? 'bg-base-200' : 'bg-base-100'}">
  <div class="container">
    {#if title}
      <div class="{centerTitle ? 'text-center' : ''} mb-12">
        <h2 class="text-4xl font-bold mb-4">{title}</h2>
        {#if subtitle}
          <p class="text-gray-600 {centerTitle ? 'max-w-2xl mx-auto' : ''}">{subtitle}</p>
        {/if}
      </div>
    {/if}

    <slot />
  </div>
</section>
