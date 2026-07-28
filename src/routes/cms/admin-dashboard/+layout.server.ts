import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: userProfile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Super_Admin')) {
		throw redirect(303, '/');
	}

	const { data: cmsContents } = await supabaseAdmin
		.from('cms_content')
		.select('*')
		.order('created_at', { ascending: false });

	return { 
		cmsContents: cmsContents || []
	};
};
