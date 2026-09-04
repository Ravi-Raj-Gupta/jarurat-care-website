import { error, redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const doctorId = params.id;

	// Fetch doctor profile
	const { data: doctor, error: doctorError } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('id', doctorId)
		.in('role', ['Doctor', 'Admin', 'Super_Admin'])
		.maybeSingle();

	if (doctorError || !doctor) {
		throw error(404, { message: 'Doctor not found' });
	}

	// Fetch doctor's published articles
	const { data: articles, error: articlesError } = await supabaseAdmin
		.from('articles')
		.select('id, title, category, created_at, image, tags')
		.eq('author_id', doctorId)
		.eq('status', 'published')
		.order('created_at', { ascending: false });

	if (articlesError) {
		console.error('Error fetching articles:', articlesError);
	}

	// Check if logged-in user follows this doctor
	let isFollowed = false;
	const session = await locals.getSession();

	if (session) {
		const { data: followData } = await supabaseAdmin
			.from('doctor_followers')
			.select('id')
			.eq('follower_id', session.user.id)
			.eq('doctor_id', doctorId)
			.maybeSingle();

		if (followData) {
			isFollowed = true;
		}
	}

	return {
		doctor,
		articles: articles ?? [],
		isFollowed,
		isSelf: session?.user?.id === doctorId,
		isLoggedIn: !!session
	};
};

export const actions: Actions = {
	follow: async ({ request, locals, params }) => {
		const session = await locals.getSession();
		if (!session) {
			// Redirect to login if not authenticated
			throw redirect(303, '/cms/login');
		}

		const doctor_id = params.id;

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
	unfollow: async ({ request, locals, params }) => {
		const session = await locals.getSession();
		if (!session) {
			throw redirect(303, '/cms/login');
		}

		const doctor_id = params.id;

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
