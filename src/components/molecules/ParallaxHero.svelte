<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import { onMount } from 'svelte';
  
  export let title: string = '';
  export let subtitle: string = '';
  export let image: string = '/images/hero-bg.jpg';
  export let height: 'sm' | 'md' | 'lg' | 'full' = 'lg';
  export let overlay: boolean = true;
  export let overlayOpacity: number = 0.5;
  export let textColor: string = 'white';
  export let centered: boolean = true;
  export let decorative: boolean = true;
  export let primaryCta: { text: string; href: string } | null = null;
  export let secondaryCta: { text: string; href: string } | null = null;
  
  let scrollY: number;
  let heroEl: HTMLElement;
  
  // Handle the parallax effect
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
      });
    }
  });
  
  // Determine height class
  const getHeightClass = () => {
    switch (height) {
      case 'sm': return 'h-[40vh]';
      case 'md': return 'h-[60vh]';
      case 'lg': return 'h-[80vh]';
      case 'full': return 'h-screen';
      default: return 'h-[60vh]';
    }
  };
</script>

<svelte:window bind:scrollY />

<div 
  bind:this={heroEl}
  class="relative overflow-hidden {getHeightClass()} flex items-center justify-center"
>
  <!-- Parallax background image -->
  <div 
    class="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transform"
    style="background-image: url({image}); transform: translateY({scrollY * 0.3}px);"
  ></div>
  
  <!-- Overlay for better text readability -->
  {#if overlay}
    <div 
      class="absolute inset-0 bg-black"
      style="opacity: {overlayOpacity};"
    ></div>
  {/if}
  
  <!-- Decorative Chinese lattice corners -->
  {#if decorative}
    <div class="absolute top-0 left-0 w-32 h-32 opacity-30 rotate-180">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 L40,0 L40,10 L10,10 L10,40 L0,40 Z" fill="currentColor" class="text-white" />
      </svg>
    </div>
    <div class="absolute top-0 right-0 w-32 h-32 opacity-30">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M60,0 L100,0 L100,40 L90,40 L90,10 L60,10 Z" fill="currentColor" class="text-white" />
      </svg>
    </div>
    <div class="absolute bottom-0 left-0 w-32 h-32 opacity-30">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,60 L0,100 L40,100 L40,90 L10,90 L10,60 Z" fill="currentColor" class="text-white" />
      </svg>
    </div>
    <div class="absolute bottom-0 right-0 w-32 h-32 opacity-30">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M60,90 L60,100 L100,100 L100,60 L90,60 L90,90 Z" fill="currentColor" class="text-white" />
      </svg>
    </div>
  {/if}
  
  <!-- Content -->
  <div class="relative z-10 container mx-auto px-4 text-center">
    <div class="max-w-4xl mx-auto">
      <!-- Decorative Chinese font for subtitle -->
      {#if subtitle}
        <p class="font-decorative text-lg md:text-2xl mb-4 text-{textColor} opacity-90">
          {subtitle}
        </p>
      {/if}
      
      <!-- Main title -->
      {#if title}
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-{textColor}">
          {title}
        </h1>
      {/if}
      
      <!-- Call to action buttons -->
      {#if primaryCta || secondaryCta}
        <div class="flex flex-wrap gap-4 mt-8 justify-center">
          {#if primaryCta}
            <a href={primaryCta.href} class="bannerButton hover:scale-105 transition-transform duration-300">
              {primaryCta.text}
            </a>
          {/if}
          
          {#if secondaryCta}
            <a href={secondaryCta.href} class="bannerButton hover:scale-105 transition-transform duration-300">
              {secondaryCta.text}
            </a>
          {/if}
        </div>
      {/if}
      
      <!-- Optional slot for additional content -->
      <slot></slot>
    </div>
  </div>
</div> 