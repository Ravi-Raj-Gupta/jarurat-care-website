<script lang="ts">
	import { marked } from 'marked';
	import { ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let question = '';
	export let answer = '';

	let isOpen = writable(false);

	let container: HTMLDivElement | null = null;
	let contentHeight = 0;

	onMount(() => {
		if (container) contentHeight = container.scrollHeight;
	});
</script>

<div class="bg-white sm:px-4 py-3 sm:rounded-lg border-b sm:border">
	<button
		class="flex items-center justify-between cursor-pointer w-full text-[#6BAA2E] font-medium text-[0.9em] text-left gap-4"
		on:click={() => isOpen.set(!$isOpen)}
	>
		{question}
		<ChevronDown class={`text-[#6BAA2E] ${$isOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
	</button>

	<div
		bind:this={container}
		style="height: {$isOpen ? contentHeight : 0}px"
		class="overflow-hidden transition-all text-gray-700 text-[0.8em]"
	>
		<p class="mt-2 px-2 pt-2 border-t prose faq-content">{@html marked(answer)}</p>
	</div>
</div>
<style>
:global(.faq-content a) {
    color: #2563EB;
    font-weight: 700;
    text-decoration: none;
}

:global(.faq-content a:hover) {
    text-decoration: underline;
}
</style>