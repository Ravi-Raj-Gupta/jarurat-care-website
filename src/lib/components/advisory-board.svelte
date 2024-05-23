<script>
	import Heading from './homepage/heading.svelte';
	import { advisors } from '$lib/data/advisory-board';
</script>

<div class="advisory-wrapper pt-[3rem]" id="advisory-board">
	<Heading title="Meet Our Super Heroes" className="!mt-0" />

	<div class="advisory-board" style="padding: 1rem">
		{#each advisors as advisor}
			{#if !advisor.isHidden}
				<a
					href={advisor.link}
					target="_blank"
					rel="noreferrer"
					class="advisory-card border border-zinc-100 rounded-md relative aspect-[9/13] border border-red-500 overflow-hidden"
				>
					<img
						src={advisor.image}
						alt={advisor.name + '- Jarurat Care Foundation'}
						class="relative block w-full mx-auto object-cover h-full"
					/>
					<div class="absolute bottom-0 left-0 right-0 z-10 flex flex-col">
						<p class="grow" />
						<div class="bg-white/70 flex flex-col p-4 backdrop-blur-md advisory-information">
							<h3 class="">{advisor.name}</h3>
							<h4 class="text-[0.9em] text-zinc-500">{advisor.subtitle}</h4>
							<div
								class="max-h-0 overflow-hidden transition-all description leading-[1.3] text-[0.9em] advisory-desc"
							>
								<p class="py-1 text-zinc-600">{advisor.description}</p>
							</div>
						</div>
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>

<style>
	.advisory-wrapper {
		background-color: #f1f8fa;
	}

	.advisory-board {
		gap: 2rem;
		display: grid;
		margin: 0 auto;
		max-width: var(--max-width);
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	@media screen and (max-width: 900px) {
		.advisory-board {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media screen and (max-width: 600px) {
		.advisory-board {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.advisory-card {
		/*padding: 0.5rem; */
		background-color: white;
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
	}

	.advisory-card .advisory-information > *:not(.advisory-desc) {
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
		transition: 0.3s ease all;
	}

	.advisory-card:hover .description {
		max-height: 6rem;
		transition-duration: 0.5s;
	}

	.advisory-card:hover .advisory-information > * {
		white-space: wrap;
	}
</style>
