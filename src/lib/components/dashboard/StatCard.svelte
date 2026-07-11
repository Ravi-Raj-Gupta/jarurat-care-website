<script lang="ts">
	export let value: string | number = 0;
	export let label: string = '';
</script>

<div class="stat-card">
	<h3>{value}</h3>
	<p>{label}</p>
</div>

<style>
	.stat-card {
		background: white;
		border-radius: 14px;
		padding: 20px;
		text-align: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
	}

	.stat-card h3 {
		font-size: 28px;
		color: #202866;
		margin: 0 0 8px;
	}

	.stat-card p {
		color: #666;
		font-size: 14px;
		margin: 0;
	}
</style>