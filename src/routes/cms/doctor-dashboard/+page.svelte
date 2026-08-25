<script lang="ts">
    import { 
        FileText, BookOpen, Folder, ClipboardCheck, ShieldCheck,
        ArrowRight, CheckCircle, Clock, Edit3, PlusCircle, ExternalLink,
        Eye, Bookmark
    } from 'lucide-svelte';

    export let data;

    $: profile = data.profile;
    $: articles = data.articles || [];
    $: researchPapers = data.researchPapers || [];
    $: pendingArticles = data.pendingArticles || [];
    $: pendingResearch = data.pendingResearch || [];
    $: stats = data.stats || {};

    $: isReviewer = profile?.is_reviewer === true;
    $: totalPendingReviews = pendingArticles.length + pendingResearch.length;

    $: recentSubmissions = [
        ...articles.map(a => ({ ...a, type: 'Article' })),
        ...researchPapers.map(r => ({ ...r, type: 'Research' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    $: articleReviewQueue = pendingArticles.map(a => ({ ...a, type: 'Article' })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).slice(0, 4);
    $: researchReviewQueue = pendingResearch.map(r => ({ ...r, type: 'Research' })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).slice(0, 4);

    function formatDate(dateStr: string) {
        if (!dateStr) return 'Recent';
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
    <title>{isReviewer ? 'Reviewer & Doctor Dashboard' : 'Doctor Dashboard'} | Jarurat Care</title>
</svelte:head>

<div class="dashboard-container">
    <!-- Header -->
    <div class="header">
        <div>
            <h1>Welcome back, {profile?.full_name || 'Dr. Specialist'}! 👋</h1>
            <p>
                {isReviewer 
                    ? 'Manage your authored articles, research drafts, and pending peer review verifications.' 
                    : 'Here is an overview of your medical publications, research papers, and drafts.'}
            </p>
        </div>
        <div class="header-actions">
            <a href="/cms/research/create" class="btn-secondary"><PlusCircle size={16} /> Write Research</a>
            <a href="/cms/articles/create" class="btn-primary"><PlusCircle size={16} /> Create Article</a>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
        <a href="/cms/doctor-dashboard/articles" class="stat-card clickable">
            <div class="stat-icon blue-bg"><FileText size={22} class="text-blue" /></div>
            <div class="stat-info">
                <span class="stat-value">{articles.length}</span>
                <span class="stat-label">My Articles</span>
            </div>
            <ArrowRight size={16} class="ml-auto text-slate-300 arrow-hover" />
        </a>

        <a href="/cms/doctor-dashboard/my-research-papers" class="stat-card clickable">
            <div class="stat-icon purple-bg"><BookOpen size={22} class="text-purple" /></div>
            <div class="stat-info">
                <span class="stat-value">{researchPapers.length}</span>
                <span class="stat-label">My Research Papers</span>
            </div>
            <ArrowRight size={16} class="ml-auto text-slate-300 arrow-hover" />
        </a>

        <a href="/cms/doctor-dashboard/drafts" class="stat-card clickable">
            <div class="stat-icon green-bg"><Folder size={22} class="text-green" /></div>
            <div class="stat-info">
                <span class="stat-value">{stats.draft || 0}</span>
                <span class="stat-label">Saved Drafts</span>
            </div>
            <ArrowRight size={16} class="ml-auto text-slate-300 arrow-hover" />
        </a>

        <div class="stat-card">
			<div class="stat-icon orange-bg"><Eye size={22} class="text-orange" /></div>
			<div class="stat-info">
				<span class="stat-value">{stats.views || 0}</span>
				<span class="stat-label">Total Views</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon red-bg"><Bookmark size={22} class="text-red" /></div>
			<div class="stat-info">
				<span class="stat-value">{stats.bookmarks || 0}</span>
				<span class="stat-label">Total Bookmarks</span>
			</div>
		</div>

        <!-- REVIEWER ONLY STAT CARDS (SPLIT INTO TWO) -->
        {#if isReviewer}
            <a href="/cms/doctor-dashboard/review-articles" class="stat-card clickable reviewer-card">
                <div class="stat-icon amber-bg"><ClipboardCheck size={22} class="text-amber" /></div>
                <div class="stat-info">
                    <div class="val-wrap">
                        <span class="stat-value">{pendingArticles.length}</span>
                        {#if pendingArticles.length > 0}
                            <span class="badge-pulse">Review Articles</span>
                        {/if}
                    </div>
                    <span class="stat-label font-medium text-amber-dark">Pending Articles to Review</span>
                </div>
                <ArrowRight size={16} class="ml-auto text-amber arrow-hover" />
            </a>

            <a href="/cms/doctor-dashboard/review-research" class="stat-card clickable reviewer-card">
                <div class="stat-icon purple-bg"><ShieldCheck size={22} class="text-purple" /></div>
                <div class="stat-info">
                    <div class="val-wrap">
                        <span class="stat-value">{pendingResearch.length}</span>
                        {#if pendingResearch.length > 0}
                            <span class="badge-pulse purple-pulse">Review Research</span>
                        {/if}
                    </div>
                    <span class="stat-label font-medium text-purple-dark">Pending Research to Review</span>
                </div>
                <ArrowRight size={16} class="ml-auto text-purple arrow-hover" />
            </a>
        {/if}
    </div>

    <!-- REVIEWER ONLY QUEUE SECTIONS (SEPARATED) -->
    {#if isReviewer}
        <div class="reviewer-split-section">
            <!-- Pending Articles Queue -->
            <div class="card-container reviewer-queue-box">
                <div class="card-header">
                    <div class="header-left">
                        <h2>Pending Articles for Review</h2>
                        <span class="pill-badge bg-amber-pill">Reviewer Option</span>
                    </div>
                    <a href="/cms/doctor-dashboard/review-articles" class="view-all">View All Article Reviews &rarr;</a>
                </div>

                {#if articleReviewQueue.length === 0}
                    <div class="empty-state compact-empty">
                        <CheckCircle size={32} class="text-green mx-auto mb-2" />
                        <h4>No Pending Articles!</h4>
                        <p>All regular medical articles have been peer reviewed.</p>
                    </div>
                {:else}
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Article Title</th>
                                    <th>Author</th>
                                    <th>Submitted Date</th>
                                    <th class="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each articleReviewQueue as item}
                                    <tr>
                                        <td><strong class="item-title">{item.title || 'Untitled Article'}</strong></td>
                                        <td class="author-text">{item.author_name || 'Dr. Peer'}</td>
                                        <td class="date-cell">{formatDate(item.created_at)}</td>
                                        <td class="text-right">
                                            <a href={`/cms/review/article/${item.id}`} class="btn-review-now">
                                                <ClipboardCheck size={14} /> Review Now
                                            </a>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>

            <!-- Pending Research Papers Queue -->
            <div class="card-container reviewer-queue-box purple-border">
                <div class="card-header">
                    <div class="header-left">
                        <h2>Pending Research Papers for Review</h2>
                        <span class="pill-badge bg-purple-pill">Reviewer Option</span>
                    </div>
                    <a href="/cms/doctor-dashboard/review-research" class="view-all text-purple">View All Research Reviews &rarr;</a>
                </div>

                {#if researchReviewQueue.length === 0}
                    <div class="empty-state compact-empty">
                        <CheckCircle size={32} class="text-green mx-auto mb-2" />
                        <h4>No Pending Research!</h4>
                        <p>All clinical research manuscripts have been verified.</p>
                    </div>
                {:else}
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Research Title</th>
                                    <th>Author</th>
                                    <th>Submitted Date</th>
                                    <th class="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each researchReviewQueue as item}
                                    <tr>
                                        <td><strong class="item-title">{item.title || 'Untitled Research'}</strong></td>
                                        <td class="author-text">{item.author_name || 'Dr. Researcher'}</td>
                                        <td class="date-cell">{formatDate(item.created_at)}</td>
                                        <td class="text-right">
                                            <a href={`/cms/review/research/${item.id}`} class="btn-review-now purple-btn">
                                                <ShieldCheck size={14} /> Review Research
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
    {/if}

    <!-- Standard Doctor Recent Submissions Section -->
    <div class="card-container">
        <div class="card-header">
            <h2>My Recent Submissions</h2>
            <a href="/cms/doctor-dashboard/articles" class="view-all">View All Publications &rarr;</a>
        </div>

        {#if recentSubmissions.length === 0}
            <div class="empty-state">
                <FileText size={40} class="text-slate-400 mx-auto mb-3" />
                <h4>No recent publication activity</h4>
                <p>You haven't authored any articles or medical research papers yet.</p>
            </div>
        {:else}
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Document Title</th>
                            <th>Category Type</th>
                            <th>Status</th>
                            <th>Publish Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each recentSubmissions as item}
                            <tr>
                                <td><strong class="item-title">{item.title || 'Untitled Document'}</strong></td>
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
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

    * {
        box-sizing: border-box;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .dashboard-container {
        display: flex;
        flex-direction: column;
        gap: 28px;
        max-width: 1500px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    .header h1 {
        font-size: 24px;
        font-weight: 800;
        color: #0F172A;
        margin: 0 0 6px;
    }

    .header p {
        color: #64748B;
        margin: 0;
        font-size: 14px;
    }

    .header-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .btn-primary {
        background: #2563EB;
        color: #FFFFFF;
        padding: 9px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        transition: all 0.2s;
    }
    .btn-primary:hover { background: #1D4ED8; transform: translateY(-1px); }

    .btn-secondary {
        background: #FFFFFF;
        color: #0F172A;
        border: 1px solid #E2E8F0;
        padding: 9px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
    }
    .btn-secondary:hover { background: #F8FAFC; border-color: #CBD5E1; transform: translateY(-1px); }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 20px;
    }

    .stat-card {
        background: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #E2E8F0;
        padding: 18px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        transition: all 0.2s ease;
    }

    .stat-card.clickable:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.05);
        border-color: #CBD5E1;
    }

    .reviewer-card {
        background: #FFFBEB;
        border-color: #FDE68A;
    }
    .reviewer-card:hover {
        border-color: #F59E0B;
        box-shadow: 0 6px 16px rgba(245, 158, 11, 0.12);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .blue-bg { background: #EFF6FF; }
    .purple-bg { background: #FAF5FF; }
    .green-bg { background: #F0FDF4; }
    .amber-bg { background: #FEF3C7; }

    .text-blue { color: #2563EB; }
    .text-purple { color: #9333EA; }
    .text-green { color: #16A34A; }
    .text-amber { color: #D97706; }
    .text-amber-dark { color: #B45309; }

    .text-orange { color: #F97316; }
    .orange-bg { background: rgba(249, 115, 22, 0.1); }

    .text-red { color: #EF4444; }
    .red-bg { background: rgba(239, 68, 68, 0.1); }

    .text-slate-300 { color: #CBD5E1; transition: all 0.2s; }

    .stat-info { display: flex; flex-direction: column; }
    .val-wrap { display: flex; align-items: center; gap: 8px; }
    .stat-value { font-size: 24px; font-weight: 800; color: #0F172A; }
    .stat-label { font-size: 13px; color: #64748B; margin-top: 2px; }

    .badge-pulse {
        font-size: 11px;
        font-weight: 700;
        background: #D97706;
        color: #FFFFFF;
        padding: 2px 8px;
        border-radius: 999px;
        text-transform: uppercase;
    }

    .card-container {
        background: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        overflow: hidden;
    }

    .reviewer-queue-box {
        border-left: 4px solid #D97706;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #F1F5F9;
        flex-wrap: wrap;
        gap: 12px;
    }

    .header-left { display: flex; align-items: center; gap: 12px; }
    .card-header h2 { font-size: 17px; font-weight: 700; color: #0F172A; margin: 0; }
    .view-all { font-size: 13px; font-weight: 600; color: #2563EB; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
    .view-all:hover { text-decoration: underline; }

    .pill-badge { padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .bg-amber-pill { background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }

    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { padding: 12px 24px; color: #64748B; font-weight: 600; font-size: 12px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
    td { padding: 14px 24px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; white-space: nowrap; }

    .item-title { font-size: 14px; font-weight: 700; color: #0F172A; }
    .author-text { color: #334155; font-weight: 500; }
    .date-cell { color: #64748B; font-size: 12px; }

    .type-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #EFF6FF; color: #2563EB; border: 1px solid #DBEAFE; white-space: nowrap; }
    .type-badge.research-type { background: #FAF5FF; color: #9333EA; border: 1px solid #F3E8FF; }

    .status-badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
    .status-draft { background: #F1F5F9; color: #475569; }
    .status-under_review { background: #FEF3C7; color: #D97706; }
    .status-published { background: #DCFCE7; color: #15803D; }
    .status-rejected { background: #FEE2E2; color: #DC2626; }

    .btn-review-now {
        background: #FEF3C7;
        color: #D97706;
        border: 1px solid #FDE68A;
        padding: 6px 12px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }
    .btn-review-now:hover {
        background: #D97706;
        color: #FFFFFF;
    }

    .purple-btn {
        background: #FAF5FF;
        color: #9333EA;
        border-color: #E9D5FF;
    }
    .purple-btn:hover {
        background: #9333EA;
        color: #FFFFFF;
    }

    .reviewer-split-section {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .purple-border {
        border-left: 4px solid #9333EA;
    }

    .purple-pulse {
        background: #9333EA !important;
    }

    .bg-purple-pill {
        background: #FAF5FF;
        color: #9333EA;
        border: 1px solid #E9D5FF;
    }

    .text-purple-dark {
        color: #6B21A8;
    }

    .empty-state { padding: 48px 20px; text-align: center; }
    .compact-empty { padding: 32px 20px; }
    .empty-state h4 { font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 6px; }
    .empty-state p { color: #64748B; margin: 0; font-size: 14px; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .ml-auto { margin-left: auto; }
    .text-right { text-align: right; }
    .font-medium { font-weight: 600; }
</style>