<script lang="ts">
    export let data;

    $: articles = data.articles || [];

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
    <title>My Articles | Doctor Dashboard</title>
</svelte:head>

<div class="page-header">
    <div>
        <h1>My Articles</h1>
        <p>Manage all your written regular articles.</p>
    </div>
    <a href="/cms/articles/create" class="btn-primary">+ Write an Article</a>
</div>

<div class="card-container">
    {#if articles.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h4>No articles found</h4>
            <p>You haven't authored any articles yet.</p>
        </div>
    {:else}
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>TITLE</th>
                        <th>CATEGORY</th>
                        <th>STATUS</th>
                        <th>VIEWS</th>
                        <th>DATE</th>
                        <th class="text-right">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {#each articles as article}
                        <tr>
                            <td class="font-medium">
								{article.title || 'Untitled Article'}
								{#if article.status === 'under_review' && article.review_feedback && article.review_feedback !== 'APPROVED_BY_REVIEWER'}
									<div style="margin-top: 8px; padding: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b; font-size: 13px; font-weight: normal; line-height: 1.4;">
										<strong style="display:block; margin-bottom:4px;">Reviewer Feedback:</strong>
										{article.review_feedback}
										<br>
										<a href="/cms/articles/edit/{article.id}" style="color: #b91c1c; font-weight: 600; text-decoration: underline; margin-top: 6px; display: inline-block;">Click here to edit</a>
									</div>
								{/if}
							</td>
                            <td>
                                <span class="category-badge">{article.category || 'General Health'}</span>
                            </td>
                            <td>
                                <span class="status-badge {
                                    article.status === 'under_review' && article.review_feedback === 'APPROVED_BY_REVIEWER' ? 'status-approved' : 
                                    article.status === 'under_review' && article.review_feedback ? 'status-changes_requested' : 
                                    'status-' + (article.status || 'published')
                                }">
                                    {
                                        article.status === 'under_review' && article.review_feedback === 'APPROVED_BY_REVIEWER' ? 'Approved' :
                                        article.status === 'under_review' && article.review_feedback ? 'Changes Requested' :
                                        article.status ? article.status.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Published'
                                    }
                                </span>
                            </td>
                            <td class="text-muted">{article.views || 0}</td>
                            <td class="text-muted">{formatDate(article.created_at)}</td>
                            <td class="text-right">
                                {#if article.status === 'draft' || (article.status === 'under_review' && article.review_feedback && article.review_feedback !== 'APPROVED_BY_REVIEWER')}
                                    <a href={`/cms/articles/edit/${article.id}`} class="btn-view" style="background: #e0e7ff; color: #4338ca;">
                                        Edit Article
                                    </a>
                                {:else}
                                    <a href={`/cms/articles/view/${article.id}`} class="btn-view">
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
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .page-header h1 {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 4px;
    }

    .page-header p {
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
        transition: background 0.2s;
    }

    .btn-primary:hover {
        background: #4338ca;
    }

    .card-container {
        background: #ffffff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        padding: 24px;
    }

    .table-responsive {
        width: 100%;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    th {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #64748b;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
    }

    td {
        padding: 16px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #1e293b;
    }

    .font-medium {
        font-weight: 600;
    }

    .text-muted {
        color: #64748b;
    }

    .category-badge {
        font-size: 12px;
        font-weight: 500;
        padding: 4px 10px;
        border-radius: 6px;
        background: #f1f5f9;
        color: #475569;
    }

    .status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        display: inline-block;
    }

    .status-draft { background: #f1f5f9; color: #475569; }
    .status-under_review { background: #fef3c7; color: #b45309; }
    .status-approved { background: #dcfce7; color: #15803d; }
    .status-published { background: #dbeafe; color: #1e40af; }
    .status-changes_requested { background: #fee2e2; color: #991b1b; }
    .status-rejected { background: #fee2e2; color: #991b1b; }

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
        transition: background 0.2s;
        display: inline-block;
    }

    .btn-view:hover {
        background: #e2e8f0;
    }
</style>