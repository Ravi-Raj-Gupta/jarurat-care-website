import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (!profile) {
		throw redirect(303, '/cms/login');
	}

	const { data: research } = await supabaseAdmin
		.from('research_articles')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!research) {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	// Fetch author name if possible
	let authorName = research.authors_and_affiliations;
	if (!authorName && research.user_id) {
		const { data: authorProfile } = await supabaseAdmin
			.from('profiles')
			.select('full_name')
			.eq('id', research.user_id)
			.single();
		if (authorProfile) {
			authorName = authorProfile.full_name;
		}
	}

	return {
		profile,
		research: {
			...research,
			author_name: authorName || 'Unknown Researcher'
		}
	};
};
