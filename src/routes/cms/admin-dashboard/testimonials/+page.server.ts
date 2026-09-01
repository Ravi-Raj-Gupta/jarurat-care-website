import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

/*
 * ============================================================
 * ADMIN ACCESS CHECK
 * ============================================================
 */
async function getAdminSession(locals: any) {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile, error } = await locals.supabase
		.from('profiles')
		.select('id, full_name, email, role')
		.eq('id', session.user.id)
		.maybeSingle();

	if (error) {
		console.error('Admin profile error:', error);
		throw redirect(303, '/');
	}

	if (
		!profile ||
		(profile.role !== 'Admin' && profile.role !== 'Super_Admin')
	) {
		throw redirect(303, '/');
	}

	return {
		session,
		profile
	};
}

/*
 * ============================================================
 * LOAD TESTIMONIALS
 * ============================================================
 */
export const load: PageServerLoad = async ({ locals }) => {
	const { session, profile } = await getAdminSession(locals);

	/*
	 * Get all testimonials.
	 *
	 * We intentionally fetch profiles separately instead of
	 * using a Supabase relational join. This avoids depending
	 * on a specific foreign-key relationship between
	 * testimonials and profiles.
	 */
	const { data: testimonials, error } = await supabaseAdmin
		.from('testimonials')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error loading testimonials:', error);

		return {
			testimonials: [],
			currentUser: {
				id: session.user.id,
				name:
					profile.full_name ||
					session.user.email?.split('@')[0] ||
					'Admin',
				email: profile.email || session.user.email || '',
				role: profile.role
			}
		};
	}

	const testimonialRows = testimonials ?? [];

	/*
	 * Collect user IDs from testimonials.
	 */
	const userIds = [
		...new Set(
			testimonialRows
				.map((testimonial: any) => testimonial.user_id)
				.filter(Boolean)
		)
	];

	/*
	 * Fetch profiles for testimonial authors.
	 */
	let profiles: any[] = [];

	if (userIds.length > 0) {
		const { data: profileRows, error: profileError } = await supabaseAdmin
			.from('profiles')
			.select('id, full_name, email, role, designation')
			.in('id', userIds);

		if (profileError) {
			console.error(
				'Error loading testimonial author profiles:',
				profileError
			);
		} else {
			profiles = profileRows ?? [];
		}
	}

	/*
	 * Create quick lookup map.
	 */
	const profileMap = new Map(
		profiles.map((profile: any) => [profile.id, profile])
	);

	/*
	 * Attach author information to each testimonial.
	 */
	const enrichedTestimonials = testimonialRows.map((testimonial: any) => {
		const author = profileMap.get(testimonial.user_id);

		return {
			...testimonial,

			author_name:
				testimonial.name ||
				author?.full_name ||
				'Anonymous User',

			author_email:
				author?.email || '',

			author_role:
				author?.role || 'Reader',

			author_designation:
				testimonial.designation ||
				author?.designation ||
				''
		};
	});

	return {
		testimonials: enrichedTestimonials,

		currentUser: {
			id: session.user.id,
			name:
				profile.full_name ||
				session.user.email?.split('@')[0] ||
				'Admin',
			email: profile.email || session.user.email || '',
			role: profile.role
		}
	};
};

/*
 * ============================================================
 * ADMIN ACTIONS
 * ============================================================
 */
export const actions: Actions = {
	/*
	 * ========================================================
	 * PUBLISH TESTIMONIAL
	 * ========================================================
	 *
	 * submitted -> published
	 *
	 * This is the main approval/publishing action.
	 */
	publish: async ({ request, locals }) => {
		await getAdminSession(locals);

		const formData = await request.formData();
		const testimonialId = formData.get('testimonialId');

		if (!testimonialId || typeof testimonialId !== 'string') {
			return fail(400, {
				error: 'Invalid testimonial ID.'
			});
		}

		/*
		 * Make sure the testimonial exists before publishing.
		 */
		const { data: testimonial, error: findError } = await supabaseAdmin
			.from('testimonials')
			.select('id, status')
			.eq('id', testimonialId)
			.maybeSingle();

		if (findError) {
			console.error('Find testimonial error:', findError);

			return fail(500, {
				error: 'Could not find testimonial.'
			});
		}

		if (!testimonial) {
			return fail(404, {
				error: 'Testimonial not found.'
			});
		}

		/*
		 * Don't allow publishing a rejected testimonial.
		 */
		if (testimonial.status === 'rejected') {
			return fail(400, {
				error: 'A rejected testimonial cannot be published.'
			});
		}

		const { error: updateError } = await supabaseAdmin
			.from('testimonials')
			.update({
				status: 'published',
				updated_at: new Date().toISOString()
			})
			.eq('id', testimonialId);

		if (updateError) {
			console.error('Publish testimonial error:', updateError);

			return fail(500, {
				error: 'Failed to publish testimonial.'
			});
		}

		return {
			success: true,
			action: 'published'
		};
	},

	/*
	 * ========================================================
	 * REJECT TESTIMONIAL
	 * ========================================================
	 *
	 * Any existing testimonial status can be moved to rejected
	 * by an authorized Admin.
	 */
	reject: async ({ request, locals }) => {
		await getAdminSession(locals);

		const formData = await request.formData();

		const testimonialId = formData.get('testimonialId');
		const feedback = formData.get('feedback');

		if (!testimonialId || typeof testimonialId !== 'string') {
			return fail(400, {
				error: 'Invalid testimonial ID.'
			});
		}

		const adminFeedback =
			typeof feedback === 'string' ? feedback.trim() : '';

		if (!adminFeedback) {
			return fail(400, {
				error: 'Please provide a reason for rejecting the testimonial.'
			});
		}

		const { error } = await supabaseAdmin
			.from('testimonials')
			.update({
				status: 'rejected',
				admin_feedback: adminFeedback,
				updated_at: new Date().toISOString()
			})
			.eq('id', testimonialId);

		if (error) {
			console.error('Reject testimonial error:', error);

			return fail(500, {
				error: 'Failed to reject testimonial.'
			});
		}

		return {
			success: true,
			action: 'rejected'
		};
	},

	/*
	 * ========================================================
	 * REQUEST CHANGES
	 * ========================================================
	 *
	 * submitted -> changes_requested
	 *
	 * Reader will be able to see admin_feedback on their
	 * existing testimonial page.
	 */
	requestChanges: async ({ request, locals }) => {
		await getAdminSession(locals);

		const formData = await request.formData();

		const testimonialId = formData.get('testimonialId');
		const feedback = formData.get('feedback');

		if (!testimonialId || typeof testimonialId !== 'string') {
			return fail(400, {
				error: 'Invalid testimonial ID.'
			});
		}

		const adminFeedback =
			typeof feedback === 'string' ? feedback.trim() : '';

		if (!adminFeedback) {
			return fail(400, {
				error: 'Please provide feedback explaining what needs to be changed.'
			});
		}

		const { error } = await supabaseAdmin
			.from('testimonials')
			.update({
				status: 'changes_requested',
				admin_feedback: adminFeedback,
				updated_at: new Date().toISOString()
			})
			.eq('id', testimonialId);

		if (error) {
			console.error(
				'Request testimonial changes error:',
				error
			);

			return fail(500, {
				error: 'Failed to request changes.'
			});
		}

		return {
			success: true,
			action: 'changes_requested'
		};
	}
};