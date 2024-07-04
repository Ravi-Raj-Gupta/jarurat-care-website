<script lang="ts">
  import { onMount } from 'svelte';
  import logo from '../../../../src/assets/images/logo_head.webp';
  let NavigationComponent: typeof import('$lib/components/navigation.svelte').default;
  let HeroComponent: typeof import('$lib/components/hero.svelte').default;
  let PdfViewerComponent: typeof import('$lib/components/pdf-viewer.svelte').default;
  let FooterComponent: typeof import('$lib/components/footer.svelte').default;

  onMount(async () => {
    NavigationComponent = (await import('$lib/components/navigation.svelte')).default;
    HeroComponent = (await import('$lib/components/hero.svelte')).default;
    PdfViewerComponent = (await import('$lib/components/pdf-viewer.svelte')).default;
    FooterComponent = (await import('$lib/components/footer.svelte')).default;
  });
</script>

<svelte:head>
  <title>Jarurat Care Foundation</title>
  <meta charset="utf-8" />

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-QN1XGRGT6K"></script>

  <meta name="description" content="Jaisi Jarurat, Vaisi Care" />
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

{#if NavigationComponent && HeroComponent && PdfViewerComponent && FooterComponent}
  <NavigationComponent />
  <HeroComponent />
  <PdfViewerComponent />
  <FooterComponent />
{:else}
  <!-- Optionally, you can show a loading indicator or fallback content here -->
  <div>Loading...</div>
{/if}

<a class="flex items-center gap-2 fixed bottom-2 right-2 z-30" href="/hope">
  <span class="bg-yellow-400 px-2 py-1 rounded-md">Talk to Hope</span>
  <div class="size-[3rem] p-1 rounded-full border bg-white">
    <img src={logo} alt="Jarurat Care Foundation" class="w-full" />
  </div>
</a>