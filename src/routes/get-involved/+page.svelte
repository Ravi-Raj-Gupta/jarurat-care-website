<script>
    import Nav from '$lib/components/nav.svelte';
    import Hero from '$lib/components/get-involved/hero.svelte';
    import Help from '$lib/components/get-involved/help.svelte';
    import MoreInfo from '$lib/components/get-involved/moreInfo.svelte';
    import Community from '$lib/components/get-involved/community.svelte';
    import ContentSeperator from '$lib/components/get-involved/contentSeperator.svelte';

    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
    };
</script>

<Nav {isMenuOpen} on:toggleMenu={toggleMenu} />
<Hero {isMenuOpen} />
<Help />
<MoreInfo />
<Community />
<ContentSeperator />