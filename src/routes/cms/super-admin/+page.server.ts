import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Require admin session
	const session = await locals.getSession();
	if (!session) {
		throw redirect(303, '/cms/login');
	}

	// Fetch the user's profile to check if they are actually an Admin/Super_Admin
	const { data: userProfile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Super_Admin')) {
		// Agar admin nahi hai, toh homepage par bhej do (ya error page)
		throw redirect(303, '/');
	}

	const { data: pendingDoctors, error } = await supabaseAdmin
		.from('profiles')
		.select('*')
		.eq('role', 'Doctor');

	// Fetch all users for the Manage Users tab
	const { data: users, error: usersError } = await supabaseAdmin
		.from('profiles')
		.select('*');

	// Fetch approved or under_review articles waiting for super admin publishing
	const { data: approvedArticles } = await supabaseAdmin
		.from('articles')
		.select('*')
		.in('status', ['approved', 'under_review'])
		.order('created_at', { ascending: false });

	const { data: approvedResearch } = await supabaseAdmin
		.from('research_articles')
		.select('*')
		.in('status', ['approved', 'under_review'])
		.order('created_at', { ascending: false });

	const { data: cmsContents } = await supabaseAdmin
		.from('cms_content')
		.select('*')
		.order('created_at', { ascending: false });

	console.log("SUPER ADMIN QUERY:", { pendingDoctors, error });

	if (error || usersError) {
		console.error("Error fetching data:", error || usersError);
		return { pendingDoctors: [], users: [], approvedArticles: [], approvedResearch: [], cmsContents: [] };
	}

	return { 
		pendingDoctors: pendingDoctors || [],
		users: users || [],
		approvedArticles: approvedArticles || [],
		approvedResearch: approvedResearch || [],
		cmsContents: cmsContents || []
	};
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single();
		if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Super_Admin')) return fail(403, { message: 'Forbidden' });

		const formData = await request.formData();
		const doctorId = formData.get('doctorId') as string;
		const assignedRole = formData.get('assignedRole') as string;

		if (!doctorId) return fail(400, { message: 'Missing doctor ID' });

		// Default permissions
		let updateData: any = { verification_status: 'approved' };
		
		if (assignedRole === 'author') {
			updateData.is_author = true;
			updateData.is_reviewer = false;
		} else if (assignedRole === 'reviewer') {
			updateData.is_author = true;
			updateData.is_reviewer = true;
		}

		const { error } = await supabaseAdmin
			.from('profiles')
			.update(updateData)
			.eq('id', doctorId);

		if (error) {
			console.error("Error approving doctor:", error);
			return fail(500, { message: 'Could not approve doctor' });
		}
		
		return { success: true };
	},

	reject: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single();
		if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Super_Admin')) return fail(403, { message: 'Forbidden' });

		const formData = await request.formData();
		const doctorId = formData.get('doctorId') as string;

		if (!doctorId) return fail(400, { message: 'Missing doctor ID' });

		const { error } = await supabaseAdmin
			.from('profiles')
			.update({ verification_status: 'rejected' })
			.eq('id', doctorId);

		if (error) {
			console.error("Error rejecting doctor:", error);
			return fail(500, { message: 'Could not reject doctor' });
		}
		
		return { success: true };
	},

	updateRole: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single();
		if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Super_Admin')) return fail(403, { message: 'Forbidden' });

		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const newRole = formData.get('newRole') as string;

		if (!userId || !newRole) return fail(400, { message: 'Missing userId or newRole' });

		const { error } = await supabaseAdmin
			.from('profiles')
			.update({ role: newRole })
			.eq('id', userId);

		if (error) {
			console.error("Error updating user role:", error);
			return fail(500, { message: 'Could not update role' });
		}
		
		return { success: true };
	},

	publishContent: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session) return fail(401, { message: 'Unauthorized' });
		const { data: userProfile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single();
		if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Super_Admin')) return fail(403, { message: 'Forbidden' });

		const formData = await request.formData();
		const articleId = formData.get('articleId') as string;
		const articleType = formData.get('articleType') as string;

		if (!articleId || !articleType) return fail(400, { message: 'Missing parameters' });

		const table = articleType === 'research' ? 'research_articles' : 'articles';

		const { error } = await supabaseAdmin
			.from(table)
			.update({ 
				status: 'published'
			})
			.eq('id', articleId);

		if (error) {
			console.error("Error publishing content:", error);
			return fail(500, { message: 'Could not publish content' });
		}
		
		return { success: true };
	}
};