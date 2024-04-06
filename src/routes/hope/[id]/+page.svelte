<script lang="ts">
	import Chat from '$lib/components/chat.svelte';

	export let data: { chatId: string };
</script>

<Chat chatId={data.chatId} />
