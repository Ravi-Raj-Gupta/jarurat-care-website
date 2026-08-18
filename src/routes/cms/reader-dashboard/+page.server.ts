import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad } from './$types';

type Article = {
	id: string;
	title: string;
	category: string | null;
	author_id: string | null;
	created_at: string;
	cover_image_url: string | null;
	tags: string[] | null;
	views: number | null;
	likes_count: number | null;
	saves_count: number | null;
	content: string | null;
	excerpt: string | null;
};

type RecommendedArticle = {
	id: string;
	title: string;
	category: string | null;
	authorName: string;
	date: string;
	thumbnail: string;
	score: number;
};

const DEFAULT_THUMBNAIL =
	'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80';

function normalize(value: unknown): string {
	return String(value ?? '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ');
}

function normalizeInterests(interests: unknown): string[] {
	if (!Array.isArray(interests)) return [];

	return interests
		.map((interest) => normalize(interest))
		.filter(Boolean);
}

function calculateRecommendationScore(
	article: Article,
	interests: string[]
): number {
	const title = normalize(article.title);
	const category = normalize(article.category);
	const excerpt = normalize(article.excerpt);
	const content = normalize(article.content);

	const tags = Array.isArray(article.tags)
		? article.tags.map((tag) => normalize(tag))
		: [];

	let score = 0;

	for (const interest of interests) {
		if (!interest) continue;

		/*
		 * Exact category match
		 * Highest weight because category is a strong signal.
		 */
		if (category === interest) {
			score += 50;
		}

		/*
		 * Category contains interest
		 *
		 * Example:
		 * interest = "cancer"
		 * category = "Cancer Research"
		 */
		if (
			category.includes(interest) ||
			interest.includes(category)
		) {
			score += 35;
		}

		/*
		 * Exact tag match
		 */
		if (tags.includes(interest)) {
			score += 40;
		}

		/*
		 * Partial tag match
		 */
		if (
			tags.some(
				(tag) =>
					tag.includes(interest) ||
					interest.includes(tag)
			)
		) {
			score += 25;
		}

		/*
		 * Title match
		 */
		if (title.includes(interest)) {
			score += 30;
		}

		/*
		 * Excerpt match
		 */
		if (excerpt.includes(interest)) {
			score += 15;
		}

		/*
		 * Content match
		 */
		if (content.includes(interest)) {
			score += 10;
		}

		/*
		 * Support individual words.

		 * Example:
		 * interest = "breast cancer"
		 *
		 * Article title:
		 * "New research in breast cancer treatment"
		 */
		const words = interest
			.split(' ')
			.map((word) => word.trim())
			.filter((word) => word.length >= 4);

		for (const word of words) {
			if (title.includes(word)) {
				score += 8;
			}

			if (category.includes(word)) {
				score += 8;
			}

			if (tags.some((tag) => tag.includes(word))) {
				score += 8;
			}
		}
	}

	/*
	 * Popularity signals
	 *
	 * These are deliberately small compared with
	 * interest matching.
	 */
	score += Math.min(Number(article.views ?? 0) / 100, 15);

	score += Math.min(
		Number(article.likes_count ?? 0) * 2,
		10
	);

	score += Math.min(
		Number(article.saves_count ?? 0) * 2,
		10
	);

	return score;
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// ---------------------------------------------------------
	// LOAD PROFILE
	// ---------------------------------------------------------

	const { data: profile, error: profileError } =
		await supabaseAdmin
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.maybeSingle();

	if (profileError || !profile) {
		console.error(
			'Error loading profile:',
			profileError
		);

		throw redirect(303, '/cms/login');
	}

	if (!profile.profile_completed) {
		throw redirect(
			303,
			'/cms/complete-profile'
		);
	}

	if (profile.role === 'Doctor') {
		throw redirect(
			303,
			'/cms/doctor-dashboard'
		);
	}

	if (profile.role !== 'Reader') {
		throw redirect(
			303,
			'/cms/login'
		);
	}

	// ---------------------------------------------------------
	// AUTHOR MAP
	// ---------------------------------------------------------

	let authorsById = new Map<string, string>();

	// ---------------------------------------------------------
	// SAVED ARTICLES
	// ---------------------------------------------------------

	const {
		data: savedRows,
		error: savedError
	} = await supabaseAdmin
		.from('saved_articles')
		.select(
			'id, article_id, created_at'
		)
		.eq(
			'user_id',
			session.user.id
		)
		.order(
			'created_at',
			{ ascending: false }
		);

	if (savedError) {
		console.error(
			'Error loading saved articles:',
			savedError
		);
	}

	const savedRowsList = savedRows ?? [];

	const savedArticleIds =
		savedRowsList.map(
			(row) => row.article_id
		);

	let savedArticles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		savedAt: string;
	}> = [];

	if (savedArticleIds.length > 0) {
		const {
			data: articles,
			error: articlesError
		} = await supabaseAdmin
			.from('articles')
			.select(
				'id, title, category, author_id'
			)
			.in(
				'id',
				savedArticleIds
			);

		if (articlesError) {
			console.error(
				'Error loading saved article details:',
				articlesError
			);
		}

		const articlesList =
			articles ?? [];

		const authorIds = [
			...new Set(
				articlesList
					.map(
						(article) =>
							article.author_id
					)
					.filter(Boolean)
			)
		];

		if (authorIds.length > 0) {
			const {
				data: authors
			} = await supabaseAdmin
				.from('profiles')
				.select(
					'id, full_name'
				)
				.in(
					'id',
					authorIds
				);

			authorsById =
				new Map(
					(authors ?? []).map(
						(author) => [
							author.id,
							author.full_name
						]
					)
				);
		}

		const articlesById =
			new Map(
				articlesList.map(
					(article) => [
						article.id,
						article
					]
				)
			);

		savedArticles =
			savedRowsList
				.map((row) => {
					const article =
						articlesById.get(
							row.article_id
						);

					if (!article)
						return null;

					return {
						id: article.id,
						title: article.title,
						category:
							article.category,
						authorName:
							authorsById.get(
								article.author_id
							) ||
							'Unknown',
						savedAt:
							row.created_at
					};
				})
				.filter(
					(
						article
					): article is NonNullable<
						typeof article
					> => article !== null
				);
	}

	// ---------------------------------------------------------
	// RECOMMENDATIONS
	// ---------------------------------------------------------

	const interests =
		normalizeInterests(
			profile.interests
		);

	console.log(
		'Normalized interests:',
		interests
	);

	let recommendedArticles:
		RecommendedArticle[] = [];

	/*
	 * Fetch published articles.
	 *
	 * IMPORTANT:
	 * We are NOT requesting "image".
	 *
	 * Your database has cover_image_url,
	 * not articles.image.
	 */

	const {
		data: publishedArticles,
		error: recommendationError
	} = await supabaseAdmin
		.from('articles')
		.select(`
			id,
			title,
			category,
			author_id,
			created_at,
			cover_image_url,
			tags,
			views,
			likes_count,
			saves_count,
			content,
			excerpt
		`)
		.eq(
			'status',
			'published'
		)
		.order(
			'created_at',
			{ ascending: false }
		)
		.limit(100);

	if (recommendationError) {
		console.error(
			'Recommendation query error:',
			recommendationError
		);
	} else {
		const articles =
			(publishedArticles ??
				[]) as Article[];

		console.log(
			'Published articles found:',
			articles.length
		);

		/*
		 * -----------------------------------------------------
		 * SCORE ARTICLES
		 * -----------------------------------------------------
		 */

		const scoredArticles =
			articles.map(
				(article) => ({
					article,
					score:
						calculateRecommendationScore(
							article,
							interests
						)
				})
			);

		console.log(
			'Scored articles:',
			scoredArticles.map(
				(item) => ({
					title:
						item.article.title,
					score:
						item.score
				})
			)
		);

		/*
		 * -----------------------------------------------------
		 * PERSONALIZED RECOMMENDATIONS
		 * -----------------------------------------------------
		 */

		const personalized =
			scoredArticles
				.filter(
					(item) =>
						item.score > 0
				)
				.sort(
					(a, b) =>
						b.score -
						a.score
				)
				.slice(0, 4);

		/*
		 * -----------------------------------------------------
		 * FALLBACK
		 * -----------------------------------------------------
		 *
		 * If there are currently no cancer-related
		 * articles, don't show an empty section.
		 *
		 * Instead recommend latest/popular content.
		 */

		let finalArticles =
			personalized;

		if (
			finalArticles.length <
			4
		) {
			const usedIds =
				new Set(
					finalArticles.map(
						(item) =>
							item.article.id
					)
				);

			const fallback =
				scoredArticles
					.filter(
						(item) =>
							!usedIds.has(
								item.article.id
							)
					)
					.sort(
						(a, b) => {
							const aPopularity =
								Number(
									a.article
										.views ??
										0
								) +
								Number(
									a.article
										.likes_count ??
										0
								) *
									10 +
								Number(
									a.article
										.saves_count ??
										0
								) *
									10;

							const bPopularity =
								Number(
									b.article
										.views ??
										0
								) +
								Number(
									b.article
										.likes_count ??
										0
								) *
									10 +
								Number(
									b.article
										.saves_count ??
										0
								) *
									10;

							return (
								bPopularity -
								aPopularity
							);
						}
					)
					.slice(
						0,
						4 -
							finalArticles.length
					);

			finalArticles = [
				...finalArticles,
				...fallback
			];
		}

		/*
		 * -----------------------------------------------------
		 * FETCH AUTHORS
		 * -----------------------------------------------------
		 */

		const recommendationAuthorIds =
			[
				...new Set(
					finalArticles
						.map(
							(item) =>
								item
									.article
									.author_id
						)
						.filter(Boolean)
				)
			];

		if (
			recommendationAuthorIds.length >
			0
		) {
			const {
				data: authors
			} = await supabaseAdmin
				.from('profiles')
				.select(
					'id, full_name'
				)
				.in(
					'id',
					recommendationAuthorIds
				);

			for (const author of
				authors ?? []) {
				authorsById.set(
					author.id,
					author.full_name
				);
			}
		}

		/*
		 * -----------------------------------------------------
		 * FINAL RECOMMENDATION OBJECT
		 * -----------------------------------------------------
		 */

		recommendedArticles =
			finalArticles.map(
				(item) => {
					const article =
						item.article;

					return {
						id: String(
							article.id
						),
						title:
							article.title,
						category:
							article.category,
						authorName:
							authorsById.get(
								article.author_id ??
									''
							) ||
							'Unknown',
						date:
							article.created_at,
						thumbnail:
							article.cover_image_url ||
							DEFAULT_THUMBNAIL,
						score:
							item.score
					};
				}
			);
	}

	console.log(
		'Final recommendations:',
		recommendedArticles.length
	);

	// ---------------------------------------------------------
	// LIKED ARTICLES
	// ---------------------------------------------------------

	const {
		data: likedRows,
		error: likedError
	} = await supabaseAdmin
		.from('article_likes')
		.select(
			'id, article_id, created_at'
		)
		.eq(
			'user_id',
			session.user.id
		)
		.order(
			'created_at',
			{ ascending: false }
		);

	if (likedError) {
		console.error(
			'Error loading liked articles:',
			likedError
		);
	}

	const likedRowsList =
		likedRows ?? [];

	const likedArticleIds =
		likedRowsList.map(
			(row) =>
				row.article_id
		);

	let reactedArticles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		likedAt: string;
	}> = [];

	if (
		likedArticleIds.length >
		0
	) {
		const {
			data: likedArticleData,
			error: likedArticlesError
		} = await supabaseAdmin
			.from('articles')
			.select(
				'id, title, category, author_id'
			)
			.in(
				'id',
				likedArticleIds
			);

		if (
			likedArticlesError
		) {
			console.error(
				'Error loading liked article details:',
				likedArticlesError
			);
		}

		const articlesList =
			likedArticleData ??
			[];

		const authorIds = [
			...new Set(
				articlesList
					.map(
						(article) =>
							article.author_id
					)
					.filter(Boolean)
			)
		];

		const newAuthors =
			authorIds.filter(
				(id) =>
					!authorsById.has(id)
			);

		if (
			newAuthors.length >
			0
		) {
			const {
				data: authors
			} = await supabaseAdmin
				.from('profiles')
				.select(
					'id, full_name'
				)
				.in(
					'id',
					newAuthors
				);

			for (const author of
				authors ?? []) {
				authorsById.set(
					author.id,
					author.full_name
				);
			}
		}

		const articlesById =
			new Map(
				articlesList.map(
					(article) => [
						article.id,
						article
					]
				)
			);

		reactedArticles =
			likedRowsList
				.map((row) => {
					const article =
						articlesById.get(
							row.article_id
						);

					if (!article)
						return null;

					return {
						id: article.id,
						title: article.title,
						category:
							article.category,
						authorName:
							authorsById.get(
								article.author_id
							) ||
							'Unknown',
						likedAt:
							row.created_at
					};
				})
				.filter(
					(
						article
					): article is NonNullable<
						typeof article
					> => article !== null
				);
	}

	// ---------------------------------------------------------
	// FOLLOWED DOCTORS
	// ---------------------------------------------------------

	let followedDoctors: Array<{
		id: string;
		name: string;
		specialization: string | null;
		organization: string | null;
		avatar: string | null;
	}> = [];

	const {
		data: followedRows,
		error: followedError
	} = await supabaseAdmin
		.from('doctor_followers')
		.select(
			'doctor_id'
		)
		.eq(
			'follower_id',
			session.user.id
		);

	if (followedError) {
		console.error(
			'Error loading followed doctors:',
			followedError
		);
	}

	const followedDoctorIds =
		(
			followedRows ??
			[]
		).map(
			(row) =>
				row.doctor_id
		);

	if (
		followedDoctorIds.length >
		0
	) {
		const {
			data: doctorsData,
			error: doctorsError
		} = await supabaseAdmin
			.from('profiles')
			.select(
				'id, full_name, specialization, organization'
			)
			.in(
				'id',
				followedDoctorIds
			);

		if (doctorsError) {
			console.error(
				'Error loading doctors:',
				doctorsError
			);
		}

		if (doctorsData) {
			followedDoctors =
				doctorsData.map(
					(doctor) => ({
						id: doctor.id,
						name:
							doctor.full_name ||
							'Unknown Doctor',
						specialization:
							doctor.specialization,
						organization:
							doctor.organization,
						avatar: null
					})
				);
		}
	}

	// ---------------------------------------------------------
	// RETURN
	// ---------------------------------------------------------

	return {
		profile,

		savedArticles,

		recommendedArticles,

		reactedArticles,

		followedDoctors,

		savedCount:
			savedRowsList.length,

		interestsCount:
			interests.length
	};
};