<script lang="ts">
    export let data;

    $: profile = data.profile;
    $: articles = data.articles || [];
    $: researchPapers = data.researchPapers || [];
    $: pendingArticles = data.pendingArticles || [];
    $: pendingResearch = data.pendingResearch || [];

    $: isReviewer = profile?.is_reviewer === true;
    $: totalPendingReviews = pendingArticles.length + pendingResearch.length;

    $: recentSubmissions = [
        ...articles.map(a => ({ ...a, type: 'Article' })),
        ...researchPapers.map(r => ({ ...r, type: 'Research' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function statusLabel(status: string) {
        switch (status) {
            case 'under_review': return 'Under Review';
            case 'published': return 'Published';
            case 'rejected': return 'Rejected';
            default: return 'Draft';
        }
    }
</script>

<svelte:head>
    <title>Doctor Dashboard | Jarurat Care</title>
</svelte:head>

<div class="header">
    <div>
        <h1>Welcome back, {profile?.full_name || 'Dr. Ananya Verma'}</h1>
        <p>Here is an overview of your publications, drafts, and review tasks.</p>
    </div>
    <div class="header-actions">
        <a href="/cms/research/create" class="btn-secondary">+ Write Research</a>
        <a href="/cms/articles/create" class="btn-primary">+ Create Article</a>
    </div>
</div>

<div class="stats-grid">
    <a href="/cms/doctor-dashboard/articles" class="stat-card clickable">
        <div class="stat-icon purple">📝</div>
        <div class="stat-info">
            <span class="stat-value">{articles.length}</span>
            <span class="stat-label">My Articles</span>
        </div>
    </a>

    <a href="/cms/doctor-dashboard/my-research-papers" class="stat-card clickable">
        <div class="stat-icon indigo">🔬</div>
        <div class="stat-info">
            <span class="stat-value">{researchPapers.length}</span>
            <span class="stat-label">My Research Papers</span>
        </div>
    </a>

    <a href="/cms/doctor-dashboard/drafts" class="stat-card clickable">
        <div class="stat-icon gray">📁</div>
        <div class="stat-info">
            <span class="stat-value">Drafts</span>
            <span class="stat-label">View My Drafts</span>
        </div>
    </a>

    {#if isReviewer}
        <a href="/cms/doctor-dashboard/review" class="stat-card clickable">
            <div class="stat-icon amber">⏳</div>
            <div class="stat-info">
                <span class="stat-value">{totalPendingReviews}</span>
                <span class="stat-label">Pending Reviews</span>
            </div>
        </a>
    {/if}
</div>

<div class="card-container">
    <div class="card-header">
        <h2>Recent Submissions</h2>
        <a href="/cms/doctor-dashboard/articles" class="view-all">View All Articles &rarr;</a>
    </div>

    {#if recentSubmissions.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📄</div>
            <h4>No recent activity</h4>
            <p>You haven't authored any articles or research papers yet.</p>
        </div>
    {:else}
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {#each recentSubmissions as item}
                        <tr>
                            <td><span class="item-title">{item.title || 'Untitled'}</span></td>
                            <td><span class="type-badge" class:research-type={item.type === 'Research'}>{item.type}</span></td>
                            <td><span class="status-badge status-{item.status}">{statusLabel(item.status)}</span></td>
                            <td class="date-cell">{formatDate(item.created_at)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .header h1 {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 4px;
    }

    .header p {
        color: #64748b;
        margin: 0;
        font-size: 14px;
    }

    .header-actions {
        display: flex;
        gap: 12px;
    }

    .btn-primary {
        background: #4f46e5;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
    }

    .btn-secondary {
        background: white;
        color: #0f172a;
        border: 1px solid #e2e8f0;
        padding: 10px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
    }

    .stat-card {
        background: #ffffff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-2px);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }

    .stat-icon.purple { background: #e0e7ff; }
    .stat-icon.indigo { background: #f3e8ff; }
    .stat-icon.amber { background: #fef3c7; }
    .stat-icon.gray { background: #f1f5f9; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 22px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 13px; color: #64748b; }

    .card-container {
        background: #ffffff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        padding: 24px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .card-header h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
    .view-all { font-size: 13px; font-weight: 600; color: #4f46e5; text-decoration: none; }

    table { width: 100%; border-collapse: collapse; text-align: left; }
    th, td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }

    .type-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: #e0e7ff; color: #4f46e5; }
    .type-badge.research-type { background: #f3e8ff; color: #7c3aed; }

    .status-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
    .status-draft { background: #f1f5f9; color: #475569; }
    .status-under_review { background: #fef3c7; color: #b45309; }
    .status-published { background: #dcfce7; color: #15803d; }
    .status-rejected { background: #fee2e2; color: #991b1b; }

    .empty-state { padding: 48px 20px; text-align: center; }
    .empty-icon { font-size: 36px; margin-bottom: 12px; }
    .empty-state h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .empty-state p { color: #64748b; margin: 0; font-size: 14px; }
</style>