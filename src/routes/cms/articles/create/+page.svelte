<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import { enhance } from '$app/forms';

	export let data;
	$: profile = data.profile;

	let articleType: 'regular' | 'research' = 'regular';
	let isSubmitting = false;

	// Common form submit handler
	const handleSubmit = () => {
		isSubmitting = true;
		return async ({ update }: { update: any }) => {
			await update();
			isSubmitting = false;
		};
	};
</script>

<svelte:head>
	<title>Create Article | Doctor Dashboard</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar doctorName={profile?.full_name || ''} unreadCount={0} />

		<div class="page">
			<div class="header">
				<h1>Create Publication</h1>
				<p>Write and publish medical articles or research papers on the Jarurat Care platform.</p>
			</div>

			<div class="form-card">
				<!-- Type Selection -->
				<div class="type-selector">
					<h3>What do you want to write?</h3>
					<div class="radio-group">
						<label class="radio-card" class:active={articleType === 'regular'}>
							<input type="radio" bind:group={articleType} value="regular" />
							<span class="icon">📝</span>
							<div class="info">
								<strong>Regular Article</strong>
								<span>General health tips, stories, or blogs.</span>
							</div>
						</label>
						<label class="radio-card" class:active={articleType === 'research'}>
							<input type="radio" bind:group={articleType} value="research" />
							<span class="icon">🔬</span>
							<div class="info">
								<strong>Medical Research</strong>
								<span>Formal papers with abstract, methods, etc.</span>
							</div>
						</label>
					</div>
				</div>

				<hr class="divider" />

				<form method="POST" action="?/submitArticle" use:enhance={handleSubmit}>
					<input type="hidden" name="articleType" value={articleType} />

					{#if articleType === 'regular'}
						<!-- REGULAR ARTICLE FORM -->
						<div class="form-section">
							<h3>Basic Information</h3>
							<div class="input-group">
								<label for="title">Article Title *</label>
								<input type="text" id="title" name="title" required placeholder="Enter a catchy title..." />
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="author_name_credentials">Author Name & Credentials</label>
									<input type="text" id="author_name_credentials" name="author_name_credentials" placeholder="e.g., Dr. Jane Doe, MD, Ph.D." value={profile?.full_name || ''} />
								</div>
								<div class="input-group">
									<label for="category">Category</label>
									<select id="category" name="category">
										<option value="General Health">General Health</option>
										<option value="Cancer Care">Cancer Care</option>
										<option value="Mental Health">Mental Health</option>
										<option value="Nutrition">Nutrition</option>
										<option value="Pediatrics">Pediatrics</option>
									</select>
								</div>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="tags">Keywords / Tags (comma separated)</label>
									<input type="text" id="tags" name="tags" placeholder="e.g., wellness, diet, heart" />
								</div>
								<div class="input-group">
									<label for="cover_image_url">Cover Image URL</label>
									<input type="url" id="cover_image_url" name="cover_image_url" placeholder="https://..." />
								</div>
							</div>
							<div class="input-group">
								<label for="abstract">Executive Summary / Abstract</label>
								<textarea id="abstract" name="abstract" rows="3" placeholder="Brief overview of the article..."></textarea>
							</div>
						</div>

						<div class="form-section">
							<h3>Introduction & Background</h3>
							<div class="input-group">
								<label for="introduction">Introduction</label>
								<textarea id="introduction" name="introduction" rows="4"></textarea>
							</div>
							<div class="input-group">
								<label for="background">Background</label>
								<textarea id="background" name="background" rows="3"></textarea>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="purpose">Purpose of the Article</label>
									<textarea id="purpose" name="purpose" rows="2"></textarea>
								</div>
								<div class="input-group">
									<label for="scope">Scope & Objectives</label>
									<textarea id="scope" name="scope" rows="2"></textarea>
								</div>
							</div>
						</div>

						<div class="form-section">
							<h3>Main Body</h3>
							<div class="input-group">
								<label for="explanation">Explanation and Analysis</label>
								<textarea id="explanation" name="explanation" rows="6" placeholder="The core content..."></textarea>
							</div>
							<div class="input-group">
								<label for="evidence">Supporting Evidence, Facts, Statistics</label>
								<textarea id="evidence" name="evidence" rows="4"></textarea>
							</div>
							<div class="input-group">
								<label for="examples">Examples or Practical Applications</label>
								<textarea id="examples" name="examples" rows="4"></textarea>
							</div>
						</div>

						<div class="form-section">
							<h3>Discussion & Conclusion</h3>
							<div class="input-grid">
								<div class="input-group">
									<label for="interpretation">Interpretation</label>
									<textarea id="interpretation" name="interpretation" rows="3"></textarea>
								</div>
								<div class="input-group">
									<label for="implications">Benefits / Implications</label>
									<textarea id="implications" name="implications" rows="3"></textarea>
								</div>
							</div>
							<div class="input-group">
								<label for="recommendations">Recommendations / Solutions</label>
								<textarea id="recommendations" name="recommendations" rows="3"></textarea>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="conclusion_summary">Summary of Key Points (Conclusion)</label>
									<textarea id="conclusion_summary" name="conclusion_summary" rows="3"></textarea>
								</div>
								<div class="input-group">
									<label for="takeaways">Final Insights / Takeaways</label>
									<textarea id="takeaways" name="takeaways" rows="3"></textarea>
								</div>
							</div>
						</div>

						<div class="form-section">
							<h3>Additional Info</h3>
							<div class="input-group">
								<label for="references_text">References / Citations</label>
								<textarea id="references_text" name="references_text" rows="3"></textarea>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="acknowledgements">Acknowledgements</label>
									<textarea id="acknowledgements" name="acknowledgements" rows="2"></textarea>
								</div>
								<div class="input-group">
									<label for="appendix">Appendix / Supplementary Info</label>
									<textarea id="appendix" name="appendix" rows="2"></textarea>
								</div>
							</div>
						</div>

					{:else}
						<!-- RESEARCH PAPER FORM -->
						<div class="form-section">
							<h3>Basic Research Information</h3>
							<div class="input-group">
								<label for="title">Paper Title *</label>
								<input type="text" id="title" name="title" required placeholder="Full title of the research paper..." />
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="authors_and_affiliations">Authors & Affiliations</label>
									<input type="text" id="authors_and_affiliations" name="authors_and_affiliations" placeholder="Jane Doe1, John Smith2..." />
								</div>
								<div class="input-group">
									<label for="corresponding_author_details">Corresponding Author Details</label>
									<input type="text" id="corresponding_author_details" name="corresponding_author_details" placeholder="Email, phone, institution..." />
								</div>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="keywords">Keywords</label>
									<input type="text" id="keywords" name="keywords" placeholder="e.g., oncology, clinical trial" />
								</div>
								<div class="input-group">
									<label for="featured_image">Featured Image URL</label>
									<input type="url" id="featured_image" name="featured_image" placeholder="https://..." />
								</div>
							</div>
							<div class="input-group">
								<label for="abstract">Abstract (Background, Objective, Methods, Results, Conclusion) *</label>
								<textarea id="abstract" name="abstract" rows="5" required></textarea>
							</div>
						</div>

						<div class="form-section">
							<h3>Core Research Sections</h3>
							<div class="input-group">
								<label for="introduction">Introduction (Problem Statement, Research Gap)</label>
								<textarea id="introduction" name="introduction" rows="5"></textarea>
							</div>
							<div class="input-group">
								<label for="literature_review">Literature Review / Related Work</label>
								<textarea id="literature_review" name="literature_review" rows="4"></textarea>
							</div>
							<div class="input-group">
								<label for="methods">Materials and Methods (Study Design, Participants, Statistics)</label>
								<textarea id="methods" name="methods" rows="6"></textarea>
							</div>
							<div class="input-group">
								<label for="results">Results</label>
								<textarea id="results" name="results" rows="6"></textarea>
							</div>
							<div class="input-group">
								<label for="discussion">Discussion (Interpretation, Strengths, Limitations)</label>
								<textarea id="discussion" name="discussion" rows="6"></textarea>
							</div>
							<div class="input-group">
								<label for="conclusion">Conclusion</label>
								<textarea id="conclusion" name="conclusion" rows="4"></textarea>
							</div>
						</div>

						<div class="form-section">
							<h3>Declarations & Supplementary</h3>
							<div class="input-grid">
								<div class="input-group">
									<label for="ethics_statement">Ethical Approval / Informed Consent</label>
									<textarea id="ethics_statement" name="ethics_statement" rows="3"></textarea>
								</div>
								<div class="input-group">
									<label for="funding">Funding Statement</label>
									<textarea id="funding" name="funding" rows="3"></textarea>
								</div>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="conflict_of_interest">Conflict of Interest</label>
									<textarea id="conflict_of_interest" name="conflict_of_interest" rows="2"></textarea>
								</div>
								<div class="input-group">
									<label for="author_contributions">Author Contributions</label>
									<textarea id="author_contributions" name="author_contributions" rows="2"></textarea>
								</div>
							</div>
							<div class="input-grid">
								<div class="input-group">
									<label for="data_availability">Data Availability Statement</label>
									<textarea id="data_availability" name="data_availability" rows="2"></textarea>
								</div>
								<div class="input-group">
									<label for="acknowledgements">Acknowledgements</label>
									<textarea id="acknowledgements" name="acknowledgements" rows="2"></textarea>
								</div>
							</div>
							<div class="input-group">
								<label for="references_text">References</label>
								<textarea id="references_text" name="references_text" rows="4"></textarea>
							</div>
							<div class="input-group">
								<label for="appendix">Appendix / Supplementary Material</label>
								<textarea id="appendix" name="appendix" rows="3"></textarea>
							</div>
						</div>
					{/if}

					<div class="form-actions">
						<button type="submit" name="actionType" value="draft" class="btn-draft" disabled={isSubmitting}>
							Save as Draft
						</button>
						<button type="submit" name="actionType" value="under_review" class="btn-submit" disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Submit for Review'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		min-height: 100vh;
		background: #f5f7fb;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.page {
		padding: 30px;
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
	}

	.header h1 {
		font-size: 26px;
		color: #0d2460;
		margin: 0 0 5px;
	}

	.header p {
		color: #6b7280;
		margin: 0 0 25px;
		font-size: 15px;
	}

	.form-card {
		background: white;
		border-radius: 16px;
		padding: 35px;
		box-shadow: 0 4px 15px rgba(0,0,0,0.03);
	}

	.type-selector h3 {
		font-size: 16px;
		color: #1f2937;
		margin: 0 0 15px;
	}

	.radio-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.radio-card {
		display: flex;
		align-items: center;
		padding: 20px;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		background: #fafafa;
	}

	.radio-card input {
		display: none;
	}

	.radio-card.active {
		border-color: #0155bd;
		background: #eff6ff;
	}

	.radio-card .icon {
		font-size: 32px;
		margin-right: 15px;
	}

	.radio-card .info strong {
		display: block;
		font-size: 16px;
		color: #0d2460;
		margin-bottom: 3px;
	}

	.radio-card .info span {
		font-size: 13px;
		color: #6b7280;
	}

	.divider {
		border: 0;
		height: 1px;
		background: #e5e7eb;
		margin: 35px 0;
	}

	.form-section {
		margin-bottom: 35px;
		padding-bottom: 25px;
		border-bottom: 1px dashed #e5e7eb;
	}
	
	.form-section:last-of-type {
		border-bottom: none;
	}

	.form-section h3 {
		color: #0155bd;
		font-size: 18px;
		margin: 0 0 20px;
		font-weight: 700;
	}

	.input-group {
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.input-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	label {
		font-size: 14px;
		font-weight: 600;
		color: #374151;
	}

	input, select, textarea {
		padding: 12px 16px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-family: inherit;
		font-size: 14px;
		color: #1f2937;
		background: #fff;
		transition: border-color 0.2s;
	}

	input:focus, select:focus, textarea:focus {
		outline: none;
		border-color: #0155bd;
		box-shadow: 0 0 0 3px rgba(1, 85, 189, 0.1);
	}

	textarea {
		resize: vertical;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
		margin-top: 20px;
		padding-top: 20px;
		border-top: 2px solid #f3f4f6;
	}

	.btn-draft {
		background: white;
		color: #4b5563;
		border: 1px solid #d1d5db;
		padding: 14px 24px;
		border-radius: 8px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-draft:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.btn-submit {
		background: #0155bd;
		color: white;
		border: none;
		padding: 14px 28px;
		border-radius: 8px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-submit:hover {
		background: #0d2460;
	}

	.btn-submit:disabled, .btn-draft:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.radio-group, .input-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
