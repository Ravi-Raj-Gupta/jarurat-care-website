<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import BotMessage from './messages/bot-message.svelte';
	import UserMessage from './messages/user-message.svelte';
	import ChevronLeft from '$lib/components/svg/chevron-left.svelte';
	import type { ChatChannelType } from '$lib/data/chat-channels';

	export let chatChannel: ChatChannelType;

	let form: HTMLFormElement;
	let chatContainerEl: HTMLElement;

	type ChatItem = {
		role: 'user' | 'assistant';
		content: string;
	};

	function saveMessageToHistory(role: string, content: string) {
		const history = window.localStorage.getItem('chatHistory') || '[]';
		const parsedHistory = JSON.parse(history);

		parsedHistory.push({ role, content });
		window.localStorage.setItem('chatHistory', JSON.stringify(parsedHistory));
	}

	function getChatHistory(): ChatItem[] {
		const history = window.localStorage.getItem('chatHistory') || '[]';
		const parsedHistory = JSON.parse(history);

		return parsedHistory;
	}

	function loadChatHistory() {
		const chatHistory = getChatHistory();
		const chatWindow = document.querySelector('.chat-window');

		messageHistory.set(chatHistory);
	}

	let botResponse = '';
	let messageHistory = writable<ChatItem[]>([]);

	async function getResponse(query: string, diseaseType = '') {
		const baseURL = `https://chat-backend-e7nr.onrender.com`;
		// const baseURL = `http://localhost:3000`;
		const response = await fetch(`${baseURL}/chatbot/ask`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, diseaseType, userId: 'getUserId()', messageHistory })
		});

		if (!response.body) return undefined;

		const reader = response.body.getReader();

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				saveMessageToHistory('assistant', botResponse);

				const tmp: ChatItem[] = [...$messageHistory, { role: 'assistant', content: botResponse }];
				messageHistory.set(tmp);
				botResponse = '';

				break;
			}

			const text = new TextDecoder('utf-8').decode(value);
			botResponse += text;
			chatContainerEl?.scrollTo({ behavior: 'smooth', top: chatContainerEl.scrollHeight });
		}

		let data = '';
		return data;
	}

	messageHistory.subscribe((value) => {
		setTimeout(() => {
			chatContainerEl?.scrollTo({ behavior: 'smooth', top: chatContainerEl.scrollHeight });
		}, 100);
	});

	onMount(() => {
		loadChatHistory();

		form.addEventListener('submit', (ev) => {
			ev.preventDefault();

			const fd = new FormData(ev.currentTarget as HTMLFormElement);
			const message = fd.get('message')?.toString() || '';

			if (!message) return undefined;

			const tmp: ChatItem[] = [...$messageHistory, { role: 'user', content: message }];
			saveMessageToHistory('user', message);
			messageHistory.set(tmp);

			form.reset();

			getResponse(message, '');
		});
	});
</script>

<div class="bg-white grow flex flex-col relative w-full h-full overflow-auto">
	<header>
		<a
			href="/hope"
			class="p-4 flex flex-row items-center gap-4 border-b border-gray-100 hover:bg-gray-100 transition-colors duration-400"
		>
			<div class={`size-[1rem] ${!chatChannel && 'hidden'}`}>
				<ChevronLeft width="w-[1rem]" />
			</div>
			<div class="flex flex-col">
				<strong>{chatChannel.name}</strong>
				<small class="text-zinc-600">{chatChannel.description || ''}</small>
			</div>
		</a>
	</header>

	<div class="grow" />

	<div class="flex flex-col p-2 md:p-4 gap-4 overflow-auto" bind:this={chatContainerEl}>
		<p class="px-3 py-2 bg-yellow-100 self-center rounded-md text-center leading-[1.4]">
			This is a chatbot. It might not always give you the correct suggestions. Please consult a
			doctor for any medical advice.
		</p>

		<BotMessage content="Hi I am hope, your caregiver, please select what you want" />

		{#each $messageHistory as message}
			{#if message.role === 'user'}
				<UserMessage content={message.content} />
			{:else}
				<BotMessage content={message.content} />
			{/if}
		{/each}

		{#if botResponse}
			<BotMessage content={botResponse} />
		{/if}
	</div>

	<form class="flex border-t pl-2" bind:this={form}>
		<input
			type="text"
			name="message"
			class="w-full p-3 focus:outline-none"
			placeholder="type your message"
			autocomplete="off"
		/>
		<button
			type="submit"
			class="p-2 md:min-w-[4rem] flex items-center justify-center rotate-180 border hover:bg-gray-200 transition-all"
		>
			<ChevronLeft fill="#000" width="1rem" />
			<span class="sr-only">Send</span>
		</button>
	</form>
</div>
