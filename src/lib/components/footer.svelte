<script>
	import LogoSquare from '$lib/svg/logo-square.svelte';
	import Button from './ui/button.svelte';
	import Icon from '@iconify/svelte';
	import instagramIcon from '@iconify-icons/mdi/instagram';
	import twitterIcon from '@iconify-icons/mdi/twitter';
	import facebookIcon from '@iconify-icons/mdi/facebook';

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<footer class="bg-[#D6ECFF] text-[#0D2561]">
	<div class="max-w-7xl mx-auto px-6 sm:px-8 py-12">

		<!-- Top Row: Logo + CTA Buttons -->
		<div class="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
			<div class="flex items-center gap-4">
				<div class="bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
					<LogoSquare class="w-14 h-14 text-[#1E3A8A]" />
				</div>
				<div class="flex flex-col leading-tight">
					<span class="font-bold text-2xl">Jarurat Care Foundation</span>
					<small class="text-[#475569]">Jaisi Jarurat, Vaisi Care</small>
				</div>
			</div>

			<div class="flex gap-3">
				<a href="/donate">
					<Button class="bg-[#1E40AF] text-white hover:bg-[#1D3A7A] px-4 py-2">Donate</Button>
				</a>
				<a href="mailto:Priyanka.joshi@jarurat.care?subject=Seek Support">
					<Button class="bg-white border border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white px-4 py-2">Seek Support</Button>
				</a>
			</div>
		</div>

		<!-- Divider -->
		<div class="my-8 border-t border-[#E6EEF9]"></div>

		<!-- Link Columns + Social -->
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-12">
			<div>
				<p class="font-semibold mb-3">Quick Links</p>
				<ul class="space-y-2 text-sm">
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/">Home</a></li>
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/">Mission</a></li>
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/get-involved">Volunteer</a></li>
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/">Locate Hospitals</a></li>
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/">Terms &amp; Conditions</a></li>
				</ul>
			</div>

			<div>
				<p class="font-semibold mb-3">Resources</p>
				<ul class="space-y-2 text-sm">
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/about-us">About Us</a></li>
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/get-involved">Get involved</a></li>
					
					<li><a class="hover:text-[#1E40AF] transition-colors" href="/contact-us">Contact Us</a></li>
				</ul>
			</div>

			<div>
				<p class="font-semibold mb-3">Connect with us</p>
				<div class="flex items-center gap-4">
					<a href="https://instagram.com/jarurat.care" target="_blank" rel="noopener" aria-label="Instagram">
						<Icon icon={instagramIcon} class="w-6 h-6 text-[#1E40AF] hover:text-[#1D3A7A]" />
					</a>
					<a href="https://twitter.com/jarurat_care" target="_blank" rel="noopener" aria-label="Twitter">
						<Icon icon={twitterIcon} class="w-6 h-6 text-[#1E40AF] hover:text-[#1D3A7A]" />
					</a>
					<a href="https://facebook.com/share/1DpQCLVLdM/" target="_blank" rel="noopener" aria-label="Facebook">
						<Icon icon={facebookIcon} class="w-6 h-6 text-[#1E40AF] hover:text-[#1D3A7A]" />
					</a>
				</div>
			</div>

			<div>
				<p class="font-semibold mb-3">Contact</p>
				<div class="text-sm text-[#475569] space-y-1">
					<div>Email: <a href="mailto:Priyanka.joshi@jarurat.care" class="hover:text-[#1E40AF] transition-colors">Priyanka.joshi@jarurat.care</a></div>
					<div>Phone: <a href="tel:+91 99402 63931" class="hover:text-[#1E40AF] transition-colors">+91 99402 63931</a></div>
				</div>
			</div>
		</div>

		<!-- Divider -->
		<div class="my-8 border-t border-[#E6EEF9]"></div>

		<!-- Bottom Row -->
		<div class="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-[#475569]">
			<div class="flex gap-4">
				<a class="hover:text-[#1E40AF] transition-colors" href="/privacy-policy">Privacy Policy</a>
				<a class="hover:text-[#1E40AF] transition-colors" href="/terms-of-service">Terms of Service</a>
			</div>

			<p class="text-[#0D2561]">&copy; 2026 Jarurat Care LLC. All rights reserved</p>

			<button
				on:click={scrollToTop}
				class="text-[#1E40AF] font-semibold hover:underline focus:outline-none"
				aria-label="Back to top"
			>
				↑ Back to Top
			</button>
		</div>
	</div>
</footer>