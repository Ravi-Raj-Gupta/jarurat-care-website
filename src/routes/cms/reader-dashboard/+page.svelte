<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import ReaderProfileHeader from '$lib/components/dashboard/ReaderProfileHeader.svelte';
	import AboutCard from '$lib/components/dashboard/AboutCard.svelte';
	import InterestsCard from '$lib/components/dashboard/InterestsCard.svelte';
	import SavedArticlesCard from '$lib/components/dashboard/SavedArticlesCard.svelte';
	import RecommendedArticlesCard from '$lib/components/dashboard/RecommendedArticlesCard.svelte';
	import ReactedArticlesCard from '$lib/components/dashboard/ReactedArticlesCard.svelte';
	import FollowedDoctorsCard from '$lib/components/dashboard/FollowedDoctorsCard.svelte';
	import PopularArticlesCard from '$lib/components/dashboard/PopularArticlesCard.svelte';

	import {
		MessageSquare,
		ArrowRight,
		Sparkles
	} from 'lucide-svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	$: profile = data.profile;
	$: savedArticles = data.savedArticles;
	$: savedCount = data.savedCount;
	$: interestsCount = data.interestsCount;
	$: recommendedArticles = data.recommendedArticles || [];
	$: reactedArticles = data.reactedArticles || [];
	$: followedDoctors = data.followedDoctors || [];
	$: popularArticles = data.popularArticles || [];
</script>

<svelte:head>
	<title>My Dashboard | JCF</title>
</svelte:head>

<Nav />

