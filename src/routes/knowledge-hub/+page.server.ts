import { cmsSupabase } from '$lib/cmsSupabase';
import { supabase } from '$lib/supabase';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad } from './$types';

function stripHtml(html: string) {
	return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function makeExcerpt(text: string, max = 160) {
	const plain = stripHtml(text);
	return plain.length > max ? plain.slice(0, max) + '…' : plain;
}

function formatDate(d: string) {
	if (!d) return '';
	return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
}

const DEFAULT_IMAGE_COUNTS: Record<string, number> = {
	article: 8,
	research: 8,
	blog: 2,
	campaign: 3,
	event: 3,
	faq: 3,
	news: 3,
	testimonials: 3
};

const FOLDER_MAP: Record<string, string> = {
	article: 'Articles',
	research: 'Articles',
	blog: 'Blogs',
	campaign: 'Campaign',
	event: 'Events',
	faq: 'FAQs',
	news: 'News',
	testimonials: 'Testimonials'
};

function getDefaultThumbnail(type: string, id: string | number) {
	const safeType = type || 'article';
	const count = DEFAULT_IMAGE_COUNTS[safeType] || 1;
	const folder = FOLDER_MAP[safeType] || 'Articles';
	
	let numId = 0;
	if (typeof id === 'number') {
		numId = id;
	} else if (typeof id === 'string') {
		for (let i = 0; i < id.length; i++) {
			numId = (numId << 5) - numId + id.charCodeAt(i);
			numId |= 0;
		}
		numId = Math.abs(numId);
	}
	
	const index = (numId % count) + 1;
	const filePrefix = safeType === 'research' ? 'article' : safeType;
	return `/defaults/${folder}/${filePrefix}-${index}.jpeg`;
}

import { fail } from '@sveltejs/kit';

export const actions = {
	toggleSave: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const articleId = formData.get('articleId') as string;
		const isSaved = formData.get('isSaved') === 'true';

		if (!articleId) return fail(400, { message: 'Missing articleId' });

		if (isSaved) {
			await supabaseAdmin
				.from('saved_articles')
				.delete()
				.match({ user_id: session.user.id, article_id: articleId });
		} else {
			await supabaseAdmin
				.from('saved_articles')
				.insert({ user_id: session.user.id, article_id: articleId });
		}
		
		return { success: true };
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	let savedArticleIds: string[] = [];

	if (session) {
		const { data: savedRows } = await supabaseAdmin
			.from('saved_articles')
			.select('article_id')
			.eq('user_id', session.user.id);
		
		if (savedRows) {
			savedArticleIds = savedRows.map(r => String(r.article_id));
		}
	}

	let publications: any[] = [];

	try {
		// 1. Fetch research articles (CMS)
		const { data: researchData } = await cmsSupabase
			.from('research_articles')
			.select('*')
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		const researchItems = (researchData || []).map(r => ({
			id: r.id,
			slug: r.slug || r.id, // Research articles don't have slug, use ID
			title: r.title || 'Untitled Research',
			excerpt: makeExcerpt(r.abstract || ''),
			thumbnail: r.featured_image || getDefaultThumbnail('research', r.id),
			category: 'Research Paper',
			type: 'research',
			date: formatDate(r.created_at),
			date_raw: new Date(r.created_at).getTime(),
			author: r.author_name_credentials || r.author || 'Research Team'
		}));

		// 2. Fetch CMS Content (Blogs, News, Events, Campaigns, Testimonials, FAQs)
		const { data: cmsData } = await cmsSupabase
			.from('cms_content')
			.select('*')
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		const cmsItems = (cmsData || []).map(c => ({
			id: c.id,
			slug: c.slug || c.id,
			title: c.title || 'Untitled',
			excerpt: makeExcerpt(c.content || ''),
			thumbnail: c.featured_image || getDefaultThumbnail(c.content_type, c.id),
			category: c.category || c.content_type.charAt(0).toUpperCase() + c.content_type.slice(1),
			type: c.content_type,
			date: formatDate(c.created_at),
			date_raw: new Date(c.created_at).getTime(),
			author: c.author_name_credentials || c.author || 'Editorial Team'
		}));

		// 3. Fetch CMS Articles (New DB)
		const { data: articlesData } = await supabaseAdmin
			.from('articles')
			.select('*')
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		const legacyItems = (articlesData || [])
			.map(a => ({
				id: a.id,
				slug: a.slug || a.id.toString(),
				title: a.title || 'Untitled Article',
				excerpt: makeExcerpt(a.abstract || a.content || a.excerpt || ''),
				thumbnail: a.cover_image_url || a.image || getDefaultThumbnail('article', a.id.toString()),
				category: a.category || 'General Article',
				type: 'article',
				date: formatDate(a.created_at),
				date_raw: new Date(a.created_at).getTime(),
				author: a.author_name_credentials || a.author || 'JCF Team'
			}));

		// Combine and sort
		publications = [...researchItems, ...cmsItems, ...legacyItems].sort((a, b) => b.date_raw - a.date_raw);

	} catch (error) {
		console.error('Error fetching knowledge hub content:', error);
	}

	return {
		publications,
		savedArticleIds,
		session
	};
};
