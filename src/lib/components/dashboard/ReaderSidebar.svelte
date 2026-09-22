<script lang="ts">
	import { page } from '$app/stores';
	import {
		Home,
		User,
		Bookmark,
		Settings,
		LogOut,
		Users,
		Globe,
		ExternalLink
	} from 'lucide-svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import { goto } from '$app/navigation';

	$: currentPath = $page.url.pathname;

	async function logout() {
		await cmsSupabase.auth.signOut();
		goto('/cms/login');
	}
</script>

<aside class="sidebar">
	<!-- ==================== LOGO ==================== -->
	<div class="sidebar-logo">
		<div class="logo-icon-wrap">
			<img
				src="/logo.png"
				alt="JCF Logo"
				class="logo-img"
				on:error={(e) => e.currentTarget.src='https://cdn-icons-png.flaticon.com/512/3062/3062634.png'}
			/>
		</div>

		<div class="logo-text">
			<span class="main-title">Jarurat Care</span>
			<span class="sub-title">Reader Portal</span>
		</div>
	</div>

	<!-- ==================== NAVIGATION ==================== -->
	<div class="sidebar-scroll">
		<!-- DASHBOARD -->
		<a
			href="/cms/reader-dashboard"
			class="nav-item"
			class:active={currentPath === '/cms/reader-dashboard'}
		>
			<Home size={18} />
			<span>Dashboard</span>
		</a>

		<!-- ==================== CONTENT ==================== -->
		<div class="nav-section">
			<span class="nav-section-title">CONTENT</span>

			<a
				href="/cms/reader-dashboard#saved"
				class="nav-item"
			>
				<Bookmark size={18} />
				<span>Saved Articles</span>
			</a>

			<a
				href="/cms/reader-dashboard#doctors"
				class="nav-item"
			>
				<Users size={18} />
				<span>Followed Doctors</span>
			</a>
		</div>

		<!-- ==================== USER ==================== -->
		<div class="nav-section">
			<span class="nav-section-title">USER</span>

			<a
				href="/cms/complete-profile"
				class="nav-item"
				class:active={currentPath === '/cms/complete-profile'}
			>
				<User size={18} />
				<span>Edit Profile</span>
			</a>
		</div>
	</div>

	<!-- ==================== SIDEBAR BOTTOM ==================== -->
	<div class="sidebar-bottom">
		<a href="/" target="_blank" class="nav-item bottom-link">
			<Globe size={18} />
			<span>View Website</span>
			<ExternalLink size={16} class="ml-auto opacity-60" />
		</a>

		<a href="#" on:click|preventDefault={logout} class="nav-item logout-btn">
			<LogOut size={18} />
			<span>Logout</span>
		</a>
	</div>
</aside>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family:
			'DM Sans',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
	}

	/* =========================
	   SIDEBAR
	========================= */

	.sidebar {
		width: 265px;
		background: #0f172a;
		color: #94a3b8;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		border-right: 1px solid #1e293b;
		height: 100vh;
		position: sticky;
		top: 0;
	}

	/* =========================
	   LOGO
	========================= */

	.sidebar-logo {
		padding: 18px 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.logo-icon-wrap {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.logo-img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.main-title {
		font-size: 20px;
		font-weight: 800;
		color: #ffffff;
		letter-spacing: -0.02em;
	}

	.sub-title {
		font-size: 11px;
		color: #94a3b8;
	}

	/* =========================
	   SCROLL AREA
	========================= */

	.sidebar-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 24px 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.sidebar-scroll::-webkit-scrollbar {
		width: 4px;
	}
	.sidebar-scroll::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 4px;
	}

	/* =========================
	   SECTIONS
	========================= */

	.nav-section {
		margin-top: 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.nav-section-title {
		font-size: 11px;
		font-weight: 700;
		color: #64748b;
		margin: 8px 0 4px 14px;
		letter-spacing: 0.05em;
	}

	/* =========================
	   NAV ITEMS
	========================= */

	.nav-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border: none;
		background: transparent;
		color: #cbd5e1;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		border-radius: 10px;
		text-decoration: none;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #ffffff;
	}

	.nav-item.active {
		background: #2563eb;
		color: #ffffff;
		font-weight: 600;
	}

	/* =========================
	   BOTTOM ACTIONS
	========================= */

	.sidebar-bottom {
		padding: 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.bottom-link {
		color: #94a3b8;
	}

	.bottom-link:hover {
		color: #ffffff;
	}

	.logout-btn {
		color: #f87171;
	}

	.logout-btn:hover {
		background: rgba(248, 113, 113, 0.1);
		color: #ef4444;
	}

	.ml-auto {
		margin-left: auto;
	}
	.opacity-60 {
		opacity: 0.6;
	}
</style>
