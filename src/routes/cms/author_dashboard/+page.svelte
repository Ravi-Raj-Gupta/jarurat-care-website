<script lang="ts">
	import { onMount } from 'svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import RichEditor from '$lib/components/RichEditor.svelte';

	type Article = {
		id: string;
		title: string;
		subtitle: string | null;
		abstract: string | null;
		introduction: string | null;
		status: string;
		created_at: string;
	};

	let user: any = null;
	let articles: Article[] = [];
	let loading = true;
	let selectedArticle: Article | null = null;

	let title = '';
	let subtitle = '';
	let abstract = '';
	let introduction = '';
	let methods = '';
	let results = '';
	let discussion = '';
	let conclusion = '';
	let submitting = false;
	let message = '';
	let showForm = false;

	// Stats
	$: stats = {
		draft: articles.filter(a => a.status === 'draft').length,
		submitted: articles.filter(a => a.status === 'submitted').length,
		under_review: articles.filter(a => a.status === 'under_review').length,
		changes_requested: articles.filter(a => a.status === 'changes_requested').length,
		published: articles.filter(a => a.status === 'published').length,
		rejected: articles.filter(a => a.status === 'rejected').length,
	};

	onMount(async () => {
		const { data: { user: u } } = await cmsSupabase.auth.getUser();

		if (!u) { goto('/cms/login'); return; }

		const { data: profile } = await cmsSupabase
			.from('profiles')
			.select('role')
			.eq('id', u.id)
			.single();

		if (profile?.role !== 'author') { goto('/cms/pending'); return; }

		user = u;
		await loadArticles();
	});

	async function loadArticles() {
		loading = true;
		const { data, error } = await cmsSupabase
			.from('research_articles')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });

		if (!error) {
			articles = data ?? [];
			if (!selectedArticle && articles.length > 0) selectedArticle = articles[0];
		}
		loading = false;
	}

	async function saveDraft() {
		if (!title.trim()) { message = 'Title is required'; return; }
		if (!abstract.trim()) { message = 'Abstract is required'; return; }

		submitting = true;
		message = '';

		const { error } = await cmsSupabase.from('research_articles').insert([{
			user_id: user.id,
			title: title.trim(),
			subtitle: subtitle.trim() || null,
			abstract: abstract.trim(),
			introduction: introduction.trim() || null,
			methods: methods.trim() || null,
			results: results.trim() || null,
			discussion: discussion.trim() || null,
			conclusion: conclusion.trim() || null,
			status: 'draft'
		}]);

		submitting = false;

		if (error) { message = error.message; return; }

		message = '✅ Draft saved!';
		title = subtitle = abstract = introduction = methods = results = discussion = conclusion = '';
		showForm = false;
		await loadArticles();
	}

	async function submitArticle(id: string) {
		if (!confirm('Submit this article for review?')) return;

		const { error } = await cmsSupabase
			.from('research_articles')
			.update({ status: 'submitted', updated_at: new Date().toISOString() })
			.eq('id', id);

		if (error) { alert(error.message); return; }
		await loadArticles();
	}

	async function deleteArticle(id: string) {
		if (!confirm('Delete this article?')) return;

		const { error } = await cmsSupabase
			.from('research_articles')
			.delete()
			.eq('id', id);

		if (error) { alert(error.message); return; }
		if (selectedArticle?.id === id) selectedArticle = null;
		await loadArticles();
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'draft': return 'status-draft';
			case 'submitted': return 'status-submitted';
			case 'under_review': return 'status-review';
			case 'changes_requested': return 'status-changes';
			case 'published': return 'status-published';
			case 'rejected': return 'status-rejected';
			default: return '';
		}
	}

	async function logout() {
		await cmsSupabase.auth.signOut();
		goto('/');
	}
</script>

<Nav />

