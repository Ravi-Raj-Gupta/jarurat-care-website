<script lang="ts">
	export let title: string = '';
	export let subtitle: string = '';
	export let center = false;
	export let className = '';
</script>

<h2 class={`section-heading ${center ? 'center' : ''} ${className || ''}`}>{title}</h2>
<p class={`section-subheading  ${center ? 'center' : ''}`}>{subtitle}</p>

<style>
	.section-heading {
		margin: 0 auto;
		padding: 1.4rem;
		padding-bottom: 0;
		font-size: 2.3em;
		font-weight: 400;
		margin-top: 5rem;
		max-width: var(--max-width);
	}

	.section-subheading {
		color: #575757;
		margin: auto;
		padding: 0 1.4rem;
		font-size: 1.6em;
		margin: 0 auto;
		max-width: var(--max-width);
	}

	.center {
		text-align: center;
	}

	@media screen and (max-width: 768px) {
		.section-heading {
			font-size: 1.9em;
		}

		.section-subheading {
			font-size: 1.4em;
		}
	}
</style>
