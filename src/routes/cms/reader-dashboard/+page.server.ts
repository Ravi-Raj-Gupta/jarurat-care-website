import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import { cmsSupabase } from '$lib/cmsSupabase';
import type { PageServerLoad } from './$types';

/* =========================================================
   TYPES
========================================================= */

type DashboardContent = {
	id: string;
	title: string;
	category: string;
	authorName: string;
	date: string;
	thumbnail: string;
	type: 'article' | 'research';
	href: string;
	views: number;
	likes: number;
	saves: number;
	savedAt?: string;
	likedAt?: string;
	score?: number;
};

type FollowedDoctor = {
	id: string;
	name: string;
	specialization: string | null;
	organization: string | null;
	avatar: string | null;
};

type ArticleRow = {
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
	status: string;
};

type ResearchRow = {
	id: string;
	title: string;
	subtitle: string | null;
	abstract: string | null;
	keywords: string | null;
	featured_image: string | null;
	user_id: string | null;
	created_at: string;
	views_count: number | null;
	likes_count: number | null;
	saves_count: number | null;
	status: string;
};

const DEFAULT_THUMBNAIL =
	'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80';

/* =========================================================
   HELPERS
========================================================= */

function normalize(value: unknown): string {
	return String(value ?? '')
		.toLowerCase()
		.trim()
		.replace(/[_-]+/g, ' ')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ');
}

function normalizeInterests(value: unknown): string[] {
	if (!Array.isArray(value)) return [];

	return [
		...new Set(
			value
				.map((item) => normalize(item))
				.filter(Boolean)
		)
	];
}

function parseKeywords(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.map((item) => normalize(item))
			.filter(Boolean);
	}

	if (typeof value === 'string') {
		return value
			.split(',')
			.map((item) => normalize(item))
			.filter(Boolean);
	}

	return [];
}

function getInterestKeywords(
	interest: string
): string[] {
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

	const words = normalize(interest)
		.split(' ')
		.map((word) => word.trim())
		.filter(
			(word) =>
				word.length >= 3 &&
				!stopWords.has(word)
		);

	if (
		normalize(interest).includes('cancer') &&
		!words.includes('cancer')
	) {
		words.push('cancer');
	}

	return [...new Set(words)];
}

/* =========================================================
   ARTICLE SCORE
========================================================= */

function calculateArticleScore(
	article: ArticleRow,
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
		const keywords =
			getInterestKeywords(interest);

		if (category === interest) {
			score += 100;
		}

		if (
			category.includes(interest) ||
			interest.includes(category)
		) {
			score += 60;
		}

		if (tags.includes(interest)) {
			score += 90;
		}

		for (const keyword of keywords) {
			if (title.includes(keyword)) {
				score += 30;
			}

			if (excerpt.includes(keyword)) {
				score += 15;
			}

			if (content.includes(keyword)) {
				score += 10;
			}

			if (
				tags.some((tag) =>
					tag.includes(keyword)
				)
			) {
				score += 25;
			}
		}
	}

	score += Math.min(
		Number(article.views ?? 0) / 100,
		15
	);

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

/* =========================================================
   RESEARCH SCORE

   IMPORTANT:
   research_articles uses `keywords`
   NOT `tags`.
========================================================= */

