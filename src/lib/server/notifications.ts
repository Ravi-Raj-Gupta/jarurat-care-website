import { supabaseAdmin } from '$lib/supabaseAdmin';

export async function createAdminNotification(
	title: string, 
	message: string, 
	type: 'info' | 'success' | 'warning' | 'error' = 'info',
	userId?: string, 
	link?: string
) {
	if (userId) {
		const { error } = await supabaseAdmin
			.from('notifications')
			.insert({
				user_id: userId,
				title,
				message,
				type,
				link,
				is_read: false
			});

		if (error) {
			console.error('Error creating direct notification:', error);
		}
	} else {
		// It's a global admin/reviewer notification
		const { data: adminsAndReviewers } = await supabaseAdmin
			.from('profiles')
			.select('id')
			.or('role.eq.Admin,role.eq.Super_Admin,is_reviewer.eq.true');

		if (adminsAndReviewers && adminsAndReviewers.length > 0) {
			const notifications = adminsAndReviewers.map(user => ({
				user_id: user.id,
				title,
				message,
				type,
				link,
				is_read: false
			}));

			const { error } = await supabaseAdmin
				.from('notifications')
				.insert(notifications);

			if (error) {
				console.error('Error creating global notifications:', error);
			}
		}
	}
}

export async function createGlobalNotification(
	title: string, 
	message: string, 
	type: 'info' | 'success' | 'warning' | 'error' = 'info',
	link?: string
) {
	// Send to ALL users (Readers, Doctors, etc.)
	const { data: allUsers } = await supabaseAdmin
		.from('profiles')
		.select('id');

	if (allUsers && allUsers.length > 0) {
		const notifications = allUsers.map(user => ({
			user_id: user.id,
			title,
			message,
			type,
			link,
			is_read: false
		}));

		const { error } = await supabaseAdmin
			.from('notifications')
			.insert(notifications);

		if (error) {
			console.error('Error creating global event notifications:', error);
		}
	}
}