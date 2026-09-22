<script lang="ts">
	import { page } from '$app/stores';
	import {
		Home,
		User,
		Bookmark,
		Settings,
		LogOut,
		Users
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
	<!-- LOGO -->
	<div class="sidebar-logo">
		<img
			src="/logo.png"
			alt="JCF Logo"
			class="logo-img"
			on:error={(e) => e.currentTarget.src='https://cdn-icons-png.flaticon.com/512/3062/3062634.png'}
		/>
	</div>

	<!-- NAVIGATION -->
	<div class="nav-container">
		
		<a
			href="/cms/reader-dashboard"
			class="nav-btn"
			class:active={currentPath === '/cms/reader-dashboard'}
		>
			<Home size={20} class="icon" />
			<span>Dashboard</span>
		</a>

		<div class="nav-section-title">CONTENT</div>

		<a
			href="/cms/reader-dashboard#saved"
			class="nav-btn"
		>
			<Bookmark size={20} class="icon" />
			<span>Saved Articles</span>
		</a>

		<a
			href="/cms/reader-dashboard#doctors"
			class="nav-btn"
		>
			<Users size={20} class="icon" />
			<span>Followed Doctors</span>
		</a>

		<div class="nav-section-title">USER/EVENTS</div>

		<a
			href="/cms/reader-dashboard/profile"
			class="nav-btn"
			class:active={currentPath.startsWith('/cms/reader-dashboard/profile')}
		>
			<User size={20} class="icon" />
			<span>Manage Profile</span>
		</a>

		<div class="nav-section-title">ACCOUNT</div>

		<div class="account-profile">
			<div class="avatar">
				<!-- Reader initial or default avatar -->
				R
			</div>
			<span>Reader</span>
		</div>
	</div>

	<!-- LOGOUT -->
	<div class="logout-container">
		<button on:click={logout} class="nav-btn">
			<LogOut size={20} class="icon" />
			<span>Sign out</span>
		</button>
	</div>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0;
		width: 213px;
		height: 100vh;
		background: #FAFAFA;
		position: fixed;
		left: 0;
		top: 0;
		font-family: 'Manrope', sans-serif;
	}

	.sidebar-logo {
		width: 100%;
		padding: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logo-img {
		height: 50px;
		object-fit: contain;
	}

	.nav-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 8px;
		gap: 8px;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px 2px 4px 8px rgba(0, 0, 0, 0.05);
		border-radius: 8px;
		flex-grow: 1;
		margin: 0 16px;
		width: calc(100% - 32px);
	}

	.nav-section-title {
		font-family: 'Manrope';
		font-weight: 600;
		font-size: 12px;
		line-height: 16px;
		letter-spacing: 0.5px;
		color: #1A1A1A;
		padding: 16px 10px 8px 10px;
		text-transform: uppercase;
	}

	.nav-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px;
		gap: 10px;
		width: 100%;
		min-height: 40px;
		background: #FFFFFF;
		border: none;
		border-left: 3px solid transparent;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s;
	}

	.nav-btn span {
		font-family: 'Manrope';
		font-weight: 600;
		font-size: 14px;
		color: #1A1A1A;
		white-space: nowrap;
	}

	.nav-btn .icon {
		color: #1E4ED8;
	}

	.nav-btn:hover {
		background: #f8fafc;
	}

	.nav-btn.active {
		background: #F3F6FD;
		border-left: 3px solid #1E4ED8;
	}

	.account-profile {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px;
		gap: 10px;
		width: 100%;
	}

	.avatar {
		width: 28px;
		height: 28px;
		background: linear-gradient(0deg, rgba(30, 78, 216, 0.05), rgba(30, 78, 216, 0.05));
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: #1E4ED8;
		font-size: 14px;
	}

	.account-profile span {
		font-family: 'Manrope';
		font-weight: 600;
		font-size: 16px;
		color: #1A1A1A;
	}

	.logout-container {
		padding: 16px;
		width: 100%;
		background: #FFFFFF;
		margin-top: auto;
		border-top: 1px solid #E5E7EB;
	}
</style>
