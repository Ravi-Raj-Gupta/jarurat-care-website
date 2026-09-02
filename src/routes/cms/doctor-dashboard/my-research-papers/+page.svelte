<script lang="ts">
    export let data;

    $: researchPapers = data?.researchPapers || [];

    function formatDate(dateStr: string) {
        if (!dateStr) return 'N/A';
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
    <title>My Research Papers | Doctor Dashboard</title>
</svelte:head>

<div class="header">
    <div>
        <h1>My Research Papers</h1>
        <p>Overview of your authored medical research publications and submissions.</p>
    </div>
    <a href="/cms/research/create" class="btn-primary">+ New Research Paper</a>
</div>

<div class="card-container">
    {#if researchPapers.length === 0}
        <div class="empty-state">
            <div class="empty-icon">🔬</div>
            <h4>No research papers yet</h4>
            <p>Publish or submit your clinical research work to appear here.</p>
        </div>
    {:else}
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Submitted Date</th>
                        <th class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each researchPapers as paper}
                        <tr>
                            <td>
                                <span class="item-title">{paper.title || 'Untitled Paper'}</span>
                                {#if paper.status === 'changes_requested' && paper.admin_feedback}
                                    <div style="margin-top: 8px; padding: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b; font-size: 13px; font-weight: normal; line-height: 1.4;">
                                        <strong style="display:block; margin-bottom:4px;">Reviewer Feedback:</strong>
                                        {paper.admin_feedback}
                                        <br>
                                        <a href="/cms/research/edit/{paper.id}" style="color: #b91c1c; font-weight: 600; text-decoration: underline; margin-top: 6px; display: inline-block;">Click here to edit</a>
                                    </div>
                                {/if}
                            </td>
                            <td>
                                <span class="status-badge {
                                    paper.status === 'approved' ? 'status-approved' : 
                                    paper.status === 'changes_requested' ? 'status-changes_requested' : 
                                    'status-' + (paper.status || 'published')
                                }">
                                    {
                                        paper.status === 'approved' ? 'Approved' :
                                        paper.status === 'changes_requested' ? 'Changes Requested' :
                                        statusLabel(paper.status)
                                    }
                                </span>
                            </td>
                            <td class="date-cell">{formatDate(paper.created_at)}</td>
                            <td class="text-right">
                                {#if paper.status === 'draft' || paper.status === 'changes_requested'}
                                    <a href={`/cms/research/edit/${paper.id}`} class="btn-view" style="background: #e0e7ff; color: #4338ca;">
                                        Edit Paper
                                    </a>
                                {:else}
                                    <a href={`/cms/research/view/${paper.id}`} class="btn-view">
                                        View Details
                                    </a>
                                {/if}
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

    .btn-primary {
        background: #4f46e5;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
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

    .status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
    }

    .status-draft { background: #f1f5f9; color: #475569; }
    .status-under_review { background: #fef3c7; color: #b45309; }
    .status-published { background: #dcfce7; color: #15803d; }
    .status-approved { background: #dcfce7; color: #15803d; }
    .status-changes_requested { background: #fee2e2; color: #991b1b; }
    .status-rejected { background: #fee2e2; color: #991b1b; }

    .date-cell {
        font-size: 13px;
        color: #64748b;
    }

    .text-right {
        text-align: right;
    }

    .btn-view {
        background: #f1f5f9;
        color: #0f172a;
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