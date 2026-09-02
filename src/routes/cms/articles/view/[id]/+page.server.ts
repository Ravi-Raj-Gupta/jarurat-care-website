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

	const { data: article } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!article) {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	// Fetch author name if possible
	let authorName = 'Unknown Author';
	if (article.author_id) {
		const { data: authorProfile } = await supabaseAdmin
			.from('profiles')
			.select('full_name')
			.eq('id', article.author_id)
			.single();
		if (authorProfile?.full_name) {
			authorName = authorProfile.full_name;
		}
	}

	return {
		profile,
		article: {
			...article,
			author_name: authorName
		}
	};
};
