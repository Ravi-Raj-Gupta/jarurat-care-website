<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Search, Bell, Mail, ChevronDown, Menu as MenuIcon } from 'lucide-svelte';

	let showDropdown = false;
	let dropdownRef: HTMLElement;

	$: user = $page.data.currentUser || {
		name: 'Admin User',
		email: 'admin@jarurat.care',
		role: 'Admin',
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
	};

	function closeDropdown(e: MouseEvent) {
		if (showDropdown && dropdownRef && !dropdownRef.contains(e.target as Node)) {
			showDropdown = false;
		}
	}

	let query = '';
	
	// Keep input synced with URL if it changes externally
	$: {
		const currentQ = $page.url.searchParams.get('q');
		if (currentQ !== null && query === '') {
			query = currentQ;
		}
	}

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (query.trim()) {
				goto(`?q=${encodeURIComponent(query.trim())}`);
			} else {
				// Clear search from URL
				const url = new URL($page.url);
				url.searchParams.delete('q');
				goto(url.pathname + url.search);
			}
		}
	}
</script>

<svelte:window on:click={closeDropdown} />

<header class="new-topbar">
	<div class="topbar-left">
		<button class="menu-toggle"><MenuIcon size={20} /></button>
		<div class="search-box">
			<Search size={16} class="text-slate-400" />
			<input 
				type="text" 
				placeholder="Search here..." 
				bind:value={query}
				on:keydown={handleSearch}
			/>
		</div>
	</div>
	<div class="topbar-right">
		<button class="icon-notification" aria-label="Notifications">
			<Bell size={20} />
			<span class="dot-badge">5</span>
		</button>
		<button class="icon-notification" aria-label="Messages">
			<Mail size={20} />
			<span class="dot-badge red-dot">2</span>
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

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family: 'DM Sans', sans-serif;
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
		z-index: 20;
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
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid #E2E8F0;
		background: #FFFFFF;
		color: #475569;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-notification:hover {
		background: #F8FAFC;
		color: #0F172A;
	}

	.dot-badge {
		position: absolute;
		top: -2px;
		right: -2px;
		background: #2563EB;
		color: #FFFFFF;
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

	.text-slate-500 { color: #64748B; }
	.text-slate-400 { color: #94A3B8; }
</style>