function calculateResearchScore(
	research: ResearchRow,
	interests: string[]
): number {
	const title = normalize(research.title);
	const subtitle = normalize(research.subtitle);
	const abstract = normalize(research.abstract);

	const keywords =
		parseKeywords(research.keywords);

	let score = 0;

	for (const interest of interests) {
		const normalizedInterest =
			normalize(interest);

		const interestKeywords =
			getInterestKeywords(interest);

		if (
			title.includes(normalizedInterest)
		) {
			score += 100;
		}

		if (
			subtitle.includes(normalizedInterest)
		) {
			score += 50;
		}

		if (
			abstract.includes(normalizedInterest)
		) {
			score += 40;
		}

		if (
			keywords.includes(
				normalizedInterest
			)
		) {
			score += 90;
		}

		for (const keyword of interestKeywords) {
			if (title.includes(keyword)) {
				score += 30;
			}

			if (subtitle.includes(keyword)) {
				score += 20;
			}

			if (abstract.includes(keyword)) {
				score += 15;
			}

			if (
				keywords.some(
					(item) =>
						item.includes(keyword) ||
						keyword.includes(item)
				)
			) {
				score += 25;
			}
		}
	}

	score += Math.min(
		Number(research.views_count ?? 0) / 100,
		15
	);

	score += Math.min(
		Number(research.likes_count ?? 0) * 2,
		10
	);

	score += Math.min(
		Number(research.saves_count ?? 0) * 2,
		10
	);

	return score;
}

/* =========================================================
   LOAD
========================================================= */

