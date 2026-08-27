import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) {
		return json({ notifications: [] });
	}

	const { data, error } = await supabaseAdmin
		.from('notifications')
		.select('*')
		.eq('user_id', session.user.id)
		.eq('is_read', false)
		.order('created_at', { ascending: false })
		.limit(20);

	if (error) {
		console.error('Error fetching notifications via admin:', error);
		return json({ notifications: [] });
	}

	return json({ notifications: data || [] });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session) {
		return json({ success: false });
	}

	try {
		const { id } = await request.json();
		
		let query = supabaseAdmin
			.from('notifications')
			.update({ is_read: true })
			.eq('user_id', session.user.id);

		if (id !== 'all') {
			query = query.eq('id', id);
		} else {
			query = query.eq('is_read', false);
		}

		const { error } = await query;
			
		if (error) {
			console.error('Error marking notification read via admin:', error);
			return json({ success: false });
		}
		
		return json({ success: true });
	} catch (e) {
		return json({ success: false });
	}
};
