import { cmsSupabase } from '$lib/cmsSupabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const type = params.type;

	const allowedTypes = [
		'blog',
		'news',
		'event',
		'campaign',
		'testimonial',
		'faq'
	];

	if (!allowedTypes.includes(type)) {
		throw error(404, 'Content type not found');
	}

	const { data: content, error: dbError } = await cmsSupabase
		.from('cms_content')
		.select('*')
		.eq('content_type', type)
        .eq('status', 'published')
		.order('created_at', { ascending: false });

	if (dbError) {
		console.error(dbError);
		return {
			type,
			content: []
		};
	}
    console.log("TYPE:", type);
    console.log("CONTENT:", content);
	return {
		type,
		content
	};
}