<script>
	import OurValueItem from "./our-value-item.svelte";
	import ReachIcon from "$lib/svg/reach-icon.svelte";
	import Envolve from "$lib/svg/about/envolve.svelte";
	import Sustain from "$lib/svg/about/sustain.svelte";
	import Impact from "$lib/svg/about/impact.svelte";
    
    const items = [
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: Impact,
			title: 'Impact',
            about:"We focus on delivering meaningful interventions that make a real difference in the lives of those affected by cancer, from emotional support to practical care."
		},
		{
			icon: Sustain,
			title: 'Sustain',
            about:"We are committed to providing ongoing assistance, ensuring that our programs and services offer continuous care and stability throughout the cancer journey."
		},
		{
			icon: Envolve,
			title: 'Evolve',
            about:"We adapt and grow to meet the changing needs of the cancer community, always striving to improve our services and expand our reach."
		},
	];
</script>

<div class="h-[427px] md:ml-32 ml-4">
	<div class=" font-extrabold mb-11 text-xl">Our values</div>
	<div class="flex gap-4 scroll-container overflow-auto">
		{#each items as item}
	<OurValueItem icon={item.icon} title={item.title} about={item.about}/>
	{/each}
	</div>
</div>
