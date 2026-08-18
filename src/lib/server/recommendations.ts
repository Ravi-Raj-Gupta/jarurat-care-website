import { supabaseAdmin } from '$lib/supabaseAdmin';

export type RecommendedContent = {
	id: string;
	title: string;
	excerpt: string | null;
	image: string | null;
	category: string | null;
	tags: string[];
	contentType: string;
	score: number;
	reason: string;
};

type Profile = {
	interests: string[] | null;
};

type ContentItem = {
	id: string;
	title: string;
	excerpt?: string | null;
	content?: string | null;
	category?: string | null;
	tags?: string[] | null;
	cover_image_url?: string | null;
	featured_image?: string | null;
	featured_image_url?: string | null;
	views?: number | null;
	views_count?: number | null;
	likes_count?: number | null;
	saves_count?: number | null;
	created_at?: string | null;
	published_at?: string | null;
};

const MAX_RESULTS = 12;

/**
 * Normalizes text so that matching is case-insensitive
 * and punctuation does not affect matching.
 */
function normalize(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[_-]/g, ' ')
		.replace(/[^\w\s]/g, ' ')
		.replace(/\s+/g, ' ');
}

/**
 * Converts a value into an array of strings.
 */
function normalizeArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];

	return value
		.filter((item): item is string => typeof item === 'string')
		.map(normalize)
		.filter(Boolean);
}

/**
 * Checks whether an interest matches a content field.
 *
 * We support:
 * "Breast Cancer" ↔ "breast cancer"
 * "cancer" ↔ "cancer immunotherapy"
 * "immunotherapy" ↔ "Cancer Immunotherapy"
 */
function matchesInterest(
	interest: string,
	category: string | null,
	tags: string[]
): boolean {
	const normalizedInterest = normalize(interest);

	if (!normalizedInterest) return false;

	const categoryText = category ? normalize(category) : '';

	// Exact category match
	if (categoryText === normalizedInterest) {
		return true;
	}

	// Category contains interest
	if (
		categoryText.includes(normalizedInterest) ||
		normalizedInterest.includes(categoryText)
	) {
		return true;
	}

	// Check tags
	for (const tag of tags) {
		if (
			tag === normalizedInterest ||
			tag.includes(normalizedInterest) ||
			normalizedInterest.includes(tag)
		) {
			return true;
		}
	}

	return false;
}

/**
 * Calculate how relevant a piece of content is
 * to the user's selected interests.
 */
function calculateInterestScore(
	interests: string[],
	category: string | null,
	tags: string[]
): number {
	if (interests.length === 0) return 0;

	let score = 0;

	for (const interest of interests) {
		const normalizedInterest = normalize(interest);

		if (!normalizedInterest) continue;

		// Strongest signal: exact category
		if (category && normalize(category) === normalizedInterest) {
			score += 50;
			continue;
		}

		// Category contains interest
		if (
			category &&
			(normalize(category).includes(normalizedInterest) ||
				normalizedInterest.includes(normalize(category)))
		) {
			score += 35;
			continue;
		}

		// Tag matches
		for (const tag of tags) {
			if (tag === normalizedInterest) {
				score += 40;
			} else if (
				tag.includes(normalizedInterest) ||
				normalizedInterest.includes(tag)
			) {
				score += 25;
			}
		}
	}

	return score;
}

/**
 * Engagement score.
 *
 * This gives popular content a boost without allowing popularity
 * to completely override the user's interests.
 */
function calculateEngagementScore(item: ContentItem): number {
	const views = Math.max(0, item.views ?? item.views_count ?? 0);
	const likes = Math.max(0, item.likes_count ?? 0);
	const saves = Math.max(0, item.saves_count ?? 0);

	// Logarithmic scaling prevents extremely popular articles
	// from dominating everything.
	const viewScore = Math.log10(views + 1) * 5;
	const likeScore = Math.log10(likes + 1) * 10;
	const saveScore = Math.log10(saves + 1) * 15;

	return viewScore + likeScore + saveScore;
}

/**
 * Recency score.
 *
 * Newer content gets a small boost.
 */
