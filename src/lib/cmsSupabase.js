import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY } from '$env/static/public';
 
// Uses cookie-based session storage (not localStorage) so that
// the session set here during login is also visible to hooks.server.ts
// and any +page.server.ts load functions / actions.
export const cmsSupabase = createBrowserClient(
	PUBLIC_CMS_SUPABASE_URL,
	PUBLIC_CMS_SUPABASE_ANON_KEY
);