<script lang="ts">
	import { onMount } from 'svelte';
	import Hamburger from './svg/hamburger.svelte';

	let navListener: EventListenerOrEventListenerObject | undefined;

	function navHandler() {
		const navItems = document.querySelector('.nav-items');
		const menuHandler = document.querySelector('.hamburger-menu-handler');

		if (navItems && menuHandler) {
			navListener = () => {
				navItems.classList.toggle('open');
			};
		}

		navListener && menuHandler?.removeEventListener('click', navListener);
		navListener && menuHandler?.addEventListener('click', navListener);
	}

	function closeNav() {
		const navItems = document.querySelector('.nav-items');
		navItems?.classList.remove('open');
	}

	onMount(() => {
		const dropdownHandles = document.querySelectorAll('.has-dropdown');

		dropdownHandles.forEach((dropdown) => {
			dropdown.addEventListener('click', () => {
				const ulElem = document.querySelector(`.has-dropdown ~ ul`);

				if (ulElem) {
					ulElem.classList.toggle('open');
				}
			});
		});

		navHandler();
	});

	const navItems = [
		{ href: '/', label: 'Home', children: undefined },
		// { href: '/#vision', label: 'Vision', children: undefined },
		{ href: '/#about', label: 'About', children: undefined },
		// {
		// 	href: undefined,
		// 	label: 'Donate',
		// 	children: [
		// 		{ href: '/#donate', label: 'Time', children: undefined },
		// 		{ href: '/#donate', label: 'SKills', children: undefined },
		// 		{ href: '/#donate', label: 'Trust', children: undefined },
		// 		{ href: '/#donate', label: 'Money', children: undefined }
		// 	]
		// },
		{ href: '/#advisory-board', label: 'Advisory Board', children: undefined },
		{ href: '/hope', label: 'Talk to Hope', children: undefined },
		{
			href: 'https://wa.me/919940263931?text=Hello',
			label: 'WhatsApp',
			children: undefined,
			className: `nav-wa-link`
		}
	];
</script>

<div class="navigation-wrapper">
	<header id="navigation" class="container">
		<nav class="navigation">
			<a style="font-weight: 500;font-size: 1.1em;" href="/">Jarurat Care Foundation</a>

			<ul class="nav-items">
				{#each navItems as { href, label, children, className }}
					{#if children}
						<li>
							<span class="has-dropdown">{label}</span>
							<ul>
								{#each children as child}
									<li><a href={child.href} on:click={closeNav}>{child.label}</a></li>
								{/each}
							</ul>
						</li>
					{:else}
						<li><a {href} class={className} on:click={closeNav}>{label}</a></li>
					{/if}
				{/each}
			</ul>

			<button class="hamburger-menu-handler">
				<Hamburger />
			</button>
		</nav>
	</header>
</div>

<style>
	.navigation-wrapper {
		background-color: #f1f8fa;
	}

	.navigation {
		padding: 1rem 6.3rem;
		max-width: 140rem !important;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	.navigation .is-title {
		font-weight: 400;
	}

	.nav-items {
		display: flex;
		align-items: center;
		padding: 0;
		gap: 3rem;
	}

	.nav-items li {
		list-style-type: none;
		position: relative;
	}

	.nav-items li a {
		cursor: pointer;
		white-space: nowrap;
	}

	.nav-items li ul {
		margin: 0;
		padding: 0.7rem 0;
		z-index: 10;
		position: absolute;
		top: 3.5rem;
		right: 0;
		background-color: #fff;
		min-width: 12rem;
		border-radius: 1rem;
		transform: translateY(40%);
		opacity: 0;
		visibility: collapse;
		transition: 0.3s ease-out all;
		box-shadow:
			0.2px 0.9px 3.6px rgba(0, 0, 0, 0.017),
			0.6px 2.5px 10px rgba(0, 0, 0, 0.025),
			1.5px 6px 24.1px rgba(0, 0, 0, 0.033),
			5px 20px 80px rgba(0, 0, 0, 0.05);
	}

	.nav-items :global(li ul.open) {
		transform: translateY(0);
		opacity: 1;
		visibility: visible;
	}

	.nav-items li ul li {
		list-style-type: none;
		display: block;
		padding: 0.5rem 1.3rem;
	}

	.hamburger-menu-handler {
		display: none;
	}

	@media screen and (max-width: 900px) {
		.navigation {
			padding: 1rem;
		}

		.hamburger-menu-handler {
			z-index: 110;
			position: fixed;
			top: 1rem;
			right: 1rem;
			display: inline-block;
			cursor: pointer;
			background-color: transparent;
			border: none;
		}

		.hamburger-menu-handler svg {
			width: 1.4em;
			aspect-ratio: 1;
		}

		.nav-items {
			gap: 2rem;
			align-items: flex-start;
			flex-direction: column;
			position: fixed;
			/* border-top-left-radius: 1.5rem;
			border-bottom-left-radius: 1.5rem; */
			z-index: 100;
			top: 0;
			bottom: 0;
			right: 0;
			background-color: white;
			padding: 2rem;
			/* max-width: 20rem; */
			width: 100%;
			box-shadow:
				0px 0px 3.6px rgba(0, 0, 0, 0.031),
				0px 0px 10px rgba(0, 0, 0, 0.045),
				0px 0px 24.1px rgba(0, 0, 0, 0.059),
				0px 0px 80px rgba(0, 0, 0, 0.09);
			transform: translateX(100%);
			transition: 0.3s ease-out all;
		}

		.nav-items:global(.open) {
			transform: translateX(0);
		}

		.nav-items li ul {
			position: static;
			border-radius: 0;
			transform: translateY(0);
			opacity: 1;
			visibility: visible;
			max-height: 0;
			padding: 0;
			overflow: hidden;
			transition: 0.3s ease-out all;
			box-shadow: unset;
		}

		.nav-items :global(li ul.open) {
			max-height: 10rem;
		}
	}

	.nav-wa-link {
		gap: 0.5rem;
		color: #1f8d1c;
		border: 1px solid #1f8d1c;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 0.9em;
		font-weight: 500;
		display: flex;
		align-items: center;
	}
</style>
