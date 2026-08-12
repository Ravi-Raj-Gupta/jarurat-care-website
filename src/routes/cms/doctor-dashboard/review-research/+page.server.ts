import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// Get the logged-in user's profile
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

	// Fetch all research papers waiting for review
	const {
		data: pendingResearch,
		error: researchError
	} = await supabaseAdmin
		.from('research_articles')
		.select('*')
		.eq('status', 'under_review')
		.order('created_at', { ascending: false });

	if (researchError) {
		console.error('Error loading pending research papers:', researchError);
	}

	return {
		profile,
		pendingResearch: pendingResearch ?? []
	};
};

export const actions: Actions = {
	approveResearch: async ({ request, locals }) => {
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
		const researchId = formData.get('researchId') as string;

		if (!researchId) {
			return fail(400, {
				message: 'Missing research paper ID'
			});
		}

		// Approve → publish
		const { error } = await supabaseAdmin
			.from('research_articles')
			.update({
				status: 'published',
				admin_feedback: 'APPROVED_BY_REVIEWER'
			})
			.eq('id', researchId)
			.eq('status', 'under_review');

		if (error) {
			console.error('Approve research error:', error);

			return fail(500, {
				message: 'Could not approve research paper'
			});
		}

		return {
			success: true,
			action: 'approved'
		};
	},

	rejectResearch: async ({ request, locals }) => {
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

		const researchId = formData.get('researchId') as string;
		const feedback = formData.get('feedback') as string;

		if (!researchId || !feedback?.trim()) {
			return fail(400, {
				message: 'Research paper ID and feedback are required'
			});
		}

		const { error } = await supabaseAdmin
			.from('research_articles')
			.update({
				status: 'changes_requested',
				admin_feedback: feedback.trim()
			})
			.eq('id', researchId)
			.eq('status', 'under_review');

		if (error) {
			console.error('Reject research error:', error);

			return fail(500, {
				message: 'Could not request changes for research paper'
			});
		}

		return {
			success: true,
			action: 'changes_requested'
		};
	}
};