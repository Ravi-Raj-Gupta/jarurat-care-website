<script>
	import CaregivingCard from './caregiving-card.svelte';
	import WhiteLogo from '$lib/svg/white-logo.svelte';
	import PeoplePlus from '$lib/svg/people-plus.svelte';
	import ChatbotIcon from '$lib/svg/chatbot-icon.svelte';
	import Cards from './cards.svelte';
	import priyanka from '$lib/assets/team-members/priyanka.webp';
	import priyankaWhiteBackgound from '$lib/assets/team-members/priyanka-whiteBackgound.png';
	import ayush from '$lib/assets/team-members/ayush.png';

	const items = [
		{
			icon: PeoplePlus,
			title: 'Cancer Connect',
			about:
				'A group of committed caregivers ready to assist with connecting patients, caregivers, and healthcare professionals for sharing updates, promoting awareness, and accessing educational resources.'
		},
		{
			icon: WhiteLogo,
			title: 'Treatment Care Think Tank',
			about:
				'An expert team of oncologists, officials, dieticians, and spiritual advisors to analyze individual cases for tailored, comprehensive patient care.'
		},
		{
			icon: ChatbotIcon,
			title: 'Hope - AI Chatbot',
			about:
				'Available on our website jarurat.care, Hope provides immediate support and information, designed to answer questions and provide guidance at any time.'
		}
	];

	const cards = [
		{
			image: priyanka,
			name: 'Priyanka',
			about: 'Medical Oncologist'
		},
		{
			image: priyanka,
			name: 'Priyanka',
			about: 'Medical Oncologist'
		},
		{
			image: priyanka,
			name: 'Priyanka',
			about: 'Medical Oncologist'
		}
	];

	const founders = [
		{ image: priyankaWhiteBackgound, name: 'Priyanka Joshi' },
		{ image: ayush, name: 'Ayush Anand' }
	];
</script>

<div class="bg-[#D3F2FC] mt-64 relative">
	<div class="h-[411px]">
		<div class="px-16 py-16 bg-[#0D2561] absolute -top-44 left-[5%] rounded-3xl">
			<div class="text-xl text-center font-extrabold mb-8">
				<span class="text-white"> CAREGIVING </span> <span class="text-[#FFBA41]">Solution</span>
			</div>
			<div class="flex gap-10">
				{#each items as item}
					<CaregivingCard icon={item.icon} about={item.about} title={item.title} />
				{/each}
			</div>
		</div>
	</div>
	<div class="advisory board flex justify-center gap-6">
		<div class="w-[332px]">
			<div class="font-extrabold text-xl">
				<span class="text-primaryBlue">Advisory </span> <span class="text-black">Board</span>
			</div>
			<div class="text-[#00408A] text-sm mt-2">
				Our Advisory Board features top oncologists and cancer experts. They guide us in providing
				the best care and staying updated on treatment advances, helping us make a real difference.
			</div>
		</div>
		<div class="cards flex gap-5 w-1/2 bg-red-500 relative">
			<div class="back-arrow absolute bg-red-500 w-5 h-5 rounded-full -left-2 top-[45%]"></div>
			<div class="front-arrow absolute bg-red-500 w-5 h-5 rounded-full -right-2 top-[45%]"></div>
			{#each cards as card}
				<Cards image={card.image} name={card.name} about={card.about} />
			{/each}
		</div>
	</div>

	<!-- pioneers of our foundation -->
	<div class="bg-[#FFFFFF] w-2/3 mx-auto px-16 py-10 mt-20 rounded-3xl z-10 relative">
		<div class="text-center">
			<div class="mb-5">
				<div class="text-primaryBlue font-extrabold text-2xl">Pioneers Of</div>
				<div class="font-extrabold text-2xl">Our Foundation</div>
			</div>
			<div class="text-[#00408A] text-sm font-semibold">
				The heart behind our foundation is someone who personally knows the challenges of battling
				cancer. Driven by a deep desire to help others, they started Jarurat Care to offer support,
				hope, and a community to those facing this difficult journey.
			</div>
		</div>

		<div class="cards flex justify-center gap-10 mt-9 mb-5">
			{#each founders as item}
				<div class="card relative">
					<div class="back bg-primaryBlue w-60 h-[20rem] -rotate-2"></div>
					<div class="front w-60 h-[20rem] absolute  top-0">
						<div class="image h-[20rem]"><img class="h-[20rem]" src={item.image} alt="" /></div>
						<div class="about bg-white flex flex-col justify-center items-center py-4 absolute w-full bottom-[1px]">
							<div class="text-[#0D2460]">{item.name}</div>
							<div class="text-primaryBlue">Co- Founder</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

	</div>

    <!-- our team -->
    <div class=" bg-primaryBlue flex justify-center  py-24 gap-6 relative bottom-11">
		<div class="w-[332px] mr-12">
			<div class="font-extrabold text-xl">
				<span class="text-white">Our </span> <span class="text-[#FFBA41]">Team</span>
			</div>
			<div class="text-white text-sm mt-2">
				Our Advisory Board features top oncologists and cancer experts. They guide us in providing the best care and staying updated on treatment advances, helping us make a real difference.
			</div>
		</div>
		<div class="cards flex gap-5 w-1/2 bg-red-500 relative">
			<div class="back-arrow absolute bg-red-500 w-5 h-5 rounded-full -left-2 top-[45%]"></div>
			<div class="front-arrow absolute bg-red-500 w-5 h-5 rounded-full -right-2 top-[45%]"></div>
			{#each cards as card}
				<Cards image={card.image} name={card.name} about={card.about} />
			{/each}
		</div>
	</div>

</div>
