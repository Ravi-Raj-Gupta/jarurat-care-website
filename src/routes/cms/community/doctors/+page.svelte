<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import DoctorCard from '$lib/components/community/DoctorCard.svelte';

	export let data;

	$: profile = data.profile;
	$: doctors = data.doctors;
	$: followedDoctorIds = new Set(data.followedDoctorIds);
</script>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar
			doctorName={profile?.full_name || ''}
			unreadCount={0}
		/>

		<div class="page">
			<div class="page-header">
				<h1>Community Doctors</h1>
				<p>Browse all registered doctors.</p>
			</div>

			<div class="doctor-grid">
				{#each doctors as doctor}
					<DoctorCard
						{doctor}
						isFollowed={followedDoctorIds.has(doctor.id)}
						isSelf={doctor.id === profile?.id}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		min-height: 100vh;
		background: #f5f7fb;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.page {
		width: 100%;
		padding: 30px;
	}

	.page-header {
		margin-bottom: 25px;
	}

	.page-header h1 {
		margin: 0 0 6px 0;
		font-size: 28px;
		font-weight: 700;
		color: #0f172a;
	}

	.page-header p {
		margin: 0;
		font-size: 15px;
		color: #64748b;
	}

	.doctor-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 20px;
		width: 100%;
	}

	@media (max-width: 768px) {
		.page {
			padding: 20px;
		}

		.doctor-grid {
			grid-template-columns: 1fr;
		}
	}
</style>