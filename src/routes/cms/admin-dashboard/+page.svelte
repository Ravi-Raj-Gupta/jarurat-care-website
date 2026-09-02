<script lang="ts">
	import { 
		Calendar as CalendarIcon, FileText, Newspaper, HelpCircle, 
		ArrowRight, TrendingUp, PlusCircle, Clock, CheckCircle, 
		Eye, Edit3, ExternalLink, Activity, Users, MoreVertical
	} from 'lucide-svelte';

	export let data;
	$: userName = data?.currentUser?.name?.split(' ')[0] || 'Admin';
	let selectedTab = 'All';
	const tabs = ['All', 'Blogs', 'News', 'Events', 'FAQs'];

	// Real data or rich fallbacks for preview
	$: cmsList = data?.cmsContents && data.cmsContents.length > 0 ? data.cmsContents : [
		{ id: 1, title: 'Understanding Cancer Therapy & Patient Care', type: 'Blog', category: 'Cancer Care', author: 'Dr. Ananya Sharma', date: '04 Aug 2026', status: 'Published' },
		{ id: 2, title: 'Annual Healthcare Summit 2026 - Live Webinar', type: 'Event', category: 'Webinars', author: 'Admin Team', date: '02 Aug 2026', status: 'Scheduled' },
		{ id: 3, title: 'Free Diagnostic Screenings Announced in New Pune Branch', type: 'News', category: 'Announcement', author: 'Media Desk', date: '01 Aug 2026', status: 'Published' },
		{ id: 4, title: 'How to avail subsidized diagnostic tests at JCF?', type: 'FAQ', category: 'Patient Assistance', author: 'Helpdesk Support', date: '28 Jul 2026', status: 'Active' },
		{ id: 5, title: 'Nutritional Guidelines During Oncology Treatment', type: 'Blog', category: 'Nutrition', author: 'Dr. Priya Nair', date: '25 Jul 2026', status: 'In Review' }
	];

	// --- Dynamic Chart Data ---
	$: totalItems = cmsList.length;
	
	$: blogsCount = cmsList.filter(item => item.type?.toLowerCase().includes('blog')).length;
	$: newsCount = cmsList.filter(item => item.type?.toLowerCase().includes('news') || item.type?.toLowerCase().includes('campaign')).length;
	$: faqsEventsCount = cmsList.filter(item => item.type?.toLowerCase().includes('faq') || item.type?.toLowerCase().includes('event')).length;
	
	$: blogsPct = totalItems > 0 ? Math.round((blogsCount / totalItems) * 100) : 0;
	$: newsPct = totalItems > 0 ? Math.round((newsCount / totalItems) * 100) : 0;
	$: faqsEventsPct = totalItems > 0 ? Math.round((faqsEventsCount / totalItems) * 100) : 0;
	
	$: newsOffset = -blogsPct;
	$: faqsEventsOffset = -(blogsPct + newsPct);

	$: monthlyCounts = (() => {
		const counts = [0, 0, 0, 0, 0, 0];
		const months = ['', '', '', '', '', ''];
		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			months[5 - i] = d.toLocaleString('en-US', { month: 'short' });
		}
		cmsList.forEach(item => {
			if (!item.created_at && !item.date) return;
			const itemDate = new Date(item.created_at || item.date);
			const monthDiff = (now.getFullYear() - itemDate.getFullYear()) * 12 + now.getMonth() - itemDate.getMonth();
			if (monthDiff >= 0 && monthDiff < 6) {
				counts[5 - monthDiff]++;
			}
		});
		return { counts, months };
	})();

	$: maxCount = Math.max(...monthlyCounts.counts, 5);
	$: points = monthlyCounts.counts.map((val, i) => {
		const x = (i / 5) * 500;
		const y = 140 - (val / maxCount) * 110;
		return { x, y };
	});
	
	$: curvePath = `M${points[0].x},${points[0].y} ` +
		`C${points[0].x + 30},${points[0].y} ${points[1].x - 30},${points[1].y} ${points[1].x},${points[1].y} ` +
		`S${points[2].x - 30},${points[2].y} ${points[2].x},${points[2].y} ` +
		`S${points[3].x - 30},${points[3].y} ${points[3].x},${points[3].y} ` +
		`S${points[4].x - 30},${points[4].y} ${points[4].x},${points[4].y} ` +
		`S${points[5].x - 30},${points[5].y} ${points[5].x},${points[5].y}`;

	$: areaPath = `${curvePath} L500,160 L0,160 Z`;

	$: filteredList = selectedTab === 'All' 
		? cmsList 
		: cmsList.filter(item => {
			if (!item.type) return false;
			const t = item.type.toLowerCase();
			if (selectedTab === 'Blogs') return t.includes('blog');
			if (selectedTab === 'News') return t.includes('news') || t.includes('campaign');
			if (selectedTab === 'Events') return t.includes('event') || t.includes('webinar');
			if (selectedTab === 'FAQs') return t.includes('faq');
			return t === selectedTab.toLowerCase();
		});

	function getBadgeClass(cat: string) {
		if (cat === 'Cancer Care' || cat === 'Webinars') return 'bg-purple-pill';
		if (cat === 'Announcement' || cat === 'Patient Assistance') return 'bg-blue-pill';
		return 'bg-green-pill';
	}

	function getStatusClass(st: string) {
		if (st === 'Published' || st === 'Active' || st === 'Scheduled') return 'status-approved';
		if (st === 'In Review') return 'status-review';
		return 'status-pending';
	}
