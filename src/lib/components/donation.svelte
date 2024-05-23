<script lang="ts">
	import { onMount } from 'svelte';
	import Heading from './homepage/heading.svelte';
	import Care from './svg/care.svelte';
	import Money from './svg/money.svelte';
	import Divider from './svg/divider.svelte';

	let donateTimeRef: HTMLElement;

	onMount(() => {
		try {
			const script = document.createElement('script');
			script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
			document.head.appendChild(script);

			const popup = document.querySelector('.donation-amount-popup-wrapper');
			const form = popup?.querySelector('form');
			const donateMoney = document.getElementById('donate-money');
			const donationFinalAmountNotif = document.querySelector('#donation-final-amout-notif');
			const resetDonationPopup = document.querySelector('#reset-donation-popup');

			const getFormData = () => {
				const formData = new FormData(form);
				const payload = Object.fromEntries(formData.entries());

				return payload;
			};

			const printFinalAmountNotif = () => {
				const fd = getFormData();
				const hasCustomAmount = !!fd.customAmount;

				const amount = hasCustomAmount ? fd.customAmount : fd.amount;
				donationFinalAmountNotif &&
					(donationFinalAmountNotif.innerText = `You will be paying INR ${amount}/-`);
			};

			form?.addEventListener('change', () => {
				const fd = getFormData();
				const hasCustomAmount = !!fd.customAmount;

				printFinalAmountNotif();
			});

			setTimeout(printFinalAmountNotif, 300);

			const userId = (() => {
				const generateUUID = () => {
					const randomBytes = new Uint8Array(16);
					crypto.getRandomValues(randomBytes);

					randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
					randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant bits

					const uuid = Array.from(randomBytes)
						.map((byte) => byte.toString(16).padStart(2, '0'))
						.join('');

					return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;
				};

				const userId = window.localStorage.getItem('uniqueId') || generateUUID();

				localStorage.setItem('uniqueId', userId);
				return userId;
			})();

			const getTokenUrl = async () => {
				const fd = getFormData();
				const hasCustomAmount = !!fd.customAmount;
				const amount = hasCustomAmount ? fd.customAmount : fd.amount;

				const baseURL = `https://chat-backend-e7nr.onrender.com`;
				// const baseURL = `http://localhost:3000`;
				const response = await fetch(`${baseURL}/checkout/donation`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ amount, marchentUserId: userId })
				});

				const json = await response.json();
				const txnId = json.data.txnId;
				const tknUrl = json.data.url;
				const input = document.createElement('input');

				input.setAttribute('class', 'txnId');
				input.setAttribute('value', txnId);
				input.setAttribute('hidden', '');

				form?.querySelectorAll('.txnId').forEach((el) => el.remove()); // clean up
				form?.appendChild(input);

				return tknUrl;
			};

			// following html are defined in components/donation-status.hbs
			const donationResultPopup = document.querySelector('.donation-result-popup-wrapper');
			const donationResultError = donationResultPopup?.querySelector('.donation-result-error');
			const donationResultLoading = donationResultPopup?.querySelector('.donation-result-loading');
			const donationResultSuccess = donationResultPopup?.querySelector('.donation-result-success');

			function handleDonationResultPopup(state: string) {
				if (state === 'success') {
					donationResultPopup?.classList.remove('hidden');

					donationResultError?.classList.add('hidden');
					donationResultSuccess?.classList.remove('hidden');
					donationResultLoading?.classList.add('hidden');
				} else if (state === 'error') {
					donationResultPopup?.classList.remove('hidden');

					donationResultError?.classList.remove('hidden');
					donationResultSuccess?.classList.add('hidden');
					donationResultLoading?.classList.add('hidden');
				} else {
					// loading
					donationResultPopup?.classList.remove('hidden');

					donationResultError?.classList.add('hidden');
					donationResultSuccess?.classList.add('hidden');
					donationResultLoading?.classList.remove('hidden');
				}
			}

			let reqCount = 1;
			const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
			const delayTime = 1000;
			const maxReqCount = 5;
			const genRangeRandom = (min: number, max: number) =>
				Math.floor(Math.random() * (max - min + 1)) + min;

			const verifyPayment: any = async () => {
				try {
					// @ts-ignore
					const txnId = form?.querySelector('.txnId')?.value;

					const baseURL = `https://chat-backend-e7nr.onrender.com`;
					// const baseURL = `http://localhost:3000`;
					const response = await fetch(`${baseURL}/checkout/verify`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ txnId })
					});
					const json = await response.json();
					const data = json.data || {};
					const state = data.state ? data.state.toLowerCase() : 'error';

					if ((state != 'success' || state != 'error') && reqCount < maxReqCount) {
						handleDonationResultPopup('loading');

						const delta = genRangeRandom(1000, 4_000);
						const totalDelay = delayTime * reqCount + delta;
						await delay(totalDelay);
						reqCount++;

						return verifyPayment();
					}

					if (data.state === 'success') handleDonationResultPopup('success');
					else handleDonationResultPopup('error');

					return json;
				} catch (err) {
					console.log(err);
					return {};
				}
			};

			donateMoney?.addEventListener('click', () => {
				popup?.classList.remove('hidden');
			});

			async function handlePostPayment(payload: any) {
				try {
					const response = await verifyPayment();
				} catch (err) {
					console.log(err);
				}
			}

			form?.addEventListener('submit', async (ev) => {
				ev.preventDefault();

				const tokenUrl = await getTokenUrl();
				// @ts-ignore
				window.PhonePeCheckout.transact({ tokenUrl, callback: handlePostPayment, type: 'IFRAME' });
			});

			resetDonationPopup?.addEventListener('click', async (ev) => {
				form && form.reset();
				popup?.classList.add('hidden');
			});

			const createHiddenCCField = (type: string) => {
				const oldHiddenFields = donateTime_CancerConnectForm?.querySelectorAll('.hidden-field');
				oldHiddenFields?.forEach((field: Element) => field.remove());

				const hiddenField = document.createElement('input');

				hiddenField.setAttribute('hidden', '');
				hiddenField.setAttribute('name', 'type');
				hiddenField.setAttribute('value', type || 'unknown');
				hiddenField.classList.add('hidden-field');

				return hiddenField;
			};

			console.log(donateTimeRef);

			/****** donate time and skills ******/
			const donateTimeBtn = document.querySelector('#donate-time');
			const donateTime_cancerConnectPopup = donateTimeRef;
			const donateTime_CancerConnectForm = donateTime_cancerConnectPopup?.querySelector('form'); // the CancerConnect form

			donateTimeBtn?.addEventListener('click', () => {
				// defined in partials/components/cancer-connect.hbs
				const hiddenField = createHiddenCCField('Donate Time');
				donateTime_CancerConnectForm?.appendChild(hiddenField);
				donateTime_cancerConnectPopup?.classList.remove('hidden');
			});

			const donateTimePopupCloseBtn = donateTimeRef?.querySelector('#reset-cancer-connect-popup');
			donateTimePopupCloseBtn?.addEventListener('click', (ev) => {
				donateTime_cancerConnectPopup?.classList.add('hidden');
			});

			donateTime_CancerConnectForm?.addEventListener('submit', (ev) => {
				ev.preventDefault();

				const formData = new FormData(donateTime_CancerConnectForm);
				const payload = Object.fromEntries(formData.entries());

				fetch('https://chat-backend-e7nr.onrender.com/cancer-connect', {
					method: 'POST',
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				})
					.then((response) => response.json())
					.then((response) => {
						if (response.status === 'success') {
							window.alert('Thank you. We will reach out to you soon.');
							donateTime_cancerConnectPopup?.classList.add('hidden');
						} else {
							alert('Something went wrong. Please try again');
						}
					})
					.catch((err) => {
						console.error(err);
						alert('Something went wrong. Please try again later.');
					});
			});
		} catch (e) {
			console.log(e);
			// search StackOverflow for the error
			// window.open('https://stackoverflow.com/search?q=[js]+' + e.message, '_blank'); --}}
		}
	});
