<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import NewsFooter from '$lib/components/news-footer.svelte';
	import DoctorCard from '$lib/components/community/DoctorCard.svelte';
	import { ArrowLeft, Search, X } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: allDoctors = data.doctors;
	$: followedDoctorIds = new Set(data.followedDoctorIds);

	let searchQuery = '';

	// Filter doctors based on search query
	$: doctors = allDoctors.filter(doc => {
		if (!searchQuery) return true;
		const q = searchQuery.toLowerCase();
		return (
			(doc.full_name && doc.full_name.toLowerCase().includes(q)) ||
			(doc.specialization && doc.specialization.toLowerCase().includes(q)) ||
			(doc.organization && doc.organization.toLowerCase().includes(q))
		);
	});
</script>

<svelte:head>
	<title>Discover Doctors | JCF Dashboard</title>
</svelte:head>

<Nav />

<div class="page-wrapper">
	<div class="container">
		
		<div class="header-bar">
			<a href="/cms/reader-dashboard" class="back-link">
				<ArrowLeft size={16} /> Back to Dashboard
			</a>
			
			<div class="title-section">
				<h1>Discover Doctors</h1>
				<p>Search and follow medical professionals in our network.</p>
			</div>

			<div class="search-box">
				<Search size={18} class="search-icon" />
				<input 
					type="text" 
					bind:value={searchQuery} 
					placeholder="Search by name, specialty, or clinic..." 
				/>
				{#if searchQuery}
					<button class="clear-btn" on:click={() => searchQuery = ''}>
						<X size={16} />
					</button>
				{/if}
			</div>
		</div>

		{#if doctors.length > 0}
			<div class="doctor-grid">
				{#each doctors as doctor}
					<DoctorCard 
						{doctor} 
						isFollowed={followedDoctorIds.has(doctor.id)} 
						isSelf={doctor.id === profile?.id}
					/>
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				<p class="icon">🔍</p>
				<h3>No doctors found</h3>
				<p>Try adjusting your search terms.</p>
				{#if searchQuery}
					<button class="clear-filters-btn" on:click={() => searchQuery = ''}>Clear Search</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<NewsFooter />

<style>
	.page-wrapper {
		min-height: 100vh;
		background: #f5f7fb;
		padding-top: 100px; /* Space for Nav */
		font-family: 'DM Sans', sans-serif;
		padding-bottom: 60px;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.header-bar {
		margin-bottom: 40px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #475569;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 24px;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #1e4ed8;
	}

	.title-section h1 {
		font-size: 36px;
		font-weight: 700;
		color: #1e2a5e;
		margin: 0 0 8px;
	}

	.title-section p {
		color: #64748b;
		font-size: 16px;
		margin: 0 0 24px;
	}

	.search-box {
		position: relative;
		max-width: 500px;
	}

	.search-box input {
		width: 100%;
		padding: 14px 40px 14px 44px;
		border-radius: 999px;
		border: 1px solid #e2e8f0;
		background: white;
		font-size: 15px;
		outline: none;
		box-shadow: 0 2px 10px rgba(0,0,0,0.02);
		transition: all 0.2s;
	}

	.search-box input:focus {
		border-color: #1e4ed8;
		box-shadow: 0 4px 12px rgba(30, 78, 216, 0.1);
	}

	:global(.search-icon) {
		position: absolute;
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
		color: #94a3b8;
	}

	.clear-btn {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #94a3b8;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
	
	.clear-btn:hover {
		background: #f1f5f9;
		color: #475569;
	}

	.doctor-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
	}

	.empty-state {
		text-align: center;
		padding: 80px 20px;
		background: white;
		border-radius: 20px;
		box-shadow: 0 8px 24px rgba(0,0,0,0.02);
	}

	.empty-state .icon {
		font-size: 48px;
		margin: 0 0 16px;
	}

	.empty-state h3 {
		color: #1e2a5e;
		font-size: 24px;
		margin-bottom: 8px;
	}

	.empty-state p {
		color: #64748b;
		margin-bottom: 20px;
	}

	.clear-filters-btn {
		background: #1e4ed8;
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.clear-filters-btn:hover {
		background: #1d4ed8;
	}
</style>
