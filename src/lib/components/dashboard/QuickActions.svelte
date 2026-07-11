<script lang="ts">
	export let hasDraft: boolean = false;
</script>

<div class="quick-actions">
	<a href="/cms/doctor-dashboard/create">Create Article</a>

	{#if hasDraft}
		<a href="/cms/doctor-dashboard/drafts">Continue Draft</a>
	{:else}
		<a href="/cms/doctor-dashboard/drafts" class="disabled">Continue Draft</a>
	{/if}

	<a href="/cms/complete-profile">Edit Profile</a>
	<a href="/cms/doctor-dashboard/articles">View Articles</a>
</div>

<style>
	.quick-actions {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;
	}

	.quick-actions a {
		height: 80px;
		border: none;
		border-radius: 14px;
		background: white;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		color: #202866;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
		transition: 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		text-decoration: none;
		padding: 0 10px;
	}

	.quick-actions a:hover {
		transform: translateY(-2px);
		background: #202866;
		color: white;
	}

	.quick-actions a.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	@media (max-width: 900px) {
		.quick-actions {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>