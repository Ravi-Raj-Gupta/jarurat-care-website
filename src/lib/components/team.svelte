<script>
	import '@splidejs/svelte-splide/css';
	import Heading from './homepage/heading.svelte';

	import { teamMembers } from '$lib/data/team';
</script>

<Heading title="What Drives us to Serve Better" />

<div class="team-container">
	<section id="about" class="about">
		{#each teamMembers as member}
			<div class="about-card">
				<div class="about-image-container">
					<img alt={member.name} src={member.image} class="about-image" />
				</div>
				<strong class="about-name">{member.name}</strong>
				<span class="about-description text-zinc-600 mt-1">{member.role}</span>
			</div>
		{/each}
	</section>
</div>

<style>
	.team-container {
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.about {
		display: grid;
		margin: 0 auto;
		padding: 1.3rem;
		max-width: 100rem;
		column-gap: 2rem;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	@media screen and (max-width: 600px) {
		.about {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.about .about-card {
		width: 100%;
		margin: 2rem 0;
		display: flex;
		text-align: center;
		flex-direction: column;
	}

	.about .about-image {
		width: 100%;
		margin: 0 auto;
		max-width: 25rem;
		border-radius: 0.3rem;
		aspect-ratio: 1/1;
		object-fit: cover;
	}

	.about .about-name {
		font-size: 1.1em;
		font-weight: 400;
		line-height: 1.1;
		margin-top: 1.3rem;
	}

	.about .about-description {
		opacity: 0.8;
		font-size: 0.9em;
	}
</style>
