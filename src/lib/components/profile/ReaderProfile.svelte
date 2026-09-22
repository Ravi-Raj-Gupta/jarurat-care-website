<script lang="ts">
	import {
		Camera,
		GraduationCap,
		Medal,
		Clock,
		Mail,
		MapPin,
		FileText,
		UserPlus,
		MessageSquare,
		Hash,
		User,
		Smile,
		RotateCcw,
		ThumbsUp,
		Bookmark,
		MoreVertical,
		ArrowRight
	} from 'lucide-svelte';

	export let profile: any;
	export let savedCount: number = 0;
	export let followingCount: number = 0;
	export let topicsCount: number = 0;
	export let commentsCount: number = 0;
	
	export let savedArticles: any[] = [];
	export let reactedArticles: any[] = [];
	export let recommendedArticles: any[] = [];
	export let popularArticles: any[] = [];
	export let followedDoctors: any[] = [];
	
	// Activity Tabs logic
	let activeTab = 'liked'; // Default tab

	function formatDate(dateStr: string) {
		if (!dateStr) return 'N/A';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		});
	}

	function formatArticleDate(dateStr: string) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	$: currentArticles = 
		activeTab === 'saved' ? savedArticles :
		activeTab === 'recommended' ? recommendedArticles :
		activeTab === 'popular' ? popularArticles :
		reactedArticles;

</script>

