<script lang="ts">
  import { t } from '$lib/i18n';
  
  export let title: string = $t('home.newsletter.title');
  export let subtitle: string = $t('home.newsletter.subtitle');
  export let buttonText: string = $t('home.newsletter.button');
  export let placeholderText: string = $t('home.newsletter.placeholder');
  export let background: string = '#541212';
</script>

<section class="py-16 text-white" style="background-color: {background};">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">{title}</h2>
      <p class="mb-8">{subtitle}</p>
      
      <form class="flex flex-col md:flex-row gap-4">
        <input 
          type="email" 
          placeholder={placeholderText} 
          class="input input-bordered flex-grow w-full md:w-auto" 
          required 
        />
        <button 
          type="submit" 
          class="btn btn-secondary text-white hover:bg-secondary-light"
        >
          {buttonText}
        </button>
      </form>
    </div>
  </div>
</section> 