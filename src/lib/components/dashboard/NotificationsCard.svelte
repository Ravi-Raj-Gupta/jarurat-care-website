<script lang="ts">
	export let notifications: Array<{
		id: string;
		title: string;
		message: string;
		is_read: boolean;
		created_at: string;
	}> = [];

	function timeAgo(dateStr: string) {
		const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}
</script>

<div class="notifications-card">
	<div class="card-header">
		<h3>Notifications</h3>
	</div>

	{#if notifications.length === 0}
		<div class="empty-state">
			<p>No notifications yet.</p>
		</div>
	{:else}
		<div class="notif-list">
			{#each notifications as notif}
				<div class="notif-item" class:unread={!notif.is_read}>
					{#if !notif.is_read}
						<span class="dot"></span>
					{/if}
					<div class="notif-body">
						<strong>{notif.title}</strong>
						{#if notif.message}
							<p>{notif.message}</p>
						{/if}
						<span class="notif-time">{timeAgo(notif.created_at)}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.notifications-card {
		background: white;
		border-radius: 16px;
		padding: 25px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
	}

	.card-header {
		margin-bottom: 20px;
	}

	.card-header h3 {
		color: #202866;
		margin: 0;
	}

	.empty-state {
		padding: 30px 20px;
		text-align: center;
		color: #666;
	}

	.empty-state p {
		margin: 0;
	}

	.notif-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.notif-item {
		display: flex;
		gap: 10px;
		padding: 12px 8px;
		border-radius: 8px;
	}

	.notif-item.unread {
		background: #f5f7ff;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #202866;
		margin-top: 6px;
		flex-shrink: 0;
	}

	.notif-body strong {
		display: block;
		font-size: 14px;
		color: #111827;
	}

	.notif-body p {
		margin: 4px 0;
		font-size: 13px;
		color: #666;
	}

	.notif-time {
		font-size: 11px;
		color: #9ca3af;
	}
</style>