<script lang="ts">
	import Png1 from '../../assets/images/doctors-pdf/gallbladder/1.png';
	import Png2 from '../../assets/images/doctors-pdf/gallbladder/2.png';
	import Png3 from '../../assets/images/doctors-pdf/gallbladder/3.png';
	import Png4 from '../../assets/images/doctors-pdf/gallbladder/4.png';
	import Png5 from '../../assets/images/doctors-pdf/gallbladder/5.png';
	import Png6 from '../../assets/images/doctors-pdf/gallbladder/6.png';
	import Png7 from '../../assets/images/doctors-pdf/gallbladder/7.png';
	import Png8 from '../../assets/images/doctors-pdf/gallbladder/8.png';
	import Png9 from '../../assets/images/doctors-pdf/gallbladder/9.png';

	import '@splidejs/splide/css';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import Heading from './homepage/heading.svelte';

	const images = [Png1, Png2, Png3, Png4, Png5, Png6, Png7, Png8, Png9];
</script>

<Heading title="Medical Guidelines for Gallstones & Gall Bladder Cancer" subtitle="" />

<div class="container mb-[2rem] mt-4">
	<Splide
		aria-label="Story of Rekha Joshi"
		hasTrack={false}
		options={{
			arrows: true,
			pagination: false,
			autoplay: true,
			type: 'loop',
			lazyLoad: 'nearby'
		}}
	>
		<SplideTrack>
			{#each images as image}
				<SplideSlide class="flex items-center" role="group" aria-roledescription="slide">
					<img src={image} alt="Jarurat Care" class=" rounded-md overflow-hidden" />
				</SplideSlide>
			{/each}
		</SplideTrack>

		<div class="splide__arrows splide__arrows--ltr mom-slide-arrows">
			<button
				class="splide__arrow splide__arrow--prev"
				type="button"
				aria-label="Previous slide"
				aria-controls="splide01-track"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 40 40"
					width="40"
					height="40"
					focusable="false"
				>
					<path
						d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
					></path>
				</svg>
			</button>
			<button
				class="splide__arrow splide__arrow--next"
				type="button"
				aria-label="Next slide"
				aria-controls="splide01-track"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 40 40"
					width="40"
					height="40"
					focusable="false"
				>
					<path
						d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
					></path>
				</svg>
			</button>
		</div>
	</Splide>
</div>
