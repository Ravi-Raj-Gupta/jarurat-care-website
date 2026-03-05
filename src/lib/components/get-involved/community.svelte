<script>
	import { onMount, onDestroy } from 'svelte';
	import triptiImage from '$lib/assets/get-involved/tripti.png';
	import shreyaImage from '$lib/assets/get-involved/shreya.png';
	import adityaImage from '$lib/assets/get-involved/aditya.png';
	import communityBackground from '$lib/assets/get-involved/community.png';
	import quoteImage from '$lib/assets/get-involved/quote.png';

	let members = [
		{
			name: 'Tripti',
			role: 'Social Media POD Lead',
			feedback:
				'Being part of Jarurat Care Foundation has been a deeply meaningful experience. The team is collaborative and committed to creating awareness around cancer care.',
			image: triptiImage
		},
		{
			name: 'Shreya',
			role: 'Content & Research',
			feedback:
				'An open and supportive environment where ideas are valued and impact is prioritized.',
			image: shreyaImage
		},
		{
			name: 'Aditya Nalawade',
			role: 'Video Editor',
			feedback:
				'The culture encourages creativity and responsibility while supporting families navigating cancer.',
			image: adityaImage
		}
	];

	let currentIndex = 0;
	let interval;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % members.length;
	}

	function prevSlide() {
		currentIndex =
			(currentIndex - 1 + members.length) % members.length;
	}

	onMount(() => {
		interval = setInterval(nextSlide, 4000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div
	class="w-full md:h-[850px] h-[650px] bg-cover bg-no-repeat bg-blue-50 relative flex items-center justify-center"
	style="background-image: url({communityBackground});"
>
	<div class="w-full max-w-3xl mx-auto px-6">

		<h2 class="text-left md:text-center text-2xl md:text-3xl font-extrabold text-[#0D2460] mb-10">
			Hear From <span class="text-[#0155BD]">Our Community</span>
		</h2>

		<div class="relative overflow-hidden">

			<!-- Track -->
			<div
				class="flex transition-transform duration-700 ease-in-out"
				style="transform: translateX(-{currentIndex * 100}%);"
			>
				{#each members as member}
					<div class="w-full flex-shrink-0 px-4">

						<div class="bg-white rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-md">

							<img
								src={member.image}
								alt={member.name}
								class="w-[120px] h-[120px] md:w-[200px] md:h-[200px] object-cover rounded-xl"
							/>

							<div class="flex flex-col justify-center">

								<h3 class="text-xl font-bold text-[#0155BD]">
									{member.name}
								</h3>

								<p class="text-sm text-gray-500 mb-3">
									{member.role}
								</p>

								<img
									src={quoteImage}
									alt="quote"
									class="w-6 h-6 mb-2"
								/>

								<p class="text-sm text-gray-600 leading-relaxed">
									{member.feedback}
								</p>

							</div>

						</div>

					</div>
				{/each}
			</div>

			<!-- Arrows -->
			<button
				on:click={prevSlide}
				class="absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFBA41] transition"
			>
				&lt;
			</button>

			<button
				on:click={nextSlide}
				class="absolute right-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFBA41] transition"
			>
				&gt;
			</button>

		</div>
	</div>
</div>