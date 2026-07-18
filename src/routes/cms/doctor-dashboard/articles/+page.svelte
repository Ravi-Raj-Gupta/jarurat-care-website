<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	export let data;
	$: profile = data.profile;
	$: articles = data.articles;

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function statusLabel(status: string) {
		switch (status) {
			case 'under_review': return 'Under Review';
			case 'published': return 'Published';
			case 'rejected': return 'Rejected';
			default: return 'Draft';
		}
	}
</script>

<svelte:head>
	<title>My Articles | Doctor Dashboard</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar doctorName={profile?.full_name || ''} unreadCount={0} />

		<div class="page">
			<div class="header">
				<h1>My Articles</h1>
				<p>Manage all your written regular articles.</p>
			</div>

			<div class="articles-card">
				{#if articles.length === 0}
					<div class="empty-state">
						<h4>No Articles Yet</h4>
						<p>You haven't written any regular articles.</p>
						<a href="/cms/articles/create" class="btn-primary">Write an Article</a>
					</div>
				{:else}
					<div class="table-responsive">
						<table>
							<thead>
								<tr>
									<th>Title</th>
									<th>Category</th>
									<th>Status</th>
									<th>Views</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{#each articles as article}
									<tr>
										<td><span class="title">{article.title}</span></td>
										<td>{article.category || 'N/A'}</td>
										<td><span class="status-badge status-{article.status}">{statusLabel(article.status)}</span></td>
										<td>{article.views || 0}</td>
										<td>{formatDate(article.created_at)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
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
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.header h1 {
		font-size: 26px;
		color: #0d2460;
		margin: 0 0 5px;
	}

	.header p {
		color: #6b7280;
		margin: 0 0 25px;
		font-size: 15px;
	}

	.articles-card {
		background: white;
		border-radius: 16px;
		padding: 25px;
		box-shadow: 0 4px 15px rgba(0,0,0,0.03);
	}

	.empty-state {
		padding: 60px 20px;
		text-align: center;
	}

	.empty-state h4 {
		font-size: 18px;
		color: #202866;
		margin-bottom: 10px;
	}

	.empty-state p {
		color: #6b7280;
		margin-bottom: 20px;
	}

	.btn-primary {
		display: inline-block;
		background: #0155bd;
		color: white;
		padding: 10px 20px;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 500;
	}

	.table-responsive {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 15px;
		color: #6b7280;
		font-weight: 600;
		font-size: 13px;
		text-transform: uppercase;
		border-bottom: 2px solid #f3f4f6;
	}

	td {
		padding: 15px;
		border-bottom: 1px solid #f3f4f6;
		color: #374151;
		font-size: 14px;
	}

	.title {
		font-weight: 500;
		color: #111827;
	}

	.status-badge {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 4px 12px;
		border-radius: 20px;
		white-space: nowrap;
	}

	.status-draft { background: #f3f4f6; color: #4b5563; }
	.status-under_review { background: #fef3c7; color: #92400e; }
	.status-published { background: #dcfce7; color: #166534; }
	.status-rejected { background: #fee2e2; color: #991b1b; }
</style>
