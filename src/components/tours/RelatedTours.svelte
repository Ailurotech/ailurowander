<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../common/Section.svelte';
  import TourCard from './TourCard.svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  export let currentTourId: string;
  export let tags: string[] = [];

  let loading = true;
  let error = '';
  let related: any[] = [];

  // Normalize API tour shape to the TourCard props that expect simple fields
  function normalizeForCard(t: any, tFn: (k: string) => string) {
    return {
      id: t._id || t.id,
      title: t.title,
      description: t.description,
      image: t.image || t.images?.[0] || '',
      duration:
        typeof t.duration === 'string'
          ? t.duration
          : (t.duration?.days ? `${t.duration.days} ${tFn('tours.days')}` : ''),
      // price can be a number or an object like { amount, currency }
      price: typeof t.price === 'number' ? t.price : (t.price?.amount ?? 0),
      location: t.destination,
      isPopular: !!t.featured
    };
  }

  async function load() {
    loading = true;
    error = '';
    related = [];
    try {
      if (!tags?.length) { loading = false; return; }
      const params = new URLSearchParams({
        tags: tags.join(','),
        excludeId: currentTourId,
        limit: '3'
      });
      const res = await fetch(`/api/tours/related?${params.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const tFn = get(t);
      related = Array.isArray(data) ? data.map((x) => normalizeForCard(x, tFn)) : [];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load related tours';
    } finally {
      loading = false;
    }
  }

  let _key = '';
  onMount(load);
  $: {
    const newKey = `${currentTourId}|${(tags || []).join(',')}`;
    if (newKey !== _key) {
      _key = newKey;
      load();
    }
  }
</script>

<Section
  title={$t('tour_detail.related_tours')}
  subtitle={$t('tour_detail.related_subtitle')}
  background="white"
>
  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each Array(3) as _, i}
        <TourCard tour={{ id: i, title: '', description: '', image: '', duration: '', price: 0, isLoading: true }} />
      {/each}
    </div>
  {:else if error}
    <p class="text-sm text-red-600">{error}</p>
  {:else if !related.length}
    <p class="text-sm text-neutral-500">{$t('tours.page.no_tours_found')}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each related as tour}
        <TourCard {tour} />
      {/each}
    </div>
  {/if}
</Section>