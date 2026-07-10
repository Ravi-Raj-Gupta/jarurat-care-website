<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
 
	export let data: PageData;
	export let form: ActionData;
 
	const profile = data.profile;
 
	let roleToggle: 'Doctor' | 'Reader' = (profile?.role as 'Doctor' | 'Reader') || 'Doctor';
 
	// Basic Info (Common)
	let fullName = profile?.full_name || '';
	let email = profile?.email || data.userEmail || '';
 
	// Reader Specific
	let profession = profile?.profession || '';
	let location = profile?.location || '';
	let organization = profile?.organization || '';
 
	// Doctor Specific Basic Info
	let qualification = profile?.qualification || '';
	let designation = profile?.designation || '';
	let specialization = profile?.specialization || '';
	let affiliation = profile?.affiliation || '';
	let medicalRegId = profile?.medical_reg_id || '';
	let cityState = profile?.city_state || '';
 
	// Doctor Credentials
	let experience = profile?.experience || '';
	let patientsTreated = profile?.patients_treated || '';
	let publications = profile?.publications || '';
	let awards = profile?.awards || '';
	let citations = profile?.citations || '';
 
	// Bio (Common)
	let bio = profile?.bio || '';
 
	// Interests (Reader)
	const availableInterests = [
		'Cancer Care',
		'Medical Research',
		'Patient Stories',
		'Health & Wellness',
		'Clinical Trials',
		'Diet & Nutrition'
	];
	let interests: string[] = profile?.interests || [];
 
	// Expertise (Doctor)
	const availableExpertise = [
		'Colorectal Cancer',
		'Pancreatic Cancer',
		'Breast Cancer',
		'Lung Cancer',
		'Radiation Oncology',
		'Medical Oncology',
		'Gastric Cancer Treatment'
	];
	let expertise: string[] = profile?.expertise || [];
 
	// Photo upload state (UI preview only for now — not saved to Supabase Storage yet)
	let photoFile: File | null = null;
	let photoPreviewUrl: string | null = null;
	let fileInputRef: HTMLInputElement;
 
	function handlePhotoSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			photoFile = target.files[0];
			photoPreviewUrl = URL.createObjectURL(photoFile);
		}
	}
 
	function triggerPhotoUpload() {
		if (fileInputRef) fileInputRef.click();
	}
 
	// Notifications (Common)
	let emailNotifications = profile?.email_notifications ?? true;
	let newsletters = profile?.newsletters ?? false;
	let eventUpdates = profile?.event_updates ?? true;
 
	// Confirmation (Doctor)
	let isConfirmed = profile?.is_confirmed ?? false;
 
	// Which button was clicked, so we know whether to require the confirmation checkbox
	let submitting = false;
	let activeAction: 'save' | 'submit' | null = null;
</script>
 
