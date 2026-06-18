import { cmsSupabase } from '$lib/cmsSupabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {

	const { data: event, error: dbError } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('slug', params.slug)
		.eq('content_type', 'event')
		.single();

	if (dbError || !event) {
		throw error(404, 'Event not found');
	}

	return {
		event
	};

}