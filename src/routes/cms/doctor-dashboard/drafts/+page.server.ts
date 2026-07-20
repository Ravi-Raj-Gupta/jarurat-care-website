import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (!profile || profile.role !== 'Doctor') {
		throw redirect(303, '/cms/login');
	}

	// Fetch drafted regular articles
	const { data: articleDrafts } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('author_id', session.user.id)
		.eq('status', 'draft')
		.order('created_at', { ascending: false });

	// Fetch drafted research papers
	const { data: researchDrafts } = await supabaseAdmin
		.from('research_articles')
		.select('*')
		.eq('user_id', session.user.id)
		.eq('status', 'draft')
		.order('created_at', { ascending: false });

	return {
		profile,
		articleDrafts: articleDrafts ?? [],
		researchDrafts: researchDrafts ?? []
	};
};
