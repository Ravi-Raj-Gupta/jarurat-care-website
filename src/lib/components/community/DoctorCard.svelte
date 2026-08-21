<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { MapPin, Building2, GraduationCap, Stethoscope, UserPlus, UserCheck } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	export let doctor: any;
	export let isFollowed: boolean = false;
	export let isSelf: boolean = false;
	export let currentUserId: string | null = null;

	let following = isFollowed;
	let loadingFollow = false;

	$: fullName = doctor?.full_name || 'Doctor';

	$: initials = fullName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((name: string) => name[0])
		.join('')
		.toUpperCase();

	$: profileImage =
		doctor?.avatar_url ||
		doctor?.profile_image ||
		doctor?.profile_photo ||
		doctor?.photo_url ||
		null;

	$: designation = doctor?.designation || doctor?.professional_title || '';

	$: specialization =
		doctor?.specialization ||
		doctor?.speciality ||
		doctor?.specialty ||
		'Medical Professional';

	$: organization =
		doctor?.organization ||
		doctor?.hospital ||
		doctor?.hospital_name ||
		'';

	$: location =
		doctor?.city_state ||
		doctor?.location ||
		doctor?.city ||
		'';

	$: qualification =
		doctor?.qualification ||
		doctor?.qualifications ||
		doctor?.degree ||
		'';

	$: experience =
		doctor?.experience ||
		doctor?.years_experience ||
		'';

	function viewProfile() {
		if (!doctor?.id) return;

		goto(`/cms/community/doctors/${doctor.id}`);
	}


</script>

