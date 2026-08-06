<script lang="ts">
    import { ClipboardCheck, CheckCircle, Clock } from 'lucide-svelte';

    export let data;

    $: reviewQueue = (data?.pendingArticles || []).map(a => ({ ...a, type: 'Article' })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

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
    <title>Review Articles | Reviewer Portal</title>
</svelte:head>

<div class="review-page">
    <div class="header">
        <div class="header-content">
            <div class="title-row">
                <h1>Pending Articles Verification</h1>
                <span class="pill-badge bg-amber-pill">Reviewer Workspace</span>
            </div>
            <p>Review general health and medical articles submitted by peer doctors for clinical accuracy before publication.</p>
        </div>
        <div class="stats-badge">
            <ClipboardCheck size={20} class="text-amber" />
            <span><strong>{reviewQueue.length}</strong> Pending {reviewQueue.length === 1 ? 'Article' : 'Articles'}</span>
        </div>
    </div>

    <div class="card-container">
        {#if reviewQueue.length === 0}
            <div class="empty-state">
                <div class="empty-icon-box">
                    <CheckCircle size={44} class="text-green" />
                </div>
                <h4>All verification tasks complete!</h4>
                <p>You are completely caught up! There are no medical articles awaiting your peer review sign-off right now.</p>
            </div>
        {:else}
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Document Title</th>
                            <th>Category</th>
                            <th>Author Name</th>
                            <th>Submitted Date</th>
                            <th>Status</th>
                            <th class="text-right">Verification Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each reviewQueue as item}
                            <tr>
                                <td>
                                    <strong class="item-title">{item.title || 'Untitled Submission'}</strong>
                                </td>
                                <td>
                                    <span class="type-badge">{item.type}</span>
                                </td>
                                <td class="author-cell">{item.author_name || 'Dr. Peer'}</td>
                                <td class="date-cell">
                                    <Clock size={13} class="inline-icon" />
                                    {formatDate(item.created_at)}
                                </td>
                                <td>
                                    <span class="status-badge status-pending">Needs Review</span>
                                </td>
                                <td class="text-right">
                                    <a href={`/cms/review/article/${item.id}`} class="btn-review">
                                        <ClipboardCheck size={14} /> Review Article
                                    </a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }

    .review-page { display: flex; flex-direction: column; gap: 24px; max-width: 1500px; margin: 0 auto; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
    .header h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0; }
    .header p { color: #64748B; margin: 0; font-size: 14px; }
    .pill-badge { padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .bg-amber-pill { background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }

    .stats-badge { background: #FFFBEB; border: 1px solid #FDE68A; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 10px; color: #92400E; font-size: 14px; }
    .text-amber { color: #D97706; }
    .text-green { color: #16A34A; }

    .card-container { background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { padding: 14px 24px; color: #64748B; font-weight: 600; font-size: 12px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
    td { padding: 16px 24px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; white-space: nowrap; }
    .item-title { font-size: 14px; font-weight: 700; color: #0F172A; }
    .type-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #EFF6FF; color: #2563EB; border: 1px solid #DBEAFE; white-space: nowrap; }
    .author-cell { font-size: 13px; color: #334155; font-weight: 600; }
    .date-cell { font-size: 12px; color: #64748B; display: flex; align-items: center; gap: 6px; }
    .inline-icon { color: #94A3B8; }
    .status-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
    .status-pending { background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }
    .text-right { text-align: right; }

    .btn-review { background: #2563EB; color: #FFFFFF; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.15); }
    .btn-review:hover { background: #1D4ED8; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25); }

    .empty-state { padding: 64px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .empty-icon-box { width: 64px; height: 64px; border-radius: 50%; background: #F0FDF4; border: 1px solid #DCFCE7; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .empty-state h4 { font-size: 17px; font-weight: 700; color: #0F172A; margin: 0 0 8px; }
    .empty-state p { color: #64748B; margin: 0; font-size: 14px; max-width: 480px; }
</style>
