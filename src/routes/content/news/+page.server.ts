import { cmsSupabase } from '$lib/cmsSupabase';

export async function load() {

	const { data: news, error } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('content_type', 'news')
		.order('created_at', { ascending: false });

	if (error) {
		console.error(error);
		return { news: [] };
	}

	return {
		news
	};
}