export const load: PageServerLoad = async ({
	locals
}) => {
	/* =====================================================
	   AUTH
	===================================================== */

	const {
		data: { user },
		error: authError
	} =
		await locals.supabase.auth.getUser();

	if (authError || !user) {
		throw redirect(
			303,
			'/cms/login'
		);
	}

	const userId = user.id;

	/* =====================================================
	   PROFILE
	===================================================== */

	const {
		data: profile,
		error: profileError
	} = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.maybeSingle();

	if (profileError || !profile) {
		console.error(
			'Reader profile error:',
			profileError
		);

		throw redirect(
			303,
			'/cms/login'
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

	/* =====================================================
	   AUTHOR CACHE
	===================================================== */

	const authorsById =
		new Map<string, string>();

	/* =====================================================
	   LOAD PUBLISHED ARTICLES
	===================================================== */

	let publishedArticles: ArticleRow[] = [];

	const {
		data: articleData,
		error: articleError
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
			excerpt,
			status
		`)
		.eq('status', 'published')
		.order('created_at', {
			ascending: false
		})
		.limit(200);

	if (articleError) {
		console.error(
			'Published articles error:',
			articleError
		);
	} else {
		publishedArticles =
			(articleData ?? []) as ArticleRow[];
	}

	/* =====================================================
	   LOAD PUBLISHED RESEARCH

	   DO NOT USE tags HERE.
	   Actual column = keywords.
	===================================================== */

	let publishedResearch: ResearchRow[] = [];

	const {
		data: researchData,
		error: researchError
	} = await cmsSupabase
		.from('research_articles')
		.select(`
			id,
			title,
			subtitle,
			abstract,
			keywords,
			featured_image,
			user_id,
			created_at,
			views_count,
			likes_count,
			saves_count,
			status
		`)
		.eq('status', 'published')
		.order('created_at', {
			ascending: false
		})
		.limit(200);

	if (researchError) {
		console.error(
			'Published research error:',
			researchError
		);
	} else {
		publishedResearch =
			(researchData ?? []) as ResearchRow[];
	}

	console.log(
		'Published articles found:',
		publishedArticles.length
	);

	console.log(
		'Published research papers found:',
		publishedResearch.length
	);

	/* =====================================================
	   LOAD AUTHORS
	===================================================== */

	const authorIds = [
		...new Set(
			[
				...publishedArticles.map(
					(a) => a.author_id
				),
				...publishedResearch.map(
					(r) => r.user_id
				)
			].filter(Boolean)
		)
	] as string[];

	if (authorIds.length > 0) {
		const {
			data: authors,
			error: authorsError
		} = await supabaseAdmin
			.from('profiles')
			.select(
				'id, full_name'
			)
			.in('id', authorIds);

		if (authorsError) {
			console.error(
				'Author lookup error:',
				authorsError
			);
		}

		for (const author of authors ?? []) {
			authorsById.set(
				author.id,
				author.full_name ||
					'Unknown'
			);
		}
	}

	/* =====================================================
	   SAVED CONTENT

	   IMPORTANT:
	   saved_articles.article_id can reference either:
	   - articles.id
	   - research_articles.id

	   We resolve against BOTH.
	===================================================== */

	const {
		data: savedRows,
		error: savedRowsError
	} = await supabaseAdmin
		.from('saved_articles')
		.select(
			'id, article_id, created_at'
		)
		.eq(
			'user_id',
			userId
		)
		.order(
			'created_at',
			{
				ascending: false
			}
		);

	if (savedRowsError) {
		console.error(
			'Saved rows error:',
			savedRowsError
		);
	}

	const savedRowsList =
		savedRows ?? [];

	const savedIds = savedRowsList
		.map(
			(row) => row.article_id
		)
		.filter(Boolean);

	let savedArticles: DashboardContent[] =
		[];

	if (savedIds.length > 0) {
		/* -----------------------------------------------
		   SAVED NORMAL ARTICLES
		------------------------------------------------ */

		const {
			data: articles,
			error: savedArticleError
		} = await supabaseAdmin
			.from('articles')
			.select(`
				id,
				title,
				category,
				author_id,
				created_at,
				cover_image_url,
				views,
				likes_count,
				saves_count
			`)
			.in(
				'id',
				savedIds
			);

		if (savedArticleError) {
			console.error(
				'Saved article lookup error:',
				savedArticleError
			);
		}

		const articleMap =
			new Map(
				(articles ?? []).map(
					(article) => [
						article.id,
						article
					]
				)
			);

		/* -----------------------------------------------
		   SAVED RESEARCH PAPERS
		------------------------------------------------ */

		const {
			data: research,
			error: savedResearchError
		} = await cmsSupabase
			.from('research_articles')
			.select(`
				id,
				title,
				user_id,
				created_at,
				featured_image,
				views_count,
				likes_count,
				saves_count
			`)
			.in(
				'id',
				savedIds
			);

		if (savedResearchError) {
			console.error(
				'Saved research lookup error:',
				savedResearchError
			);
		}

		const researchMap =
			new Map(
				(research ?? []).map(
					(item) => [
						item.id,
						item
					]
				)
			);

		/* -----------------------------------------------
		   COMBINE
		------------------------------------------------ */

		savedArticles =
			savedRowsList
				.map((row) => {
					const article =
						articleMap.get(
							row.article_id
						);

					if (article) {
						return {
							id: article.id,
							title: article.title,
							category:
								article.category ||
								'General Health',
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
							type: 'article' as const,
							href:
								`/content/article/${article.id}`,
							views: Number(
								article.views ?? 0
							),
							likes: Number(
								article.likes_count ?? 0
							),
							saves: Number(
								article.saves_count ?? 0
							),
							savedAt:
								row.created_at
						};
					}

					const paper =
						researchMap.get(
							row.article_id
						);

					if (paper) {
						return {
							id: paper.id,
							title: paper.title,
							category: 'Research',
							authorName:
								authorsById.get(
									paper.user_id ??
										''
								) ||
								'Research Author',
							date:
								paper.created_at,
							thumbnail:
								paper.featured_image ||
								DEFAULT_THUMBNAIL,
							type: 'research' as const,
							href:
								`/content/research/${paper.id}`,
							views: Number(
								paper.views_count ?? 0
							),
							likes: Number(
								paper.likes_count ?? 0
							),
							saves: Number(
								paper.saves_count ?? 0
							),
							savedAt:
								row.created_at
						};
					}

					return null;
				})
				.filter(
					(
						item
					): item is DashboardContent =>
						item !== null
				);
	}

	console.log(
		'Saved content:',
		savedArticles.length
	);

	/* =====================================================
	   LIKED CONTENT

	   Same article_likes table is resolved against:
	   - articles
	   - research_articles
	===================================================== */

	const {
		data: likedRows,
		error: likedRowsError
	} = await supabaseAdmin
		.from('article_likes')
		.select(
			'id, article_id, created_at'
		)
		.eq(
			'user_id',
			userId
		)
		.order(
			'created_at',
			{
				ascending: false
			}
		);

	if (likedRowsError) {
		console.error(
			'Liked rows error:',
			likedRowsError
		);
	}

	const likedRowsList =
		likedRows ?? [];

	const likedIds = likedRowsList
		.map(
			(row) => row.article_id
		)
		.filter(Boolean);

	let reactedArticles: DashboardContent[] =
		[];

	if (likedIds.length > 0) {
		/* -----------------------------------------------
		   LIKED ARTICLES
		------------------------------------------------ */

		const {
			data: articles,
			error: likedArticleError
		} = await supabaseAdmin
			.from('articles')
			.select(`
				id,
				title,
				category,
				author_id,
				created_at,
				cover_image_url,
				views,
				likes_count,
				saves_count
			`)
			.in(
				'id',
				likedIds
			);

		if (likedArticleError) {
			console.error(
				'Liked article lookup error:',
				likedArticleError
			);
		}

		const articleMap =
			new Map(
				(articles ?? []).map(
					(article) => [
						article.id,
						article
					]
				)
			);

		/* -----------------------------------------------
		   LIKED RESEARCH
		------------------------------------------------ */

		const {
			data: research,
			error: likedResearchError
		} = await cmsSupabase
			.from('research_articles')
			.select(`
				id,
				title,
				user_id,
				created_at,
				featured_image,
				views_count,
				likes_count,
				saves_count
			`)
			.in(
				'id',
				likedIds
			);

		if (likedResearchError) {
			console.error(
				'Liked research lookup error:',
				likedResearchError
			);
		}

		const researchMap =
			new Map(
				(research ?? []).map(
					(item) => [
						item.id,
						item
					]
				)
			);

		/* -----------------------------------------------
		   COMBINE
		------------------------------------------------ */

		reactedArticles =
			likedRowsList
				.map((row) => {
					const article =
						articleMap.get(
							row.article_id
						);

					if (article) {
						return {
							id: article.id,
							title: article.title,
							category:
								article.category ||
								'General Health',
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
							type: 'article' as const,
							href:
								`/content/article/${article.id}`,
							views: Number(
								article.views ?? 0
							),
							likes: Number(
								article.likes_count ?? 0
							),
							saves: Number(
								article.saves_count ?? 0
							),
							likedAt:
								row.created_at
						};
					}

					const paper =
						researchMap.get(
							row.article_id
						);

					if (paper) {
						return {
							id: paper.id,
							title: paper.title,
							category: 'Research',
							authorName:
								authorsById.get(
									paper.user_id ??
										''
								) ||
								'Research Author',
							date:
								paper.created_at,
							thumbnail:
								paper.featured_image ||
								DEFAULT_THUMBNAIL,
							type: 'research' as const,
							href:
								`/content/research/${paper.id}`,
							views: Number(
								paper.views_count ?? 0
							),
							likes: Number(
								paper.likes_count ?? 0
							),
							saves: Number(
								paper.saves_count ?? 0
							),
							likedAt:
								row.created_at
						};
					}

					return null;
				})
				.filter(
					(
						item
					): item is DashboardContent =>
						item !== null
				);
	}

	console.log(
		'Liked content:',
		reactedArticles.length
	);

	/* =====================================================
	   INTERESTS
	===================================================== */

	const interests =
		normalizeInterests(
			profile.interests ?? []
		);

	console.log(
		'Normalized interests:',
		interests
	);

	/* =====================================================
	   RECOMMENDED CONTENT
	===================================================== */

	const combinedContent: DashboardContent[] =
		[
			...publishedArticles.map(
				(article) => ({
					id: article.id,
					title: article.title,
					category:
						article.category ||
						'General Health',
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
					type: 'article' as const,
					href:
						`/content/article/${article.id}`,
					views: Number(
						article.views ?? 0
					),
					likes: Number(
						article.likes_count ?? 0
					),
					saves: Number(
						article.saves_count ?? 0
					)
				})
			),

			...publishedResearch.map(
				(research) => ({
					id: research.id,
					title: research.title,
					category: 'Research',
					authorName:
						authorsById.get(
							research.user_id ??
								''
						) ||
						'Research Author',
					date:
						research.created_at,
					thumbnail:
						research.featured_image ||
						DEFAULT_THUMBNAIL,
					type: 'research' as const,
					href:
						`/content/research/${research.id}`,
					views: Number(
						research.views_count ?? 0
					),
					likes: Number(
						research.likes_count ?? 0
					),
					saves: Number(
						research.saves_count ?? 0
					)
				})
			)
		];

	let recommendedArticles =
		[...combinedContent];

	if (interests.length > 0) {
		recommendedArticles =
			combinedContent
				.map((item) => {
					let score = 0;

					const title =
						normalize(
							item.title
						);

					const category =
						normalize(
							item.category
						);

					for (
						const interest of interests
					) {
						const keywords =
							getInterestKeywords(
								interest
							);

						if (
							title.includes(
								interest
							)
						) {
							score += 50;
						}

						if (
							category.includes(
								interest
							)
						) {
							score += 40;
						}

						for (
							const keyword of keywords
						) {
							if (
								title.includes(
									keyword
								)
							) {
								score += 20;
							}

							if (
								category.includes(
									keyword
								)
							) {
								score += 15;
							}
						}
					}

					score += Math.min(
						item.views / 100,
						15
					);

					score += Math.min(
						item.likes * 2,
						10
					);

					score += Math.min(
						item.saves * 2,
						10
					);

					return {
						...item,
						score
					};
				})
				.sort(
					(a, b) =>
						(b.score ?? 0) -
						(a.score ?? 0)
				)
				.slice(0, 8);
	} else {
		recommendedArticles =
			combinedContent
				.sort(
					(a, b) =>
						b.views -
						a.views
				)
				.slice(0, 8);
	}

	console.log(
		'Final recommendations:',
		recommendedArticles.length
	);

	/* =====================================================
	   POPULAR CONTENT

	   ARTICLES + RESEARCH
	===================================================== */

	const popularArticles =
		[...combinedContent]
			.sort((a, b) => {
				const aScore =
					a.views +
					a.likes * 5 +
					a.saves * 5;

				const bScore =
					b.views +
					b.likes * 5 +
					b.saves * 5;

				return (
					bScore - aScore
				);
			})
			.slice(0, 6);

	/* =======================================================
   FOLLOWED DOCTORS
   ======================================================= */

let followedDoctors: FollowedDoctor[] = [];
let followedDoctorIds: string[] = [];

/*
 * We check both follow tables because the application
 * currently has:
 *
 * 1. doctor_followers
 * 2. doctor_follows
 *
 * We use select('*') so this code does not depend on
 * columns that may not exist in one of the tables.
 */

const [doctorFollowersResult, doctorFollowsResult] =
	await Promise.all([
		supabaseAdmin
			.from('doctor_followers')
			.select('*'),

		supabaseAdmin
			.from('doctor_follows')
			.select('*')
	]);

/* -------------------------------------------------------
   HELPER: convert a possible value to string
------------------------------------------------------- */

function validId(value: unknown): string | null {
	if (
		typeof value !== 'string' ||
		!value.trim()
	) {
		return null;
	}

	return value.trim();
}

/* -------------------------------------------------------
   POSSIBLE COLUMN NAMES
------------------------------------------------------- */

const followerKeys = [
	'follower_id',
	'user_id',
	'reader_id',
	'patient_id'
];

const doctorKeys = [
	'doctor_id',
	'followed_doctor_id',
	'following_id',
	'doctor_user_id'
];

/* -------------------------------------------------------
   EXTRACT DOCTOR IDS FROM A ROW
------------------------------------------------------- */

function extractDoctorId(
	row: Record<string, any>,
	currentUserId: string
): string | null {

	let followerId: string | null = null;

	for (const key of followerKeys) {
		const value = validId(row[key]);

		if (value) {
			followerId = value;
			break;
		}
	}

	/*
	 * If a follower/user column exists, make sure
	 * this row belongs to the logged-in reader.
	 *
	 * If no follower column exists, we skip the row
	 * because we cannot safely determine ownership.
	 */

	if (
		followerId &&
		followerId !== currentUserId
	) {
		return null;
	}

	let doctorId: string | null = null;

	for (const key of doctorKeys) {
		const value = validId(row[key]);

		if (value) {
			doctorId = value;
			break;
		}
	}

	if (
		!doctorId ||
		doctorId === currentUserId
	) {
		return null;
	}

	return doctorId;
}

/* -------------------------------------------------------
   PROCESS doctor_followers
------------------------------------------------------- */

if (doctorFollowersResult.error) {
	console.error(
		'doctor_followers query error:',
		doctorFollowersResult.error
	);
} else {

	for (
		const row of
		doctorFollowersResult.data ?? []
	) {

		const doctorId =
			extractDoctorId(
				row,
				userId
			);

		if (doctorId) {
			followedDoctorIds.push(
				doctorId
			);
		}
	}
}

/* -------------------------------------------------------
   PROCESS doctor_follows
------------------------------------------------------- */

if (doctorFollowsResult.error) {
	console.error(
		'doctor_follows query error:',
		doctorFollowsResult.error
	);
} else {

	for (
		const row of
		doctorFollowsResult.data ?? []
	) {

		const doctorId =
			extractDoctorId(
				row,
				userId
			);

		if (doctorId) {
			followedDoctorIds.push(
				doctorId
			);
		}
	}
}

/* -------------------------------------------------------
   REMOVE DUPLICATES
------------------------------------------------------- */

followedDoctorIds = [
	...new Set(
		followedDoctorIds.filter(Boolean)
	)
];

console.log(
	'========================================'
);

console.log(
	'READER USER ID:',
	userId
);

console.log(
	'FOLLOWED DOCTOR IDS:',
	followedDoctorIds
);

console.log(
	'========================================'
);

/* -------------------------------------------------------
   LOAD DOCTOR PROFILES
------------------------------------------------------- */

if (
	followedDoctorIds.length > 0
) {

	/*
	 * IMPORTANT:
	 *
	 * Only select columns that are actually required.
	 *
	 * Do NOT select profile_image / avatar_url here
	 * because if either column does not exist,
	 * the entire Supabase query fails.
	 */

	const {
		data: doctors,
		error: doctorsError
	} = await supabaseAdmin
		.from('profiles')
		.select(`
			id,
			full_name,
			specialization,
			organization
		`)
		.in(
			'id',
			followedDoctorIds
		);

	if (doctorsError) {

		console.error(
			'FOLLOWED DOCTORS PROFILE QUERY ERROR:',
			doctorsError
		);

	} else {

		console.log(
			'FOLLOWED DOCTORS PROFILES:',
			doctors
		);

		followedDoctors =
			(doctors ?? []).map(
				(doctor) => ({
					id: doctor.id,

					name:
						doctor.full_name ||
						'Unknown Doctor',

					specialization:
						doctor.specialization ??
						null,

					organization:
						doctor.organization ??
						null,

					avatar: null
				})
			);
	}
}

console.log(
	'FINAL FOLLOWED DOCTORS:',
	followedDoctors
);
	/* =====================================================
	   RETURN

	   IMPORTANT:
	   savedArticles = COMBINED articles + research

	   reactedArticles = COMBINED articles + research

	   Therefore your EXISTING Svelte page does not need
	   separate research props.
	===================================================== */

	return {
		profile,

		/* Saved */
		savedArticles,

		/* Liked */
		reactedArticles,

		/* Recommendations */
		recommendedArticles,

		/* Popular */
		popularArticles,

		/* Doctors */
		followedDoctors,

		/* Counts */
		savedCount:
			savedArticles.length,

		interestsCount:
			interests.length
	};
};