<script>
	import WhyCancerIcon from '$lib/assets/icons/why-cancer-icon.svg';
	import TreatmentIcon from '$lib/assets/icons/treatment-care-icon.png';
	import ChatbotIcon from '$lib/assets/icons/hopebot.png';

	const items = [
		{
			image: WhyCancerIcon,
			title: 'Why Cancer',
			about:
				'A dedicated group of caregivers ready to connect patients, caregivers, and healthcare professionals.'
		},
		{
			image: TreatmentIcon,
			title: 'Treatment Care Think Tank',
			about:
				'An expert team of oncologists, officials, dieticians, and spiritual advisors for tailored patient care.'
		},
		{
			image: ChatbotIcon,
			title: 'Hope - AI Chatbot',
			about: 'Available on our website jarurat.care, Hope provides immediate support and guidance.'
		}
	];
</script>

<div class="py-12 md:py-16 relative overflow-x-hidden">
	<section class="max-w-[1312px] mx-auto px-4">
		<div class="bg-white/80 backdrop-blur-md rounded-[28px] p-8 md:p-14 shadow-lg border border-slate-100 mx-auto">
			<h2 class="text-center text-3xl md:text-[36px] font-bold text-[#0D2460] mb-12 tracking-tight">
				Caregiving Solutions
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
				{#each items as item}
					<div class="flex flex-col items-center text-center p-4">
						<div class="w-16 h-16 mb-4 flex items-center justify-center">
							<img 
								src={item.image} 
								alt={item.title} 
								class="w-full h-full object-contain" 
							/>
						</div>

						<h3 class="text-lg font-bold text-[#0D2460] mb-3">
							{item.title}
						</h3>

						<p class="text-sm text-slate-600 leading-relaxed max-w-xs">
							{item.about}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>