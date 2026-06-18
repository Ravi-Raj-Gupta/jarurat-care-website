<script lang="ts">
	export let data;

	const blogs = data.blogs;
</script>

<svelte:head>
	<title>Blogs | Jarurat Care Foundation</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-20">

	<h1 class="text-5xl font-bold text-[#0D2561] mb-3">
		Blogs
	</h1>

	<p class="text-gray-600 mb-12">
		Read our latest blogs.
	</p>

	<div class="grid md:grid-cols-3 gap-8">

		{#each blogs as blog}

			<div class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">

				{#if blog.featured_image}
					<img
						src={blog.featured_image}
						alt={blog.title}
						class="w-full h-56 object-cover"
					/>
				{/if}

				<div class="p-6">

					<h2 class="text-2xl font-bold text-[#0D2561] mb-3">
						{blog.title}
					</h2>

					<p class="text-gray-600 mb-5">
						{blog.excerpt}
					</p>

					<a
						href={`/content/blog/${blog.slug}`}
						class="text-[#1E4ED8] font-semibold"
					>
						Read More →
					</a>

				</div>

			</div>

		{/each}

	</div>

</div>