<script lang="ts">
	export let data;

	const blog = data.blog;
</script>

<svelte:head>
	<title>{blog.title} | Jarurat Care Foundation</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-20">

	{#if blog.featured_image}
		<img
			src={blog.featured_image}
			alt={blog.title}
			class="w-full h-[450px] object-cover rounded-2xl mb-10"
		/>
	{/if}

	<div class="text-blue-600 uppercase font-semibold mb-2">
		Blog
	</div>

	<h1 class="text-5xl font-bold text-[#0D2561] mb-5">
		{blog.title}
	</h1>

	{#if blog.excerpt}
		<p class="text-xl text-gray-600 mb-10">
			{blog.excerpt}
		</p>
	{/if}

	<div class="prose max-w-none">

		{@html blog.content}

	</div>

</div>