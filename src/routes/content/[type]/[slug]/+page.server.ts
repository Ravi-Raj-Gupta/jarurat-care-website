import { cmsSupabase } from '$lib/cmsSupabase';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import { fail, error as svelteError } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	const { type, slug } = params;

	let articleData = null;

	// ---------------------------------------------------------
	// GET CONTENT
	// ---------------------------------------------------------

	if (type === 'research') {
		const { data, error: dbError } = await cmsSupabase
			.from('research_articles')
			.select('*')
			.eq('id', slug)
			.eq('status', 'published')
			.single();

		if (dbError || !data) {
			console.error('Research article error:', dbError);
			throw svelteError(404, 'Research article not found');
		}

		articleData = {
			...data,
			source_table: 'research_articles'
		};
	} else if (type === 'article') {
		// CMS Articles
		const { data, error: dbError } = await supabaseAdmin
			.from('articles')
			.select('*')
			.eq('id', slug)
			.eq('status', 'published')
			.maybeSingle();

		if (dbError) {
			console.error('Article database error:', dbError);
			throw svelteError(500, 'Unable to load article');
		}

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
		// CMS Content:
		// blog, news, events, faq, etc.

		let { data, error: dbError } = await cmsSupabase
			.from('cms_content')
			.select('*')
			.eq('slug', slug)
			.eq('content_type', type)
			.eq('status', 'published')
			.maybeSingle();

		// UUID fallback
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
			console.error('CMS content error:', dbError);
			throw svelteError(404, 'Content not found');
		}

		articleData = {
			...data,
			source_table: 'cms_content'
		};
	}

	// ---------------------------------------------------------
	// ANALYTICS: CREATE / GET VISITOR SESSION
	// ---------------------------------------------------------

	let sessionId = cookies.get('analytics_session_id');

	if (!sessionId) {
		sessionId = crypto.randomUUID();

		cookies.set('analytics_session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 365
		});
	}

	// ---------------------------------------------------------
	// GET AUTHENTICATED USER
	// ---------------------------------------------------------

	let userId: string | null = null;

	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (user) {
			userId = user.id;
		}
	} catch (authError) {
		console.error('Analytics auth lookup failed:', authError);
	}

	// ---------------------------------------------------------
	// RECORD CONTENT VIEW
	// ---------------------------------------------------------

	try {
		const { error: analyticsError } = await supabaseAdmin
			.from('analytics_events')
			.insert({
				user_id: userId,
				event_type: 'view',
				content_id: articleData.id,
				content_type: type,
				session_id: sessionId
			});

		if (analyticsError) {
			console.error('Analytics view insert error:', analyticsError);
		}
	} catch (analyticsError) {
		console.error('Analytics view tracking failed:', analyticsError);
	}

	// ---------------------------------------------------------
	// FETCH COMMENTS
	// ---------------------------------------------------------

	let comments = [];

	try {
		const { data: commentsData, error: commentsError } =
			await supabaseAdmin
				.from('article_comments')
				.select('id, content, created_at, user_id')
				.eq('article_id', articleData.id)
				.order('created_at', { ascending: true });

		if (commentsError) throw commentsError;

		if (commentsData && commentsData.length > 0) {
			const userIds = [
				...new Set(commentsData.map((comment) => comment.user_id))
			];

			const { data: profilesData } = await supabaseAdmin
				.from('profiles')
				.select('id, full_name')
				.in('id', userIds);

			const profilesMap = new Map(
				(profilesData || []).map((profile) => [profile.id, profile])
			);

			comments = commentsData.map((comment) => ({
				...comment,
				profiles:
					profilesMap.get(comment.user_id) || {
						full_name: 'Anonymous'
					}
			}));
		}
	} catch (error) {
		console.error('Error fetching comments:', error);
	}

	return {
		article: articleData,
		type,
		comments
	};
};

// ---------------------------------------------------------
// ACTIONS
// ---------------------------------------------------------

export const actions = {
	submitComment: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();

		const content = formData.get('content') as string;
		const articleId = formData.get('articleId') as string;

		if (!content || !articleId) {
			return fail(400, {
				message: 'Missing data'
			});
		}

		const { error: insertError } = await supabaseAdmin
			.from('article_comments')
			.insert({
				article_id: articleId,
				user_id: session.user.id,
				content
			});

		if (insertError) {
			console.error('Insert comment error:', insertError);

			return fail(500, {
				message:
					'Failed to insert comment. If this is a research article or CMS content, the foreign key constraint on article_comments might be failing.'
			});
		}

		return {
			success: true
		};
	}
};