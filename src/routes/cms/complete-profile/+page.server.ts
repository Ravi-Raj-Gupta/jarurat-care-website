import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';
 
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
 
	if (!session) {
		throw redirect(303, '/cms/login');
	}
 
	const { data: profile, error } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.maybeSingle();
 
	if (error) {
		console.error('Error loading profile:', error);
	}
 
	return {
		profile: profile ?? null,
		userId: session.user.id,
		userEmail: session.user.email ?? ''
	};
};
 
function extractFormData(formData: FormData) {
	const role = formData.get('role') as string;
 
	const common = {
		full_name: (formData.get('fullName') as string) ?? '',
		email: (formData.get('email') as string) ?? '',
		bio: (formData.get('bio') as string) ?? '',
		role,
		email_notifications: formData.get('emailNotifications') === 'on',
		newsletters: formData.get('newsletters') === 'on',
		event_updates: formData.get('eventUpdates') === 'on'
	};
 
	if (role === 'Reader') {
		return {
			...common,
			profession: (formData.get('profession') as string) ?? '',
			location: (formData.get('location') as string) ?? '',
			organization: (formData.get('organization') as string) ?? '',
			interests: formData.getAll('interests') as string[]
		};
	}
 
	return {
		...common,
		qualification: (formData.get('qualification') as string) ?? '',
		designation: (formData.get('designation') as string) ?? '',
		specialization: (formData.get('specialization') as string) ?? '',
		affiliation: (formData.get('affiliation') as string) ?? '',
		medical_reg_id: (formData.get('medicalRegId') as string) ?? '',
		city_state: (formData.get('cityState') as string) ?? '',
		experience: (formData.get('experience') as string) ?? '',
		patients_treated: (formData.get('patientsTreated') as string) ?? '',
		publications: (formData.get('publications') as string) ?? '',
		awards: (formData.get('awards') as string) ?? '',
		citations: (formData.get('citations') as string) ?? '',
		expertise: formData.getAll('expertise') as string[],
		is_confirmed: formData.get('isConfirmed') === 'on'
	};
}
 
export const actions: Actions = {
	save: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Not logged in' });
 
		const formData = await request.formData();
		const profileData = extractFormData(formData);
 
		const { error } = await supabaseAdmin
			.from('profiles')
			.upsert(
				{ id: session.user.id, ...profileData, profile_completed: false },
				{ onConflict: 'id' }
			);
 
		if (error) {
			console.error('Save draft error:', error);
			return fail(500, { message: 'Could not save draft. Please try again.' });
		}
 
		return { success: true, draft: true };
	},
 
	submit: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Not logged in' });
 
		const formData = await request.formData();
		const profileData = extractFormData(formData);
 
		if (profileData.role === 'Doctor' && !('is_confirmed' in profileData ? profileData.is_confirmed : false)) {
			return fail(400, {
				message: 'Please confirm your details are accurate before submitting.'
			});
		}
 
		const verification_status = profileData.role === 'Doctor' ? 'pending' : 'approved';
 
		const { error } = await supabaseAdmin
			.from('profiles')
			.upsert(
				{
					id: session.user.id,
					...profileData,
					profile_completed: true,
					verification_status
				},
				{ onConflict: 'id' }
			);
 
		if (error) {
			console.error('Submit error:', error);
			return fail(500, { message: 'Could not submit profile. Please try again.' });
		}
 
		throw redirect(303, '/dashboard');
	}
};
