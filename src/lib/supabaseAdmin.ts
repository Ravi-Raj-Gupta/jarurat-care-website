import { createClient } from '@supabase/supabase-js';
import { PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY } from '$env/static/public';
import { env } from '$env/dynamic/private';
 
// SERVER-ONLY client. Uses the service_role key which bypasses RLS if available.
// Fallback to anon key to prevent crashes if the key is missing in .env
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || PUBLIC_CMS_SUPABASE_ANON_KEY;

export const supabaseAdmin = createClient(PUBLIC_CMS_SUPABASE_URL, serviceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});