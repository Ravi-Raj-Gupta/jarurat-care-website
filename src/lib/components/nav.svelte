<script lang="ts">
	import Logo from '$lib/svg/logo.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { MenuIcon, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let isMenuOpen = false;
	let isLoggedIn = false;

	$: pathname = $page.url.pathname;

	const navItems = [
		{ title: 'Home', href: '/' },
		{ title: 'About Us', href: '/about-us' },
		{ title: 'Get Involved', href: '/get-involved' },
		{ title: 'Knowledge Hub', href: '/knowledge-hub' },
		{ title: 'Contact Us', href: '/contact-us' }
	];

	let handleLogout: (() => Promise<void>) | undefined = undefined;

	onMount(async () => {
		try {
			const { cmsSupabase } = await import('$lib/cmsSupabase');

			const { data: { user } } = await cmsSupabase.auth.getUser();
			if (user) isLoggedIn = true;

			cmsSupabase.auth.onAuthStateChange((_event, session) => {
				isLoggedIn = !!session?.user;
			});

			handleLogout = async () => {
				isLoggedIn = false;
				toast.success('Logged out successfully');
				goto('/knowledge-hub');
				await cmsSupabase.auth.signOut();
			};
		} catch (e) {
			console.warn('CMS Supabase client not initialized or unavailable:', e);
		}
	});

	async function logout() {
		if (handleLogout) {
			await handleLogout();
		}
	}
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-20 items-center justify-between px-4 md:px-8 mx-auto">
		<!-- Logo -->
		<a href="/" class="flex items-center space-x-2">
			<div class="h-10 w-auto flex items-center justify-center">
				<Logo />
			</div>
		</a>

		<!-- Desktop Navigation Links -->
		<nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
			{#each navItems as item}
				<a
					href={item.href}
					class={cn(
						'transition-colors hover:text-primary',
						pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
					)}
				>
					{item.title}
				</a>
			{/each}

			{#if isLoggedIn}
				<button
					on:click={logout}
					class="text-muted-foreground transition-colors hover:text-primary font-medium"
				>
					Logout
				</button>
			{/if}
		</nav>

		<!-- Mobile Menu Button -->
		<button
			class="md:hidden p-2 text-muted-foreground hover:text-foreground"
			on:click={() => (isMenuOpen = !isMenuOpen)}
			aria-label="Toggle Menu"
		>
			{#if isMenuOpen}
				<X class="h-6 w-6" />
			{:else}
				<MenuIcon class="h-6 w-6" />
			{/if}
		</button>
	</div>

	<!-- Mobile Navigation Drawer -->
	{#if isMenuOpen}
		<div class="md:hidden border-t px-4 pb-6 pt-4 bg-background">
			<nav class="flex flex-col space-y-4 text-base font-medium">
				{#each navItems as item}
					<a
						href={item.href}
						on:click={() => (isMenuOpen = false)}
						class={cn(
							'transition-colors hover:text-primary',
							pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
						)}
					>
						{item.title}
					</a>
				{/each}

				{#if isLoggedIn}
					<button
						on:click={() => {
							isMenuOpen = false;
							logout();
						}}
						class="text-left text-muted-foreground hover:text-primary font-medium"
					>
						Logout
					</button>
				{/if}
			</nav>
		</div>
	{/if}
</header>
