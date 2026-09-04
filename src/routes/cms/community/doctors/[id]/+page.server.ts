import { redirect, fail, error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const doctorId = params.id;

	if (!doctorId) {
		throw error(404, 'Doctor not found');
	}

	// ---------------------------------------------------------
	// CURRENT USER
	// ---------------------------------------------------------

	const { data: currentUser, error: currentUserError } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.maybeSingle();

	if (currentUserError || !currentUser) {
		throw redirect(303, '/cms/login');
	}

	// ---------------------------------------------------------
	// DOCTOR PROFILE
	// ---------------------------------------------------------

	const { data: doctor, error: doctorError } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('id', doctorId)
		.in('role', ['Doctor', 'Admin', 'Super_Admin'])
		.maybeSingle();

	if (doctorError) {
		console.error('Public doctor profile error:', doctorError);
	}

	if (!doctor) {
		throw error(404, 'Doctor not found');
	}

	// ---------------------------------------------------------
	// FOLLOWERS
	// ---------------------------------------------------------

	const { data: followerRows, error: followerError } = await supabaseAdmin
		.from('doctor_followers')
		.select('follower_id, created_at')
		.eq('doctor_id', doctorId)
		.order('created_at', { ascending: false });

	if (followerError) {
		console.error('Doctor followers error:', followerError);
	}

	const followerIds = (followerRows ?? [])
		.map((row) => row.follower_id)
		.filter(Boolean);

	let followers: any[] = [];

	if (followerIds.length > 0) {
		const { data: followerProfiles, error: followerProfilesError } =
			await supabaseAdmin
				.from('profiles')
				.select('*')
				.in('id', followerIds);

		if (followerProfilesError) {
			console.error(
				'Follower profiles error:',
				followerProfilesError
			);
		}

		const profileMap = new Map(
			(followerProfiles ?? []).map((profile) => [profile.id, profile])
		);

		followers = followerIds
			.map((id) => profileMap.get(id))
			.filter(Boolean)
			.map((profile) => ({
				...profile,
				followers_count: 0,
				following_count: 0
			}));
	}

	// ---------------------------------------------------------
	// FOLLOWING
	// ---------------------------------------------------------

	const { data: followingRows, error: followingError } =
		await supabaseAdmin
			.from('doctor_followers')
			.select('doctor_id, created_at')
			.eq('follower_id', doctorId)
			.order('created_at', { ascending: false });

	if (followingError) {
		console.error('Doctor following error:', followingError);
	}

	const followingIds = (followingRows ?? [])
		.map((row) => row.doctor_id)
		.filter(Boolean);

	let following: any[] = [];

	if (followingIds.length > 0) {
		const { data: followingProfiles, error: followingProfilesError } =
			await supabaseAdmin
				.from('profiles')
				.select('*')
				.in('id', followingIds);

		if (followingProfilesError) {
			console.error(
				'Following profiles error:',
				followingProfilesError
			);
		}

		const profileMap = new Map(
			(followingProfiles ?? []).map((profile) => [profile.id, profile])
		);

		following = followingIds
			.map((id) => profileMap.get(id))
			.filter(Boolean)
			.map((profile) => ({
				...profile,
				followers_count: 0,
				following_count: 0
			}));
	}

	// ---------------------------------------------------------
	// CURRENT USER FOLLOW STATUS
	// ---------------------------------------------------------

	let isFollowing = false;

	if (session.user.id !== doctorId) {
		const { data: existingFollow, error: followCheckError } =
			await supabaseAdmin
				.from('doctor_followers')
				.select('id')
				.eq('follower_id', session.user.id)
				.eq('doctor_id', doctorId)
				.maybeSingle();

		if (followCheckError) {
			console.error(
				'Follow status error:',
				followCheckError
			);
		}

		isFollowing = !!existingFollow;
	}

	// ---------------------------------------------------------
	// FOLLOWING / FOLLOWER COUNTS
	// ---------------------------------------------------------

	const followersCount = followerIds.length;
	const followingCount = followingIds.length;

	// ---------------------------------------------------------
	// AVATAR
	// Do NOT use profile_image because it does not exist.
	// ---------------------------------------------------------

	const avatar =
		doctor.avatar_url ||
		doctor.image_url ||
		doctor.photo_url ||
		doctor.profile_picture ||
		doctor.avatar ||
		null;

	return {
		currentUser,
		doctor: {
			...doctor,
			avatar
		},
		followers,
		following,
		followersCount,
		followingCount,
		isFollowing
	};
};

export const actions: Actions = {
	follow: async ({ request, locals, params }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const doctorId = params.id;

		if (!doctorId) {
			return fail(400, {
				error: 'Invalid doctor ID'
			});
		}

		if (doctorId === session.user.id) {
			return fail(400, {
				error: 'You cannot follow yourself'
			});
		}

		// Make sure doctor exists
		const { data: doctor } = await supabaseAdmin
			.from('profiles')
			.select('id, role')
			.eq('id', doctorId)
			.eq('role', 'Doctor')
			.maybeSingle();

		if (!doctor) {
			return fail(404, {
				error: 'Doctor not found'
			});
		}

		const { data: existing } = await supabaseAdmin
			.from('doctor_followers')
			.select('id')
			.eq('follower_id', session.user.id)
			.eq('doctor_id', doctorId)
			.maybeSingle();

		if (existing) {
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
			console.error('Profile follow error:', insertError);

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

	unfollow: async ({ locals, params }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const doctorId = params.id;

		if (!doctorId) {
			return fail(400, {
				error: 'Invalid doctor ID'
			});
		}

		const { error: deleteError } = await supabaseAdmin
			.from('doctor_followers')
			.delete()
			.eq('follower_id', session.user.id)
			.eq('doctor_id', doctorId);

		if (deleteError) {
			console.error('Profile unfollow error:', deleteError);

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