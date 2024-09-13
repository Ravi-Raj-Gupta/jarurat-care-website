<script>
	import OurValueItem from "./our-value-item.svelte";
	import ReachIcon from "$lib/svg/reach-icon.svelte";
    
    const items = [
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
		},
		{
			icon: ReachIcon,
			title: 'Reach',
            about:"We actively connect with cancer patients, caregivers, and communities across India, ensuring that our support is accessible to those who need it most."
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


