import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import { cmsSupabase } from '$lib/cmsSupabase';
import type { PageServerLoad } from './$types';

type AuthorMap = Map<string, string>;

type SavedArticle = {
	id: string;
	title: string;
	category: string | null;
	authorName: string;
	savedAt: string;
};

type RecommendedArticle = {
	id: string;
	title: string;
	category: string | null;
	authorName: string;
	date: string;
	thumbnail: string;
	type: 'article' | 'research';
};

type ReactedArticle = {
	id: string;
	title: string;
	category: string | null;
	authorName: string;
	likedAt: string;
};

type FollowedDoctor = {
	id: string;
	name: string;
	specialization: string | null;
	organization: string | null;
	avatar: string | null;
};

/* =========================================================
   HELPERS
   ========================================================= */

function normalize(value: unknown): string {
	if (value === null || value === undefined) return '';

	return String(value)
		.toLowerCase()
		.trim()
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ');
}

function normalizeInterests(interests: unknown[]): string[] {
	return interests
		.map((interest) => normalize(interest))
		.filter(Boolean);
}

function arrayValues(value: unknown): string[] {
	if (!Array.isArray(value)) return [];

	return value
		.map((item) => normalize(item))
		.filter(Boolean);
}

/*
 * Maps the reader's more specific interests to the broader
 * article categories that actually exist in the CMS.
 *
 * Example:
 *
 * Cancer Research
 *      -> Cancer Care
 *
 * Breast Cancer
 *      -> Cancer Care
 *
 * Lung Cancer
 *      -> Cancer Care
 */
function getRelatedCategories(interest: string): string[] {
	const normalizedInterest = normalize(interest);

	const categoryMap: Record<string, string[]> = {
		'cancer research': ['cancer care'],
		'cancer immunology': ['cancer care'],
		'breast cancer': ['cancer care'],
		'lung cancer': ['cancer care'],
		'cancer treatment': ['cancer care'],
		'cancer prevention': ['cancer care'],
		'oncology': ['cancer care'],
		'medical oncology': ['cancer care'],

		'mental health': ['mental health'],
		'mental wellness': ['mental health'],
		'psychology': ['mental health'],
		'psychiatry': ['mental health'],
		'anxiety': ['mental health'],
		'depression': ['mental health'],

		'nutrition': ['nutrition'],
		'diet': ['nutrition'],
		'healthy diet': ['nutrition'],
		'food': ['nutrition'],
		'diet and nutrition': ['nutrition'],

		'pediatrics': ['pediatrics'],
		'child health': ['pediatrics'],
		'children health': ['pediatrics'],
		'childcare': ['pediatrics'],

		'general health': ['general health'],
		'wellness': ['general health'],
		'healthy living': ['general health'],
		'health': ['general health']
	};

	return categoryMap[normalizedInterest] ?? [];
}

/*
 * Converts an interest into useful keywords.

 * This allows:
 *
 * Cancer Immunology
 *      -> cancer, immunology
 *
 * Breast Cancer
 *      -> breast, cancer
 *
 * Cancer Research
 *      -> cancer, research
 */
function getInterestKeywords(interest: string): string[] {
	const normalizedInterest = normalize(interest);

	const stopWords = new Set([
		'and',
		'or',
		'the',
		'of',
		'for',
		'in',
		'to',
		'with',
		'care',
		'health'
	]);

	const words = normalizedInterest
		.split(' ')
		.map((word) => word.trim())
		.filter((word) => word.length >= 3 && !stopWords.has(word));

	/*
	 * Always keep cancer because it is extremely useful
	 * for cancer-related interests.
	 */
	if (
		normalizedInterest.includes('cancer') &&
		!words.includes('cancer')
	) {
		words.push('cancer');
	}

	return [...new Set(words)];
}

/*
 * Calculate how relevant an article is to the reader.
 *
 * Higher score = stronger recommendation.
 */
