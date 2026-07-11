<script lang="ts">
	export let bio: string = '';
</script>

<div class="about-card">
	<h3>About</h3>
	{#if bio}
		<p>{bio}</p>
	{:else}
		<p class="empty">No bio added yet. <a href="/cms/complete-profile">Add one</a></p>
	{/if}
</div>

<style>
	.about-card {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
	}

	h3 {
		margin: 0 0 12px;
		color: #1e2a5e;
		font-size: 16px;
	}

	p {
		margin: 0;
		font-size: 14px;
		color: #4b5563;
		line-height: 1.6;
	}

	.empty {
		color: #9ca3af;
	}

	.empty a {
		color: #1e40af;
		font-weight: 600;
	}
</style>