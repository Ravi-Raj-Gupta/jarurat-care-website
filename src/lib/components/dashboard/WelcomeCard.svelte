<script lang="ts">
	export let profile: {
		full_name?: string;
		qualification?: string;
		affiliation?: string;
		specialization?: string;
		verification_status?: string;
		created_at?: string;
		is_reviewer?: boolean;
	};

	function formatMemberSince(dateStr?: string) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}
</script>

<div class="welcome-card">
	<div class="profile-section">
		<div class="profile-photo"></div>

		<div>
			<h2>
				{profile?.full_name || 'Doctor'}
				{#if profile?.is_reviewer}
					<span class="reviewer-badge">Reviewer</span>
				{/if}
			</h2>
			<p>
				{profile?.qualification || 'Qualification not set'}
				{#if profile?.affiliation}
					• {profile.affiliation}
				{/if}
			</p>
			{#if profile?.specialization}
				<p class="specialization">{profile.specialization}</p>
			{/if}
			<div class="meta-row">
				<span class="verification-badge" class:approved={profile?.verification_status === 'approved'}>
					{profile?.verification_status || 'pending'}
				</span>
				<span class="member">Member since {formatMemberSince(profile?.created_at)}</span>
			</div>
		</div>
	</div>

	<a href="/cms/complete-profile" class="edit-btn">Edit Profile</a>
</div>

<style>
	.welcome-card {
		background: white;
		border-radius: 16px;
		padding: 25px 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
		flex-wrap: wrap;
		gap: 16px;
	}

	.profile-section {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.profile-photo {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #d9d9d9;
		flex-shrink: 0;
	}

	.profile-section h2 {
		margin: 0;
		color: #202866;
	}

	.profile-section p {
		margin: 4px 0;
		color: #666;
		font-size: 14px;
	}

	.specialization {
		font-size: 13px;
		color: #888;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 8px;
	}

	.verification-badge {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 3px 10px;
		border-radius: 20px;
		background: #fef3c7;
		color: #92400e;
	}

	.verification-badge.approved {
		background: #dcfce7;
		color: #166534;
	}

	.reviewer-badge {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 3px 10px;
		border-radius: 20px;
		background: #f3e8ff;
		color: #6b21a8;
		margin-left: 10px;
		vertical-align: middle;
	}

	.member {
		font-size: 13px;
		color: #999;
	}

	.edit-btn {
		padding: 10px 20px;
		background: #202866;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		text-decoration: none;
		font-size: 14px;
		white-space: nowrap;
	}

	.edit-btn:hover {
		background: #171f52;
	}
</style>