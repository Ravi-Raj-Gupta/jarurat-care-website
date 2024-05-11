<script lang="ts">
	import ChatPanel from './chat-panel.svelte';
	import { chatChannels, type ChatChannelType } from '$lib/data/chat-channels';
	import ChatChannels from '$lib/components/chat-channels.svelte';
	import ChatWithHopePanel from './chat-with-hope-panel.svelte';

	export let chatId: string | undefined = undefined;
	let chatChannel: ChatChannelType;

	$: {
		chatChannel = chatChannels[chatId as string];
	}
</script>

<div class="md:p-2 grow bg-[#f1f8fa] h-[100%] overflow-auto">
	<div
		class="mx-auto max-w-[80rem] grid grid-cols-1 md:grid-cols-one_three items-stretch overflow-hidden h-full md:rounded-md md:border-t md:border-[#f1f8fa] shadow-lg drop-shadow-md relative"
	>
		<ChatChannels {chatId} />

		<div class="flex flex-col justify-center items-center overflow-auto">
			{#if chatId}
				{#if chatId === 'talk-to-hope'}
					<ChatWithHopePanel {chatChannel} />
				{:else if chatId === 'gallstone'}
					<ChatPanel {chatChannel} hopeEnabled={true} />
				{:else}
					<ChatPanel {chatChannel} />
				{/if}
			{:else}
				<div
					class="text-[1.4em] text-zinc-400 h-full w-full bg-white flex items-center justify-center"
				>
					Please select a cancer type to start talking...
				</div>
			{/if}
		</div>
	</div>
</div>
