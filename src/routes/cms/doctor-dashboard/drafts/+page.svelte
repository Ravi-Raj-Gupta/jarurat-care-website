<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	export let data;

	$: profile = data.profile;
	$: articleDrafts = data.articleDrafts;
	$: researchDrafts = data.researchDrafts;

	let activeTab: 'articles' | 'research' = 'articles';

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>My Drafts | Doctor Dashboard</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar doctorName={profile?.full_name || ''} unreadCount={0} />

		<div class="page">
			<div class="header">
				<h1>My Drafts</h1>
				<p>Review and continue working on your saved drafts.</p>
			</div>

			<div class="tabs">
				<button 
					class="tab-btn" 
					class:active={activeTab === 'articles'} 
					on:click={() => { activeTab = 'articles'; }}
				>
					Regular Articles ({articleDrafts.length})
				</button>
				<button 
					class="tab-btn" 
					class:active={activeTab === 'research'} 
					on:click={() => { activeTab = 'research'; }}
				>
					Research Papers ({researchDrafts.length})
				</button>
			</div>

			<div class="articles-card">
				{#if activeTab === 'articles'}
					{#if articleDrafts.length === 0}
						<div class="empty-state">
							<h4>No Article Drafts</h4>
							<p>You don't have any saved regular article drafts.</p>
							<a href="/cms/articles/create" class="btn-primary">Write an Article</a>
						</div>
					{:else}
						<div class="table-responsive">
							<table>
								<thead>
									<tr>
										<th>Title</th>
										<th>Category</th>
										<th>Last Saved</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each articleDrafts as article}
										<tr>
											<td><span class="title">{article.title || 'Untitled Draft'}</span></td>
											<td>{article.category || 'N/A'}</td>
											<td>{formatDate(article.created_at)}</td>
											<td>
												<button class="btn-edit" disabled title="Editing coming soon">Edit</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				{:else}
					{#if researchDrafts.length === 0}
						<div class="empty-state">
							<h4>No Research Drafts</h4>
							<p>You don't have any saved research paper drafts.</p>
							<a href="/cms/research/create" class="btn-primary">Write a Research Paper</a>
						</div>
					{:else}
						<div class="table-responsive">
							<table>
								<thead>
									<tr>
										<th>Title</th>
										<th>Last Saved</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each researchDrafts as paper}
										<tr>
											<td><span class="title">{paper.title || 'Untitled Draft'}</span></td>
											<td>{formatDate(paper.created_at)}</td>
											<td>
												<button class="btn-edit" disabled title="Editing coming soon">Edit</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
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
		margin: 0 0 20px;
		font-size: 15px;
	}

	.tabs {
		display: flex;
		gap: 15px;
		margin-bottom: 25px;
		border-bottom: 2px solid #e5e7eb;
	}

	.tab-btn {
		background: none;
		border: none;
		padding: 10px 5px;
		font-size: 15px;
		font-weight: 600;
		color: #6b7280;
		cursor: pointer;
		position: relative;
		bottom: -2px;
	}

	.tab-btn.active {
		color: #0d2460;
		border-bottom: 2px solid #0155bd;
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

	.btn-edit {
		background: #f3f4f6;
		border: none;
		padding: 6px 12px;
		border-radius: 6px;
		color: #4b5563;
		font-weight: 600;
		font-size: 13px;
		cursor: not-allowed;
		opacity: 0.7;
	}
</style>
