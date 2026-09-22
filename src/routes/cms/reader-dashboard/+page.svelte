<script lang="ts">
	import ReaderSidebar from '$lib/components/dashboard/ReaderSidebar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>My Dashboard | JCF</title>
</svelte:head>

<div class="layout-wrapper">
	<ReaderSidebar />

	<div class="main-content">
		<h1>Welcome to your Dashboard</h1>
		<p>Here you can find your recent activity and saved articles.</p>
		
		<!-- Placeholder for actual dashboard feed -->
		<div class="dashboard-feed">
			<p class="empty-state">No recent activity to show.</p>
		</div>
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
		padding: 44px 32px;
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 24px;
		color: #111827;
		margin-bottom: 8px;
	}

	p {
		color: #6B7280;
		margin-bottom: 32px;
	}

	.dashboard-feed {
		background: white;
		border-radius: 12px;
		padding: 32px;
		border: 1px solid #E5E7EB;
		text-align: center;
	}

	.empty-state {
		color: #9CA3AF;
		margin: 0;
	}
</style>