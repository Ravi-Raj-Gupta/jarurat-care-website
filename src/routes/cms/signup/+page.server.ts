import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { ORCID_CLIENT_ID, ORCID_REDIRECT_URI } from '$env/static/private';
import { PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
 
// Disposable email domains blocklist
const DISPOSABLE_DOMAINS = new Set([
	'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'yopmail.com',
	'throwaway.email', '10minutemail.com', 'trashmail.com', 'fakeinbox.com',
	'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.info',
	'spam4.me', 'binkmail.com', 'bob.emailtmp.com', 'dispostable.com',
	'maildrop.cc', 'mailnull.com', 'spamgourmet.com', 'trashmail.at'
]);
 
function validateEmailFormat(email: string): boolean {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(email);
}
 
async function isDisposable(email: string): Promise<boolean> {
	const domain = email.split('@')[1]?.toLowerCase();
	if (!domain) return true;

	// Fast local check first
	const BLOCKED = new Set([
		'mailinator.com', 'tempmail.com', 'guerrillamail.com',
		'yopmail.com', 'throwaway.email', '10minutemail.com',
		'trashmail.com', 'fakeinbox.com', 'maildrop.cc',
		'sharklasers.com', 'grr.la', 'spam4.me', 'dispostable.com'
	]);
	if (BLOCKED.has(domain)) return true;

	// Kickbox API — 100k+ disposable domains, always updated
	try {
		const res = await fetch(
			`https://open.kickbox.com/v1/disposable/${domain}`,
			{ signal: AbortSignal.timeout(4000) }
		);
		const data = await res.json();
		return data.disposable === true;
	} catch {
		return false;
	}
}
 
async function checkMXRecord(email: string): Promise<boolean> {
	const domain = email.split('@')[1];
	if (!domain) return false;
 
	try {
		// Use Google DNS over HTTPS to check MX records
		const res = await fetch(
			`https://dns.google/resolve?name=${domain}&type=MX`,
			{ signal: AbortSignal.timeout(5000) }
		);
		const data = await res.json();
 
		// Status 0 = NOERROR, check if Answer exists
		if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
			return true;
		}
 
		// Fallback: check A record if no MX
		const aRes = await fetch(
			`https://dns.google/resolve?name=${domain}&type=A`,
			{ signal: AbortSignal.timeout(5000) }
		);
		const aData = await aRes.json();
		return aData.Status === 0 && aData.Answer && aData.Answer.length > 0;
	} catch {
		// If DNS check fails, allow through (don't block valid users)
		return true;
	}
}
 
export const load = async () => {
	// Pass ORCID auth URL to page
	const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${encodeURIComponent(ORCID_REDIRECT_URI)}`;
	return { orcidAuthUrl };
};
 
export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const fullName = (data.get('fullName') as string)?.trim();
		const email = (data.get('email') as string)?.trim().toLowerCase();
		const password = data.get('password') as string;
		const orcidId = data.get('orcid_id') as string | null;
 
		// --- Validations ---
		if (!fullName) return fail(400, { error: 'Full name is required', field: 'fullName' });
		if (!email) return fail(400, { error: 'Email is required', field: 'email' });
		if (!validateEmailFormat(email)) return fail(400, { error: 'Please enter a valid email address', field: 'email' });
		if (await isDisposable(email)) return fail(400, { error: 'Disposable email addresses are not allowed', field: 'email' });
		if (!password || password.length < 8) return fail(400, { error: 'Password must be at least 8 characters', field: 'password' });
 
		// --- MX Record Check ---
		const hasMX = await checkMXRecord(email);
		if (!hasMX) return fail(400, { error: 'This email domain does not appear to be valid', field: 'email' });
 
		// --- Supabase signup ---
		const supabase = createClient(PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY);
 
		// Check if email already exists
		const { data: existing } = await supabase
			.from('profiles')
			.select('id')
			.eq('email', email)
			.single();
 
		if (existing) return fail(400, { error: 'An account with this email already exists', field: 'email' });
 
		// Create auth user — Supabase sends verification email automatically
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
					orcid_id: orcidId || null
				},
				emailRedirectTo: 'https://jarurat.care/cms/login?verified=true'
			}
		});
 
		if (authError) return fail(400, { error: authError.message, field: 'email' });
 
		const user = authData.user;
		if (user) {
			// Insert into profiles table
			await supabase.from('profiles').insert([{
				id: user.id,
				email,
				full_name: fullName,
				role: 'user',
				orcid_id: orcidId || null,
				email_verified: false
			}]);
		}
 
		return { success: true, email };
	}
};
