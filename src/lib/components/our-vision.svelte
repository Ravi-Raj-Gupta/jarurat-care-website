<script>
	import background from '$lib/assets/our-vison-image.png';
	import OurVisionCard from './our-vision-card.svelte';
	import Carousel from 'svelte-carousel'
	import { onMount } from "svelte";

	let particlesToShow = 3;

const updateParticlesToShow = () => {
  if (window.innerWidth < 768) {
	particlesToShow = 1;
  } else {
	particlesToShow = 3;
  }
};

onMount(() => {
  updateParticlesToShow();  // Set initial value based on window size
  window.addEventListener('resize', updateParticlesToShow);

  return () => {
	window.removeEventListener('resize', updateParticlesToShow);  // Cleanup on component destruction
  };
});


	let cards = [
		'We support cancer patients through education, emotional well-being, research, and time management with community backing.',
		'Our vision is to create an all-inclusive community of cancer warriors, caregivers, and doctors in India, fostering support, knowledge sharing, and solidarity in the fight against cancer.',
		'We support cancer patients through education, emotional well-being, research, and time management with community backing.'
	];
</script>

<div class="pb-10 w-[85%] mx-auto my-24">
	<div
		class="w-full h-full bg-cover bg-center rounded-3xl"
		style={`background-image: url(${background})`}
	>
		<div class="text-white text-center flex justify-center items-center flex-col w-full">
			<div class="py-7 font-extrabold text-xl">Our Vision</div>
			<div class=" md:w-[580px]">
				Our vision is to create an all-inclusive community of cancer warriors, caregivers, and
				doctors in India, fostering support, knowledge sharing, and solidarity in the fight against
				cancer.
			</div>
		</div>

		<div class="cards flex pl-5 gap-4 mt-8 justify-center  items-center">
			<!-- <Carousel  particlesToShow={particlesToShow} particlesToScroll={1}> -->
				{#each cards as item}
					<OurVisionCard content={item} />
				{/each}
			<!-- </Carousel> -->
		</div>
	</div>
</div>