</script>

<div class="donation-result-popup-wrapper hidden">
	<div class="donation-result-popup">
		<div class="donation-result-success">
			<div class="svg">
				<!-- {{> svg/success-tick }} -->
			</div>
			<h2>Thank you for Donating!</h2>
			<small class="donation-result-popup-close">close</small>
		</div>

		<div class="donation-result-error">
			<!--<div class="svg">{{> svg/success-tick }}</div>-->
			<h2>Something Went Wrong. Please try again later!</h2>
			<small class="donation-result-popup-close">close</small>
		</div>

		<div class="donation-result-loading">
			<div class="svg">
				<!-- {{> svg/loading }} -->
			</div>
			<small class="donation-result-popup-close">close</small>
		</div>
	</div>
</div>

<div class="gh-inner donation-wrapper" id="donation">
	<div class="donation">
		<div>
			<Heading
				title="Empower Hope"
				subtitle="Join the Cancer Care Revolution"
				className="!mt-[1rem]"
			/>
		</div>

		<div class="donation-btn-group">
			<a id="donate-time">
				<span class="donation-svg-container">
					<Care size="2rem" />
				</span>

				<span class="donation-btn-text">
					<strong>Donate Time</strong>
					<small>Become a Caregiver</small>
				</span>
			</a>

			<a id="donate-money">
				<span class="donation-svg-container">
					<Money size="2rem" />
				</span>

				<span class="donation-btn-text">
					<strong>Donate Money</strong>
					<small>Give a Little, Change a Lot</small>
				</span>
			</a>

			<a
				href="mailto:priyanka.joshi@jarurat.care?subject=Work%20with%20Jarurat%20Care%20Foundation"
			>
				<span class="donation-svg-container">
					<Divider size="2rem" />
				</span>

				<span class="donation-btn-text">
					<strong>Donate Skills</strong>
					<small>Join Hope's Team</small>
				</span>
			</a>
		</div>
	</div>
