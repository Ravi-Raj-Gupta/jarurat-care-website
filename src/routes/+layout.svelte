<script>
	import Footer from '$lib/components/footer.svelte';
	import { page } from '$app/stores';
	import '../app.css';
	import '@fontsource/manrope'; // weight 400
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';
	import '@fontsource/manrope/800.css';
	import '@fontsource/playfair-display/600.css';
	import '@fontsource/rubik/500.css';
	import { Toaster } from 'svelte-french-toast';
	import { browser } from '$app/environment';
	import '@splidejs/svelte-splide/css/core';
</script>

<main class="font-manrope min-h-screen flex flex-col">
	{#if browser}
		<Toaster />
	{/if}
	<div class="flex-grow">
		<slot />
	</div>
	{#if !$page.url.pathname.startsWith('/cms')}
		<div class="mt-auto">
			<Footer />
		</div>
	{/if}
</main>
