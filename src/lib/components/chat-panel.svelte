<script lang="ts">
	import type { ChatGraph } from '$lib/data/cancers/graph';
	import { boneCancerGraph } from '$lib/data/cancers/bone-cancer';
	import BotMessage from './messages/bot-message.svelte';
	import ChoicesGroup from './messages/choices-group.svelte';
	import Choice from './messages/choice.svelte';
	import UserMessage from './messages/user-message.svelte';
	import { nanoid } from 'nanoid';

	type Message = {
		role: 'bot' | 'user';
		content: string;
	};

	let currentNode: ChatGraph = boneCancerGraph;
	let messageHistory: Message[] = [];

	function navigateToNode(node: ChatGraph, userMsgContent: string) {
		messageHistory.push({ role: 'bot', content: currentNode.content });
		messageHistory.push({ role: 'user', content: userMsgContent });

		currentNode = node;
		messageHistory = [...messageHistory]; // make svelte re-render
	}

	export let chatId: string;
</script>

<div class="bg-white grow flex flex-col">
	<header class="flex flex-col p-4 border-b border-gray-200">
		<h2 class="font-bold text-zinc-800">{chatId}</h2>
		<small class="text-zinc-600">Ask me something about cancer</small>
	</header>

	<div class="grow" />

	<div class="messages p-2 flex flex-col gap-3 pb-4">
		<p class="px-3 py-2 bg-yellow-100 self-center rounded-md text-center leading-[1.4]">
			This is a chatbot. It might not always give you the correct suggestions. Please
			consult a doctor for any medical advice.
		</p>

		{#each messageHistory as message}
			{#if message.role === 'bot'}
				<BotMessage content={message.content} />
			{:else}
				<UserMessage content={message.content} />
			{/if}
		{/each}

		<BotMessage content={currentNode.content} />

		<ChoicesGroup>
			{#each currentNode.options as option}
				<Choice
					onclick={() => {
						if (option.nextNode) navigateToNode(option.nextNode, option.content);
						else alert('No next node');
					}}
				>
					{option.content}
				</Choice>
			{/each}
		</ChoicesGroup>
	</div>
</div>
