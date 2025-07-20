<script lang="ts">
  export let width: string = '100%';
  export let height: string = '1rem';
  export let radius: string = '0.25rem';
  export let className: string = '';
</script>

<div
  class="skeleton {className}"
  style="width: {width}; height: {height}; border-radius: {radius};"
  aria-hidden="true"
  role="presentation"
></div>

<style>
  .skeleton {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
