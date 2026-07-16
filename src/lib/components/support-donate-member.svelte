<script lang="ts">
	import HandPlatterHeart from '$lib/svg/hand-platter-heart.svelte';
	import HandPlatterPlus from '$lib/svg/hand-platter-plus.svelte';
	import Hand from '$lib/svg/hand.svelte';
	import Button from './ui/button.svelte';
	import ImgMom from '$lib/assets/mom.webp';
	import whyCancerIcon from '$lib/assets/icons/why-cancer-icon.svg';
    import whyDonateIcon from '$lib/assets/icons/why-donate-icon.svg';
    import whyCollaborationIcon from '$lib/assets/icons/why-collaboration-icon.svg';
    import seekSupportImg from '$lib/assets/icons/seek-support.png';
    import communityImg from '$lib/assets/icons/community.png';
    import chatbotImg from '$lib/assets/icons/hope-ai-chatbot.png';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const cards = [
		{
			icon: HandPlatterPlus,
			image: seekSupportImg,
			title: 'Seek Support',
			description:
				'Our NGO is here to help you through your cancer journey. Reach out to us today for support and care.',
			ctaText: 'Seek Support',
			href: 'mailto:Priyanka.joshi@jarurat.care?subject=Seek%20Support%20For%20Cancer'
		},
		{
			icon: HandPlatterHeart,
			image: communityImg,
			title: 'Cancer Care Community',
			description:
				'Healing Hearts – Our community is here to guide, comfort, and stand beside those facing cancer.',
			ctaText: 'Join Here',
			href: 'https://chat.whatsapp.com/I95f9ycybYSDQIbOW4e0bY'
		},
		{
			icon: Hand,
			image: chatbotImg,
			title: 'HOPE AI CHATBOT',
			description:
				'Our AI assistant is here to provide clarity and support during your cancer journey. Try it today.',
			ctaText: 'Visit Here',
			href: 'https://wa.me/919389529263?text=Hi'
		}
	];

	const sliderTop = [
		{
			title: 'Why Cancer',
			icon: whyCancerIcon,
			content:
				'Cancer remains one of the leading causes of death worldwide, affecting millions of lives each year. Despite advancements in research and treatment, many people still lack access to the care and support they need. By focusing on cancer, we aim to raise awareness, provide vital resources, and drive efforts toward early detection, effective treatment.'
		},
		{
			title: 'Why Donate',
			icon: whyDonateIcon,
			content:
				'Donations are the lifeblood of Jarurat Care, empowering us to provide critical support to cancer patients who need it most. Your contributions directly fund life-saving treatments, emotional care, and essential services that make a real difference in peoples lives. Every donation brings us one step closer to a world where no one has to face cancer alone. Your support is not just important—its transformative.'
		},
		{
			title: 'Why Collaborate',
			icon: whyCollaborationIcon,
			content:
				'Join us because together, we can do so much more. By collaborating, we pool our strengths and resources to bring greater support to those fighting cancer. Your partnership helps us reach more people and make a bigger impact. Let’s work hand in hand to change lives.'
		}
	];

	const sliderBottom = [
		{
			type: 'image',
			title: 'Where it all Started',
			img: ImgMom,
			caption:
				`Rekha's last trip before she started her battle with Cholangiocarcinoma. She succumbed on 25th December, 2023.`
		},
		{
			type: 'text',
			title: 'Our Story',
			content:
				'After losing our beloved mother in December 2023, we founded Jarurat Care to support families navigating similar battles.'
		}
	];
</script>

<!-- ================= TOP SLIDER ================= -->

