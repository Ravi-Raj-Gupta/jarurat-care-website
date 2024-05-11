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
