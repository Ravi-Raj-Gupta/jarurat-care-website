<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import { cmsSupabase } from '$lib/cmsSupabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let user: any = null;

	let qualification = '';
	let researchArea = '';
	let reason = '';

	let loading = true;
	let submitting = false;
	let message = '';

	onMount(async () => {
		const {
			data: { user: u }
		} = await cmsSupabase.auth.getUser();

		if (!u) {
			goto('/cms/login');
			return;
		}

		user = u;

		const { data: profile } = await cmsSupabase
			.from('profiles')
			.select('role')
			.eq('id', u.id)
			.single();

		if (profile?.role === 'author') {
			goto('/cms/author_dashboard');
			return;
		}

		const { data: existing } = await cmsSupabase
			.from('author_requests')
			.select('*')
			.eq('user_id', u.id)
			.maybeSingle();

		if (existing) {
			goto('/cms/pending');
			return;
		}

		loading = false;
	});

	async function submitRequest() {
		message = '';

		if (!qualification.trim()) {
			message = 'Qualification is required';
			return;
		}

		if (!researchArea.trim()) {
			message = 'Research Area is required';
			return;
		}

		if (reason.trim().length < 30) {
			message = 'Reason should contain at least 30 characters.';
			return;
		}

		submitting = true;

		const { error } = await cmsSupabase
			.from('author_requests')
			.insert([
				{
					user_id: user.id,
					qualification: qualification,
					research_area: researchArea,
					reason: reason,
					status: 'pending'
				}
			]);

		submitting = false;

		if (error) {
			message = error.message;
			return;
		}

		goto('/cms/pending');
	}

	async function logout() {
		await cmsSupabase.auth.signOut();
		goto('/cms/login');
	}
</script>

<Nav />

<div class="dashboard">
	<div class="topbar">
		<div>
			<h1>Author Request</h1>
			<p class="welcome">
				Welcome, {user?.email?.split('@')[0] || '...'}
			</p>
		</div>

		<div style="display:flex;gap:12px;align-items:center;">
			<div class="pill">Role : User</div>
			<button class="btn-logout" on:click={logout}>
				Logout
			</button>
		</div>
	</div>

	<div class="layout">

		<div class="card">

			<h2>Become a Research Author</h2>

			<p class="subtitle">
				Submit your details to request author access.
				Once approved by an administrator, you'll be able
				to create and publish research articles.
			</p>

			<label>Qualification *</label>

			<input
				bind:value={qualification}
				placeholder="e.g. MBBS, PhD, B.Tech"
			/>

			<label>Research Area *</label>

			<input
				bind:value={researchArea}
				placeholder="e.g. Oncology"
			/>

			<label>Reason *</label>

			<textarea
				rows="7"
				bind:value={reason}
				placeholder="Explain why you want to become an author..."
			></textarea>

			{#if message}
				<p class="error">{message}</p>
			{/if}

			<button
				class="btn-submit"
				on:click={submitRequest}
				disabled={submitting}
			>
				{submitting ? 'Submitting...' : 'Submit Request'}
			</button>

		</div>

		<div class="card side">

			<h3>Application Process</h3>

			<div class="step">
				<div class="number">1</div>
				<div>
					<h4>Submit Request</h4>
					<p>Fill the author request form.</p>
				</div>
			</div>

			<div class="step">
				<div class="number">2</div>
				<div>
					<h4>Admin Review</h4>
					<p>Your request will be reviewed.</p>
				</div>
			</div>

			<div class="step">
				<div class="number">3</div>
				<div>
					<h4>Approval</h4>
					<p>Your account will be upgraded to Author.</p>
				</div>
			</div>

			<div class="step">
				<div class="number">4</div>
				<div>
					<h4>Start Publishing</h4>
					<p>Create research articles from your dashboard.</p>
				</div>
			</div>

		</div>

	</div>
</div>
<style>
	.dashboard {
		padding: 40px;
		background: #f4f9ff;
		min-height: 100vh;
		font-family: 'DM Sans', sans-serif;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 24px;
	}

	h1 {
		font-size: 30px;
		font-weight: 900;
		color: #0d2460;
		margin: 0;
	}

	.welcome {
		color: #5b6780;
		margin-top: 6px;
	}

	.pill {
		background: white;
		border: 1px solid #d8e8fa;
		color: #0155bd;
		font-weight: 800;
		padding: 10px 14px;
		border-radius: 999px;
	}

	.btn-logout {
		background: #f1f5f9;
		color: #374151;
		padding: 10px 16px;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		cursor: pointer;
		font-weight: 600;
	}

	.layout {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 24px;
		align-items: start;
	}

	.card {
		background: white;
		border-radius: 18px;
		padding: 24px;
		box-shadow: 0 8px 24px rgba(0,0,0,0.05);
		border: 1px solid #e8eef7;
	}

	h2 {
		margin: 0;
		color: #0d2460;
		font-size: 24px;
		font-weight: 800;
	}

	.subtitle {
		color: #6b7280;
		line-height: 1.7;
		margin: 14px 0 26px;
	}

	label {
		display: block;
		margin-bottom: 8px;
		margin-top: 18px;
		font-size: 14px;
		font-weight: 700;
		color: #374151;
	}

	input,
	textarea {
		width: 100%;
		padding: 12px 14px;
		border-radius: 10px;
		border: 1px solid #d9e3f0;
		font-size: 14px;
		font-family: inherit;
		box-sizing: border-box;
		background: white;
		outline: none;
		transition: .2s;
	}

	input:focus,
	textarea:focus {
		border-color: #0155bd;
		box-shadow: 0 0 0 3px rgba(1,85,189,.12);
	}

	textarea {
		resize: vertical;
		min-height: 170px;
	}

	.btn-submit {
		margin-top: 25px;
		width: 100%;
		padding: 14px;
		border: none;
		border-radius: 10px;
		background: #0155bd;
		color: white;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
		transition: .2s;
	}

	.btn-submit:hover {
		background: #01469a;
	}

	.btn-submit:disabled {
		opacity: .7;
		cursor: not-allowed;
	}

	.error {
		color: #dc2626;
		margin-top: 16px;
		font-weight: 600;
	}

	.side h3 {
		margin: 0 0 20px;
		font-size: 22px;
		color: #0d2460;
	}

	.step {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin-bottom: 22px;
	}

	.number {
		width: 36px;
		height: 36px;
		background: #0155bd;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		flex-shrink: 0;
	}

	.step h4 {
		margin: 0;
		color: #0d2460;
		font-size: 15px;
	}

	.step p {
		margin-top: 4px;
		color: #6b7280;
		font-size: 14px;
		line-height: 1.6;
	}

	@media (max-width: 1100px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 700px) {
		.dashboard {
			padding: 20px;
		}

		.topbar {
			flex-direction: column;
			align-items: flex-start;
			gap: 15px;
		}
	}
</style>