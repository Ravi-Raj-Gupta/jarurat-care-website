import { cmsSupabase } from '$lib/cmsSupabase';

export async function load() {

	const { data: events, error } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('content_type', 'event')
		.order('created_at', { ascending: false });

	if (error) {
		console.error(error);
		return { events: [] };
	}

	return {
		events
	};

}