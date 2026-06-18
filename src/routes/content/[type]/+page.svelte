<script lang="ts">
	export let data;

	const content = data.content;
	const type = data.type;

	function titleCase(text: string) {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
</script>

<svelte:head>
	<title>{titleCase(type)} | Jarurat Care Foundation</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-20">

	<h1 class="text-5xl font-bold text-[#0D2561] mb-3">
		{titleCase(type)}
	</h1>

	<p class="text-gray-600 mb-12">
		Browse all {type}.
	</p>

	{#if content.length === 0}

		<div class="text-center py-20">

			<h2 class="text-3xl font-bold text-gray-700 mb-3">
				No {type} found
			</h2>

			<p class="text-gray-500">
				Content will appear here once created.
			</p>

		</div>

	{:else}

		<div class="grid md:grid-cols-3 gap-8">

			{#each content as item}

				<div class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">

					{#if item.featured_image}
						<img
							src={item.featured_image}
							alt={item.title}
							class="w-full h-56 object-cover"
						/>
					{/if}

					<div class="p-6">

						<div class="text-sm uppercase text-blue-600 font-semibold mb-2">
							{item.content_type}
						</div>

						<h2 class="text-2xl font-bold mb-3">
							{item.title}
						</h2>

						<p class="text-gray-600 mb-5">
							{item.excerpt}
						</p>

						<a
							href={`/content/${type}/${item.slug}`}
							class="text-[#1E4ED8] font-semibold"
						>
							Read More →
						</a>

					</div>

				</div>

			{/each}

		</div>

	{/if}

</div>