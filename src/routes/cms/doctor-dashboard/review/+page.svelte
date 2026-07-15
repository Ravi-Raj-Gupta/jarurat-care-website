<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import { enhance } from '$app/forms';

	export let data;

	$: profile = data.profile;
	$: pendingArticles = data.pendingArticles;
	$: pendingResearch = data.pendingResearch;

	let activeTab: 'articles' | 'research' = 'articles';
	let selectedItem: any = null;
	let feedbackText = '';
	let showFeedbackModal = false;

	function viewItem(item: any) {
		selectedItem = item;
		feedbackText = '';
		showFeedbackModal = false;
	}

	function closeItem() {
		selectedItem = null;
	}

	function promptFeedback() {
		showFeedbackModal = true;
	}
</script>

<svelte:head>
	<title>Review Articles | Doctor Dashboard</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar doctorName={profile?.full_name || ''} unreadCount={0} />

		<div class="page">
			<div class="header">
				<h1>Review Pending Articles</h1>
				<p>Review and publish articles submitted by other authors.</p>
			</div>

			<div class="tabs">
				<button 
					class="tab-btn" 
					class:active={activeTab === 'articles'} 
					on:click={() => { activeTab = 'articles'; selectedItem = null; }}
				>
					Regular Articles ({pendingArticles.length})
				</button>
				<button 
					class="tab-btn" 
					class:active={activeTab === 'research'} 
					on:click={() => { activeTab = 'research'; selectedItem = null; }}
				>
					Research Papers ({pendingResearch.length})
				</button>
			</div>

			<div class="main-area">
				{#if !selectedItem}
					<!-- List View -->
					<div class="list-view">
						{#if activeTab === 'articles'}
							{#each pendingArticles as item}
								<div class="list-item" on:click={() => viewItem(item)}>
									<div class="item-meta">
										<span class="category">{item.category || 'General'}</span>
										<span class="date">{new Date(item.created_at).toLocaleDateString()}</span>
									</div>
									<h3>{item.title || 'Untitled Article'}</h3>
									<p class="excerpt">{item.excerpt || 'No excerpt available.'}</p>
									<span class="read-more">Read & Review &rarr;</span>
								</div>
							{:else}
								<div class="empty-state">No pending regular articles to review.</div>
							{/each}
						{:else}
							{#each pendingResearch as item}
								<div class="list-item" on:click={() => viewItem(item)}>
									<div class="item-meta">
										<span class="category">Research</span>
										<span class="date">{new Date(item.created_at).toLocaleDateString()}</span>
									</div>
									<h3>{item.title || 'Untitled Research'}</h3>
									<p class="excerpt"><strong>Abstract:</strong> {item.abstract ? item.abstract.substring(0, 100) + '...' : 'N/A'}</p>
									<span class="read-more">Read & Review &rarr;</span>
								</div>
							{:else}
								<div class="empty-state">No pending research papers to review.</div>
							{/each}
						{/if}
					</div>
				{:else}
					<!-- Detail View -->
					<div class="detail-view">
						<button class="back-btn" on:click={closeItem}>&larr; Back to list</button>
						
						<div class="article-content">
							<div class="meta-tags">
								{#if activeTab === 'articles'}
									<span class="tag">{selectedItem.category}</span>
								{:else}
									<span class="tag bg-purple">Research</span>
								{/if}
							</div>
							<h2>{selectedItem.title}</h2>
							
							{#if activeTab === 'articles'}
								{#if selectedItem.image}
									<img src={selectedItem.image} alt="Cover" class="cover-image" />
								{/if}
								<div class="body-text">
									{selectedItem.content}
								</div>
							{:else}
								<div class="research-section">
									<h4>Abstract</h4>
									<p>{selectedItem.abstract}</p>
								</div>
								<div class="research-section">
									<h4>Introduction</h4>
									<p>{selectedItem.introduction}</p>
								</div>
								<div class="research-section">
									<h4>Methods</h4>
									<p>{selectedItem.methods}</p>
								</div>
								<div class="research-section">
									<h4>Results</h4>
									<p>{selectedItem.results}</p>
								</div>
								<div class="research-section">
									<h4>Conclusion</h4>
									<p>{selectedItem.conclusion}</p>
								</div>
							{/if}
						</div>

						<div class="review-actions">
							<h3>Submit Review</h3>
							
							{#if showFeedbackModal}
								<form class="feedback-form" method="POST" action="?/rejectArticle" use:enhance={() => {
									return async ({ update }) => {
										await update();
										closeItem();
									};
								}}>
									<input type="hidden" name="articleId" value={selectedItem.id} />
									<input type="hidden" name="articleType" value={activeTab} />
									<label for="feedback">What changes are required?</label>
									<textarea name="feedback" bind:value={feedbackText} required placeholder="Explain what the author needs to fix..."></textarea>
									<div class="form-buttons">
										<button type="button" class="btn-cancel" on:click={() => showFeedbackModal = false}>Cancel</button>
										<button type="submit" class="btn-reject">Submit Request for Changes</button>
									</div>
								</form>
							{:else}
								<div class="action-buttons">
									<form method="POST" action="?/approveArticle" use:enhance={() => {
										return async ({ update }) => {
											await update();
											closeItem();
										};
									}}>
										<input type="hidden" name="articleId" value={selectedItem.id} />
										<input type="hidden" name="articleType" value={activeTab} />
										<button type="submit" class="btn-approve">Approve & Publish</button>
									</form>

									<button type="button" class="btn-request" on:click={promptFeedback}>Request Changes</button>
								</div>
							{/if}
						</div>
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
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
	}

	.header h1 {
		font-size: 24px;
		color: #0d2460;
		margin: 0 0 5px;
	}

	.header p {
		color: #6b7280;
		margin: 0 0 20px;
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

	.list-view {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.list-item {
		background: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.03);
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s;
	}

	.list-item:hover {
		border-color: #0155bd;
		box-shadow: 0 4px 12px rgba(1, 85, 189, 0.1);
	}

	.item-meta {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 12px;
	}

	.category {
		font-weight: 700;
		color: #0155bd;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.date {
		color: #9ca3af;
	}

	.list-item h3 {
		margin: 0 0 10px;
		font-size: 18px;
		color: #1f2937;
	}

	.list-item .excerpt {
		color: #6b7280;
		font-size: 14px;
		margin: 0 0 15px;
		line-height: 1.5;
	}

	.read-more {
		font-size: 13px;
		font-weight: 600;
		color: #0155bd;
	}

	.empty-state {
		text-align: center;
		padding: 50px;
		background: white;
		border-radius: 12px;
		color: #6b7280;
	}

	/* Detail View */
	.detail-view {
		background: white;
		border-radius: 16px;
		padding: 30px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.04);
	}

	.back-btn {
		background: none;
		border: none;
		color: #6b7280;
		font-size: 14px;
		cursor: pointer;
		padding: 0;
		margin-bottom: 20px;
	}

	.back-btn:hover {
		color: #0155bd;
	}

	.article-content h2 {
		font-size: 28px;
		color: #0d2460;
		margin: 15px 0 25px;
	}

	.cover-image {
		width: 100%;
		height: 300px;
		object-fit: cover;
		border-radius: 12px;
		margin-bottom: 25px;
	}

	.body-text, .research-section p {
		font-size: 16px;
		line-height: 1.7;
		color: #374151;
		white-space: pre-wrap;
	}

	.research-section {
		margin-bottom: 25px;
	}

	.research-section h4 {
		font-size: 18px;
		color: #1f2937;
		margin: 0 0 10px;
		padding-bottom: 5px;
		border-bottom: 1px solid #e5e7eb;
	}

	.review-actions {
		margin-top: 40px;
		padding-top: 30px;
		border-top: 2px solid #f3f4f6;
	}

	.review-actions h3 {
		margin: 0 0 20px;
		font-size: 20px;
	}

	.action-buttons {
		display: flex;
		gap: 15px;
	}

	.btn-approve {
		background: #16a34a;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-approve:hover {
		background: #15803d;
	}

	.btn-request {
		background: white;
		color: #dc2626;
		border: 1px solid #dc2626;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-request:hover {
		background: #fef2f2;
	}

	.feedback-form {
		display: flex;
		flex-direction: column;
		gap: 15px;
		background: #fef2f2;
		padding: 20px;
		border-radius: 12px;
		border: 1px solid #fecaca;
	}

	.feedback-form label {
		font-weight: 600;
		color: #991b1b;
	}

	.feedback-form textarea {
		width: 100%;
		height: 120px;
		padding: 12px;
		border: 1px solid #fca5a5;
		border-radius: 8px;
		resize: vertical;
		font-family: inherit;
	}

	.form-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	.btn-cancel {
		background: transparent;
		border: none;
		color: #6b7280;
		cursor: pointer;
		font-weight: 600;
	}

	.btn-reject {
		background: #dc2626;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-reject:hover {
		background: #b91c1c;
	}
</style>
