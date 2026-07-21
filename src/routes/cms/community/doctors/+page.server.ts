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

	const { data: doctors, error } = await locals.supabase
	.from('profiles')
	.select('*')
	.eq('role', 'Doctor')
	.order('full_name');

	if (error) {
		console.error(error);
	}

	const { data: followedRows } = await supabaseAdmin
		.from('doctor_followers')
		.select('doctor_id')
		.eq('follower_id', session.user.id);

	const followedDoctorIds = (followedRows ?? []).map((r) => r.doctor_id);

	return {
		profile,
		doctors: doctors ?? [],
		followedDoctorIds
	};
};

export const actions: Actions = {
	follow: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const doctor_id = formData.get('doctor_id');

		if (!doctor_id || typeof doctor_id !== 'string') {
			return fail(400, { error: 'Invalid doctor ID' });
		}

		// Prevent self-following
		if (doctor_id === session.user.id) {
			return fail(400, { error: 'You cannot follow yourself' });
		}

		const { error } = await supabaseAdmin.from('doctor_followers').insert({
			follower_id: session.user.id,
			doctor_id
		});

		if (error) {
			console.error('Follow error:', error);
			return fail(500, { error: 'Failed to follow doctor' });
		}

		return { success: true };
	},
	unfollow: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const doctor_id = formData.get('doctor_id');

		if (!doctor_id || typeof doctor_id !== 'string') {
			return fail(400, { error: 'Invalid doctor ID' });
		}

		const { error } = await supabaseAdmin
			.from('doctor_followers')
			.delete()
			.match({ follower_id: session.user.id, doctor_id });

		if (error) {
			console.error('Unfollow error:', error);
			return fail(500, { error: 'Failed to unfollow doctor' });
		}

		return { success: true };
	}
};