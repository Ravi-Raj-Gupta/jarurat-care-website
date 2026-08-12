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
	const { data: pendingArticles, error: articlesError } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('status', 'under_review')
		.order('created_at', { ascending: false });

	if (articlesError) {
		console.error('Error loading pending articles:', articlesError);
	}

	return {
		profile,
		pendingArticles: pendingArticles ?? []
	};
};

export const actions: Actions = {
	approveArticle: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { data: userProfile } = await locals.supabase
			.from('profiles')
			.select('is_reviewer, role')
			.eq('id', session.user.id)
			.single();

		if (
			!userProfile ||
			userProfile.role !== 'Doctor' ||
			userProfile.is_reviewer !== true
		) {
			return fail(403, {
				message: 'Forbidden: Reviewer access required'
			});
		}

		const formData = await request.formData();
		const articleId = formData.get('articleId') as string;

		if (!articleId) {
			return fail(400, {
				message: 'Missing article ID'
			});
		}

		// Approve → publish
		const { error } = await supabaseAdmin
			.from('articles')
			.update({
				status: 'published',
				review_feedback: 'APPROVED_BY_REVIEWER'
			})
			.eq('id', articleId)
			.eq('status', 'under_review');

		if (error) {
			console.error('Approve article error:', error);

			return fail(500, {
				message: 'Could not approve article'
			});
		}

		return {
			success: true,
			action: 'approved'
		};
	},

	rejectArticle: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const { data: userProfile } = await locals.supabase
			.from('profiles')
			.select('is_reviewer, role')
			.eq('id', session.user.id)
			.single();

		if (
			!userProfile ||
			userProfile.role !== 'Doctor' ||
			userProfile.is_reviewer !== true
		) {
			return fail(403, {
				message: 'Forbidden: Reviewer access required'
			});
		}

		const formData = await request.formData();

		const articleId = formData.get('articleId') as string;
		const feedback = formData.get('feedback') as string;

		if (!articleId || !feedback?.trim()) {
			return fail(400, {
				message: 'Article ID and review feedback are required'
			});
		}

		const { error } = await supabaseAdmin
			.from('articles')
			.update({
				status: 'changes_requested',
				review_feedback: feedback.trim()
			})
			.eq('id', articleId)
			.eq('status', 'under_review');

		if (error) {
			console.error('Reject article error:', error);

			return fail(500, {
				message: 'Could not request changes for article'
			});
		}

		return {
			success: true,
			action: 'changes_requested'
		};
	}
};