<div class="page">
	<div class="container">

		<!-- PROFILE HEADER -->
		<ReaderProfileHeader
			{profile}
			{savedCount}
			{interestsCount}
		/>

		<!-- WELCOME -->
		<section class="welcome-card">
			<div class="welcome-content">

				<div class="welcome-icon">
					<Sparkles size={21} />
				</div>

				<div>
					<h2>
						Welcome back{profile?.full_name
							? `, ${profile.full_name}`
							: ''}
					</h2>

					<p>
						Continue exploring health resources,
						connect with doctors, and share your
						experience with the community.
					</p>
				</div>

			</div>
		</section>


		<!-- ABOUT + INTERESTS -->
		<div class="grid">

			<div class="dashboard-card">
				<AboutCard
					bio={profile?.bio || ''}
				/>
			</div>

			<div class="dashboard-card">
				<InterestsCard
					interests={profile?.interests || []}
				/>
			</div>

		</div>


		<!-- RECOMMENDED ARTICLES -->
		<section class="section-block">

			<div class="section-heading">
				<div>
					<span class="section-label">
						EXPLORE
					</span>

					<h2>Recommended for You</h2>

					<p>
						Articles selected based on your interests.
					</p>
				</div>
			</div>

			<div class="dashboard-card">
				<RecommendedArticlesCard
					articles={recommendedArticles}
				/>
			</div>

			<div class="dashboard-card" style="margin-top: 20px;">
				<PopularArticlesCard
					articles={popularArticles}
				/>
			</div>

		</section>


		<!-- FOLLOWED DOCTORS -->
		<section class="section-block">

			<div class="section-heading">
				<div>
					<span class="section-label">
						COMMUNITY
					</span>

					<h2>Doctors You Follow</h2>

					<p>
						Stay connected with doctors from the community.
					</p>
				</div>
			</div>

			<div class="dashboard-card">
				<FollowedDoctorsCard
					doctors={followedDoctors}
				/>
			</div>

		</section>


		<!-- TESTIMONIAL -->
		<section class="testimonial-section">

			<div class="testimonial-content">

				<div class="testimonial-icon">
					<MessageSquare size={23} />
				</div>

				<div class="testimonial-text">

					<span class="section-label testimonial-label">
						YOUR EXPERIENCE
					</span>

					<h2>Share Your Experience</h2>

					<p>
						Have something to share about your experience
						with Jarurat Care? Write a testimonial and let
						our community know.
					</p>

				</div>

			</div>


			<!-- IMPORTANT:
			     Reader has its own testimonial route.
			     This does NOT open the Doctor testimonial dashboard.
			-->
			<a
				href="/cms/reader-dashboard/testimonials"
				class="testimonial-button"
			>
				<MessageSquare size={16} />

				<span>Write Testimonial</span>

				<ArrowRight size={16} />
			</a>

		</section>


		<!-- YOUR ACTIVITY -->
		<section class="section-block">

			<div class="section-heading">

				<div>
					<span class="section-label">
						YOUR ACTIVITY
					</span>

					<h2>Your Articles</h2>

					<p>
						Access your saved and liked articles.
					</p>
				</div>

			</div>


			<div class="grid">

				<div class="dashboard-card">
					<SavedArticlesCard
						articles={savedArticles}
					/>
				</div>

				<div class="dashboard-card">
					<ReactedArticlesCard
						articles={reactedArticles}
					/>
				</div>

			</div>

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

		background: #f8fafc;
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
		max-width: 1120px;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		gap: 22px;
	}


	/* WELCOME */

	.welcome-card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		padding: 20px 22px;

		box-shadow:
			0 2px 8px rgba(15, 23, 42, 0.04);
	}


	.welcome-content {
		display: flex;
		align-items: center;
		gap: 14px;
	}


	.welcome-icon {
		width: 44px;
		height: 44px;
		flex-shrink: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 11px;

		background: #eff6ff;
		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.welcome-card h2 {
		margin: 0;

		font-size: 18px;
		font-weight: 750;

		color: #0f172a;
	}


	.welcome-card p {
		margin: 4px 0 0;

		font-size: 13px;
		line-height: 1.5;

		color: #64748b;
	}


	/* GRID */

	.grid {
		display: grid;

		grid-template-columns:
			repeat(2, minmax(0, 1fr));

		gap: 20px;
	}


	.dashboard-card {
		background: #ffffff;

		border-radius: 13px;

		border: 1px solid #e2e8f0;

		box-shadow:
			0 2px 7px rgba(15, 23, 42, 0.035);

		overflow: hidden;

		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}


	.dashboard-card:hover {
		transform: translateY(-1px);

		box-shadow:
			0 5px 15px rgba(15, 23, 42, 0.06);
	}


	/* SECTIONS */

	.section-block {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}


	.section-heading {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;

		padding: 0 2px;
	}


	.section-label {
		display: block;

		margin-bottom: 4px;

		font-size: 10px;
		font-weight: 800;

		letter-spacing: 0.08em;

		color: #64748b;
	}


	.section-heading h2 {
		margin: 0;

		font-size: 18px;
		font-weight: 750;

		color: #0f172a;

		letter-spacing: -0.01em;
	}


	.section-heading p {
		margin: 3px 0 0;

		font-size: 12px;

		color: #64748b;
	}


	/* TESTIMONIAL */

	.testimonial-section {
		display: flex;

		align-items: center;

		justify-content: space-between;

		gap: 24px;

		padding: 22px 24px;

		background: #ffffff;

		border: 1px solid #dbeafe;

		border-radius: 14px;

		box-shadow:
			0 2px 8px rgba(15, 23, 42, 0.04);

		position: relative;

		overflow: hidden;
	}


	.testimonial-section::before {
		content: '';

		position: absolute;

		left: 0;
		top: 0;
		bottom: 0;

		width: 4px;

		background: #2563eb;
	}


	.testimonial-content {
		display: flex;

		align-items: center;

		gap: 14px;

		min-width: 0;
	}


	.testimonial-icon {
		width: 46px;
		height: 46px;

		flex-shrink: 0;

		display: flex;

		align-items: center;
		justify-content: center;

		border-radius: 11px;

		background: #eff6ff;

		color: #2563eb;

		border: 1px solid #dbeafe;
	}


	.testimonial-text h2 {
		margin: 0;

		font-size: 18px;
		font-weight: 750;

		color: #0f172a;
	}


	.testimonial-text p {
		margin: 4px 0 0;

		max-width: 600px;

		font-size: 12px;
		line-height: 1.55;

		color: #64748b;
	}


	.testimonial-label {
		color: #2563eb;
	}


	.testimonial-button {
		flex-shrink: 0;

		display: inline-flex;

		align-items: center;
		justify-content: center;

		gap: 7px;

		padding: 10px 15px;

		border-radius: 8px;

		background: #2563eb;

		color: #ffffff;

		text-decoration: none;

		font-size: 12px;

		font-weight: 700;

		box-shadow:
			0 3px 8px rgba(37, 99, 235, 0.18);

		transition:
			background 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}


	.testimonial-button:hover {
		background: #1d4ed8;

		transform: translateY(-1px);

		box-shadow:
			0 5px 12px rgba(37, 99, 235, 0.24);
	}


	/* RESPONSIVE */

	@media (max-width: 900px) {
		.container {
			max-width: 100%;
		}

		.grid {
			grid-template-columns: 1fr;
		}
	}


	@media (max-width: 700px) {
		.page {
			padding: 90px 16px 40px;
		}

		.welcome-content {
			align-items: flex-start;
		}

		.testimonial-section {
			align-items: flex-start;

			flex-direction: column;

			padding: 20px;
		}

		.testimonial-content {
			align-items: flex-start;
		}

		.testimonial-button {
			width: 100%;
		}
	}


	@media (max-width: 480px) {
		.welcome-card {
			padding: 17px;
		}

		.welcome-card h2 {
			font-size: 16px;
		}

		.section-heading h2 {
			font-size: 16px;
		}

		.testimonial-text h2 {
			font-size: 16px;
		}
	}
</style>