<script>
	import AdvisoryBoard from '$lib/components/advisory-board.svelte';
	import CancerConnect from '$lib/components/cancer-connect.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Navigation from '$lib/components/navigation.svelte';
	import Solutions from '$lib/components/solutions.svelte';
	import Stats from '$lib/components/stats.svelte';
	import Team from '$lib/components/team.svelte';
	import Vision from '$lib/components/vision.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Map from '$lib/components/map/map.svelte';
	import Donation from '$lib/components/donation.svelte';
	import TransparentLogo from '../assets/images/logo_head.webp';
</script>

<svelte:head>
	<title>Jarurat Care Foundation</title>
	<meta charset="utf-8" />

	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-QN1XGRGT6K"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-QN1XGRGT6K');
	</script>

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
	<!-- <meta
		name="twitter:image"
		content="https://static.ghost.org/v5.0.0/images/publication-cover.jpg"
	/> -->
	<!-- <meta name="twitter:site" content="@ghost" /> -->
	<!-- <meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="840" /> -->
</svelte:head>

<Navigation />
<Hero />
<Stats />
<Vision />
<Solutions />
<AdvisoryBoard />
<Map />
<CancerConnect />
<Team />
<Donation />
<Footer />

<a class="flex items-center gap-2 fixed bottom-2 right-2 z-30" href="/hope">
	<span class="bg-yellow-400 px-2 py-1 rounded-md">Talk to Hope</span>
	<div class="size-[3rem] p-1 rounded-full border bg-white">
		<img src={TransparentLogo} alt="Jarurat Care Foundation" class="w-full" />
	</div>
</a>
