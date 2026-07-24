<script>
    import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
    import AdminTopbar from '$lib/components/admin/AdminTopbar.svelte';
</script>

<div class="admin-layout">

    <AdminSidebar />

    <div class="main-content">

        <AdminTopbar />

        <main class="page-content">
            <slot />
        </main>

    </div>

</div>

<style>
.admin-layout{
    display:flex;
    min-height:100vh;
    background:#f7f9fc;
}

.main-content{
    flex:1;
    display:flex;
    flex-direction:column;
}

.page-content{
    flex:1;
    padding:24px;
    overflow:auto;
}
</style>