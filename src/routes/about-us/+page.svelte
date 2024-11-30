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



<Nav/>

<div class="w-full min-h-screen bg-[#F8FCFF] flex flex-col">

    <div class="flex-1 flex flex-col">
        <div class="md:mb-36 mb-16">
            <AboutHeroSection />
        </div>
        <div class="px-4 md:px-0">
            <AboutUsSection />
        </div>
        <div class="px-4 md:px-0">
            <OurVision />
        </div>
        <div class="px-4 md:px-0">
            <OurValue />
        </div>
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
