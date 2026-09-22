<script lang="ts">
	import { Clock, FileText, ThumbsUp, Bookmark, MoreVertical } from 'lucide-svelte';

	export let title: string = "Recent Articles";
	export let articles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName?: string;
		date?: string | null;
		thumbnail?: string | null;
		type?: 'article' | 'research';
		href?: string;
		views?: number;
		likes?: number;
		saves?: number;
	}> = [];

	function formatArticleDate(dateStr?: string | null) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleImageError(e: Event) {
		(e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Article';
	}
</script>

<div class="articles-card">
	<div class="card-header">
		<h3>{title}</h3>
		<button class="view-all">View All →</button>
	</div>

	<div class="articles-list">
		{#if articles.length === 0}
			<p class="empty-state">No recent articles found.</p>
		{:else}
			{#each articles as article}
				<div class="article-item">
					<img
						src={article.thumbnail || '/placeholder.png'}
						alt="Cover"
						class="article-img"
						on:error={handleImageError}
					/>
					<div class="article-content">
						<div class="badge-row">
							<span class="type-badge"
								>{article.type === 'research' ? 'RESEARCH ARTICLE' : 'CLINICAL TRIAL'}</span
							>
						</div>
						<h3 class="article-title">{article.title || 'Untitled Article'}</h3>
						<p class="author">Dr. {article.authorName || 'Unknown'} et al.</p>
						<div class="meta">
							<span
								><Clock size={12} /> Published {formatArticleDate(
									article.date
								)}</span
							>
							<span><FileText size={12} /> {article.views || 0} Views</span>
						</div>
					</div>
					<div class="article-actions">
						<div class="metrics">
							<span><ThumbsUp size={16} /> {article.likes || 0}</span>
							<span><Bookmark size={16} /></span>
							<span><MoreVertical size={16} /></span>
						</div>
						<a href={article.href || `/cms/articles/${article.id}`} class="view-btn"
							>View Full Article</a
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.articles-card {
		padding: 24px 0;
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

	/* ARTICLE ITEM STYLES */
	.articles-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.empty-state {
		text-align: center;
		color: #64748b;
		padding: 40px;
		background: white;
		border-radius: 12px;
		border: 1px dashed #cbd5e1;
	}

	.article-item {
		display: flex;
		background: white;
		border-radius: 12px;
		padding: 20px;
		gap: 24px;
		border: 1px solid #e2e8f0;
		align-items: flex-start;
	}

	.article-img {
		width: 200px;
		height: 140px;
		object-fit: cover;
		border-radius: 8px;
		background: #f1f5f9;
	}

	.article-content {
		flex: 1;
	}

	.badge-row {
		margin-bottom: 8px;
	}

	.type-badge {
		background: #e0f2fe;
		color: #0284c7;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.article-title {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 8px;
		color: #0f172a;
		line-height: 1.4;
	}

	.author {
		color: #64748b;
		font-size: 14px;
		margin: 0 0 16px;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 16px;
		color: #94a3b8;
		font-size: 13px;
	}

	.meta span {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.article-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		height: 140px;
	}

	.metrics {
		display: flex;
		align-items: center;
		gap: 16px;
		color: #64748b;
	}

	.metrics span {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 13px;
	}

	.view-btn {
		padding: 10px 24px;
		background: transparent;
		color: #3b82f6;
		border: 1px solid #3b82f6;
		border-radius: 80px;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s;
	}

	.view-btn:hover {
		background: #eff6ff;
	}
</style>