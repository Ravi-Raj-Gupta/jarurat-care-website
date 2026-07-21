<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import { enhance } from '$app/forms';
	import { Calendar, User, BookOpen, Award, MapPin } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: doctor = data.doctor;
	$: articles = data.articles;
	$: isFollowed = data.isFollowed;
	$: isSelf = data.isSelf;
	$: isLoggedIn = data.isLoggedIn;
	
	function getInitials(name: string) {
		if (!name) return 'DR';
		return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
	}

	function formatDate(dateString: string) {
		return new Intl.DateTimeFormat('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateString));
	}
</script>

<svelte:head>
	<title>{doctor.full_name || 'Doctor Profile'} | JCF</title>
</svelte:head>

<Nav />

<div class="page-wrapper">
	<div class="profile-header">
		<div class="container">
			<div class="header-content">
				<div class="avatar-section">
					{#if doctor.avatar}
						<img src={doctor.avatar} alt={doctor.full_name} class="avatar" />
					{:else}
						<div class="avatar-placeholder">{getInitials(doctor.full_name)}</div>
					{/if}
				</div>

				<div class="info-section">
					<h1>{doctor.full_name}</h1>
					<p class="designation">
						{#if doctor.designation}{doctor.designation}{/if}
						{#if doctor.designation && doctor.organization} at {/if}
						{#if doctor.organization}{doctor.organization}{/if}
					</p>

					<div class="tags">
						{#if doctor.specialization}
							<span class="tag bg-blue">Specialization: {doctor.specialization}</span>
						{/if}
						{#if doctor.city_state}
							<span class="tag bg-gray"><MapPin size={14}/> {doctor.city_state}</span>
						{/if}
					</div>
				</div>

				<div class="action-section">
					{#if !isSelf}
						{#if isLoggedIn}
							<form 
								method="POST" 
								action="?/{isFollowed ? 'unfollow' : 'follow'}"
								use:enhance={() => {
									const previousState = isFollowed;
									isFollowed = !isFollowed; // Optimistic update
									
									return async ({ result, update }) => {
										if (result.type !== 'success' && result.type !== 'redirect') {
											isFollowed = previousState;
										}
										await update({ reset: false });
									};
								}}
							>
								<button type="submit" class="follow-btn {isFollowed ? 'following' : ''}">
									{isFollowed ? 'Following' : 'Follow Doctor'}
								</button>
							</form>
						{:else}
							<form method="POST" action="?/follow">
								<!-- This will redirect to login from server side -->
								<button type="submit" class="follow-btn">Follow Doctor</button>
							</form>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="container main-content">
		<div class="left-col">
			{#if doctor.bio}
				<div class="card">
					<h2>About</h2>
					<div class="bio-content">
						{doctor.bio}
					</div>
				</div>
			{/if}

			<div class="card">
				<h2>Articles by {doctor.full_name}</h2>
				{#if articles.length > 0}
					<div class="articles-grid">
						{#each articles as article}
							<a href="/articles/{article.id}" class="article-card">
								{#if article.image}
									<div class="article-image" style="background-image: url('{article.image}')"></div>
								{:else}
									<div class="article-image-placeholder">
										<BookOpen size={24} />
									</div>
								{/if}
								<div class="article-info">
									<span class="category">{article.category || 'General'}</span>
									<h4>{article.title}</h4>
									<div class="meta">
										<Calendar size={12} />
										<span>{formatDate(article.created_at)}</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<div class="empty-articles">
						<BookOpen size={32} class="opacity-50 mb-2"/>
						<p>No articles published yet.</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="right-col">
			<div class="card stats-card">
				<h2>Professional Details</h2>
				<ul class="stats-list">
					{#if doctor.qualification}
						<li>
							<div class="icon-wrap"><Award size={18}/></div>
							<div class="stat-info">
								<span class="label">Qualification</span>
								<span class="value">{doctor.qualification}</span>
							</div>
						</li>
					{/if}
					{#if doctor.experience}
						<li>
							<div class="icon-wrap"><Calendar size={18}/></div>
							<div class="stat-info">
								<span class="label">Experience</span>
								<span class="value">{doctor.experience} Years</span>
							</div>
						</li>
					{/if}
					{#if doctor.patients_treated}
						<li>
							<div class="icon-wrap"><User size={18}/></div>
							<div class="stat-info">
								<span class="label">Patients Treated</span>
								<span class="value">{doctor.patients_treated}</span>
							</div>
						</li>
					{/if}
					{#if doctor.publications}
						<li>
							<div class="icon-wrap"><BookOpen size={18}/></div>
							<div class="stat-info">
								<span class="label">Publications</span>
								<span class="value">{doctor.publications}</span>
							</div>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.page-wrapper {
		min-height: 100vh;
		background: #f5f7fb;
		padding-top: 80px; /* Space for Nav */
		font-family: 'DM Sans', sans-serif;
		padding-bottom: 60px;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.profile-header {
		background: white;
		padding: 40px 0;
		border-bottom: 1px solid #e2e8f0;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 30px;
	}

	.avatar-section {
		flex-shrink: 0;
	}

	.avatar, .avatar-placeholder {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 4px solid #fff;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
	}

	.avatar-placeholder {
		background: #202866;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36px;
		font-weight: 700;
	}

	.info-section {
		flex: 1;
	}

	.info-section h1 {
		margin: 0 0 8px 0;
		font-size: 32px;
		color: #1e2a5e;
	}

	.designation {
		font-size: 16px;
		color: #475569;
		margin: 0 0 16px 0;
	}

	.tags {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 600;
	}

	.tag.bg-blue {
		background: #eef2ff;
		color: #4f46e5;
	}

	.tag.bg-gray {
		background: #f1f5f9;
		color: #475569;
	}

	.follow-btn {
		background: #202866;
		color: white;
		border: none;
		padding: 12px 30px;
		border-radius: 24px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(32, 40, 102, 0.2);
	}

	.follow-btn:hover {
		background: #313b86;
		transform: translateY(-2px);
	}

	.follow-btn.following {
		background: #f1f5f9;
		color: #475569;
		box-shadow: none;
	}

	.follow-btn.following:hover {
		background: #fee2e2;
		color: #ef4444;
	}

	.main-content {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 30px;
		margin-top: 30px;
	}

	.card {
		background: white;
		border-radius: 16px;
		padding: 30px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
		margin-bottom: 30px;
	}

	.card h2 {
		margin: 0 0 20px 0;
		font-size: 20px;
		color: #1e2a5e;
		border-bottom: 1px solid #f1f5f9;
		padding-bottom: 15px;
	}

	.bio-content {
		color: #475569;
		line-height: 1.7;
		font-size: 15px;
		white-space: pre-wrap;
	}

	.stats-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.stats-list li {
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.icon-wrap {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: #f8fafc;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #64748b;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-info .label {
		font-size: 12px;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: 600;
	}

	.stat-info .value {
		font-size: 15px;
		font-weight: 600;
		color: #1e2a5e;
	}

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 20px;
	}

	.article-card {
		border: 1px solid #f1f5f9;
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
	}

	.article-card:hover {
		box-shadow: 0 8px 24px rgba(0,0,0,0.06);
		transform: translateY(-4px);
		border-color: #e2e8f0;
	}

	.article-image {
		height: 140px;
		background-size: cover;
		background-position: center;
	}

	.article-image-placeholder {
		height: 140px;
		background: #f8fafc;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #cbd5e1;
	}

	.article-info {
		padding: 16px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.category {
		font-size: 11px;
		font-weight: 700;
		color: #4f46e5;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 8px;
	}

	.article-info h4 {
		margin: 0 0 12px 0;
		font-size: 15px;
		color: #1e2a5e;
		line-height: 1.4;
	}

	.meta {
		margin-top: auto;
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: #64748b;
	}

	.empty-articles {
		padding: 40px;
		text-align: center;
		color: #64748b;
		background: #f8fafc;
		border-radius: 12px;
		border: 1px dashed #cbd5e1;
	}

	@media (max-width: 900px) {
		.main-content {
			grid-template-columns: 1fr;
		}
		
		.header-content {
			flex-direction: column;
			text-align: center;
		}
		
		.tags {
			justify-content: center;
		}
	}
</style>
