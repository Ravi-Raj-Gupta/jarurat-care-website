import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile, error: profileError } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (profileError || !profile) {
		throw redirect(303, '/cms/login');
	}

	// Security: Only Reviewer Doctors can access
	if (profile.role !== 'Doctor' || profile.is_reviewer !== true) {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	const { data: article, error: articleError } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('id', params.id)
		.single();

	if (articleError || !article) {
		throw redirect(303, '/cms/doctor-dashboard/review-articles');
	}

	// Fetch author name if possible
	let authorName = 'Unknown Author';
	if (article.author_id) {
		const { data: authorProfile } = await supabaseAdmin
			.from('profiles')
			.select('full_name')
			.eq('id', article.author_id)
			.single();
		if (authorProfile?.full_name) {
			authorName = authorProfile.full_name;
		}
	}

	return {
		profile,
		article: {
			...article,
			author_name: authorName
		}
	};
};

export const actions: Actions = {
	approveArticle: async ({ locals, params }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });

		const { data: userProfile } = await locals.supabase
			.from('profiles')
			.select('is_reviewer, role')
			.eq('id', session.user.id)
			.single();

		// Security: Verify action runner is actually a Reviewer Doctor
		if (!userProfile || userProfile.role !== 'Doctor' || userProfile.is_reviewer !== true) {
			return fail(403, { message: 'Forbidden' });
		}

		const { error } = await supabaseAdmin
			.from('articles')
			.update({
				status: 'published',
				admin_feedback: 'APPROVED_BY_REVIEWER'
			})
			.eq('id', params.id)
			.eq('status', 'under_review');

		if (error) {
			console.error('Approve article error:', error);
			return fail(500, { message: 'Could not approve article' });
		}

		throw redirect(303, '/cms/doctor-dashboard/review-articles');
	},

	rejectArticle: async ({ request, locals, params }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });

		const { data: userProfile } = await locals.supabase
			.from('profiles')
			.select('is_reviewer, role')
			.eq('id', session.user.id)
			.single();

		// Security: Verify action runner is actually a Reviewer Doctor
		if (!userProfile || userProfile.role !== 'Doctor' || userProfile.is_reviewer !== true) {
			return fail(403, { message: 'Forbidden' });
		}

		const formData = await request.formData();
		const feedback = formData.get('feedback') as string;

		if (!feedback?.trim()) {
			return fail(400, { message: 'Feedback is required' });
		}

		const { error } = await supabaseAdmin
			.from('articles')
			.update({
				status: 'changes_requested',
				admin_feedback: feedback.trim()
			})
			.eq('id', params.id)
			.eq('status', 'under_review');

		if (error) {
			console.error('Reject article error:', error);
			return fail(500, { message: 'Could not request changes' });
		}

		throw redirect(303, '/cms/doctor-dashboard/review-articles');
	}
};
