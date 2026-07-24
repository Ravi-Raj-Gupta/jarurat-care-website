<script>
	import CaregivingCard from './caregiving-card.svelte';
	import WhiteLogo from '$lib/svg/white-logo.svelte';
	import PeoplePlus from '$lib/svg/people-plus.svelte';
	import ChatbotIcon from '$lib/svg/chatbot-icon.svelte';
	import Cards from './cards.svelte';
	import WaveUnion from '$lib/svg/about/wave-union.svelte';
	import { onMount } from "svelte";
	import { Splide, SplideSlide } from "@splidejs/svelte-splide";
	import priyankaWhiteBackgound from '$lib/assets/team-members/priyanka-whiteBackgound.png';

	const items = [
		{
			iconType: 'ribbon',
			title: 'Why Cancer',
			about: 'A dedicated group of caregivers ready to connect patients, caregivers, and healthcare professionals.'
		},
		{
			iconType: 'clipboard',
			title: 'Treatment Care Think Tank',
			about: 'An expert team of oncologists, officials, dieticians, and spiritual advisors for tailored patient care.'
		},
		{
			iconType: 'bot',
			title: 'Hope - AI Chatbot',
			about: 'Available on our website jarurat.care, Hope provides immediate support and guidance.'
		}
	];

	const founders = [
		{ image: priyankaWhiteBackgound, name: 'Priyanka Joshi' }
	];

	let advisoryBoard = [];
	let splideInstance;
	let loadingAdvisoryBoard = true;

	async function fetchData(url, callback) {
		try {
			const response = await fetch(url);
			const data = await response.json();
			callback(data);
		} catch (error) {
			console.error(error);
		}
	}

	onMount(() => {
		fetchData(
			'https://jarurat-care-backend.onrender.com/jc/advisoryBoard/profiles/getAll',
			(data) => {
				advisoryBoard = data?.profiles || [];
				loadingAdvisoryBoard = false;
			}
		);
	});
</script>

<div class="bg-[#D3F2FC] pt-16 pb-20 relative overflow-x-hidden">

	<!-- CAREGIVING SOLUTIONS -->
	<section class="max-w-6xl mx-auto px-4 mt-12 md:mt-16">

		<!-- Main Light Container -->
		<div class="bg-white rounded-3xl px-6 md:px-12 py-10 md:py-14 shadow-sm border border-gray-100">

			<!-- Centered Dark Header -->
			<h2 class="text-center text-3xl md:text-4xl font-bold text-[#1E293B] mb-12">
				Caregiving Solutions
			</h2>

			<!-- 3 Column Cards Grid with New Template Loop -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

				{#each items as item}
					<CaregivingCard
						iconType={item.iconType}
						about={item.about}
						title={item.title}
					/>
				{/each}

			</div>

		</div>

	</section>


	<!-- ADVISORY BOARD -->
	<section class="max-w-6xl mx-auto mt-20 px-6 md:px-0 flex flex-col md:flex-row gap-10 items-start">

		<!-- Left text -->
		<div class="md:w-[320px]">

			<h2 class="text-2xl font-extrabold">
				<span class="text-primaryBlue">Advisory</span>
				<span class="text-black"> Board</span>
			</h2>

			<p class="text-[#00408A] text-sm mt-3">
				Our Advisory Board features top oncologists and cancer experts guiding us in providing the best care.
			</p>

		</div>

		<!-- Slider -->
		<div class="w-full md:w-[65%]">

			{#if !loadingAdvisoryBoard}

				<Splide
					options={{
						type: 'loop',
						perPage: 3,
						gap: '2rem',
						autoplay: true,
						interval: 3000,
						pauseOnHover: true,
						speed: 800,
						arrows: false,
						pagination: true,
						padding: '1rem',
						breakpoints: {
							1024: {
								perPage: 2,
								gap: '1.5rem',
								padding: '0.5rem'
							},
							768: {
								perPage: 1,
								gap: '1rem',
								padding: '0'
							}
						}
					}}
					bind:this={splideInstance}
					class="w-full"
				>

					{#each advisoryBoard as profile}

						<SplideSlide>

							<Cards
								image={profile.images[0]}
								name={profile.name}
								about={profile.designation}
							/>

						</SplideSlide>

					{/each}

				</Splide>

			{:else}

				<div class="text-center">Loading...</div>

			{/if}

		</div>

	</section>


	<!-- WAVE -->
	<div class="absolute bottom-[28rem] hidden lg:block left-0 w-[99.5%] rotate-6 z-10">
		<WaveUnion />
	</div>


	<section class="bg-white max-w-4xl mx-auto mt-24 rounded-3xl pt-10 pb-16 px-6 relative z-10">

		<div class="text-center mb-8">

			<h2 class="font-extrabold text-2xl">
				<span class="text-primaryBlue">Pioneer Of</span>
				<br />
				Our Foundation
			</h2>

			<p class="text-[#00408A] text-sm font-semibold mt-3">
				The heart behind our foundation comes from someone who personally experienced the challenges of cancer.
			</p>

		</div>

		<div class="flex flex-col items-center justify-center gap-10">

			{#each founders as founder}

				<div class="relative mx-auto">

					<div class="bg-primaryBlue w-56 h-[20rem] -rotate-2 rounded-xl"></div>

					<div class="absolute top-0 w-56 h-[20rem]">

						<img
							class="h-full w-full object-cover rounded-xl"
							src={founder.image}
							alt=""
						/>

						<div class="bg-white text-center py-3 absolute bottom-0 w-full">

							<div class="text-[#0D2460]">
								{founder.name}
							</div>

							<div class="text-primaryBlue">
								Founder
							</div>

						</div>

					</div>

				</div>

			{/each}

		</div>

	</section>

</div>
