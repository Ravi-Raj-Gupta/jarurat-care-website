<script lang="ts">
	import TransparentLogo from '../../assets/images/logo-transparent.webp';
</script>

<div class="hero">
	<div class="container hero-inner">
		<section class="hero-text-container">
			<h1 class="hero-tagline">Jaisi Jarurat, Vaisi Care</h1>

			<p class="hero-description">
				We are Committed to Bring Certainty during your Uncertain Times
			</p>

			<a class="hero-cta" href="/#donation">
				Take Action!
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-[1.3rem] text-red-500"
				>
					<path
						d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
					></path>
				</svg>
			</a>
		</section>

		<aside class="hero-image-container">
			<img fetchpriority="high" class="hero-image" src={TransparentLogo} alt="Jarurat Care" />
		</aside>
	</div>
</div>

<style>
	.hero {
		background-color: #f1f8fa;
		padding: 2rem 1rem;
		min-height: 20rem;
		display: flex;
		align-items: center;
		position: relative;
		border-bottom-right-radius: 50%;
	}

	.hero-inner {
		padding: 2rem 6rem;
		max-width: 90rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;
	}

	.hero-inner .hero-tagline {
		font-size: 2.7em;
		font-weight: 300;
	}

	.hero-inner .hero-description {
		opacity: 0.5;
		font-size: 1.4em;
		font-weight: 300;
		line-height: 1.3;
		margin-top: 1.5rem;
	}

	.hero-inner .hero-cta {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-top: 3.5rem;
		padding: 1rem 2.5rem;
		font-size: 1.2em;
		column-gap: 0.5rem;
		background-color: transparent;
		color: white;
		border: none;
		background-color: #92c7cf;
		border-radius: 3rem;
		cursor: pointer;
		font-weight: bold;
		transition: 0.1s ease transform;
	}

	.hero-inner .hero-cta:hover {
		transform: scale(1.05);
	}

	.hero-inner svg {
		stroke: white;
		/*fill: red;*/
	}

	.hero-image-container {
		max-width: 50rem;
		text-align: right;
		display: flex;
		justify-content: flex-end;
	}

	.hero-image-container .hero-image {
		width: 100%;
		max-width: 20rem;
		border-radius: 2rem;
	}

	@media screen and (max-width: 920px) {
		.hero-inner {
			grid-template-columns: repeat(1, 1fr);
			gap: 6rem;
			padding: 0.6rem;
		}

		.hero-inner .hero-image-container {
			grid-row: 1 / span 1;
			max-width: 100%;
			justify-content: center;
		}
	}
</style>
