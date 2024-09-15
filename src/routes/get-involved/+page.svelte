<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Nav from '$lib/components/get-involved/nav.svelte';
    
    onMount(() => {
        goto('/get-involved');
    }); 
</script>

<Nav/>

