import { cmsSupabase } from '$lib/cmsSupabase';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import { fail, error as svelteError } from '@sveltejs/kit';

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
			throw svelteError(404, 'Research article not found');
		}
		
		articleData = {
			...data,
			source_table: 'research_articles'
		};
	} else if (type === 'article') {
		// New CMS articles
		const { data, error: dbError } = await supabaseAdmin
			.from('articles')
			.select('*')
			.eq('id', slug)
			.maybeSingle();

		if (!data) {
			throw svelteError(404, 'Article not found');
		}

		articleData = {
			...data,
			featured_image: data.cover_image_url || data.image,
			source_table: 'articles',
			abstract: data.abstract || data.content
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
			throw svelteError(404, 'Content not found');
		}

		articleData = {
			...data,
			source_table: 'cms_content'
		};
	}

	let comments = [];
	try {
		const { data: commentsData, error: commentsError } = await supabaseAdmin
			.from('article_comments')
			.select('id, content, created_at, user_id')
			.eq('article_id', articleData.id)
			.order('created_at', { ascending: true });
			
		if (commentsError) throw commentsError;
		
		if (commentsData && commentsData.length > 0) {
			const userIds = [...new Set(commentsData.map(c => c.user_id))];
			
			const { data: profilesData } = await supabaseAdmin
				.from('profiles')
				.select('id, full_name')
				.in('id', userIds);
				
			const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));
			
			comments = commentsData.map(c => ({
				...c,
				profiles: profilesMap.get(c.user_id) || { full_name: 'Anonymous' }
			}));
		}
	} catch (e) {
		console.error('Error fetching comments:', e);
	}

	return {
		article: articleData,
		type,
		comments
	};
}

export const actions = {
	submitComment: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const content = formData.get('content') as string;
		const articleId = formData.get('articleId') as string;

		if (!content || !articleId) return fail(400, { message: 'Missing data' });

		const { error: insertError } = await supabaseAdmin
			.from('article_comments')
			.insert({
				article_id: articleId,
				user_id: session.user.id,
				content
			});

		if (insertError) {
			console.error('Insert comment error:', insertError);
			return fail(500, { message: 'Failed to insert comment. If this is a research article or CMS content, the foreign key constraint on article_comments might be failing.' });
		}

		return { success: true };
	}
};
