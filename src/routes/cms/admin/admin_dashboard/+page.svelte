<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';

	type AuthorRequest = {
		id: number;
		user_id: string;
		qualification: string;
		research_area: string;
		reason: string;
		status: string;
		created_at: string;
		profiles?: {
			full_name: string;
			email: string;
		};
	};

	type Article = {
		id: number;
		user_id: string;

		title: string;
		subtitle: string;

		abstract: string;
		keywords: string;

		introduction: string;
		methods: string;
		results: string;
		discussion: string;
		conclusion: string;

		funding: string;
		ethics_statement: string;
		acknowledgements: string;

		status: string;
		created_at: string;
		updated_at: string;

		profiles?: {
			full_name: string;
			email: string;
		};
	};

	let user: any = null;

	let loading = true;

	let activeTab = 'authors';

	let authorRequests: AuthorRequest[] = [];
	let articles: Article[] = [];

	let selectedArticle: Article | null = null;

	onMount(async () => {

		const {
			data: { user: authUser }
		} = await cmsSupabase.auth.getUser();

		if (!authUser) {
			goto('/cms/login');
			return;
		}

		user = authUser;

		const { data: profile } = await cmsSupabase
			.from('profiles')
			.select('role')
			.eq('id', authUser.id)
			.single();

		if (profile?.role !== 'admin') {
			goto('/cms/login');
			return;
		}

		await loadAuthorRequests();
		await loadArticles();

		loading = false;

	});

	async function loadAuthorRequests() {

		const { data } = await cmsSupabase

			.from('author_requests')

			.select(`
				*,
				profiles:user_id(
					full_name,
					email
				)
			`)

			.eq('status', 'pending')

			.order('created_at', {
				ascending: false
			});

		authorRequests = data ?? [];

	}

	async function loadArticles() {

		const { data } = await cmsSupabase

			.from('research_articles')

			.select(`
				*,
				profiles:user_id(
					full_name,
					email
				)
			`)

			.eq('status', 'submitted')

			.order('created_at', {
				ascending: false
			});

		articles = data ?? [];

	}

	async function approveAuthor(request: AuthorRequest) {

		await cmsSupabase

			.from('profiles')

			.update({
				role: 'author'
			})

			.eq('id', request.user_id);

		await cmsSupabase

			.from('author_requests')

			.update({
				status: 'approved'
			})

			.eq('id', request.id);

		await loadAuthorRequests();

	}

	async function rejectAuthor(request: AuthorRequest) {

		await cmsSupabase

			.from('author_requests')

			.update({
				status: 'rejected'
			})

			.eq('id', request.id);

		await loadAuthorRequests();

	}

	async function approveArticle(article: Article) {

		await cmsSupabase

			.from('research_articles')

			.update({

				status: 'published',

				updated_at: new Date().toISOString()

			})

			.eq('id', article.id);

		await loadArticles();

		selectedArticle = null;

	}

	async function rejectArticle(article: Article) {

		await cmsSupabase

			.from('research_articles')

			.update({

				status: 'rejected',

				updated_at: new Date().toISOString()

			})

			.eq('id', article.id);

		await loadArticles();

		selectedArticle = null;

	}

	async function requestChanges(article: Article) {

		await cmsSupabase

			.from('research_articles')

			.update({

				status: 'changes_requested',

				updated_at: new Date().toISOString()

			})

			.eq('id', article.id);

		await loadArticles();

		selectedArticle = null;

	}

	function openArticle(article: Article) {

		selectedArticle = article;

	}

	function formatDate(date: string) {

		return new Date(date).toLocaleDateString(
			'en-IN',
			{
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			}
		);

	}

	async function logout() {

		await cmsSupabase.auth.signOut();

		goto('/cms/login');

	}
</script>

<Nav />

