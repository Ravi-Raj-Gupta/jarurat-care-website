import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY } from '$env/static/public';
 
export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/cms/author_dashboard') || event.url.pathname.startsWith('/cms/author-dashboard')) {
		throw redirect(301, '/cms/doctor-dashboard');
	}

	event.locals.supabase = createServerClient(PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});
 
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		
		if (!session) return null;

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			return null;
		}

		return {
			access_token: session.access_token,
			refresh_token: session.refresh_token,
			expires_in: session.expires_in,
			expires_at: session.expires_at,
			token_type: session.token_type,
			provider_token: session.provider_token,
			provider_refresh_token: session.provider_refresh_token,
			user: user
		} as any;
	};
 
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
