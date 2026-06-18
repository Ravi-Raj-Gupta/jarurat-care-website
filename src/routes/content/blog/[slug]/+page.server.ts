import { cmsSupabase } from '$lib/cmsSupabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {

	const { data: blog, error: dbError } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('slug', params.slug)
		.eq('content_type', 'blog')
		.single();

	if (dbError || !blog) {
		throw error(404, 'Blog not found');
	}

	return {
		blog
	};
}