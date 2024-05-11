<script lang="ts">
	import { chatChannels } from '$lib/data/chat-channels';
	export let chatId: string | undefined = undefined;

	const chats = Object.values(chatChannels);
</script>

<aside
	class={`bg-white overflow-auto scroll-smooth fixed md:static w-full inset-0 transition-all ${chatId ? 'translate-x-full' : ''} md:translate-x-0 md:border-r md:border-gray-100`}
>
	<ul>
		{#each chats as chat}
			<li>
				<a
					href="/hope/{chat.id}"
					class={`p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-400 ${chat.id === chatId ? 'bg-gray-100' : ''}`}
					on:click={(ev) => chatId === chat.id && ev.preventDefault()}
				>
					<span>{chat.name}</span>
					<span
						class="text-sm text-gray-500 whitespace-nowrap overflow-hidden truncate"
						title="description about this `chat`"
					>
						{chat.description || ''}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</aside>
