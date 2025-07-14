<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  // Detect if text contains Chinese characters
  function containsChinese(text: string): boolean {
    return /[\u4e00-\u9fff]/.test(text);
  }
  
  export let text: string = '';
  export let context: string = '';
  export let category: string = '';
  export let disabled: boolean = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'primary' | 'secondary' | 'outline' = 'secondary';
  
  const dispatch = createEventDispatcher();
  
  let isTranslating = false;
  let translationResult: Record<string, string> | null = null;
  let showResults = false;
  let error = '';
  
  // Check if text contains Chinese characters
  $: hasChinese = containsChinese(text);
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  
  async function translateText() {
    if (!text.trim() || !hasChinese) {
      error = 'No Chinese text to translate';
      return;
    }
    
    isTranslating = true;
    error = '';
    showResults = false;
    
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chineseText: text.trim(),
          context: context || undefined,
          category: category || undefined
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        translationResult = result.data.translations;
        showResults = true;
        dispatch('translated', { translations: translationResult });
      } else {
        error = result.error || 'Translation failed';
      }
    } catch (err) {
      error = 'Failed to connect to translation service';
      console.error('Translation error:', err);
    } finally {
      isTranslating = false;
    }
  }
  
  function applyTranslation(langCode: string) {
    if (translationResult && translationResult[langCode]) {
      dispatch('apply', { 
        language: langCode, 
        translation: translationResult[langCode] 
      });
      showResults = false;
    }
  }
  
  function closeResults() {
    showResults = false;
    translationResult = null;
  }
</script>

<div class="relative inline-block">
  <!-- Translate Button -->
  <button
    type="button"
    on:click={translateText}
    disabled={disabled || isTranslating || !hasChinese}
    class="inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed {sizeClasses[size]} {variantClasses[variant]}"
  >
    {#if isTranslating}
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Translating...
    {:else}
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      Translate
    {/if}
  </button>
  
  <!-- Error Message -->
  {#if error}
    <div class="absolute top-full left-0 mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 z-10">
      {error}
    </div>
  {/if}
  
  <!-- Translation Results -->
  {#if showResults && translationResult}
    <div class="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-80">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-medium text-gray-900">Translation Results</h4>
        <button
          type="button"
          on:click={closeResults}
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-2">
        {#if translationResult.en}
          <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div class="flex-1">
              <div class="text-xs text-gray-500 uppercase font-medium">English</div>
              <div class="text-sm text-gray-900">{translationResult.en}</div>
            </div>
            <button
              type="button"
              on:click={() => applyTranslation('en')}
              class="ml-2 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark"
            >
              Apply
            </button>
          </div>
        {/if}
      </div>
      
      <div class="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Click "Apply" to use the translation in your form
      </div>
    </div>
  {/if}
</div> 