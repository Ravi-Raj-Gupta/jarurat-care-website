<script lang="ts">
	import {
		Camera,
		GraduationCap,
		Medal,
		Clock,
		MapPin,
		FileText,
		Users,
		Award,
		Trophy,
		Eye,
		Activity,
		Zap,
		MoreVertical,
		Smile,
		Briefcase,
		User,
		BookOpen
	} from 'lucide-svelte';

	export let doctor: any;
	
	// Default mock stats if not provided
	export let publicationsCount: number | string = 0;
	export let citationsCount: number = 0;
	export let awardsCount: string | number = 0;
	export let articleViews: string | number = 0;

	function getInitials(name: string) {
		if (!name) return 'DR';
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join('');
	}

	function getAvatar(person: any) {
		return (
			person?.avatar_url ||
			person?.image_url ||
			person?.photo_url ||
			person?.profile_picture ||
			person?.avatar ||
			null
		);
	}
</script>

<div class="profile-container">
	<!-- HEADER CARD -->
	<section class="header-card">
		<div class="avatar-section">
			<div class="avatar-wrapper">
				{#if getAvatar(doctor)}
					<img src={getAvatar(doctor)} alt={doctor?.full_name || 'Doctor'} />
				{:else}
					<div class="avatar-placeholder">
						{getInitials(doctor?.full_name)}
					</div>
				{/if}
				<button class="camera-btn" aria-label="Update avatar">
					<Camera size={14} />
				</button>
			</div>
		</div>

		<div class="info-section">
			<div class="name-row">
				<h1>{doctor?.full_name || 'Dr. Vineeta Gupta'}</h1>
				<span class="role-badge">
					<Users size={14} /> {doctor?.role || 'Author'}
				</span>
			</div>
			
			<div class="sub-badges">
				<span class="designation">
					{doctor?.designation || doctor?.specialization || 'Senior Consultant - Medical Oncology'}
				</span>
				<span class="tier-badge">
					<Medal size={14} /> {doctor?.tier || 'Bronze Author'}
				</span>
			</div>

			<div class="details-list">
				{#if doctor?.experience || doctor?.years_of_experience}
					<div class="detail-item">
						<Clock size={14} />
						<span>{doctor?.experience || doctor?.years_of_experience || ''} Years of experience</span>
					</div>
				{/if}
				{#if doctor?.specialization}
					<div class="detail-item">
						<Activity size={14} />
						<span>{doctor.specialization}</span>
					</div>
				{/if}
				{#if doctor?.affiliation || doctor?.hospital || doctor?.organization}
					<div class="detail-item">
						<MapPin size={14} />
						<span>{doctor.affiliation || doctor.hospital || doctor.organization}</span>
					</div>
				{/if}
			</div>

			<button class="action-btn">More Action</button>
		</div>
	</section>

	<!-- STATS ROW -->
	<section class="stats-card">
		<div class="stat-item">
			<div class="stat-icon"><Users size={20} color="#1E4ED8" /></div>
			<div class="stat-info">
				<strong>{doctor?.publications || 0}</strong>
				<span>Publications</span>
			</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<div class="stat-icon"><FileText size={20} color="#1E4ED8" /></div>
			<div class="stat-info">
				<strong>{doctor?.citations || 0}</strong>
				<span>Citations</span>
			</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<div class="stat-icon"><Trophy size={20} color="#2563EB" /></div>
			<div class="stat-info">
				<strong>{doctor?.awards || 0}</strong>
				<span>Awards</span>
			</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-item">
			<div class="stat-icon"><Users size={20} color="#2563EB" /></div>
			<div class="stat-info">
				<strong>{articleViews}</strong>
				<span>Article Views</span>
			</div>
		</div>
	</section>

	<!-- MIDDLE ROW: Two Columns -->
	<div class="middle-row">
		<!-- LEFT COLUMN -->
		<div class="left-col">
			<section class="about-section">
				<div class="section-title">
					<div class="icon-wrap"><User size={18} /></div>
					<h2>About Author</h2>
				</div>
				<p>
					{doctor?.bio || doctor?.about || 'e.g. Passionate about learning and spreading awareness about cancer care, support and prevention. I believe knowledge empowers communicate and save lives. dedicate to sharing reliable information, promoting healthy lifestyles and supporting those affected by cancer.'}
				</p>
			</section>

			<section class="publications-section">
				<div class="section-title-row">
					<div class="title-left">
						<div class="icon-wrap"><Zap size={18} /></div>
						<h2>Recent Publications</h2>
					</div>
					{#if doctor?.recent_publications && doctor.recent_publications.length > 0}
						<a href="#" class="view-all">View All</a>
					{/if}
				</div>
				
				{#if doctor?.publications}
					<div class="simple-text-content">
						<p>{doctor.publications}</p>
					</div>
				{:else if doctor?.recent_publications && doctor.recent_publications.length > 0}
					<div class="pub-list">
						{#each doctor.recent_publications as pub}
							<div class="pub-card">
								<div class="pub-badge">{pub.type || 'Publication'}</div>
								<h3>{pub.title}</h3>
								<p>{pub.journal}</p>
								<div class="pub-meta">
									<span>{pub.date}</span>
									<span>•</span>
									<span class="pub-citations">{pub.citations || 0} Citations</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="empty-state-text">No publications added yet.</p>
				{/if}
			</section>
		</div>

		<!-- RIGHT COLUMN -->
		<div class="right-col">
			<section class="expertise-section">
				<div class="section-title">
					<div class="icon-wrap"><Smile size={18} /></div>
					<h2>Areas Of Expertise</h2>
				</div>
				<div class="tags-container">
					{#if doctor?.expertise && doctor.expertise.length > 0}
						{#each doctor.expertise as tag}
							<span class="expertise-tag">{tag}</span>
						{/each}
					{:else}
						<span class="expertise-tag">Chemotherapy</span>
						<span class="expertise-tag">Medical oncology</span>
						<span class="expertise-tag">Immunotherapy</span>
						<span class="expertise-tag">Targeted Therapy</span>
					{/if}
				</div>
			</section>

			<section class="experience-section">
				<div class="section-title">
					<div class="icon-wrap"><Briefcase size={18} /></div>
					<h2>Experience</h2>
				</div>
				
				{#if doctor?.experience}
					<div class="simple-text-content">
						<p>{doctor.experience}</p>
					</div>
				{:else if doctor?.experience_history && doctor.experience_history.length > 0}
					<div class="timeline">
						{#each doctor.experience_history as exp, i}
							<div class="timeline-item">
								<div class="dot {i === 0 ? 'active' : ''}"></div>
								{#if i < doctor.experience_history.length - 1}
									<div class="line"></div>
								{/if}
								<div class="content">
									<h4>{exp.title}</h4>
									<p>{exp.organization}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="empty-state-text">No experience details added yet.</p>
				{/if}
			</section>
		</div>
	</div>
</div>

<style>
	/* Container */
	.profile-container {
		display: flex;
		flex-direction: column;
		gap: 24px;
		font-family: 'Manrope', sans-serif;
		width: 100%;
		max-width: 1400px;
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
		gap: 32px;
		align-items: center;
	}

	.avatar-section {
		flex-shrink: 0;
	}

	.avatar-wrapper {
		position: relative;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		background: #F3F4F6;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4px solid #FFFFFF;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.avatar-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.avatar-placeholder {
		font-size: 64px;
		font-weight: 700;
		color: #9CA3AF;
	}

	.empty-state-text {
		color: #9CA3AF;
		font-size: 14px;
		font-style: italic;
		margin-top: 12px;
	}

	.camera-btn {
		position: absolute;
		bottom: 8px;
		right: 8px;
		background: #FFFFFF;
		border: 1px solid #E5E7EB;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #1E4ED8;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.info-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.name-row h1 {
		margin: 0;
		font-size: 32px;
		font-weight: 600;
		color: #111827;
	}

	.role-badge {
		background: #EFF6FF;
		color: #2563EB;
		border: 1px solid #BFDBFE;
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 14px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.sub-badges {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.designation {
		font-size: 16px;
		font-weight: 600;
		color: #374151;
	}

	.tier-badge {
		background: #FFF7ED;
		color: #C2410C;
		border: 1px solid #FED7AA;
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 13px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 6px;
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

	/* Middle Row Columns */
	.middle-row {
		display: flex;
		gap: 24px;
	}

	.left-col {
		flex: 1.5;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.right-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 24px;
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

	.about-section p, .simple-text-content p {
		color: #4B5563;
		font-size: 15px;
		line-height: 26px;
		margin: 0;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.section-title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	
	.title-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.title-left h2 {
		font-size: 18px;
		font-weight: 600;
		color: #111827;
		margin: 0;
	}

	.title-left .icon-wrap {
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

	.view-all {
		color: #1E4ED8;
		font-size: 14px;
		font-weight: 700;
		text-decoration: none;
	}

	.pub-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.pub-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.pub-icon {
		background: #EFF6FF;
		color: #2563EB;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.pub-item span {
		color: #4B5563;
		font-size: 15px;
		font-weight: 500;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.expertise-tag {
		background: #EFF6FF;
		color: #2563EB;
		padding: 6px 16px;
		border-radius: 24px;
		font-size: 13px;
		font-weight: 600;
	}

	/* Timeline */
	.timeline {
		display: flex;
		flex-direction: column;
	}

	.timeline-item {
		position: relative;
		padding-left: 32px;
		padding-bottom: 24px;
	}

	.timeline-item:last-child {
		padding-bottom: 0;
	}

	.dot {
		position: absolute;
		left: 0;
		top: 4px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #E5E7EB;
		border: 4px solid #F3F4F6;
		z-index: 1;
	}

	.dot.active {
		background: #2563EB;
		border-color: #EFF6FF;
	}

	.line {
		position: absolute;
		left: 7px;
		top: 20px;
		bottom: 0;
		width: 2px;
		background: #E5E7EB;
		z-index: 0;
	}

	.timeline-item .content h4 {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: #111827;
	}

	.timeline-item .content p {
		margin: 2px 0 0;
		font-size: 13px;
		color: #6B7280;
	}
</style>
