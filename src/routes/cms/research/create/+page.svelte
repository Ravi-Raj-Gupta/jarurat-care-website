<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import { enhance } from '$app/forms';

	export let data;
	$: profile = data.profile;

	let isSubmitting = false;

	const handleSubmit = () => {
		isSubmitting = true;

		return async ({ update }: { update: any }) => {
			await update();
			isSubmitting = false;
		};
	};
</script>

<svelte:head>
	<title>Create Research Paper | Doctor Dashboard</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar
			doctorName={profile?.full_name || ''}
			unreadCount={0}
		/>

		<div class="page">
			<div class="header">
				<h1>Create Research Paper</h1>
				<p>
					Submit your research paper for peer review on the Jarurat Care
					platform.
				</p>
			</div>

			<div class="form-card">
				<form
					method="POST"
					action="?/submitResearchPaper"
					use:enhance={handleSubmit}
				>
                					<div class="form-section">
						<h3>Basic Research Information</h3>

						<div class="input-group">
							<label for="title">Paper Title *</label>
							<input
								type="text"
								id="title"
								name="title"
								required
								placeholder="Full title of the research paper..."
							/>
						</div>

						<div class="input-grid">
							<div class="input-group">
								<label for="authors_and_affiliations">Authors & Affiliations</label>
								<input
									type="text"
									id="authors_and_affiliations"
									name="authors_and_affiliations"
									placeholder="Jane Doe1, John Smith2..."
								/>
							</div>

							<div class="input-group">
								<label for="corresponding_author_details">Corresponding Author Details</label>
								<input
									type="text"
									id="corresponding_author_details"
									name="corresponding_author_details"
									placeholder="Email, phone, institution..."
								/>
							</div>
						</div>

						<div class="input-grid">
							<div class="input-group">
								<label for="keywords">Keywords</label>
								<input
									type="text"
									id="keywords"
									name="keywords"
									placeholder="e.g., oncology, clinical trial"
								/>
							</div>

							<div class="input-group">
								<label for="featured_image">Featured Image URL</label>
								<input
									type="url"
									id="featured_image"
									name="featured_image"
									placeholder="https://..."
								/>
							</div>
						</div>

						<div class="input-group">
							<label for="abstract">
								Abstract (Background, Objective, Methods, Results, Conclusion) *
							</label>

							<textarea
								id="abstract"
								name="abstract"
								rows="5"
								required
							></textarea>
						</div>
					</div>

					<div class="form-section">
						<h3>Core Research Sections</h3>

						<div class="input-group">
							<label for="introduction">
								Introduction (Problem Statement, Research Gap)
							</label>

							<textarea
								id="introduction"
								name="introduction"
								rows="5"
							></textarea>
						</div>

						<div class="input-group">
							<label for="literature_review">
								Literature Review / Related Work
							</label>

							<textarea
								id="literature_review"
								name="literature_review"
								rows="4"
							></textarea>
						</div>

						<div class="input-group">
							<label for="methods">
								Materials and Methods (Study Design, Participants, Statistics)
							</label>

							<textarea
								id="methods"
								name="methods"
								rows="6"
							></textarea>
						</div>

						<div class="input-group">
							<label for="results">Results</label>

							<textarea
								id="results"
								name="results"
								rows="6"
							></textarea>
						</div>

						<div class="input-group">
							<label for="discussion">
								Discussion (Interpretation, Strengths, Limitations)
							</label>

							<textarea
								id="discussion"
								name="discussion"
								rows="6"
							></textarea>
						</div>

						<div class="input-group">
							<label for="conclusion">Conclusion</label>

							<textarea
								id="conclusion"
								name="conclusion"
								rows="4"
							></textarea>
						</div>
					</div>

					<div class="form-section">
						<h3>Declarations & Supplementary</h3>

						<div class="input-grid">
							<div class="input-group">
								<label for="ethics_statement">
									Ethical Approval / Informed Consent
								</label>

								<textarea
									id="ethics_statement"
									name="ethics_statement"
									rows="3"
								></textarea>
							</div>

							<div class="input-group">
								<label for="funding">
									Funding Statement
								</label>

								<textarea
									id="funding"
									name="funding"
									rows="3"
								></textarea>
							</div>
						</div>

						<div class="input-grid">
							<div class="input-group">
								<label for="conflict_of_interest">
									Conflict of Interest
								</label>

								<textarea
									id="conflict_of_interest"
									name="conflict_of_interest"
									rows="2"
								></textarea>
							</div>

							<div class="input-group">
								<label for="author_contributions">
									Author Contributions
								</label>

								<textarea
									id="author_contributions"
									name="author_contributions"
									rows="2"
								></textarea>
							</div>
						</div>

						<div class="input-grid">
							<div class="input-group">
								<label for="data_availability">
									Data Availability Statement
								</label>

								<textarea
									id="data_availability"
									name="data_availability"
									rows="2"
								></textarea>
							</div>

							<div class="input-group">
								<label for="acknowledgements">
									Acknowledgements
								</label>

								<textarea
									id="acknowledgements"
									name="acknowledgements"
									rows="2"
								></textarea>
							</div>
						</div>

						<div class="input-group">
							<label for="references_text">References</label>

							<textarea
								id="references_text"
								name="references_text"
								rows="4"
							></textarea>
						</div>

						<div class="input-group">
							<label for="appendix">
								Appendix / Supplementary Material
							</label>

							<textarea
								id="appendix"
								name="appendix"
								rows="3"
							></textarea>
						</div>
					</div>
                    					<div class="form-actions">
						<button
							type="submit"
							name="actionType"
							value="draft"
							class="btn-draft"
							disabled={isSubmitting}
						>
							Save as Draft
						</button>

						<button
							type="submit"
							name="actionType"
							value="under_review"
							class="btn-submit"
							disabled={isSubmitting}
						>
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
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
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

	input,
	textarea {
		padding: 12px 16px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-family: inherit;
		font-size: 14px;
		color: #1f2937;
		background: #fff;
		transition: border-color 0.2s;
	}

	input:focus,
	textarea:focus {
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

	.btn-submit:disabled,
	.btn-draft:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.input-grid {
			grid-template-columns: 1fr;
		}
	}
</style>