</div>

<div class="donation-amount-popup-wrapper hidden z-30">
	<div class="donation-amount-popup">
		<button id="reset-donation-popup" type="reset">✕</button>

		<h2>Choose an amount you would like to donate</h2>

		<form>
			<div class="donation-label-group">
				<label>
					<input type="radio" name="amount" value="500" checked />
					<span>₹500</span>
				</label>

				<label>
					<input type="radio" name="amount" value="1000" checked />
					<span>₹1000</span>
				</label>

				<label>
					<input type="radio" name="amount" value="5000" />
					<span>₹3000</span>
				</label>

				<label>
					<input type="radio" name="amount" value="5000" />
					<span>₹5000</span>
				</label>

				<label class="custom-amount">
					<span>₹</span>
					<input type="text" name="customAmount" placeholder="enter an amount..." min="10" />
				</label>
			</div>

			<button type="submit">Donate!</button>
			<small id="donation-final-amout-notif"></small>
		</form>
	</div>
</div>

<div bind:this={donateTimeRef} class="donate-time hidden">
	<div class="cancer-connect-popup-content">
		<button id="reset-cancer-connect-popup" type="reset">✕</button>

		<div class="cancer-connect-popup-heading">
			<h2 class="section-heading">CancerConnect</h2>
			<p class="section-subheading">We will reach out to you within a week</p>
		</div>

		<form class="cancer-connect-form">
			<label>
				<small>First Name</small>
				<input type="text" placeholder="First" name="first_name" required />
			</label>

			<label>
				<small>Last Name</small>
				<input type="text" placeholder="Last" name="surname" required />
			</label>

			<label>
				<small>Email</small>
				<input type="email" placeholder="first@gmail.com" name="email" required />
			</label>

			<label>
				<small>Phone</small>
				<input type="text" placeholder="+91 7002 000 000" name="phone" required />
			</label>

			<label>
				<p style="line-height: 1.3; font-size: 0.8em">
					<input type="checkbox" name="consent" required />
					Yes, I agree to receive emails from Jarurat Care Foundation to be a part of cancer community.
				</p>
			</label>

			<div class="cancer-connect-submit">
				<button type="submit">Join Jarurat Care</button>
			</div>
		</form>
	</div>
