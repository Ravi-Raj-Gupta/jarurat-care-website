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

	// Readers should never reach this page
	if (profile.role !== 'Doctor') {
		throw redirect(303, '/cms/login');
	}

	// Only approved doctors get in — others go to the pending page
	if (profile.verification_status !== 'approved') {
		throw redirect(303, '/cms/pending');
	}

	// Fetch all of this doctor's articles (small dataset per doctor, fine to pull in one go)
	const { data: articles, error: articlesError } = await supabaseAdmin
		.from('articles')
		.select('id, title, status, views, created_at')
		.eq('author_id', session.user.id)
		.order('created_at', { ascending: false });

	if (articlesError) {
		console.error('Error loading articles:', articlesError);
	}

	const allArticles = articles ?? [];

	const stats = {
		published: allArticles.filter((a) => a.status === 'published').length,
		draft: allArticles.filter((a) => a.status === 'draft').length,
		pendingReview: allArticles.filter((a) => a.status === 'under_review').length,
		views: allArticles.reduce((sum, a) => sum + (a.views ?? 0), 0),
		bookmarks: 0
	};

	// Bookmarks = how many times other users saved this doctor's articles
	const articleIds = allArticles.map((a) => a.id);
	if (articleIds.length > 0) {
		const { count: bookmarkCount, error: bookmarkError } = await supabaseAdmin
			.from('saved_articles')
			.select('id', { count: 'exact', head: true })
			.in('article_id', articleIds);

		if (bookmarkError) {
			console.error('Error loading bookmark count:', bookmarkError);
		} else {
			stats.bookmarks = bookmarkCount ?? 0;
		}
	}

	const recentArticles = allArticles.slice(0, 5);

	const { data: notifications, error: notificationsError } = await supabaseAdmin
		.from('notifications')
		.select('id, title, message, link, is_read, created_at')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })
		.limit(5);

	if (notificationsError) {
		console.error('Error loading notifications:', notificationsError);
	}

	const { count: unreadCount } = await supabaseAdmin
		.from('notifications')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', session.user.id)
		.eq('is_read', false);

	return {
		profile,
		stats,
		recentArticles,
		notifications: notifications ?? [],
		unreadCount: unreadCount ?? 0
	};
};