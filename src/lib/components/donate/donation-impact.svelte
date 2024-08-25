<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '../ui/button.svelte';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import JSON_ImpactOfDonation from '$lib/data/donate/impact-of-donation.json';

	let innerWidth = writable(0);

	onMount(() => {
		innerWidth.set(window.innerWidth);
		window.addEventListener('resize', () => {
			innerWidth.set(window.innerWidth);
		});
	});
</script>

<div class="py-8 sm:py-24">
	<div class="max-w-[70rem] mx-auto px-5 sm:px-10">
		<h2 class="text-[1.5em] sm:text-[2em] font-bold text-[#0155BD] leading-tight">Impact Of Your Donation</h2>
		<p class="text-[#676E77] leading-snug text-[0.9em] sm:text-[1em]">
			Supporting the physical and emotional needs of a cancer patient empowers them to contribute
			positively to society, turning them into a source of strength rather than burden.
		</p>
	</div>

	<Splide
		hasTrack={false}
		aria-label="..."
		class="max-w-[70rem] mx-auto mt-8 z-10"
		options={{ perPage: $innerWidth < 600 ? 1 : 3, type: 'loop' }}
	>
		<div class="custom-wrapper">
			<SplideTrack>
				{#each JSON_ImpactOfDonation as item}
					<SplideSlide class="p-1 px-5 sm:px-10 w-full">
						<div class="h-full flex flex-col justify-end pb-4">
							<div
								class="w-full aspect-[9/11] rounded-2xl bg-cover bg-center"
								style="background-image: url('{item.imgSrc}');"
							></div>

							<div class="p-4 bg-white max-w-[80%] mx-auto rounded-xl -mt-20 border">
								<small class="block uppercase text-[#37393D] font-bold leading-snug">{item.title}</small>
								<p class="text-[0.8em] text-[#5D5F64] leading-snug">{item.content}</p>
							</div>
						</div>
					</SplideSlide>
				{/each}
			</SplideTrack>
		</div>

		<div class="splide__arrows flex items-center justify-center gap-2 sm:mt-4">
			<Button class="splide__arrow splide__arrow--prev size-8 p-0 items-center">
				<ChevronLeft class="w-full" />
			</Button>
			<Button class="splide__arrow splide__arrow--next size-8 p-0 flex items-center">
				<ChevronRight class="w-full" />
			</Button>
		</div>
	</Splide>

	<Button class="flex gap-2 mx-auto mt-8 sm:mt-16">Make a Donation <ArrowRight /></Button>
</div>
