<script lang="ts">
	export let data;

	const news = data.news;
</script>

<svelte:head>
	<title>{news.title}</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-20">

	{#if news.featured_image}
		<img
			src={news.featured_image}
			alt={news.title}
			class="w-full h-[450px] object-cover rounded-2xl mb-10"
		/>
	{/if}

	<div class="text-blue-600 uppercase font-semibold mb-2">
		News
	</div>

	<h1 class="text-5xl font-bold text-[#0D2561] mb-6">
		{news.title}
	</h1>

	<p class="text-xl text-gray-600 mb-8">
		{news.excerpt}
	</p>

	<div class="prose max-w-none">
		{@html news.content}
	</div>

</div>