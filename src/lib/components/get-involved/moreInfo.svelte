<script>
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import volunteerImg from '$lib/assets/get-involved/volunteer.png';
	import joinTeamImg from '$lib/assets/get-involved/join.png';
	import partnershipImg from '$lib/assets/get-involved/partnership.png';

	let current = 0;
	let interval;

	const slides = [
		{
			title1: "FOR PATIENTS &",
			title2: "CAREGIVERS",
			desc: "Personalized guidance. Trusted resources. Compassionate continuity through every stage of the cancer journey.",
			img: volunteerImg,
			btn: "Access Support",
			action: () => goto('/patients-caregivers')
		},
		{
			title1: "FOR ONCOLOGY",
			title2: "PROFESSIONALS",
			desc: "Partner with us to enhance patient pathways, strengthen care ecosystems, and drive measurable impact.",
			img: joinTeamImg,
			btn: "Collaborate With Us",
			action: () => goto('/oncologists-physicians')
		},
		{
			title1: "STRATEGIC",
			title2: "PARTNERSHIPS",
			desc: "Build responsible collaborations that expand access, elevate awareness, and advance oncology outcomes.",
			img: partnershipImg,
			btn: "Explore Partnership",
			action: () => goto('/pharma-partners')
		}
	];

	onMount(() => {
		interval = setInterval(() => {
			current = (current + 1) % slides.length;
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex justify-center items-center p-5 md:p-32 bg-blue-50 w-screen md:w-full">

	<div class="relative w-full md:w-[85%] overflow-hidden">

		<!-- Slider Track -->
		<div
			class="flex transition-transform duration-[1000ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
			style="transform: translateX(-{current * 100}%);"
		>

			{#each slides as slide}
				<div class="w-full flex-shrink-0 px-3">

					<!-- Clean Card (No Shadow) -->
					<div class="relative flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl px-10 md:px-16 py-12 md:py-16 w-full min-h-[340px] md:min-h-[380px] transition-all duration-500">

						<!-- Text -->
						<div class="flex flex-col justify-center md:w-2/3 text-left space-y-5">

							<h3 class="font-extrabold text-[#FFBA41] text-xl sm:text-2xl md:text-3xl">
								{slide.title1}
								<span class="text-[#0155BD]"> {slide.title2}</span>
							</h3>

							<p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
								{slide.desc}
							</p>

							<button
								on:click={slide.action}
								class="w-fit bg-[#9CCB44] text-white py-3 px-8 rounded-full border border-[#c2ec8b] transition-all duration-300 hover:opacity-90"
							>
								<span class="text-sm md:text-base font-medium tracking-wide">
									{slide.btn}
								</span>
							</button>

						</div>

						<!-- Image -->
						<div class="flex justify-center md:justify-end items-center md:w-1/3 mt-8 md:mt-0">
							<img
								src={slide.img}
								alt="slide-image"
								class="w-[120px] md:w-[190px] object-contain"
							/>
						</div>

					</div>

				</div>
			{/each}

		</div>

		<!-- Minimal Dots -->
		<div class="flex justify-center mt-10 space-x-3">
			{#each slides as _, i}
				<div
					on:click={() => current = i}
					class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-500
					{current === i ? 'bg-[#0155BD] scale-125' : 'bg-gray-300'}"
				></div>
			{/each}
		</div>

	</div>
</div>