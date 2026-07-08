<script lang="ts">
	let roleToggle = 'Doctor'; // Default to Doctor to show the new view, or 'Reader'
	
	// Basic Info (Common)
	let fullName = '';
	let email = '';
	
	// Reader Specific
	let profession = '';
	let location = '';
	let organization = '';

	// Doctor Specific Basic Info
	let qualification = '';
	let designation = '';
	let specialization = '';
	let affiliation = '';
	let cityState = '';

	// Doctor Credentials
	let experience = '';
	let patientsTreated = '';
	let publications = '';
	let awards = '';
	let citations = '';
	
	// Bio (Common)
	let bio = '';
	
	// Interests (Reader)
	let interests: string[] = ['Cancer Care', 'Medical Research', 'Patient stories', 'Health & Wellness'];

	// Expertise (Doctor)
	let expertise: string[] = ['Colorectal Cancer', 'Gastric Cancer Treatment', 'Pancreatic Cancer'];

	// Photo upload state
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

	// Tags logic
	let newTag = '';
	let isAddingTag = false;

	function handleTagKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && newTag.trim() !== '') {
			if (roleToggle === 'Reader') {
				interests = [...interests, newTag.trim()];
			} else {
				expertise = [...expertise, newTag.trim()];
			}
			newTag = '';
			isAddingTag = false;
		} else if (event.key === 'Escape') {
			newTag = '';
			isAddingTag = false;
		}
	}

	function removeTag(type: 'interest' | 'expertise', index: number) {
		if (type === 'interest') {
			interests = interests.filter((_, i) => i !== index);
		} else {
			expertise = expertise.filter((_, i) => i !== index);
		}
	}

	// Notifications (Common)
	let emailNotifications = true;
	let newsletters = false;
	let eventUpdates = true;

	// Confirmation (Doctor)
	let isConfirmed = false;
</script>

