<script lang="ts">
	export let articles: Array<any> = [];
</script>

<div class="reacted-card">
	<div class="card-header">
		<h3>Liked Articles</h3>
	</div>

	{#if articles.length === 0}
		<div class="empty-state">
			<div class="icon">❤️</div>
			<h4>No liked articles yet</h4>
			<p>When you like articles, they will appear here.</p>
		</div>
	{:else}
		<div class="article-list">
			{#each articles as article}
				<div class="article-item">
					<div class="article-info">
						<span class="category">{article.category || 'General'}</span>
						<a href="/articles/{article.id}" class="title">{article.title}</a>
						<div class="meta">
							<span>By {article.authorName}</span>
							<span class="dot">•</span>
							<span>Liked on {new Date(article.likedAt).toLocaleDateString()}</span>
						</div>
					</div>
					<div class="actions">
						<button class="icon-btn liked" title="Unlike">❤️</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.reacted-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
	}

	.card-header {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
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
		background: #f8fafc;
		border-radius: 12px;
		border: 1px dashed #cbd5e1;
	}

	.icon {
		font-size: 32px;
		margin-bottom: 12px;
		opacity: 0.5;
		filter: grayscale(1);
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
		gap: 16px;
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

	.article-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 16px;
		border-bottom: 1px solid #f1f5f9;
	}

	.article-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.category {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		color: #4f46e5;
		margin-bottom: 6px;
		display: block;
		letter-spacing: 0.5px;
	}

	.title {
		font-size: 15px;
		font-weight: 700;
		color: #1e2a5e;
		text-decoration: none;
		display: block;
		margin-bottom: 6px;
		line-height: 1.4;
		transition: color 0.2s;
	}

	.title:hover {
		color: #4f46e5;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: #64748b;
	}

	.dot {
		color: #cbd5e1;
	}

	.icon-btn {
		background: #fee2e2;
		border: none;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #ef4444;
		transition: transform 0.2s;
	}

	.icon-btn:hover {
		transform: scale(1.1);
	}
</style>
