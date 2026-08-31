<script lang="ts">
	export let doctor: {
		id: string;
		full_name?: string | null;
		specialization?: string | null;
		organization?: string | null;
		avatar_url?: string | null;
		profile_image?: string | null;
		image?: string | null;
		bio?: string | null;
	} = {
		id: ''
	};

	export let isFollowed = false;
	export let isSelf = false;
	export let currentUserId: string | null = null;

	$: doctorName = doctor?.full_name || 'Unknown Doctor';

	$: doctorImage =
		doctor?.avatar_url ||
		doctor?.profile_image ||
		doctor?.image ||
		'';

	$: specialization =
		doctor?.specialization || 'Medical Professional';

	$: organization =
		doctor?.organization || '';

	$: about =
		doctor?.bio ||
		'Doctor and healthcare professional at Jarurat Care Foundation.';
</script>

<div class="doctor-card">
	<div class="doctor-card-top">
		<div class="doctor-profile">
			{#if doctorImage}
				<img
					src={doctorImage}
					alt={doctorName}
					class="doctor-image"
				/>
			{:else}
				<div class="doctor-image doctor-placeholder">
					{doctorName.charAt(0).toUpperCase()}
				</div>
			{/if}

			<div class="doctor-info">
				<h3>{doctorName}</h3>

				<p class="specialization">
					{specialization}
				</p>

				{#if organization}
					<p class="organization">
						{organization}
					</p>
				{/if}
			</div>
		</div>

		{#if isFollowed}
			<span class="followed-badge">
				Following
			</span>
		{/if}
	</div>

	<p class="doctor-about">
		{about}
	</p>

	<div class="doctor-actions">
		<a
			href={`/community/doctors/${doctor.id}`}
			class="view-profile"
		>
			View Profile
		</a>
	</div>
</div>

<style>
	.doctor-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 18px;
		padding: 22px;
		box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		display: flex;
		flex-direction: column;
		min-height: 245px;
	}

	.doctor-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 25px rgba(15, 23, 42, 0.09);
	}

	.doctor-card-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 15px;
	}

	.doctor-profile {
		display: flex;
		align-items: center;
		gap: 15px;
		min-width: 0;
	}

	.doctor-image {
		width: 64px;
		height: 64px;
		min-width: 64px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #e5edff;
	}

	.doctor-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #eaf1ff;
		color: #3156c9;
		font-size: 24px;
		font-weight: 700;
	}

	.doctor-info {
		min-width: 0;
	}

	.doctor-info h3 {
		margin: 0 0 5px;
		font-size: 18px;
		font-weight: 700;
		color: #0f172a;
	}

	.specialization {
		margin: 0;
		font-size: 14px;
		color: #3156c9;
		font-weight: 600;
	}

	.organization {
		margin: 4px 0 0;
		font-size: 13px;
		color: #64748b;
	}

	.followed-badge {
		background: #eef4ff;
		color: #3156c9;
		border-radius: 999px;
		padding: 5px 10px;
		font-size: 11px;
		font-weight: 700;
		white-space: nowrap;
	}

	.doctor-about {
		margin: 20px 0;
		color: #64748b;
		font-size: 14px;
		line-height: 1.7;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.doctor-actions {
		margin-top: auto;
		display: flex;
		justify-content: flex-end;
	}

	.view-profile {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 9px 16px;
		border-radius: 9px;
		background: #3156c9;
		color: white;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s ease;
	}

	.view-profile:hover {
		background: #2445aa;
	}

	@media (max-width: 600px) {
		.doctor-card {
			padding: 18px;
		}

		.doctor-card-top {
			flex-direction: column;
		}

		.doctor-profile {
			width: 100%;
		}

		.doctor-actions {
			justify-content: stretch;
		}

		.view-profile {
			width: 100%;
		}
	}
</style>