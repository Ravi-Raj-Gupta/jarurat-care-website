import { createClient } from '@supabase/supabase-js'
import { PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY } from '$env/static/public'

export const cmsSupabase = createClient(
    PUBLIC_CMS_SUPABASE_URL,
    PUBLIC_CMS_SUPABASE_ANON_KEY
)