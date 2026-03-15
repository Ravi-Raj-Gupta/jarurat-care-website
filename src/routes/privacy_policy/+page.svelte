<script>
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';

	const lastUpdated = 'March 15, 2026';
</script>

<Nav />

<section class="bg-[#F8FBFF] min-h-screen text-[#0D2561]">
	<div class="max-w-4xl mx-auto px-6 sm:px-8 py-16">

		<div class="bg-white shadow-md rounded-xl p-8 sm:p-12">

			<h1 class="text-3xl font-bold mb-2">Privacy Policy</h1>
			<p class="text-sm text-slate-500 mb-8">
				Last updated: {lastUpdated}
			</p>

			<div class="prose prose-slate max-w-none">

				<h2>Overview</h2>
				<p>
					Jarurat Care Foundation is committed to protecting the privacy of
					individuals who use our website and services. This Privacy Policy
					explains how we collect, use, disclose and protect personal data.
				</p>

				<h2>Legal framework</h2>
				<p>
					We process digital personal data in accordance with the Digital Personal
					Data Protection Act and applicable rules. This Policy describes the
					privacy practices we follow to meet those obligations.
				</p>

				<h2>What data we collect</h2>
				<ul>
					<li><strong>Contact data:</strong> name, email, phone (when submitted via forms).</li>
					<li><strong>Support requests:</strong> messages or case notes you share.</li>
					<li><strong>Technical data:</strong> cookies, IP address, browser type for analytics.</li>
				</ul>

				<h2>How we use personal data</h2>
				<p>We use data for purposes including:</p>
				<ul>
					<li>Providing and improving support services and communications.</li>
					<li>Responding to requests, donations, or volunteer applications.</li>
					<li>Complying with legal obligations and protecting users.</li>
				</ul>

				<h2>Lawful basis & Consent</h2>
				<p>
					Where required, we obtain explicit consent before processing personal
					data for specified purposes. Consent may be withdrawn at any time by
					contacting us.
				</p>

				<h2>Sharing & Third Parties</h2>
				<p>
					We do not sell personal data. Data may be shared with trusted service
					providers (hosting or payment processors) strictly to fulfil requested
					services and they must protect your information.
				</p>

				<h2>Retention</h2>
				<p>
					We retain personal data only for as long as necessary to fulfil the
					purposes described in this policy or to meet legal obligations.
				</p>

				<h2>Your Rights</h2>
				<p>
					Subject to applicable law, you may request access, correction,
					deletion, or restriction of your personal data.
				</p>

				<h2>Security</h2>
				<p>
					We implement technical and organisational safeguards to protect
					personal data, though no system can be completely secure.
				</p>

				<h2>Children</h2>
				<p>
					We do not knowingly collect information from children under 18
					without parental consent.
				</p>

				<h2>Contact</h2>
				<p>
					For privacy questions or requests contact:
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

