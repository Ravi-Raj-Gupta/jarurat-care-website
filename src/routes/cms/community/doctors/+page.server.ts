import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// Logged-in user
	const { data: profile, error: profileError } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.maybeSingle();

	if (profileError || !profile) {
		console.error('Community profile error:', profileError);
		throw redirect(303, '/cms/login');
	}

	// Get all doctors
	const { data: doctors, error: doctorsError } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('role', 'Doctor')
		.order('full_name', { ascending: true });

	if (doctorsError) {
		console.error('Community doctors error:', doctorsError);
	}

	const doctorList = doctors ?? [];
	const doctorIds = doctorList.map((doctor) => doctor.id);

	// ---------------------------------------------------------
	// FOLLOWED DOCTORS
	// ---------------------------------------------------------

	const { data: followedRows, error: followedError } = await supabaseAdmin
		.from('doctor_followers')
		.select('doctor_id')
		.eq('follower_id', session.user.id);

	if (followedError) {
		console.error('Followed doctors error:', followedError);
	}

	const followedDoctorIds = (followedRows ?? []).map((row) => row.doctor_id);

	// ---------------------------------------------------------
	// FOLLOWER COUNTS
	// ---------------------------------------------------------

	const followerCounts: Record<string, number> = {};

	// Initialise every doctor with 0
	for (const id of doctorIds) {
		followerCounts[id] = 0;
	}

	if (doctorIds.length > 0) {
		const { data: followerRows, error: followerError } = await supabaseAdmin
			.from('doctor_followers')
			.select('doctor_id')
			.in('doctor_id', doctorIds);

		if (followerError) {
			console.error('Follower counts error:', followerError);
		} else {
			for (const row of followerRows ?? []) {
				if (row.doctor_id) {
					followerCounts[row.doctor_id] =
						(followerCounts[row.doctor_id] ?? 0) + 1;
				}
			}
		}
	}

	// ---------------------------------------------------------
	// FOLLOWING COUNTS
	// ---------------------------------------------------------

	const followingCounts: Record<string, number> = {};

	for (const id of doctorIds) {
		followingCounts[id] = 0;
	}

	if (doctorIds.length > 0) {
		const { data: followingRows, error: followingError } = await supabaseAdmin
			.from('doctor_followers')
			.select('follower_id')
			.in('follower_id', doctorIds);

		if (followingError) {
			console.error('Following counts error:', followingError);
		} else {
			for (const row of followingRows ?? []) {
				if (row.follower_id) {
					followingCounts[row.follower_id] =
						(followingCounts[row.follower_id] ?? 0) + 1;
				}
			}
		}
	}

	// Add counts to each doctor
	const doctorsWithCounts = doctorList.map((doctor) => ({
		...doctor,
		followers_count: followerCounts[doctor.id] ?? 0,
		following_count: followingCounts[doctor.id] ?? 0
	}));

	return {
		profile,
		doctors: doctorsWithCounts,
		followedDoctorIds
	};
};

export const actions: Actions = {
	follow: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const doctorId = formData.get('doctor_id');

		if (!doctorId || typeof doctorId !== 'string') {
			return fail(400, {
				error: 'Invalid doctor ID'
			});
		}

		// Prevent following yourself
		if (doctorId === session.user.id) {
			return fail(400, {
				error: 'You cannot follow yourself'
			});
		}

		// Make sure target is actually a doctor
		const { data: doctor, error: doctorError } = await supabaseAdmin
			.from('profiles')
			.select('id, role')
			.eq('id', doctorId)
			.eq('role', 'Doctor')
			.maybeSingle();

		if (doctorError || !doctor) {
			return fail(404, {
				error: 'Doctor not found'
			});
		}

		// Check if already following
		const { data: existingFollow, error: existingError } =
			await supabaseAdmin
				.from('doctor_followers')
				.select('id')
				.eq('follower_id', session.user.id)
				.eq('doctor_id', doctorId)
				.maybeSingle();

		if (existingError) {
			console.error('Existing follow check error:', existingError);
			return fail(500, {
				error: 'Could not check follow status'
			});
		}

		if (existingFollow) {
			return {
				success: true,
				following: true
			};
		}

		const { error: insertError } = await supabaseAdmin
			.from('doctor_followers')
			.insert({
				follower_id: session.user.id,
				doctor_id: doctorId
			});

		if (insertError) {
			console.error('Follow insert error:', insertError);

			if (insertError.code === '23505') {
				return {
					success: true,
					following: true
				};
			}

			return fail(500, {
				error: 'Failed to follow doctor'
			});
		}

		return {
			success: true,
			following: true
		};
	},

	unfollow: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const doctorId = formData.get('doctor_id');

		if (!doctorId || typeof doctorId !== 'string') {
			return fail(400, {
				error: 'Invalid doctor ID'
			});
		}

		const { error } = await supabaseAdmin
			.from('doctor_followers')
			.delete()
			.eq('follower_id', session.user.id)
			.eq('doctor_id', doctorId);

		if (error) {
			console.error('Unfollow error:', error);

			return fail(500, {
				error: 'Failed to unfollow doctor'
			});
		}

		return {
			success: true,
			following: false
		};
	}
};