</div>

<style>
	.donation-wrapper {
		background: url('https://preview.colorlib.com/theme/charityworks/assets/img/gallery/about1.png.webp');
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		/* margin-bottom: 6rem !important; */
	}

	.donation {
		background-color: #ffffffca;
		padding-bottom: 3rem;
	}

	.donation-btn-group {
		margin: 2rem auto 1rem auto;
		gap: 2rem;
		display: grid;
		max-width: var(--max-width);
		grid-template-columns: repeat(3, minmax(0, 1fr));
		align-items: center;
		justify-content: space-between;
	}

	.donation-btn-group a {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0.7em 1.7em 0.7em 3.7em;
		background: #92c7cf;
		border-radius: 4rem;
		cursor: pointer;
	}

	@media screen and (max-width: 1022px) {
		.donation-btn-group {
			padding: 0 2.5rem;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media screen and (max-width: 600px) {
		.donation-btn-group {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}

	.donation-svg-container {
		position: absolute;
		left: -1em;
		background: #fff;
		aspect-ratio: 1;
		border-radius: 100%;
		width: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.donation-btn-group a svg {
		width: 4.5em;
		aspect-ratio: 1;
		transform: scale(0.7);
	}

	.donation-btn-text {
		display: flex;
		flex-direction: column;
		line-height: 1.3;
	}

	.donation-btn-text strong {
		font-weight: 400;
	}

	.donation-btn-text small {
		opacity: 0.7;
	}

	/************************* DONATION POPUP ********************/

	.donation-amount-popup-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 1rem;
		background: #000000da;
		backdrop-filter: blur(10px);

		display: flex;
		align-items: center;
		justify-content: center;
		transition: 0.3s ease all;
	}

	.donation-amount-popup-wrapper.hidden {
		opacity: 0;
		visibility: collapse;
	}

	.donation-amount-popup {
		width: 100%;
		max-width: 25rem;
		padding: 1rem;
		background: white;
		border-radius: 1rem;
		position: relative;
		transition: 0.3s ease all;
	}

	.donation-amount-popup-wrapper.hidden .donation-amount-popup {
		opacity: 0;
		transform: translateY(100%);
	}

	.donation-amount-popup h2 {
		margin-top: 1.3rem;
		font-weight: 400;
	}

	.donation-amount-popup form {
		gap: 0.5rem;
		width: 100%;
		display: flex;
		font-size: 1.1em;
		flex-direction: column;
	}

	.donation-label-group {
		gap: 1.3rem;
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.donation-amount-popup form label:not(.custom-amount) {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		position: relative;
		border: 1px solid #92c7cf;
		border-radius: 0.7rem;
		overflow: hidden;
	}

	.donation-amount-popup form label:not(.custom-amount) input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.donation-amount-popup form label:not(.custom-amount) span {
		background: #f1f8fa;
		padding: 0.3rem 1.3rem;
		transition: 0.3s ease all;
	}

	.donation-amount-popup form label:not(.custom-amount) input:checked ~ span {
		background: #92c7cf;
	}

	.donation-amount-popup .custom-amount {
		gap: 1rem;
		display: inline-flex;
		align-items: center;
		max-width: 20rem;
		overflow: hidden;
	}

	.donation-amount-popup .custom-amount input {
		flex-grow: 1;
		width: 100%;
		border: 1px solid lightgray;
		padding: 0.2rem 0.7rem;
		border-radius: 0.5rem;
		outline: none;
	}

	#donation-final-amout-notif {
		text-align: center;
		margin: 0 0 1rem 0;
		color: slategray;
	}

	.donation-amount-popup form button[type='submit'] {
		cursor: pointer;
		margin: 3rem auto 0 auto;
		font-size: 0.8em;
		padding: 0.3rem 2rem;
		border: 1px solid #92c7cf;
		border-radius: 0.5rem;
		background: #f1f8fa;
		transition: 0.3s ease all;
	}

	.donation-amount-popup form button[type='submit']:hover {
		background: #92c7cf;
	}

	.donation-amount-popup form button[type='submit']:disabled {
		color: white;
		background: lightgray;
		border-color: lightgray;
	}

	.donation-amount-popup button[type='reset'] {
		width: 3rem;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: -0.5rem;
		right: -0.5rem;
		border-radius: 100%;
		border: 1px solid #fac4c4;
		background: #fac4c4;
		cursor: pointer;
		font-size: 1.2em;
		transition: 0.3s ease all;
	}

	.donation-amount-popup button[type='reset']:hover {
		background: red;
		border: 1px solid red;
	}

	/** DONATE TIME POPUP */

	.donate-time {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 1rem;
		z-index: 100;
		background: #000000da;
		backdrop-filter: blur(10px);

		display: flex;
		align-items: center;
		justify-content: center;
		transition: 0.3s ease all;
	}

	.donate-time.hidden {
		opacity: 0;
		visibility: collapse;
	}

	.cancer-connect-popup-content {
		width: 100%;
		max-width: 45rem;
		padding: 2rem;
		background: white;
		border-radius: 1rem;
		position: relative;
		transition: 0.3s ease all;
	}

	.donate-time.hidden .cancer-connect-popup-content {
		opacity: 0;
		transform: translateY(100%);
	}

	.cancer-connect-popup-heading {
		margin-bottom: 2rem;
	}

	.cancer-connect-popup-heading .section-heading {
		margin-top: 0 !important;
		font-size: 2em !important;
		padding: 0;
	}

	.cancer-connect-popup-heading .section-subheading {
		font-size: 1.3em !important;
		padding: 0;
		line-height: 1.2;
	}

	.cancer-connect-form {
		gap: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.cancer-connect-form label {
		gap: 0.5rem;
		display: flex;
		flex-direction: column;
	}

	.cancer-connect-form label input {
		border: none;
		padding: 0.8rem 1.2rem;
		background-color: #f1f8fa;
		border-radius: 0.5rem;
	}

	.cancer-connect-form label input:focus {
		outline: 1px solid #92c7cf;
	}

	.cancer-connect-form label small {
		font-weight: 500;
		text-transform: uppercase;
	}

	.cancer-connect-form .cancer-connect-submit {
		margin-top: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancer-connect-form .cancer-connect-submit button {
		cursor: pointer;
		padding: 0.8rem 1.2rem;
		background: #f1f8fa;
		border-radius: 0.5rem;
		border: 1px solid #92c7cf;
		transition: 0.3s ease all;
	}

	.cancer-connect-form .cancer-connect-submit button:hover {
		background-color: #92c7cf;
	}

	.donate-time button[type='reset'] {
		width: 3rem;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: -0.5rem;
		right: -0.5rem;
		border-radius: 100%;
		border: 1px solid #fac4c4;
		background: #fac4c4;
		cursor: pointer;
		font-size: 1.2em;
		transition: 0.3s ease all;
	}

	.donate-time button[type='reset']:hover {
		background: red;
		border: 1px solid red;
	}

	.cancer-connect-cta .svg {
		width: 100%;
		max-width: 12rem;
		padding: 3rem;
		border-radius: 100%;
		background-color: #f1f8fa;
		border: 1px solid #92c7cf;
	}
</style>
