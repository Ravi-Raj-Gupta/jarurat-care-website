<script lang="ts">
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import {
		MessageSquareQuote,
		CheckCircle,
		XCircle,
		Clock,
		AlertCircle,
		Search,
		Eye,
		RefreshCw,
		User,
		Calendar,
		X
	} from 'lucide-svelte';

	export let data;

	$: testimonials = data?.testimonials ?? [];

	let activeFilter = 'all';
	let searchTerm = '';

	let selectedTestimonial: any = null;
	let modalType: 'view' | 'changes' | 'reject' | null = null;

	let feedback = '';

	$: filteredTestimonials = testimonials.filter((testimonial: any) => {
		const matchesFilter =
			activeFilter === 'all' ||
			testimonial.status === activeFilter;

		const search = searchTerm.trim().toLowerCase();

		if (!search) {
			return matchesFilter;
		}

		const searchableText = [
			testimonial.author_name,
			testimonial.author_email,
			testimonial.author_designation,
			testimonial.content,
			testimonial.status
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return matchesFilter && searchableText.includes(search);
	});

	$: pendingCount = testimonials.filter(
		(t: any) => t.status === 'submitted'
	).length;

	$: publishedCount = testimonials.filter(
		(t: any) => t.status === 'published'
	).length;

	$: changesCount = testimonials.filter(
		(t: any) => t.status === 'changes_requested'
	).length;

	$: rejectedCount = testimonials.filter(
		(t: any) => t.status === 'rejected'
	).length;

	function openView(testimonial: any) {
		selectedTestimonial = testimonial;
		modalType = 'view';
	}

	function openChanges(testimonial: any) {
		selectedTestimonial = testimonial;
		feedback = '';
		modalType = 'changes';
	}

	function openReject(testimonial: any) {
		selectedTestimonial = testimonial;
		feedback = '';
		modalType = 'reject';
	}

	function closeModal() {
		selectedTestimonial = null;
		modalType = null;
		feedback = '';
	}

	function formatDate(date: string) {
		if (!date) return 'N/A';

		return new Date(date).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'submitted':
				return 'Pending Review';

			case 'published':
				return 'Published';

			case 'changes_requested':
				return 'Changes Requested';

			case 'rejected':
				return 'Rejected';

			default:
				return status || 'Unknown';
		}
	}

	function getStatusClass(status: string) {
		switch (status) {
			case 'submitted':
				return 'pending';

			case 'published':
				return 'published';

			case 'changes_requested':
				return 'changes';

			case 'rejected':
				return 'rejected';

			default:
				return 'default';
		}
	}

	function getInitials(name: string) {
		if (!name) return 'U';

		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part: string) => part.charAt(0).toUpperCase())
			.join('');
	}

	function truncateText(text: string, length = 180) {
		if (!text) return '';

		if (text.length <= length) {
			return text;
		}

		return text.slice(0, length).trim() + '...';
	}

	function handleActionResult() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				const action = result.data?.action;

				if (action === 'published') {
					toast.success('Testimonial published successfully.');
				} else if (action === 'rejected') {
					toast.success('Testimonial rejected.');
				} else if (action === 'changes_requested') {
					toast.success('Changes requested successfully.');
				} else {
					toast.success('Action completed successfully.');
				}

				closeModal();

				await update();
			} else {
				const message =
					result.data?.error ||
					'Something went wrong. Please try again.';

				toast.error(message);

				await update();
			}
		};
	}
</script>

