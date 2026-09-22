<script lang="ts">
	import ReaderSidebar from '$lib/components/dashboard/ReaderSidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import ReaderProfile from '$lib/components/profile/ReaderProfile.svelte';

	export let data;

	$: profile = data.profile;
	$: savedCount = data.savedCount ?? 0;
	$: followingCount = (data.followedDoctors ?? []).length;
	$: topicsCount = data.interestsCount ?? 0;
	$: commentsCount = data.commentedArticles?.length ?? 0;

	$: savedArticles = data.savedArticles;
	$: reactedArticles = data.reactedArticles;
	$: recommendedArticles = data.recommendedArticles;
	$: popularArticles = data.popularArticles;
	$: followedDoctors = data.followedDoctors;
	$: commentedArticles = data.commentedArticles;
</script>

<div class="dashboard">
	<ReaderSidebar />

	<div class="content">
		<Topbar
			role="Reader"
			doctorName={profile?.full_name || 'Reader'}
			email={profile?.email || ''}
			unreadCount={0}
		/>

		<div class="dashboard-body">
			<ReaderProfile
				{profile}
				{savedCount}
				{followingCount}
				{topicsCount}
				{commentsCount}
				{savedArticles}
				{reactedArticles}
				{recommendedArticles}
				{popularArticles}
				{followedDoctors}
				{commentedArticles}
			/>
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		height: 100vh;
		background: #f8fafc;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow-y: auto;
	}

	.dashboard-body {
		padding: 24px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}
</style>
