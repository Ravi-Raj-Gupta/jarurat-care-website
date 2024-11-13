<script lang="ts">
	import { CheckIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let type: 'radio' | 'checkbox' = 'checkbox';
	export let value: string | number;
	export let label = '';
	export let name = '';
	export let checked: boolean = false;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	function onChange(value: string) {
		dispatch('change', { value });
	}
</script>

<label class="relative font-smibold font-rubik">
	<input
		{type}
		{value}
		{name}
		class="absolute inset-0 size-full opacity-0 cursor-pointer"
		{checked}
		{disabled}
		on:change={(ev) => onChange(ev.currentTarget.value)}
	/>
	<small class="px-4 py-2 flex items-center gap-1">
		{label || value}
		<span class="transition-all flex items-center justify-center">
			<CheckIcon class="size-[1rem]" />
		</span>
	</small>
</label>

<style>
	input ~ small {
		color: #a6b2ba;
		border-radius: 0.4rem;
		border: 0.1rem solid #a6b2ba;
		background-color: #e8ebf1;
	}

	input:checked ~ small {
		color: #0155bd;
		border: 0.1rem solid #0155bd;
		background-color: #d3f2fc;
	}

	input ~ small span {
		width: 0;
		overflow: hidden;
	}

	input:checked ~ small span {
		width: 1.3rem;
	}
</style>
