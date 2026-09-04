<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import toast from 'svelte-french-toast';

	import {
		MessageSquare,
		Send,
		Clock,
		CheckCircle2,
		XCircle,
		AlertCircle,
		Edit3,
		Trash2,
		ArrowLeft,
		User
	} from 'lucide-svelte';


	type Testimonial = {
		id: string;
		user_id: string;
		name: string;
		designation: string | null;
		content: string;
		featured_image?: string | null;
		status: string;
		admin_feedback?: string | null;
		created_at: string;
		updated_at?: string | null;
	};


	let user: any = null;

	let testimonials: Testimonial[] = [];

	let loading = true;
	let submitting = false;

	let showForm = false;

	let editingTestimonial: Testimonial | null = null;

	let name = '';
	let designation = '';
	let content = '';

	let photo: File | null = null;

	let message = '';


	/* =========================
	   AUTHENTICATION
	========================= */

	onMount(async () => {
		const {
			data: { user: authUser }
		} = await cmsSupabase.auth.getUser();


		if (!authUser) {
			goto('/cms/login');
			return;
		}


		user = authUser;

		await loadTestimonials();
	});


	/* =========================
	   LOAD USER TESTIMONIALS
	========================= */

	async function loadTestimonials() {
		if (!user) return;

		loading = true;

		const { data, error } = await cmsSupabase
			.from('testimonials')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });


		if (error) {
			console.error('Load testimonials error:', error);

			toast.error(
				'Could not load your testimonials.'
			);

			testimonials = [];
		} else {
			testimonials = data ?? [];
		}

		loading = false;
	}


	/* =========================
	   FORM
	========================= */

	function openForm() {
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


	function closeForm() {
		showForm = false;

		editingTestimonial = null;

		name = '';
		designation = '';
		content = '';

		photo = null;

		message = '';
	}


	function startEdit(testimonial: Testimonial) {
		if (
			testimonial.status !== 'submitted' &&
			testimonial.status !== 'changes_requested'
		) {
			return;
		}

		editingTestimonial = testimonial;

		name = testimonial.name;

		designation =
			testimonial.designation || '';

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
		const target =
			event.target as HTMLInputElement;

		if (
			target.files &&
			target.files.length > 0
		) {
			photo = target.files[0];
		}
	}


	/* =========================
	   SAVE / SUBMIT
	========================= */

	async function submitTestimonial() {
		message = '';

		if (!name.trim()) {
			message = 'Please enter your name.';
			return;
		}

		if (!content.trim()) {
			message =
				'Please write your testimonial.';
			return;
		}

		if (!user) {
			message =
				'You must be logged in to submit a testimonial.';
			return;
		}

		submitting = true;


		try {
			let imageUrl =
				editingTestimonial?.featured_image ||
				null;


			/* IMAGE UPLOAD */

			if (photo) {
				const safeFileName =
					photo.name.replace(
						/[^a-zA-Z0-9.\-_]/g,
						''
					);

				const fileName =
					`${Date.now()}-${safeFileName}`;


				const { error: uploadError } =
					await cmsSupabase.storage
						.from('cms-images')
						.upload(
							fileName,
							photo
						);


				if (uploadError) {
					throw new Error(
						`Image upload failed: ${uploadError.message}`
					);
				}


				const {
					data: urlData
				} = cmsSupabase.storage
					.from('cms-images')
					.getPublicUrl(fileName);


				imageUrl =
					urlData.publicUrl;
			}


			const payload: any = {
				name: name.trim(),

				designation:
					designation.trim() || null,

				content: content.trim(),

				status: 'submitted'
			};


			if (imageUrl) {
				payload.featured_image =
					imageUrl;
			}


			/* EDIT EXISTING */

			if (editingTestimonial) {

				payload.admin_feedback = null;

				payload.updated_at =
					new Date().toISOString();


				const { error } =
					await cmsSupabase
						.from('testimonials')
						.update(payload)
						.eq(
							'id',
							editingTestimonial.id
						)
						.eq(
							'user_id',
							user.id
						);


				if (error) {
					throw error;
				}


				toast.success(
					'Testimonial updated and resubmitted!'
				);

			}

			/* CREATE NEW */

			else {

				payload.user_id =
					user.id;


				const { error } =
					await cmsSupabase
						.from('testimonials')
						.insert([
							payload
						]);


				if (error) {
					throw error;
				}


				toast.success(
					'Testimonial submitted for review!'
				);

				// Send notification to Admins specifically
				fetch('/api/notifications/testimonial', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: payload.name })
				}).catch(console.error);
			}


			closeForm();

			await loadTestimonials();

		} catch (error: any) {

			console.error(
				'Testimonial error:',
				error
			);

			message =
				error?.message ||
				'Something went wrong while submitting your testimonial.';

			toast.error(message);

		} finally {

			submitting = false;
		}
	}


	/* =========================
	   DELETE
	========================= */

	async function deleteTestimonial(
		id: string
	) {
		const confirmed = confirm(
			'Are you sure you want to delete this testimonial?'
		);

		if (!confirmed) return;


		const { error } =
			await cmsSupabase
				.from('testimonials')
				.delete()
				.eq('id', id)
				.eq('user_id', user.id);


		if (error) {

			console.error(
				'Delete testimonial error:',
				error
			);

			toast.error(
				'Could not delete testimonial.'
			);

			return;
		}


		toast.success(
			'Testimonial deleted successfully.'
		);


		await loadTestimonials();
	}


	/* =========================
	   STATUS
	========================= */

	function getStatusLabel(
		status: string
	) {
		switch (status) {

			case 'submitted':
				return 'Pending Review';

			case 'published':
				return 'Published';

			case 'rejected':
				return 'Rejected';

			case 'changes_requested':
				return 'Changes Requested';

			case 'draft':
				return 'Draft';

			default:
				return status;
		}
	}


	function formatDate(
		date: string
	) {
		if (!date) return '';

		return new Intl.DateTimeFormat(
			'en-IN',
			{
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			}
		).format(new Date(date));
	}


	function canEdit(
		status: string
	) {
		return (
			status === 'submitted' ||
			status === 'changes_requested'
		);
	}


	function getStatusIcon(
		status: string
	) {
		if (status === 'published') {
			return CheckCircle2;
		}

		if (status === 'rejected') {
			return XCircle;
		}

		if (
			status ===
			'changes_requested'
		) {
			return AlertCircle;
		}

		return Clock;
	}
