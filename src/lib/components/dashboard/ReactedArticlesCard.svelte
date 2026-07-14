<script lang="ts">
	export let articles: Array<any> = [];
</script>

<div class="reacted-card">
	<div class="card-header">
		<h3>Reacted Articles</h3>
		<span class="badge">Coming Soon</span>
	</div>

	<div class="empty-state">
		<div class="icon">❤️</div>
		<h4>No reactions yet</h4>
		<p>Soon you'll be able to see the articles you've reacted to right here.</p>
	</div>
</div>

<style>
	.reacted-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
	}

	.card-header {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card-header h3 {
		margin: 0;
		color: #1e2a5e;
		font-size: 16px;
	}

	.badge {
		background: #eef2ff;
		color: #4f46e5;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.empty-state {
		padding: 40px 20px;
		text-align: center;
		color: #666;
		background: #f8fafc;
		border-radius: 12px;
		border: 1px dashed #cbd5e1;
	}

	.icon {
		font-size: 32px;
		margin-bottom: 12px;
		opacity: 0.5;
		filter: grayscale(1);
	}

	.empty-state h4 {
		color: #1e2a5e;
		margin-bottom: 8px;
	}

	.empty-state p {
		margin: 0;
		font-size: 13px;
	}
</style>
