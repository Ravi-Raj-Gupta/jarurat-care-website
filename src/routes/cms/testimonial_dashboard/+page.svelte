<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		MessageSquare,
		Plus,
		Clock,
		CheckCircle2,
		XCircle,
		AlertCircle,
		Edit3,
		Trash2,
		Send,
		Upload,
		RefreshCw
	} from 'lucide-svelte';

	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import toast from 'svelte-french-toast';

	type Testimonial = {
		id: string;
		name: string;
		designation: string | null;
		content: string;
		status: string;
		admin_feedback?: string | null;
		created_at: string;
		updated_at?: string;
		featured_image?: string | null;
	};

	let user: any = null;
	let profile: any = null;

	let testimonials: Testimonial[] = [];

	let loading = true;
	let showForm = false;
	let submitting = false;

	let message = '';
	let editingTestimonial: Testimonial | null = null;

	let name = '';
	let designation = '';
	let content = '';
	let photo: File | null = null;

	/* =========================
	   AUTH + INITIAL LOAD
	========================= */

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await cmsSupabase.auth.getUser();

		if (!currentUser) {
			goto('/cms/login');
			return;
		}

		user = currentUser;

		const { data: profileData, error: profileError } =
			await cmsSupabase
				.from('profiles')
				.select('*')
				.eq('id', currentUser.id)
				.single();

		if (profileError || !profileData) {
			toast.error('Unable to load your profile.');
			return;
		}

		profile = profileData;

		await loadTestimonials();
	});


	/* =========================
	   LOAD TESTIMONIALS
	========================= */

	async function loadTestimonials() {
		if (!user?.id) return;

		loading = true;

		const { data, error } = await cmsSupabase
			.from('testimonials')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error loading testimonials:', error);
			toast.error('Unable to load testimonials.');
			testimonials = [];
		} else {
			testimonials = data ?? [];
		}

		loading = false;
	}


	/* =========================
	   FORM
	========================= */

	function toggleForm() {
		if (showForm) {
			resetForm();
			return;
		}

		editingTestimonial = null;

		name = '';
		designation = '';
		content = '';
		photo = null;
		message = '';

		showForm = true;

		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}


	function resetForm() {
		name = '';
		designation = '';
		content = '';
		photo = null;

		editingTestimonial = null;
		message = '';

		showForm = false;
	}


	function startEdit(testimonial: Testimonial) {
		editingTestimonial = testimonial;

		name = testimonial.name;
		designation = testimonial.designation || '';
		content = testimonial.content;

		photo = null;
		message = '';

		showForm = true;

		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}


	function handlePhotoUpload(event: Event) {
		const target = event.target as HTMLInputElement;

		if (target.files && target.files.length > 0) {
			photo = target.files[0];
		}
	}


	/* =========================
	   SAVE / SUBMIT
	========================= */

	async function submitTestimonial() {
		await saveTestimonial('submitted');
	}


	async function saveTestimonial(statusStr: string) {
		if (!name.trim() || !content.trim()) {
			message = 'Name and testimonial are required.';
			return;
		}

		if (!user?.id) {
			message = 'You must be logged in to submit a testimonial.';
			return;
		}

		submitting = true;
		message = '';

		let imageUrl: string | null = null;

		/* Upload image */
		if (photo) {
			const fileName = `${Date.now()}-${photo.name.replace(
				/[^a-zA-Z0-9.\-]/g,
				''
			)}`;

			const { error: uploadError } = await cmsSupabase.storage
				.from('cms-images')
				.upload(fileName, photo);

			if (uploadError) {
				message =
					'Image upload failed: ' +
					uploadError.message;

				submitting = false;
				return;
			}

			const { data: urlData } =
				cmsSupabase.storage
					.from('cms-images')
					.getPublicUrl(fileName);

			imageUrl = urlData.publicUrl;
		}


		const payload: any = {
			name: name.trim(),
			designation: designation.trim() || null,
			content: content.trim(),
			status: statusStr
		};


		if (imageUrl) {
			payload.featured_image = imageUrl;
		}


		/* UPDATE */
		if (editingTestimonial) {
			payload.admin_feedback = null;
			payload.updated_at = new Date().toISOString();

			const { error } = await cmsSupabase
				.from('testimonials')
				.update(payload)
				.eq('id', editingTestimonial.id);

			submitting = false;

			if (error) {
				message = error.message;
				return;
			}

			toast.success(
				statusStr === 'draft'
					? 'Draft saved successfully!'
					: 'Testimonial updated and resubmitted!'
			);

			resetForm();

			await loadTestimonials();

			return;
		}


		/* INSERT */
		payload.user_id = user.id;

		const { error } = await cmsSupabase
			.from('testimonials')
			.insert([payload]);

		submitting = false;

		if (error) {
			message = error.message;
			return;
		}

		toast.success(
			statusStr === 'draft'
				? 'Draft saved successfully!'
				: 'Testimonial submitted for review!'
		);

		resetForm();

		await loadTestimonials();
	}


	/* =========================
	   RESUBMIT
	========================= */

	async function submitFromCard(id: string) {
		const { error } = await cmsSupabase
			.from('testimonials')
			.update({
				status: 'submitted',
				updated_at: new Date().toISOString()
			})
			.eq('id', id);

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success(
			'Testimonial submitted for review!'
		);

		await loadTestimonials();
	}


	/* =========================
	   DELETE
	========================= */

	async function deleteTestimonial(id: string) {
		if (!confirm('Delete this testimonial?')) return;

		const { error } = await cmsSupabase
			.from('testimonials')
			.delete()
			.eq('id', id);

		if (error) {
			toast.error(error.message);
			return;
		}

		toast.success(
			'Testimonial deleted successfully!'
		);

		await loadTestimonials();
	}


	/* =========================
	   STATUS HELPERS
	========================= */

	function canEdit(status: string) {
		return (
			status === 'submitted' ||
			status === 'changes_requested'
		);
	}


	function getStatusLabel(status: string) {
		switch (status) {
			case 'submitted':
				return 'Under Review';

			case 'published':
				return 'Published';

			case 'rejected':
				return 'Rejected';

			case 'changes_requested':
				return 'Changes Requested';

			case 'draft':
				return 'Draft';

			default:
				return status.replace('_', ' ');
		}
	}


	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';

		return new Date(dateString).toLocaleDateString(
			'en-US',
			{
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			}
		);
	}


	/* =========================
	   LOGOUT
	========================= */

	async function logout() {
		await cmsSupabase.auth.signOut();

		goto('/cms/login');
	}


	/* =========================
	   COUNTS
	========================= */

	$: submittedCount = testimonials.filter(
		(t) => t.status === 'submitted'
	).length;

	$: publishedCount = testimonials.filter(
		(t) => t.status === 'published'
	).length;

	$: changesCount = testimonials.filter(
		(t) => t.status === 'changes_requested'
	).length;

	$: rejectedCount = testimonials.filter(
		(t) => t.status === 'rejected'
	).length;
