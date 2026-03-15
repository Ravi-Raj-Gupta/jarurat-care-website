<script>
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';

	const lastUpdated = 'March 15, 2026';
</script>

<Nav />

<section class="bg-[#F8FBFF] min-h-screen text-[#0D2561]">
	<div class="max-w-4xl mx-auto px-6 sm:px-8 py-16">

		<div class="bg-white shadow-md rounded-xl p-8 sm:p-12">

			<h1 class="text-3xl font-bold mb-2">Terms & Conditions</h1>
			<p class="text-sm text-slate-500 mb-8">
				Last updated: {lastUpdated}
			</p>

			<div class="prose prose-slate max-w-none">

				<h2>1. Introduction</h2>
				<p>
					These Terms & Conditions govern your use of the website and services
					provided by Jarurat Care Foundation. By accessing or using our site
					you agree to these terms. If you do not agree, please do not use our services.
				</p>

				<h2>2. About the Service</h2>
				<p>
					Jarurat Care Foundation provides information, community support and
					access to resources for cancer patients, caregivers and medical
					professionals. The content on this site is educational and supportive
					in nature and is not a substitute for professional medical advice.
				</p>

				<h2>3. Use of Content</h2>
				<ul>
					<li>The content provided on this site is for informational purposes only.</li>
					<li>Users must not rely solely on the site for medical decisions.</li>
					<li>Reproduction or redistribution of site content requires prior written permission.</li>
				</ul>

				<h2>4. User Conduct</h2>
				<p>
					You agree not to post unlawful, abusive, libellous, or infringing
					material. Jarurat Care reserves the right to remove content that
					violates our policies or is harmful to the community.
				</p>

				<h2>5. Limitation of Liability</h2>
				<p>
					To the maximum extent permitted by law, Jarurat Care Foundation will not
					be liable for any indirect, incidental or consequential damages arising
					from the use of the website.
				</p>

				<h2>6. External Links</h2>
				<p>
					Our site may contain links to third-party resources. We are not
					responsible for the content or practices of these external sites.
				</p>

				<h2>7. Changes to Terms</h2>
				<p>
					We may modify these Terms at any time. Significant changes will be
					notified on this page with an updated "Last updated" date.
				</p>

				<h2>8. Governing Law</h2>
				<p>
					These Terms shall be governed by the laws of India. Any disputes will
					be subject to the exclusive jurisdiction of the competent courts in India.
				</p>

				<h2>9. Contact</h2>
				<p>
					Questions about these Terms can be sent to:
					<a
						href="mailto:Priyanka.joshi@jarurat.care"
						class="text-[#1E40AF] hover:underline"
					>
						Priyanka.joshi@jarurat.care
					</a>.
				</p>

			</div>

		</div>

	</div>
</section>
