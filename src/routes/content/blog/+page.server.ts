import { cmsSupabase } from '$lib/cmsSupabase';

export async function load() {

	const { data: blogs, error } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('content_type', 'blog')
		.eq('status', 'published')
		.order('created_at', { ascending: false });

	if (error) {
		console.error(error);
		return { blogs: [] };
	}

	return {
		blogs
	};

}