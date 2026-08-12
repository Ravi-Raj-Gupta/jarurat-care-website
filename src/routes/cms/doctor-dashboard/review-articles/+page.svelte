<script lang="ts">
	import { ClipboardCheck, CheckCircle, Clock } from 'lucide-svelte';

	export let data;

	// Only items waiting for reviewer action should appear here.
	$: reviewQueue = (data?.pendingArticles || [])
		.filter((article) => article.status === 'under_review')
		.map((article) => ({
			...article,
			type: 'Article'
		}))
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() -
				new Date(b.created_at).getTime()
		);

	function formatDate(dateStr: string) {
		if (!dateStr) return 'N/A';

		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Review Articles | Reviewer Portal</title>
</svelte:head>

<div class="review-page">
	<div class="header">
		<div class="header-content">
			<div class="title-row">
				<h1>Pending Articles Verification</h1>

				<span class="pill-badge bg-amber-pill">
					Reviewer Workspace
				</span>
			</div>

			<p>
				Review general health and medical articles submitted by peer
				doctors for clinical accuracy before publication.
			</p>
		</div>

		<div class="stats-badge">
			<ClipboardCheck size={20} class="text-amber" />

			<span>
				<strong>{reviewQueue.length}</strong>
				{reviewQueue.length === 1 ? ' Pending Article' : ' Pending Articles'}
			</span>
		</div>
	</div>

	<div class="card-container">
		{#if reviewQueue.length === 0}
			<div class="empty-state">
				<div class="empty-icon-box">
					<CheckCircle size={44} class="text-green" />
				</div>

				<h4>All verification tasks complete!</h4>

				<p>
					You are completely caught up! There are no medical articles
					awaiting your peer review sign-off right now.
				</p>
			</div>
		{:else}
			<div class="table-responsive">
				<table>
					<thead>
						<tr>
							<th>Document Title</th>
							<th>Category</th>
							<th>Author Name</th>
							<th>Submitted Date</th>
							<th>Status</th>
							<th class="text-right">Verification Action</th>
						</tr>
					</thead>

					<tbody>
						{#each reviewQueue as item}
							<tr>
								<td>
									<strong class="item-title">
										{item.title || 'Untitled Submission'}
									</strong>
								</td>

								<td>
									<span class="type-badge">
										{item.type}
									</span>
								</td>

								<td class="author-cell">
									{item.author_name ||
										item.profiles?.full_name ||
										'Dr. Peer'}
								</td>

								<td class="date-cell">
									<Clock size={13} class="inline-icon" />
									{formatDate(item.created_at)}
								</td>

								<td>
									<span class="status-badge status-pending">
										Under Review
									</span>
								</td>

								<td class="text-right">
									<a
										href={`/cms/review/article/${item.id}`}
										class="btn-review"
									>
										<ClipboardCheck size={14} />
										Review Article
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family:
			'DM Sans',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
	}

	.review-page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 1500px;
		margin: 0 auto;
		width: 100%;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 16px;
	}

	.header-content {
		min-width: 0;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 6px;
	}

	.header h1 {
		font-size: 24px;
		font-weight: 800;
		color: #0f172a;
		margin: 0;
	}

	.header p {
		color: #64748b;
		margin: 0;
		font-size: 14px;
	}

	.pill-badge {
		padding: 3px 10px;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.bg-amber-pill {
		background: #fef3c7;
		color: #d97706;
		border: 1px solid #fde68a;
	}

	.stats-badge {
		background: #fffbeb;
		border: 1px solid #fde68a;
		padding: 10px 18px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 10px;
		color: #92400e;
		font-size: 14px;
		white-space: nowrap;
	}

	.text-amber {
		color: #d97706;
	}

	.text-green {
		color: #16a34a;
	}

	.card-container {
		background: #ffffff;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
		overflow: hidden;
	}

	.table-responsive {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 13px;
	}

	th {
		padding: 14px 24px;
		color: #64748b;
		font-weight: 600;
		font-size: 12px;
		border-bottom: 1px solid #f1f5f9;
		white-space: nowrap;
	}

	td {
		padding: 16px 24px;
		border-bottom: 1px solid #f1f5f9;
		vertical-align: middle;
		white-space: nowrap;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: #f8fafc;
	}

	.item-title {
		font-size: 14px;
		font-weight: 700;
		color: #0f172a;
	}

	.type-badge {
		font-size: 11px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 6px;
		background: #eff6ff;
		color: #2563eb;
		border: 1px solid #dbeafe;
		white-space: nowrap;
	}

	.author-cell {
		font-size: 13px;
		color: #334155;
		font-weight: 600;
	}

	.date-cell {
		font-size: 12px;
		color: #64748b;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.inline-icon {
		color: #94a3b8;
	}

	.status-badge {
		font-size: 11px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 6px;
		white-space: nowrap;
	}

	.status-pending {
		background: #fef3c7;
		color: #d97706;
		border: 1px solid #fde68a;
	}

	.text-right {
		text-align: right;
	}

	.btn-review {
		background: #2563eb;
		color: #ffffff;
		padding: 8px 16px;
		border-radius: 6px;
		text-decoration: none;
		font-size: 12px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(37, 99, 235, 0.15);
	}

	.btn-review:hover {
		background: #1d4ed8;
		transform: translateY(-1px);
		box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
	}

	.empty-state {
		padding: 64px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.empty-icon-box {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: #f0fdf4;
		border: 1px solid #dcfce7;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
	}

	.empty-state h4 {
		font-size: 17px;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 8px;
	}

	.empty-state p {
		color: #64748b;
		margin: 0;
		font-size: 14px;
		max-width: 480px;
	}

	@media (max-width: 768px) {
		.review-page {
			gap: 18px;
		}

		.header h1 {
			font-size: 21px;
		}

		.stats-badge {
			width: 100%;
		}

		th,
		td {
			padding: 12px 16px;
		}
	}
</style>