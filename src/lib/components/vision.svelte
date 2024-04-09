<script>
	import Heading from './homepage/heading.svelte';
</script>

<Heading
	title="Hope in Every Breath"
	subtitle="Jarurat Care Unveils a Vision of Support and Healing"
/>

<div class="gh-inner vision">
	<div class="vision-background">
		<div>
			<img src="https://i.ibb.co/1GZDfrm/vision.webp" alt="Jarurat Care Foundation" />
		</div>

		<div>
			<p>
				Jarurat Care addresses the growing challenges of rare cancers by focusing on financial,
				knowledge, emotional well-being, research, and time management through community support.
			</p>

			<p>
				We're your cherished friend or family, offering emotional and practical support when you're
				drained. As seasoned mentors who've navigated similar paths, we empower you to manage
				controllable aspects of your situation.
			</p>

			<p>We are an NGO who take donations to support cancer patients.</p>
		</div>
	</div>
</div>

<style>
	.vision {
		width: 100%;
		max-width: var(--max-width);
		margin: 3rem auto;
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
