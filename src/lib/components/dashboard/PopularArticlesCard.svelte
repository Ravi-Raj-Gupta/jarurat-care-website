<script lang="ts">
	export let articles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		views: number;
		thumbnail: string;
        type: string;
        slug?: string;
	}> = [];
</script>

<div class="popular-card">
	<div class="card-header">
		<h3>Popular Content</h3>
		<p class="subtitle">Most viewed by the community</p>
	</div>

	{#if articles.length === 0}
		<div class="empty-state">
			<h4>No popular content yet</h4>
			<p>Check back later for trending articles.</p>
		</div>
	{:else}
		<div class="article-list">
			{#each articles as article}
				<a href={article.type === 'research' ? `/content/research/${article.id}` : `/content/article/${article.slug || article.id}`} class="article-row">
					<div class="article-info">
						<span class="article-title">{article.title}</span>
						<span class="article-meta">
							{article.authorName}
							{#if article.category}
								• {article.category}
							{/if}
                            • {article.views} views
						</span>
					</div>
					<img src={article.thumbnail || '/defaults/Articles/article-1.jpeg'} alt={article.title} class="article-thumb" />
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.popular-card {
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

	.subtitle {
		margin: 4px 0 0;
		font-size: 12px;
		color: #6b7280;
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

	.article-row:last-child {
		border-bottom: none;
	}

	.article-row:hover {
		background: #f8fafc;
	}

	.article-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.article-title {
		font-weight: 600;
		font-size: 14px;
		color: #0f172a;
		line-height: 1.4;
	}

	.article-meta {
		font-size: 12px;
		color: #64748b;
	}

	.article-thumb {
		width: 60px;
		height: 60px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
		background: #f1f5f9;
	}
</style>
