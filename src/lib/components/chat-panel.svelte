<script lang="ts">
	import { marked } from 'marked';
	import Choice from './messages/choice.svelte';
	import * as cancerData from '$lib/data/cancers/index';
	import type { ChatGraph } from '$lib/data/cancers/graph';
	import BotMessage from './messages/bot-message.svelte';
	import ChoicesGroup from './messages/choices-group.svelte';
	import UserMessage from './messages/user-message.svelte';
	import ChevronLeft from '$lib/components/svg/chevron-left.svelte';
	import type { ChatChannelType } from '$lib/data/chat-channels';

	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	let language: Writable<'hn' | 'en'> = writable('hn');
	export let hopeEnabled = false;
	export let chatChannel: ChatChannelType;

	const translations = {
		'Main Menu': {
			en: 'Main Menu',
			hn: 'मुख्य मेनू'
		},
		'Unable to find Questions?': {
			en: 'Unable to find Questions?',
			hn: 'प्रश्न नहीं मिल सके?'
		},
		'Hi I am Hope, your caregiver. Please select what you want.': {
			en: 'Hi I am Hope, your caregiver, please select what you want.',
			hn: "नमस्ते, मैं 'होप' हूँ, आपका देखभालक. कृपया चुनें जो आप चाहते हैं।"
		}
	};

	type Message = {
		role: 'assistant' | 'user';
		content: string;
	};

	let cancerGraph: ChatGraph | undefined =
		// @ts-ignore
		cancerData && cancerData[chatChannel.id] && cancerData[chatChannel.id][$language];

	let currentNode: ChatGraph = cancerGraph as ChatGraph;
	let messageHistory = writable<Message[]>([]);

	language.subscribe((value) => {
		if (cancerData) {
			// @ts-ignore
			cancerGraph = (cancerData[chatChannel.id] && cancerData[chatChannel.id][value]) || undefined;
			currentNode = cancerGraph as ChatGraph;
		}
	});

	function navigateToNode(node: ChatGraph, userMsgContent: string) {
		const tmp: Message[] = [
			...$messageHistory,
			{ role: 'assistant', content: currentNode?.content },
			{ role: 'user', content: userMsgContent }
		];

		messageHistory.set(tmp);
		currentNode = node;
	}

	let form: HTMLFormElement;
	let chatContainerEl: HTMLElement;

	function saveMessageToHistory(role: string, content: string) {
		const history = window.localStorage.getItem('chatHistory') || '[]';
		const parsedHistory = JSON.parse(history);

		parsedHistory.push({ role, content });
		window.localStorage.setItem('chatHistory', JSON.stringify(parsedHistory));
	}

	function getChatHistory(): Message[] {
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

	async function getResponse(query: string, diseaseType = 'gallbladderCancer') {
		const baseURL = `https://chat-backend-e7nr.onrender.com`;
		// const baseURL = `http://localhost:3000`;
		const response = await fetch(`${baseURL}/chatbot/ask`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query,
				diseaseType,
				userId: 'getUserId()',
				messageHistory: $messageHistory,
				language: $language
			})
		});

		if (!response.body) return undefined;

		const reader = response.body.getReader();

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				// saveMessageToHistory('assistant', botResponse);

				const tmp: Message[] = [...$messageHistory, { role: 'assistant', content: botResponse }];
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

	$: {
		onMount(() => {
			// loadChatHistory();

			form?.addEventListener('submit', (ev) => {
				ev.preventDefault();

				const fd = new FormData(ev.currentTarget as HTMLFormElement);
				const message = fd.get('message')?.toString() || '';

				if (!message) return undefined;

				const tmp: Message[] = [...$messageHistory, { role: 'user', content: message }];
				// saveMessageToHistory('user', message);
				messageHistory.set(tmp);

				form.reset();

				getResponse(message, '');
			});
		});
	}
</script>

<div class="bg-white grow flex flex-col relative h-full overflow-auto">
	<header class="flex items-center justify-between pr-4 border-b border-gray-100">
		<a
			href="/hope"
			class="p-4 flex flex-row items-center gap-4 grow hover:bg-gray-100 transition-colors duration-400"
		>
			<div class={`size-[1rem] ${!chatChannel && 'hidden'}`}>
				<ChevronLeft width="w-[1rem]" />
			</div>
			<div class="flex flex-col">
				<strong>{chatChannel.name}</strong>
				<small class="text-zinc-600">{chatChannel.description || ''}</small>
			</div>
		</a>

		<label class="flex flex-col border p-2 ml-4 rounded-md cursor-pointer">
			<small class="text-zinc-600">Language</small>
			<select
				value={$language}
				class="bg-transparent cursor-pointer"
				on:change={(ev) => {
					const value = ev.currentTarget.value;
					// @ts-ignore
					language.set(value);
				}}
			>
				<option value="en">English</option>
				<option value="hn">Hindi</option>
			</select>
		</label>
	</header>

	<div class="grow" />

	<div class="messages p-2 flex flex-col gap-3 overflow-auto" bind:this={chatContainerEl}>
		<p class="px-3 py-2 bg-yellow-100 self-center rounded-md text-center leading-[1.4]">
			This is a chatbot. It might not always give you the correct suggestions. Please consult a
			doctor for any medical advice.
		</p>

		<BotMessage
			content={translations['Hi I am Hope, your caregiver. Please select what you want.'][
				$language
			]}
		/>

		{#each $messageHistory as message}
			{#if message.role === 'assistant'}
				<BotMessage content={message.content} />
			{:else}
				<UserMessage content={message.content} />
			{/if}
		{/each}

		{#if currentNode?.content}
			<BotMessage content={currentNode.content} />
		{/if}

		<ChoicesGroup>
			{#each currentNode?.options || [] as option}
				<Choice
					onclick={() => {
						if (option.nextNode) navigateToNode(option.nextNode, option.content);
						// else alert('No next node');
					}}
				>
					{@html marked(option.content)}
				</Choice>
			{/each}

			{#if currentNode && currentNode.options.length === 0 && !hopeEnabled}
				<Choice
					onclick={() => {
						currentNode = { content: '', options: [] };
						messageHistory.set([]);

						hopeEnabled = true;
					}}>{translations['Unable to find Questions?'][$language]}</Choice
				>
			{/if}

			{#if cancerGraph}
				<Choice
					onclick={() => {
						if (cancerGraph) {
							hopeEnabled = false;
							currentNode = cancerGraph;
							messageHistory.set([]);
						} else window.location.reload();
					}}
					>{translations['Main Menu'][$language]}
				</Choice>
			{/if}
		</ChoicesGroup>

		{#if botResponse && botResponse.length > 0 && hopeEnabled}
			<BotMessage content={botResponse} />
		{/if}
	</div>

	<form bind:this={form}>
		{#if hopeEnabled}
			<div class="flex border-t pl-2">
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
			</div>
		{/if}
	</form>
</div>
