<script lang="ts">
	import { 
		Bookmark, Search, BookOpen, FileText, 
		ArrowRight, Trash2, ExternalLink
	} from 'lucide-svelte';
	
	export let data;

	$: allSaved = data.savedArticlesAndResearch || [];
	
	let searchQuery = '';
	let activeTab = 'all'; // 'all', 'article', 'research'

	$: filteredArticles = allSaved.filter((item) => {
		const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
							  item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTab = activeTab === 'all' || item.type === activeTab;
		return matchesSearch && matchesTab;
	});

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

<svelte:head>
	<title>Saved Articles | Doctor Dashboard</title>
</svelte:head>

<div class="page-container">
	<!-- HEADER SECTION -->
	<div class="header-section">
		<div class="header-content">
			<div class="icon-wrapper">
				<Bookmark size={28} />
			</div>
			<div>
				<h1>Saved Knowledge</h1>
				<p>Your personal collection of bookmarked medical articles and research papers.</p>
			</div>
		</div>
		<div class="header-actions">
			<a href="/knowledge-hub" class="btn-browse">
				<Search size={16} />
				Discover More
			</a>
		</div>
	</div>

	<!-- CONTROLS SECTION -->
	<div class="controls-section">
		<div class="tabs">
			<button class:active={activeTab === 'all'} on:click={() => activeTab = 'all'}>
				All Items ({allSaved.length})
			</button>
			<button class:active={activeTab === 'article'} on:click={() => activeTab = 'article'}>
				<FileText size={16} /> Articles
			</button>
			<button class:active={activeTab === 'research'} on:click={() => activeTab = 'research'}>
				<BookOpen size={16} /> Research Papers
			</button>
		</div>

		<div class="search-box">
			<div class="search-icon-wrapper">
				<Search size={16} />
			</div>
			<input type="text" placeholder="Search saved items..." bind:value={searchQuery} />
		</div>
	</div>

	<!-- CONTENT GRID -->
	{#if filteredArticles.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<Bookmark size={48} />
			</div>
			<h3>No items found</h3>
			{#if searchQuery}
				<p>No saved articles match your search "<strong>{searchQuery}</strong>".</p>
				<button class="btn-clear" on:click={() => searchQuery = ''}>Clear Search</button>
			{:else}
				<p>You haven't saved any {activeTab === 'all' ? 'items' : activeTab + 's'} yet.</p>
				<a href="/knowledge-hub" class="btn-primary">Browse Knowledge Hub</a>
			{/if}
		</div>
	{:else}
		<div class="items-list">
			{#each filteredArticles as item}
				<div class="item-row group">
					<div class="row-icon" class:research-icon={item.type === 'research'}>
						{#if item.type === 'research'}
							<BookOpen size={24} />
						{:else}
							<FileText size={24} />
						{/if}
					</div>

					<div class="row-content">
						<h3 class="title">{item.title}</h3>
						<div class="meta">
							<span class="author">By {item.authorName}</span>
							<span class="dot">•</span>
							<span class="category">{item.category}</span>
							<span class="dot">•</span>
							<span class="save-time">Saved {timeAgo(item.savedAt)}</span>
						</div>
					</div>

					<div class="row-actions">
						<button class="btn-icon" title="Remove from saved">
							<Trash2 size={18} />
						</button>
						<a 
							href={item.type === 'research' ? `/content/research/${item.id}` : `/content/${item.type}/${item.slug || item.id}`} 
							class="btn-read"
						>
							Read Now <ArrowRight size={16} class="arrow" />
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family: 'DM Sans', sans-serif;
	}

	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	/* HEADER */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 24px;
		background: #ffffff;
		padding: 32px;
		border-radius: 16px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 20px -10px rgba(0, 0, 0, 0.05);
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.icon-wrapper {
		width: 64px;
		height: 64px;
		border-radius: 16px;
		background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.5);
	}

	.header-content h1 {
		font-size: 28px;
		font-weight: 800;
		color: #0f172a;
		margin: 0 0 4px 0;
	}

	.header-content p {
		color: #64748b;
		margin: 0;
		font-size: 15px;
	}

	.btn-browse {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		background: #ffffff;
		color: #0f172a;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
		border-radius: 100px;
		border: 1px solid #cbd5e1;
		transition: all 0.2s ease;
	}

	.btn-browse:hover {
		background: #f8fafc;
		border-color: #94a3b8;
		transform: translateY(-1px);
	}

	/* CONTROLS (TABS & SEARCH) */
	.controls-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	.tabs {
		display: flex;
		background: #f1f5f9;
		padding: 4px;
		border-radius: 10px;
		gap: 4px;
	}

	.tabs button {
		background: transparent;
		border: none;
		padding: 10px 20px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		color: #64748b;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s;
	}

	.tabs button:hover {
		color: #334155;
	}

	.tabs button.active {
		background: #ffffff;
		color: #0f172a;
		box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);
	}

	.search-box {
		position: relative;
		width: 300px;
	}

	.search-icon-wrapper {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #94a3b8;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.search-box input {
		width: 100%;
		padding: 12px 12px 12px 40px;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		background: #ffffff;
		font-size: 14px;
		transition: all 0.2s;
		outline: none;
	}

	.search-box input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* LIST ROWS */
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.item-row {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 20px 24px;
		display: flex;
		align-items: center;
		gap: 20px;
		transition: all 0.2s ease;
		box-shadow: 0 2px 10px -4px rgba(0,0,0,0.02);
	}

	.item-row:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.08);
		border-color: #cbd5e1;
	}

	.row-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0fdf4;
		color: #16a34a;
		flex-shrink: 0;
	}

	.row-icon.research-icon {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.row-content {
		flex: 1;
		min-width: 0;
	}

	.title {
		font-size: 18px;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 6px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		font-size: 14px;
		color: #64748b;
	}

	.author {
		font-weight: 500;
		color: #334155;
	}

	.dot {
		color: #cbd5e1;
	}

	.row-actions {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-left: auto;
	}

	.btn-read {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		color: #0f172a;
		padding: 10px 20px;
		border-radius: 8px;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.btn-read:hover {
		background: #0f172a;
		color: #ffffff;
		border-color: #0f172a;
	}

	.btn-icon {
		background: transparent;
		border: 1px solid transparent;
		color: #94a3b8;
		cursor: pointer;
		padding: 10px;
		border-radius: 8px;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-icon:hover {
		color: #ef4444;
		background: #fef2f2;
		border-color: #fecaca;
	}

	/* EMPTY STATE */
	.empty-state {
		background: #ffffff;
		border: 1px dashed #cbd5e1;
		border-radius: 16px;
		padding: 60px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.empty-icon {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #f1f5f9;
		color: #94a3b8;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 8px;
	}

	.empty-state h3 {
		font-size: 20px;
		font-weight: 700;
		color: #0f172a;
		margin: 0;
	}

	.empty-state p {
		color: #64748b;
		margin: 0 0 16px 0;
		max-width: 400px;
	}

	.btn-primary {
		background: #0f172a;
		color: #ffffff;
		text-decoration: none;
		padding: 12px 24px;
		border-radius: 100px;
		font-weight: 600;
		font-size: 15px;
		transition: all 0.2s;
	}

	.btn-primary:hover {
		background: #334155;
		transform: translateY(-2px);
	}

	.btn-clear {
		background: #f1f5f9;
		border: none;
		padding: 10px 20px;
		border-radius: 100px;
		color: #475569;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-clear:hover {
		background: #e2e8f0;
	}
</style>