<section class="py-12 md:py-16 bg-white">
    <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-4xl font-bold text-[#0D2561] text-center mb-8">
        Our Purpose
    </h2>
</div>
	<div class="max-w-6xl mx-auto px-4 md:px-6 relative">
		<Splide
			hasTrack={false}
			options={{
				type: 'loop',
				perPage: 1,
				autoplay: true,
				interval: 3000,
				pauseOnHover: true,
				speed: 800,
				gap: '1.5rem'
			}}
		>
			<SplideTrack>
				{#each sliderTop as slide}
					<SplideSlide>
						<div class="bg-white p-6 md:p-10 rounded-3xl md:rounded-4xl shadow-lg text-center min-h-[240px] md:min-h-[280px] flex flex-col justify-center">
						    <div class="flex justify-center mb-5">
                                <div class="w-12 h-12 rounded-lg bg-[#E9EEFC] flex items-center justify-center">
                                 <img src={slide.icon} alt={slide.title} class="w-6 h-6" />
                           </div>
                       </div>
							<h3 class="text-xl md:text-3xl font-bold text-[#0D2561] mb-3 md:mb-4">
								{slide.title}
							</h3>
							<p class="text-[#475569] leading-relaxed text-sm md:text-base">
								{slide.content}
							</p>
						</div>
					</SplideSlide>
				{/each}
			</SplideTrack>

			<div class="splide__arrows absolute inset-x-0 flex justify-between top-1/2 -translate-y-1/2 px-2 md:px-4">
				<Button class="splide__arrow splide__arrow--prev bg-white rounded-full shadow-md p-2 md:-ml-4">
					<ChevronLeft class="w-5 h-5 md:w-6 md:h-6 text-[#1E40AF]" />
				</Button>
				<Button class="splide__arrow splide__arrow--next bg-white rounded-full shadow-md p-2 md:-mr-4">
					<ChevronRight class="w-5 h-5 md:w-6 md:h-6 text-[#1E40AF]" />
				</Button>
			</div>
		</Splide>
	</div>
</section>

<!-- ================= CARDS ================= -->

<section class="relative py-10 md:py-12 px-4 bg-[#D3F2FC]">
	<div class="max-w-7xl mx-auto">
		<h2 class="text-2xl md:text-4xl font-bold text-[#0D2561] text-center mb-8 md:mb-10">
			Our Support Services
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
			{#each cards as card}
				<div class="bg-white rounded-3xl shadow-lg p-6 md:p-8 text-center hover:scale-105 transition duration-300">
					<div class="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                        <img src={card.image} alt={card.title} class="w-full h-full object-cover" />
                    </div>
					<h3 class="text-lg md:text-xl font-semibold text-[#0D2561] mb-2">
						{card.title}
					</h3>
					<p class="text-[#475569] text-sm mb-4">
						{card.description}
					</p>
					<a href={card.href}>
						<Button class="bg-[#1E40AF] text-white hover:bg-[#0D2561]">
							{card.ctaText}
						</Button>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
<!-- ================= BOTTOM STORY SLIDER ================= -->
<section class="pt-20 pb-12 md:pt-32 md:pb-16 bg-white">
	<div class="max-w-5xl mx-auto px-4 md:px-6 relative">
		<Splide
			hasTrack={false}
			options={{
				type: 'loop',
				perPage: 1,
				autoplay: true,
				interval: 5000,
				speed: 900,
				pauseOnHover: true
			}}
		>
			<!-- added leading-none here -->
			<SplideTrack class="leading-none">
				{#each sliderBottom as slide}
					<SplideSlide>
						{#if slide.type === 'image'}
							<div class="relative rounded-3xl overflow-hidden shadow-2xl">
								<img
									src={slide.img}
									alt={slide.title}
									class="w-full h-[250px] md:h-[360px] object-cover block"
								/>

								<div class="absolute inset-0 bg-[#002944]/60 flex items-end">
									<div class="p-5 md:p-8 text-white">
										<h3 class="text-xl md:text-3xl font-bold mb-2">
											{slide.title}
										</h3>
										<p class="opacity-90 max-w-xl text-sm md:text-base">
											{slide.caption}
										</p>
									</div>
								</div>
							</div>

						{:else}

							<div class="bg-[#F8FAFC] p-6 md:p-12 rounded-3xl shadow-xl text-center min-h-[240px] md:min-h-[300px] flex flex-col justify-center">
								<h3 class="text-xl md:text-3xl font-bold text-[#0D2561] mb-4">
									{slide.title}
								</h3>

								<p class="text-[#475569] leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
									{slide.content}
								</p>

								<p class="text-sm text-gray-400 mt-4">
									Empowering communities through care, compassion, and support.
								</p>
							</div>

						{/if}
					</SplideSlide>
				{/each}
			</SplideTrack>

			<div class="splide__arrows absolute inset-x-0 flex justify-between top-1/2 -translate-y-1/2 px-2 md:px-4">
				<button class="splide__arrow splide__arrow--prev bg-white rounded-full shadow-md p-2">
					<ChevronLeft class="w-5 h-5 md:w-6 md:h-6 text-[#1E40AF]" />
				</button>

				<button class="splide__arrow splide__arrow--next bg-white rounded-full shadow-md p-2">
					<ChevronRight class="w-5 h-5 md:w-6 md:h-6 text-[#1E40AF]" />
				</button>
			</div>

		</Splide>
	</div>
</section>