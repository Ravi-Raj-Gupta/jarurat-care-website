<script lang="ts">
	export let data;

	const events = data.events;
</script>

<svelte:head>
	<title>Events | Jarurat Care Foundation</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-20">

	<h1 class="text-5xl font-bold text-[#0D2561] mb-3">
		Events
	</h1>

	<p class="text-gray-600 mb-10">
		Upcoming and past events.
	</p>

	<div class="grid md:grid-cols-3 gap-8">

		{#each events as event}

			<div class="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden">

				{#if event.featured_image}
					<img
						src={event.featured_image}
						alt={event.title}
						class="w-full h-56 object-cover"
					/>
				{/if}

				<div class="p-6">

					<div class="text-sm text-blue-600 font-semibold mb-2">
						Event
					</div>

					<h2 class="text-2xl font-bold mb-3">
						{event.title}
					</h2>

					<p class="text-gray-600 mb-5">
						{event.excerpt}
					</p>

					<a
						href={`/content/events/${event.slug}`}
						class="text-[#1E4ED8] font-semibold"
					>
						Read More →
					</a>

				</div>

			</div>

		{/each}

	</div>

</div>