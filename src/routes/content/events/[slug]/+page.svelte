<script lang="ts">
	export let data;

	const event = data.event;
</script>

<svelte:head>
	<title>{event.title}</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-20">

	{#if event.featured_image}
		<img
			src={event.featured_image}
			alt={event.title}
			class="w-full h-[450px] object-cover rounded-2xl mb-10"
		/>
	{/if}

	<div class="text-blue-600 uppercase font-semibold mb-2">
		Event
	</div>

	<h1 class="text-5xl font-bold text-[#0D2561] mb-6">
		{event.title}
	</h1>

	{#if event.excerpt}
		<p class="text-xl text-gray-600 mb-8">
			{event.excerpt}
		</p>
	{/if}

	<div class="prose max-w-none">
		{@html event.content}
	</div>

</div>