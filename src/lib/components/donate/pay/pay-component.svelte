<script lang="ts">
	import { writable } from 'svelte/store';
	import BillingOptions from './billing-options.svelte';
	import PersonalDetails from './personal-details.svelte';
	import SuccessScreen from './success-screen.svelte';
	import ImgHeroBg from '$lib/assets/donate/hero-img.webp';
	import { billingSchema, personalDetailsSchema } from './schema';

	// Function to update payment data
	function updatePaymentData(data: Record<string, string | number>) {
		paymentData.set({ ...$paymentData, ...data });
		return $paymentData;
	}

	// Writable store to hold payment data
	let paymentData = writable({ amount: 1, 'payment-type': 'subscription', email: '' });

	let currentScreen = 'billing';
	let isLoading = writable(false);
	let transactionId = writable<string>('');

	// Function to get payment token URL
	async function getTokenUrl(amount: number) {
		transactionId.set('');
		isLoading.set(true);
		const resp = await fetch(`/api/payment/get-pay-page-url?amount=${amount}`, {
			headers: { 'Content-Type': 'application/json' }
		}).then((resp) => resp.json());

		const txnId = resp?.data?.txnId || '';
		transactionId.set(txnId);

		return resp?.data?.url || '';
	}

	// Retry logic for payment status verification with exponential backoff
	let reqCount = 1;
	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
	const delayTime = 1000;
	const maxReqCount = 5;
	const genRangeRandom = (min: number, max: number) =>
			Math.floor(Math.random() * (max - min + 1)) + min;

	// Payment callback function to verify transaction
	async function paymentCallback() {
		isLoading.set(true);
		window.document.body.style.overflow = 'auto';

		const maxRetries = 5;
		let retryCount = 0;
		let backoffTime = 1000;

		try {
			const fetchTransactionStatus = async () => {
				const response = await fetch(`/api/payment/verify-transaction?txn-id=${$transactionId}`, {
					headers: { 'Content-Type': 'application/json' }
				});

				const json = await response.json();
				const data = json.data || {};
				const state = data.state ? data.state.toLowerCase() : 'error';

				return { state, data };
			};

			while (retryCount < maxRetries) {
				const { state, data } = await fetchTransactionStatus();

				if (state === 'completed') {
					// Transaction successful
					currentScreen = 'success';
					isLoading.set(false);

					// Send email with payment details (name, amount, email)
					await fetch('https://jarurat-care-email-service.onrender.com/jarurat-care/sendMail/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name: $paymentData['full-name'],
							amount: $paymentData.amount,
							email: $paymentData.email
						})
					});

					return { status: 'success', data };
				}

				if (state === 'error') {
					// Transaction failed
					alert('Failed to make the transaction');
					isLoading.set(false);
					return { status: 'error', data };
				}

				// If state is still processing/pending, retry with exponential backoff
				retryCount++;
				backoffTime *= 2;
				console.log(`Retrying... Attempt ${retryCount} with ${backoffTime}ms delay`);

				await new Promise(resolve => setTimeout(resolve, backoffTime));
			}

			// If max retries are exhausted, show an alert
			alert('Max retries reached. Please try again later.');
			isLoading.set(false);
			return { status: 'error', data: null };

		} catch (err) {
			console.error('Error in payment callback:', err);
			isLoading.set(false);
			return { status: 'error', data: null };
		}
	}
</script>

<div id="donate" class="md:p-2 bg-[#D3F2FC]">
	<div
			style="background-image: url('{ImgHeroBg}');"
			class="py-8 px-4 md:my-16 max-w-[66rem] mx-auto md:rounded-xl bg-cover bg-center relative overflow-hidden"
	>
		<div class="bg-[#D3F2FC] sm:bg-[#797e8a]/80 absolute inset-0"></div>

		<div class="grid md:grid-cols-3 relative z-10">
			<div class="col-span-2 hidden md:flex flex-col justify-end px-4 max-w-[70%]">
				<div class="flex flex-col justify-end items-start gap-2">
					<h3 class="font-rubik text-white text-[1.4em] leading-tight">Help Us Fight Cancer</h3>
					<p class="text-white text-[0.9em] leading-tight">
						Jarurat Care is dedicated to providing comprehensive support to cancer patients and
						their caregivers in our local community. Through emotional counseling, mental wellness
						programs, caregiver mentorship, and connections to top medical experts, we aim to
						empower those impacted by cancer. Your donation will directly fund these vital services,
						ensuring no one faces their cancer journey alone.
					</p>
					<p
							class="bg-green-400 text-[0.8em] leading-tight p-2 rounded-r-md border-l-2 border-black"
					>
						All donations to JaruratCare Foundation are eligible for 50% tax exemption under section
						80G of the Income Tax Act.
					</p>
				</div>
			</div>

			<div class="z-10">
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
					<SuccessScreen txnId={$transactionId} amount={$paymentData.amount} />
				{/if}
			</div>
		</div>
	</div>
</div>
