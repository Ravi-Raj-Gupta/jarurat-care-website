<script lang="ts">
	import { onMount } from 'svelte';
	import Care from './svg/care.svelte';
	import Heading from './homepage/heading.svelte';

	onMount(() => {
		const cancerConnectPopup = document.querySelector('.cancer-connect-popup');
		const cancerConnectForm = cancerConnectPopup?.querySelector('form');

		const reqSupportBtn = document.querySelector('#req-support-btn');
		const becomeMentorBtn = document.querySelector('#become-mentor-btn');

		const createHiddenCCField = (type: string) => {
			const oldHiddenFields = cancerConnectForm?.querySelectorAll('.hidden-field');
			oldHiddenFields?.forEach((field) => field.remove());

			const hiddenField = document.createElement('input');

			hiddenField.setAttribute('hidden', '');
			hiddenField.setAttribute('name', 'type');
			hiddenField.setAttribute('value', type || 'unknown');
			hiddenField.classList.add('hidden-field');

			return hiddenField;
		};

		reqSupportBtn?.addEventListener('click', () => {
			const hiddenField = createHiddenCCField('Request Support');
			cancerConnectForm?.appendChild(hiddenField);
			cancerConnectPopup?.classList.remove('hidden');
		});

		becomeMentorBtn?.addEventListener('click', () => {
			const hiddenField = createHiddenCCField('Become a Mentor');
			cancerConnectForm?.appendChild(hiddenField);
			cancerConnectPopup?.classList.remove('hidden');
		});

		const cancerConnectPopupCloseBtn = cancerConnectPopup?.querySelector(
			'#reset-cancer-connect-popup'
		);

		cancerConnectPopupCloseBtn?.addEventListener('click', () => {
			cancerConnectPopup?.classList.add('hidden');
		});

		cancerConnectForm?.addEventListener('submit', (ev) => {
			ev.preventDefault();

			const formData = new FormData(cancerConnectForm);
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
						cancerConnectPopup?.classList.add('hidden');
					} else {
						alert('Something went wrong. Please try again');
					}
				})
				.catch((err) => {
					console.error(err);
					alert('Something went wrong. Please try again later.');
				});
		});
	});
</script>

<Heading
	subtitle="Step into a World where Hope Blossoms, Join our Community Today"
	className="!mt-[1rem]"
/>

<div class="cancer-connect">
	<!-- <div class="cancer-connect-text-wrapper">
		<p class="cancer-connect-text">
			In times of uncertainty, our devoted caregivers are here to guide you. We assist with clinical
			visits and medical needs, ensuring you never face your journey alone.
		</p>

		<p class="cancer-connect-text">
			Join CancerConnect today and experience the support of a compassionate community.
		</p>
	</div> -->

	<div class="cancer-connect-call-to-action-container">
		<section class="cancer-connect-cta">
			<div class="svg">
				<Care fill="#92c7cf" size="6rem" />
			</div>

			<strong></strong>

			<p>Are you a cancer fighter, survivor, or caregiver?</p>

			<p>
				CancerConnect partners you with a mentor so you can get the support you need from someone
				experienced with this disease.
			</p>

			<div style="flex-grow: 1"></div>

			<button id="req-support-btn">REQUEST SUPPORT</button>
		</section>

		<section class="cancer-connect-cta">
			<div class="svg">
				<Care fill="#92c7cf" size="6rem" />
			</div>

			<strong></strong>

			<p>
				Do you have personal experience with cancer? Become a mentor and join others from around the
				world to provide support, empathy, and understanding to a fellow cancer fighter, survivor,
				or caregiver.
			</p>

			<div style="flex-grow: 1"></div>

			<button id="become-mentor-btn">BECOME A MENTOR</button>
		</section>
	</div>
</div>

<div class="cancer-connect-popup hidden">
	<div class="cancer-connect-popup-content">
		<button id="reset-cancer-connect-popup" type="reset">✕</button>

		<div class="cancer-connect-popup-heading">
			<h2 class="section-heading">CancerConnect</h2>
			<p class="section-subheading">We will reach out to you within a week</p>
		</div>

		<form class="cancer-connect-form">
			<label>
				<small>First Name</small>
				<input type="text" placeholder="John" name="first_name" required />
			</label>

			<label>
				<small>Last Name</small>
				<input type="text" placeholder="Doe" name="surname" required />
			</label>

			<label>
				<small>Email</small>
				<input type="email" placeholder="john@gmail.com" name="email" required />
			</label>

			<label>
				<small>Phone</small>
				<input type="text" placeholder="+91 7002 000 000" name="phone" required />
			</label>

			<label>
				<p style="line-height: 1.3; font-size: 0.8em">
					<input type="checkbox" name="consent" />
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
	.cancer-connect {
		margin: auto;
		max-width: var(--max-width);
		padding: 0 1.4rem;
	}

	.cancer-connect-text-wrapper {
		padding: 0.3rem 0.5rem;
		margin-top: 2rem;
		border-radius: 1rem;
		background-color: #f1f8fa;
	}

	.cancer-connect-text {
		font-size: 1.3em;
		padding: 1rem;
		text-align: left;
		width: 100%;
	}

	.cancer-connect-call-to-action-container {
		gap: 2rem;
		margin: 2rem 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.cancer-connect-cta {
		gap: 1.5rem;
		padding: 2rem 2rem;
		display: flex;
		text-align: center;
		align-items: center;
		flex-direction: column;
		border-radius: 0.7rem;
		background-color: #f1f8fa;
	}

	@media screen and (max-width: 700px) {
		.cancer-connect-call-to-action-container {
			gap: 4rem;
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}

		.cancer-connect-cta {
			padding: 2rem 1rem;
		}
	}

	.cancer-connect-cta strong {
		font-size: 1.2em;
		font-weight: 500;
	}

	.cancer-connect-cta button {
		margin-top: 1rem;
		border: 3px solid #92c7cf;
		padding: 0.8rem 2.3rem;
		color: black;
		background: #92c7cf;
		font-weight: 500;
		border-radius: 0.3rem;
		cursor: pointer;
		transition: 0.3s ease all;
	}

	.cancer-connect-cta button:hover {
		color: #141414;
		background-color: white;
	}

	/********* CancerConnect Form ****************/

	.cancer-connect-popup {
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

	.cancer-connect-popup.hidden {
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

	.cancer-connect-popup.hidden .cancer-connect-popup-content {
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

	.cancer-connect-popup button[type='reset'] {
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

	.cancer-connect-popup button[type='reset']:hover {
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
