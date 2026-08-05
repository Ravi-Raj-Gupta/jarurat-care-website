<script lang="ts">
	export let doctorName: string = '';
	export let unreadCount: number = 0;
</script>

<header class="topbar">
	<div class="search-box">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
		<input type="text" placeholder="Search articles, authors, topics..." />
		<kbd>Ctrl + K</kbd>
	</div>

	<div class="actions">
		<div class="icon-btn">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			</svg>
			{#if unreadCount > 0}
				<span class="badge">{unreadCount}</span>
			{/if}
		</div>

		<div class="profile-meta">
			<div class="avatar">{doctorName ? doctorName.charAt(0) : 'D'}</div>
			<div class="user-info">
				<span class="name">{doctorName || 'Doctor'}</span>
				<span class="role">Verified Specialist</span>
			</div>
		</div>
	</div>
</header>

<style>
	.topbar {
		height: 70px;
		background: #ffffff;
		border-bottom: 1px solid #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 36px;
	}

	.search-box {
		display: flex;
		align-items: center;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 8px 14px;
		width: 360px;
		gap: 10px;
	}

	.search-box input {
		border: none;
		background: transparent;
		outline: none;
		width: 100%;
		font-size: 13px;
	}

	kbd {
		background: #ffffff;
		border: 1px solid #cbd5e1;
		border-radius: 4px;
		padding: 2px 6px;
		font-size: 10px;
		color: #64748b;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	.icon-btn {
		position: relative;
		cursor: pointer;
		color: #64748b;
	}

	.badge {
		position: absolute;
		top: -6px;
		right: -6px;
		background: #e11d48;
		color: white;
		font-size: 10px;
		font-weight: 700;
		border-radius: 10px;
		padding: 2px 5px;
	}

	.profile-meta {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.avatar {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: #4f46e5;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}

	.user-info {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-size: 14px;
		font-weight: 600;
		color: #0f172a;
	}

	.role {
		font-size: 11px;
		color: #64748b;
	}
</style>