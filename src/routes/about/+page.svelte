<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../components/common/Section.svelte';
  import Hero from '../../components/common/Hero.svelte';
  import Card from '../../components/molecules/Card.svelte';
  import Divider from '../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../components/atoms/ChineseIcon.svelte';
  
  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'With over 15 years of experience in Asian tourism, Sarah founded AiluroWander to share her passion for authentic travel experiences.',
      image: '/images/team/sarah.jpg'
    },
    {
      name: 'Michael Wong',
      role: 'Head of Operations',
      bio: 'Michael ensures every tour runs smoothly, bringing his expertise in logistics and customer service to create seamless travel experiences.',
      image: '/images/team/michael.jpg'
    },
    {
      name: 'Li Wei',
      role: 'Senior Tour Guide',
      bio: 'A certified tour guide with deep knowledge of Chinese history and culture, Li brings destinations to life with engaging storytelling.',
      image: '/images/team/li.jpg'
    }
  ];

  // Why choose us points
  const whyChooseUs = [
    {
      icon: 'temple',
      title: 'Local Expertise',
      description: 'Our team consists of local experts who know the hidden gems and authentic experiences that make your journey special.'
    },
    {
      icon: 'dragon',
      title: 'Cultural Immersion',
      description: 'We go beyond typical tourist spots to provide genuine cultural experiences that connect you with local traditions.'
    },
    {
      icon: 'panda',
      title: 'Personalized Service',
      description: 'Every tour is tailored to your preferences, ensuring a unique and memorable experience that matches your interests.'
    },
    {
      icon: 'lantern',
      title: 'Quality Assurance',
      description: 'We maintain the highest standards in accommodation, transportation, and guides to ensure your comfort and safety.'
    }
  ];
</script>

<svelte:head>
  <title>About Us | {$t('site.title')}</title>
  <meta name="description" content="Learn about AiluroWander, your trusted partner for authentic Asian travel experiences." />
</svelte:head>

<Hero 
  title="About AiluroWander"
  subtitle="Your Gateway to Authentic Asian Travel Experiences"
  backgroundImage="/images/about-hero.png"
  primaryCta={{ text: "Explore Our Tours", href: "/tours" }}
/>

<!-- Our Story -->
<Section 
  title="Our Story"
  subtitle="Crafting Unforgettable Asian Travel Experiences Since 2010"
  background="white"
>
  <div class="max-w-3xl mx-auto text-lg text-neutral-700">
    <p class="mb-6">
      Founded in 2010, AiluroWander has grown from a small local tour operator to a leading travel agency specializing in authentic Asian travel experiences. Our journey began with a simple mission: to help travelers discover the real Asia beyond the typical tourist trails.
    </p>
    <p class="mb-6">
      What sets us apart is our deep connection to the local cultures and communities we serve. Our team of experienced guides and travel experts are passionate about sharing the rich heritage, traditions, and hidden gems of Asia with our guests.
    </p>
    <p>
      Today, we're proud to have helped thousands of travelers create lasting memories through our carefully curated tours and personalized travel experiences.
    </p>
  </div>
</Section>

<!-- Our Mission -->
<Section 
  title="Our Mission"
  subtitle="Connecting Travelers with Authentic Asian Experiences"
  background="gray"
>
  <div class="grid md:grid-cols-2 gap-12 items-center">
    <div class="space-y-6">
      <p class="text-lg text-neutral-700">
        At AiluroWander, we believe that travel is more than just visiting places – it's about creating meaningful connections with different cultures and communities. Our mission is to:
      </p>
      <ul class="space-y-4">
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>Provide authentic and immersive travel experiences that go beyond typical tourist attractions</span>
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>Support local communities and promote sustainable tourism practices</span>
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>Share our deep knowledge and passion for Asian cultures with our guests</span>
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>Create unforgettable memories through personalized service and attention to detail</span>
        </li>
      </ul>
    </div>
    <div class="relative">
      <img 
        src="/images/about-mission.jpg" 
        alt="Our mission in action" 
        class="rounded-lg shadow-lg"
      />
      <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
    </div>
  </div>
</Section>

<!-- Why Choose Us -->
<Section 
  title="Why Choose Us"
  subtitle="Experience the AiluroWander Difference"
  background="white"
>
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    {#each whyChooseUs as item}
      <Card
        title={item.title}
        description={item.description}
        icon={{ name: item.icon as 'great-wall' | 'terracotta' | 'forbidden-city' | 'mountains' | 'panda' | 'temple' | 'pagoda' | 'dragon' | 'lantern' | 'bamboo', color: '#B91C1C' }}
        elevated={true}
      />
    {/each}
  </div>
</Section>

<!-- Our Team -->
<Section 
  title="Meet Our Team"
  subtitle="The Experts Behind Your Journey"
  background="gray"
>
  <div class="grid md:grid-cols-3 gap-8">
    {#each teamMembers as member}
      <Card
        title={member.name}
        description={member.bio}
        image={member.image}
        elevated={true}
      >
        <div class="mt-4 text-primary font-medium">{member.role}</div>
      </Card>
    {/each}
  </div>
</Section>

<!-- Call to Action -->
<section class="py-16 text-white bg-primary">
  <div class="container">
    <div class="text-center max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold mb-6">Ready to Start Your Asian Adventure?</h2>
      <p class="text-lg mb-8">
        Join us in discovering the wonders of Asia. Our expert team is ready to help you plan your perfect journey.
      </p>
      <div class="flex justify-center gap-4">
        <a href="/tours" class="btn btn-light">Explore Tours</a>
        <a href="/contact" class="btn btn-outline-light">Contact Us</a>
      </div>
    </div>
  </div>
</section> 