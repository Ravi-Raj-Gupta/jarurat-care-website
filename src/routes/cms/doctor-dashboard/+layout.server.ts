import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile, error: profileError } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.maybeSingle();

	if (profileError || !profile) {
		console.error('Error loading profile in layout:', profileError);
		throw redirect(303, '/cms/login');
	}

	if (profile.role !== 'Doctor') {
		throw redirect(303, '/cms/login');
	}

	if (profile.verification_status !== 'approved') {
		throw redirect(303, '/cms/pending');
	}

	return {
		profile,
		isReviewer: profile.is_reviewer === true
	};
};
