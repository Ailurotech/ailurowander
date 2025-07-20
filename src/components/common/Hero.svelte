<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let backgroundImage: string = '/images/hero.jpg';
  export let primaryCta: { text: string; href: string } | null = null;
  export let secondaryCta: { text: string; href: string } | null = null;
</script>

<section
  class="hero min-h-[80vh] relative flex items-center justify-center"
  style="background-image: url('{backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;"
>
  <div class="hero-overlay bg-gradient-to-r from-black/70 to-black/30"></div>
  <div class="hero-content text-white text-center relative z-10">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
      <p class="text-xl md:text-2xl mb-8">{subtitle}</p>

      {#if primaryCta || secondaryCta}
        <div class="flex flex-wrap gap-4 justify-center">
          {#if primaryCta}
            <a
              href={primaryCta.href}
              class="btn btn-primary hover:scale-105 transition-transform duration-300"
              >{primaryCta.text}</a
            >
          {/if}
          {#if secondaryCta}
            <a
              href={secondaryCta.href}
              class="btn btn-outline btn-secondary text-white hover:text-white hover:scale-105 transition-transform duration-300"
              >{secondaryCta.text}</a
            >
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section>
