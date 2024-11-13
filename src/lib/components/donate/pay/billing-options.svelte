<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	const dispatch = createEventDispatcher();

	function onChange(data: Record<string, string | number>) {
		dispatch('data', data);
	}

	function onSubmit() {
		dispatch('submit', {});
	}

	const amounts = [200, 500, 1000, 5000, 10000];

	let selectedAmount = '200';
	let selectedPaymentType = 'one-time';
	let selectedFinalAmount = writable(200);

	selectedFinalAmount.subscribe((value) => onChange({ amount: value }));
</script>

<div
	class="font-manrope flex flex-col items-center gap-8 px-4 py-10 rounded-2xl bg-white shadow border"
>
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
			Billing Options
		</h3>
		<div class="flex gap-2 flex-wrap mt-2">
			<Checkbox
				label="Pay Once"
				type="radio"
				name="payment-type"
				value="one-time"
				checked={selectedPaymentType === 'one-time'}
				on:change={(ev) => onChange({ ['payment-type']: 'one-time' })}
			/>
			<Checkbox
				label="Pay Monthly"
				type="radio"
				name="payment-type"
				value="subscription"
				checked={selectedPaymentType === 'subscription'}
				on:change={(ev) => onChange({ ['payment-type']: 'subscription' })}
			/>
		</div>
	</div>

	<div class="w-full">
		<h3 class="text-[1.1em] leading-tight font-rubik font-medium text-[#0D2460]">
			Donation Amount
		</h3>
		<p class="leading-tight text-[#576171] text-[0.9em]">
			Choose the amount you would like to donate
		</p>
		<div class="flex gap-2 flex-wrap mt-2">
			{#each amounts as amount}
				<Checkbox
					label={`₹${amount}`}
					type="radio"
					name="amount"
					value={amount}
					checked={amount.toString() === selectedAmount}
					on:change={() => {
						selectedAmount = amount.toString();
						selectedFinalAmount.set(amount);
					}}
				/>
			{/each}

			<Checkbox
				label={`Custom Amount`}
				type="radio"
				name="amount"
				value="custom-amount"
				checked={'custom-amount' === selectedAmount}
				on:change={() => (selectedAmount = 'custom-amount')}
			/>

			{#if selectedAmount === 'custom-amount'}
				<Input
					type="number"
					max="50000"
					class="min-w-[30%]"
					placeholder="Please enter amount"
					required
					prefix="₹"
					label="Amount"
					on:change={(ev) => selectedFinalAmount.set(parseFloat(ev.detail.value))}
				/>
			{/if}
		</div>
	</div>

	<Button class="bg-[#0155bd] flex items-center gap-1 px-4 py-2" on:click={onSubmit}>
		Continue <ArrowRight />
	</Button>
</div>
