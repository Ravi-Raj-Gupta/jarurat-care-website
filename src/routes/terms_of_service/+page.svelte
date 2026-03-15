<script>
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';

	const lastUpdated = 'March 15, 2026';
</script>

<Nav />

<section class="bg-[#F8FBFF] min-h-screen text-[#0D2561]">
	<div class="max-w-4xl mx-auto px-6 sm:px-8 py-16">

		<div class="bg-white shadow-md rounded-xl p-8 sm:p-12">

			<h1 class="text-3xl font-bold mb-2">Terms of Service</h1>
			<p class="text-sm text-slate-500 mb-8">
				Last updated: {lastUpdated}
			</p>

			<div class="prose prose-slate max-w-none">

				<h2>Scope</h2>
				<p>
					These Terms of Service describe the rules for accessing and using the
					online services and digital resources made available by Jarurat Care
					Foundation via jarurat.care. They complement the Terms & Conditions.
				</p>

				<h2>Accounts & Access</h2>
				<p>
					Certain services may require registration. You are responsible for
					maintaining the confidentiality of any account credentials and for all
					activities under your account.
				</p>

				<h2>Donations & Payments</h2>
				<p>
					Donations processed via the website are final unless otherwise allowed
					by our donation policy. Payment processing is carried out by our
					payment partners; please review their terms for chargebacks and refunds.
				</p>

				<h2>Intellectual Property</h2>
				<p>
					All content, logos and materials published on the site are the property
					of Jarurat Care Foundation or its licensors. You may not use them
					without prior written permission.
				</p>

				<h2>Reporting Abuse</h2>
				<p>
					If you see content that violates these Terms or is abusive, please
					report it to:
					<a
						href="mailto:Priyanka.joshi@jarurat.care"
						class="text-[#1E40AF] hover:underline"
					>
						Priyanka.joshi@jarurat.care
					</a>.
				</p>

				<h2>Termination</h2>
				<p>
					We reserve the right to suspend or terminate access to the site for
					anyone who breaches these Terms or engages in harmful conduct.
				</p>

				<h2>Contact</h2>
				<p>
					General enquiries:
					<a
						href="mailto:Priyanka.joshi@jarurat.care"
						class="text-[#1E40AF] hover:underline"
					>
						Priyanka.joshi@jarurat.care
					</a>
				</p>

			</div>

		</div>

	</div>
</section>

