import { cmsSupabase } from '$lib/cmsSupabase';

export async function load() {
	const { data: content, error } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.in('content_type', [
			'blog',
			'news',
			'event',
			'campaign',
			'faq',
			'testimonial'
		])
		.eq('status', 'published')
		.order('created_at', { ascending: false });

	if (error) {
		console.error(error);
		return { content: [] };
	}

	return {
		content
	};
}