<script>
    import CMSContentTab from '$lib/components/dashboard/CMSContentTab.svelte';
    import { invalidateAll } from '$app/navigation';
    export let data;
    const reloadData = async () => { await invalidateAll(); };
</script>

<svelte:head>
    <title>Manage FAQs - Admin</title>
</svelte:head>

<div class="content-wrapper">
    <h1>Manage FAQs</h1>
    <p class="subtitle">Create, edit, and publish FAQs.</p>
    
    <CMSContentTab cmsContents={data.cmsContents} reloadCallback={reloadData} filterType="faq" />
</div>

<style>
.content-wrapper {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
h1 {
    margin: 0;
    color: #1e293b;
    font-size: 28px;
}
.subtitle {
    color: #64748b;
    margin-top: 8px;
    margin-bottom: 24px;
}
</style>
