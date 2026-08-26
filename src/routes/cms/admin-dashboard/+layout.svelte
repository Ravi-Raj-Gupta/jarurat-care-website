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
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
		font-family: 'DM Sans', sans-serif;
	}

	.admin-layout {
		display: flex;
		min-height: 100vh;
		background: #f8fafc;
		color: #0f172a;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.page-content {
		flex: 1;
		padding: 28px 32px;
		overflow-y: auto;
	}
</style>
<!-- Trigger Vite Reload -->
