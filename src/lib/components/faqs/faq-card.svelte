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
		class="flex items-center justify-between cursor-pointer w-full text-[#6BAA2E] hover:text-[#589223] font-semibold text-[0.95em] text-left gap-4 transition-colors"
		on:click={() => isOpen.set(!$isOpen)}
	>
		<span class="text-[#6BAA2E] font-semibold">{question}</span>
		<ChevronDown class={`text-[#6BAA2E] shrink-0 ${$isOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
	</button>

	<div
		bind:this={container}
		style="height: {$isOpen ? contentHeight : 0}px"
		class="overflow-hidden transition-all text-gray-700 text-[0.85em]"
	>
		<p class="mt-2 px-2 pt-2 border-t border-slate-100 prose faq-content leading-relaxed">
			{@html marked(answer)}
		</p>
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

