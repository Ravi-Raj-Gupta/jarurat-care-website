import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	const { data: doctors, error } = await locals.supabase
	.from('profiles')
	.select('*')
	.eq('role', 'Doctor')
	.order('full_name');

	if (error) {
		console.error(error);
	}

	return {
		profile,
		doctors: doctors ?? []
	};
};