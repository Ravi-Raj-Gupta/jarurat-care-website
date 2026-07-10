import { createClient } from '@supabase/supabase-js';
import { PUBLIC_CMS_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
 
// SERVER-ONLY client. Uses the service_role key which bypasses RLS.
// Never import this file into any component that runs in the browser.
export const supabaseAdmin = createClient(PUBLIC_CMS_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});