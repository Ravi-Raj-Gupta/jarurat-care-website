<script lang="ts">
	import { writable } from 'svelte/store';
	import BillingOptions from './billing-options.svelte';
	import PersonalDetails from './personal-details.svelte';
	import SuccessScreen from './success-screen.svelte';
	import { billingSchema, personalDetailsSchema } from './schema';

	function updatePaymentData(data: Record<string, string | number>) {
		paymentData.set({ ...$paymentData, ...data });
		return $paymentData;
	}

	let paymentData = writable({ amount: 1000, 'payment-type': 'subscription' });
	let currentScreen = 'billing';
	let isLoading = writable(false);
	let transactionId = writable<string>('');

	async function getTokenUrl(amount: number) {
		transactionId.set('');
		isLoading.set(true);
		const resp = await fetch(`/api/payment/get-pay-page-url?amount=${amount}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((resp) => resp.json());

		const txnId = resp?.data?.txnId || '';
		transactionId.set(txnId);

		return resp?.data?.url || '';
	}

	async function paymentCallback() {
		isLoading.set(true);
		window.document.body.style.overflow = 'auto';

		// finally
		isLoading.set(false);
	}
</script>

<div class="py-8 px-4 md:my-16 max-w-[66rem] mx-auto bg-[#D3F2FC] md:rounded-xl">
	<div class="grid md:grid-cols-3">
		<div class="col-span-2"></div>

		{#if currentScreen === 'billing'}
			<BillingOptions
				on:data={(ev) => updatePaymentData(ev.detail)}
				on:submit={() => {
					const resp = billingSchema.safeParse($paymentData);

					if (resp.success) {
						currentScreen = 'details';
					}
				}}
			/>
		{:else if currentScreen === 'details'}
			<PersonalDetails
				isLoading={$isLoading}
				on:data={(ev) => updatePaymentData(ev.detail)}
				on:submit={async () => {
					const billingDetails = billingSchema.parse($paymentData);
					const personalDetails = personalDetailsSchema.safeParse($paymentData);

					window.document.body.style.overflow = 'hidden';

					if (personalDetails.success) {
						const script = document.createElement('script');
						script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
						document.head.appendChild(script);

						const tokenUrl = await getTokenUrl(billingDetails.amount);
						// @ts-ignore
						window.PhonePeCheckout.transact({
							tokenUrl,
							callback: paymentCallback,
							type: 'IFRAME'
						});
					} else alert(personalDetails.error.message);
				}}
			/>
		{:else}
			<SuccessScreen />
		{/if}
	</div>
</div>
