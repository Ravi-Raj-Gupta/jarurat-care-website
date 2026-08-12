<script lang="ts">
	import { ShieldCheck, CheckCircle, Clock } from 'lucide-svelte';

	export let data;

	// Only research papers waiting for reviewer action
	$: reviewQueue = (data?.pendingResearch || [])
		.filter((research) => research.status === 'under_review')
		.map((research) => ({
			...research,
			type: 'Research Paper'
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
	<title>Review Research Papers | Reviewer Portal</title>
</svelte:head>

<div class="review-page">
	<div class="header">
		<div class="header-content">
			<div class="title-row">
				<h1>Pending Research Papers Verification</h1>

				<span class="pill-badge bg-purple-pill">
					Reviewer Workspace
				</span>
			</div>

			<p>
				Review clinical research trials, statistical evidence, and
				academic research manuscripts before final publication.
			</p>
		</div>

		<div class="stats-badge">
			<ShieldCheck size={20} class="text-purple" />

			<span>
				<strong>{reviewQueue.length}</strong>
				{reviewQueue.length === 1
					? ' Pending Research Paper'
					: ' Pending Research Papers'}
			</span>
		</div>
	</div>

	<div class="card-container">
		{#if reviewQueue.length === 0}
			<div class="empty-state">
				<div class="empty-icon-box">
					<CheckCircle size={44} class="text-green" />
				</div>

				<h4>All research verifications complete!</h4>

				<p>
					You are completely caught up! There are no clinical research
					manuscripts awaiting peer review right now.
				</p>
			</div>
		{:else}
			<div class="table-responsive">
				<table>
					<thead>
						<tr>
							<th>Research Manuscript Title</th>
							<th>Category</th>
							<th>Lead Author</th>
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
										{item.title || 'Untitled Research Manuscript'}
									</strong>
								</td>

								<td>
									<span class="type-badge research-type">
										{item.type}
									</span>
								</td>

								<td class="author-cell">
									{item.author_name ||
										item.profiles?.full_name ||
										'Dr. Researcher'}
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
										href={`/cms/review/research/${item.id}`}
										class="btn-review research-btn"
									>
										<ShieldCheck size={14} />
										Review Research
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

	.bg-purple-pill {
		background: #faf5ff;
		color: #9333ea;
		border: 1px solid #e9d5ff;
	}

	.stats-badge {
		background: #faf5ff;
		border: 1px solid #e9d5ff;
		padding: 10px 18px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 10px;
		color: #6b21a8;
		font-size: 14px;
		white-space: nowrap;
	}

	.text-purple {
		color: #9333ea;
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
		background: #fafafa;
	}

	.item-title {
		font-size: 14px;
		font-weight: 700;
		color: #0f172a;
	}

	.type-badge.research-type {
		font-size: 11px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 6px;
		background: #faf5ff;
		color: #9333ea;
		border: 1px solid #f3e8ff;
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
		background: #9333ea;
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
		box-shadow: 0 2px 4px rgba(147, 51, 234, 0.15);
	}

	.btn-review:hover {
		background: #7e22ce;
		transform: translateY(-1px);
		box-shadow: 0 4px 10px rgba(147, 51, 234, 0.25);
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