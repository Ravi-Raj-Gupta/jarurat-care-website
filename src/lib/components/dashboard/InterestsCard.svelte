<script lang="ts">
	export let interests: string[] = [];
</script>

<div class="interests-card">
	<h3>Area of Interest</h3>
	{#if interests.length === 0}
		<p class="empty">No interests selected yet. <a href="/cms/complete-profile">Choose some</a></p>
	{:else}
		<div class="tag-list">
			{#each interests as interest}
				<span class="tag">{interest}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.interests-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
	}

	h3 {
		margin: 0 0 16px;
		color: #1e2a5e;
		font-size: 16px;
	}

	.empty {
		margin: 0;
		font-size: 14px;
		color: #9ca3af;
	}

	.empty a {
		color: #1e40af;
		font-weight: 600;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.tag {
		border: 1px solid #93c5fd;
		color: #1e40af;
		font-size: 13px;
		font-weight: 600;
		padding: 6px 16px;
		border-radius: 20px;
		background: #eff6ff;
	}
</style>