</script>


<svelte:head>
	<title>My Testimonials | JCF</title>
</svelte:head>


<div class="page">

	<div class="container">

		<!-- =========================
		     HEADER
		========================= -->

		<div class="top-header">

			<a
				href="/cms/doctor-dashboard"
				class="back-link"
			>
				<ArrowLeft size={16} />

				<span>Back to Dashboard</span>
			</a>


			<div class="header-main">

				<div class="header-icon">
					<MessageSquare size={25} />
				</div>


				<div>
					<div class="eyebrow">
						COMMUNITY
					</div>

					<h1>
						My Testimonials
					</h1>

					<p>
						Share your experience with
						Jarurat Care Foundation.
					</p>
				</div>

			</div>


			<button
				class="primary-button"
				on:click={openForm}
			>
				<MessageSquare size={16} />

				Write Testimonial
			</button>

		</div>


		<!-- =========================
		     FORM
		========================= -->

		{#if showForm}

			<section class="form-card">

				<div class="form-header">

					<div>
						<span class="section-label">
							{editingTestimonial
								? 'EDIT TESTIMONIAL'
								: 'NEW TESTIMONIAL'}
						</span>

						<h2>
							{editingTestimonial
								? 'Update Your Experience'
								: 'Share Your Experience'}
						</h2>

						<p>
							Your testimonial will be reviewed
							by the Jarurat Care CMS team before
							it appears on the website.
						</p>
					</div>


					<button
						class="close-button"
						on:click={closeForm}
						type="button"
					>
						Cancel
					</button>

				</div>


				<div class="form-body">

					<div class="form-grid">

						<div class="field">

							<label for="name">
								Name
							</label>

							<input
								id="name"
								type="text"
								bind:value={name}
								placeholder="Enter your name"
							/>

						</div>


						<div class="field">

							<label for="designation">
								Designation
								<span>(Optional)</span>
							</label>

							<input
								id="designation"
								type="text"
								bind:value={designation}
								placeholder="e.g. Patient, Doctor, Student"
							/>

						</div>

					</div>


					<div class="field">

						<label for="testimonial">
							Your Testimonial
						</label>

						<textarea
							id="testimonial"
							bind:value={content}
							rows="7"
							placeholder="Tell us about your experience with Jarurat Care..."
						></textarea>

						<div class="character-info">
							{content.length} characters
						</div>

					</div>


					<div class="field">

						<label for="photo">
							Photo
							<span>(Optional)</span>
						</label>

						<input
							id="photo"
							type="file"
							accept="image/*"
							on:change={handlePhotoUpload}
						/>

						<p class="field-help">
							You can optionally add a profile
							photo that may be displayed with
							your testimonial.
						</p>

					</div>


					{#if message}

						<div class="form-message">
							<AlertCircle size={16} />

							<span>
								{message}
							</span>
						</div>

					{/if}


					<div class="form-actions">

						<button
							type="button"
							class="secondary-button"
							on:click={closeForm}
							disabled={submitting}
						>
							Cancel
						</button>


						<button
							type="button"
							class="primary-button"
							on:click={submitTestimonial}
							disabled={submitting}
						>

							{#if submitting}

								<span class="spinner"></span>

								Submitting...

							{:else}

								<Send size={16} />

								{editingTestimonial
									? 'Resubmit Testimonial'
									: 'Submit for Review'}

							{/if}

						</button>

					</div>

				</div>

			</section>

		{/if}


		<!-- =========================
		     INFO
		========================= -->

		<section class="info-card">

			<div class="info-icon">
				<Clock size={19} />
			</div>

			<div>

				<strong>
					How testimonials work
				</strong>

				<p>
					Submit your testimonial and our CMS team
					will review it. Once approved, it will be
					published on the Jarurat Care website.
				</p>

			</div>

		</section>


		<!-- =========================
		     MY TESTIMONIALS
		========================= -->

		<section class="list-section">

			<div class="section-heading">

				<div>
					<span class="section-label">
						YOUR SUBMISSIONS
					</span>

					<h2>
						My Testimonials
					</h2>

					<p>
						Track the status of testimonials
						you have submitted.
					</p>
				</div>


				<div class="count-badge">
					{testimonials.length}
					{testimonials.length === 1
						? ' Submission'
						: ' Submissions'}
				</div>

			</div>


			{#if loading}

				<div class="state-card">

					<div class="loader"></div>

					<p>
						Loading your testimonials...
					</p>

				</div>


			{:else if testimonials.length === 0}

				<div class="state-card empty">

					<div class="empty-icon">
						<MessageSquare size={28} />
					</div>

					<h3>
						No testimonials yet
					</h3>

					<p>
						Share your experience with
						Jarurat Care and it will appear
						here after submission.
					</p>

					<button
						class="primary-button"
						on:click={openForm}
					>
						<MessageSquare size={16} />

						Write Your First Testimonial
					</button>

				</div>


			{:else}

				<div class="testimonial-list">

					{#each testimonials as testimonial}

						{@const StatusIcon =
							getStatusIcon(
								testimonial.status
							)}

						<article class="testimonial-card">

							<div class="testimonial-card-top">

								<div class="person">

									<div class="avatar">

										{#if testimonial.featured_image}

											<img
												src={testimonial.featured_image}
												alt={testimonial.name}
											/>

										{:else}

											<User size={20} />

										{/if}

									</div>


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


								<div
									class:status-submitted={
										testimonial.status ===
										'submitted'
									}
									class:status-published={
										testimonial.status ===
										'published'
									}
									class:status-rejected={
										testimonial.status ===
										'rejected'
									}
									class:status-changes={
										testimonial.status ===
										'changes_requested'
									}
									class="status"
								>

									<StatusIcon
										size={14}
									/>

									{getStatusLabel(
										testimonial.status
									)}

								</div>

							</div>


							<div class="quote">
								“{testimonial.content}”
							</div>


							<div class="testimonial-footer">

								<span class="date">
									Submitted
									{formatDate(
										testimonial.created_at
									)}
								</span>


								<div class="card-actions">

									{#if canEdit(
										testimonial.status
									)}

										<button
											class="icon-button edit"
											on:click={() =>
												startEdit(
													testimonial
												)
											}
											title="Edit testimonial"
										>
											<Edit3 size={15} />
											Edit
										</button>

									{/if}


									{#if testimonial.status !== 'published'}

										<button
											class="icon-button delete"
											on:click={() =>
												deleteTestimonial(
													testimonial.id
												)
											}
											title="Delete testimonial"
										>
											<Trash2 size={15} />
											Delete
										</button>

									{/if}

								</div>

							</div>


							{#if testimonial.status === 'changes_requested' && testimonial.admin_feedback}

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


							{#if testimonial.status === 'rejected'}
								<div class="rejected-box">
									<XCircle size={15} />
									<p>
										This testimonial was not
										approved for publication.
										{#if testimonial.admin_feedback}
											<br/><span style="opacity: 0.8; font-size: 0.9em; margin-top: 4px; display: inline-block;">Reason: {testimonial.admin_feedback}</span>
										{/if}
									</p>
								</div>
							{/if}


							{#if testimonial.status === 'published'}

								<div class="published-box">

									<CheckCircle2 size={15} />

									<p>
										Your testimonial has been
										approved and published.
									</p>

								</div>

							{/if}

						</article>

					{/each}

				</div>

			{/if}

		</section>

	</div>
</div>


<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');


	:global(*) {
		box-sizing: border-box;
	}


	:global(body) {
		margin: 0;

		font-family:
			'DM Sans',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;

		background: #f5f7fb;

		color: #0f172a;
	}


	.page {
		min-height: 100vh;

		background:
			linear-gradient(
				180deg,
				#f8fafc 0%,
				#f5f7fb 100%
			);

		padding: 100px 24px 60px;
	}


	.container {
		width: 100%;
		max-width: 1000px;

		margin: 0 auto;

		display: flex;
		flex-direction: column;

		gap: 20px;
	}


	/* HEADER */

	.top-header {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 14px;

		padding: 20px 22px;

		box-shadow:
			0 2px 8px rgba(15, 23, 42, 0.04);
	}


	.back-link {
		display: inline-flex;

		align-items: center;

		gap: 6px;

		color: #64748b;

		text-decoration: none;

		font-size: 12px;

		font-weight: 600;

		margin-bottom: 18px;
	}


	.back-link:hover {
		color: #2563eb;
	}


	.header-main {
		display: flex;

		align-items: center;

		gap: 14px;
	}


	.header-icon {
		width: 50px;
		height: 50px;

		flex-shrink: 0;

		display: flex;

		align-items: center;
		justify-content: center;

		border-radius: 12px;

		background: #eff6ff;

		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.eyebrow {
		font-size: 10px;

		font-weight: 800;

		letter-spacing: 0.08em;

		color: #2563eb;

		margin-bottom: 4px;
	}


	h1 {
		margin: 0;

		font-size: 25px;

		font-weight: 800;

		color: #0f172a;
	}


	.header-main p {
		margin: 4px 0 0;

		font-size: 13px;

		color: #64748b;
	}


	.top-header > .primary-button {
		margin-top: 20px;
	}


	/* BUTTONS */

	.primary-button {
		display: inline-flex;

		align-items: center;
		justify-content: center;

		gap: 7px;

		border: none;

		border-radius: 8px;

		padding: 10px 15px;

		background: #2563eb;

		color: #ffffff;

		font-family: inherit;

		font-size: 12px;

		font-weight: 700;

		cursor: pointer;

		box-shadow:
			0 3px 8px rgba(37, 99, 235, 0.18);

		transition: 0.2s ease;
	}


	.primary-button:hover {
		background: #1d4ed8;

		transform: translateY(-1px);
	}


	.primary-button:disabled {
		opacity: 0.6;

		cursor: not-allowed;

		transform: none;
	}


	.secondary-button,
	.close-button {
		display: inline-flex;

		align-items: center;

		justify-content: center;

		padding: 10px 15px;

		border-radius: 8px;

		border: 1px solid #cbd5e1;

		background: #ffffff;

		color: #475569;

		font-family: inherit;

		font-size: 12px;

		font-weight: 700;

		cursor: pointer;
	}


	.close-button {
		padding: 8px 13px;
	}


	/* FORM */

	.form-card {
		background: #ffffff;

		border: 1px solid #dbeafe;

		border-radius: 14px;

		box-shadow:
			0 2px 10px rgba(15, 23, 42, 0.05);

		overflow: hidden;
	}


	.form-header {
		display: flex;

		align-items: flex-start;

		justify-content: space-between;

		gap: 20px;

		padding: 22px 24px;

		border-bottom: 1px solid #e2e8f0;
	}


	.section-label {
		display: block;

		margin-bottom: 5px;

		font-size: 10px;

		font-weight: 800;

		letter-spacing: 0.08em;

		color: #64748b;
	}


	.form-header h2 {
		margin: 0;

		font-size: 19px;

		font-weight: 750;

		color: #0f172a;
	}


	.form-header p {
		margin: 5px 0 0;

		font-size: 12px;

		line-height: 1.5;

		color: #64748b;

		max-width: 650px;
	}


	.form-body {
		padding: 24px;
	}


	.form-grid {
		display: grid;

		grid-template-columns:
			repeat(2, minmax(0, 1fr));

		gap: 18px;
	}


	.field {
		display: flex;

		flex-direction: column;

		gap: 7px;

		margin-bottom: 18px;
	}


	.field label {
		font-size: 12px;

		font-weight: 700;

		color: #334155;
	}


	.field label span {
		font-weight: 500;

		color: #94a3b8;
	}


	input,
	textarea {
		width: 100%;

		border: 1px solid #cbd5e1;

		border-radius: 8px;

		padding: 11px 12px;

		background: #ffffff;

		color: #0f172a;

		font-family: inherit;

		font-size: 13px;

		outline: none;

		transition: 0.2s ease;
	}


	input:focus,
	textarea:focus {
		border-color: #2563eb;

		box-shadow:
			0 0 0 3px rgba(37, 99, 235, 0.08);
	}


	textarea {
		resize: vertical;

		min-height: 150px;

		line-height: 1.6;
	}


	input[type='file'] {
		padding: 9px;

		background: #f8fafc;
	}


	.field-help {
		margin: 0;

		font-size: 11px;

		color: #94a3b8;
	}


	.character-info {
		text-align: right;

		font-size: 10px;

		color: #94a3b8;
	}


	.form-message {
		display: flex;

		align-items: center;

		gap: 8px;

		padding: 11px 13px;

		background: #fff7ed;

		border: 1px solid #fed7aa;

		border-radius: 8px;

		color: #c2410c;

		font-size: 12px;

		margin-bottom: 16px;
	}


	.form-actions {
		display: flex;

		justify-content: flex-end;

		gap: 10px;

		padding-top: 4px;
	}


	.spinner {
		width: 13px;

		height: 13px;

		border: 2px solid rgba(255,255,255,0.4);

		border-top-color: #ffffff;

		border-radius: 50%;

		animation: spin 0.7s linear infinite;
	}


	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}


	/* INFO */

	.info-card {
		display: flex;

		align-items: flex-start;

		gap: 12px;

		padding: 16px 18px;

		background: #eff6ff;

		border: 1px solid #dbeafe;

		border-radius: 12px;

		color: #1e40af;
	}


	.info-icon {
		width: 34px;
		height: 34px;

		flex-shrink: 0;

		display: flex;

		align-items: center;
		justify-content: center;

		background: #ffffff;

		border: 1px solid #dbeafe;

		border-radius: 8px;
	}


	.info-card strong {
		display: block;

		font-size: 12px;

		margin-bottom: 3px;
	}


	.info-card p {
		margin: 0;

		font-size: 11px;

		line-height: 1.5;

		color: #3b5998;
	}


	/* LIST */

	.list-section {
		display: flex;

		flex-direction: column;

		gap: 12px;
	}


	.section-heading {
		display: flex;

		align-items: flex-end;

		justify-content: space-between;

		gap: 20px;
	}


	.section-heading h2 {
		margin: 0;

		font-size: 19px;

		font-weight: 750;

		color: #0f172a;
	}


	.section-heading p {
		margin: 3px 0 0;

		font-size: 12px;

		color: #64748b;
	}


	.count-badge {
		padding: 7px 11px;

		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 7px;

		color: #475569;

		font-size: 11px;

		font-weight: 700;
	}


	.state-card {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 13px;

		padding: 50px 25px;

		text-align: center;

		color: #64748b;
	}


	.state-card p {
		font-size: 13px;
	}


	.empty-icon {
		width: 55px;
		height: 55px;

		margin: 0 auto 13px;

		display: flex;

		align-items: center;
		justify-content: center;

		background: #eff6ff;

		border: 1px solid #dbeafe;

		border-radius: 50%;

		color: #2563eb;
	}


	.state-card h3 {
		margin: 0;

		font-size: 16px;

		color: #0f172a;
	}


	.state-card .primary-button {
		margin-top: 12px;
	}


	.loader {
		width: 25px;

		height: 25px;

		margin: 0 auto;

		border: 3px solid #dbeafe;

		border-top-color: #2563eb;

		border-radius: 50%;

		animation: spin 0.8s linear infinite;
	}


	/* TESTIMONIAL CARDS */

	.testimonial-list {
		display: flex;

		flex-direction: column;

		gap: 12px;
	}


	.testimonial-card {
		background: #ffffff;

		border: 1px solid #e2e8f0;

		border-radius: 13px;

		padding: 19px 20px;

		box-shadow:
			0 2px 7px rgba(15, 23, 42, 0.035);
	}


	.testimonial-card-top {
		display: flex;

		align-items: flex-start;

		justify-content: space-between;

		gap: 20px;
	}


	.person {
		display: flex;

		align-items: center;

		gap: 11px;
	}


	.avatar {
		width: 40px;
		height: 40px;

		display: flex;

		align-items: center;
		justify-content: center;

		overflow: hidden;

		border-radius: 50%;

		background: #eff6ff;

		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.avatar img {
		width: 100%;
		height: 100%;

		object-fit: cover;
	}


	.person h3 {
		margin: 0;

		font-size: 13px;

		font-weight: 750;

		color: #0f172a;
	}


	.person p {
		margin: 2px 0 0;

		font-size: 11px;

		color: #64748b;
	}


	.status {
		display: inline-flex;

		align-items: center;

		gap: 5px;

		padding: 5px 9px;

		border-radius: 6px;

		font-size: 10px;

		font-weight: 700;

		white-space: nowrap;
	}


	.status-submitted {
		background: #eff6ff;

		color: #1d4ed8;

		border: 1px solid #dbeafe;
	}


	.status-published {
		background: #f0fdf4;

		color: #166534;

		border: 1px solid #dcfce7;
	}


	.status-rejected {
		background: #fef2f2;

		color: #991b1b;

		border: 1px solid #fecaca;
	}


	.status-changes {
		background: #fffbeb;

		color: #92400e;

		border: 1px solid #fde68a;
	}


	.quote {
		margin: 17px 0;

		padding-left: 14px;

		border-left: 3px solid #dbeafe;

		font-size: 13px;

		line-height: 1.7;

		color: #475569;
	}


	.testimonial-footer {
		display: flex;

		align-items: center;

		justify-content: space-between;

		gap: 15px;

		padding-top: 13px;

		border-top: 1px solid #f1f5f9;
	}


	.date {
		font-size: 10px;

		color: #94a3b8;
	}


	.card-actions {
		display: flex;

		align-items: center;

		gap: 6px;
	}


	.icon-button {
		display: inline-flex;

		align-items: center;

		gap: 5px;

		padding: 6px 9px;

		border-radius: 6px;

		font-family: inherit;

		font-size: 10px;

		font-weight: 700;

		cursor: pointer;

		background: #ffffff;
	}


	.icon-button.edit {
		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.icon-button.delete {
		color: #dc2626;

		border: 1px solid #fecaca;
	}


	.feedback-box {
		margin-top: 13px;

		padding: 11px 13px;

		background: #fffbeb;

		border: 1px solid #fde68a;

		border-radius: 8px;
	}


	.feedback-title {
		display: flex;

		align-items: center;

		gap: 6px;

		font-size: 11px;

		font-weight: 800;

		color: #92400e;

		margin-bottom: 4px;
	}


	.feedback-box p {
		margin: 0;

		font-size: 11px;

		line-height: 1.5;

		color: #78350f;
	}


	.published-box,
	.rejected-box {
		display: flex;

		align-items: center;

		gap: 7px;

		margin-top: 12px;

		padding: 9px 11px;

		border-radius: 7px;

		font-size: 11px;
	}


	.published-box {
		background: #f0fdf4;

		color: #166534;

		border: 1px solid #dcfce7;
	}


	.rejected-box {
		background: #fef2f2;

		color: #991b1b;

		border: 1px solid #fecaca;
	}


	.published-box p,
	.rejected-box p {
		margin: 0;
	}


	/* RESPONSIVE */

	@media (min-width: 700px) {
		.top-header {
			position: relative;
		}

		.top-header > .primary-button {
			position: absolute;

			right: 22px;

			bottom: 22px;

			margin: 0;
		}
	}


	@media (max-width: 700px) {

		.page {
			padding:
				90px
				16px
				40px;
		}


		.form-grid {
			grid-template-columns: 1fr;
			gap: 0;
		}


		.form-header {
			flex-direction: column;
		}


		.top-header > .primary-button {
			width: 100%;
		}


		.testimonial-card-top {
			flex-direction: column;
		}


		.testimonial-footer {
			align-items: flex-start;

			flex-direction: column;
		}


		.card-actions {
			width: 100%;
		}


		.icon-button {
			flex: 1;

			justify-content: center;
		}


		.section-heading {
			align-items: flex-start;

			flex-direction: column;
		}

	}
</style>
