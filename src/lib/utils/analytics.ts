import { supabase } from '$lib/supabaseClient';

type AnalyticsEventOptions = {
	userId?: string | null;
	contentId?: string | null;
	contentType?: string | null;
	sessionId?: string | null;
};

export async function trackEvent(
	eventType: string,
	options: AnalyticsEventOptions = {}
) {
	try {
		let sessionId = options.sessionId ?? null;

		// --------------------------------------------------
		// Create / reuse browser session ID
		// --------------------------------------------------

		if (typeof window !== 'undefined' && !sessionId) {
			sessionId = sessionStorage.getItem(
				'analytics_session_id'
			);

			if (!sessionId) {
				sessionId = crypto.randomUUID();

				sessionStorage.setItem(
					'analytics_session_id',
					sessionId
				);
			}
		}

		// --------------------------------------------------
		// Get authenticated user
		// --------------------------------------------------

		let userId = options.userId ?? null;

		if (!userId) {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			userId = user?.id ?? null;
		}

		// --------------------------------------------------
		// Insert analytics event
		// --------------------------------------------------

		const { error } = await supabase
			.from('analytics_events')
			.insert({
				user_id: userId,
				event_type: eventType,
				content_id:
					options.contentId ?? null,
				content_type:
					options.contentType ?? null,
				session_id: sessionId
			});

		if (error) {
			console.error(
				'Analytics tracking error:',
				error
			);
		}
	} catch (error) {
		// Analytics must never break the website
		console.error(
			'Analytics error:',
			error
		);
	}
}