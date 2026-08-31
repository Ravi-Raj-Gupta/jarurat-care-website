<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';

	export let data;

	$: currentUser = data.currentUser;
	$: doctor = data.doctor;
	$: followers = data.followers ?? [];
	$: following = data.following ?? [];
	$: followersCount = data.followersCount ?? 0;
	$: followingCount = data.followingCount ?? 0;
	$: isFollowing = data.isFollowing ?? false;

	let activeList: 'followers' | 'following' | null = null;

	function getInitials(name: string) {
		if (!name) return 'DR';

		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join('');
	}

	function getAvatar(person: any) {
		return (
			person.avatar_url ||
			person.image_url ||
			person.photo_url ||
			person.profile_picture ||
			person.avatar ||
			null
		);
	}

	function openFollowers() {
		activeList = 'followers';
	}

	function openFollowing() {
		activeList = 'following';
	}

	function closeList() {
		activeList = null;
	}
</script>

<svelte:head>
	<title>{doctor.full_name || 'Doctor Profile'} | Jarurat Care</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={currentUser?.is_reviewer === true} />

	<div class="content">
		<Topbar
			doctorName={currentUser?.full_name || ''}
			email={currentUser?.email || ''}
			unreadCount={0}
		/>

		<main class="page">
			<a class="back-link" href="/cms/community/doctors">
				← Back to Community
			</a>

			<section class="profile-card">
				<div class="cover"></div>

				<div class="profile-body">
					<div class="avatar-large">
						{#if doctor.avatar}
							<img
								src={doctor.avatar}
								alt={doctor.full_name || 'Doctor'}
							/>
						{:else}
							<span>{getInitials(doctor.full_name)}</span>
						{/if}
					</div>

					<div class="profile-info">
						<div class="name-row">
							<h1>{doctor.full_name || 'Doctor'}</h1>

							<span class="doctor-badge">
								✓ Doctor
							</span>
						</div>

						{#if doctor.specialization}
							<p class="specialization">
								{doctor.specialization}
							</p>
						{/if}

						{#if doctor.organization}
							<p class="organization">
								{doctor.organization}
							</p>
						{/if}
					</div>

					{#if doctor.id !== currentUser?.id}
						<form
							class="profile-follow-form"
							method="POST"
							action={isFollowing ? '?/unfollow' : '?/follow'}
						>
							<button
								class:following={isFollowing}
								class="profile-follow-btn"
								type="submit"
							>
								{isFollowing ? 'Following' : 'Follow Doctor'}
							</button>
						</form>
					{/if}
				</div>

				<div class="stats-row">
					<button
						class="stat"
						type="button"
						on:click={openFollowers}
					>
						<strong>{followersCount}</strong>
						<span>Followers</span>
					</button>

					<button
						class="stat"
						type="button"
						on:click={openFollowing}
					>
						<strong>{followingCount}</strong>
						<span>Following</span>
					</button>
				</div>
			</section>

			<div class="two-column">
				<section class="info-card">
					<div class="section-heading">
						<span class="heading-icon">👨‍⚕️</span>
						<h2>About the Doctor</h2>
					</div>

					{#if doctor.about}
						<p>{doctor.about}</p>
					{:else if doctor.bio}
						<p>{doctor.bio}</p>
					{:else if doctor.about_me}
						<p>{doctor.about_me}</p>
					{:else}
						<p class="muted">
							This doctor has not added an introduction yet.
						</p>
					{/if}
				</section>

				<section class="info-card">
					<div class="section-heading">
						<span class="heading-icon">📋</span>
						<h2>Professional Information</h2>
					</div>

					<div class="details">
						{#if doctor.specialization}
							<div class="detail">
								<span>Specialization</span>
								<strong>{doctor.specialization}</strong>
							</div>
						{/if}

						{#if doctor.organization}
							<div class="detail">
								<span>Organization</span>
								<strong>{doctor.organization}</strong>
							</div>
						{/if}

						{#if doctor.location}
							<div class="detail">
								<span>Location</span>
								<strong>{doctor.location}</strong>
							</div>
						{/if}

						{#if doctor.city}
							<div class="detail">
								<span>City</span>
								<strong>{doctor.city}</strong>
							</div>
						{/if}

						{#if doctor.experience}
							<div class="detail">
								<span>Experience</span>
								<strong>{doctor.experience}</strong>
							</div>
						{/if}

						{#if doctor.years_of_experience}
							<div class="detail">
								<span>Experience</span>
								<strong>{doctor.years_of_experience} years</strong>
							</div>
						{/if}

						{#if !doctor.specialization &&
							!doctor.organization &&
							!doctor.location &&
							!doctor.city &&
							!doctor.experience &&
							!doctor.years_of_experience}
							<p class="muted">
								Professional information has not been added yet.
							</p>
						{/if}
					</div>
				</section>
			</div>

			<section class="community-card">
				<div>
					<div class="community-label">COMMUNITY</div>
					<h2>Doctor's Community</h2>
					<p>
						See who follows this doctor and which doctors they follow.
					</p>
				</div>

				<div class="community-actions">
					<button type="button" on:click={openFollowers}>
						<span>{followersCount}</span>
						Followers
					</button>

					<button type="button" on:click={openFollowing}>
						<span>{followingCount}</span>
						Following
					</button>
				</div>
			</section>
		</main>
	</div>
</div>

{#if activeList}
	<div class="modal-backdrop" role="presentation" on:click={closeList}>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			on:click|stopPropagation
		>
			<div class="modal-header">
				<div>
					<h2>
						{activeList === 'followers'
							? 'Followers'
							: 'Following'}
					</h2>

					<p>
						{activeList === 'followers'
							? `${followersCount} people follow this doctor`
							: `${followingCount} doctors followed`}
					</p>
				</div>

				<button
					class="close-btn"
					type="button"
					on:click={closeList}
					aria-label="Close"
				>
					×
				</button>
			</div>

			<div class="people-list">
				{#if activeList === 'followers'}
					{#if followers.length === 0}
						<div class="empty-list">
							<div>👥</div>
							<strong>No followers yet</strong>
							<span>This doctor doesn't have any followers yet.</span>
						</div>
					{:else}
						{#each followers as person}
							{@const avatar = getAvatar(person)}

							<a
								class="person"
								href={`/cms/community/doctors/${person.id}`}
								on:click={closeList}
							>
								<div class="person-avatar">
									{#if avatar}
										<img
											src={avatar}
											alt={person.full_name || 'User'}
										/>
									{:else}
										<span>
											{getInitials(person.full_name)}
										</span>
									{/if}
								</div>

								<div class="person-info">
									<strong>
										{person.full_name || 'User'}
									</strong>

									<span>
										{person.specialization ||
											person.organization ||
											'Community Member'}
									</span>
								</div>
							</a>
						{/each}
					{/if}
				{:else}
					{#if following.length === 0}
						<div class="empty-list">
							<div>👨‍⚕️</div>
							<strong>Not following anyone yet</strong>
							<span>This doctor isn't following any doctors yet.</span>
						</div>
					{:else}
						{#each following as person}
							{@const avatar = getAvatar(person)}

							<a
								class="person"
								href={`/cms/community/doctors/${person.id}`}
								on:click={closeList}
							>
								<div class="person-avatar">
									{#if avatar}
										<img
											src={avatar}
											alt={person.full_name || 'Doctor'}
										/>
									{:else}
										<span>
											{getInitials(person.full_name)}
										</span>
									{/if}
								</div>

								<div class="person-info">
									<strong>
										{person.full_name || 'Doctor'}
									</strong>

									<span>
										{person.specialization ||
											person.organization ||
											'Doctor'}
									</span>
								</div>
							</a>
						{/each}
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.dashboard {
		min-height: 100vh;
		display: flex;
		background: #f5f7fb;
	}

	.content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.page {
		padding: 30px;
		max-width: 1250px;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		margin-bottom: 18px;
		color: #315bdc;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.profile-card {
		background: white;
		border-radius: 22px;
		border: 1px solid #e2e8f0;
		overflow: hidden;
		box-shadow: 0 7px 25px rgba(15, 23, 42, 0.06);
	}

	.cover {
		height: 155px;
		background:
			radial-gradient(circle at 15% 35%, rgba(255, 255, 255, 0.5), transparent 18%),
			radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4), transparent 20%),
			linear-gradient(120deg, #dce9ff, #eef5ff, #d9e8ff);
	}

	.profile-body {
		display: flex;
		align-items: flex-end;
		gap: 22px;
		padding: 0 30px 25px;
		margin-top: -55px;
		position: relative;
	}

	.avatar-large {
		width: 120px;
		height: 120px;
		min-width: 120px;
		border-radius: 50%;
		background: linear-gradient(135deg, #e4edff, #cddcff);
		border: 5px solid white;
		box-shadow: 0 4px 15px rgba(15, 23, 42, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		color: #315bdc;
		font-size: 34px;
		font-weight: 700;
	}

	.avatar-large img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-info {
		flex: 1;
		padding-bottom: 8px;
		min-width: 0;
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.name-row h1 {
		margin: 0;
		color: #172554;
		font-size: 28px;
		font-weight: 700;
	}

	.doctor-badge {
		background: #eaf1ff;
		color: #315bdc;
		padding: 5px 10px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 700;
	}

	.specialization {
		margin: 7px 0 3px;
		color: #315bdc;
		font-size: 15px;
		font-weight: 600;
	}

	.organization {
		margin: 0;
		color: #718096;
		font-size: 14px;
	}

	.profile-follow-form {
		margin: 0 0 8px;
	}

	.profile-follow-btn {
		min-width: 145px;
		padding: 11px 18px;
		border: 1px solid #315bdc;
		border-radius: 10px;
		background: #315bdc;
		color: white;
		font-weight: 700;
		cursor: pointer;
	}

	.profile-follow-btn:hover {
		background: #264bc4;
	}

	.profile-follow-btn.following {
		background: white;
		color: #315bdc;
	}

	.stats-row {
		display: flex;
		border-top: 1px solid #edf0f5;
		padding: 0 30px;
	}

	.stat {
		flex: 1;
		padding: 18px;
		background: none;
		border: 0;
		cursor: pointer;
		text-align: center;
	}

	.stat + .stat {
		border-left: 1px solid #edf0f5;
	}

	.stat strong {
		display: block;
		color: #172554;
		font-size: 22px;
		margin-bottom: 3px;
	}

	.stat span {
		color: #718096;
		font-size: 13px;
	}

	.stat:hover strong,
	.stat:hover span {
		color: #315bdc;
	}

	.two-column {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 22px;
		margin-top: 22px;
	}

	.info-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 18px;
		padding: 24px;
		box-shadow: 0 5px 18px rgba(15, 23, 42, 0.04);
	}

	.section-heading {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 18px;
	}

	.section-heading h2 {
		margin: 0;
		color: #172554;
		font-size: 18px;
	}

	.heading-icon {
		width: 34px;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #edf3ff;
		border-radius: 9px;
	}

	.info-card p {
		margin: 0;
		color: #64748b;
		font-size: 14px;
		line-height: 1.8;
	}

	.muted {
		color: #94a3b8 !important;
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.detail {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-bottom: 13px;
		border-bottom: 1px solid #f0f2f5;
	}

	.detail:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.detail span {
		color: #8995a8;
		font-size: 12px;
	}

	.detail strong {
		color: #263553;
		font-size: 14px;
	}

	.community-card {
		margin-top: 22px;
		padding: 25px;
		border-radius: 18px;
		background: linear-gradient(120deg, #eef5ff, #f8fbff);
		border: 1px solid #dce8fb;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 25px;
	}

	.community-label {
		color: #315bdc;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 1px;
		margin-bottom: 5px;
	}

	.community-card h2 {
		margin: 0 0 5px;
		color: #172554;
		font-size: 19px;
	}

	.community-card p {
		margin: 0;
		color: #64748b;
		font-size: 13px;
	}

	.community-actions {
		display: flex;
		gap: 10px;
	}

	.community-actions button {
		min-width: 120px;
		padding: 12px 16px;
		border: 1px solid #d8e3f6;
		border-radius: 11px;
		background: white;
		color: #315bdc;
		cursor: pointer;
		font-weight: 600;
	}

	.community-actions button span {
		font-weight: 800;
		margin-right: 4px;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(15, 23, 42, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.modal {
		width: 100%;
		max-width: 520px;
		max-height: 80vh;
		background: white;
		border-radius: 20px;
		box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 22px;
		border-bottom: 1px solid #edf0f5;
	}

	.modal-header h2 {
		margin: 0 0 4px;
		color: #172554;
		font-size: 20px;
	}

	.modal-header p {
		margin: 0;
		color: #8490a4;
		font-size: 12px;
	}

	.close-btn {
		width: 36px;
		height: 36px;
		border: 0;
		border-radius: 50%;
		background: #f1f5f9;
		color: #475569;
		font-size: 24px;
		cursor: pointer;
	}

	.people-list {
		padding: 10px;
		max-height: 60vh;
		overflow-y: auto;
	}

	.person {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 12px;
		border-radius: 12px;
		text-decoration: none;
	}

	.person:hover {
		background: #f7f9fc;
	}

	.person-avatar {
		width: 45px;
		height: 45px;
		min-width: 45px;
		border-radius: 50%;
		overflow: hidden;
		background: #e8efff;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #315bdc;
		font-size: 14px;
		font-weight: 700;
	}

	.person-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.person-info {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.person-info strong {
		color: #172554;
		font-size: 14px;
	}

	.person-info span {
		color: #7b879a;
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty-list {
		padding: 45px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.empty-list div {
		font-size: 34px;
		margin-bottom: 5px;
	}

	.empty-list strong {
		color: #263553;
		font-size: 15px;
	}

	.empty-list span {
		color: #8a96a8;
		font-size: 12px;
	}

	@media (max-width: 800px) {
		.page {
			padding: 20px;
		}

		.profile-body {
			align-items: center;
			flex-direction: column;
			text-align: center;
			margin-top: -60px;
		}

		.name-row {
			justify-content: center;
		}

		.profile-follow-form {
			margin-bottom: 0;
		}

		.two-column {
			grid-template-columns: 1fr;
		}

		.community-card {
			align-items: flex-start;
			flex-direction: column;
		}
	}

	@media (max-width: 500px) {
		.cover {
			height: 120px;
		}

		.profile-body {
			padding-left: 18px;
			padding-right: 18px;
		}

		.stats-row {
			padding: 0 10px;
		}

		.community-actions {
			width: 100%;
		}

		.community-actions button {
			flex: 1;
			min-width: 0;
		}
	}
</style>