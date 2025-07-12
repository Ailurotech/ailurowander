<script lang="ts">
  import Badge from '../atoms/Badge.svelte';
  import Button from '../atoms/Button.svelte';
  import ChineseIcon from '../atoms/ChineseIcon.svelte';
  
  export let title: string;
  export let description: string = '';
  export let image: string | null = null;
  export let imageAlt: string = '';
  export let badge: { text: string; variant: 'primary' | 'secondary' | 'accent' } | null = null;
  export let icon: { 
    name: 'great-wall' | 'forbidden-city' | 'terracotta' | 
          'temple' | 'pagoda' | 'dragon' | 'panda' | 
          'lantern' | 'bamboo' | 'mountains'; 
    color: string 
  } | null = null;
  export let link: { url: string; text: string } | null = null;
  export let horizontal: boolean = false;
  export let elevated: boolean = true;
  export let decorative: boolean = false;
</script>

<div class="card {horizontal ? 'flex flex-col md:flex-row' : 'flex flex-col'} {elevated ? 'shadow-md hover:shadow-card-hover' : ''} overflow-hidden hover:-translate-y-1 transition-all duration-300">
  <!-- Image container -->
  {#if image}
    <div class="{horizontal ? 'md:w-2/5' : 'w-full'}">
      <img 
        src={image} 
        alt={imageAlt}
        class="card__image {horizontal ? 'h-full w-full object-cover' : 'w-full h-64 object-cover'}"
        loading="lazy"
      />
    </div>
  {/if}
  
  <!-- Content container -->
  <div class="card__content {horizontal ? 'md:w-3/5' : 'w-full'} p-6 flex flex-col">
    <!-- Header with badge and/or icon -->
    <div class="flex items-start justify-between mb-3">
      <div>
        {#if badge}
          <Badge variant={badge.variant} className="mb-3">
            {badge.text}
          </Badge>
        {/if}
        <h3 class="card__title text-xl font-heading font-bold mb-2">{title}</h3>
      </div>
      
      {#if icon}
        <div class="ml-4">
          <ChineseIcon icon={icon.name} color={icon.color} size="lg" />
        </div>
      {/if}
    </div>
    
    <!-- Chinese decorative corner element -->
    {#if decorative}
      <div class="absolute top-0 right-0 w-12 h-12 overflow-hidden">
        <div class="w-16 h-16 bg-primary/10 -translate-x-8 -translate-y-8 rotate-45"></div>
      </div>
    {/if}
    
    <!-- Description -->
    {#if description}
      <p class="card__text text-neutral-700 mb-4 flex-grow">{description}</p>
    {/if}
    
    <!-- Default slot for custom content -->
    <div class="flex-grow">
      <slot></slot>
    </div>
    
    <!-- Link/button -->
    {#if link}
      <div class="mt-4">
        <a href={link.url} class="btn btn-accent text-white bg-primary font-semibold hover:bg-primary hover:scale-105 hover:text-white transition-all duration-200 text-center py-3 px-6 rounded-lg">
          {link.text}
        </a>
      </div>
    {/if}
    
    <!-- Footer slot for additional actions -->
    <slot name="footer"></slot>
  </div>
</div> 