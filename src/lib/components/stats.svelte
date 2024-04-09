<script lang="ts">
	import Cancer from '$lib/components/svg/cancer.svelte';
	import { onMount } from 'svelte';
	import Heading from '$lib/components/homepage/heading.svelte';

	onMount(() => {
		const statsTiles = document.querySelectorAll('.stats-tile-data');
		// @ts-ignore
		const statsTilesValues = Array.from(statsTiles).map((tile) => parseInt(tile.dataset.value, 10));

		function formatNumber(number: number) {
			return Intl.NumberFormat('en-IN').format(number);
		}

		// Animate the stats tiles
		statsTiles.forEach((tile, index) => {
			const value = statsTilesValues[index];
			const increment = value / 100;

			let current = 0;
			const interval = setInterval(() => {
				current += increment;
				tile.textContent = formatNumber(Math.floor(current));

				if (current >= value) {
					clearInterval(interval);
					tile.textContent = formatNumber(value);
				}
			}, 50);
		});
	});

	const stats = [
		{ value: 1461427, label: 'Active Cases' },
		{ value: 910000, label: 'Deaths' },
		{ value: 551427, label: 'Recovered Cases' }
	];
</script>

<div class="stats container">
	<Heading
		center
		title="Gallbladder Cancer Statistics in India"
		subtitle="The latest statistics on cancer in India"
	/>

	<div class="stats-container">
		{#each stats as stat}
			<div class="stats-tile">
				<div class="stats-tile-icon">
					<Cancer fill="#92c7cf" />
				</div>
				<div class="stats-tile-data" data-value={stat.value}>0</div>
				<div class="stats-tile-label">{stat.label}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.stats {
		margin: 3rem auto;
		padding: 0 1.5rem;
	}

	.stats-container {
		margin-top: 5rem;
		gap: 4.5rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: center;
	}

	.stats-tile-icon {
		width: 100%;
		max-width: 4rem;
	}

	.stats-tile-icon svg {
		fill: #92c7cf;
	}

	.stats-tile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.stats-tile-data {
		color: #000;
		font-size: 1.6rem;
		font-weight: 600;
	}

	.stats-tile-label {
		color: #aaa;
		text-transform: uppercase;
		font-size: 1rem;
		letter-spacing: 0.1rem;
		font-weight: 700;
	}
</style>
