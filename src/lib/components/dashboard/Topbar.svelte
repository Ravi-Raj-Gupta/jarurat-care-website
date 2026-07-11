<script lang="ts">
	export let doctorName: string = '';
	export let unreadCount: number = 0;
</script>

<header>
	<div class="search-wrapper">
		<input type="text" placeholder="Search articles..." class="search-input" />
	</div>

	<div class="right-section">
		<a href="/cms/doctor-dashboard/notifications" class="bell-wrapper">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#202866" stroke-width="2">
				<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			</svg>
			{#if unreadCount > 0}
				<span class="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
			{/if}
		</a>

		<div class="profile">
			{doctorName ? doctorName.charAt(0).toUpperCase() : '?'}
		</div>

		<span class="doctor-name">{doctorName}</span>
	</div>
</header>

<style>
	header {
		background: white;
		height: 70px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	.search-wrapper {
		flex: 1;
		max-width: 400px;
	}

	.search-input {
		width: 100%;
		padding: 10px 16px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-size: 14px;
		outline: none;
		box-sizing: border-box;
	}

	.search-input:focus {
		border-color: #202866;
	}

	.right-section {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.bell-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		transition: background 0.2s;
	}

	.bell-wrapper:hover {
		background: #f5f7fb;
	}

	.badge {
		position: absolute;
		top: 0;
		right: 0;
		background: #ef4444;
		color: white;
		font-size: 10px;
		font-weight: 700;
		min-width: 16px;
		height: 16px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 3px;
	}

	.profile {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: #202866;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}

	.doctor-name {
		font-size: 14px;
		font-weight: 600;
		color: #202866;
	}
</style>