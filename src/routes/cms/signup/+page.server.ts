import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	PUBLIC_CMS_SUPABASE_URL,
	PUBLIC_CMS_SUPABASE_ANON_KEY
} from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// CANCER-RELATED INTERESTS
// ============================================================

const ALLOWED_INTERESTS = [
	'Cancer Research',
	'Cancer Biology',
	'Cancer Genetics & Genomics',
	'Cancer Immunology',
	'Cancer Epidemiology',
	'Cancer Prevention',
	'Early Cancer Detection',
	'Cancer Screening & Diagnosis',
	'Breast Cancer',
	'Lung Cancer',
	'Blood Cancers',
	'Brain & Neurological Cancers',
	'Gastrointestinal Cancers',
	'Gynecological Cancers',
	'Prostate & Urological Cancers',
	'Pediatric Cancers',
	'Chemotherapy',
	'Radiation Therapy',
	'Immunotherapy & Targeted Therapy',
	'Cancer Survivorship & Palliative Care'
];

// ============================================================
// DISPOSABLE EMAIL DOMAINS
// ============================================================

const DISPOSABLE_DOMAINS = new Set([
	'mailinator.com',
	'tempmail.com',
	'guerrillamail.com',
	'yopmail.com',
	'throwaway.email',
	'10minutemail.com',
	'trashmail.com',
	'fakeinbox.com',
	'sharklasers.com',
	'guerrillamailblock.com',
	'grr.la',
	'guerrillamail.info',
	'spam4.me',
	'binkmail.com',
	'bob.emailtmp.com',
	'dispostable.com',
	'maildrop.cc',
	'mailnull.com',
	'spamgourmet.com',
	'trashmail.at'
]);

// ============================================================
// EMAIL FORMAT VALIDATION
// ============================================================

function validateEmailFormat(email: string): boolean {
	const regex =
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	return regex.test(email);
}

// ============================================================
// DISPOSABLE EMAIL CHECK
// ============================================================

async function isDisposable(email: string): Promise<boolean> {
	const domain = email.split('@')[1]?.toLowerCase();

	if (!domain) return true;

	// Fast local check
	if (DISPOSABLE_DOMAINS.has(domain)) {
		return true;
	}

	// Kickbox API
	try {
		const res = await fetch(
			`https://open.kickbox.com/v1/disposable/${domain}`,
			{
				signal: AbortSignal.timeout(4000)
			}
		);

		const data = await res.json();

		return data.disposable === true;
	} catch {
		// Do not block registration if external service fails
		return false;
	}
}

// ============================================================
// MX RECORD CHECK
// ============================================================

async function checkMXRecord(email: string): Promise<boolean> {
	const domain = email.split('@')[1];

	if (!domain) return false;

	try {
		// Check MX record
		const res = await fetch(
			`https://dns.google/resolve?name=${domain}&type=MX`,
			{
				signal: AbortSignal.timeout(5000)
			}
		);

		const data = await res.json();

		if (
			data.Status === 0 &&
			data.Answer &&
			data.Answer.length > 0
		) {
			return true;
		}

		// Fallback to A record
		const aRes = await fetch(
			`https://dns.google/resolve?name=${domain}&type=A`,
			{
				signal: AbortSignal.timeout(5000)
			}
		);

		const aData = await aRes.json();

		return (
			aData.Status === 0 &&
			aData.Answer &&
			aData.Answer.length > 0
		);
	} catch {
		// If DNS lookup fails, don't block registration
		return true;
	}
}

// ============================================================
// LOAD
// ============================================================

export const load = async () => {
	const orcidAuthUrl =
		`https://orcid.org/oauth/authorize?` +
		`client_id=${env.ORCID_CLIENT_ID || ''}` +
		`&response_type=code` +
		`&scope=/authenticate` +
		`&redirect_uri=${encodeURIComponent(env.ORCID_REDIRECT_URI || '')}`;

	return {
		orcidAuthUrl,
		availableInterests: ALLOWED_INTERESTS
	};
};

// ============================================================
// ACTIONS
// ============================================================