function calculateArticleScore(
	article: {
		title?: unknown;
		category?: unknown;
		tags?: unknown;
		abstract?: unknown;
		content?: unknown;
	},
	interests: string[]
): number {
	if (!interests.length) return 0;

	const title = normalize(article.title);
	const category = normalize(article.category);
	const tags = arrayValues(article.tags);

	const abstract = normalize(article.abstract);
	const content = normalize(article.content);

	let score = 0;

	for (const interest of interests) {
		const relatedCategories = getRelatedCategories(interest);
		const keywords = getInterestKeywords(interest);

		/* -----------------------------------------------------
		   1. EXACT CATEGORY MATCH
		   ----------------------------------------------------- */

		if (category === interest) {
			score += 100;
		}

		/* -----------------------------------------------------
		   2. RELATED CATEGORY MATCH
		   ----------------------------------------------------- */

		if (relatedCategories.includes(category)) {
			score += 70;
		}

		/* -----------------------------------------------------
		   3. EXACT TAG MATCH
		   ----------------------------------------------------- */

		if (tags.includes(interest)) {
			score += 90;
		}

		/* -----------------------------------------------------
		   4. TAG PARTIAL MATCH
		   ----------------------------------------------------- */

		for (const tag of tags) {
			for (const keyword of keywords) {
				if (tag === keyword) {
					score += 45;
				} else if (
					tag.includes(keyword) ||
					keyword.includes(tag)
				) {
					score += 25;
				}
			}
		}

		/* -----------------------------------------------------
		   5. TITLE MATCH
		   ----------------------------------------------------- */

		for (const keyword of keywords) {
			if (title.includes(keyword)) {
				score += 35;
			}
		}

		/* -----------------------------------------------------
		   6. ABSTRACT MATCH
		   ----------------------------------------------------- */

		for (const keyword of keywords) {
			if (abstract.includes(keyword)) {
				score += 20;
			}
		}

		/* -----------------------------------------------------
		   7. CONTENT MATCH
		   ----------------------------------------------------- */

		for (const keyword of keywords) {
			if (content.includes(keyword)) {
				score += 10;
			}
		}
	}

	return score;
}

/*
 * Calculate score for research papers.
 *
 * Research papers do not have a category, so we rely on:
 * - title
 * - tags
 * - abstract
 * - content
 */
function calculateResearchScore(
	research: {
		title?: unknown;
		tags?: unknown;
		abstract?: unknown;
		content?: unknown;
	},
	interests: string[]
): number {
	if (!interests.length) return 0;

	const title = normalize(research.title);
	const tags = arrayValues(research.tags);
	const abstract = normalize(research.abstract);
	const content = normalize(research.content);

	let score = 0;

	for (const interest of interests) {
		const keywords = getInterestKeywords(interest);

		/*
		 * Exact interest in title
		 */
		if (title.includes(interest)) {
			score += 100;
		}

		/*
		 * Individual keywords in title
		 */
		for (const keyword of keywords) {
			if (title.includes(keyword)) {
				score += 40;
			}
		}

		/*
		 * Exact tag
		 */
		if (tags.includes(interest)) {
			score += 90;
		}

		/*
		 * Tag keyword match
		 */
		for (const tag of tags) {
			for (const keyword of keywords) {
				if (tag === keyword) {
					score += 45;
				} else if (
					tag.includes(keyword) ||
					keyword.includes(tag)
				) {
					score += 25;
				}
			}
		}

		/*
		 * Abstract
		 */
		for (const keyword of keywords) {
			if (abstract.includes(keyword)) {
				score += 20;
			}
		}

		/*
		 * Content
		 */
		for (const keyword of keywords) {
			if (content.includes(keyword)) {
				score += 10;
			}
		}
	}

	return score;
}

/* =========================================================
   LOAD
   ========================================================= */

