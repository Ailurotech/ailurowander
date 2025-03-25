<script lang="ts">
  import { page } from '$app/stores';
  import { locale, supportedLanguages } from '$lib/i18n';
  
  let isMenuOpen = false;
  let isLanguageMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function toggleLanguageMenu() {
    isLanguageMenuOpen = !isLanguageMenuOpen;
  }
  
  function setLanguage(langCode: string) {
    $locale = langCode;
    isLanguageMenuOpen = false;
  }
  
  // Language abbreviations map with proper typing
  const langAbbrev: Record<string, string> = {
    'en': 'ENG',
    'zh': 'CHN',
    'de': 'DEU',
    'ja': 'JPN',
    'es': 'ESP'
  };
</script>

<header class="sticky top-0 z-50 bg-primary text-white shadow-md">
  <div class="container py-3">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <a href="/" class="text-xl font-bold">AiluroWander</a>
      
      <!-- Mobile Menu Button -->
      <button class="md:hidden" on:click={toggleMenu} aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6">
        <a href="/" class="hover:text-secondary {$page.url.pathname === '/' ? 'font-bold border-b-2 border-secondary' : ''}">Home</a>
        <a href="/tours" class="hover:text-secondary {$page.url.pathname.startsWith('/tours') ? 'font-bold border-b-2 border-secondary' : ''}">Tours</a>
        <a href="/about" class="hover:text-secondary {$page.url.pathname === '/about' ? 'font-bold border-b-2 border-secondary' : ''}">About</a>
        <a href="/contact" class="hover:text-secondary {$page.url.pathname === '/contact' ? 'font-bold border-b-2 border-secondary' : ''}">Contact</a>
      </nav>
      
      <!-- Search and Language -->
      <div class="hidden md:flex items-center space-x-4">
        <div class="relative">
          <input type="text" placeholder="Search" class="input py-1 text-gray-900 w-40 lg:w-64" />
          <button class="absolute right-2 top-1/2 -translate-y-1/2" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <!-- Language Selector -->
        <div class="relative">
          <button 
            class="flex items-center space-x-1 rounded-full bg-white/10 px-2 py-1 hover:bg-white/20" 
            on:click={toggleLanguageMenu}
            aria-label="Select language"
          >
            <span class="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white/20">
              {#if $locale === 'en'}
                🇬🇧
              {:else if $locale === 'zh'}
                🇨🇳
              {:else if $locale === 'de'}
                🇩🇪
              {:else if $locale === 'ja'}
                🇯🇵
              {:else if $locale === 'es'}
                🇪🇸
              {/if}
            </span>
            <span class="text-xs font-medium">{langAbbrev[$locale]}</span>
          </button>
          
          {#if isLanguageMenuOpen}
            <div class="absolute right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50">
              {#each supportedLanguages as lang}
                <button 
                  class="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                  on:click={() => setLanguage(lang.code)}
                >
                  <span class="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                    {#if lang.code === 'en'}
                      🇬🇧
                    {:else if lang.code === 'zh'}
                      🇨🇳
                    {:else if lang.code === 'de'}
                      🇩🇪
                    {:else if lang.code === 'ja'}
                      🇯🇵
                    {:else if lang.code === 'es'}
                      🇪🇸
                    {/if}
                  </span>
                  <span class="text-xs font-medium">{langAbbrev[lang.code]}</span>
                  <span class="text-sm ml-1">({lang.name})</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    {#if isMenuOpen}
      <nav class="md:hidden py-4 border-t border-white/20 mt-3 space-y-3">
        <a href="/" class="block hover:text-secondary {$page.url.pathname === '/' ? 'font-bold' : ''}">Home</a>
        <a href="/tours" class="block hover:text-secondary {$page.url.pathname.startsWith('/tours') ? 'font-bold' : ''}">Tours</a>
        <a href="/about" class="block hover:text-secondary {$page.url.pathname === '/about' ? 'font-bold' : ''}">About</a>
        <a href="/contact" class="block hover:text-secondary {$page.url.pathname === '/contact' ? 'font-bold' : ''}">Contact</a>
        
        <div class="pt-3 border-t border-white/20">
          <input type="text" placeholder="Search" class="input py-1 text-gray-900 w-full mb-3" />
          
          <!-- Mobile Language Selector -->
          <div class="flex flex-wrap gap-2">
            {#each supportedLanguages as lang}
              <button 
                class="flex items-center space-x-1 rounded-full bg-white/10 px-2 py-1 hover:bg-white/20 {$locale === lang.code ? 'ring-2 ring-secondary' : ''}"
                on:click={() => setLanguage(lang.code)}
              >
                <span class="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white/20">
                  {#if lang.code === 'en'}
                    🇬🇧
                  {:else if lang.code === 'zh'}
                    🇨🇳
                  {:else if lang.code === 'de'}
                    🇩🇪
                  {:else if lang.code === 'ja'}
                    🇯🇵
                  {:else if lang.code === 'es'}
                    🇪🇸
                  {/if}
                </span>
                <span class="text-xs font-medium">{langAbbrev[lang.code]}</span>
              </button>
            {/each}
          </div>
        </div>
      </nav>
    {/if}
  </div>
</header> 