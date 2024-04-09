<script>
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	import Heading from './homepage/heading.svelte';

	import { teamMembers } from '$lib/data/team';
	import MomImage from '../../assets/images/photos/mom.webp';
</script>

<Heading title="What Drives us to Serve Better" />

<div class="mom-container">
	<div id="mom" class="mom">
		<Splide
			aria-label="Story of Rekha Joshi"
			hasTrack={false}
			options={{
				arrows: true,
				pagination: false,
				autoplay: true,
				type: 'loop'
			}}
		>
			<SplideTrack>
				<SplideSlide class="flex items-center">
					<p class="our-story">
						Our story commenced in December 2023, marking a pivotal moment in our lives. It was then
						that we faced the profound loss of our cherished mother, who bravely battled
						Cholangiocarcinoma, a form of bile duct cancer, for seven months. Motivated by our
						experiences and driven by the same determination any devoted son or daughter would
						possess, we established the Jarurat Care Foundation with the intent to rectify these
						systemic shortcomings and improve the healthcare landscape for others..
					</p>
				</SplideSlide>

				<SplideSlide>
					<div class="mom-image-wrapper">
						<div class="mom-text-image">
							<img alt="Mom" src={MomImage} class="mom-image" />

							<p class="mom-text">
								Rekha’s last trip before she started her battle with Cholangiocarcinoma and
								succumbed on 25th December 2023
							</p>
						</div>
					</div>
				</SplideSlide>
			</SplideTrack>

			<div class="splide__arrows splide__arrows--ltr mom-slide-arrows">
				<button
					class="splide__arrow splide__arrow--prev"
					type="button"
					aria-label="Previous slide"
					aria-controls="splide01-track"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 40 40"
						width="40"
						height="40"
						focusable="false"
					>
						<path
							d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
						></path>
					</svg>
				</button>
				<button
					class="splide__arrow splide__arrow--next"
					type="button"
					aria-label="Next slide"
					aria-controls="splide01-track"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 40 40"
						width="40"
						height="40"
						focusable="false"
					>
						<path
							d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
						></path>
					</svg>
				</button>
			</div>
		</Splide>
	</div>
</div>

<div class="team-container">
	<section id="about" class="about">
		{#each teamMembers as member}
			<div class="about-card">
				<div class="about-image-container">
					<img alt={member.name} src={member.image} class="about-image" />
				</div>
				<strong class="about-name">{member.name}</strong>
				<span class="about-description">{member.role}</span>
			</div>
		{/each}
	</section>
</div>

<style>
	.mom-container {
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.mom {
		margin: 2rem auto 4rem auto;
		padding: 1.5rem;
		max-width: 110rem;
		width: 100%;
	}

	.mom .splide__progress {
		background-color: lightgray;
		display: none;
	}

	.mom-slide-arrows {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.mom .splide__progress__bar {
		background-color: var(--ghost-accent-color);
	}

	.mom-slide-arrows .splide__arrow {
		position: static;
		top: unset;
		left: unset;
		right: unset;
		bottom: unset;
	}

	.mom-image-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		padding: 1rem 0;
		align-items: center;
		justify-content: center;
		background-color: #f1f8fa;
		border-radius: 1rem;
	}

	.mom-text-image {
		position: relative;
	}

	.mom .mom-text {
		font-size: 1.1em;
		line-height: 1.1;
		padding: 2rem;
		bottom: 2rem;
		left: 2rem;
		right: 2rem;
		background: white;
		position: absolute;
		z-index: 10;
		text-align: center;
		/*text-transform: uppercase;*/
	}

	.mom .mom-image {
		max-width: 40rem;
		width: 100%;
		filter: grayscale(100);
		transition: 0.3s ease filter;
	}

	.mom .mom-image:hover {
		filter: grayscale(0);
	}

	.mom-slide-progress {
		width: 100%;
		max-width: 10rem;
		margin: 0 auto;
		margin-top: 2rem;
	}

	.our-story {
		padding: 1rem;
		font-size: 1.3em;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f1f8fa;
		border-radius: 1rem;
		text-align: justify;
	}

	@media screen and (max-width: 800px) {
		.our-story {
			text-align: left;
		}
	}

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

		.mom .mom-text {
			font-size: 1em;
			line-height: 1.1;
			padding: 1rem;
			bottom: 1rem;
			left: 1rem;
			right: 1rem;
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
		filter: grayscale(100);
	}

	.about .about-name {
		font-size: 1.3em;
		font-weight: 400;
		line-height: 1.1;
		margin-top: 1.3rem;
	}

	.about .about-description {
		opacity: 0.8;
	}
</style>