</script>


<svelte:head>
	<title>Testimonials | Doctor Portal</title>
</svelte:head>


<div class="dashboard">

	<!-- SIDEBAR -->
	<Sidebar
		isReviewer={profile?.is_reviewer === true}
	/>


	<!-- MAIN CONTENT -->
	<div class="content">

		<!-- TOPBAR -->
		<Topbar
			doctorName={
				profile?.full_name ||
				user?.email?.split('@')[0] ||
				''
			}
			unreadCount={0}
		/>


		<!-- PAGE -->
		<main class="page">

			<!-- PAGE HEADER -->
			<div class="page-header">

				<div class="header-left">

					<div class="title-icon">
						<MessageSquare size={22} />
					</div>

					<div>
						<h1>Testimonials</h1>

						<p>
							Share your experience with
							Jarurat Care.
						</p>
					</div>

				</div>


				<button
					class="primary-btn"
					on:click={toggleForm}
				>
					<Plus size={17} />

					{showForm
						? 'Close Form'
						: 'Write Testimonial'}
				</button>

			</div>


			<!-- STAT CARDS -->
			<div class="stats-grid">

				<div class="stat-card">

					<div class="stat-icon blue">
						<Clock size={19} />
					</div>

					<div>
						<p>Under Review</p>
						<strong>{submittedCount}</strong>
					</div>

				</div>


				<div class="stat-card">

					<div class="stat-icon green">
						<CheckCircle2 size={19} />
					</div>

					<div>
						<p>Published</p>
						<strong>{publishedCount}</strong>
					</div>

				</div>


				<div class="stat-card">

					<div class="stat-icon amber">
						<AlertCircle size={19} />
					</div>

					<div>
						<p>Changes Requested</p>
						<strong>{changesCount}</strong>
					</div>

				</div>


				<div class="stat-card">

					<div class="stat-icon red">
						<XCircle size={19} />
					</div>

					<div>
						<p>Rejected</p>
						<strong>{rejectedCount}</strong>
					</div>

				</div>

			</div>


			<!-- FORM -->
			{#if showForm}

				<section class="form-card">

					<div class="form-header">

						<div>
							<h2>
								{editingTestimonial
									? 'Edit Testimonial'
									: 'Write Your Testimonial'}
							</h2>

							<p>
								Your testimonial will be
								reviewed by the CMS admin
								before being published.
							</p>
						</div>

						<div class="form-icon">
							<MessageSquare size={22} />
						</div>

					</div>


					<div class="form-grid">

						<div class="field">

							<label for="testimonial-name">
								Name <span>*</span>
							</label>

							<input
								id="testimonial-name"
								type="text"
								placeholder="Enter your name"
								bind:value={name}
							/>

						</div>


						<div class="field">

							<label for="testimonial-designation">
								Designation / Role
							</label>

							<input
								id="testimonial-designation"
								type="text"
								placeholder="e.g. Doctor, Caregiver"
								bind:value={designation}
							/>

						</div>

					</div>


					<div class="field">

						<label for="testimonial-photo">
							Profile Photo
						</label>

						<div class="upload-box">

							<Upload size={18} />

							<div>
								<strong>
									Upload a photo
								</strong>

								<span>
									PNG, JPG or JPEG
								</span>
							</div>

							<input
								id="testimonial-photo"
								type="file"
								accept="image/*"
								on:change={handlePhotoUpload}
							/>

						</div>

						{#if photo}
							<p class="file-selected">
								Selected: {photo.name}
							</p>
						{/if}

					</div>


					<div class="field">

						<label for="testimonial-content">
							Your Testimonial <span>*</span>
						</label>

						<textarea
							id="testimonial-content"
							rows="7"
							placeholder="Tell us about your experience with Jarurat Care..."
							bind:value={content}
						></textarea>

						<div class="character-count">
							{content.length} characters
						</div>

					</div>


					{#if message}

						<div class="form-message">
							<AlertCircle size={17} />

							<span>{message}</span>
						</div>

					{/if}


					<div class="form-actions">

						<button
							class="secondary-btn"
							on:click={resetForm}
							disabled={submitting}
						>
							Cancel
						</button>


						<button
							class="submit-btn"
							on:click={submitTestimonial}
							disabled={submitting}
						>
							<Send size={16} />

							{submitting
								? 'Submitting...'
								: 'Submit for Review'}
						</button>

					</div>

				</section>

			{/if}


			<!-- TESTIMONIAL LIST -->
			<section class="list-section">

				<div class="section-header">

					<div>
						<h2>My Testimonials</h2>

						<p>
							Track the status of your
							submissions.
						</p>
					</div>

					<button
						class="refresh-btn"
						on:click={loadTestimonials}
						title="Refresh testimonials"
					>
						<RefreshCw size={16} />
						Refresh
					</button>

				</div>


				{#if loading}

					<div class="empty-state">
						<RefreshCw
							size={28}
							class="loading-icon"
						/>

						<p>Loading testimonials...</p>
					</div>


				{:else if testimonials.length === 0}

					<div class="empty-state">

						<div class="empty-icon">
							<MessageSquare size={28} />
						</div>

						<h3>No testimonials yet</h3>

						<p>
							Share your experience with
							Jarurat Care and it can be
							featured on the website.
						</p>

						<button
							class="primary-btn"
							on:click={toggleForm}
						>
							<Plus size={17} />
							Write Your First Testimonial
						</button>

					</div>


				{:else}

					<div class="testimonial-grid">

						{#each testimonials as testimonial}

							<div class="testimonial-card">

								<div class="testimonial-top">

									<div class="person">

										{#if testimonial.featured_image}

											<img
												src={testimonial.featured_image}
												alt={testimonial.name}
												class="avatar"
											/>

										{:else}

											<div class="avatar initials">
												{testimonial.name
													.charAt(0)
													.toUpperCase()}
											</div>

										{/if}


										<div>

											<h3>
												{testimonial.name}
											</h3>

											{#if testimonial.designation}

												<p>
													{testimonial.designation}
												</p>

											{/if}

										</div>

									</div>


									<span
										class:status-submitted={
											testimonial.status ===
											'submitted'
										}
										class:status-published={
											testimonial.status ===
											'published'
										}
										class:status-changes={
											testimonial.status ===
											'changes_requested'
										}
										class:status-rejected={
											testimonial.status ===
											'rejected'
										}
										class:status-draft={
											testimonial.status ===
											'draft'
										}
										class="status-badge"
									>
										{getStatusLabel(
											testimonial.status
										)}
									</span>

								</div>


								<div class="quote-mark">
									“
								</div>

								<p class="testimonial-content">
									{testimonial.content}
								</p>


								{#if testimonial.admin_feedback}

									<div class="feedback-box">

										<div class="feedback-title">
											<AlertCircle size={15} />

											Admin Feedback
										</div>

										<p>
											{testimonial.admin_feedback}
										</p>

									</div>

								{/if}


								<div class="testimonial-footer">

									<span class="date">
										{formatDate(
											testimonial.created_at
										)}
									</span>


									<div class="card-actions">

										{#if canEdit(
											testimonial.status
										)}

											<button
												class="icon-btn edit"
												on:click={() =>
													startEdit(
														testimonial
													)}
												title="Edit testimonial"
											>
												<Edit3 size={14} />
												Edit
											</button>

										{/if}


										{#if
											testimonial.status === 'draft' ||
											testimonial.status ===
												'changes_requested' ||
											testimonial.status === 'rejected'
										}

											<button
												class="icon-btn submit"
												on:click={() =>
													submitFromCard(
														testimonial.id
													)}
											>
												<Send size={14} />
												Submit
											</button>

										{/if}


										{#if testimonial.status === 'draft'}

											<button
												class="icon-btn delete"
												on:click={() =>
													deleteTestimonial(
														testimonial.id
													)}
												title="Delete testimonial"
											>
												<Trash2 size={14} />
											</button>

										{/if}

									</div>

								</div>

							</div>

						{/each}

					</div>

				{/if}

			</section>

		</main>

	</div>

</div>


<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');


	* {
		box-sizing: border-box;
		font-family:
			'DM Sans',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
	}


	/* =========================
	   LAYOUT
	========================= */

	.dashboard {
		min-height: 100vh;

		display: flex;

		background: #f8fafc;
	}


	.content {
		flex: 1;

		min-width: 0;

		display: flex;

		flex-direction: column;
	}


	.page {
		width: 100%;

		max-width: 1500px;

		margin: 0 auto;

		padding: 30px 36px 50px;
	}


	/* =========================
	   PAGE HEADER
	========================= */

	.page-header {
		display: flex;

		align-items: center;

		justify-content: space-between;

		gap: 20px;

		margin-bottom: 28px;
	}


	.header-left {
		display: flex;

		align-items: center;

		gap: 14px;
	}


	.title-icon {
		width: 48px;
		height: 48px;

		flex-shrink: 0;

		border-radius: 12px;

		background: #eff6ff;

		color: #2563eb;

		display: flex;

		align-items: center;
		justify-content: center;

		border: 1px solid #dbeafe;
	}


	.page-header h1 {
		margin: 0;

		font-size: 25px;

		line-height: 1.2;

		font-weight: 800;

		color: #0f172a;

		letter-spacing: -0.02em;
	}


	.page-header p {
		margin: 5px 0 0;

		font-size: 13px;

		color: #64748b;
	}


	/* =========================
	   BUTTONS
	========================= */

	button {
		font-family: inherit;
	}


	.primary-btn {
		display: inline-flex;

		align-items: center;

		justify-content: center;

		gap: 7px;

		padding: 10px 16px;

		border: none;

		border-radius: 8px;

		background: #2563eb;

		color: #ffffff;

		font-size: 13px;

		font-weight: 700;

		cursor: pointer;

		transition: all 0.2s ease;

		box-shadow:
			0 3px 8px rgba(37, 99, 235, 0.16);
	}


	.primary-btn:hover {
		background: #1d4ed8;

		transform: translateY(-1px);

		box-shadow:
			0 5px 12px rgba(37, 99, 235, 0.22);
	}


	/* =========================
	   STATS
	========================= */

	.stats-grid {
		display: grid;

		grid-template-columns:
			repeat(4, minmax(0, 1fr));

		gap: 14px;

		margin-bottom: 28px;
	}


	.stat-card {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 12px;

		padding: 17px;

		display: flex;

		align-items: center;

		gap: 12px;

		box-shadow:
			0 1px 3px rgba(15, 23, 42, 0.03);
	}


	.stat-icon {
		width: 38px;
		height: 38px;

		border-radius: 9px;

		display: flex;

		align-items: center;
		justify-content: center;

		flex-shrink: 0;
	}


	.stat-icon.blue {
		background: #eff6ff;
		color: #2563eb;
	}


	.stat-icon.green {
		background: #f0fdf4;
		color: #16a34a;
	}


	.stat-icon.amber {
		background: #fffbeb;
		color: #d97706;
	}


	.stat-icon.red {
		background: #fef2f2;
		color: #dc2626;
	}


	.stat-card p {
		margin: 0 0 2px;

		font-size: 11px;

		font-weight: 600;

		color: #64748b;
	}


	.stat-card strong {
		font-size: 22px;

		font-weight: 800;

		color: #0f172a;
	}


	/* =========================
	   FORM
	========================= */

	.form-card {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 14px;

		padding: 24px;

		margin-bottom: 32px;

		box-shadow:
			0 3px 10px rgba(15, 23, 42, 0.04);
	}


	.form-header {
		display: flex;

		align-items: flex-start;

		justify-content: space-between;

		gap: 15px;

		margin-bottom: 22px;

		padding-bottom: 18px;

		border-bottom: 1px solid #f1f5f9;
	}


	.form-header h2 {
		margin: 0;

		font-size: 18px;

		font-weight: 750;

		color: #0f172a;
	}


	.form-header p {
		margin: 5px 0 0;

		color: #64748b;

		font-size: 13px;
	}


	.form-icon {
		width: 40px;
		height: 40px;

		border-radius: 9px;

		background: #eff6ff;

		color: #2563eb;

		display: flex;

		align-items: center;
		justify-content: center;
	}


	.form-grid {
		display: grid;

		grid-template-columns:
			repeat(2, minmax(0, 1fr));

		gap: 18px;
	}


	.field {
		margin-bottom: 17px;
	}


	label {
		display: block;

		margin-bottom: 7px;

		color: #334155;

		font-size: 12px;

		font-weight: 700;
	}


	label span {
		color: #dc2626;
	}


	input,
	textarea {
		width: 100%;

		border: 1px solid #dbe2ea;

		border-radius: 8px;

		padding: 10px 12px;

		background: #ffffff;

		color: #0f172a;

		font-family: inherit;

		font-size: 13px;

		outline: none;

		transition:
			border-color 0.2s,
			box-shadow 0.2s;

		resize: vertical;
	}


	input:focus,
	textarea:focus {
		border-color: #2563eb;

		box-shadow:
			0 0 0 3px rgba(37, 99, 235, 0.08);
	}


	textarea {
		min-height: 150px;
	}


	.upload-box {
		position: relative;

		display: flex;

		align-items: center;

		gap: 10px;

		border: 1px dashed #cbd5e1;

		border-radius: 9px;

		padding: 12px;

		color: #64748b;

		background: #f8fafc;

		overflow: hidden;
	}


	.upload-box strong {
		display: block;

		font-size: 12px;

		color: #334155;
	}


	.upload-box span {
		display: block;

		font-size: 11px;

		margin-top: 2px;

		color: #94a3b8;
	}


	.upload-box input {
		position: absolute;

		inset: 0;

		width: 100%;

		height: 100%;

		opacity: 0;

		cursor: pointer;
	}


	.file-selected {
		font-size: 11px;

		color: #16a34a;

		margin: 6px 0 0;

		font-weight: 600;
	}


	.character-count {
		text-align: right;

		margin-top: 5px;

		font-size: 11px;

		color: #94a3b8;
	}


	.form-message {
		display: flex;

		align-items: center;

		gap: 8px;

		padding: 10px 12px;

		border-radius: 8px;

		background: #fff7ed;

		border: 1px solid #fed7aa;

		color: #c2410c;

		font-size: 12px;

		margin-bottom: 16px;
	}


	.form-actions {
		display: flex;

		justify-content: flex-end;

		gap: 9px;

		padding-top: 4px;
	}


	.secondary-btn {
		border: 1px solid #dbe2ea;

		background: #ffffff;

		color: #475569;

		border-radius: 8px;

		padding: 9px 15px;

		font-size: 12px;

		font-weight: 700;

		cursor: pointer;
	}


	.secondary-btn:hover {
		background: #f8fafc;
	}


	.submit-btn {
		display: inline-flex;

		align-items: center;

		gap: 7px;

		border: none;

		background: #2563eb;

		color: white;

		border-radius: 8px;

		padding: 9px 16px;

		font-size: 12px;

		font-weight: 700;

		cursor: pointer;
	}


	.submit-btn:hover {
		background: #1d4ed8;
	}


	.submit-btn:disabled,
	.secondary-btn:disabled {
		opacity: 0.6;

		cursor: not-allowed;
	}


	/* =========================
	   LIST SECTION
	========================= */

	.list-section {
		margin-top: 4px;
	}


	.section-header {
		display: flex;

		align-items: center;

		justify-content: space-between;

		margin-bottom: 15px;

		gap: 15px;
	}


	.section-header h2 {
		margin: 0;

		font-size: 18px;

		font-weight: 750;

		color: #0f172a;
	}


	.section-header p {
		margin: 4px 0 0;

		font-size: 12px;

		color: #64748b;
	}


	.refresh-btn {
		display: inline-flex;

		align-items: center;

		gap: 6px;

		border: 1px solid #dbe2ea;

		background: #ffffff;

		color: #475569;

		border-radius: 8px;

		padding: 8px 12px;

		font-size: 12px;

		font-weight: 600;

		cursor: pointer;
	}


	.refresh-btn:hover {
		background: #f8fafc;

		color: #2563eb;
	}


	/* =========================
	   TESTIMONIAL CARDS
	========================= */

	.testimonial-grid {
		display: grid;

		grid-template-columns:
			repeat(2, minmax(0, 1fr));

		gap: 16px;
	}


	.testimonial-card {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 12px;

		padding: 18px;

		box-shadow:
			0 1px 3px rgba(15, 23, 42, 0.03);

		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}


	.testimonial-card:hover {
		transform: translateY(-2px);

		box-shadow:
			0 7px 18px rgba(15, 23, 42, 0.07);
	}


	.testimonial-top {
		display: flex;

		align-items: flex-start;

		justify-content: space-between;

		gap: 12px;

		margin-bottom: 14px;
	}


	.person {
		display: flex;

		align-items: center;

		gap: 10px;

		min-width: 0;
	}


	.avatar {
		width: 40px;
		height: 40px;

		border-radius: 50%;

		object-fit: cover;

		flex-shrink: 0;

		border: 2px solid #e0e7ff;
	}


	.avatar.initials {
		display: flex;

		align-items: center;
		justify-content: center;

		background: #eff6ff;

		color: #2563eb;

		font-size: 15px;

		font-weight: 800;
	}


	.person h3 {
		margin: 0;

		font-size: 14px;

		font-weight: 700;

		color: #0f172a;

		white-space: nowrap;

		overflow: hidden;

		text-overflow: ellipsis;
	}


	.person p {
		margin: 2px 0 0;

		font-size: 11px;

		color: #64748b;
	}


	.status-badge {
		display: inline-flex;

		align-items: center;

		padding: 5px 9px;

		border-radius: 6px;

		font-size: 10px;

		font-weight: 700;

		white-space: nowrap;

		text-transform: uppercase;
	}


	.status-submitted {
		background: #eff6ff;

		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.status-published {
		background: #f0fdf4;

		color: #16a34a;

		border: 1px solid #dcfce7;
	}


	.status-changes {
		background: #fffbeb;

		color: #d97706;

		border: 1px solid #fde68a;
	}


	.status-rejected {
		background: #fef2f2;

		color: #dc2626;

		border: 1px solid #fecaca;
	}


	.status-draft {
		background: #f8fafc;

		color: #64748b;

		border: 1px solid #e2e8f0;
	}


	.quote-mark {
		font-size: 32px;

		line-height: 20px;

		color: #bfdbfe;

		font-weight: 800;
	}


	.testimonial-content {
		margin: 4px 0 18px;

		color: #475569;

		font-size: 13px;

		line-height: 1.7;
	}


	.feedback-box {
		background: #fffbeb;

		border: 1px solid #fde68a;

		border-radius: 8px;

		padding: 10px 12px;

		margin-bottom: 15px;
	}


	.feedback-title {
		display: flex;

		align-items: center;

		gap: 6px;

		color: #92400e;

		font-size: 11px;

		font-weight: 700;

		margin-bottom: 4px;
	}


	.feedback-box p {
		margin: 0;

		color: #92400e;

		font-size: 12px;

		line-height: 1.5;
	}


	.testimonial-footer {
		display: flex;

		align-items: center;

		justify-content: space-between;

		gap: 10px;

		padding-top: 12px;

		border-top: 1px solid #f1f5f9;
	}


	.date {
		font-size: 11px;

		color: #94a3b8;
	}


	.card-actions {
		display: flex;

		align-items: center;

		gap: 6px;
	}


	.icon-btn {
		display: inline-flex;

		align-items: center;

		gap: 5px;

		border-radius: 6px;

		padding: 6px 9px;

		font-size: 10px;

		font-weight: 700;

		cursor: pointer;

		border: 1px solid transparent;
	}


	.icon-btn.edit {
		background: #eff6ff;

		color: #2563eb;

		border-color: #dbeafe;
	}


	.icon-btn.edit:hover {
		background: #dbeafe;
	}


	.icon-btn.submit {
		background: #f0fdf4;

		color: #16a34a;

		border-color: #dcfce7;
	}


	.icon-btn.submit:hover {
		background: #dcfce7;
	}


	.icon-btn.delete {
		background: #fef2f2;

		color: #dc2626;

		border-color: #fecaca;
	}


	.icon-btn.delete:hover {
		background: #fee2e2;
	}


	/* =========================
	   EMPTY STATE
	========================= */

	.empty-state {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 12px;

		padding: 55px 25px;

		text-align: center;

		display: flex;

		flex-direction: column;

		align-items: center;

		box-shadow:
			0 1px 3px rgba(15, 23, 42, 0.03);
	}


	.empty-icon {
		width: 58px;
		height: 58px;

		border-radius: 50%;

		background: #eff6ff;

		color: #2563eb;

		display: flex;

		align-items: center;
		justify-content: center;

		margin-bottom: 14px;
	}


	.empty-state h3 {
		margin: 0 0 6px;

		font-size: 16px;

		font-weight: 700;

		color: #0f172a;
	}


	.empty-state p {
		margin: 0 0 18px;

		max-width: 430px;

		color: #64748b;

		font-size: 13px;

		line-height: 1.6;
	}


	.loading-icon {
		color: #2563eb;

		animation: spin 1s linear infinite;

		margin-bottom: 10px;
	}


	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}


	/* =========================
	   RESPONSIVE
	========================= */

	@media (max-width: 1100px) {
		.stats-grid {
			grid-template-columns:
				repeat(2, minmax(0, 1fr));
		}

		.testimonial-grid {
			grid-template-columns: 1fr;
		}
	}


	@media (max-width: 768px) {
		.page {
			padding: 24px 18px 40px;
		}

		.page-header {
			align-items: flex-start;

			flex-direction: column;
		}

		.primary-btn {
			width: 100%;
		}

		.stats-grid {
			grid-template-columns: 1fr 1fr;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}
	}


	@media (max-width: 500px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.testimonial-top {
			flex-direction: column;
		}

		.testimonial-footer {
			align-items: flex-start;

			flex-direction: column;
		}

		.card-actions {
			width: 100%;
		}

		.page-header h1 {
			font-size: 22px;
		}
	}
</style>