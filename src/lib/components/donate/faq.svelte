<script>
	import { ChevronDown } from 'lucide-svelte';

	const faqs = [
		{
			q: 'How will my donation be used?',
			a: '100% of non-administrative donations directly fund patient screening, treatment, essential medicines, and family support programs.'
		},
		{
			q: 'Will I receive a receipt and tax certificate?',
			a: 'Yes, an automated digital tax receipt will be sent to your registered email immediately after your payment is processed.'
		},
		{
			q: 'What payment methods are accepted?',
			a: 'We accept Credit/Debit cards, Net Banking, UPI, and major digital wallets.'
		},
		{
			q: 'Can I volunteer instead of donating?',
			a: 'Yes! Visit our Get Involved section to sign up for community outreach and awareness programs.'
		},
		{
			q: 'Can I make a recurring monthly donation?',
			a: 'Yes, you can choose the recurring monthly contribution option during checkout.'
		}
	];

	let openIndex = null;

	function toggle(index) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<div class="py-16 bg-[#F8FAFC]">
	<div class="max-w-[36rem] mx-auto px-4 sm:px-6">
		<h2 class="text-2xl sm:text-3xl font-bold text-center text-[#2D3142] mb-8 tracking-tight">
			FAQ
		</h2>

		<div class="space-y-3">
			{#each faqs as item, index}
				<div class="bg-[#EEF4F8] border border-[#D8E3ED] rounded-2xl overflow-hidden transition-all duration-200">
					<button
						type="button"
						on:click={() => toggle(index)}
						class="w-full px-5 py-4 text-left flex justify-between items-center text-sm sm:text-base font-semibold text-[#546641] hover:opacity-80 transition-opacity"
					>
						<span>{item.q}</span>
						<ChevronDown
							class={`w-4 h-4 text-[#546641] transition-transform duration-200 shrink-0 ml-3 ${
								openIndex === index ? 'rotate-180' : ''
							}`}
						/>
					</button>

					{#if openIndex === index}
						<div class="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#445434] leading-relaxed border-t border-[#D8E3ED]/60">
							{item.a}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>