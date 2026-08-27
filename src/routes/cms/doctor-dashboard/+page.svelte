<script lang="ts">
	import {
		BookOpen,
		FileText,
		Heart,
		Bookmark,
		Eye,
		Users,
		UserPlus,
		UserCheck,
		Clock,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		Stethoscope,
		ExternalLink,
		Bell,
		Plus,
		Search
	} from 'lucide-svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: stats = data.stats ?? {
		published: 0,
		draft: 0,
		pendingReview: 0,
		views: 0,
		bookmarks: 0,
		likes: 0
	};

	$: articles = data.articles ?? [];
	$: researchPapers = data.researchPapers ?? [];
	$: pendingArticles = data.pendingArticles ?? [];
	$: pendingResearch = data.pendingResearch ?? [];

	$: notifications = data.notifications ?? [];
	$: unreadCount = data.unreadCount ?? 0;

	/*
	 * Community
	 *
	 * followingDoctors = doctors whom THIS doctor follows
	 * followers       = doctors/users who follow THIS doctor
	 *
	 * The fallback keeps the page from crashing if the server
	 * hasn't returned these fields yet.
	 */
	$: followingDoctors =
		(data as any).followingDoctors ??
		(data as any).followedDoctors ??
		[];

	$: followers =
		(data as any).followers ??
		[];

	$: recentArticles = articles.slice(0, 5);

	function formatDate(date: string | null | undefined) {
		if (!date) return '';

		try {
			return new Date(date).toLocaleDateString('en-IN', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return '';
		}
	}

	function getDoctorInitials(name: string | null | undefined) {
		if (!name) return 'D';

		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join('')
			.toUpperCase();
	}

	function getStatusClass(status: string) {
		switch (status) {
			case 'published':
				return 'status published';

			case 'under_review':
				return 'status review';

			case 'draft':
				return 'status draft';

			default:
				return 'status';
		}
	}

	function getStatusLabel(status: string) {
		switch (status) {
			case 'published':
				return 'Published';

			case 'under_review':
				return 'Under Review';

			case 'draft':
				return 'Draft';

			default:
				return status || 'Unknown';
		}
	}
</script>

<svelte:head>
	<title>Doctor Dashboard | Jarurat Care Foundation</title>
</svelte:head>

<div class="page">
	<div class="container">

		<!-- ================================================= -->
		<!-- HEADER -->
		<!-- ================================================= -->

		<section class="hero">

			<div class="hero-left">

				<div class="profile-avatar">
					{getDoctorInitials(profile?.full_name)}
				</div>

				<div>
					<span class="eyebrow">
						DOCTOR DASHBOARD
					</span>

					<h1>
						Welcome back
						{#if profile?.full_name}
							, {profile.full_name}
						{/if}
					</h1>

					<p>
						Manage your articles, research papers,
						community connections and activity.
					</p>
				</div>

			</div>

			<div class="hero-actions">

				<a
					href="/cms/doctor-dashboard/articles"
					class="secondary-button"
				>
					<BookOpen size={16} />
					My Articles
				</a>

				<a
					href="/cms/doctor-dashboard/my-research-papers"
					class="primary-button"
				>
					<Plus size={16} />
					New Research
				</a>

			</div>

		</section>


		<!-- ================================================= -->
		<!-- STATS -->
		<!-- ================================================= -->

		<section class="stats-grid">

			<div class="stat-card">
				<div class="stat-icon blue">
					<CheckCircle2 size={20} />
				</div>

				<div>
					<span>Published</span>
					<strong>{stats.published}</strong>
				</div>
			</div>


			<div class="stat-card">
				<div class="stat-icon orange">
					<Clock size={20} />
				</div>

				<div>
					<span>Drafts</span>
					<strong>{stats.draft}</strong>
				</div>
			</div>


			<div class="stat-card">
				<div class="stat-icon purple">
					<AlertCircle size={20} />
				</div>

				<div>
					<span>Pending Review</span>
					<strong>{stats.pendingReview}</strong>
				</div>
			</div>


			<div class="stat-card">
				<div class="stat-icon green">
					<Eye size={20} />
				</div>

				<div>
					<span>Total Views</span>
					<strong>{stats.views}</strong>
				</div>
			</div>


			<div class="stat-card">
				<div class="stat-icon red">
					<Heart size={20} />
				</div>

				<div>
					<span>Total Likes</span>
					<strong>{stats.likes}</strong>
				</div>
			</div>


			<div class="stat-card">
				<div class="stat-icon teal">
					<Bookmark size={20} />
				</div>

				<div>
					<span>Total Saves</span>
					<strong>{stats.bookmarks}</strong>
				</div>
			</div>

		</section>


		<!-- ================================================= -->
		<!-- COMMUNITY -->
		<!-- ================================================= -->

		<section class="section">

			<div class="section-heading">

				<div>
					<span class="section-label">
						COMMUNITY
					</span>

					<h2>Your Community</h2>

					<p>
						See the doctors you follow and the people
						following you.
					</p>
				</div>

				<a
					href="/cms/community/doctors"
					class="outline-button"
				>
					<Search size={15} />
					Find Doctors
				</a>

			</div>


			<div class="community-grid">

				<!-- ========================================= -->
				<!-- FOLLOWING -->
				<!-- ========================================= -->

				<div class="community-card">

					<div class="community-card-header">

						<div class="community-title">

							<div class="community-icon following-icon">
								<UserCheck size={19} />
							</div>

							<div>
								<h3>Following</h3>

								<span>
									{followingDoctors.length}
									{followingDoctors.length === 1
										? ' doctor'
										: ' doctors'}
								</span>
							</div>

						</div>

					</div>


					{#if followingDoctors.length > 0}

						<div class="doctor-list">

							{#each followingDoctors as doctor}

								<a
									href={`/doctor/${doctor.id}`}
									class="doctor-row"
								>

									<div class="doctor-avatar">
										{getDoctorInitials(
											doctor.name ||
												doctor.full_name
										)}
									</div>

									<div class="doctor-info">

										<strong>
											{doctor.name ||
												doctor.full_name ||
												'Unknown Doctor'}
										</strong>

										{#if doctor.specialization}
											<span>
												{doctor.specialization}
											</span>
										{:else if doctor.organization}
											<span>
												{doctor.organization}
											</span>
										{:else}
											<span>
												Doctor
											</span>
										{/if}

									</div>

									<ArrowRight
										size={16}
										class="row-arrow"
									/>

								</a>

							{/each}

						</div>

					{:else}

						<div class="empty-community">

							<UserPlus size={30} />

							<h4>
								You're not following anyone yet
							</h4>

							<p>
								Follow doctors whose work interests
								you and they will appear here.
							</p>

							<a
								href="/cms/community/doctors"
								class="small-button"
							>
								Find Doctors
							</a>

						</div>

					{/if}

				</div>


				<!-- ========================================= -->
				<!-- FOLLOWERS -->
				<!-- ========================================= -->

				<div class="community-card">

					<div class="community-card-header">

						<div class="community-title">

							<div class="community-icon follower-icon">
								<Users size={19} />
							</div>

							<div>
								<h3>Followers</h3>

								<span>
									{followers.length}
									{followers.length === 1
										? ' follower'
										: ' followers'}
								</span>
							</div>

						</div>

					</div>


					{#if followers.length > 0}

						<div class="doctor-list">

							{#each followers as doctor}

								<a
									href={`/doctor/${doctor.id}`}
									class="doctor-row"
								>

									<div class="doctor-avatar follower-avatar">
										{getDoctorInitials(
											doctor.name ||
												doctor.full_name
										)}
									</div>

									<div class="doctor-info">

										<strong>
											{doctor.name ||
												doctor.full_name ||
												'Unknown User'}
										</strong>

										{#if doctor.specialization}
											<span>
												{doctor.specialization}
											</span>
										{:else if doctor.organization}
											<span>
												{doctor.organization}
											</span>
										{:else}
											<span>
												Community Member
											</span>
										{/if}

									</div>

									<ArrowRight
										size={16}
										class="row-arrow"
									/>

								</a>

							{/each}

						</div>

					{:else}

						<div class="empty-community">

							<Users size={30} />

							<h4>
								No followers yet
							</h4>

							<p>
								When doctors or community members
								follow you, they will appear here.
							</p>

						</div>

					{/if}

				</div>

			</div>

		</section>


		<!-- ================================================= -->
		<!-- NOTIFICATIONS -->
		<!-- ================================================= -->

		<section class="section">

			<div class="section-heading">

				<div>
					<span class="section-label">
						ACTIVITY
					</span>

					<h2>Notifications</h2>

					<p>
						Your latest community and review updates.
					</p>
				</div>

				{#if unreadCount > 0}
					<span class="notification-badge">
						{unreadCount} unread
					</span>
				{/if}

			</div>


			<div class="panel">

				{#if notifications.length > 0}

					<div class="notification-list">

						{#each notifications as notification}

							<a
								href={notification.link || '#'}
								class:unread={!notification.is_read}
								class="notification-row"
							>

								<div class="notification-icon">
									<Bell size={17} />
								</div>

								<div class="notification-content">

									<strong>
										{notification.title}
									</strong>

									<p>
										{notification.message}
									</p>

									{#if notification.created_at}
										<span>
											{formatDate(
												notification.created_at
											)}
										</span>
									{/if}

								</div>

							</a>

						{/each}

					</div>

				{:else}

					<div class="empty-panel">
						<Bell size={28} />
						<h3>No notifications</h3>
						<p>
							You're all caught up.
						</p>
					</div>

				{/if}

			</div>

		</section>


		<!-- ================================================= -->
		<!-- MY ARTICLES -->
		<!-- ================================================= -->

		<section class="section">

			<div class="section-heading">

				<div>
					<span class="section-label">
						PUBLICATIONS
					</span>

					<h2>My Articles</h2>

					<p>
						Your latest articles and their current status.
					</p>
				</div>

				<a
					href="/cms/doctor-dashboard/articles"
					class="outline-button"
				>
					View All
					<ArrowRight size={15} />
				</a>

			</div>


			<div class="panel">

				{#if recentArticles.length > 0}

					<div class="content-list">

						{#each recentArticles as article}

							<div class="content-row">

								<div class="content-type-icon">
									<FileText size={18} />
								</div>

								<div class="content-info">

									<strong>
										{article.title}
									</strong>

									<div class="content-meta">

										{#if article.created_at}
											<span>
												{formatDate(
													article.created_at
												)}
											</span>
										{/if}

										<span>
											{article.views ?? 0}
											views
										</span>

									</div>

								</div>

								<span
									class={getStatusClass(
										article.status
									)}
								>
									{getStatusLabel(
										article.status
									)}
								</span>

							</div>

						{/each}

					</div>

				{:else}

					<div class="empty-panel">
						<FileText size={30} />

						<h3>
							No articles yet
						</h3>

						<p>
							Create your first article to start
							sharing your knowledge.
						</p>

						<a
							href="/cms/doctor-dashboard/articles"
							class="small-button"
						>
							Create Article
						</a>
					</div>

				{/if}

			</div>

		</section>


		<!-- ================================================= -->
		<!-- RESEARCH PAPERS -->
		<!-- ================================================= -->

		<section class="section">

			<div class="section-heading">

				<div>
					<span class="section-label">
						RESEARCH
					</span>

					<h2>My Research Papers</h2>

					<p>
						Manage your research publications and submissions.
					</p>
				</div>

				<a
					href="/cms/doctor-dashboard/my-research-papers"
					class="outline-button"
				>
					View Research
					<ArrowRight size={15} />
				</a>

			</div>


			<div class="panel">

				{#if researchPapers.length > 0}

					<div class="content-list">

						{#each researchPapers.slice(0, 5) as research}

							<div class="content-row">

								<div class="content-type-icon research">
									<BookOpen size={18} />
								</div>

								<div class="content-info">

									<strong>
										{research.title}
									</strong>

									<div class="content-meta">

										{#if research.created_at}
											<span>
												{formatDate(
													research.created_at
												)}
											</span>
										{/if}

										<span>
											{research.views_count ?? 0}
											views
										</span>

									</div>

								</div>

								<span
									class={getStatusClass(
										research.status
									)}
								>
									{getStatusLabel(
										research.status
									)}
								</span>

							</div>

						{/each}

					</div>

				{:else}

					<div class="empty-panel">
						<BookOpen size={30} />

						<h3>
							No research papers yet
						</h3>

						<p>
							Your research papers will appear here.
						</p>

						<a
							href="/cms/doctor-dashboard/my-research-papers"
							class="small-button"
						>
							Go to Research
						</a>
					</div>

				{/if}

			</div>

		</section>


		<!-- ================================================= -->
		<!-- REVIEW QUEUE -->
		<!-- ================================================= -->

		{#if profile?.is_reviewer}

			<section class="section">

				<div class="section-heading">

					<div>
						<span class="section-label">
							REVIEWER
						</span>

						<h2>Review Queue</h2>

						<p>
							Content waiting for your review.
						</p>
					</div>

				</div>


				<div class="review-grid">

					<div class="review-card">

						<div class="review-card-top">
							<div class="review-icon">
								<FileText size={19} />
							</div>

							<span>
								{pendingArticles.length}
							</span>
						</div>

						<h3>
							Articles
						</h3>

						<p>
							Articles waiting for review.
						</p>

						<a
							href="/cms/doctor-dashboard/review-articles"
						>
							Review Articles
							<ArrowRight size={15} />
						</a>

					</div>


					<div class="review-card">

						<div class="review-card-top">
							<div class="review-icon research">
								<BookOpen size={19} />
							</div>

							<span>
								{pendingResearch.length}
							</span>
						</div>

						<h3>
							Research Papers
						</h3>

						<p>
							Research papers waiting for review.
						</p>

						<a
							href="/cms/doctor-dashboard/review-research"
						>
							Review Research
							<ArrowRight size={15} />
						</a>

					</div>

				</div>

			</section>

		{/if}

	</div>
</div>


<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;

		background: #f8fafc;
		color: #0f172a;
	}


	.page {
		min-height: 100vh;

		padding: 30px 24px 70px;

		background:
			linear-gradient(
				180deg,
				#f8fafc 0%,
				#f4f7fb 100%
			);
	}


	.container {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		gap: 28px;
	}


	/* ============================= */
	/* HERO */
	/* ============================= */

	.hero {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;

		padding: 28px 30px;

		background: white;

		border: 1px solid #e2e8f0;
		border-radius: 18px;

		box-shadow:
			0 5px 20px rgba(15, 23, 42, 0.05);
	}


	.hero-left {
		display: flex;
		align-items: center;
		gap: 18px;
	}


	.profile-avatar {
		width: 64px;
		height: 64px;

		display: flex;
		align-items: center;
		justify-content: center;

		flex-shrink: 0;

		border-radius: 16px;

		background: #eff6ff;
		border: 1px solid #dbeafe;

		color: #1d4ed8;

		font-size: 20px;
		font-weight: 800;
	}


	.eyebrow,
	.section-label {
		display: block;

		font-size: 11px;
		font-weight: 800;

		letter-spacing: 0.08em;

		color: #64748b;

		margin-bottom: 5px;
	}


	.hero h1 {
		margin: 0;

		font-size: 27px;
		line-height: 1.2;

		color: #0f172a;
	}


	.hero p {
		margin: 7px 0 0;

		font-size: 13px;

		color: #64748b;
	}


	.hero-actions {
		display: flex;
		gap: 9px;
		flex-shrink: 0;
	}


	.primary-button,
	.secondary-button,
	.outline-button,
	.small-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		gap: 7px;

		text-decoration: none;

		border-radius: 9px;

		font-size: 12px;
		font-weight: 700;

		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;
	}


	.primary-button {
		padding: 10px 15px;

		background: #2563eb;
		color: white;

		box-shadow:
			0 4px 10px rgba(37, 99, 235, 0.18);
	}


	.secondary-button {
		padding: 10px 15px;

		background: #f8fafc;
		color: #334155;

		border: 1px solid #e2e8f0;
	}


	.outline-button {
		padding: 9px 13px;

		background: white;

		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.small-button {
		padding: 9px 13px;

		background: #eff6ff;

		color: #2563eb;
	}


	.primary-button:hover,
	.secondary-button:hover,
	.outline-button:hover,
	.small-button:hover {
		transform: translateY(-1px);
	}


	/* ============================= */
	/* STATS */
	/* ============================= */

	.stats-grid {
		display: grid;

		grid-template-columns:
			repeat(6, minmax(0, 1fr));

		gap: 12px;
	}


	.stat-card {
		display: flex;
		align-items: center;

		gap: 11px;

		padding: 16px;

		background: white;

		border: 1px solid #e2e8f0;
		border-radius: 13px;
	}


	.stat-icon {
		width: 38px;
		height: 38px;

		display: flex;
		align-items: center;
		justify-content: center;

		flex-shrink: 0;

		border-radius: 10px;
	}


	.stat-icon.blue {
		background: #eff6ff;
		color: #2563eb;
	}

	.stat-icon.orange {
		background: #fff7ed;
		color: #ea580c;
	}

	.stat-icon.purple {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.stat-icon.green {
		background: #ecfdf5;
		color: #059669;
	}

	.stat-icon.red {
		background: #fef2f2;
		color: #dc2626;
	}

	.stat-icon.teal {
		background: #f0fdfa;
		color: #0f766e;
	}


	.stat-card span {
		display: block;

		font-size: 11px;

		color: #64748b;
	}


	.stat-card strong {
		display: block;

		margin-top: 2px;

		font-size: 20px;

		color: #0f172a;
	}


	/* ============================= */
	/* SECTIONS */
	/* ============================= */

	.section {
		display: flex;
		flex-direction: column;

		gap: 13px;
	}


	.section-heading {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;

		gap: 20px;

		padding: 0 2px;
	}


	.section-heading h2 {
		margin: 0;

		font-size: 21px;

		color: #0f172a;
	}


	.section-heading p {
		margin: 4px 0 0;

		font-size: 13px;

		color: #64748b;
	}


	/* ============================= */
	/* COMMUNITY */
	/* ============================= */

	.community-grid {
		display: grid;

		grid-template-columns:
			repeat(2, minmax(0, 1fr));

		gap: 18px;
	}


	.community-card {
		background: white;

		border: 1px solid #e2e8f0;

		border-radius: 16px;

		overflow: hidden;

		box-shadow:
			0 3px 12px rgba(15, 23, 42, 0.035);
	}


	.community-card-header {
		padding: 18px 20px;

		border-bottom: 1px solid #eef2f7;
	}


	.community-title {
		display: flex;
		align-items: center;

		gap: 12px;
	}


	.community-icon {
		width: 40px;
		height: 40px;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 10px;
	}


	.following-icon {
		background: #eff6ff;
		color: #2563eb;
	}


	.follower-icon {
		background: #f0fdf4;
		color: #16a34a;
	}


	.community-title h3 {
		margin: 0;

		font-size: 16px;

		color: #0f172a;
	}


	.community-title span {
		display: block;

		margin-top: 2px;

		font-size: 11px;

		color: #64748b;
	}


	.doctor-list {
		display: flex;
		flex-direction: column;
	}


	.doctor-row {
		display: flex;
		align-items: center;

		gap: 12px;

		padding: 14px 20px;

		text-decoration: none;

		border-bottom: 1px solid #f1f5f9;

		transition: background 0.18s ease;
	}


	.doctor-row:last-child {
		border-bottom: none;
	}


	.doctor-row:hover {
		background: #f8fafc;
	}


	.doctor-avatar {
		width: 40px;
		height: 40px;

		display: flex;
		align-items: center;
		justify-content: center;

		flex-shrink: 0;

		border-radius: 11px;

		background: #eff6ff;

		color: #2563eb;

		font-size: 12px;
		font-weight: 800;
	}


	.follower-avatar {
		background: #f0fdf4;
		color: #15803d;
	}


	.doctor-info {
		min-width: 0;

		flex: 1;
	}


	.doctor-info strong {
		display: block;

		font-size: 13px;

		color: #0f172a;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}


	.doctor-info span {
		display: block;

		margin-top: 3px;

		font-size: 11px;

		color: #64748b;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}


	.row-arrow {
		flex-shrink: 0;

		color: #94a3b8;
	}


	.empty-community {
		min-height: 230px;

		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;

		text-align: center;

		padding: 30px 25px;

		color: #94a3b8;
	}


	.empty-community h4 {
		margin: 12px 0 5px;

		font-size: 16px;
		font-weight: 600;

		color: #1e3a8a;
	}


	.empty-community p {
		max-width: 390px;

		margin: 0 0 15px;

		font-size: 12px;
		line-height: 1.6;

		color: #64748b;
	}


	/* ============================= */
	/* PANELS */
	/* ============================= */

	.panel {
		background: white;

		border: 1px solid #e2e8f0;

		border-radius: 15px;

		overflow: hidden;

		box-shadow:
			0 3px 12px rgba(15, 23, 42, 0.035);
	}


	.notification-list,
	.content-list {
		display: flex;
		flex-direction: column;
	}


	.notification-row {
		display: flex;

		gap: 13px;

		padding: 16px 20px;

		text-decoration: none;

		border-bottom: 1px solid #f1f5f9;
	}


	.notification-row:last-child,
	.content-row:last-child {
		border-bottom: none;
	}


	.notification-row.unread {
		background: #f8fbff;
	}


	.notification-icon {
		width: 36px;
		height: 36px;

		display: flex;
		align-items: center;
		justify-content: center;

		flex-shrink: 0;

		border-radius: 9px;

		background: #eff6ff;
		color: #2563eb;
	}


	.notification-content {
		min-width: 0;
	}


	.notification-content strong {
		font-size: 13px;
		color: #0f172a;
	}


	.notification-content p {
		margin: 3px 0;

		font-size: 12px;

		color: #64748b;
	}


	.notification-content span {
		font-size: 10px;

		color: #94a3b8;
	}


	.notification-badge {
		padding: 6px 9px;

		border-radius: 999px;

		background: #eff6ff;

		color: #2563eb;

		font-size: 11px;
		font-weight: 700;
	}


	.content-row {
		display: flex;
		align-items: center;

		gap: 13px;

		padding: 16px 20px;

		border-bottom: 1px solid #f1f5f9;
	}


	.content-type-icon {
		width: 38px;
		height: 38px;

		display: flex;
		align-items: center;
		justify-content: center;

		flex-shrink: 0;

		border-radius: 9px;

		background: #eff6ff;

		color: #2563eb;
	}


	.content-type-icon.research {
		background: #f5f3ff;
		color: #7c3aed;
	}


	.content-info {
		min-width: 0;
		flex: 1;
	}


	.content-info strong {
		display: block;

		font-size: 13px;

		color: #0f172a;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}


	.content-meta {
		display: flex;

		gap: 12px;

		margin-top: 4px;

		font-size: 10px;

		color: #94a3b8;
	}


	.status {
		flex-shrink: 0;

		padding: 5px 8px;

		border-radius: 999px;

		font-size: 10px;
		font-weight: 700;

		background: #f1f5f9;
		color: #64748b;
	}


	.status.published {
		background: #ecfdf5;
		color: #047857;
	}


	.status.review {
		background: #fff7ed;
		color: #c2410c;
	}


	.status.draft {
		background: #f8fafc;
		color: #64748b;
	}


	.empty-panel {
		min-height: 220px;

		display: flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;

		text-align: center;

		padding: 30px;

		color: #94a3b8;
	}


	.empty-panel h3 {
		margin: 10px 0 4px;

		font-size: 16px;

		color: #334155;
	}


	.empty-panel p {
		margin: 0 0 15px;

		font-size: 12px;

		color: #64748b;
	}


	/* ============================= */
	/* REVIEW */
	/* ============================= */

	.review-grid {
		display: grid;

		grid-template-columns:
			repeat(2, minmax(0, 1fr));

		gap: 18px;
	}


	.review-card {
		padding: 20px;

		background: white;

		border: 1px solid #e2e8f0;

		border-radius: 15px;
	}


	.review-card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.review-icon {
		width: 40px;
		height: 40px;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 10px;

		background: #eff6ff;
		color: #2563eb;
	}


	.review-icon.research {
		background: #f5f3ff;
		color: #7c3aed;
	}


	.review-card-top > span {
		font-size: 22px;
		font-weight: 800;

		color: #0f172a;
	}


	.review-card h3 {
		margin: 16px 0 4px;

		font-size: 16px;
	}


	.review-card p {
		margin: 0;

		font-size: 12px;

		color: #64748b;
	}


	.review-card a {
		display: inline-flex;
		align-items: center;

		gap: 6px;

		margin-top: 16px;

		font-size: 12px;
		font-weight: 700;

		color: #2563eb;

		text-decoration: none;
	}


	/* ============================= */
	/* RESPONSIVE */
	/* ============================= */

	@media (max-width: 1050px) {

		.stats-grid {
			grid-template-columns:
				repeat(3, minmax(0, 1fr));
		}

	}


	@media (max-width: 800px) {

		.hero {
			align-items: flex-start;

			flex-direction: column;
		}


		.hero-actions {
			width: 100%;
		}


		.hero-actions a {
			flex: 1;
		}


		.community-grid,
		.review-grid {
			grid-template-columns: 1fr;
		}

	}


	@media (max-width: 600px) {

		.page {
			padding: 24px 15px 45px;
		}


		.stats-grid {
			grid-template-columns:
				repeat(2, minmax(0, 1fr));
		}


		.section-heading {
			align-items: flex-start;

			flex-direction: column;
		}


		.section-heading .outline-button {
			width: 100%;
		}


		.content-row {
			align-items: flex-start;
		}


		.content-row .status {
			display: none;
		}


		.hero {
			padding: 21px;
		}


		.hero-left {
			align-items: flex-start;
		}


		.hero h1 {
			font-size: 22px;
		}

	}


	@media (max-width: 430px) {

		.stats-grid {
			grid-template-columns: 1fr;
		}


		.hero-actions {
			flex-direction: column;
		}


		.doctor-row {
			padding-left: 15px;
			padding-right: 15px;
		}

	}
</style>