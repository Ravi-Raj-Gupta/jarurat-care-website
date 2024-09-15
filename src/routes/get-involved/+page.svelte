<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Nav from '$lib/components/get-involved/nav.svelte';
    import Hero from '$lib/components/get-involved/hero.svelte';
    import Help from '$lib/components/get-involved/help.svelte';
    import MoreInfo from '$lib/components/get-involved/moreInfo.svelte';
    
    onMount(() => {
        goto('/get-involved');
    }); 
</script>

<Nav/>
<Hero/>
<Help/>
<MoreInfo/>