<div class="page-container">
	<!-- HEADER -->
	<div class="page-header">
		<div>
			<div class="title-row">
				<div class="title-icon">
					<MessageSquareQuote size={22} />
				</div>

				<div>
					<h1>Testimonials</h1>
					<p>Review and manage testimonials submitted by readers.</p>
				</div>
			</div>
		</div>
	</div>

	<!-- STAT CARDS -->
	<div class="stats-grid">
		<button
			class="stat-card"
			class:selected={activeFilter === 'submitted'}
			on:click={() => (activeFilter = 'submitted')}
		>
			<div class="stat-icon pending-icon">
				<Clock size={20} />
			</div>

			<div class="stat-info">
				<span class="stat-number">{pendingCount}</span>
				<span class="stat-label">Pending Review</span>
			</div>
		</button>

		<button
			class="stat-card"
			class:selected={activeFilter === 'published'}
			on:click={() => (activeFilter = 'published')}
		>
			<div class="stat-icon published-icon">
				<CheckCircle size={20} />
			</div>

			<div class="stat-info">
				<span class="stat-number">{publishedCount}</span>
				<span class="stat-label">Published</span>
			</div>
		</button>

		<button
			class="stat-card"
			class:selected={activeFilter === 'changes_requested'}
			on:click={() => (activeFilter = 'changes_requested')}
		>
			<div class="stat-icon changes-icon">
				<RefreshCw size={20} />
			</div>

			<div class="stat-info">
				<span class="stat-number">{changesCount}</span>
				<span class="stat-label">Changes Requested</span>
			</div>
		</button>

		<button
			class="stat-card"
			class:selected={activeFilter === 'rejected'}
			on:click={() => (activeFilter = 'rejected')}
		>
			<div class="stat-icon rejected-icon">
				<XCircle size={20} />
			</div>

			<div class="stat-info">
				<span class="stat-number">{rejectedCount}</span>
				<span class="stat-label">Rejected</span>
			</div>
		</button>
	</div>

	<!-- TOOLBAR -->
	<div class="toolbar">
		<div class="filters">
			<button
				class:active={activeFilter === 'all'}
				on:click={() => (activeFilter = 'all')}
			>
				All
				<span>{testimonials.length}</span>
			</button>

			<button
				class:active={activeFilter === 'submitted'}
				on:click={() => (activeFilter = 'submitted')}
			>
				Pending
				<span>{pendingCount}</span>
			</button>

			<button
				class:active={activeFilter === 'published'}
				on:click={() => (activeFilter = 'published')}
			>
				Published
				<span>{publishedCount}</span>
			</button>

			<button
				class:active={activeFilter === 'changes_requested'}
				on:click={() => (activeFilter = 'changes_requested')}
			>
				Changes
				<span>{changesCount}</span>
			</button>

			<button
				class:active={activeFilter === 'rejected'}
				on:click={() => (activeFilter = 'rejected')}
			>
				Rejected
				<span>{rejectedCount}</span>
			</button>
		</div>

		<div class="search-box">
			<Search size={18} />
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search testimonials..."
			/>
		</div>
	</div>

	<!-- TESTIMONIAL LIST -->
	{#if filteredTestimonials.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<MessageSquareQuote size={34} />
			</div>

			<h2>No testimonials found</h2>

			<p>
				{searchTerm
					? 'No testimonials match your search.'
					: activeFilter === 'submitted'
						? 'There are no testimonials waiting for review.'
						: 'There are no testimonials in this category.'}
			</p>
		</div>
	{:else}
		<div class="testimonial-list">
			{#each filteredTestimonials as testimonial}
				<div class="testimonial-card">
					<!-- CARD TOP -->
					<div class="card-top">
						<div class="author-section">
							<div class="avatar">
								{#if testimonial.featured_image}
									<img
										src={testimonial.featured_image}
										alt={testimonial.author_name || 'User'}
									/>
								{:else}
									<span>
										{getInitials(testimonial.author_name)}
									</span>
								{/if}
							</div>

							<div class="author-info">
								<h3>
									{testimonial.author_name || 'Anonymous User'}
								</h3>

								{#if testimonial.author_designation}
									<p>{testimonial.author_designation}</p>
								{/if}

								<div class="meta">
									<span>
										<User size={13} />
										Reader
									</span>

									<span>
										<Calendar size={13} />
										{formatDate(testimonial.created_at)}
									</span>
								</div>
							</div>
						</div>

						<div
							class={`status-badge ${getStatusClass(testimonial.status)}`}
						>
							{#if testimonial.status === 'submitted'}
								<Clock size={14} />
							{:else if testimonial.status === 'published'}
								<CheckCircle size={14} />
							{:else if testimonial.status === 'changes_requested'}
								<RefreshCw size={14} />
							{:else if testimonial.status === 'rejected'}
								<XCircle size={14} />
							{:else}
								<AlertCircle size={14} />
							{/if}

							{getStatusLabel(testimonial.status)}
						</div>
					</div>

					<!-- CONTENT -->
					<div class="testimonial-content">
						<div class="quote-mark">“</div>

						<p>
							{truncateText(testimonial.content)}
						</p>
					</div>

					<!-- EXISTING FEEDBACK -->
					{#if testimonial.admin_feedback}
						<div class="feedback-preview">
							<div class="feedback-title">
								<AlertCircle size={15} />
								Admin Feedback
							</div>

							<p>{testimonial.admin_feedback}</p>
						</div>
					{/if}

					<!-- ACTIONS -->
					<div class="card-actions">
						<button
							class="view-btn"
							on:click={() => openView(testimonial)}
						>
							<Eye size={16} />
							View
						</button>

						{#if testimonial.status === 'submitted' || testimonial.status === 'changes_requested'}
							<form
								method="POST"
								action="?/publish"
								use:enhance={handleActionResult()}
							>
								<input
									type="hidden"
									name="testimonialId"
									value={testimonial.id}
								/>

								<button class="publish-btn" type="submit">
									<CheckCircle size={16} />
									Publish
								</button>
							</form>

							<button
								class="changes-btn"
								on:click={() => openChanges(testimonial)}
							>
								<RefreshCw size={16} />
								Request Changes
							</button>

							<button
								class="reject-btn"
								on:click={() => openReject(testimonial)}
							>
								<XCircle size={16} />
								Reject
							</button>
						{:else if testimonial.status === 'rejected'}
							<span class="no-action-text">
								Rejected
							</span>
						{:else if testimonial.status === 'published'}
							<span class="no-action-text published-text">
								Published
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- ============================================================
     MODAL
============================================================ -->

{#if modalType && selectedTestimonial}
	<div class="modal-backdrop" on:click={closeModal}>
		<div class="modal" on:click|stopPropagation>
			<!-- MODAL HEADER -->
			<div class="modal-header">
				<div>
					<h2>
						{#if modalType === 'view'}
							Testimonial Details
						{:else if modalType === 'changes'}
							Request Changes
						{:else}
							Reject Testimonial
						{/if}
					</h2>

					<p>
						{selectedTestimonial.author_name ||
							'Anonymous User'}
					</p>
				</div>

				<button class="close-btn" on:click={closeModal}>
					<X size={20} />
				</button>
			</div>

			<!-- VIEW MODAL -->
			{#if modalType === 'view'}
				<div class="view-modal-content">
					<div class="modal-author">
						<div class="large-avatar">
							{#if selectedTestimonial.featured_image}
								<img
									src={selectedTestimonial.featured_image}
									alt={selectedTestimonial.author_name || 'User'}
								/>
							{:else}
								<span>
									{getInitials(
										selectedTestimonial.author_name
									)}
								</span>
							{/if}
						</div>

						<div>
							<h3>
								{selectedTestimonial.author_name ||
									'Anonymous User'}
							</h3>

							{#if selectedTestimonial.author_designation}
								<p>
									{selectedTestimonial.author_designation}
								</p>
							{/if}

							<span class="reader-label">
								Reader
							</span>
						</div>
					</div>

					<div class="full-testimonial">
						<div class="quote-mark large">“</div>

						<p>
							{selectedTestimonial.content}
						</p>
					</div>

					<div class="detail-row">
						<span>Status</span>

						<strong>
							{getStatusLabel(selectedTestimonial.status)}
						</strong>
					</div>

					<div class="detail-row">
						<span>Submitted</span>

						<strong>
							{formatDate(selectedTestimonial.created_at)}
						</strong>
					</div>

					{#if selectedTestimonial.admin_feedback}
						<div class="existing-feedback">
							<strong>Admin Feedback</strong>
							<p>
								{selectedTestimonial.admin_feedback}
							</p>
						</div>
					{/if}
				</div>

				<div class="modal-footer">
					<button class="secondary-btn" on:click={closeModal}>
						Close
					</button>
				</div>
			{:else}
				<!-- ACTION MODAL -->
				<form
					method="POST"
					action={
						modalType === 'changes'
							? '?/requestChanges'
							: '?/reject'
					}
					use:enhance={handleActionResult()}
				>
					<input
						type="hidden"
						name="testimonialId"
						value={selectedTestimonial.id}
					/>

					<div class="action-description">
						<p>
							{#if modalType === 'changes'}
								Tell the reader what needs to be changed
								before this testimonial can be published.
							{:else}
								Please provide a reason for rejecting this
								testimonial.
							{/if}
						</p>
					</div>

					<div class="form-group">
						<label for="feedback">
							{#if modalType === 'changes'}
								Feedback
							{:else}
								Reason for rejection
							{/if}
						</label>

						<textarea
							id="feedback"
							name="feedback"
							bind:value={feedback}
							placeholder={
								modalType === 'changes'
									? 'Example: Please provide more details about your experience...'
									: 'Please explain why this testimonial cannot be published...'
							}
							rows="6"
							required
						></textarea>
					</div>

					<div class="modal-footer">
						<button
							type="button"
							class="secondary-btn"
							on:click={closeModal}
						>
							Cancel
						</button>

						<button
							type="submit"
							class:changes-submit={modalType === 'changes'}
							class:reject-submit={modalType === 'reject'}
							disabled={!feedback.trim()}
						>
							{#if modalType === 'changes'}
								<RefreshCw size={16} />
								Request Changes
							{:else}
								<XCircle size={16} />
								Reject Testimonial
							{/if}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}

<style>
	.page-container {
		width: 100%;
		max-width: 1500px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 26px;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.title-icon {
		width: 46px;
		height: 46px;
		border-radius: 12px;
		background: #e8f1ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.page-header h1 {
		margin: 0 0 4px;
		font-size: 28px;
		font-weight: 800;
		color: #0f172a;
	}

	.page-header p {
		margin: 0;
		color: #64748b;
		font-size: 14px;
	}

	/* STATS */

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 24px;
	}

	.stat-card {
		border: 1px solid #e2e8f0;
		background: white;
		border-radius: 14px;
		padding: 18px;
		display: flex;
		align-items: center;
		gap: 14px;
		cursor: pointer;
		text-align: left;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			border-color 0.15s ease;
	}

	.stat-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 5px 18px rgba(15, 23, 42, 0.07);
	}

	.stat-card.selected {
		border-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08);
	}

	.stat-icon {
		width: 42px;
		height: 42px;
		border-radius: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.pending-icon {
		background: #fff7ed;
		color: #ea580c;
	}

	.published-icon {
		background: #ecfdf5;
		color: #059669;
	}

	.changes-icon {
		background: #eff6ff;
		color: #2563eb;
	}

	.rejected-icon {
		background: #fef2f2;
		color: #dc2626;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat-number {
		font-size: 22px;
		font-weight: 800;
		color: #0f172a;
	}

	.stat-label {
		font-size: 12px;
		color: #64748b;
		font-weight: 600;
	}

	/* TOOLBAR */

	.toolbar {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		padding: 12px;
		margin-bottom: 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
	}

	.filters {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
	}

	.filters button {
		border: none;
		background: transparent;
		color: #64748b;
		padding: 8px 11px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.filters button:hover {
		background: #f1f5f9;
		color: #0f172a;
	}

	.filters button.active {
		background: #e8f1ff;
		color: #2563eb;
	}

	.filters button span {
		font-size: 11px;
		background: #e2e8f0;
		color: #475569;
		padding: 2px 6px;
		border-radius: 999px;
	}

	.filters button.active span {
		background: #dbeafe;
		color: #2563eb;
	}

	.search-box {
		width: 270px;
		height: 38px;
		border: 1px solid #e2e8f0;
		border-radius: 9px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 11px;
		color: #94a3b8;
	}

	.search-box input {
		border: none;
		outline: none;
		width: 100%;
		font-size: 13px;
		color: #0f172a;
		background: transparent;
	}

	/* LIST */

	.testimonial-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.testimonial-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 20px;
		transition: box-shadow 0.2s ease;
	}

	.testimonial-card:hover {
		box-shadow: 0 6px 22px rgba(15, 23, 42, 0.06);
	}

	.card-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
	}

	.author-section {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.avatar,
	.large-avatar {
		overflow: hidden;
		background: #e8f1ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		flex-shrink: 0;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}

	.avatar img,
	.large-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.author-info h3 {
		margin: 0 0 3px;
		font-size: 15px;
		color: #0f172a;
		font-weight: 700;
	}

	.author-info p {
		margin: 0 0 5px;
		font-size: 12px;
		color: #64748b;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #94a3b8;
		font-size: 11px;
	}

	.meta span {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.status-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 700;
		white-space: nowrap;
	}

	.status-badge.pending {
		background: #fff7ed;
		color: #c2410c;
	}

	.status-badge.published {
		background: #ecfdf5;
		color: #047857;
	}

	.status-badge.changes {
		background: #eff6ff;
		color: #1d4ed8;
	}

	.status-badge.rejected {
		background: #fef2f2;
		color: #b91c1c;
	}

	.status-badge.default {
		background: #f1f5f9;
		color: #475569;
	}

	.testimonial-content {
		margin: 18px 0 15px;
		padding: 16px 20px 16px 38px;
		background: #f8fafc;
		border-radius: 12px;
		position: relative;
	}

	.quote-mark {
		position: absolute;
		left: 14px;
		top: 7px;
		font-size: 36px;
		line-height: 1;
		color: #2563eb;
		font-family: Georgia, serif;
	}

	.testimonial-content p {
		margin: 0;
		color: #475569;
		font-size: 14px;
		line-height: 1.7;
	}

	.feedback-preview {
		margin-bottom: 15px;
		padding: 12px 14px;
		border-radius: 10px;
		background: #fffbeb;
		border: 1px solid #fde68a;
	}

	.feedback-title {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #92400e;
		font-size: 12px;
		font-weight: 700;
		margin-bottom: 5px;
	}

	.feedback-preview p {
		margin: 0;
		color: #78350f;
		font-size: 12px;
		line-height: 1.5;
	}

	.card-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.card-actions form {
		margin: 0;
	}

	.card-actions button {
		height: 34px;
		padding: 0 12px;
		border-radius: 8px;
		border: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
	}

	.view-btn {
		background: #f1f5f9;
		color: #475569;
	}

	.view-btn:hover {
		background: #e2e8f0;
	}

	.publish-btn {
		background: #16a34a;
		color: white;
	}

	.publish-btn:hover {
		background: #15803d;
	}

	.changes-btn {
		background: #eff6ff;
		color: #2563eb;
	}

	.changes-btn:hover {
		background: #dbeafe;
	}

	.reject-btn {
		background: #fef2f2;
		color: #dc2626;
	}

	.reject-btn:hover {
		background: #fee2e2;
	}

	.no-action-text {
		font-size: 12px;
		font-weight: 700;
		color: #94a3b8;
		padding-left: 4px;
	}

	.published-text {
		color: #16a34a;
	}

	/* EMPTY */

	.empty-state {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 70px 30px;
		text-align: center;
	}

	.empty-icon {
		width: 68px;
		height: 68px;
		margin: 0 auto 16px;
		border-radius: 50%;
		background: #eff6ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty-state h2 {
		margin: 0 0 7px;
		font-size: 19px;
		color: #0f172a;
	}

	.empty-state p {
		margin: 0;
		color: #64748b;
		font-size: 13px;
	}

	/* MODAL */

	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(15, 23, 42, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.modal {
		width: 100%;
		max-width: 620px;
		max-height: calc(100vh - 40px);
		overflow-y: auto;
		background: white;
		border-radius: 18px;
		box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
	}

	.modal-header {
		padding: 20px 22px;
		border-bottom: 1px solid #e2e8f0;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 15px;
	}

	.modal-header h2 {
		margin: 0 0 4px;
		font-size: 18px;
		color: #0f172a;
	}

	.modal-header p {
		margin: 0;
		font-size: 12px;
		color: #64748b;
	}

	.close-btn {
		width: 34px;
		height: 34px;
		border: none;
		border-radius: 8px;
		background: #f1f5f9;
		color: #64748b;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.close-btn:hover {
		background: #e2e8f0;
		color: #0f172a;
	}

	.view-modal-content {
		padding: 22px;
	}

	.modal-author {
		display: flex;
		align-items: center;
		gap: 13px;
		margin-bottom: 20px;
	}

	.large-avatar {
		width: 58px;
		height: 58px;
		border-radius: 50%;
	}

	.modal-author h3 {
		margin: 0 0 3px;
		font-size: 16px;
		color: #0f172a;
	}

	.modal-author p {
		margin: 0 0 5px;
		color: #64748b;
		font-size: 12px;
	}

	.reader-label {
		font-size: 10px;
		font-weight: 700;
		color: #2563eb;
		background: #eff6ff;
		padding: 3px 7px;
		border-radius: 999px;
	}

	.full-testimonial {
		background: #f8fafc;
		border-radius: 12px;
		padding: 20px 20px 20px 38px;
		position: relative;
		margin-bottom: 20px;
	}

	.full-testimonial p {
		margin: 0;
		font-size: 14px;
		line-height: 1.75;
		color: #334155;
		white-space: pre-wrap;
	}

	.quote-mark.large {
		font-size: 42px;
		left: 13px;
		top: 10px;
	}

	.detail-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 11px 0;
		border-bottom: 1px solid #f1f5f9;
		font-size: 13px;
	}

	.detail-row span {
		color: #64748b;
	}

	.detail-row strong {
		color: #0f172a;
	}

	.existing-feedback {
		margin-top: 18px;
		padding: 13px;
		border-radius: 10px;
		background: #fffbeb;
		border: 1px solid #fde68a;
	}

	.existing-feedback strong {
		display: block;
		margin-bottom: 5px;
		font-size: 12px;
		color: #92400e;
	}

	.existing-feedback p {
		margin: 0;
		font-size: 12px;
		line-height: 1.5;
		color: #78350f;
	}

	.action-description {
		padding: 20px 22px 0;
	}

	.action-description p {
		margin: 0;
		font-size: 13px;
		line-height: 1.6;
		color: #64748b;
	}

	.form-group {
		padding: 18px 22px 5px;
	}

	.form-group label {
		display: block;
		margin-bottom: 8px;
		font-size: 13px;
		font-weight: 700;
		color: #334155;
	}

	.form-group textarea {
		width: 100%;
		resize: vertical;
		min-height: 130px;
		padding: 11px 12px;
		border: 1px solid #cbd5e1;
		border-radius: 9px;
		outline: none;
		font-family: inherit;
		font-size: 13px;
		line-height: 1.5;
		color: #0f172a;
		box-sizing: border-box;
	}

	.form-group textarea:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.modal-footer {
		padding: 16px 22px 20px;
		display: flex;
		justify-content: flex-end;
		gap: 9px;
		border-top: 1px solid #e2e8f0;
	}

	.modal-footer button {
		height: 38px;
		padding: 0 15px;
		border: none;
		border-radius: 8px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
	}

	.secondary-btn {
		background: #f1f5f9;
		color: #475569;
	}

	.secondary-btn:hover {
		background: #e2e8f0;
	}

	.changes-submit {
		background: #2563eb;
		color: white;
	}

	.changes-submit:hover {
		background: #1d4ed8;
	}

	.reject-submit {
		background: #dc2626;
		color: white;
	}

	.reject-submit:hover {
		background: #b91c1c;
	}

	.modal-footer button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* RESPONSIVE */

	@media (max-width: 1100px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 0;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			width: 100%;
			box-sizing: border-box;
		}

		.card-top {
			flex-direction: column;
		}

		.status-badge {
			align-self: flex-start;
		}
	}

	@media (max-width: 500px) {
		.card-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.card-actions button,
		.card-actions form,
		.card-actions form button {
			width: 100%;
		}
	}
</style>