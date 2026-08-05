<script lang="ts">
    export let data;

    $: draftArticles = data?.draftArticles || [];
    $: draftResearch = data?.draftResearch || [];

    $: allDrafts = [
        ...draftArticles.map(a => ({ ...a, type: 'Article' })),
        ...draftResearch.map(r => ({ ...r, type: 'Research' }))
    ].sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());

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
    <title>Drafts | Doctor Dashboard</title>
</svelte:head>

<div class="header">
    <div>
        <h1>My Drafts</h1>
        <p>Manage and continue working on your unpublished work.</p>
    </div>
</div>

<div class="card-container">
    {#if allDrafts.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📁</div>
            <h4>No saved drafts</h4>
            <p>You don't have any ongoing draft articles or research papers.</p>
        </div>
    {:else}
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Last Modified</th>
                        <th class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each allDrafts as item}
                        <tr>
                            <td>
                                <span class="item-title">{item.title || 'Untitled Draft'}</span>
                            </td>
                            <td>
                                <span class="type-badge" class:research-type={item.type === 'Research'}>
                                    {item.type}
                                </span>
                            </td>
                            <td class="date-cell">{formatDate(item.updated_at || item.created_at)}</td>
                            <td class="text-right">
                                <a 
                                    href={item.type === 'Research' ? `/cms/research/edit/${item.id}` : `/cms/articles/edit/${item.id}`} 
                                    class="btn-edit"
                                >
                                    Continue Editing
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

    .date-cell {
        font-size: 13px;
        color: #64748b;
    }

    .text-right {
        text-align: right;
    }

    .btn-edit {
        background: #f1f5f9;
        color: #0f172a;
        padding: 6px 14px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
        transition: background 0.2s;
    }

    .btn-edit:hover {
        background: #e2e8f0;
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