<script>
	import Header from '../ui/header.svelte';
	import FaqCard from './faq-card.svelte';
	import Button from '../ui/button.svelte';
	import faqs from '$lib/data/faq.json';
	import AnimatedGradientMesh from '$lib/svg/animated-gradient-mesh.svelte';

	const columnOne = faqs.slice(0, faqs.length / 2);
	const columnTwo = faqs.slice(faqs.length / 2);

</script>

<div class="py-16 sm:py-32 px-4 relative">
	<div class="absolute inset-0 overflow-hidden -z-10">
		<!-- can't use. performance issue -->
		<!-- <AnimatedWave class="" /> -->

		<AnimatedGradientMesh />
	</div>

	<Header
		title="FAQ"
		subtitle=""
	/>

	<div class="max-w-[48rem] mx-auto flex flex-col gap-4 my-8">
		{#each faqs as faq}
            <FaqCard
                question={faq.question}
                answer={faq.answer}
        />
    {/each}
</div>
</div>
