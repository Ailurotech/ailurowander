<script lang="ts">
  import '../app.css';
  import Header from '../components/layout/Header.svelte';
  import Footer from '../components/layout/Footer.svelte';
</script>

<div class="min-h-screen flex flex-col">
  <Header />

  <main class="flex-grow">
    <slot />
  </main>

  <Footer />
</div>
