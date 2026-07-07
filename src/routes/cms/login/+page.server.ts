import { ORCID_CLIENT_ID, ORCID_REDIRECT_URI } from '$env/static/private';

export const load = async () => {
	// Pass ORCID auth URL to page
	const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${encodeURIComponent(ORCID_REDIRECT_URI)}`;
	return { orcidAuthUrl };
};
