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

	// Fetch all of this doctor's research papers
	const { data: researchPapersData, error: researchError } = await supabaseAdmin
		.from('research_articles')
		.select('id, title, status, views_count, created_at')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (researchError) {
		console.error('Error loading research papers:', researchError);
	}

	const allResearchPapers = researchPapersData ?? [];

	const stats = {
		published: 
			allArticles.filter((a) => a.status === 'published').length +
			allResearchPapers.filter((r) => r.status === 'published').length,
		draft: 
			allArticles.filter((a) => a.status === 'draft').length +
			allResearchPapers.filter((r) => r.status === 'draft').length,
		pendingReview: 
			allArticles.filter((a) => a.status === 'under_review').length +
			allResearchPapers.filter((r) => r.status === 'under_review').length,
		views: 
			allArticles.reduce((sum, a) => sum + (a.views ?? 0), 0) +
			allResearchPapers.reduce((sum, r) => sum + (r.views_count ?? 0), 0),
		bookmarks: 0,
		likes: 0
	};

	// Bookmarks = how many times other users saved this doctor's articles or research papers
	const articleIds = allArticles.map((a) => a.id);
	const researchIds = allResearchPapers.map((r) => r.id);
	const allItemIds = [...articleIds, ...researchIds];

	if (allItemIds.length > 0) {
		const { count: bookmarkCount, error: bookmarkError } = await supabaseAdmin
			.from('saved_articles')
			.select('id', { count: 'exact', head: true })
			.in('article_id', allItemIds);

		if (bookmarkError) {
			console.error('Error loading bookmark count:', bookmarkError);
		} else {
			stats.bookmarks = bookmarkCount ?? 0;
		}

		// Likes = how many times other users liked this doctor's articles or research papers
		const { count: likeCount, error: likeError } = await supabaseAdmin
			.from('article_likes')
			.select('id', { count: 'exact', head: true })
			.in('article_id', allItemIds);

		if (likeError) {
			console.error('Error loading like count:', likeError);
		} else {
			stats.likes = likeCount ?? 0;
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
			followedDoctors = doctorsData.map((doc) => ({
				id: doc.id,
				name: doc.full_name || 'Unknown Doctor',
				specialization: doc.specialization,
				organization: doc.organization,
				avatar: null
			}));
		}
	}

	let pendingArticles: any[] = [];
	let pendingResearch: any[] = [];

	if (profile.is_reviewer) {
		const [{ data: pendingArtData, error: artErr }, { data: pendingResData, error: resErr }] = await Promise.all([
			supabaseAdmin
				.from('articles')
				.select('id, title, created_at, author_name_credentials')
				.eq('status', 'under_review'),
			supabaseAdmin
				.from('research_articles')
				.select('id, title, created_at, authors_and_affiliations')
				.eq('status', 'under_review')
		]);

		if (artErr) console.error('Error loading pending articles:', artErr);
		if (resErr) console.error('Error loading pending research:', resErr);

		pendingArticles = (pendingArtData ?? []).map(a => ({
			...a,
			author_name: a.author_name_credentials || 'Unknown Author'
		}));

		pendingResearch = (pendingResData ?? []).map(r => ({
			...r,
			author_name: r.authors_and_affiliations || 'Unknown Researcher'
		}));
	}

	return {
		profile,
		stats,
		articles: allArticles,
		researchPapers: allResearchPapers,
		pendingArticles,
		pendingResearch,
		notifications: notifications ?? [],
		unreadCount: unreadCount ?? 0,
		followedDoctors
	};
};