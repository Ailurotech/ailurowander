<script lang="ts">
  export let type: 'simple' | 'decorative' | 'symbol' = 'simple';
  export let color: string = 'neutral-300';
  export let symbol: string = '❖';
  export let className: string = '';
  
  // Symbol options could include: '❖', '✦', '✵', '✺', '✼', '❀', '❃', '❇', '❉', '❋'
</script>

{#if type === 'simple'}
  <hr class="my-8 border-t border-{color} {className}" />
{:else if type === 'decorative'}
  <div class="chinese-divider {className}"></div>
{:else if type === 'symbol'}
  <div class="relative my-8 {className}">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-{color}"></div>
    </div>
    <div class="relative flex justify-center">
      <span class="bg-white px-4 text-{color} text-xl">{symbol}</span>
    </div>
  </div>
{/if} 