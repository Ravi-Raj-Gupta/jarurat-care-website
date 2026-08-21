<script lang="ts">
	export let articles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		savedAt: string;
		type: string;
		slug?: string;
	}> = [];

	function timeAgo(dateStr: string) {
		const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 7) return `${days}d ago`;
		const weeks = Math.floor(days / 7);
		return `${weeks}w ago`;
	}
</script>

<div class="saved-card">
	<div class="card-header">
		<h3>Saved Articles</h3>
	</div>

	{#if articles.length === 0}
		<div class="empty-state">
			<h4>No Saved Articles Yet</h4>
			<p>Articles you save will show up here.</p>
		</div>
	{:else}
		<div class="article-list">
			{#each articles as article}
				<a href={article.type === 'research' ? `/content/research/${article.id}` : `/content/${article.type || 'article'}/${article.slug || article.id}`} class="article-row">
					<div class="article-info">
						<span class="article-title">{article.title}</span>
						<span class="article-meta">
							{article.authorName}
							{#if article.category}
								• {article.category}
							{/if}
						</span>
					</div>
					<span class="saved-time">{timeAgo(article.savedAt)}</span>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.saved-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
	}

	.card-header {
		margin-bottom: 16px;
	}

	.card-header h3 {
		margin: 0;
		color: #1e2a5e;
		font-size: 16px;
	}

	.empty-state {
		padding: 40px 20px;
		text-align: center;
		color: #666;
	}

	.empty-state h4 {
		color: #1e2a5e;
		margin-bottom: 8px;
	}

	.empty-state p {
		margin: 0;
		font-size: 13px;
	}

	.article-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-height: 280px;
		overflow-y: auto;
		padding-right: 8px;
	}

	.article-list::-webkit-scrollbar {
		width: 6px;
	}
	.article-list::-webkit-scrollbar-track {
		background: #f8fafc;
		border-radius: 4px;
	}
	.article-list::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}
	.article-list::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
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

	.article-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.article-title {
		font-size: 14px;
		font-weight: 600;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.article-meta {
		font-size: 12px;
		color: #6b7280;
	}

	.saved-time {
		font-size: 12px;
		color: #9ca3af;
		white-space: nowrap;
	}
</style>