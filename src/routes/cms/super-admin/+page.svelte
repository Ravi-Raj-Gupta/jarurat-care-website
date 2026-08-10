<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import CMSContentTab from '$lib/components/dashboard/CMSContentTab.svelte';

	import { 
		Home, FileText, BookOpen, Folder, Tag, Image, UserCheck, CheckSquare, ShieldCheck,
		Users, Calendar as CalendarIcon, BarChart2, Settings, GitPullRequest, 
		Bell, Activity, Globe, ChevronsLeft, LogOut, Search, Mail, Clock, CheckCircle, 
		Presentation, ArrowRight, TrendingUp, TrendingDown, MoreVertical, 
		ChevronDown, Menu as MenuIcon, DollarSign, ExternalLink
	} from 'lucide-svelte';

	export let data;
	$: user = data.currentUser || {
		name: 'Super Admin',
		email: 'admin@jarurat.care',
		role: 'Super_Admin',
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
	};
	// Active section in sidebar
	let activeSection = 'analytics';
	let recentTab = 'All';
	let articleTab = 'Article';
	let showDropdown = false;
	let dropdownRef: HTMLElement;
	let loading = false;

	function closeDropdown(e: MouseEvent) {
		if (showDropdown && dropdownRef && !dropdownRef.contains(e.target as Node)) {
			showDropdown = false;
		}
	}

	const statsCards = [
		{ label: 'Total Users', value: '1,284', change: '+12%', icon: '👥', color: '#1e40af' },
		{ label: 'Registered Doctors', value: '86', change: '+5%', icon: '🩺', color: '#0d6efd' },
		{ label: 'Pending Requests', value: '14', change: '', icon: '⏳', color: '#d97706' },
		{ label: 'Published Articles', value: '312', change: '+18%', icon: '📄', color: '#16a34a' }
	];

	const recentActivity = [
		{ text: 'Dr. Ananya Sharma submitted profile for review', time: '2 hours ago', type: 'doctor' },
		{ text: 'User Raghav Menon created an account', time: '4 hours ago', type: 'user' },
		{ text: "Dr. Priya Kapoor's article was approved", time: '6 hours ago', type: 'article' },
		{ text: 'Dr. Vikram Singh request was rejected', time: '1 day ago', type: 'reject' },
		{ text: 'New article submitted by Dr. Meera Nair', time: '1 day ago', type: 'article' }
	];

	const trafficData = [
		{ label: 'Doctors', pct: 34, color: '#1e40af' },
		{ label: 'Readers', pct: 55, color: '#93c5fd' },
		{ label: 'Others', pct: 11, color: '#dbeafe' }
	];

	// Doctor Requests
	let requestFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';

	// Use the data from the server directly
	$: filteredRequests =
		requestFilter === 'all'
			? data.pendingDoctors
			: data.pendingDoctors.filter((r: any) => r.verification_status === requestFilter);

	// Approval Modal State
	let doctorToApprove: string | null = null;
	let doctorToApproveName: string = '';

	function promptApprove(req: any) {
		doctorToApprove = req.id;
		doctorToApproveName = req.full_name;
	}

	function cancelApprove() {
		doctorToApprove = null;
		doctorToApproveName = '';
	}

	// Publishing Power
	$: publishingDoctors = data.publishingDoctors || [];

	async function togglePublishing(id: string, currentStatus: string) {
		const nextStatus = currentStatus === 'granted' ? 'revoked' : 'granted';
		const formData = new FormData();
		formData.append('doctorId', id);
		formData.append('status', nextStatus);

		try {
			const res = await fetch('?/togglePublishingPower', {
				method: 'POST',
				body: formData
			});
			if (res.ok) {
				await invalidateAll();
			}
		} catch (e) {
			console.error('Error toggling power:', e);
		}
	}

	let userSearch = '';
	let userRoleFilter: 'all' | 'Reader' | 'Doctor' | 'Admin' | 'Super_Admin' = 'all';

	$: filteredUsers = data.users.filter((u: any) => {
		// Because role could be lowercase or uppercase in DB, we'll normalize it for matching
		const uRole = u.role ? u.role.toLowerCase() : '';
		const filterRole = userRoleFilter.toLowerCase();

		const matchRole = userRoleFilter === 'all' || uRole === filterRole;

		const matchSearch =
			(u.full_name && u.full_name.toLowerCase().includes(userSearch.toLowerCase())) ||
			(u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()));

		return matchRole && matchSearch;
	});

	function setRoleFilter(role: string) {
		userRoleFilter = role as 'all' | 'Reader' | 'Doctor' | 'Admin' | 'Super_Admin';
	}

	const navItems = [
		{ id: 'analytics', label: 'Data Analytics' },
		{ id: 'requests', label: 'Doctor Requests' },
		{ id: 'publishing', label: 'Publishing Power' },
		{ id: 'publish', label: 'Publish Content' },
		{ id: 'cms_content', label: 'CMS Content' },
		{ id: 'users', label: 'Manage Users' }
	];

	async function reloadData() {
		await invalidateAll();
	}
</script>

<svelte:window on:click={closeDropdown} />

