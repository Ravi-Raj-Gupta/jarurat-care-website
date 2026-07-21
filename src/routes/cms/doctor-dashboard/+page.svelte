<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import WelcomeCard from '$lib/components/dashboard/WelcomeCard.svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import QuickActions from '$lib/components/dashboard/QuickActions.svelte';
	import RecentArticles from '$lib/components/dashboard/RecentArticles.svelte';
	import NotificationsCard from '$lib/components/dashboard/NotificationsCard.svelte';
	import FollowedDoctorsCard from '$lib/components/dashboard/FollowedDoctorsCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: stats = data.stats;
	$: recentArticles = data.recentArticles;
	$: notifications = data.notifications;
	$: unreadCount = data.unreadCount;
	$: followedDoctors = data.followedDoctors || [];
</script>

<svelte:head>
	<title>Doctor Dashboard | JCF</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar doctorName={profile?.full_name || ''} {unreadCount} />

		<div class="page">
			<WelcomeCard {profile} />

			<QuickActions hasDraft={stats.draft > 0} />

			<div class="stats">
				<StatCard value={stats.published} label="Published Articles" />
				<StatCard value={stats.draft} label="Draft Articles" />
				<StatCard value={stats.pendingReview} label="Pending Review" />
				<StatCard value={stats.views} label="Views" />
				<StatCard value={stats.bookmarks} label="Bookmarks" />
			</div>

			<RecentArticles articles={recentArticles} />

			<FollowedDoctorsCard doctors={followedDoctors} />

			<NotificationsCard {notifications} />
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		min-height: 100vh;
		background: #f5f7fb;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.page {
		padding: 30px;
		display: flex;
		flex-direction: column;
		gap: 25px;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 20px;
	}

	@media (max-width: 1100px) {
		.stats {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 700px) {
		.stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>