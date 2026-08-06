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

	// Fetch pending research articles using admin client to bypass RLS for reviewers
	const { data: pendingResearch } = await supabaseAdmin
		.from('research_articles')
		.select('*')
		.eq('status', 'under_review')
		.neq('admin_feedback', 'APPROVED_BY_REVIEWER')
		.order('created_at', { ascending: false });

	return {
		profile,
		pendingResearch: pendingResearch || []
	};
};

export const actions: Actions = {
	approveResearch: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('is_reviewer').eq('id', session.user.id).single();
		if (!userProfile || !userProfile.is_reviewer) return fail(403, { message: 'Forbidden: Reviewer access required' });

		const formData = await request.formData();
		const researchId = formData.get('researchId') as string;
		if (!researchId) return fail(400, { message: 'Missing parameters' });

		const { error } = await supabaseAdmin
			.from('research_articles')
			.update({ admin_feedback: 'APPROVED_BY_REVIEWER' })
			.eq('id', researchId);

		if (error) {
			console.error("Approve research error:", error);
			return fail(500, { message: 'Could not approve research paper' });
		}
		
		return { success: true };
	},

	rejectResearch: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('is_reviewer').eq('id', session.user.id).single();
		if (!userProfile || !userProfile.is_reviewer) return fail(403, { message: 'Forbidden: Reviewer access required' });

		const formData = await request.formData();
		const researchId = formData.get('researchId') as string;
		const feedback = formData.get('feedback') as string;

		if (!researchId || !feedback) return fail(400, { message: 'Missing parameters' });

		const { error } = await supabaseAdmin
			.from('research_articles')
			.update({ 
				status: 'changes_requested',
				admin_feedback: feedback
			})
			.eq('id', researchId);

		if (error) {
			console.error("Reject research error:", error);
			return fail(500, { message: 'Could not reject research paper' });
		}
		
		return { success: true };
	}
};