function calculateRecencyScore(item: ContentItem): number {
	const dateString = item.published_at ?? item.created_at;

	if (!dateString) return 0;

	const date = new Date(dateString);

	if (Number.isNaN(date.getTime())) return 0;

	const ageInDays =
		(Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

	if (ageInDays <= 7) return 15;
	if (ageInDays <= 30) return 10;
	if (ageInDays <= 90) return 5;

	return 0;
}

/**
 * Get user's explicitly selected interests.
 */
async function getUserInterests(userId: string): Promise<string[]> {
	const { data, error } = await supabaseAdmin
		.from('profiles')
		.select('interests')
		.eq('id', userId)
		.maybeSingle<Profile>();

	if (error) {
		console.error('Error fetching user interests:', error);
		return [];
	}

	return normalizeArray(data?.interests);
}

/**
 * Fetch published articles.
 */
async function getArticles(): Promise<ContentItem[]> {
	const { data, error } = await supabaseAdmin
		.from('articles')
		.select(
			'id,title,excerpt,cover_image_url,category,tags,views,likes_count,saves_count,created_at'
		)
		.eq('status', 'published');

	if (error) {
		console.error('Error fetching articles:', error);
		return [];
	}

	return data ?? [];
}

/**
 * Fetch published CMS content.
 */
async function getCmsContent(): Promise<ContentItem[]> {
	const { data, error } = await supabaseAdmin
		.from('cms_content')
		.select(
			'id,title,excerpt,featured_image,category,tags,created_at,published_at'
		)
		.eq('status', 'published');

	if (error) {
		console.error('Error fetching CMS content:', error);
		return [];
	}

	return data ?? [];
}

/**
 * Fetch published research articles.
 *
 * research_articles does not currently have category/tags,
 * so keywords are used as the matching field.
 */
async function getResearchArticles(): Promise<
	(ContentItem & { keywords?: string | null })[]
> {
	const { data, error } = await supabaseAdmin
		.from('research_articles')
		.select(
			'id,title,abstract,keywords,featured_image,views_count,likes_count,saves_count,created_at'
		)
		.eq('status', 'published');

	if (error) {
		console.error('Error fetching research articles:', error);
		return [];
	}

	return (data ?? []).map((item) => ({
		...item,
		excerpt: item.abstract ?? null,
		category: null,
		tags: item.keywords
			? item.keywords
					.split(',')
					.map((keyword: string) => keyword.trim())
					.filter(Boolean)
			: []
	}));
}

/**
 * Generate personalized recommendations.
 */
export async function getRecommendations(userId: string) {
	const interests = await getUserInterests(userId);

	const [articles, cmsContent, researchArticles] = await Promise.all([
		getArticles(),
		getCmsContent(),
		getResearchArticles()
	]);

	const scored: RecommendedContent[] = [];

	/*
	 * ARTICLES
	 */
	for (const item of articles) {
		const tags = normalizeArray(item.tags);

		const interestScore = calculateInterestScore(
			interests,
			item.category ?? null,
			tags
		);

		const engagementScore = calculateEngagementScore(item);
		const recencyScore = calculateRecencyScore(item);

		const score =
			interestScore * 2 +
			engagementScore +
			recencyScore;

		let reason = 'Latest publication';

		if (interestScore > 0) {
			reason = 'Matches your interests';
		} else if (engagementScore >= 10) {
			reason = 'Popular with readers';
		}

		scored.push({
			id: item.id,
			title: item.title,
			excerpt: item.excerpt ?? null,
			image: item.cover_image_url ?? null,
			category: item.category ?? null,
			tags,
			contentType: 'article',
			score,
			reason
		});
	}

	/*
	 * CMS CONTENT
	 */
	for (const item of cmsContent) {
		const tags = normalizeArray(item.tags);

		const interestScore = calculateInterestScore(
			interests,
			item.category ?? null,
			tags
		);

		const engagementScore = calculateEngagementScore(item);
		const recencyScore = calculateRecencyScore(item);

		const score =
			interestScore * 2 +
			engagementScore +
			recencyScore;

		let reason = 'Latest publication';

		if (interestScore > 0) {
			reason = 'Matches your interests';
		} else if (engagementScore >= 10) {
			reason = 'Popular with readers';
		}

		scored.push({
			id: item.id,
			title: item.title,
			excerpt: item.excerpt ?? null,
			image: item.featured_image ?? null,
			category: item.category ?? null,
			tags,
			contentType: 'cms_content',
			score,
			reason
		});
	}

	/*
	 * RESEARCH ARTICLES
	 */
	for (const item of researchArticles) {
		const tags = normalizeArray(item.tags);

		const interestScore = calculateInterestScore(
			interests,
			null,
			tags
		);

		const engagementScore = calculateEngagementScore(item);
		const recencyScore = calculateRecencyScore(item);

		const score =
			interestScore * 2 +
			engagementScore +
			recencyScore;

		let reason = 'Latest research';

		if (interestScore > 0) {
			reason = 'Matches your interests';
		} else if (engagementScore >= 10) {
			reason = 'Popular research';
		}

		scored.push({
			id: item.id,
			title: item.title,
			excerpt: item.excerpt ?? null,
			image: item.featured_image ?? null,
			category: null,
			tags,
			contentType: 'research',
			score,
			reason
		});
	}

	/*
	 * Sort by recommendation score.
	 */
	scored.sort((a, b) => b.score - a.score);

	/*
	 * If the user has no interests yet, this naturally behaves
	 * like a discovery feed because engagement + recency are used.
	 */
	const recommendations = scored.slice(0, MAX_RESULTS);

	return {
		recommendations,
		interests,
		isPersonalized: interests.length > 0
	};
}