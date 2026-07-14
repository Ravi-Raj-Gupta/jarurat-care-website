<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import ReaderProfileHeader from '$lib/components/dashboard/ReaderProfileHeader.svelte';
	import AboutCard from '$lib/components/dashboard/AboutCard.svelte';
	import InterestsCard from '$lib/components/dashboard/InterestsCard.svelte';
	import SavedArticlesCard from '$lib/components/dashboard/SavedArticlesCard.svelte';
	import RecommendedArticlesCard from '$lib/components/dashboard/RecommendedArticlesCard.svelte';
	import ReactedArticlesCard from '$lib/components/dashboard/ReactedArticlesCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: savedArticles = data.savedArticles;
	$: savedCount = data.savedCount;
	$: interestsCount = data.interestsCount;
	$: recommendedArticles = data.recommendedArticles || [];
	$: reactedArticles = data.reactedArticles || [];
</script>

<svelte:head>
	<title>My Dashboard | JCF</title>
</svelte:head>

<Nav />

<div class="page">
	<div class="container">
		<ReaderProfileHeader {profile} {savedCount} {interestsCount} />

		<div class="grid">
			<AboutCard bio={profile?.bio || ''} />
			<InterestsCard interests={profile?.interests || []} />
		</div>

		<RecommendedArticlesCard articles={recommendedArticles} />

		<div class="grid">
			<SavedArticlesCard articles={savedArticles} />
			<ReactedArticlesCard articles={reactedArticles} />
		</div>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #f5f7fb;
		padding: 100px 20px 60px;
		font-family: 'DM Sans', sans-serif;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 700px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>