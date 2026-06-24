<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import RichTextEditor from '$lib/components/RichEditor.svelte';
	import toast from 'svelte-french-toast';
	import NewsFooter from '$lib/components/news-footer.svelte';
	import Treatment from '$lib/svg/treatment.svelte';
	import { Search } from 'lucide-svelte';

	type AuthorRequest = {
		id: number;
		user_id: string;
		qualification: string;
		research_area: string;
		reason: string;
		status: string;
		created_at: string;
		profiles?: { full_name: string; email: string };
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
		admin_feedback: string | null;
		profiles?: { full_name: string; email: string };
	};

	type CMSContent = {
		id: string;
		content_type: string;
		title: string;
		slug: string;
		content: string;
		status: string;
		category: string | null;
		created_at: string;
		updated_at?: string;
	};

	type UserProfile = {
		id: string;
		email: string;
		full_name: string | null;
		role: string;
		created_at: string;
	};

	let user: any = null;
	let loading = true;
	let contentToDelete: string | null = null;
	let activeTab = 'analytics';

	// Analytics
	let totalAuthors = 0;
	let pendingRequests = 0;
	let totalArticles = 0;
	let publishedArticles = 0;
	let submittedArticles = 0;
	let rejectedArticles = 0;
	let underReviewArticles = 0;
	let changesRequestedArticles = 0;
	let totalContent = 0;
	let publishedContent = 0;

	// Data
	let authorRequests: AuthorRequest[] = [];
	let articles: Article[] = [];
	let cmsContents: CMSContent[] = [];
	let users: UserProfile[] = [];
	let selectedArticle: Article | null = null;
	let adminFeedback = '';
	let showFeedbackModal = false;
	let pendingAction: 'reject' | 'changes' | null = null;
	let editingContent: CMSContent | null = null;

	// CMS Content form
	let showContentForm = false;
	let contentType = 'blog';
	let contentTitle = '';
	let contentSlug = '';
	let contentBody = '';
	let contentCategory = '';
	let contentStatus = 'draft';
	let contentExcerpt = '';
	let contentTags = '';
	let featuredImage: File | null = null;
	let seoTitle = '';
	let seoDescription = '';
	let publishDate = '';
	let savingContent = false;

	$: if (contentTitle && !editingContent) {
		contentSlug = contentTitle
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
	}

	// User management
	let userSearch = '';
	let roleFilter = 'all';
	let contentSearch = '';
	let contentSort = 'newest';

	$: filteredContents = cmsContents
		.filter((c) => {
			if (!contentSearch) return true;
			const term = contentSearch.toLowerCase();
			return c.title.toLowerCase().includes(term) || 
			       c.slug.toLowerCase().includes(term) ||
			       (c.category && c.category.toLowerCase().includes(term));
		})
		.sort((a, b) => {
			if (contentSort === 'newest')
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			if (contentSort === 'oldest')
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			if (contentSort === 'alphabetical') return a.title.localeCompare(b.title);
			if (contentSort === 'recently_updated') {
				const dateA = a.updated_at
					? new Date(a.updated_at).getTime()
					: new Date(a.created_at).getTime();
				const dateB = b.updated_at
					? new Date(b.updated_at).getTime()
					: new Date(b.created_at).getTime();
				return dateB - dateA;
			}
			return 0;
		});

	const CONTENT_TYPES = ['blog', 'news', 'event', 'faq', 'campaign', 'testimonial'];
	const ROLES = ['user', 'author', 'cms_admin', 'super_admin'];

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

		if (profile?.role !== 'cms_admin' && profile?.role !== 'super_admin') {
			goto('/cms/login');
			return;
		}

		await Promise.all([
			loadAnalytics(),
			loadAuthorRequests(),
			loadArticles(),
			loadCMSContent(),
			loadUsers()
		]);

		loading = false;
	});

	async function loadAnalytics() {
		const { data: authors } = await cmsSupabase.from('profiles').select('id').eq('role', 'author');
		totalAuthors = authors?.length ?? 0;

		const { data: pending } = await cmsSupabase
			.from('author_requests')
			.select('id')
			.eq('status', 'pending');
		pendingRequests = pending?.length ?? 0;

		const { data: allArticles } = await cmsSupabase.from('research_articles').select('id, status');
		totalArticles = allArticles?.length ?? 0;
		publishedArticles = allArticles?.filter((a) => a.status === 'published').length ?? 0;
		submittedArticles = allArticles?.filter((a) => a.status === 'submitted').length ?? 0;
		rejectedArticles = allArticles?.filter((a) => a.status === 'rejected').length ?? 0;
		underReviewArticles = allArticles?.filter((a) => a.status === 'under_review').length ?? 0;
		changesRequestedArticles =
			allArticles?.filter((a) => a.status === 'changes_requested').length ?? 0;

		const { data: content } = await cmsSupabase.from('cms_content').select('id, status');
		totalContent = content?.length ?? 0;
		publishedContent = content?.filter((c) => c.status === 'published').length ?? 0;
	}

	async function loadAuthorRequests() {
		const { data } = await cmsSupabase
			.from('author_requests')
			.select('*, profiles:user_id(full_name, email)')
			.eq('status', 'pending')
			.order('created_at', { ascending: false });
		authorRequests = data ?? [];
	}

	async function loadArticles() {
		const { data } = await cmsSupabase
			.from('research_articles')
			.select('*, profiles:user_id(full_name, email)')
			.eq('status', 'submitted')
			.order('created_at', { ascending: false });
		articles = data ?? [];
	}

	async function loadCMSContent() {
		const { data } = await cmsSupabase
			.from('cms_content')
			.select('*')
			.order('created_at', { ascending: false });
		cmsContents = data ?? [];
	}

	async function loadUsers() {
		const { data } = await cmsSupabase
			.from('profiles')
			.select('*')
			.order('created_at', { ascending: false });
		users = data ?? [];
	}

	async function approveAuthor(request: AuthorRequest) {
		await cmsSupabase.from('profiles').update({ role: 'author' }).eq('id', request.user_id);
		await cmsSupabase.from('author_requests').update({ status: 'approved' }).eq('id', request.id);
		await loadAuthorRequests();
		await loadAnalytics();
	}

	async function rejectAuthor(request: AuthorRequest) {
		await cmsSupabase.from('author_requests').update({ status: 'rejected' }).eq('id', request.id);
		await loadAuthorRequests();
		await loadAnalytics();
	}

	async function approveArticle(article: Article) {
		await cmsSupabase
			.from('research_articles')
			.update({ status: 'published', updated_at: new Date().toISOString() })
			.eq('id', article.id);
		await loadArticles();
		await loadAnalytics();
		selectedArticle = null;
	}


	async function triggerAction(action: 'reject' | 'changes') {
		pendingAction = action;
		adminFeedback = '';
		showFeedbackModal = true;
		await tick();
		const el = document.getElementById('admin-feedback-input');
		if (el) el.focus();
	}

	function cancelFeedbackAction() {
		showFeedbackModal = false;
		pendingAction = null;
		adminFeedback = '';
	}

	async function submitFeedbackAction() {
		if (!adminFeedback || adminFeedback.trim() === '') {
			toast.error("Feedback is required.");
			return;
		}
		if (!selectedArticle) return;

		const status = pendingAction === 'reject' ? 'rejected' : 'changes_requested';

		await cmsSupabase
			.from('research_articles')
			.update({ status, updated_at: new Date().toISOString(), admin_feedback: adminFeedback })
			.eq('id', selectedArticle.id);
		
		await loadArticles();
		await loadAnalytics();
		selectedArticle = null;
		showFeedbackModal = false;
		pendingAction = null;
		adminFeedback = '';
	}

	function openArticle(article: Article) {
		selectedArticle = article;
		adminFeedback = article.admin_feedback || '';
	}

	function resetContentForm() {
		editingContent = null;
		showContentForm = false;
		contentTitle = '';
		contentSlug = '';
		contentExcerpt = '';
		contentBody = '';
		contentCategory = '';
		contentTags = '';
		seoTitle = '';
		seoDescription = '';
		publishDate = '';
		featuredImage = null;
		contentType = 'blog';
		contentStatus = 'draft';
		showContentForm = true;
	}

	function startEdit(content: CMSContent) {
		editingContent = content;
		showContentForm = true;
		contentType = content.content_type;
		contentTitle = content.title;
		contentSlug = content.slug;
		contentBody = content.content;
		contentCategory = content.category ?? '';
		contentStatus = content.status;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function togglePublish(content: CMSContent) {
		const newStatus = content.status === 'published' ? 'draft' : 'published';
		const { error } = await cmsSupabase
			.from('cms_content')
			.update({ status: newStatus })
			.eq('id', content.id);
		if (error) {
			toast.error(error.message);
			return;
		}

		if (newStatus === 'published') {
			toast.success('Content published successfully! ');
		} else {
			toast.success('Content moved to draft. ');
		}

		await loadCMSContent();
		await loadAnalytics();
	}

	async function saveContent() {
		if (!contentTitle.trim() || !contentBody.trim()) {
			toast.error('Title and content are required');
			return;
		}
		savingContent = true;

		let imageUrl = null;
		if (featuredImage) {
			const fileName = `${Date.now()}-${featuredImage.name}`;
			const { error: uploadError } = await cmsSupabase.storage
				.from('cms-images')
				.upload(fileName, featuredImage);
			if (uploadError) {
				toast.error(uploadError.message);
				savingContent = false;
				return;
			}
			const { data } = cmsSupabase.storage.from('cms-images').getPublicUrl(fileName);
			imageUrl = data.publicUrl;
		}

		const { error } = await cmsSupabase.from('cms_content').insert([
			{
				content_type: contentType,
				title: contentTitle,
				slug: contentSlug,
				excerpt: contentExcerpt,
				content: contentBody,
				category: contentCategory || null,
				tags: contentTags ? contentTags.split(',').map((t) => t.trim()) : [],
				featured_image: imageUrl,
				seo_title: seoTitle || null,
				seo_description: seoDescription || null,
				published_at: publishDate || null,
				status: contentStatus
			}
		]);

		savingContent = false;
		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success(' Content saved successfully!');
		resetContentForm();
		await loadCMSContent();
		await loadAnalytics();
	}

	async function updateContent() {
		if (!contentTitle.trim() || !contentBody.trim()) {
			toast.error('Title and content are required');
			return;
		}
		if (!editingContent) return;
		savingContent = true;

		const { error } = await cmsSupabase
			.from('cms_content')
			.update({
				content_type: contentType,
				title: contentTitle,
				slug: contentSlug,
				content: contentBody,
				category: contentCategory || null,
				status: contentStatus,
				updated_at: new Date().toISOString()
			})
			.eq('id', editingContent.id);

		savingContent = false;
		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success(' Content updated!');
		resetContentForm();
		await loadCMSContent();
		await loadAnalytics();
	}

	function promptDelete(id: string) {
		contentToDelete = id;
	}

	function cancelDelete() {
		contentToDelete = null;
	}

	async function confirmDelete() {
		if (!contentToDelete) return;
		await cmsSupabase.from('cms_content').delete().eq('id', contentToDelete);
		toast.success('Content deleted successfully! 🗑️');
		contentToDelete = null;
		await loadCMSContent();
		await loadAnalytics();
	}

	async function updateUserRole(userId: string, newRole: string) {
		const { error } = await cmsSupabase.from('profiles').update({ role: newRole }).eq('id', userId);
		if (error) {
			toast.error(error.message);
			return;
		}
		await loadUsers();
		await loadAnalytics();
	}

	async function removeUser(userId: string) {
		if (!confirm('Remove this user?')) return;
		await cmsSupabase.from('profiles').delete().eq('id', userId);
		await loadUsers();
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	async function logout() {
		await cmsSupabase.auth.signOut();
		goto('/cms/login');
	}

	$: filteredUsers = users.filter((u) => {
		const matchSearch =
			!userSearch ||
			u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
			u.full_name?.toLowerCase().includes(userSearch.toLowerCase());
		const matchRole = roleFilter === 'all' || u.role === roleFilter;
		return matchSearch && matchRole;
	});

	const typeColors: Record<string, string> = {
		blog: '#9333ea',
		news: '#3b82f6',
		event: '#22c55e',
		faq: '#eab308',
		campaign: '#ec4899',
		testimonial: '#f97316'
	};
</script>

<Nav />

<div class="dashboard">
	<div class="topbar">
		<div>
			<h1>Admin Dashboard</h1>
			<p class="welcome">Welcome, {user?.email?.split('@')[0]}</p>
		</div>
		<button class="btn-logout" on:click={logout}>Logout</button>
	</div>

	<div class="tabs">
		<button class:active={activeTab === 'analytics'} on:click={() => (activeTab = 'analytics')}>
			📊 Analytics
		</button>
		<button class:active={activeTab === 'authors'} on:click={() => (activeTab = 'authors')}>
			👥 Author Requests {#if authorRequests.length > 0}<span class="badge"
					>{authorRequests.length}</span
				>{/if}
		</button>
		<button class:active={activeTab === 'articles'} on:click={() => (activeTab = 'articles')}>
			📝 Review Articles {#if articles.length > 0}<span class="badge">{articles.length}</span>{/if}
		</button>
		<button class:active={activeTab === 'content'} on:click={() => (activeTab = 'content')}>
			🗂 CMS Content
		</button>
		<button class:active={activeTab === 'users'} on:click={() => (activeTab = 'users')}>
			🔧 Manage Users
		</button>
	</div>

	{#if loading}
		<div class="card" style="text-align:center;padding:60px;">Loading...</div>
	{:else if activeTab === 'analytics'}
		<div class="analytics-grid">
			<div class="stat-card blue">
				<p class="stat-label">Total Authors</p>
				<p class="stat-num">{totalAuthors}</p>
			</div>
			<div class="stat-card yellow">
				<p class="stat-label">Pending Requests</p>
				<p class="stat-num">{pendingRequests}</p>
			</div>
			<div class="stat-card purple">
				<p class="stat-label">Total Articles</p>
				<p class="stat-num">{totalArticles}</p>
			</div>
			<div class="stat-card green">
				<p class="stat-label">Published Articles</p>
				<p class="stat-num">{publishedArticles}</p>
			</div>
			<div class="stat-card orange">
				<p class="stat-label">Submitted Articles</p>
				<p class="stat-num">{submittedArticles}</p>
			</div>
			<div class="stat-card red">
				<p class="stat-label">Rejected Articles</p>
				<p class="stat-num">{rejectedArticles}</p>
			</div>
			<div class="stat-card teal">
				<p class="stat-label">Under Review</p>
				<p class="stat-num">{underReviewArticles}</p>
			</div>
			<div class="stat-card pink">
				<p class="stat-label">Changes Requested</p>
				<p class="stat-num">{changesRequestedArticles}</p>
			</div>
			<div class="stat-card indigo">
				<p class="stat-label">Total CMS Content</p>
				<p class="stat-num">{totalContent}</p>
			</div>
			<div class="stat-card green">
				<p class="stat-label">Published Content</p>
				<p class="stat-num">{publishedContent}</p>
			</div>
		</div>
	{:else if activeTab === 'authors'}
		<h3 class="heading">Pending Author Requests</h3>
		{#if authorRequests.length === 0}
			<div class="card empty-card">No pending requests.</div>
		{:else}
			{#each authorRequests as request}
				<div class="card request-card">
					<h3>{request.profiles?.full_name ?? 'Unknown'}</h3>
					<p><strong>Email:</strong> {request.profiles?.email}</p>
					<p><strong>Qualification:</strong> {request.qualification}</p>
					<p><strong>Research Area:</strong> {request.research_area}</p>
					<p class="reason">{request.reason}</p>
					<div class="actions">
						<button class="approve" on:click={() => approveAuthor(request)}>Approve</button>
						<button class="reject" on:click={() => rejectAuthor(request)}>Reject</button>
					</div>
				</div>
			{/each}
		{/if}
	{:else if activeTab === 'articles'}
		<div class="layout">
			<section>
				<h3 class="heading">Submitted Articles</h3>
				{#if articles.length === 0}
					<div class="card empty-card">No submitted articles.</div>
				{:else}
					{#each articles as article}
						<div
							class="card article-card"
							class:selected={selectedArticle?.id === article.id}
							on:click={() => openArticle(article)}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && openArticle(article)}
						>
							<h3>{article.title}</h3>
							<p><strong>Author:</strong> {article.profiles?.full_name}</p>
							<p><strong>Date:</strong> {formatDate(article.created_at)}</p>
							<span class="status">{article.status}</span>
						</div>
					{/each}
				{/if}
			</section>

			<section class="card preview">
				{#if selectedArticle}
					<h2>{selectedArticle.title}</h2>
					{#if selectedArticle.subtitle}
						<p class="subtitle">{selectedArticle.subtitle}</p>
					{/if}
					{#each [{ label: 'Abstract', value: selectedArticle.abstract }, { label: 'Introduction', value: selectedArticle.introduction }, { label: 'Methods', value: selectedArticle.methods }, { label: 'Results', value: selectedArticle.results }, { label: 'Discussion', value: selectedArticle.discussion }, { label: 'Conclusion', value: selectedArticle.conclusion }] as sec}
						{#if sec.value}
							<div class="section">
								<h4>{sec.label}</h4>
								<p>{@html sec.value}</p>
							</div>
						{/if}
					{/each}
					<div class="review-actions">
						<button class="approve" on:click={() => approveArticle(selectedArticle)}>Publish</button>
						<button class="changes" on:click={() => triggerAction('changes')}>Request Changes</button>
						<button class="reject" on:click={() => triggerAction('reject')}>Reject</button>
					</div>

					{#if showFeedbackModal}
						<div style="margin-top:20px;padding:16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;">
							<h4 style="margin:0 0 12px;color:#0f172a;font-size:16px;">
								{pendingAction === 'reject' ? 'Reason for Rejection' : 'Feedback / Suggested Changes'}
							</h4>
							<textarea
								id="admin-feedback-input"
								bind:value={adminFeedback}
								rows="4"
								placeholder="Type your feedback here (required)..."
								style="width:100%;padding:12px;border:1px solid #94a3b8;border-radius:8px;font-size:14px;resize:vertical;margin-bottom:12px;"
							></textarea>
							<div style="display:flex;gap:12px;justify-content:flex-end;">
								<button on:click={cancelFeedbackAction} style="padding:8px 16px;background:#e2e8f0;color:#475569;border-radius:8px;border:none;cursor:pointer;font-weight:600;">
									Cancel
								</button>
								<button on:click={submitFeedbackAction} style="padding:8px 16px;background:#3b82f6;color:white;border-radius:8px;border:none;cursor:pointer;font-weight:600;">
									Confirm & Submit
								</button>
							</div>
						</div>
					{/if}
				{:else}
					<div class="empty">
						<h3>Select an article</h3>
						<p>Choose an article from the left panel.</p>
					</div>
				{/if}
			</section>
		</div>
	{:else if activeTab === 'content'}
		<div
			style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;"
		>
			<h3 class="heading" style="margin:0;">
				{editingContent ? '✏️ Edit Content' : '🗂 CMS Content'}
			</h3>
			<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
				{#if !showContentForm && cmsContents.length > 0}
					<div class="hidden md:flex relative group items-center">
						<input
							bind:value={contentSearch}
							class="w-0 group-hover:w-48 transition-all duration-500 bg-transparent border-0 border-b border-black outline-none focus:outline-none focus:ring-0 focus:border-black focus:border-x-0 focus:border-t-0 focus:shadow-none focus:w-48 px-2 text-black"
							placeholder="Search..."
							type="text"
						/>
						<button
							class="cursor-pointer text-black p-2 scale-105 active:scale-95 transition-transform flex items-center justify-center"
						>
							<Search size={20} />
						</button>
					</div>
					<select
						bind:value={contentSort}
						style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; outline:none; background:white; color:#374151; cursor:pointer;"
					>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
						<option value="alphabetical">Alphabetical (A-Z)</option>
						<option value="recently_updated">Recently Updated</option>
					</select>
				{/if}
				<button
					class="approve"
					on:click={resetContentForm}
					style="height:100%;padding:10px 16px;display:flex;align-items:center;"
				>
					{showContentForm ? '✕ Cancel' : '+ Create Content'}
				</button>
			</div>
		</div>

		{#if showContentForm}
			<div class="card" style="margin-bottom:24px;">
				<h3 style="margin:0 0 20px;color:#0d2460;">
					{editingContent ? 'Edit Content' : 'Create New Content'}
				</h3>

				<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
					{#each CONTENT_TYPES as type}
						<button
							on:click={() => (contentType = type)}
							style="padding:8px 16px;border-radius:20px;border:2px solid {contentType === type
								? typeColors[type]
								: '#e2e8f0'};background:{contentType === type
								? typeColors[type]
								: 'white'};color:{contentType === type
								? 'white'
								: '#374151'};font-weight:700;cursor:pointer;text-transform:capitalize;"
						>
							{type}
						</button>
					{/each}
				</div>

				<input
					bind:value={contentTitle}
					placeholder="Title *"
					style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:12px;font-size:15px;"
				/>

				<div style="margin-bottom:16px;">
					<label style="display:block;margin-bottom:6px;font-weight:600;font-size:14px;"
						>Slug *</label
					>
					<input
						bind:value={contentSlug}
						placeholder="auto-generated-from-title"
						style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;"
					/>
					<small style="color:#64748b;">URL: /{contentType}/{contentSlug}</small>
				</div>

				<input
					bind:value={contentCategory}
					placeholder="Category (optional)"
					style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:12px;font-size:15px;"
				/>

				<div style="margin-bottom:16px;">
					<label style="display:block;margin-bottom:6px;font-weight:600;font-size:14px;"
						>Short Description / Excerpt</label
					>
					<textarea
						bind:value={contentExcerpt}
						rows="3"
						placeholder="Write a short summary..."
						style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;resize:vertical;"
					></textarea>
				</div>

				<div style="margin-bottom:16px;">
					<label style="display:block;margin-bottom:6px;font-weight:600;font-size:14px;">Tags</label
					>
					<input
						bind:value={contentTags}
						placeholder="cancer, awareness, health"
						style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;"
					/>
				</div>

				<div style="margin-bottom:16px;">
					<label style="display:block;margin-bottom:8px;font-weight:600;"> Content * </label>

					<RichTextEditor
						content={contentBody}
						placeholder="Write your content..."
						on:update={(e) => (contentBody = e.detail)}
					/>
				</div>

				{#if !editingContent}
					<div style="margin-bottom:16px;">
						<label style="display:block;margin-bottom:6px;font-weight:600;font-size:14px;"
							>Featured Image</label
						>
						<input
							type="file"
							accept="image/*"
							on:change={(e) => (featuredImage = e.currentTarget.files?.[0] ?? null)}
							style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:10px;"
						/>
						{#if featuredImage}
							<p style="margin-top:8px;color:#16a34a;font-size:14px;">
								Selected: {featuredImage.name}
							</p>
						{/if}
					</div>

					<div style="margin-bottom:16px;">
						<label style="display:block;margin-bottom:6px;font-weight:600;font-size:14px;"
							>Publish Date</label
						>
						<input
							type="datetime-local"
							bind:value={publishDate}
							style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;"
						/>
					</div>
				{/if}

				<h3 style="margin-top:24px;margin-bottom:12px;color:#0d2460;font-size:18px;">
					SEO Settings
				</h3>

				<input
					bind:value={seoTitle}
					placeholder="SEO Title"
					style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:12px;font-size:15px;"
				/>

				<textarea
					bind:value={seoDescription}
					rows="3"
					placeholder="SEO Description"
					style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;font-size:15px;resize:vertical;"
				></textarea>

				<div style="display:flex;gap:12px;margin-bottom:20px;">
					<button
						on:click={() => (contentStatus = 'draft')}
						style="padding:10px 20px;border-radius:10px;border:none;background:{contentStatus ===
						'draft'
							? '#374151'
							: '#f1f5f9'};color:{contentStatus === 'draft'
							? 'white'
							: '#374151'};font-weight:700;cursor:pointer;"
					>
						Draft
					</button>
					<button
						on:click={() => (contentStatus = 'published')}
						style="padding:10px 20px;border-radius:10px;border:none;background:{contentStatus ===
						'published'
							? '#16a34a'
							: '#f1f5f9'};color:{contentStatus === 'published'
							? 'white'
							: '#374151'};font-weight:700;cursor:pointer;"
					>
						Published
					</button>
				</div>

				<button
					class="approve"
					on:click={editingContent ? updateContent : saveContent}
					disabled={savingContent}
				>
					{savingContent ? 'Saving...' : editingContent ? 'Update Content' : 'Save Content'}
				</button>
			</div>
		{/if}

		{#if cmsContents.length === 0}
			<div class="card empty-card">No content yet. Create some!</div>
		{:else if filteredContents.length === 0}
			<div class="card empty-card">No content matches your search.</div>
		{:else}
			{#each filteredContents as content}
				<div class="card" style="margin-bottom:16px;">
					<div
						style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;"
					>
						<div>
							<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
								<span
									style="padding:4px 10px;border-radius:20px;background:{typeColors[
										content.content_type
									] ??
										'#94a3b8'};color:white;font-size:11px;font-weight:700;text-transform:capitalize;"
								>
									{content.content_type}
								</span>
								<span
									style="padding:4px 10px;border-radius:20px;background:{content.status ===
									'published'
										? '#dcfce7'
										: '#f1f5f9'};color:{content.status === 'published'
										? '#16a34a'
										: '#64748b'};font-size:11px;font-weight:700;"
								>
									{content.status}
								</span>
							</div>
							<h3 style="margin:0;color:#0d2460;font-size:18px;">{content.title}</h3>
							<p style="margin:4px 0 0;color:#64748b;font-size:13px;">
								/{content.slug} · {formatDate(content.created_at)}
							</p>
						</div>
						<div style="display:flex;gap:8px;flex-wrap:wrap;">
							<button
								on:click={() => startEdit(content)}
								style="padding:8px 14px;border-radius:8px;border:none;background:#3b82f6;color:white;font-weight:700;cursor:pointer;font-size:13px;"
							>
								Edit
							</button>
							<button
								on:click={() => togglePublish(content)}
								style="padding:8px 14px;border-radius:8px;border:none;background:{content.status ===
								'published'
									? '#f59e0b'
									: '#16a34a'};color:white;font-weight:700;cursor:pointer;font-size:13px;"
							>
								{content.status === 'published' ? 'Unpublish' : 'Publish'}
							</button>
							<button
								class="reject"
								style="padding:8px 14px;font-size:13px;"
								on:click={() => promptDelete(content.id)}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	{:else if activeTab === 'users'}
		<h3 class="heading">Manage Users</h3>

		<div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
			<input
				bind:value={userSearch}
				placeholder="Search by name or email..."
				style="flex:1;min-width:200px;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;"
			/>
			<select
				bind:value={roleFilter}
				style="padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;cursor:pointer;"
			>
				<option value="all">All Roles</option>
				{#each ROLES as role}
					<option value={role}>{role}</option>
				{/each}
			</select>
		</div>

		<div class="card" style="padding:0;overflow:hidden;">
			<table style="width:100%;border-collapse:collapse;">
				<thead>
					<tr style="background:#f8fafc;">
						<th
							style="padding:14px 20px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;"
							>User</th
						>
						<th
							style="padding:14px 20px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;"
							>Role</th
						>
						<th
							style="padding:14px 20px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;"
							>Joined</th
						>
						<th
							style="padding:14px 20px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody>
					{#each filteredUsers as u}
						<tr style="border-top:1px solid #f1f5f9;">
							<td style="padding:14px 20px;">
								<p style="margin:0;font-weight:700;color:#0d2460;">{u.full_name ?? 'No name'}</p>
								<p style="margin:4px 0 0;font-size:13px;color:#64748b;">{u.email}</p>
							</td>
							<td style="padding:14px 20px;">
								<select
									value={u.role}
									on:change={(e) => updateUserRole(u.id, e.currentTarget.value)}
									style="padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;"
								>
									{#each ROLES as role}
										<option value={role}>{role}</option>
									{/each}
								</select>
							</td>
							<td style="padding:14px 20px;color:#64748b;font-size:14px;">
								{formatDate(u.created_at)}
							</td>
							<td style="padding:14px 20px;">
								<button
									class="reject"
									style="padding:8px 14px;font-size:13px;"
									on:click={() => removeUser(u.id)}
								>
									Remove
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

{#if contentToDelete}
	<div class="modal-overlay">
		<div class="modal-card">
			<div class="modal-icon-container">
				<svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
					<ellipse cx="50" cy="82" rx="25" ry="4" fill="#fde8e8" />
					<path d="M35 38L38 73C38.3 76 41 78 44 78H56C59 78 61.7 76 62 73L65 38H35Z" fill="#ff3b3b"/>
					<path d="M28 34C28 31.8 29.8 30 32 30H68C70.2 30 72 31.8 72 34C72 36.2 70.2 38 68 38H32C29.8 38 28 36.2 28 34Z" fill="#ff3b3b"/>
					<path d="M42 30V26C42 24.3 43.3 23 45 23H55C56.7 23 58 24.3 58 26V30" fill="none" stroke="#ff3b3b" stroke-width="5" stroke-linecap="round"/>
					<rect x="42" y="45" width="3" height="20" rx="1.5" fill="white"/>
					<rect x="48.5" y="45" width="3" height="20" rx="1.5" fill="white"/>
					<rect x="55" y="45" width="3" height="20" rx="1.5" fill="white"/>
					<path d="M22 35L28 35M25 32L25 38" stroke="#ff3b3b" stroke-width="2" stroke-linecap="round"/>
					<path d="M70 25L76 25M73 22L73 28" stroke="#ff3b3b" stroke-width="2" stroke-linecap="round"/>
					<circle cx="20" cy="50" r="1.5" fill="#ff3b3b"/>
					<circle cx="78" cy="45" r="1.5" fill="#ff3b3b"/>
					<circle cx="60" cy="18" r="1.5" fill="#ff3b3b"/>
				</svg>
			</div>
			<h3>Delete Content?</h3>
			<p>Your content will be permanently deleted and cannot be recovered.</p>
			<div class="modal-actions">
				<button class="btn-cancel" on:click={cancelDelete}>Cancel</button>
				<button class="btn-confirm" on:click={confirmDelete}>Delete</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal-card {
		background: white;
		padding: 32px 24px 24px;
		border-radius: 20px;
		width: 90%;
		max-width: 360px;
		text-align: center;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.modal-icon-container {
		margin-bottom: 20px;
		display: flex;
		justify-content: center;
	}
	@keyframes popIn {
		0% { transform: scale(0.9); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}
	.modal-card h3 {
		margin: 0 0 10px;
		color: #111827;
		font-size: 22px;
		font-weight: 700;
	}
	.modal-card p {
		color: #6b7280;
		margin: 0 0 28px;
		font-size: 14px;
		line-height: 1.5;
	}
	.modal-actions {
		display: flex;
		gap: 12px;
	}
	.btn-cancel {
		flex: 1;
		background: white;
		color: #16a34a;
		border: 1px solid #16a34a;
		padding: 12px 0;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		font-size: 15px;
		transition: 0.2s;
	}
	.btn-cancel:hover {
		background: #f0fdf4;
	}
	.btn-confirm {
		flex: 1;
		background: #fc3c44;
		color: white;
		border: 1px solid #fc3c44;
		padding: 12px 0;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		font-size: 15px;
		transition: 0.2s;
	}
	.btn-confirm:hover {
		background: #e11d48;
		border-color: #e11d48;
	}

	.dashboard {
		padding: 100px 40px 40px;
		background: #f4f9ff;
		min-height: 100vh;
		font-family: 'DM Sans', sans-serif;
	}
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
		gap: 10px;
		margin-bottom: 28px;
		flex-wrap: wrap;
	}
	.tabs button {
		background: white;
		border: 1px solid #d8e8fa;
		padding: 10px 18px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 700;
		color: #0155bd;
		transition: 0.2s;
		font-size: 14px;
	}
	.tabs button.active {
		background: #0155bd;
		color: white;
	}
	.badge {
		background: #ef4444;
		color: white;
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 11px;
		margin-left: 6px;
	}
	.analytics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		margin-bottom: 24px;
	}
	.stat-card {
		background: white;
		border-radius: 16px;
		padding: 24px 20px;
		border: 1px solid #e8eef7;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		border-top: 4px solid;
	}
	.stat-card.blue {
		border-top-color: #3b82f6;
	}
	.stat-card.yellow {
		border-top-color: #eab308;
	}
	.stat-card.purple {
		border-top-color: #9333ea;
	}
	.stat-card.green {
		border-top-color: #22c55e;
	}
	.stat-card.orange {
		border-top-color: #f97316;
	}
	.stat-card.red {
		border-top-color: #ef4444;
	}
	.stat-card.teal {
		border-top-color: #14b8a6;
	}
	.stat-card.pink {
		border-top-color: #ec4899;
	}
	.stat-card.indigo {
		border-top-color: #6366f1;
	}
	.stat-label {
		margin: 0 0 8px;
		font-size: 12px;
		font-weight: 700;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.stat-num {
		margin: 0;
		font-size: 36px;
		font-weight: 900;
		color: #0d2460;
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
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
	}
	.empty-card {
		text-align: center;
		padding: 40px;
		color: #64748b;
	}
	.heading {
		margin-bottom: 18px;
		font-size: 22px;
		color: #0d2460;
		font-weight: 800;
	}
	.request-card,
	.article-card {
		margin-bottom: 18px;
		cursor: pointer;
		transition: 0.2s;
	}
	.request-card:hover,
	.article-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 28px rgba(1, 85, 189, 0.12);
		border-color: #0155bd;
	}
	.article-card.selected {
		border-color: #0155bd;
		box-shadow: 0 0 0 2px #0155bd33;
	}
	.request-card h3,
	.article-card h3 {
		margin: 0 0 12px;
		color: #0d2460;
		font-size: 18px;
	}
	.request-card p,
	.article-card p {
		margin: 6px 0;
		line-height: 1.6;
		color: #475569;
		font-size: 14px;
	}
	.reason {
		margin-top: 14px;
		background: #f8fbff;
		padding: 14px;
		border-radius: 10px;
		border-left: 4px solid #0155bd;
		font-size: 14px;
		color: #475569;
	}
	.actions {
		display: flex;
		gap: 10px;
		margin-top: 20px;
		flex-wrap: wrap;
	}
	.status {
		display: inline-block;
		margin-top: 10px;
		padding: 5px 12px;
		border-radius: 999px;
		background: #dbeafe;
		color: #1d4ed8;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
	}
	.preview {
		position: sticky;
		top: 24px;
		min-height: 600px;
		overflow-y: auto;
		max-height: 85vh;
	}
	.preview h2 {
		margin: 0;
		font-size: 26px;
		color: #0d2460;
	}
	.subtitle {
		margin-top: 8px;
		color: #64748b;
		font-style: italic;
	}
	.section {
		margin-top: 24px;
		padding-top: 20px;
		border-top: 1px solid #edf2f7;
	}
	.section h4 {
		margin: 0 0 8px;
		font-size: 16px;
		font-weight: 800;
		color: #0d2460;
	}
	.section p {
		margin: 0;
		color: #475569;
		line-height: 1.8;
		white-space: pre-wrap;
		font-size: 14px;
	}
	.review-actions {
		display: flex;
		gap: 12px;
		margin-top: 24px;
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
		transition: 0.2s;
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
	.empty {
		min-height: 400px;
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
		font-size: 22px;
	}
	.empty p {
		max-width: 300px;
		line-height: 1.7;
	}
	@media (max-width: 1100px) {
		.layout {
			grid-template-columns: 1fr;
		}
		.preview {
			position: static;
			min-height: auto;
			max-height: none;
		}
	}
	@media (max-width: 700px) {
		.dashboard {
			padding: 80px 16px 24px;
		}
		.topbar {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
		.analytics-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		h1 {
			font-size: 24px;
		}
	}
</style>
