<script lang="ts">
  import TransparentLogo from '../assets/images/logo_head.webp';
  import Hero from '$lib/components/hero.svelte';
  let PdfViewerComponent: typeof import('$lib/components/pdf-viewer.svelte').default;
  let StatsComponent: typeof import('$lib/components/stats.svelte').default;
  let VisionComponent: typeof import('$lib/components/vision.svelte').default;
  let SolutionsComponent: typeof import('$lib/components/solutions.svelte').default;
  let DonationComponent: typeof import('$lib/components/donation.svelte').default;
  let AdvisoryBoardComponent: typeof import('$lib/components/advisory-board.svelte').default;
  let MapComponent: typeof import('$lib/components/map/map.svelte').default;
  let CancerConnectComponent: typeof import('$lib/components/cancer-connect.svelte').default;
  let TeamComponent: typeof import('$lib/components/team.svelte').default;
  let MomComponent: typeof import('$lib/components/mom.svelte').default;
  let FooterComponent: typeof import('$lib/components/Footer.svelte').default;
  let NavigationComponent: typeof import('$lib/components/Navigation.svelte').default;

  import { onMount } from 'svelte';

  onMount(async () => {
    PdfViewerComponent = (await import('$lib/components/pdf-viewer.svelte')).default;
    StatsComponent = (await import('$lib/components/stats.svelte')).default;
    VisionComponent = (await import('$lib/components/vision.svelte')).default;
    SolutionsComponent = (await import('$lib/components/solutions.svelte')).default;
    DonationComponent = (await import('$lib/components/donation.svelte')).default;
    AdvisoryBoardComponent = (await import('$lib/components/advisory-board.svelte')).default;
    MapComponent = (await import('$lib/components/map/map.svelte')).default;
    CancerConnectComponent = (await import('$lib/components/cancer-connect.svelte')).default;
    TeamComponent = (await import('$lib/components/team.svelte')).default;
    MomComponent = (await import('$lib/components/mom.svelte')).default;
    FooterComponent = (await import('$lib/components/footer.svelte')).default;
    NavigationComponent = (await import('$lib/components/navigation.svelte')).default;
  });
</script>

<svelte:head>
  <title>Jarurat Care Foundation</title>
  <meta charset="utf-8" />
  <meta name="description" content="Jaisi Jarurat, Vaisi Care" />
  <link rel="preload" href="../assets/images/logo_head.webp" as="image" />
  <link rel="preload" href="../app.css" as="style" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="canonical" href="https://jarurat.care/" />
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta property="og:site_name" content="Jarurat Care Foundation" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Jarurat Care Foundation" />
  <meta property="og:description" content="Jaisi Jarurat, Vaisi Care" />
  <meta property="og:url" content="https://jarurat.care/" />
  <meta property="article:publisher" content="https://jarurat.care" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Jarurat Care Foundation" />
  <meta name="twitter:description" content="Jaisi Jarurat, Vaisi Care" />
  <meta name="twitter:url" content="https://jarurat.care/" />
</svelte:head>

{#if NavigationComponent}
  <svelte:component this={NavigationComponent} />
{/if}
<Hero />

{#if PdfViewerComponent}
  <svelte:component this={PdfViewerComponent} />
{/if}
{#if StatsComponent}
  <svelte:component this={StatsComponent} />
{/if}
{#if VisionComponent}
  <svelte:component this={VisionComponent} />
{/if}
{#if SolutionsComponent}
  <svelte:component this={SolutionsComponent} />
{/if}
{#if DonationComponent}
  <svelte:component this={DonationComponent} />
{/if}
{#if AdvisoryBoardComponent}
  <svelte:component this={AdvisoryBoardComponent} />
{/if}
{#if MapComponent}
  <svelte:component this={MapComponent} />
{/if}
{#if CancerConnectComponent}
  <svelte:component this={CancerConnectComponent} />
{/if}
{#if TeamComponent}
  <svelte:component this={TeamComponent} />
{/if}
{#if MomComponent}
  <svelte:component this={MomComponent} />
{/if}
{#if FooterComponent}
  <svelte:component this={FooterComponent} />
{/if}

<a class="flex items-center gap-2 fixed bottom-2 right-2 z-30" href="/hope">
  <span class="bg-yellow-400 px-2 py-1 rounded-md">Talk to Hope</span>
  <div class="size-[3rem] p-1 rounded-full border bg-white">
    <img src={TransparentLogo} alt="Jarurat Care Foundation" loading="lazy" class="w-full" />
  </div>
</a>