export const load: PageServerLoad = async ({ locals }) => {
	/* -------------------------------------------------------
	   AUTHENTICATION
	   ------------------------------------------------------- */

	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	/* -------------------------------------------------------
	   PROFILE
	   ------------------------------------------------------- */

	const { data: profile, error: profileError } =
		await supabaseAdmin
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.maybeSingle();

	if (profileError || !profile) {
		console.error('Error loading profile:', profileError);
		throw redirect(303, '/cms/login');
	}

	if (!profile.profile_completed) {
		throw redirect(303, '/cms/complete-profile');
	}

	/* -------------------------------------------------------
	   ROLE CHECK
	   ------------------------------------------------------- */

	if (profile.role === 'Doctor') {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	if (profile.role !== 'Reader') {
		throw redirect(303, '/cms/login');
	}

	/* -------------------------------------------------------
	   AUTHOR CACHE
	   ------------------------------------------------------- */

	const authorsById: AuthorMap = new Map();

	/* =======================================================
	   SAVED ARTICLES
	   ======================================================= */

	const {
		data: savedRows,
		error: savedError
	} = await supabaseAdmin
		.from('saved_articles')
		.select('id, article_id, created_at')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (savedError) {
		console.error(
			'Error loading saved articles:',
			savedError
		);
	}

	const savedRowsList = savedRows ?? [];

	const articleIds = savedRowsList.map(
		(row) => row.article_id
	);

	let savedArticles: SavedArticle[] = [];

	if (articleIds.length > 0) {
		const {
			data: articles,
			error: articlesError
		} = await supabaseAdmin
			.from('articles')
			.select('id, title, category, author_id')
			.in('id', articleIds);

		if (articlesError) {
			console.error(
				'Error loading saved article details:',
				articlesError
			);
		}

		const articlesList = articles ?? [];

		const authorIds = [
			...new Set(
				articlesList
					.map((article) => article.author_id)
					.filter(Boolean)
			)
		];

		if (authorIds.length > 0) {
			const {
				data: authors,
				error: authorsError
			} = await supabaseAdmin
				.from('profiles')
				.select('id, full_name')
				.in('id', authorIds);

			if (authorsError) {
				console.error(
					'Error loading article authors:',
					authorsError
				);
			}

			(authors ?? []).forEach((author) => {
				authorsById.set(
					author.id,
					author.full_name || 'Unknown'
				);
			});
		}

		const articlesById = new Map(
			articlesList.map((article) => [
				article.id,
				article
			])
		);

		savedArticles = savedRowsList
			.map((row) => {
				const article = articlesById.get(
					row.article_id
				);

				if (!article) return null;

				return {
					id: article.id,
					title: article.title,
					category: article.category,
					authorName:
						authorsById.get(article.author_id) ||
						'Unknown',
					savedAt: row.created_at
				};
			})
			.filter(
				(article): article is SavedArticle =>
					article !== null
			);
	}

	/* =======================================================
	   READER INTERESTS
	   ======================================================= */

	const interests = normalizeInterests(
		profile.interests ?? []
	);

	console.log(
		'Normalized interests:',
		interests
	);

	/* =======================================================
	   RECOMMENDATIONS
	   ======================================================= */

	let recommendedArticles: RecommendedArticle[] = [];

	if (interests.length > 0) {
		/* ---------------------------------------------------
		   FETCH PUBLISHED ARTICLES

		   IMPORTANT:
		   Do NOT request `image` because your articles table
		   does not have an `image` column.
		   --------------------------------------------------- */

		const {
			data: publishedArticles,
			error: recommendationError
		} = await supabaseAdmin
			.from('articles')
			.select(
				`
				id,
				title,
				category,
				tags,
				abstract,
				content,
				author_id,
				created_at,
				cover_image_url
				`
			)
			.eq('status', 'published')
			.order('created_at', {
				ascending: false
			})
			.limit(100);

		if (recommendationError) {
			console.error(
				'Recommendation query error:',
				recommendationError
			);
		}

		const articlesForRecommendation =
			publishedArticles ?? [];

		console.log(
			'Published articles found:',
			articlesForRecommendation.length
		);

		/* ---------------------------------------------------
		   DEBUG: SHOW AVAILABLE ARTICLE DATA
		   --------------------------------------------------- */

		console.log(
			'Articles available for recommendation:',
			articlesForRecommendation.map(
				(article) => ({
					id: article.id,
					title: article.title,
					category: article.category,
					tags: article.tags
				})
			)
		);

		/* ---------------------------------------------------
		   SCORE ARTICLES
		   --------------------------------------------------- */

		const scoredArticles = articlesForRecommendation
			.map((article) => ({
				article,
				score: calculateArticleScore(
					article,
					interests
				)
			}))
			.filter((item) => item.score > 0)
			.sort((a, b) => {
				/*
				 * Higher score first.
				 *
				 * If scores are equal, newer article first.
				 */
				if (b.score !== a.score) {
					return b.score - a.score;
				}

				return (
					new Date(
						b.article.created_at
					).getTime() -
					new Date(
						a.article.created_at
					).getTime()
				);
			});

		console.log(
			'Scored recommendations:',
			scoredArticles.map((item) => ({
				id: item.article.id,
				title: item.article.title,
				category: item.article.category,
				tags: item.article.tags,
				score: item.score
			}))
		);

		/* ---------------------------------------------------
		   FETCH AUTHORS
		   --------------------------------------------------- */

		const recommendationAuthorIds = [
			...new Set(
				scoredArticles
					.map(
						(item) =>
							item.article.author_id
					)
					.filter(Boolean)
			)
		];

		const newAuthorsToFetch =
			recommendationAuthorIds.filter(
				(id) => !authorsById.has(id)
			);

		if (newAuthorsToFetch.length > 0) {
			const {
				data: recommendationAuthors,
				error: recommendationAuthorsError
			} = await supabaseAdmin
				.from('profiles')
				.select('id, full_name')
				.in(
					'id',
					newAuthorsToFetch
				);

			if (recommendationAuthorsError) {
				console.error(
					'Error loading recommendation authors:',
					recommendationAuthorsError
				);
			}

			(
				recommendationAuthors ?? []
			).forEach((author) => {
				authorsById.set(
					author.id,
					author.full_name ||
						'Unknown'
				);
			});
		}

		/* ---------------------------------------------------
		   FINAL TOP 4 RECOMMENDATIONS
		   --------------------------------------------------- */

		recommendedArticles = scoredArticles
			.slice(0, 4)
			.map((item) => {
				const article = item.article;

				return {
					id: String(article.id),
					title: article.title,
					category:
						article.category,
					authorName:
						authorsById.get(
							article.author_id
						) || 'Unknown',
					date: article.created_at,
					thumbnail:
						article.cover_image_url ||
						'',
					type: 'article'
				};
			});

		console.log(
			'Final recommendations:',
			recommendedArticles.length
		);
	}

	/* =======================================================
	   LIKED ARTICLES
	   ======================================================= */

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
		.order('created_at', {
			ascending: false
		});

	if (likedError) {
		console.error(
			'Error loading liked articles:',
			likedError
		);
	}

	const likedRowsList = likedRows ?? [];

	const likedArticleIds =
		likedRowsList.map(
			(row) => row.article_id
		);

	let reactedArticles: ReactedArticle[] =
		[];

	if (likedArticleIds.length > 0) {
		const {
			data: likedArticles,
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

		if (likedArticlesError) {
			console.error(
				'Error loading liked article details:',
				likedArticlesError
			);
		}

		const likedArticlesList =
			likedArticles ?? [];

		const likedAuthorIds = [
			...new Set(
				likedArticlesList
					.map(
						(article) =>
							article.author_id
					)
					.filter(Boolean)
			)
		];

		const newLikedAuthors =
			likedAuthorIds.filter(
				(id) =>
					!authorsById.has(id)
			);

		if (
			newLikedAuthors.length > 0
		) {
			const {
				data: moreAuthors,
				error: moreAuthorsError
			} = await supabaseAdmin
				.from('profiles')
				.select(
					'id, full_name'
				)
				.in(
					'id',
					newLikedAuthors
				);

			if (moreAuthorsError) {
				console.error(
					'Error loading liked article authors:',
					moreAuthorsError
				);
			}

			(
				moreAuthors ?? []
			).forEach((author) => {
				authorsById.set(
					author.id,
					author.full_name ||
						'Unknown'
				);
			});
		}

		const likedArticlesById =
			new Map(
				likedArticlesList.map(
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
						likedArticlesById.get(
							row.article_id
						);

					if (!article)
						return null;

					return {
						id: article.id,
						title:
							article.title,
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
					(article): article is ReactedArticle =>
						article !== null
				);
	}

	/* =======================================================
	   FOLLOWED DOCTORS
	   ======================================================= */

	let followedDoctors: FollowedDoctor[] =
		[];

	const {
		data: followedRows,
		error: followedError
	} = await supabaseAdmin
		.from('doctor_followers')
		.select('doctor_id')
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

	const followedRowsList =
		followedRows ?? [];

	const followedDoctorIds =
		followedRowsList.map(
			(row) => row.doctor_id
		);

	if (
		followedDoctorIds.length > 0
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
				'Error loading doctors details:',
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

	/* =======================================================
	   RETURN
	   ======================================================= */

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