export const actions: Actions = {
	register: async ({ request, url }) => {
		const data = await request.formData();

		// --------------------------------------------------------
		// BASIC USER INFORMATION
		// --------------------------------------------------------

		const fullName = (data.get('fullName') as string)?.trim();

		const email = (data.get('email') as string)
			?.trim()
			.toLowerCase();

		const password = data.get('password') as string;

		const orcidId =
			(data.get('orcid_id') as string | null)?.trim() || null;

		// --------------------------------------------------------
		// SELECTED INTERESTS
		// --------------------------------------------------------

		const selectedInterests = data
			.getAll('interests')
			.map((interest) => String(interest).trim())
			.filter(Boolean);

		// Remove duplicates
		const uniqueInterests = [...new Set(selectedInterests)];

		// Only accept interests from our predefined list
		const interests = uniqueInterests.filter((interest) =>
			ALLOWED_INTERESTS.includes(interest)
		);

		// --------------------------------------------------------
		// INTEREST LIMIT
		// --------------------------------------------------------

		if (interests.length > 8) {
			return fail(400, {
				error: 'Please select a maximum of 8 interests.',
				field: 'interests',
				selectedInterests: interests
			});
		}

		// --------------------------------------------------------
		// BASIC VALIDATIONS
		// --------------------------------------------------------

		if (!fullName) {
			return fail(400, {
				error: 'Full name is required',
				field: 'fullName'
			});
		}

		if (!email) {
			return fail(400, {
				error: 'Email is required',
				field: 'email'
			});
		}

		if (!validateEmailFormat(email)) {
			return fail(400, {
				error: 'Please enter a valid email address',
				field: 'email'
			});
		}

		if (await isDisposable(email)) {
			return fail(400, {
				error: 'Disposable email addresses are not allowed',
				field: 'email'
			});
		}

		if (!password || password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters',
				field: 'password'
			});
		}

		// --------------------------------------------------------
		// MX RECORD CHECK
		// --------------------------------------------------------

		const hasMX = await checkMXRecord(email);

		if (!hasMX) {
			return fail(400, {
				error: 'This email domain does not appear to be valid',
				field: 'email'
			});
		}

		// --------------------------------------------------------
		// SUPABASE CLIENT
		// --------------------------------------------------------

		const supabase = createClient(
			PUBLIC_CMS_SUPABASE_URL,
			PUBLIC_CMS_SUPABASE_ANON_KEY
		);

		// --------------------------------------------------------
		// CHECK IF EMAIL ALREADY EXISTS
		// --------------------------------------------------------

		const { data: existing, error: existingError } = await supabase
			.from('profiles')
			.select('id')
			.eq('email', email)
			.maybeSingle();

		if (existingError) {
			console.error(
				'Existing profile check error:',
				existingError
			);
		}

		if (existing) {
			return fail(400, {
				error: 'An account with this email already exists',
				field: 'email'
			});
		}

		// --------------------------------------------------------
		// CREATE AUTH USER
		// --------------------------------------------------------

		const { data: authData, error: authError } =
			await supabase.auth.signUp({
				email,
				password,

				options: {
					data: {
						full_name: fullName,

						// Keep ORCID in Supabase Auth metadata.
						// We are NOT inserting it into profiles
						// because profiles has no orcid_id column.
						orcid_id: orcidId
					},

					emailRedirectTo:
						`${url.origin}/cms/login?verified=true`
				}
			});

		if (authError) {
			return fail(400, {
				error: authError.message,
				field: 'email'
			});
		}

		const user = authData.user;

		// --------------------------------------------------------
		// CREATE PROFILE
		// --------------------------------------------------------

		if (user) {
			const { error: profileError } = await supabase
				.from('profiles')
				.insert([
					{
						id: user.id,
						email,
						full_name: fullName,
						role: 'user',

						// IMPORTANT:
						// Do NOT put orcid_id here.
						// That column does not exist in profiles.

						// Save selected cancer interests
						interests
					}
				]);

			if (profileError) {
				console.error(
					'Profile creation error:',
					profileError
				);

				return fail(500, {
					error:
						'Account was created, but your profile could not be saved. Please contact support.',
					field: 'fullName'
				});
			}
		}

		// --------------------------------------------------------
		// SUCCESS
		// --------------------------------------------------------

		return {
			success: true,
			email
		};
	}
};