<script lang="ts">
	import ReaderSidebar from '$lib/components/dashboard/ReaderSidebar.svelte';
	import ReaderProfile from '$lib/components/profile/ReaderProfile.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	/* =====================================================
	   DATA
	===================================================== */

	$: profile = data.profile;
	$: savedArticles = data.savedArticles ?? [];
	$: reactedArticles = data.reactedArticles ?? [];
	$: recommendedArticles = data.recommendedArticles ?? [];
	$: popularArticles = data.popularArticles ?? [];
	$: followedDoctors = data.followedDoctors ?? [];

	$: savedCount = data.savedCount ?? 0;
	$: interestsCount = data.interestsCount ?? 0;
	$: followingCount = followedDoctors.length;
	// Comments count not currently tracked in backend
	let commentsCount = 0;
</script>

<svelte:head>
	<title>My Dashboard | JCF</title>
</svelte:head>

<div class="layout-wrapper">
	<ReaderSidebar />

	<div class="main-content">
		<ReaderProfile 
			{profile}
			{savedCount}
			{followingCount}
			topicsCount={interestsCount}
			{commentsCount}
			{savedArticles}
			{reactedArticles}
			{recommendedArticles}
			{popularArticles}
			{followedDoctors}
		/>
	</div>
</div>

<style>
	.layout-wrapper {
		display: flex;
		min-height: 100vh;
		background: #FAFAFA;
	}

	.main-content {
		margin-left: 213px; /* Width of the sidebar */
		width: calc(100% - 213px);
		padding: 44px 0px 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>