<div class="dashboard">

	<div class="topbar">

		<div>
			<h1>Admin Dashboard</h1>
			<p class="welcome">
				Welcome, {user?.email?.split("@")[0]}
			</p>
		</div>

		<div style="display:flex;gap:12px;align-items:center;">

			<div class="pill">
				Author Requests : {authorRequests.length}
			</div>

			<div class="pill">
				Articles : {articles.length}
			</div>

			<button
				class="btn-logout"
				on:click={logout}
			>
				Logout
			</button>

		</div>

	</div>

	<div class="tabs">

		<button
			class:active={activeTab==="authors"}
			on:click={() => activeTab="authors"}
		>
			Author Requests
		</button>

		<button
			class:active={activeTab==="articles"}
			on:click={() => activeTab="articles"}
		>
			Article Review
		</button>

	</div>

	<div class="layout">

		<!-- LEFT PANEL -->

		<section>

			{#if loading}

				<div class="card">
					Loading...
				</div>

			{:else if activeTab==="authors"}

				<h3 class="heading">
					Pending Author Requests
				</h3>

				{#if authorRequests.length===0}

					<div class="card">
						No pending requests.
					</div>

				{:else}

					{#each authorRequests as request}

						<div class="card request-card">

							<h3>
								{request.profiles?.full_name}
							</h3>

							<p>
								<strong>Email :</strong>
								{request.profiles?.email}
							</p>

							<p>
								<strong>Qualification :</strong>
								{request.qualification}
							</p>

							<p>
								<strong>Research Area :</strong>
								{request.research_area}
							</p>

							<p class="reason">
								{request.reason}
							</p>

							<div class="actions">

								<button
									class="approve"
									on:click={() => approveAuthor(request)}
								>
									Approve
								</button>

								<button
									class="reject"
									on:click={() => rejectAuthor(request)}
								>
									Reject
								</button>

							</div>

						</div>

					{/each}

				{/if}

			{:else}

				<h3 class="heading">
					Submitted Articles
				</h3>

				{#if articles.length===0}

					<div class="card">
						No submitted articles.
					</div>

				{:else}

					{#each articles as article}

						<div
							class="card article-card"
							on:click={() => openArticle(article)}
						>

							<h3>
								{article.title}
							</h3>

							<p>

								<strong>Author :</strong>

								{article.profiles?.full_name}

							</p>

							<p>

								<strong>Date :</strong>

								{formatDate(article.created_at)}

							</p>

							<span class="status">
								{article.status}
							</span>

						</div>

					{/each}

				{/if}

			{/if}

		</section>

		<!-- RIGHT PANEL -->

		<section class="card preview">

			{#if activeTab==="articles"}

				{#if selectedArticle}

					<h2>

						{selectedArticle.title}

					</h2>

					{#if selectedArticle.subtitle}

						<p class="subtitle">

							{selectedArticle.subtitle}

						</p>

					{/if}

					<div class="section">

						<h4>Abstract</h4>

						<p>
							{selectedArticle.abstract}
						</p>

					</div>

					<div class="section">

						<h4>Introduction</h4>

						<p>
							{selectedArticle.introduction}
						</p>

					</div>

					<div class="section">

						<h4>Methods</h4>

						<p>
							{selectedArticle.methods}
						</p>

					</div>

					<div class="section">

						<h4>Results</h4>

						<p>
							{selectedArticle.results}
						</p>

					</div>

					<div class="section">

						<h4>Discussion</h4>

						<p>
							{selectedArticle.discussion}
						</p>

					</div>

					<div class="section">

						<h4>Conclusion</h4>

						<p>
							{selectedArticle.conclusion}
						</p>

					</div>

					<div class="review-actions">

						<button
							class="approve"
							on:click={() => approveArticle(selectedArticle)}
						>
							Publish
						</button>

						<button
							class="changes"
							on:click={() => requestChanges(selectedArticle)}
						>
							Request Changes
						</button>

						<button
							class="reject"
							on:click={() => rejectArticle(selectedArticle)}
						>
							Reject
						</button>

					</div>

				{:else}

					<div class="empty">

						<h3>
							Select an article
						</h3>

						<p>
							Choose an article from the left.
						</p>

					</div>

				{/if}

			{:else}

				<div class="empty">

					<h3>
						Author Requests
					</h3>

					<p>

						Approve or reject requests from the left panel.

					</p>

				</div>

			{/if}

		</section>

	</div>

</div>

<style>
	.dashboard {
		padding: 40px;
		background: #f4f9ff;
		min-height: 100vh;
		font-family: "DM Sans", sans-serif;
	}
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 24px;
	}
	h1 {
		margin: 0;
		font-size: 30px;
		font-weight: 900;
		color: #0d2460;
	}
	.welcome {
		color: #64748b;
		margin-top: 6px;
	}
	.tabs {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
	}
	.tabs button {
		background: white;
		border: 1px solid #d8e8fa;
		padding: 12px 20px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 700;
		color: #0155bd;
		transition: .2s;
	}
	.tabs button.active {
		background: #0155bd;
		color: white;
	}
	.layout {
		display: grid;
		grid-template-columns: 420px 1fr;
		gap: 24px;
		align-items: start;
	}
	.card {
		background: white;
		border-radius: 18px;
		padding: 20px;
		border: 1px solid #e8eef7;
		box-shadow: 0 8px 24px rgba(0,0,0,.05);
	}
	.heading {
		margin-bottom: 18px;
		font-size: 22px;
		color: #0d2460;
	}
	.request-card,
	.article-card {
		margin-bottom: 18px;
		cursor: pointer;
		transition: .2s;
	}
	.request-card:hover,
	.article-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 28px rgba(1,85,189,.12);
		border-color: #0155bd;
	}
	.request-card h3,
	.article-card h3 {
		margin: 0 0 12px;
		color: #0d2460;
		font-size: 20px;
	}
	.request-card p,
	.article-card p {
		margin: 8px 0;
		line-height: 1.6;
		color: #475569;
	}
	.reason {
		margin-top: 14px;
		background: #f8fbff;
		padding: 14px;
		border-radius: 10px;
		border-left: 4px solid #0155bd;
	}
	.actions {
		display: flex;
		gap: 10px;
		margin-top: 20px;
		flex-wrap: wrap;
	}
	.status {
		display: inline-block;
		margin-top: 12px;
		padding: 6px 12px;
		border-radius: 999px;
		background: #dbeafe;
		color: #1d4ed8;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
	}
	.preview {
		position: sticky;
		top: 24px;
		min-height: 650px;
	}
	.preview h2 {
		margin: 0;
		font-size: 28px;
		color: #0d2460;
	}
	.subtitle {
		margin-top: 8px;
		color: #64748b;
		font-style: italic;
	}
	.section {
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid #edf2f7;
	}
	.section:first-of-type {
		border-top: none;
		padding-top: 0;
		margin-top: 24px;
	}
	.section h4 {
		margin: 0 0 10px;
		font-size: 18px;
		font-weight: 800;
		color: #0d2460;
	}
	.section p {
		margin: 0;
		color: #475569;
		line-height: 1.8;
		white-space: pre-wrap;
	}
	.review-actions {
		display: flex;
		gap: 12px;
		margin-top: 30px;
		flex-wrap: wrap;
	}
	.approve,
	.reject,
	.changes,
	.btn-logout {
		border: none;
		border-radius: 10px;
		padding: 12px 18px;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
		transition: .2s;
	}
	.approve {
		background: #16a34a;
		color: white;
	}
	.approve:hover {
		background: #15803d;
	}
	.reject {
		background: #dc2626;
		color: white;
	}
	.reject:hover {
		background: #b91c1c;
	}
	.changes {
		background: #f59e0b;
		color: white;
	}
	.changes:hover {
		background: #d97706;
	}
	.btn-logout {
		background: #f1f5f9;
		color: #374151;
		border: 1px solid #e2e8f0;
	}
	.btn-logout:hover {
		background: #e2e8f0;
	}
	.pill {
		background: white;
		border: 1px solid #d8e8fa;
		padding: 10px 14px;
		border-radius: 999px;
		color: #0155bd;
		font-weight: 700;
	}
	.empty {
		min-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		color: #64748b;
	}
	.empty h3 {
		margin-bottom: 8px;
		color: #0d2460;
		font-size: 24px;
	}
	.empty p {
		max-width: 300px;
		line-height: 1.7;
	}
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
	@media (max-width: 1100px) {
		.layout {
			grid-template-columns: 1fr;
		}
		.preview {
			position: static;
			min-height: auto;
		}
	}
	@media (max-width: 700px) {
		.dashboard {
			padding: 20px;
		}
		.topbar {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}
		.tabs {
			flex-wrap: wrap;
		}
		.review-actions,
		.actions {
			flex-direction: column;
		}
		.review-actions button,
		.actions button {
			width: 100%;
		}
		.preview h2 {
			font-size: 22px;
		}
		h1 {
			font-size: 26px;
		}
	}
</style>