<script>
    import { page } from '$app/stores';
</script>

<script context="module">
    const menu = [
        {
            title: "Dashboard",
            href: "/cms/admin-dashboard"
        },
        {
            title: "Blogs",
            href: "/cms/admin-dashboard/blogs"
        },
        {
            title: "News",
            href: "/cms/admin-dashboard/news"
        },
        {
            title: "FAQs",
            href: "/cms/admin-dashboard/faqs"
        },
        {
            title: "Events",
            href: "/cms/admin-dashboard/events"
        },
        {
            title: "Users",
            href: "/cms/admin-dashboard/users"
        },
        {
            title: "Settings",
            href: "/cms/admin-dashboard/settings"
        }
    ];
</script>

<aside class="sidebar">

    <div class="logo">
        <h2>CMS Admin</h2>
    </div>

    <nav>

        <p class="section">MAIN</p>

        {#each menu.slice(0,1) as item}
            <a
                href={item.href}
                class:active={$page.url.pathname === item.href}>
                {item.title}
            </a>
        {/each}

        <p class="section">CMS CONTENT</p>

        {#each menu.slice(1,5) as item}
            <a
                href={item.href}
                class:active={$page.url.pathname === item.href}>
                {item.title}
            </a>
        {/each}

        <p class="section">SYSTEM</p>

        {#each menu.slice(5) as item}
            <a
                href={item.href}
                class:active={$page.url.pathname === item.href}>
                {item.title}
            </a>
        {/each}

    </nav>

</aside>

<style>
.sidebar{
    width:270px;
    background:white;
    border-right:1px solid #e5e7eb;
    display:flex;
    flex-direction:column;
}

.logo{
    padding:28px 24px;
    border-bottom:1px solid #e5e7eb;
}

.logo h2{
    margin:0;
    color:#2563eb;
}

nav{
    padding:20px 14px;
}

.section{
    font-size:12px;
    color:#94a3b8;
    font-weight:700;
    margin:20px 10px 8px;
    text-transform:uppercase;
    letter-spacing:.08em;
}

a{
    display:block;
    text-decoration:none;
    color:#334155;
    padding:12px 16px;
    border-radius:10px;
    margin-bottom:6px;
    transition:.2s;
}

a:hover{
    background:#eff6ff;
    color:#2563eb;
}

.active{
    background:#2563eb;
    color:white;
    font-weight:600;
}
</style>