<article class="doctor-card">

	<!-- TOP PROFILE SECTION -->
	<div class="profile-section">

		<div class="doctor-photo-wrap">

			{#if profileImage}
				<img
					src={profileImage}
					alt={fullName}
					class="doctor-photo"
				/>
			{:else}
				<div class="doctor-initials">
					{initials}
				</div>
			{/if}

			<div class="verified-badge" title="Registered Doctor">
				✓
			</div>

		</div>

		<div class="doctor-name">
			{fullName}
		</div>

		{#if designation}
			<div class="designation">
				{designation}
			</div>
		{/if}

		<div class="specialization">
			{specialization}
		</div>

	</div>


	<!-- DOCTOR INFORMATION -->
	<div class="doctor-info">

		{#if organization}
			<div class="info-row">
				<div class="icon-box">
					<Building2 size={16} />
				</div>

				<span>{organization}</span>
			</div>
		{/if}


		{#if location}
			<div class="info-row">
				<div class="icon-box">
					<MapPin size={16} />
				</div>

				<span>{location}</span>
			</div>
		{/if}


		{#if qualification}
			<div class="info-row">
				<div class="icon-box">
					<GraduationCap size={16} />
				</div>

				<span>{qualification}</span>
			</div>
		{/if}


		{#if experience}
			<div class="info-row">
				<div class="icon-box">
					<Stethoscope size={16} />
				</div>

				<span>
					{experience}
					{typeof experience === 'number' ? ' Years Experience' : ''}
				</span>
			</div>
		{/if}

	</div>


	<!-- ACTIONS -->
	<div class="card-actions">

		<button
			class="view-profile-btn"
			on:click={viewProfile}
			type="button"
		>
			View Profile
		</button>


		{#if !isSelf}
			<form 
				method="POST" 
				action={following ? '?/unfollow' : '?/follow'} 
				use:enhance={() => {
					loadingFollow = true;
					return async ({ result }) => {
						loadingFollow = false;
						if (result.type === 'success') {
							following = !following;
							if (following) {
								toast.success(`Awesome! You are now following ${fullName}`, { duration: 3000 });
							} else {
								toast.success(`You unfollowed ${fullName}.`, { duration: 3000 });
							}
						} else {
							toast.error('Oops! Could not update follow status. Please try again.', { duration: 4000 });
						}
					};
				}}
				style="display: contents;"
			>
				<input type="hidden" name="doctor_id" value={doctor.id} />
				<button
					class:following={following}
					class="follow-btn"
					disabled={loadingFollow}
					type="submit"
				>
					{#if following}
						<UserCheck size={16} />
						<span>{loadingFollow ? 'Updating...' : 'Following'}</span>
					{:else}
						<UserPlus size={16} />
						<span>{loadingFollow ? 'Following...' : 'Follow'}</span>
					{/if}
				</button>
			</form>
		{:else}
			<div class="your-profile">
				Your Profile
			</div>
		{/if}

	</div>

</article>


<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family:
			'DM Sans',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
	}

	/* =========================
	   CARD
	========================= */

	.doctor-card {
		background: #ffffff;
		border: 1px solid #e3e7f2;
		border-radius: 16px;

		padding: 18px;

		position: relative;
		overflow: hidden;

		display: flex;
		flex-direction: column;

		/* IMPORTANT: compact card */
		min-height: 0;
		height: 430px;

		box-shadow: 0 3px 12px rgba(31, 41, 94, 0.05);

		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.doctor-card::before {
		content: '';

		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		height: 4px;

		background: linear-gradient(
			90deg,
			#30358f,
			#4c55d4
		);
	}

	.doctor-card:hover {
		transform: translateY(-3px);

		border-color: #cbd3f4;

		box-shadow:
			0 10px 25px rgba(31, 41, 94, 0.10);
	}


	/* =========================
	   PROFILE
	========================= */

	.profile-section {
		text-align: center;

		padding-top: 4px;
	}


	.doctor-photo-wrap {
		width: 88px;
		height: 88px;

		margin: 0 auto 10px;

		position: relative;
	}


	.doctor-photo,
	.doctor-initials {
		width: 88px;
		height: 88px;

		border-radius: 50%;

		object-fit: cover;

		border: 4px solid #edf1ff;

		background: #edf1ff;
	}


	.doctor-initials {
		display: flex;

		align-items: center;
		justify-content: center;

		background: linear-gradient(
			135deg,
			#30358f,
			#4b56d3
		);

		color: #ffffff;

		font-size: 24px;
		font-weight: 700;
	}


	.verified-badge {
		position: absolute;

		right: -1px;
		bottom: 1px;

		width: 23px;
		height: 23px;

		border-radius: 50%;

		background: #30358f;

		color: #ffffff;

		display: flex;

		align-items: center;
		justify-content: center;

		font-size: 12px;
		font-weight: 800;

		border: 3px solid #ffffff;

		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
	}


	.doctor-name {
		font-size: 17px;

		font-weight: 700;

		color: #1e2458;

		line-height: 1.3;

		margin-bottom: 3px;
	}


	.designation {
		font-size: 12px;

		font-weight: 600;

		color: #4b56c8;

		margin-bottom: 3px;
	}


	.specialization {
		font-size: 13px;

		color: #64748b;

		line-height: 1.3;
	}


	/* =========================
	   INFORMATION
	========================= */

	.doctor-info {
		display: flex;

		flex-direction: column;

		gap: 8px;

		margin-top: 15px;

		padding: 13px 0;

		border-top: 1px solid #eef1f7;
		border-bottom: 1px solid #eef1f7;

		flex: 1;
	}


	.info-row {
		display: flex;

		align-items: center;

		gap: 9px;

		font-size: 12px;

		color: #475569;

		line-height: 1.3;

		min-height: 28px;
	}


	.icon-box {
		width: 27px;
		height: 27px;

		flex-shrink: 0;

		border-radius: 7px;

		background: #f0f2ff;

		color: #3c46a8;

		display: flex;

		align-items: center;
		justify-content: center;
	}


	.info-row span {
		overflow: hidden;

		text-overflow: ellipsis;

		white-space: nowrap;
	}


	/* =========================
	   ACTIONS
	========================= */

	.card-actions {
		display: grid;

		grid-template-columns: 1fr 1fr;

		gap: 9px;

		margin-top: 14px;
	}


	button {
		font-family: inherit;

		cursor: pointer;
	}


	.view-profile-btn,
	.follow-btn {
		height: 38px;

		border-radius: 8px;

		font-size: 12px;

		font-weight: 700;

		display: flex;

		align-items: center;
		justify-content: center;

		gap: 6px;

		transition: all 0.2s ease;
	}


	.view-profile-btn {
		background: #f0f2ff;

		color: #30358f;

		border: 1px solid #e1e5fa;
	}


	.view-profile-btn:hover {
		background: #e4e8ff;

		border-color: #cdd3f4;
	}


	.follow-btn {
		background: #30358f;

		color: #ffffff;

		border: 1px solid #30358f;
	}


	.follow-btn:hover:not(:disabled) {
		background: #24286f;

		border-color: #24286f;
	}


	.follow-btn.following {
		background: #10b981;
		color: #ffffff;
		border: 1px solid #10b981;
	}


	.follow-btn.following:hover:not(:disabled) {
		background: #059669;
		border-color: #059669;
	}


	.follow-btn:disabled {
		opacity: 0.65;

		cursor: not-allowed;
	}


	.your-profile {
		height: 38px;

		border-radius: 8px;

		background: #f8fafc;

		border: 1px solid #e2e8f0;

		color: #64748b;

		display: flex;

		align-items: center;
		justify-content: center;

		font-size: 12px;

		font-weight: 600;
	}


	/* =========================
	   RESPONSIVE
	========================= */

	@media (max-width: 1100px) {
		.doctor-card {
			height: 420px;
		}
	}


	@media (max-width: 700px) {
		.doctor-card {
			height: auto;

			min-height: 400px;
		}

		.card-actions {
			grid-template-columns: 1fr 1fr;
		}
	}


	@media (max-width: 480px) {
		.card-actions {
			grid-template-columns: 1fr;
		}
	}
</style>