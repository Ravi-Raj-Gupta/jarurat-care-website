<script lang="ts">
    export let data;

    $: pendingArticles = data?.pendingArticles || [];
    $: pendingResearch = data?.pendingResearch || [];

    $: reviewQueue = [
        ...pendingArticles.map(a => ({ ...a, type: 'Article' })),
        ...pendingResearch.map(r => ({ ...r, type: 'Research' }))
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    function formatDate(dateStr: string) {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
</script>

<svelte:head>
    <title>Pending Reviews | Doctor Dashboard</title>
</svelte:head>

<div class="header">
    <div>
        <h1>Pending Reviews</h1>
        <p>Review medical accuracy for peer submissions needing verification.</p>
    </div>
</div>

<div class="card-container">
    {#if reviewQueue.length === 0}
        <div class="empty-state">
            <div class="empty-icon">✅</div>
            <h4>All caught up!</h4>
            <p>There are no pending submissions awaiting peer review right now.</p>
        </div>
    {:else}
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Author</th>
                        <th>Submitted Date</th>
                        <th class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each reviewQueue as item}
                        <tr>
                            <td>
                                <span class="item-title">{item.title || 'Untitled Submission'}</span>
                            </td>
                            <td>
                                <span class="type-badge" class:research-type={item.type === 'Research'}>
                                    {item.type}
                                </span>
                            </td>
                            <td class="author-cell">{item.author_name || 'Dr. Peer'}</td>
                            <td class="date-cell">{formatDate(item.created_at)}</td>
                            <td class="text-right">
                                <a 
                                    href={item.type === 'Research' ? `/cms/review/research/${item.id}` : `/cms/review/article/${item.id}`} 
                                    class="btn-review"
                                >
                                    Review Submission
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .header {
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

    .card-container {
        background: #ffffff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        padding: 24px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    th, td {
        padding: 14px 16px;
        border-bottom: 1px solid #e2e8f0;
    }

    th {
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .item-title {
        font-weight: 600;
        color: #0f172a;
        font-size: 14px;
    }

    .type-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        background: #e0e7ff;
        color: #4f46e5;
    }

    .type-badge.research-type {
        background: #f3e8ff;
        color: #7c3aed;
    }

    .author-cell {
        font-size: 13px;
        color: #334155;
        font-weight: 500;
    }

    .date-cell {
        font-size: 13px;
        color: #64748b;
    }

    .text-right {
        text-align: right;
    }

    .btn-review {
        background: #4f46e5;
        color: #ffffff;
        padding: 6px 14px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
    }

    .empty-state {
        padding: 48px 20px;
        text-align: center;
    }

    .empty-icon {
        font-size: 36px;
        margin-bottom: 12px;
    }

    .empty-state h4 {
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 6px;
    }

    .empty-state p {
        color: #64748b;
        margin: 0;
        font-size: 14px;
    }
</style>