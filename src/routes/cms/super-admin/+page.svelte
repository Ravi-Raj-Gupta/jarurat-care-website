<script lang="ts">
import { onMount } from 'svelte';
import { cmsSupabase } from '$lib/cmsSupabase';
	// Active section in sidebar
	let activeSection = 'analytics';
	let showDropdown = false;
	let dropdownRef: HTMLElement;
	let pendingDoctors: any[] = [];
	let loading = true;

	async function loadPendingDoctors() {
	const { data, error } = await cmsSupabase
		.from('profiles')
		.select('*')
		.eq('profile_completed', true)
		.eq('verification_status', 'pending');

	if (!error && data) {
	pendingDoctors = data;
	doctorRequests = data;
}

	loading = false;
}

	function closeDropdown(e: MouseEvent) {
		if (showDropdown && dropdownRef && !dropdownRef.contains(e.target as Node)) {
			showDropdown = false;
		}
	}

	// ─── Mock Data ───────────────────────────────────────────────────────────────

	const statsCards = [
		{ label: 'Total Users', value: '1,284', change: '+12%', icon: '👥', color: '#1e40af' },
		{ label: 'Registered Doctors', value: '86', change: '+5%', icon: '🩺', color: '#0d6efd' },
		{ label: 'Pending Requests', value: '14', change: '', icon: '⏳', color: '#d97706' },
		{ label: 'Published Articles', value: '312', change: '+18%', icon: '📄', color: '#16a34a' }
	];

	const recentActivity = [
		{ text: 'Dr. Ananya Sharma submitted profile for review', time: '2 hours ago', type: 'doctor' },
		{ text: 'User Raghav Menon created an account', time: '4 hours ago', type: 'user' },
		{ text: 'Dr. Priya Kapoor\'s article was approved', time: '6 hours ago', type: 'article' },
		{ text: 'Dr. Vikram Singh request was rejected', time: '1 day ago', type: 'reject' },
		{ text: 'New article submitted by Dr. Meera Nair', time: '1 day ago', type: 'article' }
	];

	const trafficData = [
		{ label: 'Doctors', pct: 34, color: '#1e40af' },
		{ label: 'Readers', pct: 55, color: '#93c5fd' },
		{ label: 'Others', pct: 11, color: '#dbeafe' }
	];

	// Doctor Requests
	let doctorRequests: any[] = [];
	let requestFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';

	$: filteredRequests = requestFilter === 'all'
		? doctorRequests
		: doctorRequests.filter(r => r.status === requestFilter);

	function updateStatus(id: number, status: ReqStatus) {
		doctorRequests = doctorRequests.map(r => r.id === id ? { ...r, status } : r);
	}

	// Publishing Power
	type PubStatus = 'granted' | 'revoked';
	let publishingDoctors = [
		{ id: 1, name: 'Dr. Priya Kapoor', specialization: 'Neurology', articles: 12, status: 'granted' as PubStatus },
		{ id: 2, name: 'Dr. Meera Nair', specialization: 'Gastroenterology', articles: 7, status: 'granted' as PubStatus },
		{ id: 3, name: 'Dr. Suresh Pillai', specialization: 'Cardiology', articles: 24, status: 'granted' as PubStatus },
		{ id: 4, name: 'Dr. Nandini Rao', specialization: 'Oncology', articles: 3, status: 'revoked' as PubStatus },
		{ id: 5, name: 'Dr. Arun Gupta', specialization: 'Pediatrics', articles: 9, status: 'granted' as PubStatus }
	];

	function togglePublishing(id: number) {
		publishingDoctors = publishingDoctors.map(d =>
			d.id === id ? { ...d, status: d.status === 'granted' ? 'revoked' : 'granted' } : d
		);
	}

	// User Management
	type UserRole = 'reader' | 'doctor' | 'admin';
	let users = [
		{ id: 1, name: 'Raghav Menon', email: 'raghav@email.com', role: 'reader' as UserRole, joined: '2026-07-08', active: true },
		{ id: 2, name: 'Sunita Joshi', email: 'sunita@email.com', role: 'reader' as UserRole, joined: '2026-07-07', active: true },
		{ id: 3, name: 'Dr. Priya Kapoor', email: 'priya@email.com', role: 'doctor' as UserRole, joined: '2026-06-20', active: true },
		{ id: 4, name: 'Arjun Malhotra', email: 'arjun@email.com', role: 'reader' as UserRole, joined: '2026-06-15', active: false },
		{ id: 5, name: 'Dr. Suresh Pillai', email: 'suresh@email.com', role: 'doctor' as UserRole, joined: '2026-06-10', active: true },
		{ id: 6, name: 'Admin User', email: 'admin@jarurat.care', role: 'admin' as UserRole, joined: '2026-01-01', active: true }
	];
	let userSearch = '';
	let userRoleFilter: 'all' | UserRole = 'all';

	$: filteredUsers = users.filter(u => {
		const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
		const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
		return matchRole && matchSearch;
	});

	function toggleUserActive(id: number) {
		users = users.map(u => u.id === id ? { ...u, active: !u.active } : u);
	}

	function changeUserRole(id: number, newRole: string) {
		users = users.map(u => u.id === id ? { ...u, role: newRole as UserRole } : u);
	}

	function setRoleFilter(role: string) {
		userRoleFilter = role as 'all' | UserRole;
	}

	const navItems = [
		{ id: 'analytics', label: 'Data Analytics' },
		{ id: 'requests', label: 'Doctor Requests' },
		{ id: 'publishing', label: 'Publishing Power' },
		{ id: 'users', label: 'Manage Users' }
	];

	onMount(() => {
	loadPendingDoctors();
});
</script>

