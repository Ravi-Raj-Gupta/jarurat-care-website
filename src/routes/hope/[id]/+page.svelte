<script lang="ts">
	import Chat from '$lib/components/chat.svelte';
	import Navigation from '$lib/components/navigation.svelte';

	export let data: { chatId: string };
</script>

<div class="flex flex-col h-screen">
	<Navigation />
	<Chat chatId={data.chatId} />
</div>
