import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile, error: profileError } = await supabaseAdmin
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

	// Doctors don't belong here
	if (profile.role === 'Doctor') {
		throw redirect(303, '/cms/doctor-dashboard');
	}
	if (profile.role !== 'Reader') {
		throw redirect(303, '/cms/login');
	}

	// Saved articles for this reader
	const { data: savedRows, error: savedError } = await supabaseAdmin
		.from('saved_articles')
		.select('id, article_id, created_at')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (savedError) {
		console.error('Error loading saved articles:', savedError);
	}

	const savedRowsList = savedRows ?? [];
	const articleIds = savedRowsList.map((r) => r.article_id);

	let savedArticles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		savedAt: string;
	}> = [];

	if (articleIds.length > 0) {
		const { data: articles, error: articlesError } = await supabaseAdmin
			.from('articles')
			.select('id, title, category, author_id')
			.in('id', articleIds);

		if (articlesError) {
			console.error('Error loading articles:', articlesError);
		}

		let authorsById = new Map<string, string>();

		const articlesList = articles ?? [];
		const authorIds = [...new Set(articlesList.map((a) => a.author_id))];

		if (authorIds.length > 0) {
			const { data: authors, error: authorsError } = await supabaseAdmin
				.from('profiles')
				.select('id, full_name')
				.in('id', authorIds);

			if (authorsError) {
				console.error('Error loading article authors:', authorsError);
			}
			authorsById = new Map((authors ?? []).map((a) => [a.id, a.full_name]));
		}

		const articlesById = new Map(articlesList.map((a) => [a.id, a]));

		savedArticles = savedRowsList
			.map((row) => {
				const article = articlesById.get(row.article_id);
				if (!article) return null;
				return {
					id: article.id,
					title: article.title,
					category: article.category,
					authorName: authorsById.get(article.author_id) || 'Unknown',
					savedAt: row.created_at
				};
			})
			.filter((a): a is NonNullable<typeof a> => a !== null);
	}

	let recommendedArticles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		date: string;
		thumbnail: string;
	}> = [];

	const interests = profile.interests ?? [];
	if (interests.length > 0) {
		// Fetch recent published articles to filter by interests
		const { data: recArticles, error: recError } = await supabaseAdmin
			.from('articles')
			.select('id, title, category, author_id, created_at, image, tags')
			.eq('status', 'published')
			.order('created_at', { ascending: false })
			.limit(50);

		if (!recError && recArticles) {
			const filtered = recArticles
				.filter((a) => {
					const matchCat = a.category && interests.includes(a.category);
					const matchTags = Array.isArray(a.tags) && a.tags.some((t: string) => interests.includes(t));
					return matchCat || matchTags;
				})
				.slice(0, 4);

			// fetch authors if not already in map
			const recAuthorIds = [...new Set(filtered.map((a) => a.author_id))];
			const newAuthorsToFetch = recAuthorIds.filter((id) => !authorsById.has(id));

			if (newAuthorsToFetch.length > 0) {
				const { data: moreAuthors } = await supabaseAdmin
					.from('profiles')
					.select('id, full_name')
					.in('id', newAuthorsToFetch);

				if (moreAuthors) {
					moreAuthors.forEach((a) => authorsById.set(a.id, a.full_name));
				}
			}

			recommendedArticles = filtered.map((a) => ({
				id: String(a.id),
				title: a.title,
				category: a.category,
				authorName: authorsById.get(a.author_id) || 'Unknown',
				date: a.created_at,
				thumbnail: a.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'
			}));
		}
	}

	// Liked articles for this reader
	const { data: likedRows, error: likedError } = await supabaseAdmin
		.from('article_likes')
		.select('id, article_id, created_at')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (likedError) {
		console.error('Error loading liked articles:', likedError);
	}

	const likedRowsList = likedRows ?? [];
	const likedArticleIds = likedRowsList.map((r) => r.article_id);

	let reactedArticles: Array<{
		id: string;
		title: string;
		category: string | null;
		authorName: string;
		likedAt: string;
	}> = [];

	if (likedArticleIds.length > 0) {
		const { data: lArticles, error: lArticlesError } = await supabaseAdmin
			.from('articles')
			.select('id, title, category, author_id')
			.in('id', likedArticleIds);

		if (lArticlesError) {
			console.error('Error loading liked articles details:', lArticlesError);
		}

		const lArticlesList = lArticles ?? [];
		const lAuthorIds = [...new Set(lArticlesList.map((a) => a.author_id))];
		const newAuthorsToFetch = lAuthorIds.filter((id) => !authorsById.has(id));

		if (newAuthorsToFetch.length > 0) {
			const { data: moreAuthors } = await supabaseAdmin
				.from('profiles')
				.select('id, full_name')
				.in('id', newAuthorsToFetch);

			if (moreAuthors) {
				moreAuthors.forEach((a) => authorsById.set(a.id, a.full_name));
			}
		}

		const lArticlesById = new Map(lArticlesList.map((a) => [a.id, a]));

		reactedArticles = likedRowsList
			.map((row) => {
				const article = lArticlesById.get(row.article_id);
				if (!article) return null;
				return {
					id: article.id,
					title: article.title,
					category: article.category,
					authorName: authorsById.get(article.author_id) || 'Unknown',
					likedAt: row.created_at
				};
			})
			.filter((a): a is NonNullable<typeof a> => a !== null);
	}

	let followedDoctors: Array<{
		id: string;
		name: string;
		specialization: string | null;
		organization: string | null;
		avatar: string | null;
	}> = [];

	const { data: followedRows, error: followedError } = await supabaseAdmin
		.from('doctor_followers')
		.select('doctor_id')
		.eq('follower_id', session.user.id);

	if (followedError) {
		console.error('Error loading followed doctors:', followedError);
	}

	const followedRowsList = followedRows ?? [];
	const followedDoctorIds = followedRowsList.map((r) => r.doctor_id);

	if (followedDoctorIds.length > 0) {
		const { data: doctorsData, error: doctorsError } = await supabaseAdmin
			.from('profiles')
			.select('id, full_name, specialization, organization')
			.in('id', followedDoctorIds);

		if (doctorsError) {
			console.error('Error loading doctors details:', doctorsError);
		}

		if (doctorsData) {
			followedDoctors = doctorsData.map(doc => ({
				id: doc.id,
				name: doc.full_name || 'Unknown Doctor',
				specialization: doc.specialization,
				organization: doc.organization,
				avatar: null // Default avatar logic handled in component
			}));
		}
	}

	return {
		profile,
		savedArticles,
		recommendedArticles,
		reactedArticles,
		followedDoctors,
		savedCount: savedRowsList.length,
		interestsCount: interests.length
	};
};