<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import {
		ArrowUp,
		Link as LinkIcon,
		Calendar,
		Share2
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { trackEvent } from '$lib/utils/analytics';
	import type { PageData } from './$types';

	export let data: PageData;

	$: article = data.article;
	$: type = data.type;
	$: comments = data.comments ?? [];

	let readingProgress = 0;
	let showScrollTop = false;
	let articleEl: HTMLElement;

	onMount(() => {
		const onScroll = () => {
			if (!articleEl) return;

			const rect = articleEl.getBoundingClientRect();
			const total = articleEl.offsetHeight;

			const scrolled = Math.max(0, -rect.top);

			readingProgress = Math.min(
				100,
				Math.round((scrolled / total) * 100)
			);

			showScrollTop = window.scrollY > 600;
		};

		window.addEventListener('scroll', onScroll, {
			passive: true
		});

		/*
		 * Track article view
		 */
		if (article?.id) {
			trackEvent('view', {
				contentId: String(article.id),
				contentType: type
			}).catch((error) => {
				console.error(
					'Failed to track article view:',
					error
				);
			});
		}

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});

	function scrollTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	function formatDate(date: string | null | undefined) {
		if (!date) return '';

		try {
			return new Date(date).toLocaleDateString('en-IN', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		} catch {
			return '';
		}
	}

	function getArticleDate() {
		return (
			article?.published_at ||
			article?.created_at ||
			article?.updated_at
		);
	}

	function shareArticle() {
		if (!article) return;

		const shareData = {
			title: article.title,
			text: article.excerpt || article.title,
			url: window.location.href
		};

		if (navigator.share) {
			navigator.share(shareData).catch(() => {});
		} else {
			navigator.clipboard
				.writeText(window.location.href)
				.then(() => {
					alert('Article link copied!');
				})
				.catch(() => {});
		}
	}
</script>

<svelte:head>
	<title>
		{article?.title
			? `${article.title} | Jarurat Care Foundation`
			: 'Article | Jarurat Care Foundation'}
	</title>

	{#if article?.seo_description}
		<meta
			name="description"
			content={article.seo_description}
		/>
	{:else if article?.excerpt}
		<meta
			name="description"
			content={article.excerpt}
		/>
	{/if}
</svelte:head>

<Nav />

<!-- Reading progress -->
<div
	class="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-100"
>
	<div
		class="h-full bg-[#004085] transition-all duration-100"
		style="width: {readingProgress}%"
	></div>
</div>


{#if article}

	<div
		class="min-h-screen pt-24 pb-32 bg-[#FAFAF8]"
	>

		<article
			bind:this={articleEl}
			class="max-w-4xl mx-auto px-6"
		>

			<!-- ARTICLE HEADER -->
			<header class="mb-10">

				<!-- CATEGORY -->
				{#if article.category}
					<div class="mb-4">

						<span
							class="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#004085] text-sm font-semibold"
						>
							{article.category}
						</span>

					</div>
				{/if}


				<!-- TITLE -->
				<h1
					class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
				>
					{article.title}
				</h1>


				<!-- EXCERPT -->
				{#if article.excerpt}
					<p
						class="text-lg md:text-xl text-gray-600 leading-relaxed mb-6"
					>
						{article.excerpt}
					</p>
				{/if}


				<!-- META -->
				<div
					class="flex flex-wrap items-center gap-5 text-sm text-gray-500"
				>

					{#if getArticleDate()}
						<div class="flex items-center gap-2">
							<Calendar size={16} />

							<span>
								{formatDate(getArticleDate())}
							</span>
						</div>
					{/if}


					{#if article.author_name_credentials}
						<div>
							By
							<span class="font-semibold text-gray-700">
								{article.author_name_credentials}
							</span>
						</div>
					{/if}


					<button
						type="button"
						on:click={shareArticle}
						class="flex items-center gap-2 hover:text-[#004085] transition"
					>
						<Share2 size={16} />
						<span>Share</span>
					</button>

				</div>

			</header>


			<!-- FEATURED IMAGE -->
			{#if article.featured_image}
				<div class="mb-12">

					<img
						src={article.featured_image}
						alt={article.title}
						class="w-full max-h-[500px] object-cover rounded-2xl shadow-sm"
					/>

				</div>
			{/if}


			<!-- ABSTRACT -->
			{#if article.abstract}
				<section
					class="mb-12 p-7 md:p-9 bg-white rounded-2xl border border-gray-100 shadow-sm"
				>

					<h2
						class="text-xl font-bold text-[#004085] mb-4"
					>
						Abstract
					</h2>

					<div
						class="text-gray-700 leading-8 whitespace-pre-line"
					>
						{article.abstract}
					</div>

				</section>
			{/if}


			<!-- ARTICLE BODY -->
			<div
				class="article-body prose prose-lg max-w-none text-gray-800"
			>

				{@html article.content || ''}

			</div>


			<!-- TAGS -->
			{#if article.tags && article.tags.length > 0}

				<div
					class="mt-12 pt-8 border-t border-gray-200"
				>

					<h3
						class="text-sm font-bold text-gray-700 mb-4"
					>
						Tags
					</h3>

					<div class="flex flex-wrap gap-2">

						{#each article.tags as tag}
							<span
								class="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
							>
								#{tag}
							</span>
						{/each}

					</div>

				</div>

			{/if}


			<!-- REFERENCES -->
			{#if article.citations && article.citations.length > 0}

				<div
					class="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-100"
				>

					<h3
						class="flex items-center gap-2 text-lg font-bold text-[#004085] mb-5"
					>
						<LinkIcon size={18} />

						References
					</h3>


					<ul class="space-y-3">

						{#each article.citations as cite}
							<li
								class="text-sm text-gray-600 break-words"
							>

								<a
									href={cite}
									target="_blank"
									rel="noopener noreferrer"
									class="hover:underline hover:text-[#004085]"
								>
									{cite}
								</a>

							</li>
						{/each}

					</ul>

				</div>

			{/if}


			<!-- COMMENTS -->
			{#if comments.length > 0}

				<section
					class="mt-16 pt-10 border-t border-gray-200"
				>

					<h2
						class="text-2xl font-bold text-gray-900 mb-6"
					>
						Comments
					</h2>


					<div class="space-y-5">

						{#each comments as comment}

							<div
								class="bg-white rounded-xl border border-gray-100 p-5"
							>

								<div
									class="flex items-center justify-between mb-2"
								>

									<span
										class="font-semibold text-gray-800"
									>
										{comment.profiles?.full_name ||
											'Anonymous'}
									</span>

									{#if comment.created_at}
										<span
											class="text-xs text-gray-400"
										>
											{formatDate(
												comment.created_at
											)}
										</span>
									{/if}

								</div>


								<p
									class="text-gray-600 leading-relaxed"
								>
									{comment.content}
								</p>

							</div>

						{/each}

					</div>

				</section>

			{/if}

		</article>

	</div>


	<!-- SCROLL TO TOP -->
	{#if showScrollTop}

		<button
			type="button"
			on:click={scrollTop}
			class="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-[#004085] text-white flex items-center justify-center shadow-lg hover:bg-[#003366] transition"
			aria-label="Scroll to top"
		>

			<ArrowUp size={19} />

		</button>

	{/if}

{:else}

	<div
		class="min-h-screen flex items-center justify-center bg-[#FAFAF8]"
	>

		<div class="text-center">

			<h1
				class="text-2xl font-bold text-gray-800 mb-2"
			>
				Article Not Found
			</h1>

			<p class="text-gray-500">
				The article you're looking for could not be found.
			</p>

		</div>

	</div>

{/if}


<style>
	.article-body :global(h1),
	.article-body :global(h2),
	.article-body :global(h3),
	.article-body :global(h4) {
		color: #111827;
		font-weight: 700;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.article-body :global(h2) {
		font-size: 1.75rem;
	}

	.article-body :global(h3) {
		font-size: 1.4rem;
	}

	.article-body :global(p) {
		line-height: 1.9;
		margin-bottom: 1.25rem;
	}

	.article-body :global(ul),
	.article-body :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.article-body :global(li) {
		margin-bottom: 0.5rem;
	}

	.article-body :global(a) {
		color: #004085;
		text-decoration: underline;
	}

	.article-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		margin: 2rem auto;
	}

	.article-body :global(blockquote) {
		border-left: 4px solid #004085;
		padding-left: 1rem;
		margin: 2rem 0;
		color: #4b5563;
		font-style: italic;
	}
</style>