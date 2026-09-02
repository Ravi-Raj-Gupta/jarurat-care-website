import { env } from '$env/dynamic/private';

export const load = async () => {
	// Dynamically generate the ORCID auth URL
	const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${env.ORCID_CLIENT_ID || ''}&response_type=code&scope=/authenticate&redirect_uri=${encodeURIComponent(env.ORCID_REDIRECT_URI || '')}`;
	return { orcidAuthUrl };
};
