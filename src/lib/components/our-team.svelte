<script lang="ts">
	import { cn } from '$lib/utils';
	import Header from './ui/header.svelte';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import ImgPriyanka from '$lib/assets/team-members/priyanka.webp';

	function shuffleArray(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const keyTeamMembers = [
		{
			name: 'Priyanka Joshi',
			designation: 'Co founder',
			text: `At Jarurat Care, our mission is to bring hope and healing to every person battling cancer. We believe in the power of community support, compassion, and innovation to make a real difference in the lives of those we serve.`,
			imageSrc: ImgPriyanka
		}
	];

	let members = shuffleArray([
		{
			name: 'Abdus Azad',
			role: 'Tech Evanglist',
			link: 'https://i.ibb.co/tpxXXKQ/IMG-20240815-WA0051.jpg',
			isCore: true
		},
		{
			name: 'Ojasvita Dahare',
			role: "PM (Founder's Office)",
			link: 'https://i.ibb.co/YRbSShq/ojasvita.webp'
		},
		{
			name: 'Ubhay Avatsa',
			role: 'HR & Ops Lead',
			link: 'https://i.ibb.co/JsjY4vV/ubhay.webp',
			isCore: true
		},
		{
			name: 'Shruti Venkat',
			role: "PM (Founder's Office)",
			link: 'https://i.ibb.co/smWsyJd/shruti.webp'
		},
		{
			name: 'Rakshit Chopra',
			role: "Growth/Founder's Office",
			link: 'https://drive.google.com/file/d/1gevx7lShxaFjeQEQe8behYFR3K0iUzq-/view?usp=drivesdk'
		},
		{
			name: 'Hrithik Shankar Naudiyal',
			role: 'Social Media and PR Strategist',
			link: 'https://drive.google.com/file/d/1IVPqHn8LY4zXu3VgGP17xDh3mpv3dksm/view?usp=drivesdk'
		},
		{
			name: 'Sonali Bhatnagar',
			role: 'Caregiver Mentorship Lead',
			link: 'https://drive.google.com/file/d/1JyxfbS1P4ZKVrYCznGiLWx5PVyNDqNZW/view?usp=drivesdk',
			isCore: true
		},
		{
			name: 'Tripti',
			role: 'Social Media Manager',
			link: 'https://drive.google.com/file/d/1iUQxd2i99T2MkBENZ2l95VdGtld1YUcK/view?usp=drive_link'
		},
		{
			name: 'Ayush',
			role: 'CSR',
			link: 'https://drive.google.com/drive/folders/1-QH1gY6PBtElohD3-vk73Pb2_EjAgjaR'
		},
		{
			name: 'Sourav',
			role: 'Ed Tech',
			link: 'https://drive.google.com/file/d/1auoExzFNZnot-bACgOdFem6jSbrx7wmz/view?usp=drivesdk'
		},
		{
			name: 'Md Shami',
			role: 'Web Dev Tech',
			link: 'https://drive.google.com/file/d/1LEtKLfDMAnKorWPj4OOn77UMHCDCKKC5/view?usp=sharing'
		},
		{
			name: 'Shreya Jain',
			role: 'Content & Research',
			link: 'https://drive.google.com/file/d/1WGCsrneCiFfyPG8au81cFi4erlZHDc8h/view?usp=drive_link'
		},
		{
			name: 'Aarthi Reddy',
			role: 'UI/UX Lead',
			link: 'https://i.ibb.co/WBNvYLD/aarthi.webp',
			isCore: true
		},
		{
			name: 'Zaid Khan',
			role: 'Ed Tech',
			link: 'https://drive.google.com/file/d/1v9Aqj7AthqyTyIRFQfGY4PgUujFmeOx3/view?usp=sharing'
		},
		{
			name: 'Shantanu Kolhe',
			role: "Project Manager (Founder's Office)",
			link: 'https://drive.google.com/file/d/12iJH8IRyiJKJ_QUpqA-afO5TGd0xIGlo/view?usp=drivesdk'
		},
		{
			name: 'Aditya Nalawade',
			role: 'Video editor',
			link: 'https://drive.google.com/file/d/1E0hb7aIZD3PX-PHijJYzuKS6hbA9oVrR/view?usp=drivesdk'
		},
		{
			name: 'Priyansha',
			role: 'Growth & Strategy (CSR)',
			link: 'https://drive.google.com/file/d/1hcQNCEvy7VUL3q3lyRPiBsDUvrd0Lsrj/view?usp=drivesdk',
			isCore: true
		},
		{
			name: 'Sumedha Upadhyay',
			role: 'Growth & Strategy Lead',
			link: 'https://drive.google.com/file/d/1hauqh1G9XdjoMKgsdIe3iByjjo3Dggoi/view?usp=drive_link',
			isCore: true
		},
		{
			name: 'Guyshirjit Singh',
			role: '',
			link: 'https://drive.google.com/file/d/1oRqCIf2nfPJjS5MPKkkZv6iezjrxJ8RH/view/',
			isCore: true
		}
	]);
</script>

<div class="max-w-[70rem] mx-auto py-16 sm:py-20 px-4 overflow-hidden">
	<Header title="Hear from our team" class="text-left font-rubik" />

	<Splide
		hasTrack={false}
		aria-label="..."
		class="max-w-[70rem] mx-auto mt-8 z-10"
		options={{ type: 'loop', arrows: false }}
	>
		<div class="custom-wrapper">
			<SplideTrack>
				{#each keyTeamMembers as member}
					<SplideSlide class="p-2 pl-2 md:max-w-[80%] md:aspect-video">
						<div
							class="h-full rounded-lg flex overflow-hidden text-[#0D2561] shadow-md md:shadow-none border md:border-0"
						>
							<div class="grow max-w-0 md:max-w-[33%] h-full bg-[#D9D9D9]"></div>

							<div class="grow flex flex-col max-w-[100%] md:max-w-[40%] px-8 pt-6 pb-4 gap-4">
								<p>{member.text}</p>
								<div class="grow"></div>

								<div class="flex gap-2">
									<div
										class="aspect-square min-w-[3rem] rounded-full bg-cover"
										style="background-image: url('{member.imageSrc}')"
									></div>
									<div class="flex flex-col font-semibold">
										<h4>{member.name}</h4>
										<small>{member.designation}</small>
									</div>
								</div>
							</div>

							<div class="grow max-w-0 md:max-w-[33%] h-full bg-[#D9D9D9]"></div>
						</div>
					</SplideSlide>
				{/each}
			</SplideTrack>
		</div>
	</Splide>
</div>

<div
	class="max-w-[70rem] mx-auto py-10 sm:py-16 px-4 overflow-hidden flex gap-[6rem] flex-wrap items-center justify-center !hidden"
>
	{#each members as member}
		<div class={cn(`max-w-[15rem] flex flex-col gap-2`)}>
			<div class="max-w-[7rem] w-full mx-auto aspect-square rounded-full overflow-hidden">
				<img
					src={member.link}
					alt={`${member.name}, ${member.role} - Jarurat Care`}
					class="block size-full object-cover"
				/>
			</div>

			<header class="leading-tight text-center text-[0.9em] flex flex-col gap-1">
				<h3 class="leading-[1] font-semibold truncate">{member.name}</h3>
				<small class="block leading-[1] truncate">{member.role}</small>
			</header>
		</div>
	{/each}
</div>
