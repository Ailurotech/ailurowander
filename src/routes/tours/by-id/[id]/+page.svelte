<!-- This page is only used for redirection to the slug-based URL -->
<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    // The actual redirection is handled in +page.ts
    // This component is just a fallback
  });
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-2xl font-semibold mb-4">Redirecting...</h1>
    <p class="text-gray-600">Please wait while we redirect you to the tour page.</p>
  </div>
</div> 