import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ORCID_CLIENT_ID, ORCID_CLIENT_SECRET, ORCID_REDIRECT_URI } from '$env/static/private';
import { PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
 
export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
 
	if (error || !code) {
		throw redirect(302, '/cms/register?error=orcid_cancelled');
	}
 
	try {
		// Step 1: Exchange code for ORCID token
		const tokenRes = await fetch('https://orcid.org/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: ORCID_CLIENT_ID,
				client_secret: ORCID_CLIENT_SECRET,
				grant_type: 'authorization_code',
				code,
				redirect_uri: ORCID_REDIRECT_URI
			})
		});
 
		const tokenData = await tokenRes.json();
 
		if (!tokenData.access_token) {
			throw redirect(302, '/cms/register?error=orcid_token_failed');
		}
 
		const orcidId = tokenData.orcid;
		const orcidName = tokenData.name || '';
		const accessToken = tokenData.access_token;
 
		// Step 2: Get email from ORCID profile
		const profileRes = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/email`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json'
			}
		});
 
		const profileData = await profileRes.json();
		const emails = profileData?.['email'] ?? [];
		const primaryEmail = emails.find((e: any) => e.primary)?.email ?? emails[0]?.email ?? null;
 
		if (!primaryEmail) {
			// No email in ORCID — redirect to register with orcid prefill
			throw redirect(302, `/cms/register?orcid_id=${orcidId}&orcid_name=${encodeURIComponent(orcidName)}&error=no_email`);
		}
 
		// Step 3: Check if user exists in Supabase
		const supabase = createClient(PUBLIC_CMS_SUPABASE_URL, PUBLIC_CMS_SUPABASE_ANON_KEY);
 
		const { data: existingProfile } = await supabase
			.from('profiles')
			.select('id, email, role')
			.eq('orcid_id', orcidId)
			.single();
 
		if (existingProfile) {
			// User exists — redirect to dashboard with success
			// In real app, you'd set a session cookie here
			throw redirect(302, '/cms/login?orcid=success');
		}
 
		// Step 4: New user — redirect to register with prefilled data
		throw redirect(
			302,
			`/cms/register?orcid_id=${orcidId}&orcid_name=${encodeURIComponent(orcidName)}&orcid_email=${encodeURIComponent(primaryEmail)}`
		);
	} catch (err) {
		if (err instanceof Response) throw err; // rethrow redirects
		throw redirect(302, '/cms/register?error=orcid_failed');
	}
};