<svelte:window on:click={closeDropdown} />

<div class="dashboard">
	<!-- Sidebar -->
	<aside class="sidebar">
		<div class="brand">
			<img src="/logo.png" alt="JCF Logo" class="logo-img" onerror="this.style.display='none'" />
			<div>
				<span class="brand-name">JCF Admin</span>
				<span class="brand-sub">Super Admin Panel</span>
			</div>
		</div>

		<nav class="nav">
			{#each navItems as item}
				<button
					class="nav-item"
					class:active={activeSection === item.id}
					on:click={() => (activeSection = item.id)}
				>
					<span>{item.label}</span>
				</button>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<a href="/cms/login" class="logout-btn">⏻ Logout</a>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="main">
		<!-- Top Bar -->
		<div class="topbar">
			<div class="topbar-left">
				<h1 class="page-title">
					{#if activeSection === 'analytics'}Data Analytics
					{:else if activeSection === 'requests'}Doctor Requests
					{:else if activeSection === 'publishing'}Publishing Power
					{:else}Manage Users
					{/if}
				</h1>
			</div>
			<div class="topbar-right">
				<span class="admin-badge">Super Admin</span>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="avatar-wrapper" bind:this={dropdownRef}>
					<div class="avatar" on:click={() => showDropdown = !showDropdown}>SA</div>
					{#if showDropdown}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="avatar-dropdown">
							<div class="dropdown-header">
								<strong>Super Admin</strong>
								<span>admin@jarurat.care</span>
							</div>
							<hr class="dropdown-divider" />
							<a href="/cms/complete-profile" class="dropdown-item" on:click={() => showDropdown = false}>View Profile</a>
							<a href="/cms/login" class="dropdown-item dropdown-logout">Logout</a>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- ── Analytics Section ─────────────────────────────────────── -->
		{#if activeSection === 'analytics'}
			<!-- Stats Cards -->
			<div class="stats-grid">
				{#each statsCards as card}
					<div class="stat-card">
						<div class="stat-icon" style="background: {card.color}20; color: {card.color}">
							{card.icon}
						</div>
						<div class="stat-info">
							<p class="stat-label">{card.label}</p>
							<h3 class="stat-value">{card.value}</h3>
							{#if card.change}
								<span class="stat-change positive">{card.change} this month</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="analytics-grid">
				<!-- Traffic breakdown -->
				<div class="card">
					<h3 class="card-title">User Traffic Breakdown</h3>
					<div class="traffic-chart">
						<div class="donut-ring">
							<svg width="140" height="140" viewBox="0 0 140 140">
								<circle cx="70" cy="70" r="54" fill="none" stroke="#dbeafe" stroke-width="22"/>
								<circle cx="70" cy="70" r="54" fill="none" stroke="#93c5fd" stroke-width="22"
									stroke-dasharray="{(55/100)*339.29} {(45/100)*339.29}"
									stroke-dashoffset="{-(34/100)*339.29}"
									transform="rotate(-90 70 70)"/>
								<circle cx="70" cy="70" r="54" fill="none" stroke="#1e40af" stroke-width="22"
									stroke-dasharray="{(34/100)*339.29} {(66/100)*339.29}"
									transform="rotate(-90 70 70)"/>
								<text x="70" y="66" text-anchor="middle" font-size="18" font-weight="700" fill="#0d2460">55%</text>
								<text x="70" y="82" text-anchor="middle" font-size="11" fill="#6b7280">Readers</text>
							</svg>
						</div>
						<div class="traffic-legend">
							{#each trafficData as t}
								<div class="legend-row">
									<span class="legend-dot" style="background: {t.color}"></span>
									<span class="legend-label">{t.label}</span>
									<span class="legend-pct">{t.pct}%</span>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Monthly Overview mini chart -->
				<div class="card">
					<h3 class="card-title">Monthly Overview</h3>
					<div class="bar-chart">
						{#each [
							{ month: 'Feb', users: 40, articles: 12 },
							{ month: 'Mar', users: 65, articles: 18 },
							{ month: 'Apr', users: 55, articles: 22 },
							{ month: 'May', users: 78, articles: 30 },
							{ month: 'Jun', users: 90, articles: 35 },
							{ month: 'Jul', users: 72, articles: 28 }
						] as bar}
							<div class="bar-group">
								<div class="bar-pair">
									<div class="bar users-bar" style="height: {bar.users * 1.4}px" title="{bar.users} users"></div>
									<div class="bar articles-bar" style="height: {bar.articles * 1.4}px" title="{bar.articles} articles"></div>
								</div>
								<span class="bar-label">{bar.month}</span>
							</div>
						{/each}
					</div>
					<div class="bar-legend">
						<span><span class="legend-dot" style="background:#1e40af"></span> New Users</span>
						<span><span class="legend-dot" style="background:#93c5fd"></span> Articles</span>
					</div>
				</div>

				<!-- Recent Activity -->
				<div class="card wide-card">
					<h3 class="card-title">Recent Activity</h3>
					<ul class="activity-list">
						{#each recentActivity as item}
							<li class="activity-item">
								<div class="activity-dot {item.type}"></div>
								<div class="activity-text">
									<p>{item.text}</p>
									<span class="activity-time">{item.time}</span>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}

		<!-- ── Doctor Requests Section ────────────────────────────────── -->
		{#if activeSection === 'requests'}
			<div class="filter-bar">
				<button class="filter-btn" class:active-filter={requestFilter === 'all'} on:click={() => requestFilter = 'all'}>All ({doctorRequests.length})</button>
				<button class="filter-btn" class:active-filter={requestFilter === 'pending'} on:click={() => requestFilter = 'pending'}>Pending ({doctorRequests.filter(r => r.status === 'pending').length})</button>
				<button class="filter-btn" class:active-filter={requestFilter === 'approved'} on:click={() => requestFilter = 'approved'}>Approved ({doctorRequests.filter(r => r.status === 'approved').length})</button>
				<button class="filter-btn" class:active-filter={requestFilter === 'rejected'} on:click={() => requestFilter = 'rejected'}>Rejected ({doctorRequests.filter(r => r.status === 'rejected').length})</button>
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
								<td>—</td>
								<td>—</td>
								<td>{req.email}</td>
								<td>{new Date(req.created_at).toLocaleDateString()}</td>
								<td>
									<span class="status-badge status-{req.status}">{req.status}</span>
								</td>
								<td class="actions-cell">
									<button
										class="action-btn approve"
										style={req.status === 'approved' ? 'visibility: hidden;' : ''}
										on:click={() => updateStatus(req.id, 'approved')}
									>
										Approve
									</button>
									<button
										class="action-btn reject"
										style={req.status === 'rejected' ? 'visibility: hidden;' : ''}
										on:click={() => updateStatus(req.id, 'rejected')}
									>
										Reject
									</button>
								</td>
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
									<span class="status-badge status-{doc.status === 'granted' ? 'approved' : 'rejected'}">
										{doc.status === 'granted' ? 'Can Publish' : 'Revoked'}
									</span>
								</td>
								<td>
									<label class="toggle-switch">
										<input
											type="checkbox"
											checked={doc.status === 'granted'}
											on:change={() => togglePublishing(doc.id)}
										/>
										<span class="toggle-slider"></span>
									</label>
								</td>
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
					{#each ['all', 'reader', 'doctor', 'admin'] as role}
						<button
							class="filter-btn"
							class:active-filter={userRoleFilter === role}
							on:click={() => setRoleFilter(role)}
						>
							{role.charAt(0).toUpperCase() + role.slice(1)}
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
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredUsers as user}
							<tr class:inactive-row={!user.active}>
								<td><strong>{user.name}</strong></td>
								<td class="email-cell">{user.email}</td>
								<td>
									<span class="role-badge role-{user.role}">{user.role}</span>
								</td>
								<td>
									<select
										class="role-select"
										value={user.role}
										on:change={(e) => changeUserRole(user.id, e.currentTarget.value)}
									>
										<option value="reader">Reader</option>
										<option value="doctor">Doctor</option>
										<option value="admin">Admin</option>
									</select>
								</td>
								<td>{user.joined}</td>
								<td>
									<span class="status-badge {user.active ? 'status-approved' : 'status-rejected'}">
										{user.active ? 'Active' : 'Inactive'}
									</span>
								</td>
								<td>
									<button
										class="action-btn {user.active ? 'reject small' : 'approve small'}"
										on:click={() => toggleUserActive(user.id)}
									>
										{user.active ? 'Deactivate' : 'Activate'}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* { box-sizing: border-box; margin: 0; padding: 0; }

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
		border-bottom: 1px solid rgba(255,255,255,0.2);
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
		color: rgba(255,255,255,0.75);
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
		background: rgba(255,255,255,0.2);
		color: #ffffff;
		font-weight: 700;
	}

	.nav-icon { font-size: 18px; }

	.sidebar-footer {
		padding: 16px 20px;
		border-top: 1px solid rgba(255,255,255,0.2);
		margin-top: auto;
	}

	.logout-btn {
		color: #ffffff;
		font-size: 15px;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-radius: 8px;
		transition: all 0.2s;
		background: #1e40af;
		font-weight: 600;
	}

	.logout-btn:hover { background: #0d2460; color: #fff; }

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
		box-shadow: 0 8px 24px rgba(0,0,0,0.12);
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
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

	.traffic-legend { display: flex; flex-direction: column; gap: 14px; }

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

	.legend-label { flex: 1; }
	.legend-pct { font-weight: 700; color: #0d2460; }

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

	.users-bar { background: #1e40af; }
	.articles-bar { background: #93c5fd; }

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
	.activity-list { list-style: none; display: flex; flex-direction: column; gap: 0; }

	.activity-item {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 14px 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.activity-item:last-child { border-bottom: none; }

	.activity-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-top: 4px;
		flex-shrink: 0;
	}

	.activity-dot.doctor { background: #1e40af; }
	.activity-dot.user { background: #16a34a; }
	.activity-dot.article { background: #d97706; }
	.activity-dot.reject { background: #dc2626; }

	.activity-text p { font-size: 13px; color: #374151; font-weight: 500; }
	.activity-time { font-size: 11px; color: #9ca3af; }

	/* ── Filter Bar ─────────────────────────────────────────────── */
	.filter-bar, .search-filter-bar {
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

	.search-input:focus { border-color: #1e40af; }

	.role-filter-tabs { display: flex; gap: 8px; }

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

	.filter-btn:not(.active-filter):hover { border-color: #93c5fd; color: #1e40af; }
	.active-filter { background: #1e40af; color: white; border-color: #1e40af; }

	/* ── Table ──────────────────────────────────────────────────── */
	.table-card {
		background: white;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

	.data-table tr:last-child td { border-bottom: none; }

	.data-table tr:hover td { background: #fafbff; }

	/* Removed inactive-row opacity fade */

	.reg-id {
		background: #f3f4f6;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		color: #374151;
		font-family: monospace;
	}

	.email-cell { color: #6b7280; font-size: 12px; }

	/* Status Badges */
	.status-badge {
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.status-pending { background: #fef3c7; color: #92400e; }
	.status-approved { background: #d1fae5; color: #065f46; }
	.status-rejected { background: #fee2e2; color: #991b1b; }

	/* Role Badges */
	.role-badge {
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 700;
		text-transform: capitalize;
	}

	.role-reader { background: #f3f4f6; color: #374151; }
	.role-doctor { background: #dbeafe; color: #1e40af; }
	.role-admin { background: #fae8ff; color: #7e22ce; }

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
	.actions-cell { display: flex; gap: 10px; justify-content: center; }

	.text-center { text-align: center; }

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

	.action-btn.approve { background: #22c55e; color: white; }
	.action-btn.approve:hover { background: #16a34a; }
	.action-btn.reject { background: #ef4444; color: white; }
	.action-btn.reject:hover { background: #dc2626; }
	.action-btn.small { padding: 7px 14px; font-size: 13px; }

	/* Toggle Switch */
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 46px;
		height: 26px;
		cursor: pointer;
	}

	.toggle-switch input { opacity: 0; width: 0; height: 0; }

	.toggle-slider {
		position: absolute;
		inset: 0;
		background: #e5e7eb;
		border-radius: 34px;
		transition: 0.3s;
	}

	.toggle-slider:before {
		content: "";
		position: absolute;
		width: 20px;
		height: 20px;
		left: 3px;
		bottom: 3px;
		background: white;
		border-radius: 50%;
		transition: 0.3s;
		box-shadow: 0 1px 3px rgba(0,0,0,0.2);
	}

	.toggle-switch input:checked + .toggle-slider { background: #1e40af; }
	.toggle-switch input:checked + .toggle-slider:before { transform: translateX(20px); }

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
		.stats-grid { grid-template-columns: 1fr 1fr; }
		.analytics-grid { grid-template-columns: 1fr; }
		.wide-card { grid-column: 1; }
		.sidebar { width: 200px; }
	}
</style>
