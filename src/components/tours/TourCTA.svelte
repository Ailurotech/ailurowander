<script lang="ts">
  import { t } from '$lib/i18n';
  import Button from '../atoms/Button.svelte';
</script>

<!-- CTA Section -->
<div class="bg-primary text-white rounded-2xl p-8 md:p-12 text-center mb-16">
  <h2 class="text-3xl md:text-4xl font-bold mb-4">{$t('tour_detail.cta.title')}</h2>
  <p class="text-lg max-w-2xl mx-auto mb-8">{$t('tour_detail.cta.subtitle')}</p>
  <div class="flex flex-col sm:flex-row justify-center gap-4">
    <Button variant="accent" size="lg">{$t('tour_detail.cta.book_now')}</Button>
    <Button variant="outline" size="lg">{$t('tour_detail.cta.contact_us')}</Button>
  </div>
</div> 