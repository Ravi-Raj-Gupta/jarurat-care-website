<script lang="ts">
	import ReaderSidebar from '$lib/components/dashboard/ReaderSidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import WelcomeCard from '$lib/components/dashboard/WelcomeCard.svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import RecentArticles from '$lib/components/dashboard/RecentArticles.svelte';

	export let data;

	/* =====================================================
	   DATA
	===================================================== */
	$: profile = data.profile;
	$: savedCount = data.savedCount ?? 0;
	$: followingCount = (data.followedDoctors ?? []).length;
	$: popularArticles = data.popularArticles ?? [];
</script>

<svelte:head>
	<title>My Dashboard | JCF</title>
</svelte:head>

<div class="dashboard">
	<ReaderSidebar />

	<div class="content">
		<Topbar
			role="Reader"
			doctorName={profile?.full_name || 'Reader'}
			email={profile?.email || ''}
			unreadCount={0}
		/>

		<main class="page">
			<WelcomeCard 
				{profile}
			/>
			
			<div class="stats-grid">
				<StatCard 
					label="Saved Articles" 
					value={savedCount} 
					icon="bookmark" 
					color="#3B82F6" 
				/>
				<StatCard 
					label="Followed Doctors" 
					value={followingCount} 
					icon="users" 
					color="#10B981" 
				/>
				<StatCard 
					label="Read Articles" 
					value="--" 
					icon="book-open" 
					color="#F59E0B" 
				/>
			</div>

			<div class="recent-section">
				<RecentArticles articles={popularArticles.slice(0, 4)} title="Top Articles This Week" />
			</div>
		</main>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		height: 100vh;
		background: #f8fafc;
		font-family: 'DM Sans', sans-serif;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow-y: auto;
	}

	.page {
		padding: 32px 48px;
		flex: 1;
	}

	@media (max-width: 768px) {
		.page {
			padding: 20px;
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 24px;
		margin-bottom: 32px;
		margin-top: 24px;
	}

	.recent-section {
		margin-top: 24px;
	}
</style>