</script>

<svelte:head>
	<title>Admin Dashboard | Jarurat Care Foundation</title>
</svelte:head>

<div class="admin-dashboard-container">
	<!-- Welcome Bar -->
	<div class="welcome-bar">
		<div>
			<h1 class="welcome-title">Welcome back, {userName} 👋</h1>
			<p class="welcome-sub">Manage website content, blogs, FAQs and upcoming webinars from one central portal.</p>
		</div>
		<button class="date-range-btn">
			<CalendarIcon size={16} class="text-slate-500" />
			<span>01 Jan - 31 Dec, 2026</span>
		</button>
	</div>

	<!-- Top Stats Grid -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-top">
				<div class="icon-wrap blue-bg"><FileText size={20} class="text-blue" /></div>
				<span class="trend badge-green"><TrendingUp size={12} /> +18%</span>
			</div>
			<div class="stat-num">24</div>
			<div class="stat-label">Total Blogs Published</div>
		</div>

		<div class="stat-card">
			<div class="stat-top">
				<div class="icon-wrap purple-bg"><Newspaper size={20} class="text-purple" /></div>
				<span class="trend badge-purple">+5 this week</span>
			</div>
			<div class="stat-num">16</div>
			<div class="stat-label">News & Announcements</div>
		</div>

		<div class="stat-card">
			<div class="stat-top">
				<div class="icon-wrap yellow-bg"><HelpCircle size={20} class="text-yellow" /></div>
				<span class="trend badge-green">99% Helpful</span>
			</div>
			<div class="stat-num">32</div>
			<div class="stat-label">Active FAQ Entries</div>
		</div>

		<div class="stat-card">
			<div class="stat-top">
				<div class="icon-wrap green-bg"><CalendarIcon size={20} class="text-green" /></div>
				<span class="trend badge-orange">3 Upcoming</span>
			</div>
			<div class="stat-num">12</div>
			<div class="stat-label">Events & Webinars</div>
		</div>
	</div>

	<!-- Middle Row: Analytics & Content Distribution -->
	<div class="charts-row">
		<!-- Content Publishing Chart Card -->
		<div class="card flex-2">
			<div class="card-header">
				<div>
					<h2 class="card-title">Content Publishing Overview</h2>
					<p class="card-sub">Monthly publications across Blogs and News</p>
				</div>
				<span class="pill-badge bg-blue-pill">2026 Analytics</span>
			</div>
			<div class="chart-box">
				<svg class="w-full h-full" viewBox="0 0 500 180" fill="none">
					<!-- Grid lines -->
					<line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" stroke-width="1" />
					<line x1="0" y1="95" x2="500" y2="95" stroke="#F1F5F9" stroke-width="1" />
					<line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" stroke-width="1" />
					
					<!-- Area Gradient -->
					<linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="#2563EB" stop-opacity="0.2" />
						<stop offset="100%" stop-color="#2563EB" stop-opacity="0.0" />
					</linearGradient>
					<path d={areaPath} fill="url(#blueGradient)" />

					<!-- Smooth Line -->
					<path d={curvePath} stroke="#2563EB" stroke-width="3" stroke-linecap="round" fill="none" />

					<!-- Points -->
					{#each points as pt}
						<circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
					{/each}
				</svg>
				<div class="chart-x-axis">
					{#each monthlyCounts.months as m}
						<span>{m}</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Content Breakdown Card -->
		<div class="card flex-1">
			<div class="card-header">
				<h2 class="card-title">Content Breakdown</h2>
			</div>
			<div class="donut-wrap">
				<svg class="donut-chart" viewBox="0 0 36 36">
					<path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					<!-- Blogs -->
					{#if blogsPct > 0}
						<path class="circle-blue" stroke-dasharray="{blogsPct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					{/if}
					<!-- News -->
					{#if newsPct > 0}
						<path class="circle-purple" stroke-dasharray="{newsPct}, 100" stroke-dashoffset={newsOffset} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					{/if}
					<!-- FAQs & Events -->
					{#if faqsEventsPct > 0}
						<path class="circle-green" stroke-dasharray="{faqsEventsPct}, 100" stroke-dashoffset={faqsEventsOffset} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
					{/if}
					<text x="18" y="19" class="donut-text">{totalItems}</text>
					<text x="18" y="24" class="donut-sub">Total Items</text>
				</svg>
			</div>
			<div class="category-legend">
				<div class="legend-item"><span class="dot bg-blue"></span><span>Blogs</span><strong>{blogsPct}%</strong></div>
				<div class="legend-item"><span class="dot bg-purple"></span><span>News & PR</span><strong>{newsPct}%</strong></div>
				<div class="legend-item"><span class="dot bg-green"></span><span>FAQs & Events</span><strong>{faqsEventsPct}%</strong></div>
			</div>
		</div>
	</div>

	<!-- Bottom Row: Recent Content & Quick Management -->
	<div class="bottom-row">
		<!-- Recent Activity & Articles Table -->
		<div class="card flex-2">
			<div class="card-header">
				<h2 class="card-title">Recent Activity & Content</h2>
				<div class="underline-tabs">
					{#each tabs as t}
						<button class="tab-btn" class:active={selectedTab === t} on:click={() => selectedTab = t}>{t}</button>
					{/each}
				</div>
			</div>

			<div class="ui-table-wrap">
				<table class="recent-table">
					<thead>
						<tr>
							<th>Title & Topic</th>
							<th>Category</th>
							<th>Author</th>
							<th>Status</th>
							<th class="text-right">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredList as item}
							<tr>
								<td>
									<div class="art-meta">
										<strong>{item.title || item.question || item.name || 'Content Entry'}</strong>
										<span>{item.date || 'Recent'} • {item.type || 'Article'}</span>
									</div>
								</td>
								<td>
									<span class="pill-badge {getBadgeClass(item.category)}">{item.category || 'General'}</span>
								</td>
								<td class="author-name">{item.author || 'Admin Team'}</td>
								<td>
									<span class="status-pill {getStatusClass(item.status)}">{item.status || 'Published'}</span>
								</td>
								<td class="text-right">
									<a href="/cms/admin-dashboard/{item.type?.toLowerCase() || 'blogs'}" class="btn-action">
										<Edit3 size={15} />
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="table-footer-center">
				<a href="/cms/admin-dashboard/blogs" class="view-all-link">View all content library <ArrowRight size={16} /></a>
			</div>
		</div>

		<!-- Quick Management Actions -->
		<div class="card flex-1">
			<div class="card-header">
				<h2 class="card-title">Quick Actions</h2>
			</div>
			<div class="quick-actions-list">
				<a href="/cms/admin-dashboard/blogs" class="quick-action-item">
					<div class="qa-icon blue-bg"><FileText size={18} class="text-blue" /></div>
					<div class="qa-text">
						<strong>Write New Blog</strong>
						<span>Draft or publish medical articles</span>
					</div>
					<ArrowRight size={16} class="ml-auto text-slate-400" />
				</a>

				<a href="/cms/admin-dashboard/news" class="quick-action-item">
					<div class="qa-icon purple-bg"><Newspaper size={18} class="text-purple" /></div>
					<div class="qa-text">
						<strong>Publish News</strong>
						<span>Announce updates & press releases</span>
					</div>
					<ArrowRight size={16} class="ml-auto text-slate-400" />
				</a>

				<a href="/cms/admin-dashboard/faqs" class="quick-action-item">
					<div class="qa-icon yellow-bg"><HelpCircle size={18} class="text-yellow" /></div>
					<div class="qa-text">
						<strong>Add FAQ Entry</strong>
						<span>Update helpful patient assistance</span>
					</div>
					<ArrowRight size={16} class="ml-auto text-slate-400" />
				</a>

				<a href="/cms/admin-dashboard/events" class="quick-action-item">
					<div class="qa-icon green-bg"><CalendarIcon size={18} class="text-green" /></div>
					<div class="qa-text">
						<strong>Schedule Event</strong>
						<span>Manage upcoming medical webinars</span>
					</div>
					<ArrowRight size={16} class="ml-auto text-slate-400" />
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family: 'DM Sans', sans-serif;
	}

	.admin-dashboard-container {
		display: flex;
		flex-direction: column;
		gap: 28px;
		max-width: 1500px;
		margin: 0 auto;
	}

	/* Welcome Bar */
	.welcome-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
	}

	.welcome-title {
		font-size: 24px;
		font-weight: 700;
		color: #0F172A;
		margin: 0 0 6px 0;
	}

	.welcome-sub {
		font-size: 14px;
		color: #64748B;
		margin: 0;
	}

	.date-range-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 8px;
		padding: 8px 14px;
		font-size: 13px;
		font-weight: 600;
		color: #334155;
		cursor: pointer;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.date-range-btn:hover {
		background: #F8FAFC;
		border-color: #CBD5E1;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 20px;
	}

	.stat-card {
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.stat-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.icon-wrap {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.blue-bg { background: #EFF6FF; }
	.purple-bg { background: #FAF5FF; }
	.yellow-bg { background: #FEF9C3; }
	.green-bg { background: #F0FDF4; }

	.text-blue { color: #2563EB; }
	.text-purple { color: #9333EA; }
	.text-yellow { color: #CA8A04; }
	.text-green { color: #16A34A; }

	.trend {
		font-size: 11px;
		font-weight: 600;
		padding: 3px 8px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.badge-green { background: #DCFCE7; color: #15803D; }
	.badge-purple { background: #F3E8FF; color: #7E22CE; }
	.badge-orange { background: #FFEDD5; color: #C2410C; }

	.stat-num {
		font-size: 28px;
		font-weight: 800;
		color: #0F172A;
		margin-bottom: 4px;
	}

	.stat-label {
		font-size: 13px;
		color: #64748B;
		font-weight: 500;
	}

	/* Rows & Cards */
	.charts-row, .bottom-row {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
	}

	.flex-2 { flex: 2; min-width: 320px; }
	.flex-1 { flex: 1; min-width: 280px; }

	.card {
		background: #FFFFFF;
		border: 1px solid #E2E8F0;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.card-header {
		padding: 20px;
		border-bottom: 1px solid #F1F5F9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
	}

	.card-title {
		font-size: 17px;
		font-weight: 700;
		color: #0F172A;
		margin: 0;
	}

	.card-sub {
		font-size: 12px;
		color: #64748B;
		margin: 4px 0 0 0;
	}

	/* Charts */
	.chart-box {
		padding: 24px 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		flex: 1;
	}

	.chart-x-axis {
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
		font-size: 12px;
		color: #64748B;
		font-weight: 500;
	}

	.donut-wrap {
		padding: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.donut-chart { width: 140px; height: 140px; }
	.circle-bg { fill: none; stroke: #F1F5F9; stroke-width: 4; }
	.circle-blue { fill: none; stroke: #2563EB; stroke-width: 4; stroke-linecap: round; }
	.circle-purple { fill: none; stroke: #9333EA; stroke-width: 4; stroke-linecap: round; }
	.circle-green { fill: none; stroke: #10B981; stroke-width: 4; stroke-linecap: round; }
	.donut-text { font-size: 8px; font-weight: 800; fill: #0F172A; text-anchor: middle; }
	.donut-sub { font-size: 4px; font-weight: 500; fill: #64748B; text-anchor: middle; }

	.category-legend {
		padding: 0 20px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		color: #475569;
	}

	.legend-item strong { margin-left: auto; color: #0F172A; font-weight: 700; }
	.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
	.bg-blue { background: #2563EB; }
	.bg-purple { background: #9333EA; }
	.bg-green { background: #10B981; }

	/* Tabs */
	.underline-tabs {
		display: flex;
		gap: 6px;
		border-bottom: 1px solid transparent;
	}

	.tab-btn {
		background: none;
		border: none;
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 500;
		color: #64748B;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.15s;
	}

	.tab-btn:hover { color: #0F172A; background: #F8FAFC; }
	.tab-btn.active { color: #2563EB; font-weight: 700; background: #EFF6FF; }

	/* Table & Badges */
	.ui-table-wrap { overflow-x: auto; flex: 1; }
	.recent-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
	.recent-table th { padding: 12px 16px; color: #64748B; font-weight: 600; font-size: 12px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
	.recent-table td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; white-space: nowrap; }

	.art-meta { display: flex; flex-direction: column; max-width: 280px; }
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

	.btn-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		background: #F8FAFC;
		border: 1px solid #E2E8F0;
		color: #64748B;
		transition: all 0.15s;
		text-decoration: none;
	}

	.btn-action:hover {
		background: #EFF6FF;
		border-color: #DBEAFE;
		color: #2563EB;
	}

	.table-footer-center { padding: 16px; text-align: center; border-top: 1px solid #F1F5F9; }
	.view-all-link { color: #2563EB; font-weight: 600; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
	.view-all-link:hover { text-decoration: underline; }

	/* Quick Actions right box */
	.quick-actions-list {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.quick-action-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 14px;
		background: #FFFFFF;
		border: 1px solid #F1F5F9;
		border-radius: 10px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.quick-action-item:hover {
		background: #F8FAFC;
		border-color: #E2E8F0;
		transform: translateX(3px);
	}

	.qa-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.qa-text {
		display: flex;
		flex-direction: column;
		line-height: 1.3;
	}

	.qa-text strong { font-size: 14px; font-weight: 700; color: #0F172A; }
	.qa-text span { font-size: 12px; color: #64748B; }

	.ml-auto { margin-left: auto; }
	.text-right { text-align: right; }
</style>