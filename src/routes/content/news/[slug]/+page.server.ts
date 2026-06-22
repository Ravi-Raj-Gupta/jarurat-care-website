import { cmsSupabase } from '$lib/cmsSupabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {

	const { data: news, error: dbError } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('slug', params.slug)
		.eq('status', 'published')
		.eq('content_type', 'news')
		.single();

	if (dbError || !news) {
		throw error(404, 'News not found');
	}

	return {
		news
	};
}