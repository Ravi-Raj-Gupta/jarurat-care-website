<script lang="ts">
	export let articles: Array<{
		id?: string;
		title: string;
		category?: string;
		status: string;
		createdAt?: string;
	}> = [];
</script>

<div class="articles-card">
	<div class="card-header">
		<h3>Recent Articles</h3>
		<button class="view-all">View All →</button>
	</div>

	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Category</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#if articles.length === 0}
					<tr>
						<td colspan="3" class="empty">No recent articles found.</td>
					</tr>
				{:else}
					{#each articles as article}
						<tr>
							<td class="article-title">{article.title}</td>
							<td><span class="category-pill">{article.category || 'General'}</span></td>
							<td>
								<span class="status-pill {article.status.toLowerCase().replace(/\s+/g, '-')}">
									{article.status}
								</span>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
	.articles-card {
		padding: 24px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.card-header h3 {
		font-size: 16px;
		font-weight: 700;
		color: #0f172a;
		margin: 0;
	}

	.view-all {
		background: none;
		border: none;
		color: #4f46e5;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.table-wrapper {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	th {
		font-size: 11px;
		font-weight: 600;
		color: #64748b;
		padding: 12px 16px;
		border-bottom: 1px solid #f1f5f9;
		text-transform: uppercase;
	}

	td {
		padding: 14px 16px;
		font-size: 13px;
		border-bottom: 1px solid #f8fafc;
	}

	.article-title {
		font-weight: 600;
		color: #1e293b;
	}

	.category-pill {
		background: #f1f5f9;
		color: #475569;
		padding: 4px 8px;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 500;
	}

	.status-pill {
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 600;
	}

	.status-pill.published { background: #dcfce7; color: #15803d; }
	.status-pill.pending-review, .status-pill.pending { background: #fef3c7; color: #b45309; }
	.status-pill.draft { background: #f1f5f9; color: #475569; }

	.empty {
		text-align: center;
		color: #94a3b8;
		padding: 24px;
	}
</style>