import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// Get the logged-in user's profile
	const { data: profile, error: profileError } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (profileError || !profile) {
		console.error('Profile error:', profileError);
		throw redirect(303, '/cms/login');
	}

	// Only reviewers can access this page
	if (profile.role !== 'Doctor' || profile.is_reviewer !== true) {
		throw redirect(303, '/cms/doctor-dashboard');
	}

	// Fetch all research papers waiting for review
	const {
		data: pendingResearch,
		error: researchError
	} = await supabaseAdmin
		.from('research_articles')
		.select('*')
		.eq('status', 'under_review')
		.order('created_at', { ascending: false });

	if (researchError) {
		console.error('Error loading pending research papers:', researchError);
	}

	const researchList = pendingResearch ?? [];
	const userIds = [...new Set(researchList.map(r => r.user_id).filter(Boolean))];
	
	const authorMap = new Map<string, string>();
	if (userIds.length > 0) {
		const { data: authors } = await supabaseAdmin
			.from('profiles')
			.select('id, full_name')
			.in('id', userIds);
			
		if (authors) {
			authors.forEach(a => authorMap.set(a.id, a.full_name || ''));
		}
	}

	const enrichedResearch = researchList.map(r => ({
		...r,
		author_name: r.authors_and_affiliations || authorMap.get(r.user_id) || 'Unknown Researcher'
	}));

	return {
		profile,
		pendingResearch: enrichedResearch
	};
};