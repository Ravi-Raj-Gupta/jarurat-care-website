<script>
	import { goto } from '$app/navigation';

	const goVolunteer = () => {
		goto('/patients-caregivers');
	};

	const goJoinTeam = () => {
		goto('/oncologists-physicians');
	};

	const goPartnership = () => {
		goto('/pharma-partners');
	};
</script>

<div
	class="w-full h-[750px] bg-[url('src/lib/assets/get-involved/help_section.png')] flex flex-col justify-center items-center bg-cover bg-center"
>
	<div
		class="w-[85%] md:w-3/4 h-[80%] bg-white rounded-2xl flex flex-col justify-center items-center p-2"
	>
		<h2 class="font-bold text-[#FFBA41] text-center text-lg sm:text-xl md:text-4xl lg:text-5xl">
			HOW YOU CAN
			<span class="text-[#0155BD]">GET INVOLVED</span>
		</h2>

		<div class="my-2 text-center text-xs sm:text-sm md:text-base">
			"Together, We Create Impact"
		</div>

		<p
			class="w-[80%] md:w-[50%] text-center text-xs sm:text-sm md:text-base lg:font-normal box-border my-2"
		>
			Join Jarurat Care Foundation as a patient, healthcare professional, 
			or strategic partner. Your engagement strengthens access, awareness, 
			and patient-centered oncology support.
		</p>

		<div class="buttons my-5 flex flex-col md:flex-row gap-2 md:gap-4">
			<button
				on:click={goVolunteer}
				class="bg-[#9CCB44] text-white py-2 px-4 border-[2px] border-double border-[#c2ec8b] rounded-full text-sm md:text-base"
			>
				Patients / Caregivers
			</button>

			<button
				on:click={goJoinTeam}
				class="bg-[#0155BD] text-white py-2 px-4 border-[2px] border-double border-[#78a8e2] rounded-full text-sm md:text-base"
			>
				Oncologists / Physicians
			</button>

			<button
				on:click={goPartnership}
				class="bg-[#FFBA41] text-white py-2 px-4 border-[2px] border-double border-[#efc171] rounded-full text-sm md:text-base"
			>
				Pharma / Partners
			</button>
		</div>
	</div>
</div>