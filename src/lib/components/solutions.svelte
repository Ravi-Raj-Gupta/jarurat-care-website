<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { solutions } from '$lib/data/solutions';
	import Heading from './homepage/heading.svelte';

	onMount(() => {
		gsap.from('.solutions-tile', {
			duration: 1,
			y: 100,
			opacity: 0,
			stagger: 0.2,
			ease: 'power4.out',
			scrollTrigger: {
				start: 'bottom 10%',
				trigger: '.solutions-tile'
			}
		});
	});

	onMount(() => {
		const solutionTiles = document.querySelectorAll('.solution-unit');

		solutionTiles.forEach((tile) => {
			const overlay = tile.querySelector('.solution-unit-overlay');

			if (overlay) {
				tile.addEventListener('click', () => {
					overlay.classList.add('show');
				});

				const closeButton = overlay.querySelector('.solution-unit-overlay-close');

				if (closeButton) {
					closeButton.addEventListener('click', (ev) => {
						ev.stopPropagation();
						closeButton.parentElement?.classList.remove('show');
					});
				}
			}
		});
	});
</script>

<div class="solutions-wrapper">
	<div class="container">
		<Heading title="How you will be helped?" />

		<div class="solutions">
			{#each solutions as solution}
				<div class="solutions-tile solution-unit">
					<div class="solutions-tile-icon-wrapper">
						<div class="solutions-tile-icon">
							<svelte:component this={solution.icon} fill="white"></svelte:component>
						</div>
					</div>

					<strong class="solutions-tile-title">{solution.title}</strong>
					<div class="solution-unit-overlay">{solution.description}</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.solutions-wrapper {
		padding-bottom: 5rem;
	}

	.solutions {
		display: grid;
		gap: 2rem;
		margin: 2rem auto;
		max-width: var(--max-width);
		padding: 0 1.4rem 1.4rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.solutions-tile {
		box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.05);
		border-radius: 1rem;
		background: #fff;
		gap: 1rem;
		padding-bottom: 1rem;
		display: flex;
		flex-direction: column;

		/*max-height: 25rem;*/
		overflow: auto;
	}

	.solutions-tile-icon-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-color: #92c7cf;
	}

	.solutions-tile-icon {
		width: 100%;
		max-width: 7rem;
		aspect-ratio: 1;
	}

	.solutions-tile-title {
		font-weight: 500;
		padding: 0 1rem;
	}

	.solution-unit-overlay {
		padding: 0 1rem;
		font-size: 1em;
		line-height: 1.5;
		color: #aaa;
	}

	@media screen and (max-width: 900px) {
		.solutions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media screen and (max-width: 500px) {
		.solutions {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}
</style>