<div class="profile-container">
	<!-- HEADER CARD -->
	<section class="header-card">


		<div class="info-section">
			<div class="name-row">
				<h1>{profile?.full_name || 'Reader'}</h1>
				<span class="role-badge">
					<User size={14} /> {profile?.role || 'Reader'}
				</span>
			</div>
			
			<div class="sub-badges">
				{#if profile?.designation}
					<span class="level">
						<GraduationCap size={14} /> {profile.designation}
					</span>
				{/if}
				<!-- Placeholder for Silver Reader badge until added to DB -->
				{#if profile?.tier}
					<span class="tier-badge">
						<Medal size={14} /> {profile.tier}
					</span>
				{/if}
			</div>

			<div class="details-list">
				<div class="detail-item">
					<Clock size={14} />
					<span>Member Since {formatDate(profile?.created_at)}</span>
				</div>
				<div class="detail-item">
					<Mail size={14} />
					<span>{profile?.email || 'N/A'}</span>
				</div>
				{#if profile?.city || profile?.location}
					<div class="detail-item">
						<MapPin size={14} />
						<span>{[profile.location, profile.city].filter(Boolean).join(', ')}</span>
					</div>
				{/if}
			</div>

			<button class="action-btn">More Action</button>
		</div>
	</section>

	<!-- STATS ROW -->
	<section class="stats-card">
		<div class="stat-item">
			<div class="stat-icon"><FileText size={20} color="#1E4ED8" /></div>
			<div class="stat-info">
				<strong>{savedCount}</strong>
				<span>Articles Saved</span>
			</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<div class="stat-icon"><UserPlus size={20} color="#1E4ED8" /></div>
			<div class="stat-info">
				<strong>{followingCount}</strong>
				<span>Author Following</span>
			</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<div class="stat-icon"><Hash size={20} color="#1E4ED8" /></div>
			<div class="stat-info">
				<strong>{topicsCount}</strong>
				<span>Topics following</span>
			</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<div class="stat-icon"><MessageSquare size={20} color="#1E4ED8" /></div>
			<div class="stat-info">
				<strong>{commentsCount}</strong>
				<span>Comments Made</span>
			</div>
		</div>
	</section>

	<!-- ABOUT & INTERESTS -->
	<div class="middle-row">
		<section class="about-section">
			<div class="section-title">
				<div class="icon-wrap"><User size={18} /></div>
				<h2>About Reader</h2>
			</div>
			<p>{profile?.bio || profile?.about || 'No bio provided.'}</p>
		</section>

		<section class="interests-section">
			<div class="section-title">
				<div class="icon-wrap"><Smile size={18} /></div>
				<h2>Areas Of Interests</h2>
			</div>
			<div class="tags-container">
				{#if profile?.specializations && profile.specializations.length > 0}
					{#each profile.specializations as interest}
						<span class="interest-tag">{interest}</span>
					{/each}
				{:else}
					<span class="no-data">No interests specified</span>
				{/if}
			</div>
		</section>
	</div>

	<!-- ACTIVITY SECTION -->
	<section class="activity-card">
		<div class="card-header">
			<RotateCcw size={20} color="#315BDC" />
			<h2>Reader's Activity</h2>
		</div>

		<div class="tabs">
			<button class:active={activeTab === 'liked'} on:click={() => activeTab = 'liked'}>Liked Articles</button>
			<button class:active={activeTab === 'saved'} on:click={() => activeTab = 'saved'}>Saved Articles</button>
			<button class:active={activeTab === 'comments'} on:click={() => activeTab = 'comments'}>Comments Made</button>
			<button class:active={activeTab === 'recommended'} on:click={() => activeTab = 'recommended'}>Recommended</button>
			<button class:active={activeTab === 'popular'} on:click={() => activeTab = 'popular'}>Trending</button>
			<button class:active={activeTab === 'doctors'} on:click={() => activeTab = 'doctors'}>Doctors You Follow</button>
		</div>

		<div class="articles-list">
			{#if activeTab === 'doctors'}
				{#if followedDoctors.length === 0}
					<p class="empty-state">You are not following any doctors yet.</p>
				{:else}
					<div class="doctors-grid">
						{#each followedDoctors as doctor}
							<div class="doctor-card">
								<img src={doctor.avatar || 'https://via.placeholder.com/150'} alt={doctor.name} class="doc-avatar" />
								<h4>{doctor.name}</h4>
								<span class="doc-spec">{doctor.specialization || 'Doctor'}</span>
								<a href={`/cms/community/doctors/${doctor.id}`} class="view-doc-btn">View Profile</a>
							</div>
						{/each}
					</div>
				{/if}
			{:else}
				{#if currentArticles.length === 0}
					<p class="empty-state">No articles found for this tab.</p>
				{:else}
					{#each currentArticles as article}
					<div class="article-item">
						<img src={article.thumbnail || article.cover_image_url} alt="Cover" class="article-img" />
						<div class="article-content">
							<div class="badge-row">
								<span class="type-badge">{article.type === 'research' ? 'RESEARCH ARTICLE' : 'CLINICAL TRIAL'}</span>
							</div>
							<h3>{article.title}</h3>
							<p class="author">Dr. {article.authorName} et al.</p>
							<div class="meta">
								<span><Clock size={12} /> Published {formatArticleDate(article.date || article.created_at)}</span>
								<span><FileText size={12} /> {article.views || 0} Views</span>
							</div>
						</div>
						<div class="article-actions">
							<div class="metrics">
								<span><ThumbsUp size={16} /> {article.likes || 0}</span>
								<span><Bookmark size={16} /></span>
								<span><MoreVertical size={16} /></span>
							</div>
							<a href={article.href || `/cms/articles/${article.id}`} class="view-btn">View Full Article</a>
						</div>
					</div>
					{/each}
				{/if}
			{/if}
		</div>

		{#if currentArticles.length > 0}
			<button class="view-all">View all <ArrowRight size={16} /></button>
		{/if}
	</section>
</div>

<style>
	/* Container */
	.profile-container {
		display: flex;
		flex-direction: column;
		gap: 24px;
		font-family: 'Manrope', sans-serif;
		max-width: 1139px;
		margin: 0 auto;
		background: #FAFAFA;
		padding: 24px;
		border-radius: 24px;
		border: 1px solid #D1D5DB;
	}

	/* Common Card Style */
	section {
		background: #FFFFFF;
		border: none;
		border-radius: 16px;
		padding: 24px 32px;
		box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
	}

	/* Header Card */
	.header-card {
		display: flex;
		gap: 40px;
		align-items: center;
	}

	.avatar-wrapper {
		position: relative;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		background: #f0f2f5;
		border: 4px solid white;
		box-shadow: 0 4px 6px rgba(0,0,0,0.05);
	}

	.avatar-wrapper img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 56px;
		color: #9CA3AF;
		border-radius: 50%;
	}

	.camera-btn {
		position: absolute;
		bottom: 8px;
		right: 8px;
		background: white;
		border: 1px solid #E5E7EB;
		color: #315BDC;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.info-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.name-row h1 {
		font-size: 32px;
		font-weight: 600;
		color: #111827;
		margin: 0;
		letter-spacing: -0.5px;
	}

	.role-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 12px;
		background: #EFF6FF;
		color: #2563EB;
		border: 1px solid #BFDBFE;
		border-radius: 100px;
		font-size: 14px;
		font-weight: 600;
	}

	.sub-badges {
		display: flex;
		gap: 12px;
	}

	.badge {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 14px;
		border-radius: 100px;
		font-size: 13px;
		font-weight: 500;
	}

	.blue-outline {
		color: #2563EB;
		border: 1px solid #2563EB;
	}

	.gray-outline {
		color: #4B5563;
		border: 1px solid #9CA3AF;
	}

	.details-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 8px;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #6B7280;
		font-size: 14px;
		font-weight: 500;
	}

	.action-btn {
		background: #2563EB;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 12px 16px;
		font-weight: 700;
		font-size: 16px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10px;
		width: max-content;
		height: 44px;
	}

	/* Stats Card */
	.stats-card {
		display: flex;
		justify-content: space-around;
		padding: 16px;
		background: #FFFFFF;
		border-radius: 16px;
		border: 1px solid #D1D5DB;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.stat-icon {
		background: #EFF6FF;
		color: #2563EB;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-info strong {
		font-size: 28px;
		font-weight: 700;
		color: #111827;
	}

	.stat-info span {
		font-size: 14px;
		color: #6B7280;
		font-weight: 500;
	}

	.stat-divider {
		width: 1px;
		background: #E5E7EB;
		margin: 0 16px;
	}

	/* Middle Sections */
	.middle-row {
		display: flex;
		gap: 24px;
	}

	.about-section {
		flex: 1.5;
	}

	.interests-section {
		flex: 1;
	}

	.section-title {
		font-size: 18px;
		font-weight: 600;
		color: #111827;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	.section-title .icon-wrap {
		border: 1px dashed #BFDBFE;
		background: transparent;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #2563EB;
	}

	.about-section p {
		color: #4B5563;
		font-size: 15px;
		line-height: 26px;
		margin: 0;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.interests-list {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.interest-tag {
		background: #EFF6FF;
		color: #2563EB;
		padding: 6px 16px;
		border-radius: 24px;
		font-size: 13px;
		font-weight: 600;
	}

	.no-data {
		color: #9CA3AF;
		font-size: 14px;
	}

	/* Activity Section */
	.activity-card {
		display: flex;
		flex-direction: column;
	}

	.tabs {
		display: flex;
		gap: 32px;
		border-bottom: 1px solid #E5E7EB;
		margin-bottom: 32px;
	}

	.tabs button {
		background: none;
		border: none;
		padding: 14px 0;
		font-size: 15px;
		font-weight: 600;
		color: #6B7280;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.tabs button.active {
		color: #111827;
		border-bottom-color: #2563EB;
	}

	.articles-list {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.article-item {
		display: flex;
		gap: 24px;
		align-items: flex-start;
		border-bottom: 1px solid #F3F4F6;
		padding-bottom: 28px;
	}

	.article-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.article-img {
		width: 160px;
		height: 110px;
		border-radius: 12px;
		object-fit: cover;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}

	.article-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.type-badge {
		background: #ECFDF5;
		color: #059669;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		width: max-content;
		letter-spacing: 0.5px;
	}

	.article-content h3 {
		font-size: 18px;
		font-weight: 700;
		color: #111827;
		margin: 0;
		line-height: 1.4;
	}

	.author {
		color: #4B5563;
		font-size: 14px;
		font-weight: 500;
		margin: 0;
	}

	.meta {
		display: flex;
		gap: 20px;
		color: #9CA3AF;
		font-size: 13px;
		font-weight: 500;
	}

	.meta span {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.article-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		height: 110px;
	}

	.metrics {
		display: flex;
		gap: 20px;
		color: #9CA3AF;
	}

	.metrics span {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		font-weight: 500;
	}

	.view-btn {
		background: white;
		border: 1px solid #2563EB;
		color: #2563EB;
		padding: 10px 20px;
		border-radius: 100px;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}

	.view-btn:hover {
		background: #EFF6FF;
	}

	.view-all {
		background: none;
		border: none;
		color: #2563EB;
		font-weight: 600;
		font-size: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 24px;
		cursor: pointer;
	}
	
	.empty-state {
		text-align: center;
		color: #9CA3AF;
		padding: 40px;
		font-size: 15px;
	}

	.doctors-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 24px;
	}

	.doctor-card {
		background: #FFFFFF;
		border: 1px solid #E5E7EB;
		border-radius: 12px;
		padding: 24px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 8px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.02);
	}

	.doc-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: 8px;
	}

	.doctor-card h4 {
		margin: 0;
		font-size: 16px;
		font-weight: 700;
		color: #1F2937;
	}

	.doc-spec {
		font-size: 13px;
		color: #6B7280;
		margin-bottom: 12px;
	}

	.view-doc-btn {
		background: #EFF6FF;
		color: #2563EB;
		border: 1px solid #BFDBFE;
		padding: 6px 16px;
		border-radius: 100px;
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}

	.view-doc-btn:hover {
		background: #2563EB;
		color: white;
	}
</style>