<div class="dashboard new-dashboard-root">
	<!-- Left Sidebar -->
	<aside class="new-sidebar">
		<div class="sidebar-logo">
			<div class="logo-icon-wrap">
				<img src="/logo.png" alt="JCF Logo" class="logo-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3062/3062634.png'" />
			</div>
			<div class="logo-text">
				<span class="main-title">Jarurat Care</span>
				<span class="sub-title">Super Admin Portal</span>
			</div>
		</div>

		<div class="sidebar-scroll">
			<button class="nav-btn primary-nav" class:active={activeSection === 'analytics'} on:click={() => activeSection = 'analytics'}>
				<Home size={18} />
				<span>Dashboard</span>
			</button>

			<!-- CONTENT -->
			<div class="nav-section">
				<span class="nav-section-title">CONTENT</span>
				<button class="nav-btn" class:active={activeSection === 'articles'} on:click={() => activeSection = 'articles'}>
					<FileText size={18} />
					<span>Articles</span>
				</button>
				<button class="nav-btn" class:active={activeSection === 'research'} on:click={() => activeSection = 'research'}>
					<BookOpen size={18} />
					<span>Research Papers</span>
				</button>
				<button class="nav-btn" class:active={activeSection === 'cms'} on:click={() => activeSection = 'cms'}>
					<Folder size={18} />
					<span>CMS Content</span>
				</button>
			</div>

			<!-- VERIFICATION & REVIEW -->
			<div class="nav-section">
				<span class="nav-section-title">VERIFICATION & REVIEW</span>
				<button class="nav-btn" class:active={activeSection === 'requests'} on:click={() => activeSection = 'requests'}>
					<UserCheck size={18} />
					<span>Doctor Verification</span>
					<span class="badge purple-badge ml-auto">8</span>
				</button>
				<button class="nav-btn" class:active={activeSection === 'publish'} on:click={() => activeSection = 'publish'}>
					<CheckSquare size={18} />
					<span>Article Review</span>
					<span class="badge yellow-badge ml-auto">18</span>
				</button>
				<button class="nav-btn" class:active={activeSection === 'publishing'} on:click={() => activeSection = 'publishing'}>
					<ShieldCheck size={18} />
					<span>Publishing Power</span>
				</button>
			</div>

			<!-- USERS -->
			<div class="nav-section">
				<span class="nav-section-title">USERS</span>
				<button class="nav-btn" class:active={activeSection === 'users'} on:click={() => activeSection = 'users'}>
					<Users size={18} />
					<span>User Management</span>
					<ChevronDown size={14} class="ml-auto opacity-50" />
				</button>
			</div>

			<!-- EVENTS -->
			<div class="nav-section">
				<span class="nav-section-title">EVENTS</span>
				<button class="nav-btn">
					<CalendarIcon size={18} />
					<div class="flex-col-label">
						<span>Events Management</span>
						<span class="sub-text">(Webinars)</span>
					</div>
					<span class="badge red-badge ml-auto">New</span>
				</button>
			</div>

			<!-- REPORTS -->
			<div class="nav-section">
				<span class="nav-section-title">REPORTS</span>
				<button class="nav-btn">
					<BarChart2 size={18} />
					<span>Reports & Analytics</span>
				</button>
			</div>



		</div>

		<!-- Sidebar Bottom Actions -->
		<div class="sidebar-bottom">
			<a href="/" target="_blank" class="nav-btn bottom-link">
				<Globe size={18} />
				<span>View Website</span>
				<ExternalLink size={16} class="ml-auto opacity-60" />
			</a>
			<a href="/cms/login" class="nav-btn logout-btn">
				<LogOut size={18} />
				<span>Logout</span>
			</a>
		</div>
	</aside>

	<!-- Main Body Area -->
	<main class="main-body">
		<!-- Header Topbar -->
		<header class="new-topbar">
			<div class="topbar-left">
				<button class="menu-toggle"><MenuIcon size={20} /></button>
				<div class="search-box">
					<Search size={16} class="text-slate-400" />
					<input type="text" placeholder="Search articles, authors, users, events..." />
				</div>
			</div>
			<div class="topbar-right">
				<button class="icon-notification" aria-label="Notifications">
					<Bell size={20} />
					<span class="dot-badge">12</span>
				</button>
				<button class="icon-notification" aria-label="Messages">
					<Mail size={20} />
					<span class="dot-badge red-dot">4</span>
				</button>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="profile-wrap" bind:this={dropdownRef}>
					<div class="profile-trigger" on:click={() => showDropdown = !showDropdown}>
						<img src={user.avatar} alt="Avatar" class="profile-avatar" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'" />
						<div class="profile-names">
							<span class="p-name">{user.name}</span>
							<span class="p-role">{user.role}</span>
						</div>
						<ChevronDown size={14} class="text-slate-500" />
					</div>

					{#if showDropdown}
						<div class="profile-dropdown">
							<div class="dd-head">
								<strong>{user.name}</strong>
								<span>{user.email}</span>
							</div>
							<hr />
							<a href="/cms/complete-profile" on:click={() => showDropdown = false}>View Profile</a>
							<a href="/cms/login" class="text-red-600 font-medium">Logout</a>
						</div>
					{/if}
				</div>
			</div>
		</header>

		<!-- Content Tabs -->
		<div class="main-content-area">
			<!-- ── Articles Section ── -->
			{#if activeSection === 'articles'}
				<div class="section-desc">
					<p>View all published medical articles on the platform.</p>
				</div>

				<div class="table-card" style="margin-bottom: 30px; overflow: hidden;">
					<div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; background: linear-gradient(to right, #ffffff, #f8fafc);">
						<div style="width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; color: #1d4ed8; display: flex; align-items: center; justify-content: center;">
							<FileText size={20} />
						</div>
						<h3 style="margin: 0; color: #0d2460; font-size: 18px; font-weight: 700;">
							Published Articles
						</h3>
					</div>
					
					{#if data.publishedContent.filter(c => c.type === 'Article').length === 0}
						<div class="empty-state" style="padding: 40px; text-align: center; color: #64748b;">
							No published articles found.
						</div>
					{:else}
						<div class="table-responsive">
							<table class="data-table">
								<thead>
									<tr>
										<th style="width: 45%;">Title</th>
										<th style="width: 20%;">Category</th>
										<th style="width: 20%;">Published Date</th>
										<th style="width: 15%; text-align: center;">Action</th>
									</tr>
								</thead>
								<tbody>
									{#each data.publishedContent.filter(c => c.type === 'Article') as item}
										<tr>
											<td><strong>{item.title || 'Untitled'}</strong></td>
											<td>{item.category || 'General'}</td>
											<td>{new Date(item.created_at).toLocaleDateString()}</td>
											<td style="text-align: center;">
												<a href="/articles/{item.slug || item.id}" target="_blank" class="view-link">
													Read Article ↗
												</a>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			{/if}

			<!-- ── Research Papers Section ── -->
			{#if activeSection === 'research'}
				<div class="section-desc">
					<p>View all published research manuscripts on the platform.</p>
				</div>

				<div class="table-card" style="margin-bottom: 30px; overflow: hidden;">
					<div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; background: linear-gradient(to right, #ffffff, #f8fafc);">
						<div style="width: 40px; height: 40px; border-radius: 10px; background: #faf5ff; color: #7e22ce; display: flex; align-items: center; justify-content: center;">
							<BookOpen size={20} />
						</div>
						<h3 style="margin: 0; color: #0d2460; font-size: 18px; font-weight: 700;">
							Published Research Papers
						</h3>
					</div>
					
					{#if data.publishedContent.filter(c => c.type === 'Research').length === 0}
						<div class="empty-state" style="padding: 40px; text-align: center; color: #64748b;">
							No published research papers found.
						</div>
					{:else}
						<div class="table-responsive">
							<table class="data-table">
								<thead>
									<tr>
										<th style="width: 45%;">Title</th>
										<th style="width: 20%;">Category</th>
										<th style="width: 20%;">Published Date</th>
										<th style="width: 15%; text-align: center;">Action</th>
									</tr>
								</thead>
								<tbody>
									{#each data.publishedContent.filter(c => c.type === 'Research') as item}
										<tr>
											<td><strong>{item.title || 'Untitled'}</strong></td>
											<td>{item.category || 'General'}</td>
											<td>{new Date(item.created_at).toLocaleDateString()}</td>
											<td style="text-align: center;">
												<a href="/cancer-research/{item.id}" target="_blank" class="view-link">
													View Paper ↗
												</a>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			{/if}

			<!-- ── CMS Content Section ── -->
			{#if activeSection === 'cms'}
				<div class="section-desc" style="margin-bottom: 24px;">
					<p>Manage Blogs, News, FAQs, and Campaigns on the platform.</p>
				</div>
				<CMSContentTab cmsContents={data.cmsContents || []} reloadCallback={async () => { await invalidateAll(); }} />
			{/if}

			<!-- ── Main Analytics / Dashboard UI ── -->
			{#if activeSection === 'analytics'}
				<!-- Title Row -->
				<div class="welcome-bar">
					<div>
						<h1 class="welcome-title">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
						<p class="welcome-subtitle">Here's what's happening with your platform today.</p>
					</div>
					<button class="date-picker-btn">
						<CalendarIcon size={16} class="text-slate-500" />
						<span>21 May - 27 May 2024</span>
						<ChevronDown size={14} class="text-slate-400 ml-1" />
					</button>
				</div>

				<!-- 6 Stat Cards Grid -->
				<div class="stat-grid-6">
					<div class="ui-stat-card">
						<div class="stat-icon-box bg-purple">
							<FileText size={22} class="text-purple" />
						</div>
						<div class="stat-meta">
							<span class="meta-label">Total Articles</span>
							<span class="meta-value">368</span>
							<span class="meta-trend trend-green"><TrendingUp size={12} /> 14% <small>from last week</small></span>
						</div>
					</div>

					<div class="ui-stat-card">
						<div class="stat-icon-box bg-orange">
							<Clock size={22} class="text-orange" />
						</div>
						<div class="stat-meta">
							<span class="meta-label">Pending Review</span>
							<span class="meta-value">21</span>
							<span class="meta-trend trend-red"><TrendingDown size={12} /> 12% <small>from last week</small></span>
						</div>
					</div>

					<div class="ui-stat-card">
						<div class="stat-icon-box bg-blue">
							<FileText size={22} class="text-blue" />
						</div>
						<div class="stat-meta">
							<span class="meta-label">In Review</span>
							<span class="meta-value">9</span>
							<span class="meta-trend trend-neutral">— Same as last week</span>
						</div>
					</div>

					<div class="ui-stat-card">
						<div class="stat-icon-box bg-green">
							<CheckCircle size={22} class="text-green" />
						</div>
						<div class="stat-meta">
							<span class="meta-label">Approved</span>
							<span class="meta-value">42</span>
							<span class="meta-trend trend-green"><TrendingUp size={12} /> 18% <small>from last week</small></span>
						</div>
					</div>

					<div class="ui-stat-card">
						<div class="stat-icon-box bg-pink">
							<Users size={22} class="text-pink" />
						</div>
						<div class="stat-meta">
							<span class="meta-label">Total Users</span>
							<span class="meta-value">156</span>
							<span class="meta-trend trend-green"><TrendingUp size={12} /> 8% <small>from last week</small></span>
						</div>
					</div>

					<div class="ui-stat-card">
						<div class="stat-icon-box bg-indigo">
							<Presentation size={22} class="text-indigo" />
						</div>
						<div class="stat-meta">
							<span class="meta-label">Upcoming Webinars</span>
							<span class="meta-value">5</span>
							<a href="#schedule" class="view-schedule-link">View schedule</a>
						</div>
					</div>
				</div>

				<!-- Management Overview Section -->
				<div class="mgmt-overview">
					<h2 class="section-hd">Management Overview</h2>
					<div class="mgmt-cards-row">
						<!-- Card 1 -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="mgmt-box" on:click={() => activeSection = 'requests'}>
							<div class="mgmt-ico bg-circle-green text-green-600"><UserCheck size={24} /></div>
							<h3 class="mgmt-title">Doctor Verification</h3>
							<p class="mgmt-desc">Review and verify doctor registrations.</p>
							<div class="mgmt-action text-green-600">
								<span>8 Pending</span>
								<ArrowRight size={16} />
							</div>
						</div>
						<!-- Card 2 -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="mgmt-box" on:click={() => activeSection = 'publish'}>
							<div class="mgmt-ico bg-circle-orange text-orange-600"><FileText size={24} /></div>
							<h3 class="mgmt-title">Article Review</h3>
							<p class="mgmt-desc">Review submitted articles and take action.</p>
							<div class="mgmt-action text-orange-600">
								<span>21 Pending</span>
								<ArrowRight size={16} />
							</div>
						</div>
						<!-- Card 3 -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="mgmt-box" on:click={() => activeSection = 'users'}>
							<div class="mgmt-ico bg-circle-blue text-blue-600"><Users size={24} /></div>
							<h3 class="mgmt-title">User Management</h3>
							<p class="mgmt-desc">Manage writers, doctors, editors and admins.</p>
							<div class="mgmt-action text-blue-600">
								<span>156 Users</span>
								<ArrowRight size={16} />
							</div>
						</div>
						<!-- Card 4 -->
						<div class="mgmt-box">
							<div class="mgmt-ico bg-circle-purple text-purple-600"><CalendarIcon size={24} /></div>
							<h3 class="mgmt-title">Events Management<br /><small class="font-normal text-slate-500">(Webinars)</small></h3>
							<p class="mgmt-desc">Create, manage and monitor webinars.</p>
							<div class="mgmt-action text-purple-600">
								<span>5 Upcoming</span>
								<ArrowRight size={16} />
							</div>
						</div>
						<!-- Card 5 -->
						<div class="mgmt-box">
							<div class="mgmt-ico bg-circle-emerald text-emerald-600"><BarChart2 size={24} /></div>
							<h3 class="mgmt-title">Reports</h3>
							<p class="mgmt-desc">View analytics and download reports.</p>
							<div class="mgmt-action text-slate-600">
								<span>View Reports</span>
								<ArrowRight size={16} />
							</div>
						</div>
					</div>
				</div>

				<!-- Middle Section: Charts & Top Writers -->
				<div class="middle-widgets-row">
					<!-- Articles Overview Chart -->
					<div class="widget-box col-span-5">
						<div class="widget-header">
							<h3>Articles Overview</h3>
							<button class="filter-select">This Week <ChevronDown size={14} /></button>
						</div>
						<div class="chart-legend">
							<span><i class="dot blue-dot"></i> Submitted</span>
							<span><i class="dot orange-dot"></i> In Review</span>
							<span><i class="dot green-dot"></i> Approved</span>
							<span><i class="dot purple-dot"></i> Published</span>
						</div>
						<div class="chart-svg-wrap">
							<svg viewBox="0 0 500 200" class="line-chart">
								<!-- Horizontal Grid Lines & Labels -->
								<line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
								<text x="5" y="24" class="axis-label">80</text>
								<line x1="30" y1="60" x2="480" y2="60" stroke="#f1f5f9" stroke-width="1" />
								<text x="5" y="64" class="axis-label">60</text>
								<line x1="30" y1="100" x2="480" y2="100" stroke="#f1f5f9" stroke-width="1" />
								<text x="5" y="104" class="axis-label">40</text>
								<line x1="30" y1="140" x2="480" y2="140" stroke="#f1f5f9" stroke-width="1" />
								<text x="5" y="144" class="axis-label">20</text>
								<line x1="30" y1="180" x2="480" y2="180" stroke="#e2e8f0" stroke-width="1" />
								<text x="10" y="184" class="axis-label">0</text>

								<!-- X Axis Dates -->
								<text x="50" y="198" class="axis-label">21 May</text>
								<text x="120" y="198" class="axis-label">22 May</text>
								<text x="190" y="198" class="axis-label">23 May</text>
								<text x="260" y="198" class="axis-label">24 May</text>
								<text x="330" y="198" class="axis-label">25 May</text>
								<text x="400" y="198" class="axis-label">26 May</text>
								<text x="455" y="198" class="axis-label">27 May</text>

								<!-- Smooth curves -->
								<path d="M 60 75 C 130 30, 200 50, 270 55 C 340 65, 400 90, 460 65" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
								<path d="M 60 115 C 130 80, 200 70, 270 100 C 340 120, 400 130, 460 95" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" />
								<path d="M 60 135 C 130 110, 200 120, 270 130 C 340 135, 400 145, 460 125" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" />
								<path d="M 60 160 C 130 140, 200 145, 270 155 C 340 160, 400 165, 460 150" fill="none" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" />

								<!-- Dots on ends -->
								<circle cx="60" cy="75" r="3.5" fill="#2563EB" />
								<circle cx="200" cy="50" r="3.5" fill="#2563EB" />
								<circle cx="460" cy="65" r="3.5" fill="#2563EB" />
							</svg>
						</div>
					</div>

					<!-- Articles by Category (Donut) -->
					<div class="widget-box col-span-4">
						<div class="widget-header">
							<h3>Articles by Category</h3>
						</div>
						<div class="donut-flex-container">
							<div class="donut-chart-box">
								<svg width="140" height="140" viewBox="0 0 140 140">
									<!-- Donut representation -->
									<circle cx="70" cy="70" r="50" fill="none" stroke="#2563eb" stroke-width="24" stroke-dasharray="140 314" />
									<circle cx="70" cy="70" r="50" fill="none" stroke="#8b5cf6" stroke-width="24" stroke-dasharray="80 314" stroke-dashoffset="-140" />
									<circle cx="70" cy="70" r="50" fill="none" stroke="#10b981" stroke-width="24" stroke-dasharray="50 314" stroke-dashoffset="-220" />
									<circle cx="70" cy="70" r="50" fill="none" stroke="#f43f5e" stroke-width="24" stroke-dasharray="44 314" stroke-dashoffset="-270" />
									<text x="70" y="65" text-anchor="middle" class="donut-sub">Total Articles</text>
									<text x="70" y="85" text-anchor="middle" class="donut-val">368</text>
								</svg>
							</div>
							<div class="donut-legend">
								<div class="leg-item">
									<span class="bullet bg-blue-600"></span>
									<span class="leg-text">Cancer Care</span>
									<strong class="leg-pct">35%</strong>
								</div>
								<div class="leg-item">
									<span class="bullet bg-purple-600"></span>
									<span class="leg-text">Treatment & Research</span>
									<strong class="leg-pct">25%</strong>
								</div>
								<div class="leg-item">
									<span class="bullet bg-emerald-500"></span>
									<span class="leg-text">Patient Stories</span>
									<strong class="leg-pct">15%</strong>
								</div>
								<div class="leg-item">
									<span class="bullet bg-orange-500"></span>
									<span class="leg-text">Nutrition & Wellness</span>
									<strong class="leg-pct">10%</strong>
								</div>
								<div class="leg-item">
									<span class="bullet bg-rose-500"></span>
									<span class="leg-text">Mental Health</span>
									<strong class="leg-pct">8%</strong>
								</div>
								<div class="leg-item">
									<span class="bullet bg-amber-400"></span>
									<span class="leg-text">Others</span>
									<strong class="leg-pct">7%</strong>
								</div>
							</div>
						</div>
					</div>

					<!-- Top Writers -->
					<div class="widget-box col-span-3">
						<div class="widget-header">
							<h3>Top Writers</h3>
							<a href="#writers" class="text-blue-600 text-sm font-semibold hover:underline">View all</a>
						</div>
						<div class="writers-list">
							<div class="writer-row">
								<img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Dr. Ananya" />
								<span class="w-name">Dr. Ananya Sharma</span>
								<span class="w-count">32 articles</span>
							</div>
							<div class="writer-row">
								<img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Rahul Verma" />
								<span class="w-name">Rahul Verma</span>
								<span class="w-count">28 articles</span>
							</div>
							<div class="writer-row">
								<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Priya Nair" />
								<span class="w-name">Priya Nair</span>
								<span class="w-count">20 articles</span>
							</div>
							<div class="writer-row">
								<img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Aditya Menon" />
								<span class="w-name">Aditya Menon</span>
								<span class="w-count">18 articles</span>
							</div>
							<div class="writer-row">
								<img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Neha Kapoor" />
								<span class="w-name">Neha Kapoor</span>
								<span class="w-count">15 articles</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom Section: Recent Articles & Quick Stats -->
				<div class="bottom-widgets-row">
					<!-- Recent Articles -->
					<div class="widget-box col-span-8">
						<h3 class="recent-title">Recent Articles</h3>
						<div class="table-tabs">
							<button class:active-tab={recentTab === 'All'} on:click={() => recentTab = 'All'}>All</button>
							<button class:active-tab={recentTab === 'Pending'} on:click={() => recentTab = 'Pending'}>Pending (21)</button>
							<button class:active-tab={recentTab === 'InReview'} on:click={() => recentTab = 'InReview'}>In Review (9)</button>
							<button class:active-tab={recentTab === 'Changes'} on:click={() => recentTab = 'Changes'}>Needs Changes (4)</button>
							<button class:active-tab={recentTab === 'Approved'} on:click={() => recentTab = 'Approved'}>Approved (42)</button>
							<button class:active-tab={recentTab === 'Published'} on:click={() => recentTab = 'Published'}>Published (296)</button>
						</div>

						<div class="ui-table-wrap">
							<table class="recent-table">
								<thead>
									<tr>
										<th>Article</th>
										<th>Author</th>
										<th>Category</th>
										<th>Status</th>
										<th>Submitted On</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div class="art-col">
												<img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=100&q=80" alt="Thumb" class="art-thumb" />
												<div class="art-meta">
													<strong>Understanding Early Signs of Breast Cancer</strong>
													<span>ART-2024-1258</span>
												</div>
											</div>
										</td>
										<td><span class="author-name">Dr. Ananya Sharma</span></td>
										<td><span class="pill-badge bg-purple-pill">Cancer Care</span></td>
										<td><span class="status-pill status-pending">Pending Review</span></td>
										<td class="text-slate-500 text-xs">27 May 2024, 10:30 AM</td>
										<td><button class="more-btn"><MoreVertical size={16} /></button></td>
									</tr>
									<tr>
										<td>
											<div class="art-col">
												<img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=100&q=80" alt="Thumb" class="art-thumb" />
												<div class="art-meta">
													<strong>Immunotherapy: The Future of Cancer Treatment</strong>
													<span>ART-2024-1257</span>
												</div>
											</div>
										</td>
										<td><span class="author-name">Rahul Verma</span></td>
										<td><span class="pill-badge bg-blue-pill">Treatment & Research</span></td>
										<td><span class="status-pill status-review">In Review</span></td>
										<td class="text-slate-500 text-xs">26 May 2024, 04:15 PM</td>
										<td><button class="more-btn"><MoreVertical size={16} /></button></td>
									</tr>
									<tr>
										<td>
											<div class="art-col">
												<img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=100&q=80" alt="Thumb" class="art-thumb" />
												<div class="art-meta">
													<strong>Nutrition Tips for Cancer Patients</strong>
													<span>ART-2024-1256</span>
												</div>
											</div>
										</td>
										<td><span class="author-name">Priya Nair</span></td>
										<td><span class="pill-badge bg-green-pill">Nutrition & Wellness</span></td>
										<td><span class="status-pill status-approved">Approved</span></td>
										<td class="text-slate-500 text-xs">26 May 2024, 11:20 AM</td>
										<td><button class="more-btn"><MoreVertical size={16} /></button></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="table-footer-center">
							<a href="#all" class="view-all-link">View all articles <ArrowRight size={14} /></a>
						</div>
					</div>

					<!-- Quick Stats -->
					<div class="widget-box col-span-4">
						<h3 class="recent-title mb-4">Quick Stats</h3>
						<div class="quick-stats-list">
							<div class="qs-item">
								<div class="qs-left">
									<span class="qs-icon text-green-600 bg-green-50"><UserCheck size={18} /></span>
									<span class="qs-label">Doctor Verifications</span>
								</div>
								<strong class="qs-val">8 pending</strong>
							</div>
							<div class="qs-item">
								<div class="qs-left">
									<span class="qs-icon text-orange-600 bg-orange-50"><FileText size={18} /></span>
									<span class="qs-label">Articles Submitted Today</span>
								</div>
								<strong class="qs-val">6</strong>
							</div>
							<div class="qs-item">
								<div class="qs-left">
									<span class="qs-icon text-blue-600 bg-blue-50"><Users size={18} /></span>
									<span class="qs-label">Active Users (This Week)</span>
								</div>
								<strong class="qs-val">48</strong>
							</div>
							<div class="qs-item">
								<div class="qs-left">
									<span class="qs-icon text-purple-600 bg-purple-50"><Presentation size={18} /></span>
									<span class="qs-label">Webinar Registrations</span>
								</div>
								<strong class="qs-val">125</strong>
							</div>
							<div class="qs-item">
								<div class="qs-left">
									<span class="qs-icon text-amber-600 bg-amber-50"><DollarSign size={18} /></span>
									<span class="qs-label">Revenue from Events</span>
								</div>
								<strong class="qs-val">₹ 62,450</strong>
							</div>
						</div>
					</div>
				</div>
			{/if}

		<!-- ── Doctor Requests Section ────────────────────────────────── -->
		{#if activeSection === 'requests'}
			<div class="filter-bar">
				<button
					class="filter-btn"
					class:active-filter={requestFilter === 'all'}
					on:click={() => (requestFilter = 'all')}>All ({data.pendingDoctors.length})</button
				>
				<button
					class="filter-btn"
					class:active-filter={requestFilter === 'pending'}
					on:click={() => (requestFilter = 'pending')}
					>Pending ({data.pendingDoctors.filter((r) => r.verification_status === 'pending')
						.length})</button
				>
				<button
					class="filter-btn"
					class:active-filter={requestFilter === 'approved'}
					on:click={() => (requestFilter = 'approved')}
					>Approved ({data.pendingDoctors.filter((r) => r.verification_status === 'approved')
						.length})</button
				>
				<button
					class="filter-btn"
					class:active-filter={requestFilter === 'rejected'}
					on:click={() => (requestFilter = 'rejected')}
					>Rejected ({data.pendingDoctors.filter((r) => r.verification_status === 'rejected')
						.length})</button
				>
			</div>

			<div class="table-card">
				<table class="data-table">
					<thead>
						<tr>
							<th>Doctor Name</th>
							<th>Specialization</th>
							<th>Hospital</th>
							<th>Reg. ID</th>
							<th>Date Applied</th>
							<th>Status</th>
							<th class="text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredRequests as req}
							<tr>
								<td><strong>{req.full_name}</strong></td>
								<td>{req.specialization || '—'}</td>
								<td>{req.organization || '—'}</td>
								<td>{req.medical_reg_id || '—'}</td>
								<td>{new Date(req.created_at).toLocaleDateString()}</td>
								<td>
									<span class="status-badge status-{req.verification_status}"
										>{req.verification_status}</span
									>
								</td>
								<td class="actions-cell">
									{#if req.verification_status === 'pending'}
										<!-- Approve Button triggers modal -->
										<button class="action-btn approve" on:click={() => promptApprove(req)}>Approve</button>

										<!-- Reject Button Form -->
										<form method="POST" action="?/reject" use:enhance style="display:inline;">
											<input type="hidden" name="doctorId" value={req.id} />
											<button class="action-btn reject">Reject</button>
										</form>
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="7" class="text-center">No doctor requests found for this filter.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- ── Publishing Power Section ───────────────────────────────── -->
		{#if activeSection === 'publishing'}
			<div class="section-desc">
				<p>Control which approved doctors can publish articles and research on the JCF platform.</p>
			</div>

			<div class="table-card">
				<table class="data-table">
					<thead>
						<tr>
							<th>Doctor Name</th>
							<th>Specialization</th>
							<th class="text-center">Published Articles</th>
							<th>Publishing Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each publishingDoctors as doc}
							<tr>
								<td><strong>{doc.name}</strong></td>
								<td>{doc.specialization}</td>
								<td class="text-center">
									<strong style="color: #1e40af;">{doc.articles}</strong>
								</td>
								<td>
									<span
										class="status-badge status-{doc.status === 'granted' ? 'approved' : 'rejected'}"
									>
										{doc.status === 'granted' ? 'Can Publish' : 'Revoked'}
									</span>
								</td>
								<td>
									<label class="toggle-switch">
										<input
											type="checkbox"
											checked={doc.status === 'granted'}
											on:change={() => togglePublishing(doc.id, doc.status)}
										/>
										<span class="toggle-slider"></span>
									</label>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center">No verified doctors found.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- ── Publish Content Section ────────────────────────────────── -->
		{#if activeSection === 'publish'}
			<div class="section-desc">
				<p>Review articles and research papers approved by reviewers and publish them to the live platform.</p>
			</div>

			<div class="tabs" style="margin-bottom: 20px;">
				<button class="tab-btn active">Pending to Publish</button>
			</div>

			<div class="table-card" style="margin-bottom: 30px;">
				<h3 style="padding: 20px 20px 0; margin: 0; color: #0d2460;">Regular Articles</h3>
				<table class="data-table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Category</th>
							<th>Date Approved</th>
							<th class="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each data.approvedArticles as article}
							<tr>
								<td><strong>{article.title || 'Untitled'}</strong></td>
								<td>{article.category || 'N/A'}</td>
								<td>{new Date(article.updated_at || article.created_at).toLocaleDateString()}</td>
								<td class="text-center">
									<form method="POST" action="?/publishContent" use:enhance>
										<input type="hidden" name="articleId" value={article.id} />
										<input type="hidden" name="articleType" value="regular" />
										<button type="submit" class="action-btn approve" style="padding: 6px 12px;">Publish</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="text-center">No regular articles waiting to be published.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="table-card">
				<h3 style="padding: 20px 20px 0; margin: 0; color: #0d2460;">Research Papers</h3>
				<table class="data-table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Date Approved</th>
							<th class="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each data.approvedResearch as research}
							<tr>
								<td><strong>{research.title || 'Untitled'}</strong></td>
								<td>{new Date(research.updated_at || research.created_at).toLocaleDateString()}</td>
								<td class="text-center">
									<form method="POST" action="?/publishContent" use:enhance>
										<input type="hidden" name="articleId" value={research.id} />
										<input type="hidden" name="articleType" value="research" />
										<button type="submit" class="action-btn approve" style="padding: 6px 12px;">Publish</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3" class="text-center">No research papers waiting to be published.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- ── Manage Users Section ────────────────────────────────── -->
		{#if activeSection === 'users'}
			<div class="search-filter-bar">
				<input
					type="search"
					class="search-input"
					placeholder="Search by name or email..."
					bind:value={userSearch}
				/>
				<div class="role-filter-tabs">
					{#each ['all', 'Reader', 'Doctor', 'Admin', 'Super_Admin'] as role}
						<button
							class="filter-btn"
							class:active-filter={userRoleFilter === role}
							on:click={() => setRoleFilter(role)}
						>
							{role.replace('_', ' ')}
						</button>
					{/each}
				</div>
			</div>

			<div class="table-card">
				<table class="data-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Current Role</th>
							<th>Change Role</th>
							<th>Joined</th>
							<!-- <th>Status</th>
							<th>Action</th> -->
						</tr>
					</thead>
					<tbody>
						{#each filteredUsers as user}
							<tr>
								<td><strong>{user.full_name || 'N/A'}</strong></td>
								<td class="email-cell">{user.email || 'N/A'}</td>
								<td>
									<span class="role-badge role-{user.role?.toLowerCase() || 'reader'}">{user.role ? user.role.replace('_', ' ') : 'User'}</span>
								</td>
								<td>
									<form method="POST" action="?/updateRole" use:enhance>
										<input type="hidden" name="userId" value={user.id} />
										<select
											class="role-select"
											name="newRole"
											value={user.role || 'user'}
											on:change={(e) => e.currentTarget.form?.requestSubmit()}
										>
											<option value="user">User</option>
											<option value="Reader">Reader</option>
											<option value="Doctor">Doctor</option>
											<option value="Admin">Admin</option>
											<option value="Super_Admin">Super Admin</option>
										</select>
									</form>
								</td>
								<td>{new Date(user.created_at).toLocaleDateString()}</td>
								<!-- 
								<td>
									<span class="status-badge status-approved">
										Active
									</span>
								</td>
								<td>
									<button
										class="action-btn reject small"
										style="opacity: 0.5; cursor: not-allowed;"
										disabled
									>
										Deactivate
									</button>
								</td> 
								-->
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center">No users found for this filter.</td>
							</tr>
						{/each}
				</table>
			</div>
		{/if}
		</div>
	</main>
</div>

<!-- Approval Modal -->
{#if doctorToApprove}
	<div class="modal-overlay">
		<div class="modal-card">
			<h3>Approve {doctorToApproveName}</h3>
			<p>Select the permissions for this doctor:</p>
			
			<form method="POST" action="?/approve" use:enhance={() => {
				return async ({ update }) => {
					await update();
					cancelApprove();
				};
			}}>
				<input type="hidden" name="doctorId" value={doctorToApprove} />
				<div class="modal-actions role-actions">
					<button class="role-btn author-btn" name="assignedRole" value="author">
						<strong>Author & Doctor</strong>
						<span>Can write and publish articles</span>
					</button>
					<button class="role-btn reviewer-btn" name="assignedRole" value="reviewer">
						<strong>Reviewer & Doctor</strong>
						<span>Can write, publish, AND review other authors</span>
					</button>
				</div>
				<button type="button" class="btn-cancel-modal" on:click={cancelApprove}>Cancel</button>
			</form>
		</div>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* NEW DESIGN STYLES (MATCHING FIGMA PNG) */
	.new-dashboard-root {
		display: flex;
		min-height: 100vh;
		background: #F8FAFC;
		font-family: 'DM Sans', sans-serif;
		color: #1E293B;
	}

	.new-sidebar {
		width: 265px;
		background: #0B1729;
		color: #CBD5E1;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		border-right: 1px solid #1E293B;
		height: 100vh;
		position: sticky;
		top: 0;
	}

	.sidebar-logo {
		padding: 15px 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.logo-icon-wrap {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-img {
		max-width: 100%;
		max-height: 100%;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.main-title {
		font-size: 20px;
		font-weight: 800;
		color: #FFFFFF;
		letter-spacing: -0.02em;
	}

	.sub-title {
		font-size: 11px;
		color: #94A3B8;
	}

	.sidebar-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 12px 12px;
	}

	.sidebar-scroll::-webkit-scrollbar {
		width: 4px;
	}

	.sidebar-scroll::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 4px;
	}

	.nav-btn {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 14px;
		border: none;
		background: transparent;
		color: #CBD5E1;
		font-size: 14px;
		font-weight: 500;
		border-radius: 8px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		margin-bottom: 2px;
		text-decoration: none;
		white-space: nowrap;
	}

	.nav-btn span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-btn:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #FFFFFF;
	}

	.nav-btn.active {
		background: #2563EB;
		color: #FFFFFF;
		font-weight: 600;
	}

	.nav-section {
		margin-top: 14px;
		display: flex;
		flex-direction: column;
	}

	.nav-section-title {
		font-size: 11px;
		font-weight: 700;
		color: #64748B;
		letter-spacing: 0.06em;
		padding: 3px 14px;
		margin-bottom: 3px;
	}

	.flex-col-label {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.flex-col-label .sub-text {
		font-size: 11px;
		color: #94A3B8;
	}

	.badge {
		font-size: 11px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 999px;
		flex-shrink: 0;
	}

	.purple-badge { background: #581C87; color: #E9D5FF; }
	.yellow-badge { background: #713F12; color: #FEF08A; }
	.red-badge { background: #DC2626; color: #FFFFFF; }

	.sidebar-bottom {
		padding: 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.logout-btn { color: #F87171; }
	.logout-btn:hover { background: rgba(239, 68, 68, 0.15); color: #EF4444; }

	.main-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow-x: hidden;
	}

	.new-topbar {
		height: 64px;
		background: #FFFFFF;
		border-bottom: 1px solid #E2E8F0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24px;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.topbar-left {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 1;
		max-width: 480px;
	}

	.menu-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		color: #64748B;
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
		background: #F8FAFC;
		border: 1px solid #E2E8F0;
		border-radius: 8px;
		padding: 8px 12px;
	}

	.search-box input {
		border: none;
		background: transparent;
		outline: none;
		flex: 1;
		min-width: 80px;
		font-size: 14px;
		color: #334155;
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.icon-notification {
		background: none;
		border: none;
		position: relative;
		cursor: pointer;
		color: #64748B;
		padding: 6px;
		border-radius: 8px;
		transition: background 0.2s;
	}

	.icon-notification:hover {
		background: #F1F5F9;
	}

	.dot-badge {
		position: absolute;
		top: -2px;
		right: -2px;
		background: #EF4444;
		color: white;
		font-size: 10px;
		font-weight: 700;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.red-dot { background: #E11D48; }

	.profile-wrap {
		position: relative;
		margin-left: 8px;
	}

	.profile-trigger {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 999px;
		border: 1px solid transparent;
	}

	.profile-trigger:hover {
		background: #F8FAFC;
		border-color: #E2E8F0;
	}

	.profile-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
	}

	.profile-names {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.p-name {
		font-size: 13px;
		font-weight: 700;
		color: #1E293B;
	}

	.p-role {
		font-size: 11px;
		color: #64748B;
	}

	.profile-dropdown {
		position: absolute;
		right: 0;
		top: calc(100% + 8px);
		width: 230px;
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 12px;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
		padding: 8px 0;
		z-index: 100;
		display: flex;
		flex-direction: column;
	}

	.dd-head {
		padding: 10px 16px;
		display: flex;
		flex-direction: column;
		line-height: 1.3;
	}

	.dd-head strong {
		font-size: 14px;
		font-weight: 700;
		color: #0F172A;
	}

	.dd-head span {
		font-size: 12px;
		color: #64748B;
	}

	.profile-dropdown hr {
		margin: 6px 0;
		border: none;
		border-top: 1px solid #F1F5F9;
	}

	.profile-dropdown a {
		padding: 8px 16px;
		font-size: 13px;
		color: #334155;
		text-decoration: none;
		display: flex;
		align-items: center;
		transition: all 0.15s;
		font-weight: 500;
	}

	.profile-dropdown a:hover {
		background: #F8FAFC;
		color: #0F172A;
	}

	.profile-dropdown a.text-red-600 {
		color: #DC2626;
		font-weight: 600;
	}

	.profile-dropdown a.text-red-600:hover {
		background: #FEF2F2;
	}

	.main-content-area {
		padding: 28px 32px;
	}

	.welcome-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.welcome-title {
		font-size: 22px;
		font-weight: 700;
		color: #0F172A;
	}

	.welcome-subtitle {
		font-size: 14px;
		color: #64748B;
		margin-top: 4px;
	}

	.date-picker-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		padding: 8px 14px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #334155;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0,0,0,0.04);
	}

	.stat-grid-6 {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 16px;
		margin-bottom: 28px;
	}

	@media (max-width: 1400px) {
		.stat-grid-6 { grid-template-columns: repeat(3, 1fr); }
	}

	.ui-stat-card {
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 12px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		box-shadow: 0 1px 2px rgba(0,0,0,0.02);
	}

	.stat-icon-box {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bg-purple { background: #FAF5FF; color: #9333EA; }
	.bg-orange { background: #FFF7ED; color: #EA580C; }
	.bg-blue { background: #EFF6FF; color: #2563EB; }
	.bg-green { background: #F0FDF4; color: #16A34A; }
	.bg-pink { background: #FFF1F2; color: #E11D48; }
	.bg-indigo { background: #EEF2FF; color: #4F46E5; }

	.stat-meta {
		display: flex;
		flex-direction: column;
	}

	.meta-label { font-size: 12px; color: #64748B; font-weight: 500; }
	.meta-value { font-size: 24px; font-weight: 800; color: #0F172A; margin: 2px 0; }
	.meta-trend { font-size: 12px; display: flex; align-items: center; gap: 4px; font-weight: 600; }
	.trend-green { color: #16A34A; }
	.trend-red { color: #DC2626; }
	.trend-neutral { color: #64748B; font-weight: 400; }
	.view-schedule-link { font-size: 12px; color: #2563EB; font-weight: 600; text-decoration: none; margin-top: 4px; }

	.mgmt-overview {
		margin-bottom: 28px;
	}

	.section-hd {
		font-size: 16px;
		font-weight: 700;
		color: #0F172A;
		margin-bottom: 16px;
	}

	.mgmt-cards-row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 16px;
	}

	@media (max-width: 1400px) {
		.mgmt-cards-row { grid-template-columns: repeat(3, 1fr); }
	}

	.mgmt-box {
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 12px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.mgmt-box:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
	}

	.mgmt-ico {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14px;
	}

	.bg-circle-green { background: #DCFCE7; }
	.bg-circle-orange { background: #FFEDD5; }
	.bg-circle-blue { background: #DBEAFE; }
	.bg-circle-purple { background: #F3E8FF; }
	.bg-circle-emerald { background: #D1FAE5; }

	.mgmt-title { font-size: 15px; font-weight: 700; color: #0F172A; line-height: 1.3; }
	.mgmt-desc { font-size: 12px; color: #64748B; margin: 6px 0 16px; flex: 1; line-height: 1.4; }
	.mgmt-action { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; border-top: 1px solid #F1F5F9; padding-top: 12px; }

	.middle-widgets-row {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 20px;
		margin-bottom: 28px;
	}

	.col-span-5 { grid-column: span 5; }
	.col-span-4 { grid-column: span 4; }
	.col-span-3 { grid-column: span 3; }

	@media (max-width: 1200px) {
		.col-span-5, .col-span-4, .col-span-3 { grid-column: span 12; }
	}

	.widget-box {
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 12px;
		padding: 20px;
		display: flex;
		flex-direction: column;
	}

	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.widget-header h3 { font-size: 15px; font-weight: 700; color: #0F172A; }
	.filter-select { border: 1px solid #E2E8F0; background: #F8FAFC; font-size: 12px; padding: 4px 10px; border-radius: 6px; color: #475569; display: flex; align-items: center; gap: 6px; cursor: pointer; }

	.chart-legend {
		display: flex;
		gap: 16px;
		font-size: 12px;
		color: #64748B;
		margin-bottom: 12px;
	}

	.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
	.blue-dot { background: #2563EB; }
	.orange-dot { background: #F97316; }
	.green-dot { background: #10B981; }
	.purple-dot { background: #8B5CF6; }

	.line-chart { width: 100%; height: 160px; overflow: visible; }
	.axis-label { font-size: 10px; fill: #94A3B8; }

	.donut-flex-container {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex: 1;
	}

	.donut-chart-box { position: relative; }
	.donut-sub { font-size: 10px; fill: #64748B; font-weight: 500; }
	.donut-val { font-size: 22px; fill: #0F172A; font-weight: 800; }

	.donut-legend {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.leg-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
	.bullet { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
	.leg-text { color: #475569; width: 120px; }
	.leg-pct { color: #0F172A; margin-left: auto; }

	.writers-list { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
	.writer-row { display: flex; align-items: center; gap: 12px; font-size: 13px; }
	.writer-row img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
	.w-name { font-weight: 600; color: #1E293B; }
	.w-count { margin-left: auto; color: #2563EB; font-weight: 600; font-size: 12px; }

	.bottom-widgets-row {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 20px;
	}

	.col-span-8 { grid-column: span 8; }
	@media (max-width: 1200px) { .col-span-8 { grid-column: span 12; } }

	.recent-title { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }

	.table-tabs {
		display: flex;
		gap: 24px;
		border-bottom: 1px solid #E2E8F0;
		margin-bottom: 16px;
	}

	.table-tabs button {
		background: none;
		border: none;
		padding-bottom: 10px;
		font-size: 13px;
		font-weight: 500;
		color: #64748B;
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}

	.table-tabs button.active-tab {
		color: #2563EB;
		border-color: #2563EB;
		font-weight: 600;
	}

	.ui-table-wrap { overflow-x: auto; }
	.recent-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
	.recent-table th { padding: 12px 16px; color: #64748B; font-weight: 600; font-size: 12px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
	.recent-table td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; white-space: nowrap; }
	.art-col { display: flex; align-items: center; gap: 12px; }
	.art-thumb { width: 44px; height: 36px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
	.art-meta { display: flex; flex-direction: column; max-width: 240px; }
	.art-meta strong { font-size: 13px; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.art-meta span { font-size: 11px; color: #64748B; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.author-name { font-weight: 500; color: #334155; white-space: nowrap; }

	.pill-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-block; white-space: nowrap; }
	.bg-purple-pill { background: #FAF5FF; color: #9333EA; border: 1px solid #F3E8FF; }
	.bg-blue-pill { background: #EFF6FF; color: #2563EB; border: 1px solid #DBEAFE; }
	.bg-green-pill { background: #F0FDF4; color: #16A34A; border: 1px solid #DCFCE7; }

	.status-pill { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-block; white-space: nowrap; }
	.status-pending { background: #FEF9C3; color: #854D0E; }
	.status-review { background: #E0F2FE; color: #0369A1; }
	.status-approved { background: #DCFCE7; color: #15803D; }

	.more-btn { background: none; border: none; color: #94A3B8; cursor: pointer; }
	.table-footer-center { padding: 16px; text-align: center; border-top: 1px solid #F1F5F9; }
	.view-all-link { color: #2563EB; font-weight: 600; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }

	.quick-stats-list { display: flex; flex-direction: column; gap: 16px; }
	.qs-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F8FAFC; }
	.qs-left { display: flex; align-items: center; gap: 12px; }
	.qs-icon { width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
	.qs-label { font-size: 13px; color: #475569; font-weight: 500; }
	.qs-val { font-size: 14px; font-weight: 700; color: #0F172A; }

	/* OLD CLASSES PRESERVATION FOR OTHER TABS */

	.dashboard {
		display: flex;
		min-height: 100vh;
		font-family: 'DM Sans', sans-serif;
		background: #f1f5f9;
		color: #111827;
	}

	/* ── Sidebar ─────────────────────────────────────────────────── */
	.sidebar {
		width: 240px;
		min-height: 100vh;
		background: #1e40af;
		border-right: none;
		display: flex;
		flex-direction: column;
		padding: 24px 0;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 20px 28px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}

	.logo-img {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		object-fit: cover;
	}

	.brand-name {
		display: block;
		color: #ffffff;
		font-size: 20px;
		font-weight: 800;
	}

	.brand-sub {
		display: block;
		color: #ffffff;
		font-size: 14px;
		font-weight: 500;
	}

	.nav {
		flex: 1;
		padding: 20px 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		border-radius: 10px;
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.75);
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		font-family: inherit;
	}

	.nav-item:hover {
		background: #0d2460;
		color: #fff;
	}

	.nav-item.active {
		background: rgba(255, 255, 255, 0.2);
		color: #ffffff;
		font-weight: 700;
	}

	.nav-icon {
		font-size: 18px;
	}

	.sidebar-footer {
		padding: 16px 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		margin-top: auto;
	}

	.logout-btn {
		color: #F87171;
		font-size: 15px;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 14px;
		border-radius: 8px;
		transition: all 0.2s;
		background: transparent;
		font-weight: 500;
	}

	.logout-btn:hover {
		background: rgba(239, 68, 68, 0.15);
		color: #EF4444;
	}

	/* ── Main ──────────────────────────────────────────────────────── */
	.main {
		flex: 1;
		padding: 28px 32px;
		overflow-y: auto;
	}

	/* ── Topbar ─────────────────────────────────────────────────── */
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28px;
	}

	.page-title {
		font-size: 22px;
		font-weight: 800;
		color: #0d2460;
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.admin-badge {
		background: #dbeafe;
		color: #1e40af;
		font-size: 12px;
		font-weight: 700;
		padding: 4px 12px;
		border-radius: 20px;
	}

	.avatar {
		width: 38px;
		height: 38px;
		background: #1e40af;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		user-select: none;
	}

	.avatar-wrapper {
		position: relative;
	}

	.avatar-dropdown {
		position: absolute;
		top: 48px;
		right: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		min-width: 200px;
		z-index: 100;
		overflow: hidden;
	}

	.dropdown-header {
		padding: 14px 16px;
		background: #f8fafc;
	}

	.dropdown-header strong {
		display: block;
		font-size: 14px;
		color: #0d2460;
		margin-bottom: 2px;
	}

	.dropdown-header span {
		font-size: 12px;
		color: #6b7280;
	}

	.dropdown-divider {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 0;
	}

	.dropdown-item {
		display: block;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 500;
		color: #374151;
		text-decoration: none;
		transition: background 0.15s;
	}

	.dropdown-item:hover {
		background: #f1f5f9;
		color: #0d2460;
	}

	.dropdown-logout {
		color: #dc2626;
	}

	.dropdown-logout:hover {
		background: #fee2e2;
		color: #991b1b;
	}

	/* ── Stats Grid ─────────────────────────────────────────────── */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		margin-bottom: 24px;
	}

	.stat-card {
		background: white;
		border-radius: 14px;
		padding: 20px;
		display: flex;
		align-items: center;
		gap: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		flex-shrink: 0;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-card {
		background: white;
		padding: 30px;
		border-radius: 16px;
		width: 90%;
		max-width: 420px;
		text-align: center;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.modal-card h3 {
		margin: 0 0 10px;
		color: #0d2460;
		font-size: 22px;
	}

	.modal-card p {
		color: #6b7280;
		margin: 0 0 24px;
		font-size: 15px;
	}

	.role-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.role-btn {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		padding: 16px;
		border-radius: 12px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 0.2s;
	}

	.role-btn strong {
		color: #0d2460;
		font-size: 16px;
		margin-bottom: 4px;
	}

	.role-btn span {
		color: #64748b;
		font-size: 13px;
	}

	.author-btn:hover {
		border-color: #3b82f6;
		background: #eff6ff;
	}

	.reviewer-btn:hover {
		border-color: #16a34a;
		background: #f0fdf4;
	}

	.btn-cancel-modal {
		background: transparent;
		border: none;
		color: #94a3b8;
		font-weight: 600;
		cursor: pointer;
		font-size: 14px;
	}

	.btn-cancel-modal:hover {
		color: #64748b;
	}

	.stat-label {
		font-size: 12px;
		color: #6b7280;
		font-weight: 500;
		margin-bottom: 4px;
	}

	.stat-value {
		font-size: 22px;
		font-weight: 800;
		color: #0d2460;
		line-height: 1;
		margin-bottom: 4px;
	}

	.stat-change.positive {
		font-size: 11px;
		color: #16a34a;
		font-weight: 600;
	}

	/* ── Analytics Grid ─────────────────────────────────────────── */
	.analytics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.card {
		background: white;
		border-radius: 14px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.wide-card {
		grid-column: 1 / -1;
	}

	.card-title {
		font-size: 15px;
		font-weight: 700;
		color: #0d2460;
		margin-bottom: 20px;
	}

	/* Traffic chart */
	.traffic-chart {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.traffic-legend {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		color: #4b5563;
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}

	.legend-label {
		flex: 1;
	}
	.legend-pct {
		font-weight: 700;
		color: #0d2460;
	}

	/* Bar chart */
	.bar-chart {
		display: flex;
		align-items: flex-end;
		gap: 14px;
		height: 140px;
		padding-bottom: 4px;
		border-bottom: 2px solid #e5e7eb;
	}

	.bar-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		flex: 1;
	}

	.bar-pair {
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}

	.bar {
		width: 14px;
		border-radius: 4px 4px 0 0;
		transition: height 0.3s;
	}

	.users-bar {
		background: #1e40af;
	}
	.articles-bar {
		background: #93c5fd;
	}

	.bar-label {
		font-size: 11px;
		color: #9ca3af;
		font-weight: 500;
	}

	.bar-legend {
		display: flex;
		gap: 20px;
		margin-top: 12px;
		font-size: 12px;
		color: #6b7280;
	}

	.bar-legend span {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	/* Activity */
	.activity-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.activity-item {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 14px 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.activity-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-top: 4px;
		flex-shrink: 0;
	}

	.activity-dot.doctor {
		background: #1e40af;
	}
	.activity-dot.user {
		background: #16a34a;
	}
	.activity-dot.article {
		background: #d97706;
	}
	.activity-dot.reject {
		background: #dc2626;
	}

	.activity-text p {
		font-size: 13px;
		color: #374151;
		font-weight: 500;
	}
	.activity-time {
		font-size: 11px;
		color: #9ca3af;
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: 12px;
		border-bottom: 2px solid #f1f5f9;
		padding-bottom: 0;
	}

	.tab-btn {
		padding: 10px 20px;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		font-weight: 600;
		color: #64748b;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	.tab-btn:hover {
		color: #0d2460;
	}

	.tab-btn.active {
		color: #1e40af;
		border-bottom-color: #1e40af;
	}

	/* Pill Tabs */
	.pill-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		background: transparent;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		color: #64748b;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	.pill-btn:hover {
		background: #f8fafc;
		color: #0d2460;
	}

	.pill-btn.active {
		background: #eff6ff;
		color: #1d4ed8;
		box-shadow: 0 1px 3px rgba(0,0,0,0.05);
	}

	/* ── Filter Bar ─────────────────────────────────────────────── */
	.filter-bar,
	.search-filter-bar {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.search-filter-bar {
		justify-content: space-between;
	}

	.search-input {
		padding: 10px 16px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-size: 14px;
		outline: none;
		width: 280px;
		font-family: inherit;
		color: #111827;
	}

	.search-input:focus {
		border-color: #1e40af;
	}

	.role-filter-tabs {
		display: flex;
		gap: 8px;
	}

	.filter-btn {
		padding: 8px 16px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		font-size: 13px;
		font-weight: 700;
		color: #6b7280;
		cursor: pointer;
		font-family: inherit;
	}

	.filter-btn:not(.active-filter):hover {
		border-color: #93c5fd;
		color: #1e40af;
	}
	.active-filter {
		background: #1e40af;
		color: white;
		border-color: #1e40af;
	}

	/* ── Table ──────────────────────────────────────────────────── */
	.table-card {
		background: white;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th {
		background: #f8fafc;
		padding: 14px 18px;
		text-align: left;
		font-size: 12px;
		font-weight: 700;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #e5e7eb;
	}

	.data-table td {
		padding: 14px 18px;
		font-size: 13px;
		color: #374151;
		border-bottom: 1px solid #f3f4f6;
		vertical-align: middle;
	}

	.data-table tr:last-child td {
		border-bottom: none;
	}

	.data-table tr:hover td {
		background: #fafbff;
	}

	/* Removed inactive-row opacity fade */

	.reg-id {
		background: #f3f4f6;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		color: #374151;
		font-family: monospace;
	}

	.email-cell {
		color: #6b7280;
		font-size: 12px;
	}

	/* Status Badges */
	.status-badge {
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.status-pending {
		background: #fef3c7;
		color: #92400e;
	}
	.status-approved {
		background: #d1fae5;
		color: #065f46;
	}
	.status-rejected {
		background: #fee2e2;
		color: #991b1b;
	}

	/* Role Badges */
	.role-badge {
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.role-reader {
		background: #f3f4f6;
		color: #374151;
	}
	.role-doctor {
		background: #dbeafe;
		color: #1e40af;
	}
	.role-admin {
		background: #fae8ff;
		color: #7e22ce;
	}
	.role-super_admin {
		background: #ffedd5;
		color: #c2410c; /* Orange tint for Super Admin */
	}

	.role-select {
		padding: 6px 12px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 500;
		font-family: inherit;
		color: #374151;
		background-color: white;
		cursor: pointer;
		outline: none;
		transition: all 0.2s;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 10px center;
		background-size: 14px;
		padding-right: 30px;
	}

	.role-select:focus {
		border-color: #1e40af;
		box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.1);
	}

	/* Action Buttons */
	.actions-cell {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.text-center {
		text-align: center;
	}

	.action-btn {
		padding: 9px 20px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.2s;
	}

	.action-btn.approve {
		background: #22c55e;
		color: white;
	}
	.action-btn.approve:hover {
		background: #16a34a;
	}
	.action-btn.reject {
		background: #ef4444;
		color: white;
	}
	.action-btn.reject:hover {
		background: #dc2626;
	}
	.action-btn.small {
		padding: 7px 14px;
		font-size: 13px;
	}

	/* Toggle Switch */
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 46px;
		height: 26px;
		cursor: pointer;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		inset: 0;
		background: #e5e7eb;
		border-radius: 34px;
		transition: 0.3s;
	}

	.toggle-slider:before {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		left: 3px;
		bottom: 3px;
		background: white;
		border-radius: 50%;
		transition: 0.3s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.toggle-switch input:checked + .toggle-slider {
		background: #1e40af;
	}
	.toggle-switch input:checked + .toggle-slider:before {
		transform: translateX(20px);
	}

	/* Section desc */
	.section-desc {
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: 10px;
		padding: 14px 18px;
		font-size: 13px;
		color: #1e40af;
		margin-bottom: 20px;
	}

	@media (max-width: 900px) {
		.stats-grid {
			grid-template-columns: 1fr 1fr;
		}
		.analytics-grid {
			grid-template-columns: 1fr;
		}
		.wide-card {
			grid-column: 1;
		}
		.sidebar {
			width: 200px;
		}
	}

	.view-link {
		display: inline-block;
		padding: 6px 12px;
		background-color: #eff6ff;
		color: #1d4ed8;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.view-link:hover {
		background-color: #dbeafe;
		color: #1e40af;
		text-decoration: none;
	}
</style>
