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

		const articlesList = articles ?? [];
		const authorIds = [...new Set(articlesList.map((a) => a.author_id))];

		let authorsById = new Map<string, string>();
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

	return {
		profile,
		savedArticles,
		savedCount: savedRowsList.length,
		interestsCount: (profile.interests ?? []).length
	};
};