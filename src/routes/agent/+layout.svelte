<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Check if the route is the login page
  $: isLoginPage = $page.url.pathname === '/agent' || $page.url.pathname === '/agent/';
  
  // Get agent data from the server load function
  export let data: { agent?: { id: string; username: string; email: string; role: string } };
  
  // Handle logout
  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      goto('/agent');
    } catch (error) {
      console.error('Logout error:', error);
      goto('/agent');
    }
  }
</script>

{#if isLoginPage}
  <!-- Login page has its own layout -->
  <slot />
{:else}
  <!-- Regular layout for authenticated pages -->
  <div class="min-h-screen bg-neutral-50 flex flex-col">
    <!-- Top navigation bar -->
    <header class="bg-primary text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-8">
          <a href="/agent/tours" class="text-xl font-bold flex items-center">
            <img src="/ailuro-logo.png" alt="AiluroWander" class="h-6 w-auto mr-2" />
            <span class="font-decorative">AiluroWander</span>
            <span class="ml-2 text-sm font-normal bg-white/20 px-2 py-0.5 rounded">Agent</span>
          </a>
          
          <nav class="hidden md:flex space-x-6">
            <a 
              href="/agent/tours" 
              class="hover:text-white/80 {$page.url.pathname.startsWith('/agent/tours') ? 'font-bold border-b-2 border-white/70' : ''}"
            >
              Tours
            </a>
            <a 
              href="/agent/bookings" 
              class="hover:text-white/80 {$page.url.pathname.startsWith('/agent/bookings') ? 'font-bold border-b-2 border-white/70' : ''}"
            >
              Bookings
            </a>
            <a 
              href="/agent/customers" 
              class="hover:text-white/80 {$page.url.pathname.startsWith('/agent/customers') ? 'font-bold border-b-2 border-white/70' : ''}"
            >
              Customers
            </a>
            <a 
              href="/agent/users" 
              class="hover:text-white/80 {$page.url.pathname.startsWith('/agent/users') ? 'font-bold border-b-2 border-white/70' : ''}"
            >
              Users
            </a>
          </nav>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="hidden md:block">
            <span class="text-sm">Welcome, {data.agent?.username || 'Agent'}</span>
          </div>
          
          <div class="border-l border-white/20 h-6 mx-2 hidden md:block"></div>
          
          <button 
            on:click={handleLogout}
            class="hover:bg-white/10 px-3 py-1 rounded-md text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
    
    <!-- Mobile navigation for small screens -->
    <div class="bg-primary-dark text-white md:hidden">
      <div class="container mx-auto px-4 py-2 flex justify-between overflow-x-auto">
        <a 
          href="/agent/tours" 
          class="whitespace-nowrap px-3 py-1 rounded-md {$page.url.pathname.startsWith('/agent/tours') ? 'bg-white/10 font-bold' : ''}"
        >
          Tours
        </a>
        <a 
          href="/agent/bookings" 
          class="whitespace-nowrap px-3 py-1 rounded-md {$page.url.pathname.startsWith('/agent/bookings') ? 'bg-white/10 font-bold' : ''}"
        >
          Bookings
        </a>
        <a 
          href="/agent/customers" 
          class="whitespace-nowrap px-3 py-1 rounded-md {$page.url.pathname.startsWith('/agent/customers') ? 'bg-white/10 font-bold' : ''}"
        >
          Customers
        </a>
        <a 
          href="/agent/users" 
          class="whitespace-nowrap px-3 py-1 rounded-md {$page.url.pathname.startsWith('/agent/users') ? 'bg-white/10 font-bold' : ''}"
        >
          Users
        </a>
      </div>
    </div>
    
    <!-- Main content -->
    <main class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-neutral-200 py-4">
      <div class="container mx-auto px-4 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} AiluroWander Travel | Agent Portal</p>
        <p class="mt-1 text-xs">Version 1.0.0</p>
      </div>
    </footer>
  </div>
{/if} 