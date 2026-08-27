import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// Get logged-in user's profile
	const { data: profile, error: profileError } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (profileError || !profile) {
		console.error('Profile error:', profileError);
		throw redirect(303, '/cms/login');
	}

	// Only reviewers can access this page
	if (profile.role !== 'Doctor' || profile.is_reviewer !== true) {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	// Fetch ALL articles currently waiting for reviewer action
	const { data: rawPendingArticles, error: articlesError } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('status', 'under_review')
		.order('created_at', { ascending: false });

	if (articlesError) {
		console.error('Error fetching pending articles:', articlesError);
	}

	// Filter out articles that have already been reviewed (approved or changes requested)
	// We check this via review_feedback because the DB constraint doesn't allow 'approved' or 'changes_requested' statuses
	const pendingArticles = (rawPendingArticles || []).filter(
		(a: any) => !a.review_feedback
	);

	const articlesList = pendingArticles ?? [];
	const authorIds = [...new Set(articlesList.map(a => a.author_id).filter(Boolean))];
	
	const authorMap = new Map<string, string>();
	if (authorIds.length > 0) {
		const { data: authors } = await supabaseAdmin
			.from('profiles')
			.select('id, full_name')
			.in('id', authorIds);
			
		if (authors) {
			authors.forEach(a => authorMap.set(a.id, a.full_name || ''));
		}
	}

	const enrichedArticles = articlesList.map(a => ({
		...a,
		author_name: a.author_name_credentials || authorMap.get(a.author_id) || 'Unknown Author'
	}));

	return {
		profile,
		pendingArticles: enrichedArticles
	};
};