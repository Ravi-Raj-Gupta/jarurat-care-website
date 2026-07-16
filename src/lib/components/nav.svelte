<script>
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
    
	{ title: 'Doctor Registration', href: '/doctor-form' },
	
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
			isLoggedIn = false;
			toast.success('Logged out successfully');
			goto('/knowledge-hub');
			cmsSupabase.auth.signOut();
		};
	});

	function logout() {
		if (typeof window !== 'undefined' && window.__cmsLogout) {
			window.__cmsLogout();
		}
	}
</script>

<header class="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
	<nav class="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 lg:px-6 py-3">

		<a href="/">
			<Logo class="h-8 md:h-10 w-auto" />
		</a>

		<ul class="hidden lg:flex items-center gap-8 font-rubik text-[#0D2561] text-[0.95rem]">
			{#each navItems as item}
				<li>
					<a href={item.href} class={cn("transition-all duration-200 hover:text-[#1E4ED8]", pathname === item.href ? "font-semibold border-b-2 border-[#1E4ED8] pb-1" : "")}>{item.title}</a>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-4">
            <div class="hidden md:flex lg:hidden">
			<a href="/donate" class="bg-[#1E4ED8] text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition">Donate Now</a>
		</div>

		<button class="lg:hidden p-2" on:click={() => (isMenuOpen = !isMenuOpen)}>
			{#if isMenuOpen}<X size={26} />{:else}<MenuIcon size={26} />{/if}
		</button>
	</nav>

	{#if isMenuOpen}
		<div class="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t">
			<div class="flex flex-col px-6 py-6 space-y-5 text-[#0D2561]">
				{#each navItems as item}
					<a href={item.href} class="text-base font-medium py-2 border-b" on:click={() => (isMenuOpen = false)}>{item.title}</a>
				{/each}

				<a href="/donate" class="w-full text-center bg-[#1E4ED8] text-white py-3 rounded-full font-medium block mt-2">Donate Now</a>
			</div>
		</div>
	{/if}
</header>