<script>
	import Heading from './homepage/heading.svelte';
</script>

<Heading
	title="Jarurat Care: Supporting  Cancer Patients"
	subtitle="Jarurat Care Unveils a Vision of Support and Healing"
/>

<div class="gh-inner vision">
	<div class="vision-background">
		<div>
			<img   loading="lazy" src="https://i.ibb.co/1GZDfrm/vision.webp" alt="Jarurat Care Foundation" />
		</div>

		<div>
			<p>
				Navigating cancers is challenging, but you're not alone. We're here to help with financial
				assistance, information, emotional support, research, and time management.
			</p>

			<p>
				Think of us as your caring family, providing emotional and practical help when you need it
				most. Our experienced mentors, who have faced similar journeys, empower you to manage the
				controllable aspects of your situation.
			</p>

			<p>
				As an NGO, we rely on generous donations to support cancer patients in need. Your
				contribution can make a world of difference.
			</p>

			<p>Join the Jarurat Care community today and let us support you every step of the way.</p>
		</div>
	</div>
</div>

<style>
	.vision {
		width: 100%;
		max-width: var(--max-width);
		margin: 1rem auto;
		padding: 1rem 1.4rem;
	}

	.vision-background {
		padding: 1.4rem;
		background: #f1f8fa;
		border-radius: 0.7rem;

		gap: 2rem;
		display: grid;
		align-items: center;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.vision p {
		font-size: 1.1em;
		margin-bottom: 2rem;
	}

	@media screen and (max-width: 700px) {
		.vision-background {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}
</style>
