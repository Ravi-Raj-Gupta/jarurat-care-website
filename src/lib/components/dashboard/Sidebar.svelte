<script lang="ts">
    import { page } from '$app/stores';

    export let isReviewer: boolean = false;

    $: currentPath = $page.url.pathname;
</script>

<aside class="sidebar">
    <div class="brand">
        <div class="logo-icon">J</div>
        <h2>Jarurat Care</h2>
    </div>

    <nav class="nav-groups">
        <div class="group-title">MAIN</div>
        <a 
            href="/cms/doctor-dashboard" 
            class="nav-item" 
            class:active={currentPath === '/cms/doctor-dashboard'}
        >
            Dashboard
        </a>

        <div class="group-title">CONTENT MANAGEMENT</div>
        <a 
            href="/cms/doctor-dashboard/articles" 
            class="nav-item" 
            class:active={currentPath.startsWith('/cms/doctor-dashboard/articles')}
        >
            My Articles
        </a>
        <a 
            href="/cms/doctor-dashboard/my-research-papers" 
            class="nav-item" 
            class:active={currentPath.startsWith('/cms/doctor-dashboard/my-research-papers')}
        >
            Research Papers
        </a>
        <a 
            href="/cms/doctor-dashboard/drafts" 
            class="nav-item" 
            class:active={currentPath.startsWith('/cms/doctor-dashboard/drafts')}
        >
            Drafts
        </a>

        {#if isReviewer}
            <div class="group-title">VERIFICATION & REVIEW</div>
            <a 
                href="/cms/doctor-dashboard/review" 
                class="nav-item" 
                class:active={currentPath.startsWith('/cms/doctor-dashboard/review')}
            >
                Pending Reviews
            </a>
        {/if}

        <div class="group-title">PREFERENCES</div>
        <a 
            href="/cms/doctor-dashboard/settings" 
            class="nav-item" 
            class:active={currentPath.startsWith('/cms/doctor-dashboard/settings')}
        >
            Settings
        </a>
    </nav>
</aside>

<style>
    .sidebar {
        width: 260px;
        background: #0f172a;
        color: #94a3b8;
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        gap: 32px;
        box-sizing: border-box;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #ffffff;
        padding: 0 8px;
    }

    .logo-icon {
        width: 32px;
        height: 32px;
        background: #4f46e5;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #ffffff;
    }

    .brand h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
    }

    .nav-groups {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .group-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #475569;
        margin: 16px 8px 4px 8px;
    }

    .nav-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 8px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .nav-item:hover {
        background: #1e293b;
        color: #f8fafc;
    }

    .nav-item.active {
        background: #4f46e5;
        color: #ffffff;
    }
</style>