<div class="page-container">
	<div class="card">
		<form
			method="POST"
			action={activeAction === 'submit' ? '?/submit' : '?/save'}
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			<!-- role is decided by the toggle below but needs to travel with the form -->
			<input type="hidden" name="role" value={roleToggle} />
 
			<div class="header">
				<h1 style="font-size: 32px; color: #1e40af; font-weight: 800; margin-bottom: 10px;">Complete Your Profile</h1>
				<p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">Please fill out all the necessary details below to complete your profile and unlock full access to the JCF platform.</p>
 
				<div class="role-toggle">
					<button type="button" class:active={roleToggle === 'Doctor'} on:click={() => (roleToggle = 'Doctor')}
						>Doctor</button
					>
					<button type="button" class:active={roleToggle === 'Reader'} on:click={() => (roleToggle = 'Reader')}
						>Reader</button
					>
				</div>
			</div>
 
			{#if form?.message}
				<div class="form-message" class:error={!form.success}>
					{form.message}
				</div>
			{/if}
			{#if form?.success}
				<div class="form-message success">
					{form.draft ? 'Draft saved!' : 'Profile submitted!'}
				</div>
			{/if}
 
			<h2 class="card-title">Complete Your Profile</h2>
 
			<!-- Section 1: Basic Information -->
			<div class="section border-box">
				<h3 class="section-title">1. Basic Information</h3>
 
				<!-- Common fields -->
				<div class="basic-info-grid">
					<div class="fields-col">
						<div class="field">
							<label for="fullName">Full Name <span>*</span></label>
							<input
								type="text"
								id="fullName"
								name="fullName"
								placeholder="E.g. Srimanyu M"
								bind:value={fullName}
								required
							/>
						</div>
						<div class="field">
							<label for="email">Email Address <span>*</span></label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="E.g. srimanyu@gmail.com"
								bind:value={email}
								required
							/>
						</div>
					</div>
					<div class="photo-col">
						<input
							type="file"
							accept="image/png, image/jpeg"
							bind:this={fileInputRef}
							on:change={handlePhotoSelect}
							style="display: none;"
						/>
 
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="photo-upload-box" on:click={triggerPhotoUpload}>
							{#if photoPreviewUrl}
								<img src={photoPreviewUrl} alt="Preview" class="photo-preview" />
							{:else}
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#6b7280"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
									<circle cx="8.5" cy="8.5" r="1.5"></circle>
									<polyline points="21 15 16 10 5 21"></polyline>
								</svg>
								<p>Upload photo</p>
								<span class="photo-hint">JPG/PNG (Max 2MB)</span>
							{/if}
						</div>
						<span class="photo-hint" style="display:block; margin-top:6px;">Photo upload coming soon</span>
					</div>
				</div>
 
				<!-- Role specific fields -->
				{#if roleToggle === 'Reader'}
					<div class="three-col-grid">
						<div class="field">
							<label for="profession">Profession <span>*</span></label>
							<input
								type="text"
								id="profession"
								name="profession"
								placeholder="E.g. Student"
								bind:value={profession}
								required
							/>
						</div>
						<div class="field">
							<label for="location">Location</label>
							<input type="text" id="location" name="location" placeholder="E.g. Pune" bind:value={location} />
						</div>
						<div class="field">
							<label for="organization">Organization</label>
							<input
								type="text"
								id="organization"
								name="organization"
								placeholder="E.g. Kennedy college"
								bind:value={organization}
							/>
						</div>
					</div>
				{:else}
					<div class="two-col-grid mb-16">
						<div class="field">
							<label for="qualification">Qualification <span>*</span></label>
							<input
								type="text"
								id="qualification"
								name="qualification"
								placeholder="E.g., MD (Radiation Oncology), DNB"
								bind:value={qualification}
								required
							/>
						</div>
						<div class="field">
							<label for="designation">Current Designation <span>*</span></label>
							<input
								type="text"
								id="designation"
								name="designation"
								placeholder="E.g. Senior Consultant"
								bind:value={designation}
								required
							/>
						</div>
					</div>
					<div class="two-col-grid mb-16">
						<div class="field">
							<label for="specialization">Specialization <span>*</span></label>
							<input
								type="text"
								id="specialization"
								name="specialization"
								placeholder="E.g. Gastrointestinal Medical Oncology"
								bind:value={specialization}
								required
							/>
						</div>
						<div class="field">
							<label for="affiliation">Hospital / Clinic Affiliation <span>*</span></label>
							<input
								type="text"
								id="affiliation"
								name="affiliation"
								placeholder="E.g., Fortis Hospital"
								bind:value={affiliation}
								required
							/>
						</div>
					</div>
					<div class="two-col-grid">
						<div class="field">
							<label for="medicalRegId">Medical Registration ID <span>*</span></label>
							<input
								type="text"
								id="medicalRegId"
								name="medicalRegId"
								placeholder="E.g. MCI-12345"
								bind:value={medicalRegId}
								required
							/>
						</div>
						<div class="field">
							<label for="cityState">City/ State</label>
							<input type="text" id="cityState" name="cityState" placeholder="E.g. New Delhi" bind:value={cityState} />
						</div>
					</div>
				{/if}
			</div>
 
			<!-- Doctor Section 2: Credentials and Statistics -->
			{#if roleToggle === 'Doctor'}
				<div class="section">
					<h3 class="section-title">2. Credentials and Statistics</h3>
					<div class="two-col-grid mb-16">
						<div class="field">
							<label for="experience">Years of Experience <span>*</span></label>
							<input
								type="text"
								id="experience"
								name="experience"
								placeholder="E.g. 18 Years"
								bind:value={experience}
								required
							/>
						</div>
						<div class="field">
							<label for="patientsTreated">Patients treated <span>*</span></label>
							<input
								type="text"
								id="patientsTreated"
								name="patientsTreated"
								placeholder="E.g. 1800+"
								bind:value={patientsTreated}
								required
							/>
						</div>
					</div>
					<div class="three-col-grid">
						<div class="field">
							<label for="publications">Publications <span>*</span></label>
							<input
								type="text"
								id="publications"
								name="publications"
								placeholder="E.g. 52"
								bind:value={publications}
								required
							/>
						</div>
						<div class="field">
							<label for="awards">Number of Awards <span>*</span></label>
							<input type="text" id="awards" name="awards" placeholder="E.g. 16" bind:value={awards} required />
						</div>
						<div class="field">
							<label for="citations">Citations</label>
							<input type="text" id="citations" name="citations" placeholder="E.g. 12" bind:value={citations} />
						</div>
					</div>
				</div>
			{/if}
 
			<!-- Bio Section -->
			<div class="section">
				<h3 class="section-title">
					{roleToggle === 'Doctor' ? '3. About The Doctor' : '2. About The Reader'}
				</h3>
				<h4 class="sub-title">Short Bio</h4>
				<div class="textarea-wrapper">
					<textarea
						name="bio"
						placeholder={roleToggle === 'Doctor'
							? 'Dr. Gupta specializes in colorectal, gastric, and pancreatic cancer with over 1800 patients treated across 18 years of clinical practice.'
							: 'Passionate about healthcare and medical advancements. Regularly read articles on cancer care and treatment.'}
						bind:value={bio}
						maxlength={300}
					></textarea>
					<div class="char-count">{bio.length}/300</div>
				</div>
			</div>
 
			<!-- Interests & Notifications Section -->
			<div class="two-col-layout">
				<!-- Tags -->
				<div class="section">
					<h3 class="section-title">
						{roleToggle === 'Doctor' ? '4. Areas of Expertise' : '3. Interests'}
					</h3>
					<div class="interests-box">
						<div class="checkbox-grid">
							{#if roleToggle === 'Reader'}
								{#each availableInterests as item}
									<label class="checkbox-item">
										<input type="checkbox" name="interests" bind:group={interests} value={item} />
										{item}
									</label>
								{/each}
							{:else}
								{#each availableExpertise as item}
									<label class="checkbox-item">
										<input type="checkbox" name="expertise" bind:group={expertise} value={item} />
										{item}
									</label>
								{/each}
							{/if}
						</div>
					</div>
				</div>
 
				<!-- Notifications -->
				<div class="section">
					<h3 class="section-title">
						{roleToggle === 'Doctor' ? '5. Notification Preferences' : '4. Notification Preferences'}
					</h3>
					<div class="notifications-box">
						<div class="notif-row">
							<div class="notif-text">
								<strong>Email Notifications</strong>
								<p>Get updates about new articles and research.</p>
							</div>
							<label class="switch">
								<input type="checkbox" name="emailNotifications" bind:checked={emailNotifications} />
								<span class="slider"></span>
							</label>
						</div>
						<div class="notif-row">
							<div class="notif-text">
								<strong>Newsletters</strong>
								<p>Receive our monthly newsletter.</p>
							</div>
							<label class="switch">
								<input type="checkbox" name="newsletters" bind:checked={newsletters} />
								<span class="slider"></span>
							</label>
						</div>
						<div class="notif-row">
							<div class="notif-text">
								<strong>Event Updates</strong>
								<p>Receive updates about events and webinars.</p>
							</div>
							<label class="switch">
								<input type="checkbox" name="eventUpdates" bind:checked={eventUpdates} />
								<span class="slider"></span>
							</label>
						</div>
					</div>
				</div>
			</div>
 
			<!-- Doctor Confirmation -->
			{#if roleToggle === 'Doctor'}
				<div class="confirmation-box">
					<label class="checkbox-label">
						<input type="checkbox" name="isConfirmed" bind:checked={isConfirmed} />
						<span class="custom-checkbox"></span>
						I confirm that the above information is accurate and true to the best of my knowledge
					</label>
				</div>
			{/if}
 
			<!-- Buttons -->
			<div class="actions">
				<button
					type="submit"
					class="btn-save"
					disabled={submitting}
					on:click={() => (activeAction = 'save')}
				>
					{submitting && activeAction === 'save' ? 'Saving...' : 'Save Draft'}
				</button>
				<button
					type="submit"
					class="btn-submit"
					disabled={submitting || (roleToggle === 'Doctor' && !isConfirmed)}
					on:click={() => (activeAction = 'submit')}
				>
					{submitting && activeAction === 'submit' ? 'Submitting...' : 'Submit'}
				</button>
			</div>
		</form>
	</div>
</div>
 
<style>
	.page-container {
		min-height: 100vh;
		background: #f5f7fb;
		padding: 40px 20px 80px;
		font-family: 'DM Sans', sans-serif;
		color: #111827;
	}
 
	.header {
		text-align: center;
		margin-bottom: 32px;
	}
 
	.header h1 {
		font-size: 32px;
		font-weight: 800;
		margin: 0 0 8px;
		color: #1e40af;
	}
 
	.header p {
		font-size: 14px;
		color: #4b5563;
		margin: 0 0 24px;
	}
 
	.role-toggle {
		display: inline-flex;
		background: #e5e7eb;
		border-radius: 8px;
		padding: 4px;
		width: 320px;
	}
 
	.role-toggle button {
		flex: 1;
		padding: 10px 16px;
		font-size: 14px;
		font-weight: 600;
		border: none;
		background: transparent;
		color: #6b7280;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}
 
	.role-toggle button.active {
		background: #ffffff;
		color: #0d2460;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
 
	.card {
		max-width: 900px;
		margin: 0 auto;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 40px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
	}
 
	.card-title {
		text-align: center;
		font-size: 24px;
		font-weight: 800;
		color: #0d2460;
		margin: 0 0 32px;
	}
 
	.form-message {
		text-align: center;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 24px;
		font-size: 14px;
		font-weight: 600;
		background: #fee2e2;
		color: #991b1b;
	}
 
	.form-message.success {
		background: #dcfce7;
		color: #166534;
	}
 
	.section {
		margin-bottom: 32px;
	}
 
	.section-title {
		font-size: 16px;
		font-weight: 700;
		color: #1e40af;
		margin: 0 0 16px;
	}
 
	/* Bordered Box for Section 1 */
	.border-box {
		border: 1px solid #d1d5db;
		border-radius: 12px;
		padding: 24px;
		background: #ffffff;
		position: relative;
		margin-top: 24px; /* Space for negative margin title */
	}
 
	.border-box .section-title {
		position: absolute;
		top: -12px;
		left: 16px;
		background: #ffffff;
		padding: 0 8px;
		margin: 0;
	}
 
	.basic-info-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 24px;
		margin-bottom: 24px;
	}
 
	.fields-col {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
 
	.photo-col {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
 
	.photo-upload-box {
		width: 100%;
		max-width: 200px;
		height: 120px;
		background: #f3f4f6;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 12px;
		border: 1px dashed transparent;
		cursor: pointer;
		transition: border 0.2s;
		overflow: hidden;
	}
 
	.photo-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 6px;
	}
 
	.photo-upload-box:hover {
		border-color: #9ca3af;
	}
 
	.photo-upload-box svg {
		margin-bottom: 12px;
	}
 
	.photo-upload-box p {
		font-size: 13px;
		font-weight: 500;
		color: #4b5563;
		margin: 0 0 4px;
	}
 
	.photo-hint {
		font-size: 11px;
		color: #9ca3af;
	}
 
	.mb-16 {
		margin-bottom: 16px;
	}
 
	.two-col-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
 
	.three-col-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
	}
 
	.field {
		display: flex;
		flex-direction: column;
	}
 
	.field label {
		font-size: 13px;
		font-weight: 700;
		color: #0d2460;
		margin-bottom: 6px;
	}
 
	.field label span {
		color: #ef4444;
	}
 
	.field input {
		padding: 12px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 14px;
		outline: none;
		transition: border-color 0.2s;
		color: #111827;
	}
 
	.field input::placeholder {
		color: #d1d5db;
	}
 
	.field input:focus {
		border-color: #3b82f6;
	}
 
	/* Section 2 */
	.sub-title {
		font-size: 15px;
		font-weight: 700;
		color: #0d2460;
		margin: 0 0 12px;
	}
 
	.textarea-wrapper {
		position: relative;
	}
 
	textarea {
		width: 100%;
		height: 120px;
		padding: 16px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-size: 14px;
		font-family: inherit;
		resize: none;
		outline: none;
		color: #111827;
		box-sizing: border-box;
	}
 
	textarea::placeholder {
		color: #9ca3af;
	}
 
	textarea:focus {
		border-color: #3b82f6;
	}
 
	.char-count {
		position: absolute;
		bottom: -24px;
		right: 0;
		font-size: 12px;
		color: #9ca3af;
	}
 
	/* Section 3 & 4 Grid */
	.two-col-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
		margin-top: 40px;
	}
 
	.interests-box,
	.notifications-box {
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 24px;
		min-height: 220px;
		box-sizing: border-box;
		position: relative;
	}
 
	.interests-box {
		text-align: left;
	}
 
	.checkbox-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
 
	.checkbox-item {
		display: flex;
		align-items: center;
		font-size: 13px;
		color: #1e3a8a;
		cursor: pointer;
		font-weight: 500;
	}
 
	.checkbox-item input {
		margin-right: 12px;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
 
	/* Notifications */
	.notif-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}
 
	.notif-row:last-child {
		margin-bottom: 0;
	}
 
	.notif-text strong {
		display: block;
		font-size: 14px;
		color: #111827;
		margin-bottom: 4px;
	}
 
	.notif-text p {
		font-size: 12px;
		color: #6b7280;
		margin: 0;
	}
 
	/* Toggle Switch */
	.switch {
		position: relative;
		display: inline-block;
		width: 44px;
		height: 24px;
		flex-shrink: 0;
	}
 
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
 
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #e5e7eb;
		transition: 0.3s;
		border-radius: 34px;
	}
 
	.slider:before {
		position: absolute;
		content: '';
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: 0.3s;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
 
	input:checked + .slider {
		background-color: #2563eb;
	}
 
	input:checked + .slider:before {
		transform: translateX(20px);
	}
 
	/* Confirmation Box */
	.confirmation-box {
		margin-top: 32px;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		padding: 16px 20px;
		border-radius: 8px;
	}
 
	.checkbox-label {
		display: flex;
		align-items: center;
		font-size: 13px;
		color: #1e3a8a;
		cursor: pointer;
		font-weight: 500;
	}
 
	.checkbox-label input {
		margin-right: 12px;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
 
	/* Buttons */
	.actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		margin-top: 40px;
	}
 
	.btn-save {
		padding: 12px 32px;
		border: 1px solid #2563eb;
		background: transparent;
		color: #2563eb;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
 
	.btn-save:hover {
		background: #eff6ff;
	}
 
	.btn-save:disabled,
	.btn-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
 
	.btn-submit {
		padding: 12px 48px;
		border: none;
		background: #1e40af;
		color: white;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
 
	.btn-submit:hover {
		background: #0155bd;
	}
 
	@media (max-width: 768px) {
		.basic-info-grid {
			grid-template-columns: 1fr;
		}
		.photo-col {
			align-items: center;
			margin-top: 16px;
		}
		.two-col-grid,
		.three-col-grid {
			grid-template-columns: 1fr;
		}
		.two-col-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
