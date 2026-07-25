<script lang="ts">
	import { cmsSupabase } from '$lib/cmsSupabase';
	import { goto } from '$app/navigation';

	export let isReviewer: boolean = false;

	async function handleLogout() {
		await cmsSupabase.auth.signOut();
		goto('/cms/login');
	}

	const navItems = [
	{ label: 'Dashboard', href: '/cms/doctor-dashboard' },

	{ label: 'My Profile', href: '/cms/complete-profile' },

	// COMMUNITY
	{ label: 'Community - Doctors', href: '/cms/community/doctors' },

	// CONTENT
	{ label: 'Create Article', href: '/cms/articles/create' },
	{ label: 'Create Research Paper', href: '/cms/research/create' },

	{ label: 'My Articles', href: '/cms/doctor-dashboard/articles' },
	{ label: 'My Research Papers', href: '/cms/doctor-dashboard/my-research-papers' },

	{ label: 'Drafts', href: '/cms/doctor-dashboard/drafts' },

	{ label: 'Saved Articles', href: '/cms/doctor-dashboard/saved' },

	{ label: 'Notifications', href: '/cms/doctor-dashboard/notifications' },

	{ label: 'Settings', href: '/cms/doctor-dashboard/settings' }
];
</script>

<aside class="sidebar">
	<div class="logo">JCF</div>
	<h3>Doctor Panel</h3>

	<nav>
		{#each navItems as item}
			<a href={item.href}>{item.label}</a>
		{/each}

		{#if isReviewer}
			<a href="/cms/doctor-dashboard/review">Review Articles</a>
		{/if}
	</nav>

	<button class="logout-btn" on:click={handleLogout}>Logout</button>
</aside>

<style>
	.sidebar {
		width: 250px;
		background: #202866;
		color: white;
		padding: 25px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.logo {
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 4px;
	}

	h3 {
		margin: 0 0 12px;
		font-weight: 500;
		opacity: 0.8;
		font-size: 14px;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	nav a {
		color: white;
		text-decoration: none;
		padding: 12px;
		border-radius: 8px;
		font-size: 15px;
		transition: background 0.2s;
	}

	nav a:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.logout-btn {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		text-align: left;
		padding: 12px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 15px;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>