<div class="dashboard">
	<div class="topbar">
		<div>
			<h1>Author Dashboard</h1>
			<p class="welcome">Welcome, {user?.email?.split('@')[0] || '...'}</p>
		</div>
		<div style="display:flex;gap:12px;align-items:center;">
			<button class="btn-logout" on:click={logout}>Logout</button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<p class="stat-label">Draft</p>
			<p class="stat-num">{stats.draft}</p>
		</div>
		<div class="stat-card submitted">
			<p class="stat-label">Submitted</p>
			<p class="stat-num">{stats.submitted}</p>
		</div>
		<div class="stat-card review">
			<p class="stat-label">Under Review</p>
			<p class="stat-num">{stats.under_review}</p>
		</div>
		<div class="stat-card changes">
			<p class="stat-label">Changes Requested</p>
			<p class="stat-num">{stats.changes_requested}</p>
		</div>
		<div class="stat-card published">
			<p class="stat-label">Published</p>
			<p class="stat-num">{stats.published}</p>
		</div>
		<div class="stat-card rejected">
			<p class="stat-label">Rejected</p>
			<p class="stat-num">{stats.rejected}</p>
		</div>
	</div>

	<!-- New Article Button -->
	<div style="margin-bottom:20px;">
		<button class="btn-new" on:click={() => showForm = !showForm}>
			{showForm ? '✕ Cancel' : '+ New Article'}
		</button>
	</div>

	<!-- Create Form -->
	{#if showForm}
		<div class="card form-card" style="margin-bottom:24px;">
			<h3>Create Research Article</h3>

			<label>Title *</label>
			<input placeholder="Article title" bind:value={title} />

			<label>Subtitle</label>
			<input placeholder="Subtitle (optional)" bind:value={subtitle} />

			<label>Abstract *</label>
			<RichEditor
				content={abstract}
				placeholder="Abstract..."
				minHeight="120px"
				on:update={(e) => abstract = e.detail}
			/>

			<label>Introduction</label>
			<RichEditor
				content={introduction}
				placeholder="Introduction..."
				minHeight="140px"
				on:update={(e) => introduction = e.detail}
			/>

			<label>Methods</label>
			<RichEditor
				content={methods}
				placeholder="Methods..."
				minHeight="140px"
				on:update={(e) => methods = e.detail}
			/>

			<label>Results</label>
			<RichEditor
				content={results}
				placeholder="Results..."
				minHeight="140px"
				on:update={(e) => results = e.detail}
			/>

			<label>Discussion</label>
			<RichEditor
				content={discussion}
				placeholder="Discussion..."
				minHeight="140px"
				on:update={(e) => discussion = e.detail}
			/>

			<label>Conclusion</label>
			<RichEditor
				content={conclusion}
				placeholder="Conclusion..."
				minHeight="120px"
				on:update={(e) => conclusion = e.detail}
			/>

			<button on:click={saveDraft} disabled={submitting} style="margin-top:16px;">
				{submitting ? 'Saving...' : 'Save Draft'}
			</button>

			{#if message}
				<p class="msg">{message}</p>
			{/if}
		</div>
	{/if}

	<div class="layout">
		<!-- Articles List -->
		<section class="articles-section">
			<h3>My Articles</h3>

			{#if loading}
				<div class="card small">Loading...</div>
			{:else if articles.length === 0}
				<div class="card small">
					<p>No articles yet.</p>
					<button on:click={() => showForm = true} style="margin-top:12px;">Create your first article</button>
				</div>
			{:else}
				<div class="grid">
					{#each articles as article}
						<article
							class="card article-card {selectedArticle?.id === article.id ? 'active' : ''}"
							on:click={() => selectedArticle = article}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && (selectedArticle = article)}
						>
							<div class="body">
								<div class="row">
									<h4>{article.title}</h4>
									<span class="status {getStatusColor(article.status)}">
										{article.status.replace(/_/g, ' ')}
									</span>
								</div>

								<p class="date">{formatDate(article.created_at)}</p>

								{#if article.abstract}
									<p class="preview-text">
										{article.abstract.replace(/<[^>]*>/g, '').slice(0, 100)}...
									</p>
								{/if}

								<div class="actions">
									{#if article.status === 'draft' || article.status === 'changes_requested'}
										<button class="btn-submit" on:click|stopPropagation={() => submitArticle(article.id)}>
											Submit
										</button>
									{/if}
									{#if article.status === 'draft'}
										<button class="btn-delete" on:click|stopPropagation={() => deleteArticle(article.id)}>
											Delete
										</button>
									{/if}
								</div>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Article Preview -->
		<section class="card reader">
			{#if selectedArticle}
				<div class="reader-head">
					<span class="status {getStatusColor(selectedArticle.status)}">
						{selectedArticle.status.replace(/_/g, ' ')}
					</span>
					<h2>{selectedArticle.title}</h2>
					{#if selectedArticle.subtitle}
						<p class="subtitle-text">{selectedArticle.subtitle}</p>
					{/if}
					<p class="reader-meta">{formatDate(selectedArticle.created_at)}</p>
				</div>

				<div class="reader-content">
					{#if selectedArticle.abstract}
						<div class="section">
							<h4>Abstract</h4>
							<div>{@html selectedArticle.abstract}</div>
						</div>
					{/if}
					{#if selectedArticle.introduction}
						<div class="section">
							<h4>Introduction</h4>
							<div>{@html selectedArticle.introduction}</div>
						</div>
					{/if}
				</div>
			{:else}
				<div class="empty">
					<h3>No article selected</h3>
					<p>Click an article to preview it here.</p>
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	.dashboard {
		padding: 100px 40px 40px;
		background: #f4f9ff;
		min-height: 100vh;
		font-family: 'DM Sans', sans-serif;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 24px;
	}

	h1 { font-size: 30px; font-weight: 900; color: #0d2460; margin: 0; }
	.welcome { color: #5b6780; margin-top: 6px; }

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-bottom: 28px;
	}

	.stat-card {
		background: white;
		border-radius: 16px;
		padding: 20px 24px;
		border: 1px solid #e8eef7;
		box-shadow: 0 4px 12px rgba(0,0,0,0.04);
		border-top: 4px solid #94a3b8;
	}

	.stat-card.submitted { border-top-color: #3b82f6; }
	.stat-card.review { border-top-color: #f59e0b; }
	.stat-card.changes { border-top-color: #f97316; }
	.stat-card.published { border-top-color: #22c55e; }
	.stat-card.rejected { border-top-color: #ef4444; }

	.stat-label {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #6b7280;
		margin: 0 0 8px;
	}

	.stat-num {
		font-size: 36px;
		font-weight: 900;
		color: #0d2460;
		margin: 0;
	}

	.btn-new {
		background: #0155bd;
		color: white;
		padding: 10px 20px;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		font-weight: 700;
		font-size: 15px;
	}

	.btn-logout {
		background: #f1f5f9;
		color: #374151;
		padding: 10px 16px;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		cursor: pointer;
		font-weight: 600;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(340px, 1fr);
		gap: 24px;
		align-items: start;
	}

	.card {
		background: white;
		border-radius: 18px;
		padding: 20px;
		box-shadow: 0 8px 24px rgba(0,0,0,0.05);
		border: 1px solid #e8eef7;
	}

	label {
		display: block;
		font-size: 13px;
		font-weight: 600;
		color: #374151;
		margin: 14px 0 6px;
	}

	.form-card input {
		width: 100%;
		padding: 12px 14px;
		border-radius: 10px;
		border: 1px solid #d9e3f0;
		outline: none;
		font: inherit;
		background: #fff;
		box-sizing: border-box;
	}

	.form-card input:focus { border-color: #0155bd; }

	button {
		background: #0155bd;
		color: white;
		padding: 10px 14px;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		font-weight: 700;
	}

	button:disabled { opacity: 0.65; cursor: not-allowed; }

	.msg { color: #167a33; font-weight: 700; margin-top: 12px; }

	.articles-section h3 { margin: 0 0 16px; color: #0d2460; font-size: 20px; }

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 16px;
	}

	.article-card {
		padding: 0;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.article-card:hover,
	.article-card.active {
		transform: translateY(-2px);
		box-shadow: 0 14px 30px rgba(1,85,189,0.12);
		border-color: #0155bd;
	}

	.body { padding: 14px; }

	.row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
	}

	h4 { margin: 0; font-size: 15px; color: #0d2460; line-height: 1.35; }
	.date { font-size: 12px; color: #7a7a7a; margin: 6px 0 8px; }

	.status {
		font-size: 10px;
		padding: 4px 8px;
		border-radius: 999px;
		font-weight: 900;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.status-draft { background: #f1f5f9; color: #475569; }
	.status-submitted { background: #dbeafe; color: #1d4ed8; }
	.status-review { background: #fef3c7; color: #92400e; }
	.status-changes { background: #ffedd5; color: #c2410c; }
	.status-published { background: #dcfce7; color: #166534; }
	.status-rejected { background: #fee2e2; color: #991b1b; }

	.preview-text { font-size: 13px; color: #374151; line-height: 1.65; margin-bottom: 12px; }
	.actions { display: flex; gap: 8px; flex-wrap: wrap; }
	.btn-submit { background: #16a34a; font-size: 13px; padding: 6px 12px; }
	.btn-delete { background: #dc2626; font-size: 13px; padding: 6px 12px; }

	.reader { min-height: 540px; position: sticky; top: 24px; }
	.reader-head { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eef2f7; }
	.reader-head h2 { margin: 8px 0 0; font-size: 24px; color: #0d2460; }
	.subtitle-text { color: #6b7280; font-style: italic; margin: 6px 0; }
	.reader-meta { color: #6b7280; font-size: 13px; margin-top: 8px; }
	.reader-content { line-height: 1.9; font-size: 1rem; color: #374151; }
	.section { margin-bottom: 20px; }
	.section h4 { font-size: 16px; color: #0d2460; margin-bottom: 8px; border-bottom: 1px solid #e8eef7; padding-bottom: 6px; }

	.empty {
		min-height: 420px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		color: #6b7280;
		gap: 8px;
	}

	.small { text-align: center; padding: 30px; }

	@media (max-width: 1100px) {
		.layout { grid-template-columns: 1fr; }
		.reader { position: static; }
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 700px) {
		.dashboard { padding: 80px 20px 20px; }
		.topbar { flex-direction: column; align-items: flex-start; }
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>
