<script lang="ts">
	import {
		LayoutDashboard,
		Users,
		FileText,
		BookOpen,
		ShieldCheck,
		LogOut,
		Globe,
		CheckCircle,
		Clock,
		AlertCircle,
		Search,
		TrendingUp,
		Heart,
		Bookmark,
		MessageCircle,
		Eye,
		BarChart3,
		UserCheck,
		Stethoscope,
		Star,
		ArrowUpRight,
		Download,
		Share2,
		XCircle
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	export let data;

	$: pendingDoctors = data?.pendingDoctors || [];
	$: users = data?.users || [];
	$: approvedArticles = data?.approvedArticles || [];
	$: approvedResearch = data?.approvedResearch || [];
	$: cmsContents = data?.cmsContents || [];
	$: publishingDoctors = data?.publishingDoctors || [];
	$: publishedContent = data?.publishedContent || [];
	$: currentUser = data?.currentUser || {};
	$: analytics = data?.analytics || {};

	let activeSection = 'overview';
	let searchTerm = '';
	let doctorToApprove: any = null;

	/* =========================================================
	   SAFE ANALYTICS VALUES
	   ========================================================= */

	$: totalViews = Number(analytics.totalViews ?? 0);

	$: uniqueVisitors = Number(
		analytics.uniqueVisitors ??
			analytics.uniqueVisitorCount ??
			analytics.visitors ??
			0
	);

	$: totalLikes = Number(
		analytics.totalLikes ??
			analytics.likes ??
			0
	);

	$: totalSaves = Number(
		analytics.totalSaves ??
			analytics.saves ??
			0
	);

	$: totalShares = Number(
		analytics.totalShares ??
			analytics.shares ??
			0
	);

	$: totalDownloads = Number(
		analytics.totalDownloads ??
			analytics.downloads ??
			0
	);

	$: totalComments = Number(
		analytics.totalComments ??
			analytics.comments ??
			0
	);

	$: dailyActiveUsersTrend = Array.isArray(analytics.dailyActiveUsers)
		? analytics.dailyActiveUsers
		: [];

	$: dailyActiveUsersValue = Array.isArray(analytics.dailyActiveUsers)
		? Math.max(
				...analytics.dailyActiveUsers.map((item: any) =>
					Number(item.users ?? item.count ?? item.value ?? 0)
				),
				0
			)
		: Number(analytics.dailyActiveUsers ?? 0);

	$: engagementTrend = Array.isArray(analytics.engagementTrend)
		? analytics.engagementTrend
		: [];

	$: mostPopularContent = Array.isArray(analytics.mostPopularContent)
		? analytics.mostPopularContent
		: [];

	$: articlesByCategory = Array.isArray(analytics.articlesByCategory)
		? analytics.articlesByCategory
		: [];

	/* =========================================================
	   USER FILTER
	   ========================================================= */

	$: filteredUsers = users.filter((user: any) => {
		const search = searchTerm.toLowerCase().trim();

		if (!search) return true;

		return (
			(user.full_name || '').toLowerCase().includes(search) ||
			(user.email || '').toLowerCase().includes(search) ||
			(user.role || '').toLowerCase().includes(search)
		);
	});

	/* =========================================================
	   HELPERS
	   ========================================================= */

	function formatNumber(value: number | string | null | undefined) {
		return new Intl.NumberFormat('en-IN').format(Number(value) || 0);
	}

	function formatDate(date: string | null | undefined) {
		if (!date) return 'N/A';

		const parsed = new Date(date);

		if (Number.isNaN(parsed.getTime())) {
			return 'N/A';
		}

		return parsed.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatShortDate(date: string | null | undefined) {
		if (!date) return '';

		const parsed = new Date(date);

		if (Number.isNaN(parsed.getTime())) {
			return '';
		}

		return parsed.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	function getStatusClass(status: string | null | undefined) {
		switch (status) {
			case 'published':
				return 'status published';

			case 'approved':
				return 'status approved';

			case 'under_review':
				return 'status review';

			case 'changes_requested':
				return 'status rejected';

			case 'rejected':
				return 'status rejected';

			default:
				return 'status';
		}
	}

	function getPercentage(
		value: number | string | null | undefined,
		total: number | string | null | undefined
	) {
		const v = Number(value) || 0;
		const t = Number(total) || 0;

		if (!t) return 0;

		return Math.min(100, Math.max(0, (v / t) * 100));
	}

	function getTrendHeight(value: number | string | null | undefined) {
		const number = Number(value) || 0;

		if (number <= 0) return 3;

		return Math.min(100, number * 12 + 8);
	}
</script>

<svelte:head>
	<title>Super Admin Dashboard | Jarurat Care</title>
</svelte:head>

<div class="dashboard">

	<!-- =========================================================
	     SIDEBAR
	     ========================================================= -->

	<aside class="sidebar">

		<div class="sidebar-brand">
			<div class="brand-icon">
				<img src="/logo.png" alt="Jarurat Care" />
			</div>

			<div>
				<div class="brand-name">Jarurat Care</div>
				<div class="brand-role">Super Admin</div>
			</div>
		</div>

		<div class="sidebar-content">

			<div class="menu-label">MAIN</div>

			<button
				type="button"
				class:active={activeSection === 'overview'}
				class="menu-item"
				on:click={() => (activeSection = 'overview')}
			>
				<LayoutDashboard size={18} />
				<span>Overview</span>
			</button>

			<div class="menu-label">MANAGEMENT</div>

			<button
				type="button"
				class:active={activeSection === 'doctor-verification'}
				class="menu-item"
				on:click={() => (activeSection = 'doctor-verification')}
			>
				<ShieldCheck size={18} />
				<span>Doctor Verification</span>

				{#if pendingDoctors.length > 0}
					<span class="menu-count">
						{pendingDoctors.length}
					</span>
				{/if}
			</button>

			<button
				type="button"
				class:active={activeSection === 'publishing'}
				class="menu-item"
				on:click={() => (activeSection = 'publishing')}
			>
				<UserCheck size={18} />
				<span>Publishing Power</span>
			</button>

			<button
				type="button"
				class:active={activeSection === 'articles'}
				class="menu-item"
				on:click={() => (activeSection = 'articles')}
			>
				<FileText size={18} />
				<span>Articles</span>
			</button>

			<button
				type="button"
				class:active={activeSection === 'research'}
				class="menu-item"
				on:click={() => (activeSection = 'research')}
			>
				<BookOpen size={18} />
				<span>Research Papers</span>
			</button>

			<button
				type="button"
				class:active={activeSection === 'cms'}
				class="menu-item"
				on:click={() => (activeSection = 'cms')}
			>
				<Globe size={18} />
				<span>CMS Content</span>
			</button>

			<button
				type="button"
				class:active={activeSection === 'users'}
				class="menu-item"
				on:click={() => (activeSection = 'users')}
			>
				<Users size={18} />
				<span>Manage Users</span>
			</button>

			<div class="menu-label">ANALYTICS</div>

			<button
				type="button"
				class:active={activeSection === 'analytics'}
				class="menu-item"
				on:click={() => (activeSection = 'analytics')}
			>
				<BarChart3 size={18} />
				<span>Analytics</span>
			</button>

		</div>

		<div class="sidebar-bottom">

			<a href="/" target="_blank" rel="noreferrer" class="website-link">
				<Globe size={17} />
				<span>View Website</span>
				<ArrowUpRight size={14} />
			</a>

			<a href="/cms/login" class="logout-link">
				<LogOut size={17} />
				<span>Logout</span>
			</a>

		</div>

	</aside>

	<!-- =========================================================
	     MAIN
	     ========================================================= -->

	<main class="main">

		<!-- =====================================================
		     TOPBAR
		     ===================================================== -->

		<header class="topbar">

			<div>

				<div class="breadcrumb">
					Super Admin
					<span>/</span>
					{activeSection.replaceAll('-', ' ')}
				</div>

				<h1>
					{#if activeSection === 'overview'}
						Admin Overview
					{:else if activeSection === 'doctor-verification'}
						Doctor Verification
					{:else if activeSection === 'publishing'}
						Publishing Power
					{:else if activeSection === 'articles'}
						Articles
					{:else if activeSection === 'research'}
						Research Papers
					{:else if activeSection === 'cms'}
						CMS Content
					{:else if activeSection === 'users'}
						Manage Users
					{:else if activeSection === 'analytics'}
						Analytics
					{/if}
				</h1>

			</div>

			<div class="admin-profile">

				<div class="admin-avatar">

					{#if currentUser?.avatar}
						<img
							src={currentUser.avatar}
							alt="Admin profile"
						/>
					{:else if currentUser?.avatar_url}
						<img
							src={currentUser.avatar_url}
							alt="Admin profile"
						/>
					{:else}
						{(
							currentUser?.full_name ||
							currentUser?.name ||
							'A'
						).charAt(0).toUpperCase()}
					{/if}

				</div>

				<div class="admin-info">

					<strong>
						{currentUser?.full_name ||
							currentUser?.name ||
							'Super Admin'}
					</strong>

					<span>
						{currentUser?.role || 'Super Admin'}
					</span>

				</div>

			</div>

		</header>

		<div class="page-content">

			<!-- =================================================
			     OVERVIEW
			     ================================================= -->

			{#if activeSection === 'overview'}

				<div class="section-heading">

					<div>
						<h2>Admin Overview</h2>
						<p>
							Monitor platform activity, content and administration.
						</p>
					</div>

				</div>

				<div class="overview-grid">

					<div class="stat-card">
						<div class="stat-icon blue">
							<Users size={20} />
						</div>

						<div>
							<span>Total Users</span>
							<strong>{formatNumber(users.length)}</strong>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon purple">
							<FileText size={20} />
						</div>

						<div>
							<span>Articles</span>
							<strong>{formatNumber(approvedArticles.length)}</strong>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon green">
							<BookOpen size={20} />
						</div>

						<div>
							<span>Research Papers</span>
							<strong>{formatNumber(approvedResearch.length)}</strong>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon orange">
							<ShieldCheck size={20} />
						</div>

						<div>
							<span>Pending Doctors</span>
							<strong>{formatNumber(pendingDoctors.length)}</strong>
						</div>
					</div>

				</div>

				<div class="overview-two-column">

					<div class="panel">

						<div class="panel-header">
							<div>
								<h3>Recent Content</h3>
								<p>Latest published content</p>
							</div>

							<button
								type="button"
								class="text-button"
								on:click={() => (activeSection = 'articles')}
							>
								View Articles
							</button>
						</div>

						<div class="content-list">

							{#if publishedContent.length > 0}

								{#each publishedContent.slice(0, 6) as content}

									<div class="content-row">

										<div class="content-type-icon">
											<FileText size={16} />
										</div>

										<div class="content-row-main">
											<strong>
												{content.title || 'Untitled'}
											</strong>

											<span>
												{content.content_type ||
													content.type ||
													'Content'}
												•
												{formatDate(content.created_at)}
											</span>
										</div>

										<span class={getStatusClass(content.status)}>
											{content.status || 'published'}
										</span>

									</div>

								{/each}

							{:else}

								<div class="empty-small">
									No published content available.
								</div>

							{/if}

						</div>

					</div>

					<div class="panel">

						<div class="panel-header">

							<div>
								<h3>Quick Stats</h3>
								<p>Platform summary</p>
							</div>

						</div>

						<div class="quick-stats">

							<div>
								<span>Doctor Requests</span>
								<strong>{formatNumber(pendingDoctors.length)}</strong>
							</div>

							<div>
								<span>CMS Content</span>
								<strong>{formatNumber(cmsContents.length)}</strong>
							</div>

							<div>
								<span>Views</span>
								<strong>{formatNumber(totalViews)}</strong>
							</div>

							<div>
								<span>Likes</span>
								<strong>{formatNumber(totalLikes)}</strong>
							</div>

						</div>

					</div>

				</div>

			<!-- =================================================
			     ANALYTICS
			     ================================================= -->

			{:else if activeSection === 'analytics'}

				<div class="section-heading">

					<div>
						<h2>Data Analytics</h2>

						<p>
							Monitor content performance, reader activity and
							engagement across Jarurat Care.
						</p>
					</div>

				</div>

				<!-- =============================================
				     1-8 PRIMARY ANALYTICS
				     ============================================= -->

				<div class="analytics-grid">

					<!-- TOTAL VIEWS -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon views">
								<Eye size={19} />
							</div>

							<span class="analytics-label">
								TOTAL VIEWS
							</span>

						</div>

						<strong>
							{formatNumber(totalViews)}
						</strong>

						<span class="analytics-description">
							Total views across published content
						</span>

					</div>

					<!-- UNIQUE VISITORS -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon visitors">
								<Users size={19} />
							</div>

							<span class="analytics-label">
								UNIQUE VISITORS
							</span>

						</div>

						<strong>
							{formatNumber(uniqueVisitors)}
						</strong>

						<span class="analytics-description">
							Distinct visitors from tracked sessions
						</span>

					</div>

					<!-- DAU -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon active">
								<TrendingUp size={19} />
							</div>

							<span class="analytics-label">
								DAILY ACTIVE USERS
							</span>

						</div>

						<strong>
							{formatNumber(dailyActiveUsersValue)}
						</strong>

						<span class="analytics-description">
							Active users from tracked activity
						</span>

					</div>

					<!-- LIKES -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon likes">
								<Heart size={19} />
							</div>

							<span class="analytics-label">
								LIKES
							</span>

						</div>

						<strong>
							{formatNumber(totalLikes)}
						</strong>

						<span class="analytics-description">
							Article likes recorded
						</span>

					</div>

					<!-- SAVES -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon saves">
								<Bookmark size={19} />
							</div>

							<span class="analytics-label">
								SAVES
							</span>

						</div>

						<strong>
							{formatNumber(totalSaves)}
						</strong>

						<span class="analytics-description">
							Articles saved by readers
						</span>

					</div>

					<!-- SHARES -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon shares">
								<Share2 size={19} />
							</div>

							<span class="analytics-label">
								SHARES
							</span>

						</div>

						<strong>
							{formatNumber(totalShares)}
						</strong>

						<span class="analytics-description">
							Content shares recorded
						</span>

					</div>

					<!-- DOWNLOADS -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon downloads">
								<Download size={19} />
							</div>

							<span class="analytics-label">
								DOWNLOADS
							</span>

						</div>

						<strong>
							{formatNumber(totalDownloads)}
						</strong>

						<span class="analytics-description">
							Content downloads recorded
						</span>

					</div>

					<!-- COMMENTS -->

					<div class="analytics-card">

						<div class="analytics-card-top">

							<div class="analytics-icon comments">
								<MessageCircle size={19} />
							</div>

							<span class="analytics-label">
								COMMENTS
							</span>

						</div>

						<strong>
							{formatNumber(totalComments)}
						</strong>

						<span class="analytics-description">
							Reader comments
						</span>

					</div>

				</div>

				<!-- =============================================
				     9 + 10 TRENDS
				     ============================================= -->

				<div class="analytics-two-column">

					<!-- READER ENGAGEMENT -->

					<div class="panel large-panel">

						<div class="panel-header">

							<div>
								<h3>Reader Engagement Trends</h3>

								<p>
									Likes, saves and comments recorded over time
								</p>
							</div>

							<div class="legend">

								<span>
									<i class="legend-dot likes-dot"></i>
									Likes
								</span>

								<span>
									<i class="legend-dot saves-dot"></i>
									Saves
								</span>

								<span>
									<i class="legend-dot comments-dot"></i>
									Comments
								</span>

							</div>

						</div>

						{#if engagementTrend.length > 0}

							<div class="trend-chart">

								{#each engagementTrend as day}

									<div class="trend-column">

										<div class="bars">

											<div
												class="bar likes-bar"
												style={`height:${getTrendHeight(day.likes)}%`}
												title={`Likes: ${day.likes || 0}`}
											></div>

											<div
												class="bar saves-bar"
												style={`height:${getTrendHeight(day.saves)}%`}
												title={`Saves: ${day.saves || 0}`}
											></div>

											<div
												class="bar comments-bar"
												style={`height:${getTrendHeight(day.comments)}%`}
												title={`Comments: ${day.comments || 0}`}
											></div>

										</div>

										<span>
											{formatShortDate(day.date)}
										</span>

									</div>

								{/each}

							</div>

						{:else}

							<div class="chart-empty">

								<BarChart3 size={34} />

								<p>
									No engagement activity recorded yet.
								</p>

							</div>

						{/if}

					</div>

					<!-- DAU TREND -->

					<div class="panel">

						<div class="panel-header">

							<div>
								<h3>Daily Active Users</h3>

								<p>
									Unique users active during tracked days
								</p>
							</div>

						</div>

						{#if dailyActiveUsersTrend.length > 0}

							<div class="dau-chart">

								{#each dailyActiveUsersTrend as day}

									{@const dayUsers = Number(
										day.users ??
										day.count ??
										day.value ??
										0
									)}

									<div class="dau-row">

										<div class="dau-row-top">

											<span>
												{formatShortDate(day.date)}
											</span>

											<strong>
												{formatNumber(dayUsers)}
											</strong>

										</div>

										<div class="dau-progress">

											<div
												style={`width:${getPercentage(dayUsers, dailyActiveUsersValue)}%`}
											></div>

										</div>

									</div>

								{/each}

							</div>

						{:else}

							<div class="chart-empty">

								<TrendingUp size={34} />

								<p>
									No daily active user events recorded yet.
								</p>

							</div>

						{/if}

					</div>

				</div>

				<!-- =============================================
				     11 MOST POPULAR CONTENT
				     ============================================= -->

				<div class="panel">

					<div class="panel-header">

						<div>
							<h3>Most Popular Content</h3>

							<p>
								Published content ranked by views
							</p>
						</div>

					</div>

					{#if mostPopularContent.length > 0}

						<div class="popular-table-wrapper">

							<table class="popular-table">

								<thead>

									<tr>
										<th>#</th>
										<th>Content</th>
										<th>Category</th>
										<th>Views</th>
										<th>Likes</th>
										<th>Saves</th>
									</tr>

								</thead>

								<tbody>

									{#each mostPopularContent as item, index}

										<tr>

											<td>
												<span class="rank">
													{index + 1}
												</span>
											</td>

											<td>

												<div class="popular-content">

													<div class="popular-icon">
														<FileText size={16} />
													</div>

													<div>

														<strong>
															{item.title || 'Untitled'}
														</strong>

														<small>
															{formatDate(item.created_at)}
														</small>

													</div>

												</div>

											</td>

											<td>
												<span class="category-badge">
													{item.category || 'General'}
												</span>
											</td>

											<td>
												<strong>
													{formatNumber(item.views)}
												</strong>
											</td>

											<td>
												<span class="metric likes-metric">
													<Heart size={13} />
													{formatNumber(item.likes)}
												</span>
											</td>

											<td>
												<span class="metric saves-metric">
													<Bookmark size={13} />
													{formatNumber(item.saves)}
												</span>
											</td>

										</tr>

									{/each}

								</tbody>

							</table>

						</div>

					{:else}

						<div class="chart-empty">

							<Eye size={34} />

							<p>
								No published content available yet.
							</p>

						</div>

					{/if}

				</div>

				<!-- =============================================
				     12 + 13 CATEGORY + USER BREAKDOWN
				     ============================================= -->

				<div class="analytics-two-column">

					<!-- CONTENT CATEGORIES -->

					<div class="panel">

						<div class="panel-header">

							<div>
								<h3>Content Categories</h3>

								<p>
									Published article distribution
								</p>
							</div>

						</div>

						<div class="category-list">

							{#if articlesByCategory.length > 0}

								{#each articlesByCategory as category}

									<div class="category-row">

										<div class="category-row-top">

											<span>
												{category.category || 'General'}
											</span>

											<strong>
												{formatNumber(category.count)}
											</strong>

										</div>

										<div class="category-progress">

											<div
												style={`width:${Math.min(
													100,
													Number(category.percentage) || 0
												)}%`}
											></div>

										</div>

										<small>
											{Number(category.percentage) || 0}%
											of published articles
										</small>

									</div>

								{/each}

							{:else}

								<div class="empty-small">
									No category data available.
								</div>

							{/if}

						</div>

					</div>

					<!-- USER BREAKDOWN -->

					<div class="panel">

						<div class="panel-header">

							<div>
								<h3>User Breakdown</h3>

								<p>
									Registered account types
								</p>
							</div>

						</div>

						<div class="user-breakdown">

							<div class="breakdown-item">

								<div class="breakdown-icon reader">
									<Users size={18} />
								</div>

								<div class="breakdown-main">

									<span>Readers</span>

									<div class="progress">

										<div
											style={`width:${getPercentage(
												analytics.totalReaders,
												analytics.totalUsers
											)}%`}
										></div>

									</div>

								</div>

								<strong>
									{formatNumber(analytics.totalReaders)}
								</strong>

							</div>

							<div class="breakdown-item">

								<div class="breakdown-icon doctor">
									<Stethoscope size={18} />
								</div>

								<div class="breakdown-main">

									<span>Doctors</span>

									<div class="progress">

										<div
											style={`width:${getPercentage(
												analytics.totalDoctors,
												analytics.totalUsers
											)}%`}
										></div>

									</div>

								</div>

								<strong>
									{formatNumber(analytics.totalDoctors)}
								</strong>

							</div>

							<div class="breakdown-item">

								<div class="breakdown-icon admin">
									<ShieldCheck size={18} />
								</div>

								<div class="breakdown-main">

									<span>Admins</span>

									<div class="progress">

										<div
											style={`width:${getPercentage(
												analytics.totalAdmins,
												analytics.totalUsers
											)}%`}
										></div>

									</div>

								</div>

								<strong>
									{formatNumber(analytics.totalAdmins)}
								</strong>

							</div>

						</div>

					</div>

				</div>

			<!-- =================================================
			     DOCTOR VERIFICATION
			     ================================================= -->

			{:else if activeSection === 'doctor-verification'}

				<div class="section-heading">

					<div>
						<h2>Doctor Verification</h2>

						<p>
							Review and manage doctor verification requests.
						</p>
					</div>

				</div>

				<div class="panel">

					<div class="panel-header">

						<div>

							<h3>Doctor Requests</h3>

							<p>
								{pendingDoctors.length} doctor records found
							</p>

						</div>

					</div>

					<div class="table-wrapper">

						<table>

							<thead>

								<tr>
									<th>Doctor</th>
									<th>Email</th>
									<th>Specialization</th>
									<th>Role</th>
									<th>Status</th>
									<th>Action</th>
								</tr>

							</thead>

							<tbody>

								{#each pendingDoctors as doctor}

									<tr>

										<td>

											<div class="user-cell">

												<div class="user-avatar">
													{(
														doctor.full_name ||
														'D'
													).charAt(0)}
												</div>

												<div>

													<strong>
														{doctor.full_name ||
															'Unnamed Doctor'}
													</strong>

													<span>
														{doctor.designation ||
															'Doctor'}
													</span>

												</div>

											</div>

										</td>

										<td>
											{doctor.email || 'N/A'}
										</td>

										<td>
											{doctor.specialization ||
												'General'}
										</td>

										<td>
											{#if doctor.is_reviewer}
												<span class="role-badge reviewer">Reviewer</span>
											{:else if doctor.is_author}
												<span class="role-badge author">Author</span>
											{:else}
												<span class="role-badge pending">Pending</span>
											{/if}
										</td>

										<td>

											<span
												class={getStatusClass(
													doctor.verification_status
												)}
											>
												{doctor.verification_status ||
													'Pending'}
											</span>

										</td>

										<td>

											{#if doctor.verification_status !== 'approved'}

												<button
													type="button"
													class="action-button approve-button"
													on:click={() => doctorToApprove = doctor}
												>
													<CheckCircle size={14} />
													Approve
												</button>

											{:else}

												<form
													method="POST"
													action="?/reject"
													use:enhance={() => {
														const rejectingId = doctor.id;
														
														if (data.pendingDoctors) {
															data.pendingDoctors = data.pendingDoctors.map((d) => 
																d.id === rejectingId ? { 
																	...d, 
																	verification_status: 'rejected',
																	is_author: false,
																	is_reviewer: false 
																} : d
															);
														}

														return async ({ result, update }) => {
															if (result.type === 'failure' || result.type === 'error') {
																alert('Error: Failed to reject');
																update();
															}
														};
													}}
												>
													<input
														type="hidden"
														name="doctorId"
														value={doctor.id}
													/>
													<button
														type="submit"
														class="action-button reject-button"
													>
														<XCircle size={14} />
														Reject
													</button>
												</form>

											{/if}

										</td>

									</tr>

								{/each}

							</tbody>

						</table>

					</div>

				</div>

			<!-- =================================================
			     PUBLISHING POWER
			     ================================================= -->

			{:else if activeSection === 'publishing'}

				<div class="section-heading">

					<div>

						<h2>Publishing Power</h2>

						<p>
							Control which verified doctors can publish content.
						</p>

					</div>

				</div>

				<div class="panel">

					<div class="table-wrapper">

						<table>

							<thead>

								<tr>
									<th>Doctor</th>
									<th>Specialization</th>
									<th>Published Content</th>
									<th>Permission</th>
									<th>Action</th>
								</tr>

							</thead>

							<tbody>

								{#each publishingDoctors as doctor}

									<tr>

										<td>

											<div class="user-cell">

												<div class="user-avatar">
													{(
														doctor.name || 'D'
													).charAt(0)}
												</div>

												<div>

													<strong>
														{doctor.name ||
															'Unnamed Doctor'}
													</strong>

													<span>
														Verified Doctor
													</span>

												</div>

											</div>

										</td>

										<td>
											{doctor.specialization ||
												'General'}
										</td>

										<td>
											{doctor.articles ?? 0}
										</td>

										<td>

											<span
												class="permission-badge"
												class:granted={
													doctor.status === 'granted'
												}
												class:revoked={
													doctor.status === 'revoked'
												}
											>
												{doctor.status || 'revoked'}
											</span>

										</td>

										<td>

											<form
												method="POST"
												action="?/togglePublishingPower"
											>

												<input
													type="hidden"
													name="doctorId"
													value={doctor.id}
												/>

												<input
													type="hidden"
													name="status"
													value={
														doctor.status ===
														'granted'
															? 'revoked'
															: 'granted'
													}
												/>

												<button
													type="submit"
													class="action-button"
												>
													{doctor.status === 'granted'
														? 'Revoke'
														: 'Grant'}
												</button>

											</form>

										</td>

									</tr>

								{/each}

							</tbody>

						</table>

					</div>

				</div>

			<!-- =================================================
			     ARTICLES
			     ================================================= -->

			{:else if activeSection === 'articles'}

				<div class="section-heading">

					<div>

						<h2>Articles</h2>

						<p>
							Manage article publication workflow.
						</p>

					</div>

				</div>

				<div class="panel">

					<div class="table-wrapper">

						<table>

							<thead>

								<tr>
									<th>Title</th>
									<th>Author</th>
									<th>Status</th>
									<th>Created</th>
									<th>Action</th>
								</tr>

							</thead>

							<tbody>

								{#each approvedArticles as article}

									<tr>

										<td>
											<strong>
												{article.title ||
													'Untitled'}
											</strong>
										</td>

										<td>
											{article.author_name_credentials ||
												'Unknown'}
										</td>

										<td>

											<span
												class={getStatusClass(
													article.status
												)}
											>
												{article.status ||
													'pending'}
											</span>

										</td>

										<td>
											{formatDate(article.created_at)}
										</td>

										<td>

											{#if article.status !== 'published'}

												<form
													method="POST"
													action="?/publishContent"
												>

													<input
														type="hidden"
														name="articleId"
														value={article.id}
													/>

													<input
														type="hidden"
														name="articleType"
														value="article"
													/>

													<button
														type="submit"
														class="action-button approve-button"
													>
														Publish
													</button>

												</form>

											{:else}

												<span class="published-label">
													Published
												</span>

											{/if}

										</td>

									</tr>

								{/each}

							</tbody>

						</table>

					</div>

				</div>

			<!-- =================================================
			     RESEARCH
			     ================================================= -->

			{:else if activeSection === 'research'}

				<div class="section-heading">

					<div>

						<h2>Research Papers</h2>

						<p>
							Manage research publication workflow.
						</p>

					</div>

				</div>

				<div class="panel">

					<div class="table-wrapper">

						<table>

							<thead>

								<tr>
									<th>Title</th>
									<th>Author</th>
									<th>Status</th>
									<th>Created</th>
									<th>Action</th>
								</tr>

							</thead>

							<tbody>

								{#each approvedResearch as research}

									<tr>

										<td>
											<strong>
												{research.title ||
													'Untitled'}
											</strong>
										</td>

										<td>
											{research.author_name_credentials ||
												'Unknown'}
										</td>

										<td>

											<span
												class={getStatusClass(
													research.status
												)}
											>
												{research.status ||
													'pending'}
											</span>

										</td>

										<td>
											{formatDate(
												research.created_at
											)}
										</td>

										<td>

											{#if research.status !== 'published'}

												<form
													method="POST"
													action="?/publishContent"
												>

													<input
														type="hidden"
														name="articleId"
														value={research.id}
													/>

													<input
														type="hidden"
														name="articleType"
														value="research"
													/>

													<button
														type="submit"
														class="action-button approve-button"
													>
														Publish
													</button>

												</form>

											{:else}

												<span class="published-label">
													Published
												</span>

											{/if}

										</td>

									</tr>

								{/each}

							</tbody>

						</table>

					</div>

				</div>

			<!-- =================================================
			     CMS CONTENT
			     ================================================= -->

			{:else if activeSection === 'cms'}

				<div class="section-heading">

					<div>

						<h2>CMS Content</h2>

						<p>
							Manage website content from the central CMS.
						</p>

					</div>

				</div>

				<div class="panel">

					<div class="table-wrapper">

						<table>

							<thead>

								<tr>
									<th>Title</th>
									<th>Type</th>
									<th>Category</th>
									<th>Status</th>
									<th>Created</th>
								</tr>

							</thead>

							<tbody>

								{#each cmsContents as content}

									<tr>

										<td>
											<strong>
												{content.title ||
													'Untitled'}
											</strong>
										</td>

										<td>

											<span class="category-badge">
												{content.content_type ||
													'Content'}
											</span>

										</td>

										<td>
											{content.category || '—'}
										</td>

										<td>

											<span
												class={getStatusClass(
													content.status
												)}
											>
												{content.status || 'draft'}
											</span>

										</td>

										<td>
											{formatDate(
												content.created_at
											)}
										</td>

									</tr>

								{/each}

							</tbody>

						</table>

					</div>

				</div>

			<!-- =================================================
			     USERS
			     ================================================= -->

			{:else if activeSection === 'users'}

				<div class="section-heading">

					<div>

						<h2>Manage Users</h2>

						<p>
							View and manage registered platform users.
						</p>

					</div>

				</div>

				<div class="panel">

					<div class="panel-header">

						<div>

							<h3>Users</h3>

							<p>
								{users.length} registered users
							</p>

						</div>

						<div class="search-box">

							<Search size={16} />

							<input
								type="text"
								bind:value={searchTerm}
								placeholder="Search users..."
							/>

						</div>

					</div>

					<div class="table-wrapper">

						<table>

							<thead>

								<tr>
									<th>User</th>
									<th>Email</th>
									<th>Role</th>
									<th>Verification</th>
									<th>Joined</th>
								</tr>

							</thead>

							<tbody>

								{#each filteredUsers as user}

									<tr>

										<td>

											<div class="user-cell">

												<div class="user-avatar">
													{(
														user.full_name ||
														'U'
													).charAt(0)}
												</div>

												<div>

													<strong>
														{user.full_name ||
															'Unnamed User'}
													</strong>

													<span>
														{user.profession ||
															'User'}
													</span>

												</div>

											</div>

										</td>

										<td>
											{user.email || 'N/A'}
										</td>

										<td>

											<span class="role-badge">
												{user.role || 'user'}
											</span>

										</td>

										<td>

											<span
												class={getStatusClass(
													user.verification_status
												)}
											>
												{user.verification_status ||
													'N/A'}
											</span>

										</td>

										<td>
											{formatDate(user.created_at)}
										</td>

									</tr>

								{/each}

								{#if filteredUsers.length === 0}

									<tr>

										<td
											colspan="5"
											class="no-results"
										>
											No users found.
										</td>

									</tr>

								{/if}

							</tbody>

						</table>

					</div>

				</div>

			{/if}

		</div>

	</main>

</div>

{#if doctorToApprove}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-backdrop" on:click={() => doctorToApprove = null}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<h2>Approve Doctor</h2>
				<button class="close-btn" on:click={() => doctorToApprove = null}>&times;</button>
			</div>
			
			<p class="modal-desc">
				Please assign a role to <strong>{doctorToApprove.full_name || 'this user'}</strong> before approving their account:
			</p>
			
			<form method="POST" action="?/approve" use:enhance={({ formData }) => {
				const assignedRole = formData.get('assignedRole');
				const approvingId = doctorToApprove.id;
				doctorToApprove = null;
				
				if (data.pendingDoctors) {
					data.pendingDoctors = data.pendingDoctors.map((d) => {
						if (d.id === approvingId) {
							return { 
								...d, 
								verification_status: 'approved',
								is_author: true,
								is_reviewer: assignedRole === 'reviewer'
							};
						}
						return d;
					});
				}

				return async ({ result, update }) => {
					if (result.type === 'failure' || result.type === 'error') {
						alert('Error: Failed to approve');
						// On failure, update() will naturally revert the UI back to the real server state
						update();
					}
				};
			}}>
				<input type="hidden" name="doctorId" value={doctorToApprove.id} />
				
				<div class="role-options">
					<label class="role-card">
						<input type="radio" name="assignedRole" value="author" checked />
						<div class="role-info">
							<strong>Doctor (Author)</strong>
							<span>Can write and submit articles.</span>
						</div>
					</label>
					
					<label class="role-card">
						<input type="radio" name="assignedRole" value="reviewer" />
						<div class="role-info">
							<strong>Reviewer</strong>
							<span>Can review and approve articles.</span>
						</div>
					</label>
				</div>
				
				<div class="modal-actions">
					<button type="button" class="btn-cancel" on:click={() => doctorToApprove = null}>Cancel</button>
					<button type="submit" class="btn-confirm">Confirm Approval</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family:
			Inter,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
		background: #f8fafc;
		color: #0f172a;
	}

	.dashboard {
		min-height: 100vh;
		display: flex;
		background: #f8fafc;
	}

	/* =========================================================
	   SIDEBAR
	   ========================================================= */

	.sidebar {
		width: 260px;
		min-height: 100vh;
		background: #0f172a;
		color: #94a3b8;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.sidebar-brand {
		height: 76px;
		padding: 16px 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}

	.brand-icon {
		width: 38px;
		height: 38px;
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: white;
		flex-shrink: 0;
	}

	.brand-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.brand-name {
		font-size: 17px;
		font-weight: 800;
		color: white;
	}

	.brand-role {
		font-size: 11px;
		color: #64748b;
		margin-top: 2px;
	}

	.sidebar-content {
		flex: 1;
		padding: 18px 12px;
		overflow-y: auto;
	}

	.menu-label {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: #475569;
		padding: 14px 12px 7px;
	}

	.menu-item {
		width: 100%;
		border: none;
		background: transparent;
		color: #94a3b8;
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 10px 12px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		text-decoration: none;
		transition: 0.18s ease;
		margin-bottom: 2px;
	}

	.menu-item:hover {
		background: #1e293b;
		color: white;
	}

	.menu-item.active {
		background: #2563eb;
		color: white;
		font-weight: 650;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22);
	}

	.menu-count {
		margin-left: auto;
		min-width: 20px;
		height: 20px;
		padding: 0 5px;
		border-radius: 10px;
		background: #ef4444;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 700;
	}

	.sidebar-bottom {
		padding: 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
	}

	.website-link,
	.logout-link {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 10px 12px;
		text-decoration: none;
		font-size: 13px;
		border-radius: 8px;
		margin-bottom: 3px;
	}

	.website-link {
		color: #94a3b8;
	}

	.website-link:hover {
		background: #1e293b;
		color: white;
	}

	.website-link :global(svg:last-child) {
		margin-left: auto;
	}

	.logout-link {
		color: #f87171;
	}

	.logout-link:hover {
		background: rgba(239, 68, 68, 0.1);
	}

	/* =========================================================
	   MAIN
	   ========================================================= */

	.main {
		flex: 1;
		min-width: 0;
	}

	.topbar {
		height: 76px;
		background: white;
		border-bottom: 1px solid #e2e8f0;
		padding: 0 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		z-index: 20;
	}

	.breadcrumb {
		color: #94a3b8;
		font-size: 11px;
		font-weight: 600;
		text-transform: capitalize;
		margin-bottom: 3px;
	}

	.breadcrumb span {
		margin: 0 6px;
		color: #cbd5e1;
	}

	.topbar h1 {
		font-size: 19px;
		margin: 0;
		font-weight: 750;
		color: #0f172a;
		text-transform: capitalize;
	}

	.admin-profile {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.admin-avatar {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		overflow: hidden;
		background: #eff6ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}

	.admin-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.admin-info {
		display: flex;
		flex-direction: column;
	}

	.admin-info strong {
		font-size: 12px;
		color: #0f172a;
	}

	.admin-info span {
		font-size: 10px;
		color: #64748b;
		margin-top: 2px;
	}

	.page-content {
		padding: 30px;
		max-width: 1500px;
		margin: 0 auto;
	}

	/* =========================================================
	   HEADINGS
	   ========================================================= */

	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
	}

	.section-heading h2 {
		font-size: 24px;
		font-weight: 800;
		margin: 0 0 5px;
		color: #0f172a;
	}

	.section-heading p {
		margin: 0;
		color: #64748b;
		font-size: 13px;
	}

	/* =========================================================
	   OVERVIEW
	   ========================================================= */

	.overview-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 22px;
	}

	.stat-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 18px;
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.stat-icon {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.stat-icon.blue {
		background: #eff6ff;
		color: #2563eb;
	}

	.stat-icon.purple {
		background: #faf5ff;
		color: #9333ea;
	}

	.stat-icon.green {
		background: #f0fdf4;
		color: #16a34a;
	}

	.stat-icon.orange {
		background: #fff7ed;
		color: #ea580c;
	}

	.stat-card span {
		display: block;
		font-size: 11px;
		color: #64748b;
		margin-bottom: 4px;
	}

	.stat-card strong {
		font-size: 23px;
		color: #0f172a;
	}

	.overview-two-column,
	.analytics-two-column {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 18px;
		margin-bottom: 18px;
	}

	/* =========================================================
	   PANELS
	   ========================================================= */

	.panel {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 18px;
	}

	.panel-header {
		padding: 18px 20px;
		border-bottom: 1px solid #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
	}

	.panel-header h3 {
		font-size: 15px;
		margin: 0 0 3px;
		font-weight: 750;
		color: #0f172a;
	}

	.panel-header p {
		font-size: 11px;
		color: #94a3b8;
		margin: 0;
	}

	.text-button {
		border: none;
		background: transparent;
		color: #2563eb;
		font-size: 12px;
		font-weight: 650;
		cursor: pointer;
	}

	/* =========================================================
	   CONTENT LIST
	   ========================================================= */

	.content-list {
		padding: 4px 20px;
	}

	.content-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #f1f5f9;
	}

	.content-row:last-child {
		border-bottom: none;
	}

	.content-type-icon {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		background: #eff6ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.content-row-main {
		flex: 1;
		min-width: 0;
	}

	.content-row-main strong {
		display: block;
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.content-row-main span {
		display: block;
		font-size: 10px;
		color: #94a3b8;
		margin-top: 3px;
	}

	.quick-stats {
		padding: 12px 20px 20px;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.quick-stats > div {
		padding: 15px 10px;
		border-bottom: 1px solid #f1f5f9;
	}

	.quick-stats span {
		display: block;
		font-size: 11px;
		color: #64748b;
		margin-bottom: 4px;
	}

	.quick-stats strong {
		font-size: 21px;
	}

	/* =========================================================
	   ANALYTICS
	   ========================================================= */

	.analytics-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
		margin-bottom: 18px;
	}

	.analytics-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 17px;
		transition: 0.18s ease;
	}

	.analytics-card:hover {
		border-color: #cbd5e1;
		box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
		transform: translateY(-1px);
	}

	.analytics-card-top {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 11px;
	}

	.analytics-icon {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.analytics-icon.views {
		background: #eff6ff;
		color: #2563eb;
	}

	.analytics-icon.visitors {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.analytics-icon.active {
		background: #ecfdf5;
		color: #059669;
	}

	.analytics-icon.likes {
		background: #fef2f2;
		color: #ef4444;
	}

	.analytics-icon.saves {
		background: #fff7ed;
		color: #ea580c;
	}

	.analytics-icon.shares {
		background: #eef2ff;
		color: #4f46e5;
	}

	.analytics-icon.downloads {
		background: #ecfeff;
		color: #0891b2;
	}

	.analytics-icon.comments {
		background: #f0fdf4;
		color: #16a34a;
	}

	.analytics-label {
		font-size: 9px;
		font-weight: 750;
		color: #64748b;
		letter-spacing: 0.05em;
	}

	.analytics-card > strong {
		display: block;
		font-size: 26px;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 4px;
	}

	.analytics-description {
		font-size: 10px;
		color: #94a3b8;
		line-height: 1.4;
	}

	.large-panel {
		min-height: 300px;
	}

	.legend {
		display: flex;
		gap: 14px;
	}

	.legend span {
		font-size: 10px;
		color: #64748b;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.legend-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		display: inline-block;
	}

	.likes-dot {
		background: #ef4444;
	}

	.saves-dot {
		background: #f97316;
	}

	.comments-dot {
		background: #16a34a;
	}

	.trend-chart {
		height: 220px;
		padding: 25px 25px 18px;
		display: flex;
		align-items: stretch;
		gap: 8px;
		border-top: 1px solid #f8fafc;
		overflow-x: auto;
	}

	.trend-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		min-width: 30px;
	}

	.bars {
		height: 165px;
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 2px;
	}

	.bar {
		width: 7px;
		min-height: 3px;
		border-radius: 4px 4px 0 0;
		transition: height 0.3s ease;
	}

	.likes-bar {
		background: #ef4444;
	}

	.saves-bar {
		background: #f97316;
	}

	.comments-bar {
		background: #16a34a;
	}

	.trend-column > span {
		font-size: 8px;
		color: #94a3b8;
		margin-top: 8px;
		white-space: nowrap;
	}

	.dau-chart {
		padding: 12px 20px 18px;
		max-height: 250px;
		overflow-y: auto;
	}

	.dau-row {
		padding: 10px 0;
	}

	.dau-row-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 10px;
		margin-bottom: 6px;
	}

	.dau-row-top span {
		color: #64748b;
	}

	.dau-row-top strong {
		color: #0f172a;
	}

	.dau-progress {
		height: 6px;
		background: #f1f5f9;
		border-radius: 10px;
		overflow: hidden;
	}

	.dau-progress div {
		height: 100%;
		background: #059669;
		border-radius: 10px;
	}

	.chart-empty {
		min-height: 220px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #94a3b8;
		gap: 8px;
	}

	.chart-empty p {
		margin: 0;
		font-size: 12px;
	}

	/* =========================================================
	   USER BREAKDOWN
	   ========================================================= */

	.user-breakdown {
		padding: 15px 20px 20px;
	}

	.breakdown-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 0;
	}

	.breakdown-icon {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.breakdown-icon.reader {
		background: #eff6ff;
		color: #2563eb;
	}

	.breakdown-icon.doctor {
		background: #ecfeff;
		color: #0891b2;
	}

	.breakdown-icon.admin {
		background: #faf5ff;
		color: #9333ea;
	}

	.breakdown-main {
		flex: 1;
	}

	.breakdown-main > span {
		font-size: 11px;
		color: #334155;
		display: block;
		margin-bottom: 6px;
	}

	.progress {
		height: 5px;
		background: #f1f5f9;
		border-radius: 10px;
		overflow: hidden;
	}

	.progress div {
		height: 100%;
		background: #2563eb;
		border-radius: 10px;
	}

	.breakdown-item:nth-child(2) .progress div {
		background: #0891b2;
	}

	.breakdown-item:nth-child(3) .progress div {
		background: #9333ea;
	}

	.breakdown-item strong {
		font-size: 12px;
		color: #0f172a;
		min-width: 32px;
		text-align: right;
	}

	/* =========================================================
	   POPULAR CONTENT
	   ========================================================= */

	.popular-table-wrapper {
		overflow-x: auto;
	}

	.popular-table {
		width: 100%;
		border-collapse: collapse;
	}

	.popular-table th {
		padding: 11px 20px;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #94a3b8;
		font-weight: 750;
		text-align: left;
		border-bottom: 1px solid #f1f5f9;
	}

	.popular-table td {
		padding: 14px 20px;
		border-bottom: 1px solid #f8fafc;
		font-size: 12px;
		color: #334155;
	}

	.popular-table tbody tr:hover {
		background: #f8fafc;
	}

	.rank {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: #f8fafc;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 750;
		color: #64748b;
	}

	.popular-content {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 260px;
	}

	.popular-icon {
		width: 34px;
		height: 34px;
		border-radius: 7px;
		background: #eff6ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.popular-content strong {
		display: block;
		font-size: 12px;
		color: #0f172a;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.popular-content small {
		display: block;
		color: #94a3b8;
		font-size: 9px;
		margin-top: 3px;
	}

	.category-badge {
		display: inline-block;
		background: #eff6ff;
		color: #2563eb;
		border: 1px solid #dbeafe;
		border-radius: 5px;
		padding: 4px 8px;
		font-size: 9px;
		font-weight: 650;
	}

	.metric {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
	}

	.likes-metric {
		color: #ef4444;
	}

	.saves-metric {
		color: #ea580c;
	}

	/* =========================================================
	   CATEGORIES
	   ========================================================= */

	.category-list {
		padding: 16px 20px 20px;
	}

	.category-row {
		padding: 10px 0;
	}

	.category-row-top {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		margin-bottom: 6px;
	}

	.category-row-top span {
		color: #334155;
		font-weight: 600;
	}

	.category-row-top strong {
		color: #0f172a;
	}

	.category-progress {
		height: 6px;
		background: #f1f5f9;
		border-radius: 10px;
		overflow: hidden;
	}

	.category-progress div {
		height: 100%;
		background: #2563eb;
		border-radius: 10px;
	}

	.category-row small {
		display: block;
		margin-top: 4px;
		color: #94a3b8;
		font-size: 9px;
	}

	/* =========================================================
	   TABLES
	   ========================================================= */

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	table th {
		padding: 12px 20px;
		background: #f8fafc;
		color: #64748b;
		font-size: 10px;
		font-weight: 750;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		text-align: left;
		border-bottom: 1px solid #e2e8f0;
		white-space: nowrap;
	}

	table td {
		padding: 14px 20px;
		border-bottom: 1px solid #f1f5f9;
		font-size: 12px;
		color: #475569;
		vertical-align: middle;
	}

	table tbody tr:hover {
		background: #f8fafc;
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 180px;
	}

	.user-avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: #eff6ff;
		color: #2563eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 750;
		font-size: 12px;
		flex-shrink: 0;
	}

	.user-cell strong {
		display: block;
		font-size: 11px;
		color: #0f172a;
	}

	.user-cell span {
		display: block;
		font-size: 9px;
		color: #94a3b8;
		margin-top: 2px;
	}

	/* =========================================================
	   STATUS
	   ========================================================= */

	.status {
		display: inline-flex;
		padding: 4px 8px;
		border-radius: 5px;
		font-size: 9px;
		font-weight: 700;
		background: #f1f5f9;
		color: #64748b;
		text-transform: capitalize;
	}

	.status.published,
	.status-badge.approved {
		background: #ecfdf5;
		color: #10b981;
	}

	/* NEW ROLE BADGE STYLES */
	.role-badge {
		padding: 0.25rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		display: inline-block;
	}
	.role-badge.reviewer {
		background: #ede9fe;
		color: #6d28d9;
	}
	.role-badge.author {
		background: #e0f2fe;
		color: #0369a1;
	}
	.role-badge.pending {
		background: #f1f5f9;
		color: #64748b;
	}

	.status.review {
		background: #fffbeb;
		color: #d97706;
	}

	.status.rejected {
		background: #fef2f2;
		color: #dc2626;
	}

	.permission-badge {
		display: inline-flex;
		padding: 4px 9px;
		border-radius: 5px;
		font-size: 9px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.permission-badge.granted {
		background: #f0fdf4;
		color: #16a34a;
	}

	.permission-badge.revoked {
		background: #fef2f2;
		color: #dc2626;
	}

	.role-badge {
		display: inline-block;
		padding: 4px 8px;
		background: #f1f5f9;
		color: #475569;
		border-radius: 5px;
		font-size: 9px;
		font-weight: 650;
	}

	.action-button {
		border: 1px solid #dbe3ee;
		background: white;
		color: #334155;
		padding: 7px 11px;
		border-radius: 6px;
		font-size: 10px;
		font-weight: 650;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		transition: 0.15s;
	}

	.action-button:hover {
		background: #f8fafc;
	}

	.approve-button {
		background: #2563eb;
		border-color: #2563eb;
		color: white;
	}

	.approve-button:hover {
		background: #1d4ed8;
	}

	.reject-button {
		background: #ef4444;
		border-color: #ef4444;
		color: white;
	}

	.reject-button:hover {
		background: #dc2626;
	}

	.inline-form {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.role-select {
		padding: 6px 12px;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		font-size: 13px;
		color: #334155;
		background: #f8fafc;
		cursor: pointer;
		outline: none;
		transition: all 0.2s;
	}

	.role-select:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
	}

	.published-label {
		font-size: 10px;
		color: #16a34a;
		font-weight: 650;
	}

	/* =========================================================
	   SEARCH
	   ========================================================= */

	.search-box {
		display: flex;
		align-items: center;
		gap: 7px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 7px;
		padding: 7px 10px;
		width: 220px;
		color: #94a3b8;
	}

	.search-box input {
		border: none;
		outline: none;
		background: transparent;
		width: 100%;
		font-size: 11px;
		color: #334155;
	}

	.no-results {
		text-align: center;
		padding: 30px;
		color: #94a3b8;
	}

	.empty-small {
		padding: 35px 20px;
		text-align: center;
		color: #94a3b8;
		font-size: 12px;
	}

	/* =========================================================
	   RESPONSIVE
	   ========================================================= */

	@media (max-width: 1100px) {

		.sidebar {
			width: 220px;
		}

		.overview-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.analytics-grid {
			grid-template-columns: repeat(2, 1fr);
		}

	}

	@media (max-width: 850px) {

		.sidebar {
			width: 72px;
		}

		.brand-name,
		.brand-role,
		.menu-label,
		.menu-item span,
		.menu-count,
		.website-link span,
		.logout-link span {
			display: none;
		}

		.sidebar-brand {
			justify-content: center;
			padding: 15px 10px;
		}

		.menu-item {
			justify-content: center;
		}

		.website-link,
		.logout-link {
			justify-content: center;
		}

		.overview-two-column,
		.analytics-two-column {
			grid-template-columns: 1fr;
		}

	}

	@media (max-width: 650px) {

		.page-content {
			padding: 20px 15px;
		}

		.topbar {
			padding: 0 15px;
		}

		.admin-info {
			display: none;
		}

		.overview-grid,
		.analytics-grid {
			grid-template-columns: 1fr;
		}

		.section-heading h2 {
			font-size: 20px;
		}

		.legend {
			display: none;
		}

		.panel-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.search-box {
			width: 100%;
		}

	}

	/* Modal CSS */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.4);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		width: 100%;
		max-width: 480px;
		padding: 30px;
		box-shadow: 0 20px 40px rgba(0,0,0,0.1);
		animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes popIn {
		0% { opacity: 0; transform: scale(0.95); }
		100% { opacity: 1; transform: scale(1); }
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 22px;
		color: #1e293b;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 28px;
		line-height: 1;
		color: #94a3b8;
		cursor: pointer;
		transition: 0.2s;
	}

	.close-btn:hover {
		color: #ef4444;
	}

	.modal-desc {
		color: #64748b;
		font-size: 14px;
		margin-bottom: 25px;
		line-height: 1.5;
	}

	.role-options {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 30px;
	}

	.role-card {
		display: flex;
		align-items: flex-start;
		gap: 15px;
		padding: 15px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		cursor: pointer;
		transition: 0.2s;
	}

	.role-card:hover {
		border-color: #3b82f6;
		background: #f8fafc;
	}

	.role-card input[type="radio"] {
		margin-top: 4px;
		accent-color: #3b82f6;
		transform: scale(1.2);
	}

	.role-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.role-info strong {
		color: #1e293b;
		font-size: 15px;
	}

	.role-info span {
		color: #64748b;
		font-size: 13px;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
	}

	.btn-cancel {
		padding: 10px 20px;
		border: 1px solid #cbd5e1;
		background: white;
		border-radius: 6px;
		color: #475569;
		font-weight: 500;
		cursor: pointer;
		transition: 0.2s;
	}

	.btn-cancel:hover {
		background: #f1f5f9;
	}

	.btn-confirm {
		padding: 10px 20px;
		border: none;
		background: #2563eb;
		color: white;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: 0.2s;
	}

	.btn-confirm:hover {
		background: #1d4ed8;
	}
</style>