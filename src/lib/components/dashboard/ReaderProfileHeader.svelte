<script lang="ts">
	export let profile: {
		full_name?: string;
		profession?: string;
		location?: string;
		created_at?: string;
	};
	export let savedCount: number = 0;
	export let interestsCount: number = 0;

	function formatMemberSince(dateStr?: string) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}
</script>

<div class="header-card">
	<div class="top-row">
		<div class="profile-section">
			<div class="avatar">
				{profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
			</div>
			<div>
				<h2>{profile?.full_name || 'Reader'}</h2>
				<p class="subtitle">
					{profile?.profession || 'Reader'}
					{#if profile?.location}
						• {profile.location}
					{/if}
				</p>
				<span class="member">Member since {formatMemberSince(profile?.created_at)}</span>
			</div>
		</div>

		<a href="/cms/complete-profile" class="edit-btn">Edit Profile</a>
	</div>

	<div class="stats-row">
		<div class="stat-pill">
			<strong>{savedCount}</strong>
			<span>Saved Articles</span>
		</div>
		<div class="stat-pill">
			<strong>{interestsCount}</strong>
			<span>Interests Selected</span>
		</div>
	</div>
</div>

<style>
	.header-card {
		background: #1e2a5e;
		border-radius: 16px;
		color: white;
		overflow: hidden;
	}

	.top-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 28px 30px 20px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.profile-section {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: 700;
		flex-shrink: 0;
	}

	h2 {
		margin: 0;
		font-size: 20px;
	}

	.subtitle {
		margin: 4px 0;
		font-size: 13px;
		opacity: 0.85;
	}

	.member {
		font-size: 12px;
		opacity: 0.7;
	}

	.edit-btn {
		background: white;
		color: #1e2a5e;
		padding: 9px 18px;
		border-radius: 8px;
		text-decoration: none;
		font-size: 13px;
		font-weight: 700;
		white-space: nowrap;
	}

	.edit-btn:hover {
		background: #e5e7eb;
	}

	.stats-row {
		display: flex;
		background: rgba(255, 255, 255, 0.08);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.stat-pill {
		flex: 1;
		text-align: center;
		padding: 16px;
	}

	.stat-pill strong {
		display: block;
		font-size: 22px;
	}

	.stat-pill span {
		font-size: 12px;
		opacity: 0.8;
	}
</style>