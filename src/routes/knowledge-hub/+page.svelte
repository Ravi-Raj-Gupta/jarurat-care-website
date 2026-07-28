<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/nav.svelte';
	import NewsFooter from '$lib/components/news-footer.svelte';
	import { goto } from '$app/navigation';
	import { Search, LayoutGrid, List, ChevronRight, X, ArrowLeft } from 'lucide-svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import toast from 'svelte-french-toast';
 
	type ContentItem = {
		id: string;
		title: string;
		subtitle?: string;
		excerpt: string;
		content: string;
		thumbnail: string;
		category: string;
		type: 'article' | 'research' | 'blog' | 'news' | 'event' | 'faq' | 'testimonials' | 'campaign';
		date: string;
		author: string;
		// Article specific fields
		abstract?: string;
		introduction?: string;
		methods?: string;
		results?: string;
		discussion?: string;
		conclusion?: string;
		funding?: string;
		ethics_statement?: string;
		acknowledgements?: string;
	};
 
	const TYPE_LABELS: Record<string, string> = {
		article: 'Article',
		research: 'Research Article',
		blog: 'Blog',
		news: 'News',
		event: 'Event',
		faq: 'FAQ',
		testimonials: 'Testimonial',
		campaign: 'Campaign'
	};
 
	const TYPE_COLORS: Record<string, string> = {
		article: '#2563EB',
		research: '#0155bd',
		blog: '#7c3aed',
		news: '#0891b2',
		event: '#16a34a',
		faq: '#d97706',
		testimonials: '#db2777',
		campaign: '#dc2626'
	};
 
	const DEFAULT_IMAGE_COUNTS: Record<string, number> = {
		article: 8,
		blog: 2,
		campaign: 3,
		event: 3,
		faq: 3,
		news: 3,
		testimonials: 3
	};

	const FOLDER_MAP: Record<string, string> = {
		article: 'Articles',
		blog: 'Blogs',
		campaign: 'Campaign',
		event: 'Events',
		faq: 'FAQs',
		news: 'News',
		testimonials: 'Testimonials'
	};

	function getDefaultThumbnail(type: string, id: string | number) {
		const safeType = type || 'article';
		const count = DEFAULT_IMAGE_COUNTS[safeType] || 1;
		const folder = FOLDER_MAP[safeType] || 'Articles';
		
		let numId = 0;
		if (typeof id === 'number') {
			numId = id;
		} else if (typeof id === 'string') {
			for (let i = 0; i < id.length; i++) {
				numId = (numId << 5) - numId + id.charCodeAt(i);
				numId |= 0; // Convert to 32bit integer
			}
			numId = Math.abs(numId);
		}
		
		const index = (numId % count) + 1;
		const filePrefix = safeType === 'research' ? 'article' : safeType;
		return `/defaults/${folder}/${filePrefix}-${index}.jpeg`;
	}
 
	let allContent: ContentItem[] = [];
	export let data: any;
	
	// Ensure data.publications maps to allContent
	$: allContent = data.publications || [];

	let selectedItem: ContentItem | null = null;
	let loading = false;
	let errorMsg = '';
 
	let searchQuery = '';
	let activeFilter = 'all';
	let viewMode: 'grid' | 'list' = 'grid';
	let sortBy: 'date' | 'date_asc' | 'title' | 'title_desc' = 'date';
 
	const PAGE_SIZE = 9;
	let currentPage = 1;
 
	let isLoggedIn = false;
	let userRole = '';
 
	async function logout() {
		toast.success('Logged out successfully');
		userRole = '';
		isLoggedIn = false;
		await goto('/knowledge-hub', { invalidateAll: true });
		cmsSupabase.auth.signOut();
	}
 
	const FILTERS = [
		{ label: 'All', value: 'all' },
		{ label: 'Articles', value: 'article' },
		{ label: 'Research', value: 'research' },
		{ label: 'Blog', value: 'blog' },
		{ label: 'News', value: 'news' },
		{ label: 'Events', value: 'event' },
		{ label: 'FAQ', value: 'faq' },
		{ label: 'Testimonials', value: 'testimonials' },
		{ label: 'Campaign', value: 'campaign' }
	];
 
	function stripHtml(html: string) {
		return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	}
 
	function makeExcerpt(text: string, max = 160) {
		const plain = stripHtml(text);
		return plain.length > max ? plain.slice(0, max) + '…' : plain;
	}
 
	function formatDate(d: string) {
		if (!d) return '';
		return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
	}
 
	onMount(async () => {
		// Initialize local saves from backend data
		if (data.savedArticleIds) {
			data.savedArticleIds.forEach((id: string) => {
				localSaves[id] = true;
			});
		}

		const { data: { user } } = await cmsSupabase.auth.getUser();
		if (user) {
			isLoggedIn = true;
			const { data: profile } = await cmsSupabase
				.from('profiles')
				.select('role')
				.eq('id', user.id)
				.single();
			userRole = profile?.role || 'user';
		}
 
		cmsSupabase.auth.onAuthStateChange(async (event, session) => {
			isLoggedIn = !!session?.user;
			if (session?.user) {
				const { data: profile } = await cmsSupabase
					.from('profiles')
					.select('role')
					.eq('id', session.user.id)
					.single();
				userRole = profile?.role || 'user';
			} else {
				userRole = '';
			}
		});
	});
 
	$: filtered = allContent.filter(item => {
		const matchFilter = activeFilter === 'all' || item.type === activeFilter;
		const q = searchQuery.toLowerCase();
		const matchSearch = !q || item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q);
		return matchFilter && matchSearch;
	});
 
	$: sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'title_desc') return b.title.localeCompare(a.title);
    if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    return new Date(b.date).getTime() - new Date(a.date).getTime();
});
 
	$: totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
	$: paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	$: if (currentPage > totalPages) currentPage = 1;
 
	let localLikes: Record<string, boolean> = {};
	let localSaves: Record<string, boolean> = {};

	import { applyAction, deserialize } from '$app/forms';

	async function toggleSave(e: Event, item: any) {
		e.stopPropagation();
		if (!isLoggedIn) {
			toast.error('Please login to save articles!');
			return;
		}

		const isSaved = localSaves[item.id] || false;
		// Optimistic update
		localSaves[item.id] = !isSaved;

		const dataForm = new FormData();
		dataForm.append('articleId', item.id);
		dataForm.append('isSaved', String(isSaved));

		try {
			const response = await fetch('?/toggleSave', {
				method: 'POST',
				body: dataForm,
				headers: { 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await response.text());
			if (result.type === 'success') {
				toast.success(localSaves[item.id] ? 'Saved for later! 🔖' : 'Removed from saved items');
			} else {
				// Revert on error
				localSaves[item.id] = isSaved;
				toast.error('Failed to save article.');
			}
		} catch(err) {
			localSaves[item.id] = isSaved;
			toast.error('Network error saving article.');
		}
	}

	function toggleLike(e: Event, item: any) {
		e.stopPropagation();
		localLikes[item.id] = !localLikes[item.id];
		if (localLikes[item.id]) {
			toast.success('Liked! ❤️');
		}
	}

	function shareArticle(e: Event, item: any) {
		e.stopPropagation();
		const url = `${window.location.origin}/content/${item.type}/${item.slug || item.id}`;
		navigator.clipboard.writeText(url).then(() => {
			toast.success('Link copied to clipboard!');
		});
	}

	function openItem(item: any) {
		if (item.slug || item.id) {
			goto(`/content/${item.type}/${item.slug || item.id}`);
		} else {
			toast.error('Publication link is missing.');
		}
	}
 
	function closeItem() {
		selectedItem = null;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>
 
<svelte:head>
    <title>Community — Jarurat Care Foundation</title>
    <meta name="description" content="Explore research articles, blogs, news, events, FAQs and more from Jarurat Care Foundation. Your one-stop hub for health knowledge." />
    <meta name="keywords" content="jarurat care, health articles, cancer research, blogs, news, events, FAQ, health knowledge" />
    <meta property="og:title" content="Community — Jarurat Care Foundation" />
    <meta property="og:description" content="Explore research, blogs, news and events from Jarurat Care Foundation." />
    <meta property="og:type" content="website" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://jarurat.care/knowledge-hub" />
</svelte:head>
 
<Nav />
 
<div class="hub">
	<div class="container relative">
 
				{#if selectedItem}
			<!-- Detail View -->
			<section class="detail">
				<button class="back-btn" on:click={closeItem}>
					<ArrowLeft size={14} /> Back to Community
				</button>
 
				<article class="detail-card">
					<div class="detail-hero">
						<img src={selectedItem.thumbnail} alt={selectedItem.title} class="detail-img" />
						<div class="detail-overlay">
							<span class="type-badge" style="background:{TYPE_COLORS[selectedItem.type] || '#0155bd'}">
								{TYPE_LABELS[selectedItem.type] || selectedItem.type}
							</span>
						</div>
					</div>
 
					<div class="detail-body">
						<h1 class="detail-title">{selectedItem.title}</h1>
						{#if selectedItem.subtitle}
							<p class="detail-subtitle">{selectedItem.subtitle}</p>
						{/if}
						<div class="detail-meta">
							<span>✍️ {selectedItem.author}</span>
							<span>📅 {selectedItem.date}</span>
						</div>
 
						<div class="detail-content">
							{#if selectedItem.type === 'article'}
								{#if selectedItem.abstract}
									<div class="content-section">
										<h2>Abstract</h2>
										<div>{@html selectedItem.abstract}</div>
									</div>
								{/if}
								{#if selectedItem.introduction}
									<div class="content-section">
										<h2>Introduction</h2>
										<div>{@html selectedItem.introduction}</div>
									</div>
								{/if}
								{#if selectedItem.methods}
									<div class="content-section">
										<h2>Methods</h2>
										<div>{@html selectedItem.methods}</div>
									</div>
								{/if}
								{#if selectedItem.results}
									<div class="content-section">
										<h2>Results</h2>
										<div>{@html selectedItem.results}</div>
									</div>
								{/if}
								{#if selectedItem.discussion}
									<div class="content-section">
										<h2>Discussion</h2>
										<div>{@html selectedItem.discussion}</div>
									</div>
								{/if}
								{#if selectedItem.conclusion}
									<div class="content-section">
										<h2>Conclusion</h2>
										<div>{@html selectedItem.conclusion}</div>
									</div>
								{/if}
								{#if selectedItem.funding}
									<div class="content-section">
										<h2>Funding</h2>
										<div>{@html selectedItem.funding}</div>
									</div>
								{/if}
								{#if selectedItem.acknowledgements}
									<div class="content-section">
										<h2>Acknowledgements</h2>
										<div>{@html selectedItem.acknowledgements}</div>
									</div>
								{/if}
							{:else if selectedItem.type === 'testimonials'}
								<p class="prose" style="font-style:italic;font-size:1.15rem;color:#374151;">
									"{selectedItem.content}"
								</p>
							{:else}
								<div class="prose">{@html selectedItem.content}</div>
							{/if}
						</div>
					</div>
				</article>
			</section>
 
		{:else}
			<!-- List View -->
			<header class="hub-header flex flex-col md:flex-row justify-between items-start gap-6 mb-8 mt-2">
				<div>
					<p class="hub-eyebrow">Jarurat Care</p>
					<h1 class="hub-title">Community</h1>
					<p class="hub-desc">Explore research, blogs, news, events and more — all in one place.</p>
				</div>
				<div class="flex-shrink-0">
					{#if isLoggedIn}
						<div class="flex items-center gap-2">
							<a
								href={userRole === 'Super_Admin' || userRole === 'Admin' ? '/cms/admin-dashboard' : (userRole === 'Doctor' ? '/cms/doctor-dashboard' : '/cms/reader-dashboard')}
								class="bg-[#0155bd] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#004085] transition-colors text-center whitespace-nowrap"
							>
								Dashboard
							</a>
							<button
								on:click={logout}
								class="bg-white border border-[#D8E8FA] text-[#0D2460] px-6 py-2.5 rounded-xl text-sm font-bold hover:border-red-500 hover:text-red-500 transition-colors text-center whitespace-nowrap"
							>
								Logout
							</button>
						</div>
					{:else}
						<div class="flex items-center gap-2">
							<a
								href="/cms/login"
								class="bg-[#0155bd] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#004085] transition-colors text-center"
							>
								Login
							</a>
							<a
								href="/cms/signup"
								class="bg-white border border-[#D8E8FA] text-[#0d2460] px-6 py-2.5 rounded-xl text-sm font-bold hover:border-[#0155bd] transition-colors text-center"
							>
								Register
							</a>
						</div>
					{/if}
				</div>
			</header>
 
			<!-- Filter Tabs -->
			<div class="filters">
				{#each FILTERS as f}
					<button
						class="filter-btn {activeFilter === f.value ? 'active' : ''}"
						on:click={() => { activeFilter = f.value; currentPage = 1; }}
					>
						{f.label}
						{#if f.value !== 'all'}
							<span class="filter-count">
								({allContent.filter(c => c.type === f.value).length})
							</span>
						{/if}
					</button>
				{/each}
			</div>
 
			<!-- Search + Sort + View -->
			<div class="toolbar">
				<div class="search-wrap">
					<Search size={15} class="search-icon" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search community..."
						class="search-input"
						on:input={() => currentPage = 1}
					/>
					{#if searchQuery}
						<button class="clear-search" on:click={() => { searchQuery = ''; currentPage = 1; }}>
							<X size={14} />
						</button>
					{/if}
				</div>
 
				<select bind:value={sortBy} class="sort-select">
                    <option value="date">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="title">A – Z</option>
                    <option value="title_desc">Z – A</option>
                </select>
 
				<div class="view-toggle">
					<button class="view-btn {viewMode === 'grid' ? 'active' : ''}" on:click={() => viewMode = 'grid'}>
						<LayoutGrid size={14} />
					</button>
					<button class="view-btn {viewMode === 'list' ? 'active' : ''}" on:click={() => viewMode = 'list'}>
						<List size={14} />
					</button>
				</div>
			</div>
 
			<!-- Content -->
			{#if loading}
				<div class="loading-grid">
					{#each Array(6) as _}
						<div class="skeleton"></div>
					{/each}
				</div>
 
			{:else if errorMsg}
				<div class="empty-state">
					<p>{errorMsg}</p>
				</div>
 
			{:else if sorted.length === 0}
				<div class="empty-state">
					<p style="font-size:2rem;">🔍</p>
					<h3>No content found</h3>
					<p>Try a different filter or search term.</p>
					<button on:click={() => { searchQuery = ''; activeFilter = 'all'; }} class="filter-btn active">
						Clear Filters
					</button>
				</div>
 
			{:else if viewMode === 'grid'}
				<div class="content-grid">
					{#each paged as item}
						<article
							class="content-card"
							on:click={() => openItem(item)}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && openItem(item)}
						>
							<div class="card-img-wrap">
								<img src={item.thumbnail} alt={item.title} class="card-img" loading="lazy" />
								<span class="card-type-badge" style="background:{TYPE_COLORS[item.type] || '#0155bd'}">
									{TYPE_LABELS[item.type] || item.type}
								</span>
							</div>
							<div class="card-body">
								<p class="card-date">{item.date}</p>
								<h3 class="card-title">{item.title}</h3>
								<p class="card-excerpt">{item.excerpt}</p>
								<div class="card-footer">
									<span class="card-author">{item.author}</span>
									<div class="pub-actions">
										<button class="action-icon" class:liked={localLikes[item.id]} on:click={(e) => toggleLike(e, item)} aria-label="Like">
											<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill={localLikes[item.id] ? "currentColor" : "none"} stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
										</button>
										<button class="action-icon" on:click={(e) => shareArticle(e, item)} aria-label="Share">
											<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
										</button>
										<button class="action-icon" class:saved={localSaves[item.id]} on:click={(e) => toggleSave(e, item)} aria-label="Save">
											<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill={localSaves[item.id] ? "currentColor" : "none"} stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
										</button>
										<span class="card-read">Read →</span>
									</div>
								</div>
							</div>
						</article>
					{/each}
				</div>
 
			{:else}
				<div class="list-view">
					{#each paged as item}
						<div
							class="list-item"
							on:click={() => openItem(item)}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && openItem(item)}
						>
							<img src={item.thumbnail} alt={item.title} class="list-thumb" loading="lazy" />
							<div class="list-body">
								<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
									<span class="card-type-badge" style="background:{TYPE_COLORS[item.type] || '#0155bd'};position:static;font-size:9px;">
										{TYPE_LABELS[item.type] || item.type}
									</span>
									<span class="card-date" style="margin:0">{item.date}</span>
								</div>
								<h3 class="list-title">{item.title}</h3>
								<p class="card-excerpt">{item.excerpt}</p>
							</div>
							<div class="list-actions" style="display:flex;align-items:center;gap:12px;margin-left:auto;">
								<div class="pub-actions" style="display:flex;gap:6px;">
									<button class="action-icon" class:liked={localLikes[item.id]} on:click={(e) => toggleLike(e, item)} aria-label="Like">
										<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill={localLikes[item.id] ? "currentColor" : "none"} stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
									</button>
									<button class="action-icon" on:click={(e) => shareArticle(e, item)} aria-label="Share">
										<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
									</button>
									<button class="action-icon" class:saved={localSaves[item.id]} on:click={(e) => toggleSave(e, item)} aria-label="Save">
										<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill={localSaves[item.id] ? "currentColor" : "none"} stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
									</button>
								</div>
								<ChevronRight size={16} class="list-arrow" />
							</div>
						</div>
					{/each}
				</div>
			{/if}
 
			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="pagination">
					<button
						class="page-btn"
						disabled={currentPage === 1}
						on:click={() => currentPage--}
					>← Prev</button>
					<span class="page-info">{currentPage} / {totalPages}</span>
					<button
						class="page-btn"
						disabled={currentPage === totalPages}
						on:click={() => currentPage++}
					>Next →</button>
				</div>
			{/if}
		{/if}
 
	</div>
 
	<div class="footer-wrap">
		<NewsFooter />
	</div>
</div>
 
<style>
	.hub {
		min-height: 100vh;
		background: #f4f9ff;
		font-family: 'DM Sans', sans-serif;
	}
 
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 120px 24px 60px;
	}
 
	/* Header */
	.hub-header { margin-bottom: 32px; }
	.hub-eyebrow { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: #78c520; margin: 0 0 8px; }
	.hub-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; color: #0d2460; margin: 0 0 12px; font-family: 'Arial', sans-serif; }
	.hub-desc { color: #5b6780; font-size: 1rem; max-width: 600px; }
 
	/* Filters */
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 24px;
	}
 
	.filter-btn {
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid #d8e8fa;
		background: white;
		color: #374151;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
 
	.filter-btn:hover { border-color: #0155bd; color: #0155bd; }
	.filter-btn.active { background: #0155bd; color: white; border-color: #0155bd; }
	.filter-count { font-size: 11px; opacity: 0.7; }
 
	/* Toolbar */
	.toolbar {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-bottom: 28px;
		flex-wrap: wrap;
	}
 
	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 200px;
	}
 
	.search-input {
		width: 100%;
		padding: 10px 36px 10px 36px;
		border: 1px solid #d8e8fa;
		border-radius: 999px;
		font-size: 14px;
		outline: none;
		background: white;
		color: #0d2460;
		box-sizing: border-box;
	}
 
	.search-input:focus { border-color: #0155bd; }
 
	:global(.search-icon) { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
 
	.clear-search {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: #94a3b8;
		padding: 2px;
	}
 
	.sort-select {
		padding: 10px 14px;
		border: 1px solid #d8e8fa;
		border-radius: 999px;
		font-size: 13px;
		font-weight: 600;
		color: #0d2460;
		background: white;
		outline: none;
		cursor: pointer;
	}
 
	.view-toggle { display: flex; gap: 4px; background: white; border: 1px solid #d8e8fa; border-radius: 999px; padding: 4px; }
	.view-btn { background: none; border: none; padding: 6px 8px; border-radius: 999px; cursor: pointer; color: #94a3b8; transition: all 0.2s; }
	.view-btn.active { background: #0155bd; color: white; }
 
	/* Grid */
	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
		margin-bottom: 40px;
	}
 
	.content-card {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid #e8eef7;
		cursor: pointer;
		transition: transform 0.25s, box-shadow 0.25s;
		display: flex;
		flex-direction: column;
	}
 
	.content-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 40px rgba(1,85,189,0.12);
		border-color: #0155bd;
	}
 
	.card-img-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; }
	.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
	.content-card:hover .card-img { transform: scale(1.05); }
 
	.card-type-badge {
		position: absolute;
		top: 12px;
		left: 12px;
		padding: 4px 10px;
		border-radius: 999px;
		font-size: 10px;
		font-weight: 800;
		text-transform: uppercase;
		color: white;
		letter-spacing: 0.05em;
	}
 
	.card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
	.card-date { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin: 0 0 8px; letter-spacing: 0.1em; }
	.card-title { font-size: 17px; font-weight: 800; color: #0d2460; margin: 0 0 10px; line-height: 1.35; font-family: 'DM Serif Display', serif; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.card-excerpt { font-size: 13px; color: #4b5563; line-height: 1.7; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
	.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f0f6fd; margin-top: auto; }
	.card-author { font-size: 11px; font-weight: 700; color: #94a3b8; }
	.card-read { font-size: 12px; font-weight: 800; color: #0155bd; }
 
	/* List View */
	.list-view { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
 
	.list-item {
		background: white;
		border-radius: 16px;
		border: 1px solid #e8eef7;
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 16px;
		cursor: pointer;
		transition: all 0.2s;
	}
 
	.list-item:hover { border-color: #0155bd; box-shadow: 0 8px 24px rgba(1,85,189,0.08); }
 
	.list-thumb { width: 80px; height: 60px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
	.list-body { flex: 1; min-width: 0; }
	.list-title { font-size: 15px; font-weight: 800; color: #0d2460; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	:global(.list-arrow) { color: #c7ddf7; flex-shrink: 0; }
 
	/* Loading */
	.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
	.skeleton { background: linear-gradient(90deg, #f0f4ff 25%, #e8eef7 50%, #f0f4ff 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 20px; height: 320px; }
	@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
 
	/* Empty */
	.empty-state { text-align: center; padding: 80px 20px; color: #6b7280; }
	.empty-state h3 { color: #0d2460; font-size: 24px; margin-bottom: 8px; }
 
	/* Detail */
	.detail { max-width: 860px; margin: 0 auto; }
 
	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid #d8e8fa;
		background: white;
		color: #0d2460;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		margin-bottom: 24px;
		transition: all 0.2s;
	}
 
	.back-btn:hover { border-color: #0155bd; color: #0155bd; }
 
	.detail-card { background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e8eef7; box-shadow: 0 20px 50px rgba(1,85,189,0.08); }
 
	.detail-hero { position: relative; aspect-ratio: 21/9; overflow: hidden; }
	.detail-img { width: 100%; height: 100%; object-fit: cover; }
	.detail-overlay { position: absolute; bottom: 16px; left: 16px; }
 
	.type-badge { padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: white; letter-spacing: 0.1em; }
 
	.detail-body { padding: 40px; }
	.detail-title { font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 900; color: #0d2460; margin: 0 0 8px; font-family: 'DM Serif Display', serif; line-height: 1.2; }
	.detail-subtitle { color: #6b7280; font-style: italic; font-size: 1.1rem; margin: 0 0 16px; }
	.detail-meta { display: flex; gap: 20px; color: #6b7280; font-size: 13px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e8eef7; }
 
	.detail-content { line-height: 1.9; color: #374151; font-size: 1.02rem; }
 
	.content-section { margin-bottom: 32px; }
	.content-section h2 { font-size: 1.4rem; font-weight: 800; color: #0d2460; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e8eef7; }
 
	.prose { line-height: 1.9; }
 
	/* Pagination */
	.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 40px; }
	.page-btn { padding: 8px 18px; border-radius: 999px; border: 1px solid #d8e8fa; background: white; color: #0d2460; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
	.page-btn:hover:not(:disabled) { border-color: #0155bd; color: #0155bd; }
	.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
	.page-info { font-size: 13px; font-weight: 700; color: #6b7280; }
 
	/* Footer */
	.footer-wrap { margin-top: 60px; }
 
	@media (max-width: 768px) {
		.container { padding: 100px 16px 40px; }
		.content-grid { grid-template-columns: 1fr; }
		.toolbar { flex-direction: column; align-items: stretch; }
		.search-wrap { min-width: unset; }
	}
	.pub-actions {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.action-icon {
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		padding: 6px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.action-icon:hover {
		background: #f3f4f6;
		color: #4b5563;
	}

	.action-icon.liked {
		color: #ef4444;
	}
</style>