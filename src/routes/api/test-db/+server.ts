import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';

export async function GET() {
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('email', 'lsetyn2128@minitts.net').single();
    const { data: notifications } = await supabaseAdmin.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
    return json({ profile, notifications });
}
