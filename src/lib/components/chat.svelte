<script lang="ts">
	import ChatPanel from './chat-panel.svelte';
	import ChatChannels from '$lib/components/chat-channels.svelte';

	export let chatId: string | undefined = undefined;
</script>

<div class="md:p-2 grow bg-[#f1f8fa]">
	<div
		class="mx-auto max-w-[80rem] grid grid-cols-1 md:grid-cols-one_three items-stretch overflow-hidden h-full md:rounded-md md:border-t md:border-[#f1f8fa] shadow-lg drop-shadow-md relative"
	>
		<ChatChannels {chatId} />

		<div class="bg-red-500 flex flex-col">
			{#if chatId}
				<ChatPanel {chatId} />
			{:else}
				Please select a chat to start talking
			{/if}
		</div>
	</div>
</div>
