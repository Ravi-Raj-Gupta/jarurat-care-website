<script>
	import Connect from "$lib/svg/connect.svelte";
	import Resources from "$lib/svg/resources.svelte";
	import SingleWave from "$lib/svg/single-wave.svelte";
import OurCommunityItem from "./our-community-item.svelte";

    const items = [
		{
			icon: Connect,
			title: 'The Cancer Project',
            about:"India ’ s first ever cancer podcast and webinar series for discussions on treatments, stories, and expert insights."
		},
		{
			icon: Resources,
			title: 'Resource Guidance',
            about:"Building India’s largest Edtech hub for any cancer queries in 7+ regional languages."
		},
        {
            icon: Resources,
            title: 'Social Community',
            about:"Building social media hub to discuss early detection & prevention of terminal cancers."
        },
		{
			icon: Resources,
			title: 'Patient Advocacy',
            about:"Advocating patients’ rights & educating people about what’ s rightfully correct in healthcare space."
		},
	];
</script>

<div class="mx-auto mt-16 w-[30rem]">
    <div class="text-primaryBlue text-center  font-extrabold text-xl">OUR COMMUNITY </div>
    <div class="mb-24 text-center font-extrabold text-xl">BACKED SERVICES</div>
    
    <div class="flex lg:gap-3 justify-center">
        {#each items as item}
        <OurCommunityItem icon={item.icon} about={item.about} title={item.title}/>
        {/each}
    </div>
</div>

