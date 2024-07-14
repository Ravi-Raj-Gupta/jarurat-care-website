<script lang="ts">
  import { onMount } from 'svelte';

  let NavigationComponent: typeof import('$lib/components/navigation.svelte').default;

  onMount(async () => {
    const module = await import('$lib/components/navigation.svelte');
    NavigationComponent = module.default;
  });
</script>

<svelte:head>
  <title>Terms and Conditions - Jarurat Care Foundation</title>
  <meta charset="utf-8" />

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-QN1XGRGT6K"></script>

  <meta name="description" content="Jaisi Jarurat, Vaisi Care" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="canonical" href="https://jarurat.care/" />
  <meta name="referrer" content="no-referrer-when-downgrade" />

  <meta property="og:site_name" content="Jarurat Care Foundation" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Jarurat Care Foundation" />
  <meta property="og:description" content="Jaisi Jarurat, Vaisi Care" />
  <meta property="og:url" content="https://jarurat.care/" />
  <meta property="article:publisher" content="https://jarurat.care" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Jarurat Care Foundation" />
  <meta name="twitter:description" content="Jaisi Jarurat, Vaisi Care" />
  <meta name="twitter:url" content="https://jarurat.care/" />
</svelte:head>

{#if NavigationComponent}
  <NavigationComponent />
{:else}
  <!-- Optionally, you can show a loading indicator or fallback content here -->
  <div>Loading Navigation...</div>
{/if}

<div class="prose max-w-[80ch] mx-auto py-[4rem]">
  <h1>Terms and Conditions</h1>

  <h3>1. Introduction</h3>
  <p>These Terms and Conditions govern your use of our cancer charity donation platform. By making a donation, you agree to these terms, which form a binding legal agreement.</p>

  <h3>2. Donations</h3>
  <p>Donations are voluntary contributions made without expectation of return or compensation. You confirm that all donations are made freely and are not contingent on specific outcomes or benefits.</p>

  <h3>3. Use of Funds</h3>
  <p>Funds received will be used to support cancer patients, research, and awareness programs as outlined on our platform. We reserve the right to allocate funds as needed to fulfill our charitable mission.</p>

  <h3>4. Refund Policy</h3>
  <p>Donations are generally non-refundable. Exceptions may be considered on a case-by-case basis at our discretion.</p>

  <h3>5. Privacy</h3>
  <p>Your privacy is important to us. Personal information collected during the donation process will be used solely for processing your donation and will not be shared with third parties without your consent.</p>

  <h3>6. Tax Deductions</h3>
  <p>Donations may be tax-deductible. We advise consulting with a tax professional to understand your eligibility for tax deductions based on your jurisdiction.</p>

  <h3>7. Acknowledgments</h3>
  <p>We may acknowledge donors by name in our communications unless anonymity is requested. Please inform us if you wish your donation to remain anonymous.</p>

  <h3>8. Limitation of Liability</h3>
  <p>Our liability for any issues arising from your use of the platform or your donation is limited to the amount of your donation.</p>

  <h3>9. Changes to Terms</h3>
  <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes indicates your acceptance of the new terms.</p>

  <h3>10. Governing Law</h3>
  <p>These terms are governed by the laws of the jurisdiction where our charity is registered. Any disputes will be resolved under these laws.</p>

  <h3>11. Contact Us</h3>
  <p>For any questions or concerns regarding these terms, please contact us through the provided channels on our platform. By donating through our platform, you acknowledge that you have read, understood, and agreed to these terms and conditions.</p>
</div>