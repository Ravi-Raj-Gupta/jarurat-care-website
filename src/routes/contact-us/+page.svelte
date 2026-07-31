<script>
  import ContactNumber from "$lib/components/contact-number.svelte";
  import FormInput from "$lib/components/form-input.svelte";
  import Nav from "$lib/components/nav.svelte";
  import ContactUs from "$lib/svg/contact-us.svelte"; // Import your SVG component
  import NewsFooter from "$lib/components/news-footer.svelte";
  import RoleSelector from "$lib/components/ui/RoleSelector.svelte";
  import Gallery from "$lib/components/contact-us/gallery.svelte";
  import ContactForm from "$lib/components/contact-us/contact-form.svelte";

  // TODO: Add analytics tracking for form submissions later
</script>

<style>
  input:focus, textarea:focus {
    background-color: #D3F2FC; /* Change background color when focused */
    border: 2px solid #0155BD; /* Change border color when focused */
    outline: none; /* Remove default focus outline */
  }
  input[type="checkbox"]:checked {
    background-color: #0155BD; /* Change background color when checked */
    border: 2px solid #0155BD; /* Change border color when checked */
  }
</style>

<Nav />
<!-- Background Image Section -->
<ContactForm />
<Gallery />
<NewsFooter />
