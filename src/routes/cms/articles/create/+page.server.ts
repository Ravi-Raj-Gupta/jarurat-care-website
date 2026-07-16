import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();

	if (!profile) {
		throw redirect(303, '/cms/login');
	}

	return {
		profile
	};
};

export const actions: Actions = {
	submitArticle: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });

		const formData = await request.formData();
		const actionType = formData.get('actionType') as string; // 'draft' or 'under_review'
		const articleType = formData.get('articleType') as string; // 'regular' or 'research'

		if (!actionType || !articleType) {
			return fail(400, { message: 'Missing submission parameters' });
		}

		const status = actionType === 'draft' ? 'draft' : 'under_review';

		if (articleType === 'regular') {
			// Extract Regular Article Fields
			const title = formData.get('title') as string;
			const author_name_credentials = formData.get('author_name_credentials') as string;
			const category = formData.get('category') as string;
			const tagsStr = formData.get('tags') as string;
			const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
			const cover_image_url = formData.get('cover_image_url') as string;
			const abstract = formData.get('abstract') as string;
			
			// Extract Structured Content Fields
			const introduction = formData.get('introduction') as string;
			const background = formData.get('background') as string;
			const purpose = formData.get('purpose') as string;
			const scope = formData.get('scope') as string;
			
			const explanation = formData.get('explanation') as string;
			const evidence = formData.get('evidence') as string;
			const examples = formData.get('examples') as string;
			
			const interpretation = formData.get('interpretation') as string;
			const implications = formData.get('implications') as string;
			const recommendations = formData.get('recommendations') as string;
			
			const conclusion_summary = formData.get('conclusion_summary') as string;
			const takeaways = formData.get('takeaways') as string;
			
			const references_text = formData.get('references_text') as string;
			const acknowledgements = formData.get('acknowledgements') as string;
			const appendix = formData.get('appendix') as string;

			if (!title) return fail(400, { message: 'Title is required' });

			const insertData = {
				author_id: session.user.id,
				title,
				author_name_credentials,
				category,
				tags,
				cover_image_url,
				abstract,
				introduction,
				background,
				purpose,
				scope,
				explanation,
				evidence,
				examples,
				interpretation,
				implications,
				recommendations,
				conclusion_summary,
				takeaways,
				references_text,
				acknowledgements,
				appendix,
				status,
			};

			const { error } = await supabaseAdmin
				.from('articles')
				.insert([insertData]);

			if (error) {
				console.error("Insert article error:", error);
				return fail(500, { message: 'Failed to save regular article' });
			}

		} else if (articleType === 'research') {
			// Extract Research Paper Fields
			const title = formData.get('title') as string;
			const authors_and_affiliations = formData.get('authors_and_affiliations') as string;
			const corresponding_author_details = formData.get('corresponding_author_details') as string;
			const abstract = formData.get('abstract') as string;
			const keywords = formData.get('keywords') as string;
			const introduction = formData.get('introduction') as string;
			const literature_review = formData.get('literature_review') as string;
			const methods = formData.get('methods') as string;
			const results = formData.get('results') as string;
			const discussion = formData.get('discussion') as string;
			const conclusion = formData.get('conclusion') as string;
			const acknowledgements = formData.get('acknowledgements') as string;
			const funding = formData.get('funding') as string;
			const conflict_of_interest = formData.get('conflict_of_interest') as string;
			const author_contributions = formData.get('author_contributions') as string;
			const data_availability = formData.get('data_availability') as string;
			const ethics_statement = formData.get('ethics_statement') as string;
			const references_text = formData.get('references_text') as string;
			const appendix = formData.get('appendix') as string;
			const featured_image = formData.get('featured_image') as string;

			if (!title) return fail(400, { message: 'Title is required' });

			const insertData = {
				user_id: session.user.id, // Research table uses user_id instead of author_id
				title,
				authors_and_affiliations,
				corresponding_author_details,
				abstract,
				keywords,
				introduction,
				literature_review,
				methods,
				results,
				discussion,
				conclusion,
				acknowledgements,
				funding,
				conflict_of_interest,
				author_contributions,
				data_availability,
				ethics_statement,
				references_text,
				appendix,
				featured_image,
				status,
			};

			const { error } = await supabaseAdmin
				.from('research_articles')
				.insert([insertData]);

			if (error) {
				console.error("Insert research error:", error);
				return fail(500, { message: 'Failed to save research paper' });
			}
		} else {
			return fail(400, { message: 'Invalid article type' });
		}

		// Redirect to dashboard on success
		throw redirect(303, '/cms/doctor-dashboard');
	}
};
