<script lang="ts">
  import { t } from '$lib/i18n';
  import TranslateButton from '../../atoms/TranslateButton.svelte';
  import ChineseIcon from '../../atoms/ChineseIcon.svelte';
  import type { TourFormData } from '$lib/types/tour';

  export let tourData: TourFormData;
  export let mode: 'add' | 'edit' = 'add';

  // Available icons for tour selection
  const availableIcons = [
    { name: 'great-wall' as const, label: 'Great Wall' },
    { name: 'forbidden-city' as const, label: 'Forbidden City' },
    { name: 'terracotta' as const, label: 'Terracotta Warriors' },
    { name: 'temple' as const, label: 'Temple' },
    { name: 'pagoda' as const, label: 'Pagoda' },
    { name: 'dragon' as const, label: 'Dragon' },
    { name: 'panda' as const, label: 'Panda' },
    { name: 'lantern' as const, label: 'Lantern' },
    { name: 'bamboo' as const, label: 'Bamboo' },
    { name: 'mountains' as const, label: 'Mountains' },
  ];

  let selectedIcon: (typeof availableIcons)[0]['name'] = 'great-wall';
</script>

<!-- Basic Information -->
<div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
  <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.basic_info')}</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="form-group">
      <label for="title" class="form-label">{$t('agent.tours.title_label')}*</label>
      <div class="flex gap-2">
        <input
          type="text"
          id="title"
          bind:value={tourData.title}
          required
          class="input flex-1"
          placeholder={$t('agent.tours.title_placeholder')}
        />
        <TranslateButton
          text={tourData.title}
          context="tour_title"
          category="tours"
          size="sm"
          on:apply={e => (tourData.title = e.detail.translation)}
        />
      </div>
    </div>

    <div class="form-group">
      <label for="destination" class="form-label">{$t('agent.tours.destination_label')}*</label>
      <div class="flex gap-2">
        <input
          type="text"
          id="destination"
          bind:value={tourData.destination}
          required
          class="input flex-1"
          placeholder={$t('agent.tours.destination_placeholder')}
        />
        <TranslateButton
          text={tourData.destination}
          context="tour_destination"
          category="destinations"
          size="sm"
          on:apply={e => (tourData.destination = e.detail.translation)}
        />
      </div>
    </div>

    <div class="form-group">
      <label for="duration" class="form-label">{$t('agent.tours.duration_label')}*</label>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            id="duration-days"
            bind:value={tourData.duration.days}
            required
            min="1"
            class="input w-full"
            placeholder={$t('agent.tours.days')}
          />
        </div>
        <div>
          <input
            type="number"
            id="duration-nights"
            bind:value={tourData.duration.nights}
            required
            min="0"
            class="input w-full"
            placeholder={$t('agent.tours.nights')}
          />
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="price" class="form-label">{$t('agent.tours.price_label')}*</label>
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <input
            type="number"
            id="price-amount"
            bind:value={tourData.price.amount}
            required
            min="0"
            step="0.01"
            class="input w-full"
            placeholder={$t('agent.tours.amount')}
          />
        </div>
        <div>
          <select
            id="price-currency"
            bind:value={tourData.price.currency}
            required
            class="input w-full"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CNY">CNY</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="discount" class="form-label">{$t('agent.tours.discount')}</label>
      <input
        type="number"
        id="discount"
        bind:value={tourData.discount}
        min="0"
        class="input w-full"
        placeholder="e.g. 200"
      />
    </div>

    <div class="form-group">
      <label for="max-group-size" class="form-label">{$t('agent.tours.max_group_size')}</label>
      <input
        type="number"
        id="max-group-size"
        bind:value={tourData.maxGroupSize}
        min="1"
        max="50"
        class="input w-full"
        placeholder={$t('agent.tours.max_group_size_placeholder')}
      />
      <p class="text-xs text-neutral-500 mt-1">Enter the maximum number of people for this tour (1-50)</p>
    </div>
  </div>

  <div class="form-group mt-4">
    <div class="flex items-center">
      <input
        type="checkbox"
        id="featured"
        bind:checked={tourData.featured}
        class="w-5 h-5 text-primary rounded focus:ring-primary"
      />
      <label for="featured" class="ml-2 text-sm font-medium text-neutral-700">
        {$t('agent.tours.featured')}
      </label>
    </div>
    <p class="text-xs text-neutral-500 mt-1">Featured tours are highlighted on the home page.</p>
  </div>
</div>

<!-- Tour Icon Selection -->
<div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
  <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.icon_type')}</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
    {#each availableIcons as icon}
      <button
        type="button"
        class="flex flex-col items-center p-3 rounded-lg border-2 transition-colors {selectedIcon ===
        icon.name
          ? 'border-primary bg-primary-50'
          : 'border-neutral-200 hover:border-neutral-300'}"
        on:click={() => (selectedIcon = icon.name)}
      >
        <ChineseIcon icon={icon.name} size="lg" />
        <span class="mt-2 text-sm">{icon.label}</span>
      </button>
    {/each}
  </div>
</div>

<!-- Tour Description -->
<div class="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
  <h2 class="text-xl font-heading font-bold mb-4">{$t('agent.tours.description_label')}</h2>

  <div class="form-group">
    <label for="subtitle" class="form-label"
      >{$t('agent.tours.subtitle_label')}*</label
    >
    <div class="flex gap-2">
      <input
        type="text"
        id="subtitle"
        bind:value={tourData.subtitle}
        required
        class="input flex-1"
        placeholder={$t('agent.tours.subtitle_placeholder')}
        maxlength="150"
      />
      <TranslateButton
        text={tourData.subtitle}
        context="tour_subtitle"
        category="tours"
        size="sm"
        on:apply={e => (tourData.subtitle = e.detail.translation)}
      />
    </div>
    <div class="text-xs text-neutral-500 mt-1">
      {tourData.subtitle.length}/150 characters
    </div>
  </div>

  <div class="form-group mt-4">
    <label for="description" class="form-label">{$t('agent.tours.description_label')}*</label>
    <div class="flex gap-2">
      <textarea
        id="description"
        bind:value={tourData.description}
        required
        class="input flex-1 h-32"
        placeholder={$t('agent.tours.description_placeholder')}
      ></textarea>
      <TranslateButton
        text={tourData.description}
        context="tour_description"
        category="tours"
        size="sm"
        on:apply={e => (tourData.description = e.detail.translation)}
      />
    </div>
  </div>
</div>
