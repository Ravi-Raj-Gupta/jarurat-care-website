<script lang="ts">
	export let value: number | string = 0;
	export let label: string = '';
	export let trend: string = '';
	export let trendType: 'up' | 'down' | 'neutral' = 'up';
</script>

<div class="stat-card">
	<div class="stat-icon">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	</div>
	<div class="stat-info">
		<span class="label">{label}</span>
		<h3 class="value">{value}</h3>
		{#if trend}
			<span class="trend {trendType}">
				{#if trendType === 'up'}↑{:else if trendType === 'down'}↓{/if} {trend}
			</span>
		{/if}
	</div>
</div>

<style>
	.stat-card {
		padding: 20px;
		display: flex;
		align-items: flex-start;
		gap: 16px;
	}

	.stat-icon {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		background: #f1f5f9;
		color: #4f46e5;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.label {
		font-size: 13px;
		color: #64748b;
		font-weight: 500;
	}

	.value {
		font-size: 24px;
		font-weight: 700;
		color: #0f172a;
		margin: 4px 0;
	}

	.trend {
		font-size: 11px;
		font-weight: 600;
	}

	.trend.up { color: #16a34a; }
	.trend.down { color: #dc2626; }
	.trend.neutral { color: #64748b; }
</style>