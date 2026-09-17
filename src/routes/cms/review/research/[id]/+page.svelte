<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, CheckCircle, XCircle, AlertCircle, X, Check } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	export let data;
	export let form;
	const { research } = data;

	let showRejectForm = false;
	let rejectReason = '';

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Review Research | {research.title}</title>
</svelte:head>

<div class="review-container">
	<!-- BACK NAVIGATION -->
	<a href="/cms/doctor-dashboard/review-research" class="back-link">
		<ArrowLeft size={16} />
		Back to Pending Research
	</a>

	<!-- PAPER CONTENT -->
	<div class="paper-content">
		<div class="paper-header">
			<h1>{research.title}</h1>
			{#if research.subtitle}
				<h2>{research.subtitle}</h2>
			{/if}

			<div class="meta">
				<span class="author">By {research.author_name}</span>
				<span class="date">{formatDate(research.created_at)}</span>
			</div>
		</div>

		{#if research.abstract}
			<section class="research-section abstract">
				<h3>Abstract</h3>
				<div class="whitespace-pre-line">{research.abstract}</div>
			</section>
		{/if}

		{#if research.introduction}
			<section class="research-section">
				<h3>Introduction</h3>
				<div class="whitespace-pre-line">{research.introduction}</div>
			</section>
		{/if}

		{#if research.literature_review}
			<section class="research-section">
				<h3>Literature Review</h3>
				<div class="whitespace-pre-line">{research.literature_review}</div>
			</section>
		{/if}

		{#if research.methods}
			<section class="research-section">
				<h3>Methods</h3>
				<div class="whitespace-pre-line">{research.methods}</div>
			</section>
		{/if}

		{#if research.results}
			<section class="research-section">
				<h3>Results</h3>
				<div class="whitespace-pre-line">{research.results}</div>
			</section>
		{/if}

		{#if research.discussion}
			<section class="research-section">
				<h3>Discussion</h3>
				<div class="whitespace-pre-line">{research.discussion}</div>
			</section>
		{/if}

		{#if research.conclusion}
			<section class="research-section">
				<h3>Conclusion</h3>
				<div class="whitespace-pre-line">{research.conclusion}</div>
			</section>
		{/if}

		{#if research.references_text}
			<section class="research-section">
				<h3>References</h3>
				<div class="whitespace-pre-line">{research.references_text}</div>
			</section>
		{/if}
	</div>

	<!-- Floating Action Bar -->
	{#if research.status === 'under_review'}
		<div class="glass-action-bar">
			<div class="action-bar-inner">
				<div class="action-info">
					<span class="status-dot"></span>
					<span class="status-text">Pending Review</span>
				</div>
				
				<div class="action-buttons">
					<button 
						type="button"
						class="btn-reject"
						on:click={() => showRejectForm = !showRejectForm}
					>
						{#if showRejectForm}
							<X size={18} /> Cancel
						{:else}
							<AlertCircle size={18} /> Request Changes
						{/if}
					</button>

					<form method="POST" action="?/approveResearch" use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'redirect' || result.type === 'success') {
								toast.success('Research Paper successfully approved!');
							} else {
								toast.error(Object(result).data?.message || 'Could not approve research paper');
							}
							await update();
						};
					}} class="inline-form">
						<input type="hidden" name="researchId" value={research.id} />
						<button type="submit" class="btn-approve" disabled={showRejectForm}>
							<Check size={18} />
							Approve Publication
						</button>
					</form>
				</div>
			</div>

			{#if showRejectForm}
				<div class="reject-popover" transition:slide={{ duration: 300, axis: 'y' }}>
					<form method="POST" action="?/rejectResearch" use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'redirect' || result.type === 'success') {
								toast.success('Feedback submitted successfully');
							} else {
								toast.error(Object(result).data?.message || 'Could not request changes');
							}
							await update();
						};
					}}>
						<input type="hidden" name="researchId" value={research.id} />
						
						<div class="form-header">
							<h4>Request Changes</h4>
							<p>Provide specific feedback for the researcher to improve this paper.</p>
						</div>

						<textarea
							name="feedback"
							placeholder="E.g., The methodology section lacks detail on the sample size..."
							required
							rows="4"
						></textarea>
						
						<div class="form-footer">
							<button type="submit" class="btn-submit-reject">
								Send Feedback
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.review-container {
		max-width: 900px;
		margin: 40px auto;
		padding: 0 20px;
		font-family: 'DM Sans', sans-serif;
		padding-bottom: 100px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #64748b;
		text-decoration: none;
		font-weight: 600;
		margin-bottom: 24px;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #0f172a;
	}

	.paper-content {
		background: #ffffff;
		border-radius: 12px;
		padding: 40px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
		border: 1px solid #e2e8f0;
		margin-bottom: 30px;
	}

	.paper-header {
		margin-bottom: 40px;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 30px;
	}

	.paper-header h1 {
		font-size: 32px;
		font-weight: 800;
		color: #0f172a;
		margin: 0 0 12px 0;
		line-height: 1.3;
	}

	.paper-header h2 {
		font-size: 20px;
		color: #475569;
		margin: 0 0 20px 0;
		font-weight: 500;
	}

	.meta {
		display: flex;
		gap: 16px;
		color: #64748b;
		font-size: 14px;
	}

	.meta .author {
		font-weight: 600;
		color: #334155;
	}

	.research-section {
		margin-bottom: 36px;
	}

	.research-section h3 {
		font-size: 20px;
		font-weight: 700;
		color: #1e293b;
		margin: 0 0 16px 0;
	}

	.research-section div {
		font-size: 16px;
		line-height: 1.8;
		color: #334155;
	}

	.abstract {
		background: #f8fafc;
		padding: 24px;
		border-radius: 8px;
		border-left: 4px solid #3b82f6;
	}

	.action-bar {
		margin-top: 32px;
		background: #f8fafc;
		border-radius: 12px;
		padding: 24px;
		border: 1px solid #e2e8f0;
	}

	.success-message {
		margin-top: 32px;
		background: #ecfdf5;
		color: #059669;
		padding: 40px;
		border-radius: 12px;
		border: 1px solid #a7f3d0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.success-message h3 {
		margin: 0;
		font-size: 24px;
	}

	.btn-return {
		margin-top: 16px;
		padding: 12px 24px;
		background: #059669;
		color: #ffffff;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-return:hover {
		background: #047857;
	}

	.error-message {
		background: #fee2e2;
		color: #b91c1c;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-weight: 500;
	}

	/* Glassmorphic Action Bar */
	.glass-action-bar {
		position: fixed;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 800px;
		padding: 0 20px;
	}

	.action-bar-inner {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.5);
		border-radius: 100px;
		padding: 12px 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05);
		font-family: 'Inter', sans-serif;
	}

	.action-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #f59e0b;
		box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
		70% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
		100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
	}

	.status-text {
		font-size: 14px;
		font-weight: 600;
		color: #57534e;
		white-space: nowrap;
	}

	.action-buttons {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.btn-reject {
		display: flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		color: #ef4444;
		border: none;
		font-size: 14px;
		font-weight: 600;
		padding: 10px 16px;
		border-radius: 50px;
		cursor: pointer;
		transition: background 0.2s;
		white-space: nowrap;
	}

	.btn-reject:hover {
		background: #fef2f2;
	}

	.btn-approve {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #10b981;
		color: white;
		border: none;
		font-size: 14px;
		font-weight: 600;
		padding: 10px 20px;
		border-radius: 50px;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
		white-space: nowrap;
	}

	.btn-approve:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
	}

	.btn-approve:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	/* Reject Popover */
	.reject-popover {
		margin-top: 16px;
		background: white;
		border-radius: 20px;
		padding: 24px;
		width: 100%;
		box-shadow: 0 20px 40px rgba(0,0,0,0.1);
		border: 1px solid #fee2e2;
		font-family: 'Inter', sans-serif;
	}

	.form-header {
		margin-bottom: 16px;
	}

	.form-header h4 {
		font-size: 16px;
		font-weight: 700;
		color: #991b1b;
		margin: 0 0 4px 0;
	}

	.form-header p {
		font-size: 13px;
		color: #7f1d1d;
		margin: 0;
	}

	.reject-popover textarea {
		width: 100%;
		border: 1px solid #fecaca;
		border-radius: 12px;
		padding: 12px 16px;
		font-family: inherit;
		font-size: 14px;
		resize: vertical;
		outline: none;
		background: #fef2f2;
		color: #7f1d1d;
		transition: border-color 0.2s;
	}

	.reject-popover textarea:focus {
		border-color: #ef4444;
		background: white;
	}

	.form-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 16px;
	}

	.btn-submit-reject {
		background: #ef4444;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 12px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-submit-reject:hover:not(:disabled) {
		background: #dc2626;
	}

	.btn-submit-reject:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.inline-form {
		margin: 0;
		display: inline-block;
	}

	@media (max-width: 640px) {
		.action-bar-inner {
			flex-direction: column;
			gap: 16px;
			border-radius: 20px;
			padding: 16px;
		}

		.action-buttons {
			width: 100%;
			justify-content: stretch;
		}

		.btn-reject, .btn-approve {
			flex: 1;
			justify-content: center;
		}
	}

	.whitespace-pre-line {
		white-space: pre-line;
	}
</style>
