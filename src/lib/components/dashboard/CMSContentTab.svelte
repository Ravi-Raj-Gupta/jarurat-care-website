<script lang="ts">
	import { cmsSupabase } from '$lib/cmsSupabase';
	import RichTextEditor from '$lib/components/RichEditor.svelte';
	import toast from 'svelte-french-toast';

	export let cmsContents: any[] = [];
	export let reloadCallback: () => Promise<void>;
	export let filterType: string | null = null;

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
		excerpt?: string;
		tags?: string[];
		featured_image?: string;
		seo_title?: string;
		seo_description?: string;
		published_at?: string;
	};

	const CONTENT_TYPES = ['blog', 'news', 'event', 'faq', 'campaign'];

	const typeColors: Record<string, string> = {
		blog: '#3b82f6',
		news: '#10b981',
		event: '#f59e0b',
		faq: '#8b5cf6',
		campaign: '#ef4444'
	};

	let contentToDelete: string | null = null;
	let showContentForm = false;
	let contentType = filterType || 'blog';
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
	let editingContent: CMSContent | null = null;

	let contentSearch = '';
	let contentSort = 'newest';

	$: if (contentTitle && !editingContent) {
		contentSlug = contentTitle
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
	}

	$: filteredContents = cmsContents
		.filter((c) => {
			if (filterType && c.content_type !== filterType) return false;
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

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
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
	}

	function startEdit(content: any) {
		editingContent = content;
		showContentForm = true;
		contentType = content.content_type;
		contentTitle = content.title;
		contentSlug = content.slug;
		contentExcerpt = content.excerpt || '';
		contentBody = content.content;
		contentCategory = content.category || '';
		contentTags = content.tags ? content.tags.join(', ') : '';
		seoTitle = content.seo_title || '';
		seoDescription = content.seo_description || '';
		contentStatus = content.status;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function togglePublish(content: any) {
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
			toast.success('Content published successfully!');
		} else {
			toast.success('Content moved to draft.');
		}

		await reloadCallback();
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

		toast.success('Content saved successfully!');
		resetContentForm();
		await reloadCallback();
	}

	async function updateContent() {
		if (!contentTitle.trim() || !contentBody.trim()) {
			toast.error('Title and content are required');
			return;
		}
		if (!editingContent) return;
		savingContent = true;

		let imageUrl = editingContent.featured_image;
		// Handle new image upload if selected during edit
		if (featuredImage) {
			const fileName = `${Date.now()}-${featuredImage.name}`;
			const { error: uploadError } = await cmsSupabase.storage
				.from('cms-images')
				.upload(fileName, featuredImage);
			if (!uploadError) {
				const { data } = cmsSupabase.storage.from('cms-images').getPublicUrl(fileName);
				imageUrl = data.publicUrl;
			} else {
				toast.error('Failed to upload new image.');
			}
		}

		const { error } = await cmsSupabase
			.from('cms_content')
			.update({
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
				status: contentStatus,
				updated_at: new Date().toISOString()
			})
			.eq('id', editingContent.id);

		savingContent = false;
		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success('Content updated!');
		resetContentForm();
		await reloadCallback();
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
		await reloadCallback();
	}
</script>

<div class="cms-container">
	<div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center;">
		<input
			bind:value={contentSearch}
			placeholder="Search CMS content..."
			class="search-input"
		/>
		<select bind:value={contentSort} class="sort-select">
			<option value="newest">Newest First</option>
			<option value="oldest">Oldest First</option>
			<option value="alphabetical">Alphabetical</option>
			<option value="recently_updated">Recently Updated</option>
		</select>
		<div style="margin-left:auto;">
			<button class="primary-btn" on:click={() => {
				if(showContentForm) {
					resetContentForm();
				} else {
					showContentForm = true;
				}
			}}>
				{showContentForm ? '✕ Cancel' : '+ Create Content'}
			</button>
		</div>
	</div>

	{#if showContentForm}
		<div class="form-card">
			<h3 class="form-title">
				{editingContent ? 'Edit Content' : 'Create New Content'}
			</h3>

			{#if !filterType}
			<div class="content-types-wrap">
				{#each CONTENT_TYPES as type}
					<button
						on:click={() => (contentType = type)}
						class="type-btn {contentType === type ? 'active' : ''}"
						style="--active-color: {typeColors[type]}"
					>
						{type}
					</button>
				{/each}
			</div>
			{/if}

			<div class="form-group">
				<label for="content-title">Title *</label>
				<input id="content-title" bind:value={contentTitle} placeholder="Title *" />
			</div>

			<div class="form-group">
				<label for="content-slug">Slug *</label>
				<input id="content-slug" bind:value={contentSlug} placeholder="auto-generated-from-title" />
				<small>URL: /{contentType}/{contentSlug}</small>
			</div>

			<div class="form-group">
				<label for="content-category">Category (optional)</label>
				<input id="content-category" bind:value={contentCategory} placeholder="Category" />
			</div>

			<div class="form-group">
				<label for="content-excerpt">Short Description / Excerpt</label>
				<textarea id="content-excerpt" bind:value={contentExcerpt} rows="3" placeholder="Write a short summary..."></textarea>
			</div>

			<div class="form-group">
				<label for="content-tags">Tags</label>
				<input id="content-tags" bind:value={contentTags} placeholder="cancer, awareness, health" />
			</div>

			<div class="form-group">
				<label>Content *</label>
				<div class="rich-text-wrapper">
					<RichTextEditor
						content={contentBody}
						placeholder="Write your content..."
						on:update={(e) => (contentBody = e.detail)}
					/>
				</div>
			</div>

			<div class="form-group">
				<label>Featured Image</label>
				<input type="file" accept="image/*" on:change={(e) => (featuredImage = e.currentTarget.files?.[0] ?? null)} />
				{#if featuredImage}
					<p class="file-name">Selected: {featuredImage.name}</p>
				{:else if editingContent?.featured_image}
					<p class="file-name">Current image: <a href={editingContent.featured_image} target="_blank">View image</a></p>
				{/if}
			</div>

			{#if !editingContent}
				<div class="form-group">
					<label>Publish Date</label>
					<input type="datetime-local" bind:value={publishDate} />
				</div>
			{/if}

			<h3 class="seo-title">SEO Settings</h3>

			<div class="form-group">
				<input bind:value={seoTitle} placeholder="SEO Title" />
			</div>

			<div class="form-group">
				<textarea bind:value={seoDescription} rows="3" placeholder="SEO Description"></textarea>
			</div>

			<div class="status-buttons">
				<button class="status-btn {contentStatus === 'draft' ? 'active-draft' : ''}" on:click={() => (contentStatus = 'draft')}>
					Draft
				</button>
				<button class="status-btn {contentStatus === 'published' ? 'active-published' : ''}" on:click={() => (contentStatus = 'published')}>
					Published
				</button>
			</div>

			<button
				class="save-btn"
				on:click={editingContent ? updateContent : saveContent}
				disabled={savingContent}
			>
				{savingContent ? 'Saving...' : editingContent ? 'Update Content' : 'Save Content'}
			</button>
		</div>
	{/if}

	{#if cmsContents.length === 0}
		<div class="empty-state">No content yet. Create some!</div>
	{:else if filteredContents.length === 0}
		<div class="empty-state">No content matches your search.</div>
	{:else}
		<div class="content-list">
			{#each filteredContents as content}
				<div class="content-card">
					<div class="content-info">
						<div class="badges">
							<span class="badge type-badge" style="background: {typeColors[content.content_type] ?? '#94a3b8'}">
								{content.content_type}
							</span>
							<span class="badge status-badge {content.status}">
								{content.status}
							</span>
						</div>
						<h4>{content.title}</h4>
						<p>/{content.slug} · {formatDate(content.created_at)}</p>
					</div>
					<div class="content-actions">
						<button class="action-btn edit" on:click={() => startEdit(content)}>Edit</button>
						<button class="action-btn {content.status === 'published' ? 'unpublish' : 'publish'}" on:click={() => togglePublish(content)}>
							{content.status === 'published' ? 'Unpublish' : 'Publish'}
						</button>
						<button class="action-btn delete" on:click={() => promptDelete(content.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if contentToDelete}
	<div class="modal-overlay" on:click={cancelDelete}>
		<div class="modal-content" on:click|stopPropagation>
			<h3>Delete Content?</h3>
			<p>Are you sure you want to delete this content? This action cannot be undone.</p>
			<div class="modal-actions">
				<button class="cancel-btn" on:click={cancelDelete}>Cancel</button>
				<button class="confirm-btn" on:click={confirmDelete}>Yes, Delete</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.cms-container {
		font-family: 'DM Sans', sans-serif;
	}

	.search-input, .sort-select {
		padding: 10px 16px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		outline: none;
		background: white;
	}

	.search-input {
		flex: 1;
		min-width: 200px;
	}

	.primary-btn {
		padding: 10px 20px;
		background: #1e40af;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.primary-btn:hover {
		background: #1e3a8a;
	}

	.form-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
		margin-bottom: 24px;
	}

	.form-title {
		margin: 0 0 20px;
		color: #1e293b;
		font-size: 20px;
	}

	.content-types-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 20px;
	}

	.type-btn {
		padding: 8px 16px;
		border-radius: 20px;
		border: 2px solid #e2e8f0;
		background: white;
		color: #64748b;
		font-weight: 600;
		cursor: pointer;
		text-transform: capitalize;
		transition: all 0.2s;
	}

	.type-btn.active {
		border-color: var(--active-color);
		background: var(--active-color);
		color: white;
	}

	.form-group {
		margin-bottom: 16px;
	}

	.form-group label {
		display: block;
		margin-bottom: 6px;
		font-weight: 600;
		font-size: 14px;
		color: #334155;
	}

	.form-group input, .form-group textarea, .form-group select {
		width: 100%;
		padding: 12px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 15px;
		font-family: inherit;
		box-sizing: border-box;
	}

	.form-group textarea {
		resize: vertical;
	}

	.form-group small {
		display: block;
		margin-top: 4px;
		color: #64748b;
		font-size: 12px;
	}

	.file-name {
		margin-top: 8px;
		color: #16a34a;
		font-size: 14px;
	}

	.rich-text-wrapper {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		overflow: hidden;
	}

	.seo-title {
		margin: 24px 0 16px;
		color: #1e293b;
		font-size: 18px;
	}

	.status-buttons {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
	}

	.status-btn {
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		background: #f1f5f9;
		color: #64748b;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.status-btn.active-draft {
		background: #475569;
		color: white;
	}

	.status-btn.active-published {
		background: #16a34a;
		color: white;
	}

	.save-btn {
		padding: 12px 24px;
		background: #1e40af;
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		width: 100%;
		font-size: 16px;
	}

	.save-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.empty-state {
		background: white;
		padding: 40px;
		text-align: center;
		border-radius: 12px;
		color: #64748b;
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
	}

	.content-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.content-card {
		background: white;
		padding: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.03);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
		flex-wrap: wrap;
	}

	.badges {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	.badge {
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.badge.type-badge {
		color: white;
	}

	.badge.status-badge {
		background: #f1f5f9;
		color: #64748b;
	}

	.badge.status-badge.published {
		background: #dcfce7;
		color: #16a34a;
	}

	.content-info h4 {
		margin: 0 0 4px;
		color: #1e293b;
		font-size: 18px;
	}

	.content-info p {
		margin: 0;
		color: #64748b;
		font-size: 13px;
	}

	.content-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.action-btn {
		padding: 8px 16px;
		border-radius: 8px;
		border: none;
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.action-btn.edit {
		background: #eff6ff;
		color: #1d4ed8;
	}

	.action-btn.edit:hover { background: #dbeafe; }

	.action-btn.publish {
		background: #dcfce7;
		color: #16a34a;
	}

	.action-btn.publish:hover { background: #bbf7d0; }

	.action-btn.unpublish {
		background: #fef9c3;
		color: #ca8a04;
	}

	.action-btn.unpublish:hover { background: #fef08a; }

	.action-btn.delete {
		background: #fee2e2;
		color: #ef4444;
	}

	.action-btn.delete:hover { background: #fecaca; }

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		padding: 24px;
		border-radius: 12px;
		width: 90%;
		max-width: 400px;
	}

	.modal-content h3 { margin: 0 0 12px; }
	.modal-content p { color: #64748b; margin-bottom: 24px; }

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	.cancel-btn, .confirm-btn {
		padding: 10px 16px;
		border-radius: 8px;
		border: none;
		font-weight: 600;
		cursor: pointer;
	}

	.cancel-btn { background: #f1f5f9; color: #475569; }
	.confirm-btn { background: #ef4444; color: white; }
</style>
