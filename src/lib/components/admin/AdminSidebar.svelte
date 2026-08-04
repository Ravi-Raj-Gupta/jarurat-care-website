<script lang="ts">
	import { page } from '$app/stores';
	import { 
		Home, FileText, Newspaper, HelpCircle, Calendar as CalendarIcon, 
		Users, Settings, Globe, ExternalLink, ChevronsLeft 
	} from 'lucide-svelte';

	let collapsed = false;
</script>

<aside class="new-sidebar" class:collapsed>
	<div class="sidebar-logo">
		<div class="logo-icon-wrap">
			<img src="/logo.png" alt="JCF Logo" class="logo-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3062/3062634.png'" />
		</div>
		<div class="logo-text">
			<span class="main-title">Jarurat</span>
			<span class="sub-title">Care Admin</span>
		</div>
	</div>

	<div class="sidebar-scroll">
		<a href="/cms/admin-dashboard" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard'}>
			<Home size={18} />
			<span>Dashboard</span>
		</a>

		<!-- CONTENT -->
		<div class="nav-section">
			<span class="nav-section-title">CONTENT</span>
			<a href="/cms/admin-dashboard/blogs" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard/blogs'}>
				<FileText size={18} />
				<span>Blogs</span>
			</a>
			<a href="/cms/admin-dashboard/news" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard/news'}>
				<Newspaper size={18} />
				<span>News</span>
			</a>
			<a href="/cms/admin-dashboard/faqs" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard/faqs'}>
				<HelpCircle size={18} />
				<span>FAQs</span>
			</a>
		</div>

		<!-- EVENTS -->
		<div class="nav-section">
			<span class="nav-section-title">EVENTS</span>
			<a href="/cms/admin-dashboard/events" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard/events'}>
				<CalendarIcon size={18} />
				<div class="flex-col-label">
					<span>Events Management</span>
					<span class="sub-text">(Webinars)</span>
				</div>
				<span class="badge red-badge ml-auto">New</span>
			</a>
		</div>

		<!-- USERS -->
		<div class="nav-section">
			<span class="nav-section-title">USERS</span>
			<a href="/cms/admin-dashboard/users" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard/users'}>
				<Users size={18} />
				<span>User Management</span>
			</a>
		</div>

		<!-- SYSTEM -->
		<div class="nav-section">
			<span class="nav-section-title">SYSTEM</span>
			<a href="/cms/admin-dashboard/settings" class="nav-btn" class:active={$page.url.pathname === '/cms/admin-dashboard/settings'}>
				<Settings size={18} />
				<span>Settings</span>
			</a>
		</div>
	</div>

	<!-- Sidebar Bottom Actions -->
	<div class="sidebar-bottom">
		<a href="/" target="_blank" class="nav-btn bottom-link">
			<Globe size={18} />
			<span>View Website</span>
			<ExternalLink size={16} class="ml-auto opacity-60" />
		</a>
		<button class="nav-btn collapse-btn" on:click={() => collapsed = !collapsed}>
			<ChevronsLeft size={18} />
			<span>Collapse</span>
		</button>
	</div>
</aside>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family: 'DM Sans', sans-serif;
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
		transition: width 0.2s ease;
	}

	.sidebar-logo {
		padding: 18px 20px;
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
		font-size: 17px;
		font-weight: 700;
		color: #FFFFFF;
	}

	.sub-title {
		font-size: 11px;
		color: #94A3B8;
	}

	.sidebar-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 16px 12px;
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
		padding: 10px 14px;
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
		margin-top: 18px;
		display: flex;
		flex-direction: column;
	}

	.nav-section-title {
		font-size: 11px;
		font-weight: 700;
		color: #64748B;
		letter-spacing: 0.06em;
		padding: 4px 14px;
		margin-bottom: 4px;
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

	.red-badge { background: #DC2626; color: #FFFFFF; }
	.ml-auto { margin-left: auto; }

	.sidebar-bottom {
		padding: 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}
</style>