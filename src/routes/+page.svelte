<script>
	import AdvisoryBoard from '$lib/components/advisory-board.svelte';
	import CancerConnect from '$lib/components/cancer-connect.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Navigation from '$lib/components/navigation.svelte';
	import Solutions from '$lib/components/solutions.svelte';
	import Stats from '$lib/components/stats.svelte';
	import Team from '$lib/components/team.svelte';
	import Vision from '$lib/components/vision.svelte';

	export const ssr = true;
</script>

<Navigation />
<Hero />
<Stats />
<Vision />
<Solutions />
<AdvisoryBoard />
<!--map-->
<CancerConnect />
<Team />
