<script lang="ts">
	export let articles: Array<{
		id: string;
		title: string;
		status: string;
		created_at: string;
	}> = [];

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function statusLabel(status: string) {
		switch (status) {
			case 'under_review':
				return 'Under Review';
			case 'published':
				return 'Published';
			case 'rejected':
				return 'Rejected';
			default:
				return 'Draft';
		}
	}
</script>

<div class="recent-card">
	<div class="card-header">
		<h3>Recent Articles</h3>
	</div>

	{#if articles.length === 0}
		<div class="empty-state">
			<h4>No Articles Yet</h4>
			<p>You haven't published any articles yet.</p>
		</div>
	{:else}
		<div class="article-list">
			{#each articles as article}
				<a href="/cms/doctor-dashboard/articles/{article.id}" class="article-row">
					<span class="article-title">{article.title}</span>
					<span class="status-badge status-{article.status}">{statusLabel(article.status)}</span>
					<span class="article-date">{formatDate(article.created_at)}</span>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.recent-card {
		background: white;
		border-radius: 16px;
		padding: 25px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
	}

	.card-header {
		margin-bottom: 20px;
	}

	.card-header h3 {
		color: #202866;
		margin: 0;
	}

	.empty-state {
		padding: 60px 20px;
		text-align: center;
		color: #666;
	}

	.empty-state h4 {
		color: #202866;
		margin-bottom: 10px;
	}

	.article-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.article-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 8px;
		border-bottom: 1px solid #f0f1f5;
		text-decoration: none;
		color: inherit;
		transition: background 0.15s;
		border-radius: 8px;
	}

	.article-row:hover {
		background: #f9fafb;
	}

	.article-row:last-child {
		border-bottom: none;
	}

	.article-title {
		flex: 1;
		font-size: 14px;
		font-weight: 600;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status-badge {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 3px 10px;
		border-radius: 20px;
		white-space: nowrap;
	}

	.status-draft {
		background: #f3f4f6;
		color: #4b5563;
	}

	.status-under_review {
		background: #fef3c7;
		color: #92400e;
	}

	.status-published {
		background: #dcfce7;
		color: #166534;
	}

	.status-rejected {
		background: #fee2e2;
		color: #991b1b;
	}

	.article-date {
		font-size: 12px;
		color: #9ca3af;
		white-space: nowrap;
	}
</style>