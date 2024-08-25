<script lang="ts">
	import { ArrowRight, LoaderCircle } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { createEventDispatcher } from 'svelte';

	export let isLoading = false;

	const dispatch = createEventDispatcher();

	function onChange(data: Record<string, string | number>) {
		dispatch('data', data);
	}

	function onSubmit() {
		dispatch('submit', {});
	}

	const fields = [
		{
			type: 'text',
			label: 'Full Name',
			placeholder: 'Enter your full name',
			name: 'full-name',
			required: true
		},
		{
			type: 'email',
			label: 'Email',
			placeholder: 'Enter your email',
			name: 'email',
			required: true
		},
		{
			type: 'tel',
			label: 'Phone',
			placeholder: 'Enter your phone',
			prefix: '+91',
			name: 'phone',
			required: true
		},
		{ type: 'text', label: 'PAN', placeholder: 'Enter your PAN', name: 'pan' }
	];
</script>

<div class="font-manrope flex flex-col items-center gap-8 px-4 py-10 rounded-2xl bg-white shadow">
	<div>
		<h2 class="flex gap-1 font-rubik font-medium text-[1.5em] justify-center">
			<span class="text-[#0D2561]">Donate</span>
			<span class="text-[#0155BD]">Today</span>
		</h2>
		<p class="text-[#0D2561] px-4 text-center font-medium leading-tight">
			Your donation can make a life-saving difference
		</p>
	</div>

	<div class="w-full">
		<h3 class="text-[1.1em] leading-tight font-rubik font-medium text-[#0D2460]">
			Personal Details
		</h3>
		<p class="leading-tight text-[#576171] text-[0.9em]">Please fill in your details correctly</p>
		<div class="flex flex-col gap-2 flex-wrap mt-2">
			{#each fields as field}
				<Input
					name={field.name}
					type={field.type}
					label={field.label}
					placeholder={field.placeholder}
					prefix={field.prefix}
					required={field.required}
					on:change={(ev) => onChange({ [field.name]: ev.detail.value })}
				/>
			{/each}
		</div>
	</div>

	<div class="flex gap-2">
		<Button
			class="flex items-center gap-1 px-4 py-1 bg-white text-[#0155bd] border border-[#0155bd] "
		>
			Back
		</Button>
		<Button class="bg-[#0155bd] flex items-center gap-1 px-4 py-1" on:click={onSubmit}>
			{#if isLoading}
				<LoaderCircle class="animate-spin" />
			{:else}
				Continue <ArrowRight />
			{/if}
		</Button>
	</div>
</div>
