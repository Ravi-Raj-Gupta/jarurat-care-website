<script lang="ts">
	import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import { enhance } from '$app/forms';

	export let data;
	$: profile = data.profile;
	$: article = data.article;

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
	<title>Edit Article | Doctor Dashboard</title>
</svelte:head>

<div class="dashboard">
	<Sidebar isReviewer={profile?.is_reviewer === true} />

	<div class="content">
		<Topbar doctorName={profile?.full_name || ''} unreadCount={0} />

		<div class="page">
			<div class="header">
				<h1>Edit Article</h1>
				<p>Update your medical article or research paper.</p>
			</div>

			<div class="form-card">
				<form method="POST" action="?/updateArticle" use:enhance={handleSubmit}>
					<input type="hidden" name="articleType" value="regular" />

					<div class="form-section">
						<h3>Basic Information</h3>
						<div class="input-group">
							<label for="title">Article Title *</label>
							<input type="text" id="title" name="title" required value={article.title} />
						</div>
						<div class="input-grid">
							<div class="input-group">
								<label for="author_name_credentials">Author Name & Credentials</label>
								<input type="text" id="author_name_credentials" name="author_name_credentials" value={article.author_name_credentials || profile?.full_name || ''} />
							</div>
							<div class="input-group">
								<label for="category">Category</label>
								<select id="category" name="category" value={article.category}>
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
								<input type="text" id="tags" name="tags" value={(article.tags || []).join(', ')} />
							</div>
							<div class="input-group">
								<label for="cover_image_url">Cover Image URL</label>
								<input type="url" id="cover_image_url" name="cover_image_url" value={article.cover_image_url || ''} />
							</div>
						</div>
						<div class="input-group">
							<label for="abstract">Executive Summary / Abstract</label>
							<textarea id="abstract" name="abstract" rows="3">{article.abstract || ''}</textarea>
						</div>
					</div>

					<div class="form-section">
						<h3>Introduction & Background</h3>
						<div class="input-group">
							<label for="introduction">Introduction</label>
							<textarea id="introduction" name="introduction" rows="4">{article.introduction || ''}</textarea>
						</div>
						<div class="input-group">
							<label for="background">Background</label>
							<textarea id="background" name="background" rows="3">{article.background || ''}</textarea>
						</div>
						<div class="input-grid">
							<div class="input-group">
								<label for="purpose">Purpose of the Article</label>
								<textarea id="purpose" name="purpose" rows="2">{article.purpose || ''}</textarea>
							</div>
							<div class="input-group">
								<label for="scope">Scope & Objectives</label>
								<textarea id="scope" name="scope" rows="2">{article.scope || ''}</textarea>
							</div>
						</div>
					</div>

					<div class="form-section">
						<h3>Main Body</h3>
						<div class="input-group">
							<label for="explanation">Explanation and Analysis</label>
							<textarea id="explanation" name="explanation" rows="6">{article.explanation || ''}</textarea>
						</div>
						<div class="input-group">
							<label for="evidence">Supporting Evidence, Facts, Statistics</label>
							<textarea id="evidence" name="evidence" rows="4">{article.evidence || ''}</textarea>
						</div>
						<div class="input-group">
							<label for="examples">Examples or Practical Applications</label>
							<textarea id="examples" name="examples" rows="4">{article.examples || ''}</textarea>
						</div>
					</div>

					<div class="form-section">
						<h3>Discussion & Conclusion</h3>
						<div class="input-grid">
							<div class="input-group">
								<label for="interpretation">Interpretation</label>
								<textarea id="interpretation" name="interpretation" rows="3">{article.interpretation || ''}</textarea>
							</div>
							<div class="input-group">
								<label for="implications">Benefits / Implications</label>
								<textarea id="implications" name="implications" rows="3">{article.implications || ''}</textarea>
							</div>
						</div>
						<div class="input-group">
							<label for="recommendations">Recommendations / Solutions</label>
							<textarea id="recommendations" name="recommendations" rows="3">{article.recommendations || ''}</textarea>
						</div>
						<div class="input-grid">
							<div class="input-group">
								<label for="conclusion_summary">Summary of Key Points (Conclusion)</label>
								<textarea id="conclusion_summary" name="conclusion_summary" rows="3">{article.conclusion_summary || ''}</textarea>
							</div>
							<div class="input-group">
								<label for="takeaways">Final Insights / Takeaways</label>
								<textarea id="takeaways" name="takeaways" rows="3">{article.takeaways || ''}</textarea>
							</div>
						</div>
					</div>

					<div class="form-section">
						<h3>Additional Info</h3>
						<div class="input-group">
							<label for="references_text">References / Citations</label>
							<textarea id="references_text" name="references_text" rows="3">{article.references_text || ''}</textarea>
						</div>
						<div class="input-grid">
							<div class="input-group">
								<label for="acknowledgements">Acknowledgements</label>
								<textarea id="acknowledgements" name="acknowledgements" rows="2">{article.acknowledgements || ''}</textarea>
							</div>
							<div class="input-group">
								<label for="appendix">Appendix / Supplementary Info</label>
								<textarea id="appendix" name="appendix" rows="2">{article.appendix || ''}</textarea>
							</div>
						</div>
					</div>

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
	.dashboard { display: flex; min-height: 100vh; background: #f5f7fb; }
	.content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
	.page { padding: 30px; max-width: 1000px; margin: 0 auto; width: 100%; }
	.header h1 { font-size: 26px; color: #0d2460; margin: 0 0 5px; }
	.header p { color: #6b7280; margin: 0 0 25px; font-size: 15px; }
	.form-card { background: white; border-radius: 16px; padding: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
	.form-section { margin-bottom: 35px; padding-bottom: 25px; border-bottom: 1px dashed #e5e7eb; }
	.form-section:last-of-type { border-bottom: none; }
	.form-section h3 { color: #0155bd; font-size: 18px; margin: 0 0 20px; font-weight: 700; }
	.input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
	.input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
	label { font-size: 14px; font-weight: 600; color: #374151; }
	input, select, textarea { padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-family: inherit; font-size: 14px; color: #1f2937; background: #fff; transition: border-color 0.2s; }
	input:focus, select:focus, textarea:focus { outline: none; border-color: #0155bd; box-shadow: 0 0 0 3px rgba(1, 85, 189, 0.1); }
	textarea { resize: vertical; }
	.form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; padding-top: 20px; border-top: 2px solid #f3f4f6; }
	.btn-draft { background: white; color: #4b5563; border: 1px solid #d1d5db; padding: 14px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
	.btn-draft:hover { background: #f9fafb; border-color: #9ca3af; }
	.btn-submit { background: #0155bd; color: white; border: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
	.btn-submit:hover { background: #0d2460; }
	.btn-submit:disabled, .btn-draft:disabled { opacity: 0.6; cursor: not-allowed; }
	@media (max-width: 768px) { .input-grid { grid-template-columns: 1fr; } }
</style>
