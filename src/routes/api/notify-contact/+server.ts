import { json } from '@sveltejs/kit';
import { createAdminNotification } from '$lib/server/notifications';

export const POST = async ({ request }) => {
	try {
		const data = await request.json();
		const name = data.name || 'someone';

		await createAdminNotification(
			'New Inquiry',
			`New inquiry received from ${name}.`,
			'info'
		);

		return json({ success: true });
	} catch (err) {
		console.error('Error sending contact notification:', err);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
