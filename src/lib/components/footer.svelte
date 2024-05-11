<script>
	import IconInstagram from '$lib/components/svg/instagram.svelte';
	import IconLinkedIn from '$lib/components/svg/linkedin.svelte';
</script>

<footer>
	<div class="footer-title">&copy; Jarurat Care Foundation, 2024</div>

	<div class="site-footer">
		<nav>
			<ul>
				<!-- <li><a href="#">Home</a></li> -->
				<!-- <li><a href="#">About</a></li> -->
				<li><a href="/#locate-hospitals">Locate Hospitals</a></li>
				<!-- <li><a href="#">Advisory Board</a></li> -->
				<li><a href="/terms-and-conditions/">Terms and Conditions</a></li>
			</ul>
		</nav>

		<nav>
			<ul>
				<!-- <li><a href="/liver-cancer-checklist">Liver Cancer Checklist</a></li> -->
				<!-- <li><a href="#">Breast Cancer Checklist</a></li>
				<li><a href="#">Lung Cancer Checklist</a></li>
				<li><a href="#">Pancreatic Cancer Checklist</a></li>
				<li><a href="#">Brain Cancer Checklist</a></li>
				<li><a href="#">Blood Cancer Checklist</a></li>
				<li><a href="#">Mouth Cancer Checklist</a></li>
				<li><a href="#">Bone Cancer Checklist</a></li> -->
			</ul>
		</nav>

		<nav>
			<ul class="social-icons">
				<li class="nav-instagram">
					<a href="https://www.instagram.com/jarurat.care">
						<IconInstagram />
						Instagram
					</a>
				</li>

				<li class="nav-linkedin">
					<a href="https://www.linkedin.com/company/jaruratcare/">
						<IconLinkedIn />
						LinkedIn
					</a>
				</li>

				<li class="nav-google-translate" style="margin-top: 2rem">
					<div id="google-translate-element"></div>
				</li>
			</ul>
		</nav>
	</div>
</footer>

<style>
	.nav-google-translate,
	.nav-google-translate * {
		text-decoration: none !important;
	}

	.goog-te-gadget-icon {
		display: none;
	}

	.goog-te-gadget-simple {
		background-color: #ffffff05 !important;
		border: 0 !important;
		font-size: 10pt;
		font-weight: 800;
		display: inline-block;
		padding: 1rem !important;
		cursor: pointer;
		zoom: 1;
	}

	.goog-te-gadget-simple span {
		color: #fff !important;
	}

	.goog-te-gadget-simple span a {
		display: flex;
	}

	footer {
		background-color: #282a35;
	}

	.footer-title {
		margin: 3rem auto;
		display: flex;
		max-width: var(--max-width);
		font-size: 1.1em;
		color: white;
		font-weight: bold;
		padding: 2rem;

		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.site-footer {
		font-size: 0.9em;
		padding: 1rem 2rem;
		display: grid;
		max-width: var(--max-width);
		margin: auto;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media screen and (max-width: 800px) {
		.site-footer {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}

	.site-footer nav ul {
		padding: 0;
	}

	.site-footer nav ul li {
		list-style-type: none;
		margin: 0.7rem 0;
		color: #efefef;
	}

	.site-footer nav ul li a {
		color: #efefef;
	}

	.site-footer nav ul li a:hover {
		text-decoration: underline;
		color: #efefef;
	}

	.social-icons li a {
		gap: 0.6rem;
		display: flex;
		align-items: center;
	}

	.social-icons li a svg {
		width: 1em;
		fill: white;
	}
</style>
