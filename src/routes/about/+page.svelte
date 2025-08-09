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
      image: '/images/team/sarah.jpg',
    },
    {
      name: 'Michael Wong',
      role: 'Head of Operations',
      bio: 'Michael ensures every tour runs smoothly, bringing his expertise in logistics and customer service to create seamless travel experiences.',
      image: '/images/team/michael.jpg',
    },
    {
      name: 'Li Wei',
      role: 'Senior Tour Guide',
      bio: 'A certified tour guide with deep knowledge of Chinese history and culture, Li brings destinations to life with engaging storytelling.',
      image: '/images/team/li.jpg',
    },
  ];

  // Why choose us points (use i18n keys instead of hardcoded English)
  const whyChooseUs = [
    {
      icon: 'temple',
      titleKey: 'about.why_choose.points.local_expertise.title',
      descKey: 'about.why_choose.points.local_expertise.description',
    },
    {
      icon: 'dragon',
      titleKey: 'about.why_choose.points.cultural_immersion.title',
      descKey: 'about.why_choose.points.cultural_immersion.description',
    },
    {
      icon: 'panda',
      titleKey: 'about.why_choose.points.personalized_service.title',
      descKey: 'about.why_choose.points.personalized_service.description',
    },
    {
      icon: 'lantern',
      titleKey: 'about.why_choose.points.quality_assurance.title',
      descKey: 'about.why_choose.points.quality_assurance.description',
    },
  ];
</script>

<svelte:head>
  <title>About Us | {$t('site.title')}</title>
  <meta
    name="description"
    content="Learn about AiluroWander, your trusted partner for authentic Asian travel experiences."
  />
</svelte:head>

<Hero
  title={$t('about.page.title')}
  subtitle={$t('about.page.subtitle')}
  backgroundImage="/images/about-hero.png"
  primaryCta={{ text: $t('about.page.hero_cta'), href: '/tours' }}
/>

<!-- Our Story -->
<Section title={$t('about.story.title')} subtitle={$t('about.story.subtitle')} background="white">
  <div class="max-w-3xl mx-auto text-lg text-neutral-700">
    <p class="mb-6">
      {$t('about.story.paragraph1')}
    </p>
    <p class="mb-6">
      {$t('about.story.paragraph2')}
    </p>
    <p>
      {$t('about.story.paragraph3')}
    </p>
  </div>
</Section>

<!-- Our Mission -->
<Section
  title={$t('about.mission.title')}
  subtitle={$t('about.mission.subtitle')}
  background="gray"
>
  <div class="grid md:grid-cols-2 gap-12 items-center">
    <div class="space-y-6">
      <p class="text-lg text-neutral-700">
        {$t('about.mission.intro')}
      </p>
      <ul class="space-y-4">
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>{$t('about.mission.points.authentic')}</span>
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>{$t('about.mission.points.sustainable')}</span>
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>{$t('about.mission.points.knowledge')}</span>
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3">✦</span>
          <span>{$t('about.mission.points.memories')}</span>
        </li>
      </ul>
    </div>
    <div class="relative">
      <img
        src="/images/about-mission.png"
        alt="Our mission in action"
        class="rounded-lg shadow-lg"
      />
      <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
    </div>
  </div>
</Section>

<!-- Why Choose Us -->
<Section
  title={$t('about.why_choose.title')}
  subtitle={$t('about.why_choose.subtitle')}
  background="white"
>
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    {#each whyChooseUs as item}
      <Card
        title={$t(item.titleKey)}
        description={$t(item.descKey)}
        icon={{
          name: item.icon as
            | 'great-wall'
            | 'terracotta'
            | 'forbidden-city'
            | 'mountains'
            | 'panda'
            | 'temple'
            | 'pagoda'
            | 'dragon'
            | 'lantern'
            | 'bamboo',
          color: '#B91C1C',
        }}
        elevated={true}
      />
    {/each}
  </div>
</Section>

<!-- Our Team -->
<Section title={$t('about.team.title')} subtitle={$t('about.team.subtitle')} background="gray">
  <div class="grid md:grid-cols-3 gap-8">
    {#each teamMembers as member}
      <Card title={member.name} description={member.bio} image={member.image} elevated={true}>
        <div class="mt-4 text-primary font-medium">{member.role}</div>
      </Card>
    {/each}
  </div>
</Section>

<!-- Call to Action -->
<section class="py-16 text-white bg-primary">
  <div class="container">
    <div class="text-center max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold mb-6">{$t('about.cta.title')}</h2>
      <p class="text-lg mb-8">
        {$t('about.cta.subtitle')}
      </p>
      <div class="flex justify-center gap-4">
        <a href="/tours" class="btn btn-light">{$t('about.cta.explore_tours')}</a>
        <a href="/contact" class="btn btn-outline-light">{$t('about.cta.contact_us')}</a>
      </div>
    </div>
  </div>
</section>