<div class="page-container">
	<div class="card">
		<div class="header">
			<h1>Welcome to JCF</h1>
			<p>Sign in to comment publish research and manage your saved articles.</p>
			
			<div class="role-toggle">
				<button class:active={roleToggle === 'Doctor'} on:click={() => roleToggle = 'Doctor'}>Doctor</button>
				<button class:active={roleToggle === 'Reader'} on:click={() => roleToggle = 'Reader'}>Reader</button>
			</div>
		</div>

		<h2 class="card-title">Complete Your Profile</h2>

		<!-- Section 1: Basic Information -->
		<div class="section border-box">
			<h3 class="section-title">1. Basic Information</h3>
			
			<!-- Common fields -->
			<div class="basic-info-grid">
				<div class="fields-col">
					<div class="field">
						<label>Full Name <span>*</span></label>
						<input type="text" placeholder="E.g. Srimanyu M" bind:value={fullName} />
					</div>
					<div class="field">
						<label>Email Address <span>*</span></label>
						<input type="email" placeholder="E.g. srimanyu@gmail.com" bind:value={email} />
					</div>
				</div>
				<div class="photo-col">
					<input type="file" accept="image/png, image/jpeg" bind:this={fileInputRef} on:change={handlePhotoSelect} style="display: none;" />
					
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="photo-upload-box" on:click={triggerPhotoUpload}>
						{#if photoPreviewUrl}
							<img src={photoPreviewUrl} alt="Preview" class="photo-preview" />
						{:else}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								<circle cx="8.5" cy="8.5" r="1.5"></circle>
								<polyline points="21 15 16 10 5 21"></polyline>
							</svg>
							<p>Upload photo</p>
							<span class="photo-hint">JPG/PNG (Max 2MB)</span>
						{/if}
					</div>
				</div>
			</div>
			
			<!-- Role specific fields -->
			{#if roleToggle === 'Reader'}
				<div class="three-col-grid">
					<div class="field">
						<label>Profession <span>*</span></label>
						<input type="text" placeholder="E.g. Student" bind:value={profession} />
					</div>
					<div class="field">
						<label>Location</label>
						<input type="text" placeholder="E.g. Pune" bind:value={location} />
					</div>
					<div class="field">
						<label>Organization</label>
						<input type="text" placeholder="E.g. Kennedy college" bind:value={organization} />
					</div>
				</div>
			{:else}
				<div class="two-col-grid mb-16">
					<div class="field">
						<label>Qualification <span>*</span></label>
						<input type="text" placeholder="E.g., MD (Radiation Oncology), DNB" bind:value={qualification} />
					</div>
					<div class="field">
						<label>Current Designation <span>*</span></label>
						<input type="text" placeholder="E.g. Senior Consultant - Medical Oncology" bind:value={designation} />
					</div>
				</div>
				<div class="two-col-grid mb-16">
					<div class="field">
						<label>Specialization <span>*</span></label>
						<input type="text" placeholder="E.g. Gastrointestinal Medical Oncology" bind:value={specialization} />
					</div>
					<div class="field">
						<label>Hospital / Clinic Affiliation <span>*</span></label>
						<input type="text" placeholder="E.g., Fortis Hospital" bind:value={affiliation} />
					</div>
				</div>
				<div class="two-col-grid">
					<div class="field">
						<label>City/ State</label>
						<input type="text" placeholder="E.g. New Delhi" bind:value={cityState} />
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
						<label>Years of Experience <span>*</span></label>
						<input type="text" placeholder="E.g. 18 Years" bind:value={experience} />
					</div>
					<div class="field">
						<label>Patients treated <span>*</span></label>
						<input type="text" placeholder="E.g. 1800+" bind:value={patientsTreated} />
					</div>
				</div>
				<div class="three-col-grid">
					<div class="field">
						<label>Publications <span>*</span></label>
						<input type="text" placeholder="E.g. 52" bind:value={publications} />
					</div>
					<div class="field">
						<label>Number of Awards <span>*</span></label>
						<input type="text" placeholder="E.g. 16" bind:value={awards} />
					</div>
					<div class="field">
						<label>Citations</label>
						<input type="text" placeholder="E.g. 12" bind:value={citations} />
					</div>
				</div>
			</div>
		{/if}

		<!-- Bio Section -->
		<div class="section">
			<h3 class="section-title">{roleToggle === 'Doctor' ? '3. About The Doctor' : '2. About The Reader'}</h3>
			<h4 class="sub-title">Short Bio</h4>
			<div class="textarea-wrapper">
				<textarea 
					placeholder={roleToggle === 'Doctor' ? "Dr. Gupta specializes in colorectal, gastric, and pancreatic cancer with over 1800 patients treated across 18 years of clinical practice." : "Passionate about healthcare and medical advancements. Regularly read articles on cancer care and treatment."} 
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
				<h3 class="section-title">{roleToggle === 'Doctor' ? '4. Areas of Expertise' : '3. Interests'}</h3>
				<div class="interests-box">
					{#if isAddingTag}
						<!-- svelte-ignore a11y-autofocus -->
						<input 
							type="text" 
							class="tag-input" 
							bind:value={newTag} 
							on:keydown={handleTagKeydown} 
							on:blur={() => { if(newTag === '') isAddingTag = false; }} 
							placeholder="Type & Enter" 
							autofocus 
						/>
					{:else}
						<button class="btn-outline-pill" on:click={() => isAddingTag = true}>Add your {roleToggle === 'Doctor' ? 'expertise' : 'interest'}</button>
					{/if}
					<div class="tags-container">
						{#if roleToggle === 'Reader'}
							{#each interests as tag, i}
								<span class="tag">
									{tag}
									<button class="btn-close" on:click={() => removeTag('interest', i)}>
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
									</button>
								</span>
							{/each}
						{:else}
							{#each expertise as tag, i}
								<span class="tag">
									{tag}
									<button class="btn-close" on:click={() => removeTag('expertise', i)}>
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
									</button>
								</span>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- Notifications -->
			<div class="section">
				<h3 class="section-title">{roleToggle === 'Doctor' ? '5. Notification Preferences' : '4. Notification Preferences'}</h3>
				<div class="notifications-box">
					<div class="notif-row">
						<div class="notif-text">
							<strong>Email Notifications</strong>
							<p>Get updates about new articles and research.</p>
						</div>
						<label class="switch">
							<input type="checkbox" bind:checked={emailNotifications} />
							<span class="slider"></span>
						</label>
					</div>
					<div class="notif-row">
						<div class="notif-text">
							<strong>Newsletters</strong>
							<p>Receive our monthly newsletter.</p>
						</div>
						<label class="switch">
							<input type="checkbox" bind:checked={newsletters} />
							<span class="slider"></span>
						</label>
					</div>
					<div class="notif-row">
						<div class="notif-text">
							<strong>Event Updates</strong>
							<p>Receive updates about events and webinars.</p>
						</div>
						<label class="switch">
							<input type="checkbox" bind:checked={eventUpdates} />
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
					<input type="checkbox" bind:checked={isConfirmed} />
					<span class="custom-checkbox"></span>
					I confirm that the above information is accurate and true to the best of my knowledge
				</label>
			</div>
		{/if}

		<!-- Buttons -->
		<div class="actions">
			<button class="btn-save">Save Draft</button>
			<button class="btn-submit">Submit</button>
		</div>
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
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}

	.card {
		max-width: 900px;
		margin: 0 auto;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 40px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.02);
	}

	.card-title {
		text-align: center;
		font-size: 24px;
		font-weight: 800;
		color: #0d2460;
		margin: 0 0 32px;
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
		justify-content: flex-end;
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

	.mb-16 { margin-bottom: 16px; }

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

	.interests-box, .notifications-box {
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 24px;
		min-height: 220px;
		box-sizing: border-box;
		position: relative;
	}

	.interests-box {
		text-align: center;
	}

	.btn-outline-pill {
		border: 1px solid #9ca3af;
		background: transparent;
		color: #4b5563;
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		margin-bottom: 24px;
		transition: all 0.2s;
	}

	.btn-outline-pill:hover {
		background: #f3f4f6;
	}

	.tag-input {
		padding: 8px 16px;
		border: 1px solid #3b82f6;
		border-radius: 20px;
		font-size: 13px;
		outline: none;
		margin-bottom: 24px;
		width: 200px;
		text-align: center;
		color: #111827;
	}

	.tag-input::placeholder {
		color: #9ca3af;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid #93c5fd;
		background: #eff6ff;
		color: #2563eb;
		padding: 8px 14px;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
	}

	.btn-close {
		background: none;
		border: none;
		color: #3b82f6;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-close:hover {
		color: #1e3a8a;
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
		transition: .3s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: .3s;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
			justify-content: center;
			margin-top: 16px;
		}
		.two-col-grid, .three-col-grid {
			grid-template-columns: 1fr;
		}
		.two-col-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
