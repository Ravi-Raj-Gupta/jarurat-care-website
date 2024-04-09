<script>
	import Chat from '$lib/components/chat.svelte';
	import Navigation from '$lib/components/navigation.svelte';
</script>

<div class="flex flex-col h-screen">
	<Navigation />
	<Chat />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
