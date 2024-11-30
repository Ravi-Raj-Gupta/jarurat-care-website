<script>
    import AboutHeroSection from "$lib/components/about-hero-section.svelte";
    import AboutUsSection from "$lib/components/about-us-section.svelte";
    import CaregivingSolution from "$lib/components/caregiving-solution.svelte";
    import Nav from '$lib/components/nav.svelte';
    import NewletterCollabrate from "$lib/components/newletter-collabrate.svelte";
    import OurJounery from "$lib/components/our-jounery.svelte";
    import OurValue from "$lib/components/our-value.svelte";
    import OurVision from "$lib/components/our-vision.svelte";
</script>

<div class="min-h-screen bg-[#F8FCFF]">
    <!-- Navigation -->
    <Nav/>

    <!-- Hero Section with overflow hidden to prevent scrollbars -->
    <div class="w-full overflow-hidden"> <!-- Prevent scroll for HeroSection -->
        <AboutHeroSection />
    </div>

    <!-- Other sections -->
    <div class="px-4 md:px-0">
        <AboutUsSection />
    </div>
    <div class="px-4 md:px-0">
        <OurVision />
    </div>
    <div class="px-4 md:px-0">
        <OurValue />
    </div>
    <div class="px-4 md:px-0">
        <OurJounery />
    </div>
    <!-- Uncomment when needed -->
    <!-- <OurCommunity /> -->
    <div class="px-4 md:px-0">
        <CaregivingSolution />
    </div>
    <div class="px-4 md:px-0">
        <NewletterCollabrate />
    </div>
</div>
