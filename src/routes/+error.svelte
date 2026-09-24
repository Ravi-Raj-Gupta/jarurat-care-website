<script>
	import { page } from '$app/stores';
	import { AlertTriangle, Home, ArrowLeft } from 'lucide-svelte';
	
	$: status = $page.status;
	$: error = $page.error;
</script>

<svelte:head>
	<title>{status} - Page Not Found | Jarurat Care</title>
</svelte:head>

<div class="error-container">
	<div class="error-content">
		<div class="icon-wrapper">
			<AlertTriangle size={64} strokeWidth={1.5} color="#3B82F6" />
		</div>
		
		<h1>{status === 404 ? 'Oops! Page Not Found' : `Error ${status}`}</h1>
		
		<p class="error-message">
			{#if status === 404}
				The page you are looking for doesn't exist or has been moved. 
				Please check the URL or navigate back to safety.
			{:else}
				{error?.message || 'Something went wrong on our end. We are looking into it.'}
			{/if}
		</p>

		<div class="actions">
			<button class="btn-secondary" on:click={() => history.back()}>
				<ArrowLeft size={18} />
				Go Back
			</button>
			<a href="/" class="btn-primary">
				<Home size={18} />
				Back to Home
			</a>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
		background: #F8FAFC;
	}

	.error-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
	}

	.error-content {
		max-width: 480px;
		width: 100%;
		background: #FFFFFF;
		border-radius: 24px;
		padding: 48px 32px;
		text-align: center;
		box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.5);
	}

	.icon-wrapper {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: #EFF6FF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24px;
		border: 8px solid #FFFFFF;
		box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1);
	}

	h1 {
		font-size: 28px;
		font-weight: 800;
		color: #0F172A;
		margin: 0 0 16px;
		letter-spacing: -0.02em;
	}

	.error-message {
		font-size: 16px;
		color: #64748B;
		line-height: 1.6;
		margin: 0 0 32px;
	}

	.actions {
		display: flex;
		gap: 16px;
		justify-content: center;
	}

	.btn-primary, .btn-secondary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 24px;
		border-radius: 12px;
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		cursor: pointer;
	}

	.btn-primary {
		background: #2563EB;
		color: #FFFFFF;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
	}

	.btn-primary:hover {
		background: #1D4ED8;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
	}

	.btn-secondary {
		background: #F1F5F9;
		color: #475569;
	}

	.btn-secondary:hover {
		background: #E2E8F0;
		color: #0F172A;
	}

	@media (max-width: 480px) {
		.actions {
			flex-direction: column;
		}
		
		.error-content {
			padding: 32px 24px;
		}
	}
</style>
