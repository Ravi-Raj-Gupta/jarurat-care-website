import { cmsSupabase } from '$lib/cmsSupabase';
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { type, slug } = params;
	
	let articleData = null;

	if (type === 'research') {
		const { data, error: dbError } = await cmsSupabase
			.from('research_articles')
			.select('*')
			.eq('id', slug)
			.eq('status', 'published')
			.single();
			
		if (dbError || !data) {
			console.error("Research article error:", dbError);
			throw error(404, 'Research article not found');
		}
		
		articleData = {
			...data,
			source_table: 'research_articles'
		};
	} else if (type === 'article') {
		// Old JCF articles
		const { data, error: dbError } = await supabase
			.from('articles')
			.select('*')
			.eq('slug', slug)
			.maybeSingle();
			
		let finalData = data;
		if (!finalData && !isNaN(Number(slug))) {
			const { data: idData } = await supabase
				.from('articles')
				.select('*')
				.eq('id', Number(slug))
				.maybeSingle();
			finalData = idData;
		}

		if (!finalData) {
			throw error(404, 'Article not found');
		}

		articleData = {
			...finalData,
			featured_image: finalData.image,
			source_table: 'cms_content',
			abstract: finalData.abstract || finalData.content
		};
	} else {
		// blog, news, events, faqs, etc.
		let { data, error: dbError } = await cmsSupabase
			.from('cms_content')
			.select('*')
			.eq('slug', slug)
			.eq('content_type', type)
			.eq('status', 'published')
			.maybeSingle();

		// Check if slug is a valid UUID, which means it might be an ID fallback
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!data && uuidRegex.test(slug)) {
			const { data: idData, error: idError } = await cmsSupabase
				.from('cms_content')
				.select('*')
				.eq('id', slug)
				.eq('content_type', type)
				.eq('status', 'published')
				.maybeSingle();
			data = idData;
			dbError = idError;
		}
			
		if (dbError || !data) {
			console.error("CMS content error:", dbError);
			throw error(404, 'Content not found');
		}

		articleData = {
			...data,
			source_table: 'cms_content'
		};
	}

	return {
		article: articleData,
		type
	};
}
