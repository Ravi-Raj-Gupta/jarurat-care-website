<script>
	import testimonials from '$lib/data/testimonials.json';

	const perPage = 3;
	const pageCount = Math.ceil(testimonials.length / perPage);

	let currentPage = 0;

	$: visible = testimonials.slice(currentPage * perPage, currentPage * perPage + perPage);

	function goTo(page) {
		currentPage = Math.max(0, Math.min(page, pageCount - 1));
	}

	function initials(name) {
		return name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}
</script>

<section class="py-12 md:py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4 md:px-6">
		<h2 class="text-2xl md:text-4xl font-bold text-[#0D2561] text-center mb-8 md:mb-10">
			Testimonials
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
			{#each visible as t}
				<div class="rounded-2xl shadow-md overflow-hidden flex flex-col bg-white border border-[#EEF2F9]">
					<div class="p-6 flex-1">
						<span class="text-[#93B4FF] text-3xl font-serif leading-none">&ldquo;</span>
						<p class="text-[#475569] text-sm leading-relaxed mt-2">
							{t.content}
						</p>
					</div>
					<div class="bg-[#EAF1FF] p-4 flex items-center gap-3">
						<div class="w-9 h-9 rounded-full bg-[#C9D9FF] text-[#0D2561] text-xs font-semibold flex items-center justify-center shrink-0">
							{initials(t.name)}
						</div>
						<div class="leading-tight">
							<p class="font-semibold text-[#0D2561] text-sm">{t.name}</p>
							<p class="text-[#64748B] text-xs">{t.description}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex items-center justify-center gap-2 mt-8">
			<button
				class="text-[#1E40AF] px-2 disabled:opacity-30"
				on:click={() => goTo(currentPage - 1)}
				disabled={currentPage === 0}
				aria-label="Previous"
			>
				&laquo;
			</button>

			{#each Array(pageCount) as _, i}
				<button
					class="w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-colors
						{currentPage === i ? 'bg-[#1E40AF] text-white' : 'bg-[#E5ECFF] text-[#1E40AF]'}"
					on:click={() => goTo(i)}
				>
					{i + 1}
				</button>
			{/each}

			<button
				class="text-[#1E40AF] px-2 disabled:opacity-30"
				on:click={() => goTo(currentPage + 1)}
				disabled={currentPage === pageCount - 1}
				aria-label="Next"
			>
				&raquo;
			</button>
		</div>
	</div>
</section>