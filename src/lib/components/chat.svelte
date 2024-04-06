<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import ChatPanel from './chat-panel.svelte';

	export let chatId: string | undefined = undefined;
</script>

<div class="md:p-2 h-screen">
	<div
		class="mx-auto max-w-[80rem] grid grid-cols-1 md:grid-cols-one_three items-stretch overflow-hidden h-full md:rounded-md md:border-t md:border-gray-200 shadow-lg drop-shadow-md relative"
	>
		<Sidebar {chatId} />

		<div class="bg-red-500 flex flex-col">
			{#if chatId}
				<ChatPanel {chatId} />
			{:else}
				Please select a chat to start talking
			{/if}
		</div>
	</div>
</div>
