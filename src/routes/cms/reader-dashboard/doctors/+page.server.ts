import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// Fetch current user's profile
	const { data: profile } = await supabaseAdmin
		.from('profiles')
		.select('id, role')
		.eq('id', session.user.id)
		.maybeSingle();

	// Fetch all approved doctors
	const { data: doctors, error } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('role', 'Doctor')
		.order('full_name');

	if (error) {
		console.error('Error fetching doctors:', error);
	}

	let followedDoctorIds: string[] = [];

	// Fetch followed doctors for the logged-in user
	const { data: followedRows } = await supabaseAdmin
		.from('doctor_followers')
		.select('doctor_id')
		.eq('follower_id', session.user.id);

	if (followedRows) {
		followedDoctorIds = followedRows.map((r) => r.doctor_id);
	}

	return {
		doctors: doctors ?? [],
		followedDoctorIds,
		profile
	};
};

export const actions: Actions = {
	follow: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) {
			throw redirect(303, '/cms/login');
		}

		const formData = await request.formData();
		const doctor_id = formData.get('doctor_id');

		if (!doctor_id || typeof doctor_id !== 'string') {
			return fail(400, { error: 'Invalid doctor ID' });
		}

		if (doctor_id === session.user.id) {
			return fail(400, { error: 'You cannot follow yourself' });
		}

		const { error } = await supabaseAdmin.from('doctor_followers').insert({
			follower_id: session.user.id,
			doctor_id
		});

		if (error) {
			if (error.code === '23505') {
				// Already following, treat as success
				return { success: true };
			}
			console.error('Follow error:', error);
			return fail(500, { error: 'Failed to follow doctor' });
		}

		return { success: true };
	},
	unfollow: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) {
			throw redirect(303, '/cms/login');
		}

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
