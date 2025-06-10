<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../components/common/Section.svelte';
  import Hero from '../../components/common/Hero.svelte';
  import Card from '../../components/molecules/Card.svelte';
  import ChineseIcon from '../../components/atoms/ChineseIcon.svelte';
  import { enhance } from '$app/forms';

  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  let isSubmitting = false;
  let submitStatus: 'success' | 'error' | null = null;
  let submitMessage = '';

  async function handleSubmit(event: SubmitEvent) {
    isSubmitting = true;
    submitStatus = null;
    submitMessage = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      submitStatus = 'success';
      submitMessage = 'Thank you for your message. We will get back to you soon!';
      formData = { name: '', email: '', subject: '', message: '' };
    } catch (error) {
      submitStatus = 'error';
      submitMessage = 'Sorry, there was an error sending your message. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Contact Us | {$t('site.title')}</title>
  <meta name="description" content="Get in touch with AiluroWander for your Asian travel inquiries." />
</svelte:head>

<Hero 
  title="Contact Us"
  subtitle="We're here to help plan your perfect Asian adventure"
  backgroundImage="/images/contact-hero.jpg"
/>

<Section 
  title="Get in Touch"
  subtitle="Have questions about our tours? We'd love to hear from you."
  background="white"
>
  <div class="grid md:grid-cols-2 gap-16">
    <!-- Contact Form -->
    <div class="bg-white rounded-lg shadow-lg p-8">
      <form on:submit|preventDefault={handleSubmit} class="space-y-8">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            required
            class="input input-bordered w-full"
            placeholder="Your name"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            class="input input-bordered w-full"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            id="subject"
            bind:value={formData.subject}
            required
            class="input input-bordered w-full"
            placeholder="What is this regarding?"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            id="message"
            bind:value={formData.message}
            required
            rows="5"
            class="textarea textarea-bordered w-full"
            placeholder="Your message..."
          ></textarea>
        </div>

        {#if submitStatus}
          <div class="alert {submitStatus === 'success' ? 'alert-success' : 'alert-error'}">
            {submitMessage}
          </div>
        {/if}

        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <span class="loading loading-spinner"></span>
            Sending...
          {:else}
            Send Message
          {/if}
        </button>
      </form>
    </div>

    <!-- Contact Information -->
    <div class="space-y-12">
      <Card
        title="Contact Information"
        description="We're here to help you plan your perfect Asian adventure."
        icon={{ name: 'dragon', color: '#B91C1C' }}
        elevated={true}
      >
        <div class="mt-8 space-y-6">
          <div class="flex items-center">
            <div class="mr-4">
              <ChineseIcon icon="dragon" size="md" color="#B91C1C" />
            </div>
            <span class="text-lg">0474 212 611</span>
          </div>
          <div class="flex items-center">
            <div class="mr-4">
              <ChineseIcon icon="temple" size="md" color="#B91C1C" />
            </div>
            <span class="text-lg">Mon-Fri: 9:00 AM - 6:00 PM AEST</span>
          </div>
          <a 
            href="https://wa.me/61474212611" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn btn-success w-full mt-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </Card>

      <Card
        title="Why Contact Us?"
        description="Our team of travel experts is ready to help you with:"
        icon={{ name: 'lantern', color: '#B91C1C' }}
        elevated={true}
      >
        <ul class="mt-8 space-y-4">
          <li class="flex items-start">
            <span class="text-primary mr-3">✦</span>
            <span class="text-lg">Customizing your tour itinerary</span>
          </li>
          <li class="flex items-start">
            <span class="text-primary mr-3">✦</span>
            <span class="text-lg">Answering questions about our tours</span>
          </li>
          <li class="flex items-start">
            <span class="text-primary mr-3">✦</span>
            <span class="text-lg">Special requests and accommodations</span>
          </li>
          <li class="flex items-start">
            <span class="text-primary mr-3">✦</span>
            <span class="text-lg">Group bookings and corporate travel</span>
          </li>
        </ul>
      </Card>
    </div>
  </div>
</Section> 