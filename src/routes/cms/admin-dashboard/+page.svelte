<script>
    import StatCard from '$lib/components/admin/StatCard.svelte';
    import QuickActionCard from '$lib/components/admin/QuickActionCard.svelte';
</script>

<svelte:head>
    <title>Admin Dashboard</title>
</svelte:head>

<div class="dashboard">

    <!-- Welcome -->
    <section class="welcome">
        <h1>Welcome back, Admin 👋</h1>
        <p>
            Manage your website content from one central place.
        </p>
    </section>

    <!-- Statistics -->
    <section class="stats">

        <StatCard
            title="Blogs"
            value={0}
            icon="📝"
        />

        <StatCard
            title="News"
            value={0}
            icon="📰"
        />

        <StatCard
            title="FAQs"
            value={0}
            icon="❓"
        />

        <StatCard
            title="Events"
            value={0}
            icon="📅"
        />

    </section>

    <!-- Quick Actions -->
    <section class="actions">

        <h2>Quick Actions</h2>

        <div class="action-grid">

            <QuickActionCard
                title="Create Blog"
                description="Write a new blog post."
                href="/cms/admin-dashboard/blogs"
            />

            <QuickActionCard
                title="Create News"
                description="Publish a news article."
                href="/cms/admin-dashboard/news"
            />

            <QuickActionCard
                title="Create FAQ"
                description="Add frequently asked questions."
                href="/cms/admin-dashboard/faqs"
            />

            <QuickActionCard
                title="Create Event"
                description="Publish an upcoming event."
                href="/cms/admin-dashboard/events"
            />

        </div>

    </section>

    <!-- Recent Activity -->
    <section class="recent">

        <h2>Recent Activity</h2>

        <div class="empty-card">
            <p>No recent activity.</p>
        </div>

    </section>

</div>

<style>
.dashboard{
    display:flex;
    flex-direction:column;
    gap:32px;
}

.welcome h1{
    margin:0;
    font-size:32px;
    color:#1e293b;
}

.welcome p{
    margin-top:8px;
    color:#64748b;
}

.stats{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:20px;
}

.actions h2,
.recent h2{
    margin-bottom:18px;
    color:#1e293b;
}

.action-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
    gap:20px;
}

.empty-card{
    background:white;
    border-radius:16px;
    padding:30px;
    border:1px solid #eef2f7;
}

.empty-card p{
    margin:0;
    color:#94a3b8;
}
</style>