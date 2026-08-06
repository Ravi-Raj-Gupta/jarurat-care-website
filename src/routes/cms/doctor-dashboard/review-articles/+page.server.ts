import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (!profile || profile.role !== 'Doctor' || !profile.is_reviewer) {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	// Fetch pending regular articles using admin client to bypass RLS for reviewers
	const { data: pendingArticles } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('status', 'under_review')
		.neq('review_feedback', 'APPROVED_BY_REVIEWER')
		.order('created_at', { ascending: false });

	return {
		profile,
		pendingArticles: pendingArticles || []
	};
};

export const actions: Actions = {
	approveArticle: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('is_reviewer').eq('id', session.user.id).single();
		if (!userProfile || !userProfile.is_reviewer) return fail(403, { message: 'Forbidden: Reviewer access required' });

		const formData = await request.formData();
		const articleId = formData.get('articleId') as string;
		if (!articleId) return fail(400, { message: 'Missing parameters' });

		const { error } = await supabaseAdmin
			.from('articles')
			.update({ review_feedback: 'APPROVED_BY_REVIEWER' })
			.eq('id', articleId);

		if (error) {
			console.error("Approve error:", error);
			return fail(500, { message: 'Could not approve article' });
		}
		
		return { success: true };
	},

	rejectArticle: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('is_reviewer').eq('id', session.user.id).single();
		if (!userProfile || !userProfile.is_reviewer) return fail(403, { message: 'Forbidden: Reviewer access required' });

		const formData = await request.formData();
		const articleId = formData.get('articleId') as string;
		const feedback = formData.get('feedback') as string;

		if (!articleId || !feedback) return fail(400, { message: 'Missing parameters' });

		const { error } = await supabaseAdmin
			.from('articles')
			.update({ 
				status: 'changes_requested',
				review_feedback: feedback
			})
			.eq('id', articleId);

		if (error) {
			console.error("Reject error:", error);
			return fail(500, { message: 'Could not reject article' });
		}
		
		return { success: true };
	}
};
