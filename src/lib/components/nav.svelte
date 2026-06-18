<script>
	import Logo from '$lib/svg/logo.svelte';
	import { page } from '$app/stores';
	import { MenuIcon, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let isMenuOpen = false;
	let isLoggedIn = false;

	$: pathname = $page.url.pathname;

	const navItems = [
	{ title: 'Home', href: '/' },
	{ title: 'About Us', href: '/about-us' },
	{ title: 'Get Involved', href: '/get-involved' },

	// Research Articles
	{ title: 'Articles', href: '/articles' },

	// CMS Content
	{ title: 'Content', href: '/content' },

	{ title: 'Contact Us', href: '/contact-us' }
];
	onMount(async () => {
		const { cmsSupabase } = await import('$lib/cmsSupabase');

		const { data: { user } } = await cmsSupabase.auth.getUser();
		if (user) isLoggedIn = true;

		cmsSupabase.auth.onAuthStateChange((event, session) => {
			isLoggedIn = !!session?.user;
		});

		window.__cmsLogout = async () => {
			await cmsSupabase.auth.signOut();
			isLoggedIn = false;
			window.location.href = '/';
		};
	});

	function logout() {
		if (typeof window !== 'undefined' && window.__cmsLogout) {
			window.__cmsLogout();
		}
	}
</script>

<header class="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
	<nav class="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">

		<a href="/">
			<Logo class="h-8 md:h-10 w-auto" />
		</a>

		<ul class="hidden md:flex items-center gap-8 font-rubik text-[#0D2561] text-[0.95rem]">
			{#each navItems as item}
				<li>
					<a href={item.href} class={cn("transition-all duration-200 hover:text-[#1E4ED8]", pathname === item.href ? "font-semibold border-b-2 border-[#1E4ED8] pb-1" : "")}>{item.title}</a>
				</li>
			{/each}
		</ul>

		<div class="hidden md:flex items-center gap-3">
			{#if isLoggedIn}
				<a href="/cms/author_dashboard" class="border border-[#1E4ED8] text-[#1E4ED8] px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition">Dashboard</a>
				<button on:click={logout} class="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition border-0 cursor-pointer">Logout</button>
			{:else}
				<a href="/cms/login" class="border border-[#1E4ED8] text-[#1E4ED8] px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition">Login</a>
				<a href="/cms/signup" class="bg-[#1E4ED8] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">Register</a>
			{/if}
			<a href="/donate" class="bg-[#1E4ED8] text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition">Donate Now</a>
		</div>

		<button class="md:hidden p-2" on:click={() => (isMenuOpen = !isMenuOpen)}>
			{#if isMenuOpen}<X size={26} />{:else}<MenuIcon size={26} />{/if}
		</button>
	</nav>

	{#if isMenuOpen}
		<div class="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t">
			<div class="flex flex-col px-6 py-6 space-y-5 text-[#0D2561]">
				{#each navItems as item}
					<a href={item.href} class="text-base font-medium py-2 border-b" on:click={() => (isMenuOpen = false)}>{item.title}</a>
				{/each}

				{#if isLoggedIn}
					<a href="/cms/author_dashboard" class="w-full text-center border border-[#1E4ED8] text-[#1E4ED8] py-3 rounded-full font-medium" on:click={() => (isMenuOpen = false)}>Dashboard</a>
					<button on:click={logout} class="w-full bg-gray-100 text-gray-600 py-3 rounded-full font-medium border-0 cursor-pointer">Logout</button>
				{:else}
					<a href="/cms/login" class="w-full text-center border border-[#1E4ED8] text-[#1E4ED8] py-3 rounded-full font-medium block" on:click={() => (isMenuOpen = false)}>Login</a>
					<a href="/cms/signup" class="w-full text-center bg-[#1E4ED8] text-white py-3 rounded-full font-medium block" on:click={() => (isMenuOpen = false)}>Register</a>
				{/if}

				<a href="/donate" class="w-full text-center bg-[#1E4ED8] text-white py-3 rounded-full font-medium block mt-2">Donate Now</a>
			</div>
		</div>
	{/if}
</header>