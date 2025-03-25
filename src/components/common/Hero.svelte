<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let backgroundImage: string = '/images/hero.jpg';
  export let primaryCta: { text: string; href: string } | null = null;
  export let secondaryCta: { text: string; href: string } | null = null;
</script>

<section class="hero min-h-[80vh] relative" style="background-image: url('{backgroundImage}');">
  <div class="hero-overlay bg-gradient-to-r from-black/70 to-black/30"></div>
  <div class="hero-content text-white text-left">
    <div class="max-w-2xl">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
      <p class="text-xl md:text-2xl mb-8">{subtitle}</p>
      
      {#if primaryCta || secondaryCta}
        <div class="flex flex-wrap gap-4">
          {#if primaryCta}
            <a href={primaryCta.href} class="btn btn-primary">{primaryCta.text}</a>
          {/if}
          {#if secondaryCta}
            <a href={secondaryCta.href} class="btn btn-outline btn-secondary text-white hover:text-white">{secondaryCta.text}</a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section> 