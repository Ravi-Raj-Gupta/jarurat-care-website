<script>
	import background from '$lib/assets/our-vison-image.png';
	import OurVisionCard from './our-vision-card.svelte';

	let cards = [
		'We support cancer patients through education, emotional well-being, research, and time management with community backing.',
		'Our vision is to create an all-inclusive community of cancer warriors, caregivers, and doctors in India, fostering support, knowledge sharing, and solidarity in the fight against cancer.',
		'We support cancer patients through education, emotional well-being, research, and time management with community backing.'
	];
</script>

<div class="h-[27rem] w-[85%] mx-auto my-24">
	<div
		class="w-full h-full bg-cover bg-center rounded-3xl"
		style={`background-image: url(${background})`}
	>
		<div class="text-white w-[580px] text-center ml-[25%]">
			<div class="py-7 font-extrabold text-xl">Our Vision</div>
			<div class=" ">
				Our vision is to create an all-inclusive community of cancer warriors, caregivers, and
				doctors in India, fostering support, knowledge sharing, and solidarity in the fight against
				cancer.
			</div>
		</div>

		<div class="cards flex gap-4 mt-8 justify-center">
			{#each cards as item}
				<OurVisionCard content={item} />
			{/each}
		</div>
	</div>
</div>
