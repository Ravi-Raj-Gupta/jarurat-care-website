import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseAdmin';
import type { PageServerLoad } from './$types';

type DoctorPerson = {
	id: string;
	name: string;
	specialization: string | null;
	organization: string | null;
	avatar: string | null;
};

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();
	const searchQuery = url.searchParams.get('q');

	if (!session) {
		throw redirect(303, '/cms/login');
	}

	const currentUserId = session.user.id;

	// =========================================================
	// PROFILE
	// =========================================================

	const { data: profile, error: profileError } =
		await supabaseAdmin
			.from('profiles')
			.select('*')
			.eq('id', currentUserId)
			.maybeSingle();

	if (profileError || !profile) {
		console.error('Error loading profile:', profileError);
		throw redirect(303, '/cms/login');
	}

	// Readers should never reach this page
	if (profile.role !== 'Doctor') {
		throw redirect(303, '/cms/login');
	}

	// Only approved doctors
	if (profile.verification_status !== 'approved') {
		throw redirect(303, '/cms/pending');
	}

	// =========================================================
	// ARTICLES
	// =========================================================

	let articlesQuery = supabaseAdmin
		.from('articles')
		.select('id, title, status, views, created_at')
		.eq('author_id', currentUserId)
		.order('created_at', { ascending: false });
		
	if (searchQuery) {
		articlesQuery = articlesQuery.ilike('title', `%${searchQuery}%`);
	}

	const {
		data: articles,
		error: articlesError
	} = await articlesQuery;

	if (articlesError) {
		console.error(
			'Error loading articles:',
			articlesError
		);
	}

	const allArticles = articles ?? [];

	// =========================================================
	// RESEARCH PAPERS
	// =========================================================

	let researchQuery = supabaseAdmin
		.from('research_articles')
		.select(
			'id, title, status, views_count, created_at'
		)
		.eq('user_id', currentUserId)
		.order('created_at', { ascending: false });

	if (searchQuery) {
		researchQuery = researchQuery.ilike('title', `%${searchQuery}%`);
	}

	const {
		data: researchPapersData,
		error: researchError
	} = await researchQuery;

	if (researchError) {
		console.error(
			'Error loading research papers:',
			researchError
		);
	}

	const allResearchPapers =
		researchPapersData ?? [];

	// =========================================================
	// STATS
	// =========================================================

	const stats = {
		published:
			allArticles.filter(
				(a) => a.status === 'published'
			).length +
			allResearchPapers.filter(
				(r) => r.status === 'published'
			).length,

		draft:
			allArticles.filter(
				(a) => a.status === 'draft'
			).length +
			allResearchPapers.filter(
				(r) => r.status === 'draft'
			).length,

		pendingReview:
			allArticles.filter(
				(a) => a.status === 'under_review'
			).length +
			allResearchPapers.filter(
				(r) => r.status === 'under_review'
			).length,

		views:
			allArticles.reduce(
				(sum, a) =>
					sum + (a.views ?? 0),
				0
			) +
			allResearchPapers.reduce(
				(sum, r) =>
					sum + (r.views_count ?? 0),
				0
			),

		bookmarks: 0,
		likes: 0
	};

	// =========================================================
	// BOOKMARKS + LIKES
	// =========================================================

	const articleIds =
		allArticles.map((a) => a.id);

	const researchIds =
		allResearchPapers.map((r) => r.id);

	const allItemIds = [
		...articleIds,
		...researchIds
	];

	if (allItemIds.length > 0) {
		const {
			count: bookmarkCount,
			error: bookmarkError
		} = await supabaseAdmin
			.from('saved_articles')
			.select('id', {
				count: 'exact',
				head: true
			})
			.in(
				'article_id',
				allItemIds
			);

		if (bookmarkError) {
			console.error(
				'Error loading bookmark count:',
				bookmarkError
			);
		} else {
			stats.bookmarks =
				bookmarkCount ?? 0;
		}

		const {
			count: likeCount,
			error: likeError
		} = await supabaseAdmin
			.from('article_likes')
			.select('id', {
				count: 'exact',
				head: true
			})
			.in(
				'article_id',
				allItemIds
			);

		if (likeError) {
			console.error(
				'Error loading like count:',
				likeError
			);
		} else {
			stats.likes =
				likeCount ?? 0;
		}
	}

	// =========================================================
	// NOTIFICATIONS
	// =========================================================

	const {
		data: notifications,
		error: notificationsError
	} = await supabaseAdmin
		.from('notifications')
		.select(
			'id, title, message, link, is_read, created_at'
		)
		.eq('user_id', currentUserId)
		.order('created_at', {
			ascending: false
		})
		.limit(5);

	if (notificationsError) {
		console.error(
			'Error loading notifications:',
			notificationsError
		);
	}

	const {
		count: unreadCount
	} = await supabaseAdmin
		.from('notifications')
		.select('id', {
			count: 'exact',
			head: true
		})
		.eq('user_id', currentUserId)
		.eq('is_read', false);

	// =========================================================
	// COMMUNITY
	// =========================================================

	let followingDoctors: DoctorPerson[] = [];
	let followerDoctors: DoctorPerson[] = [];

	/*
	 * We read BOTH relationship tables.
	 *
	 * doctor_followers:
	 *   follower_id -> current doctor
	 *   doctor_id   -> another doctor
	 *
	 * doctor_follows:
	 *   follower_id -> current doctor
	 *   doctor_id   -> another doctor
	 *
	 * This protects the dashboard if different parts of the
	 * application currently use different tables.
	 */

	const [
		{ data: followingFollowerRows, error: followingFollowerError },
		{ data: followingFollowRows, error: followingFollowError },
		{ data: followerFollowerRows, error: followerFollowerError },
		{ data: followerFollowRows, error: followerFollowError }
	] = await Promise.all([
		// People this doctor follows - doctor_followers
		supabaseAdmin
			.from('doctor_followers')
			.select('doctor_id')
			.eq('follower_id', currentUserId),

		// People this doctor follows - doctor_follows
		supabaseAdmin
			.from('doctor_follows')
			.select('doctor_id')
			.eq('follower_id', currentUserId),

		// People following this doctor - doctor_followers
		supabaseAdmin
			.from('doctor_followers')
			.select('follower_id')
			.eq('doctor_id', currentUserId),

		// People following this doctor - doctor_follows
		supabaseAdmin
			.from('doctor_follows')
			.select('follower_id')
			.eq('doctor_id', currentUserId)
	]);

	if (followingFollowerError) {
		console.error(
			'doctor_followers following query error:',
			followingFollowerError
		);
	}

	if (followingFollowError) {
		console.error(
			'doctor_follows following query error:',
			followingFollowError
		);
	}

	if (followerFollowerError) {
		console.error(
			'doctor_followers followers query error:',
			followerFollowerError
		);
	}

	if (followerFollowError) {
		console.error(
			'doctor_follows followers query error:',
			followerFollowError
		);
	}

	// =========================================================
	// UNIQUE IDs
	// =========================================================

	const followingIds = [
		...(followingFollowerRows ?? []).map(
			(row) => row.doctor_id
		),
		...(followingFollowRows ?? []).map(
			(row) => row.doctor_id
		)
	].filter(
		(id): id is string =>
			Boolean(id) &&
			id !== currentUserId
	);

	const followerIds = [
		...(followerFollowerRows ?? []).map(
			(row) => row.follower_id
		),
		...(followerFollowRows ?? []).map(
			(row) => row.follower_id
		)
	].filter(
		(id): id is string =>
			Boolean(id) &&
			id !== currentUserId
	);

	const uniqueFollowingIds = [
		...new Set(followingIds)
	];

	const uniqueFollowerIds = [
		...new Set(followerIds)
	];

	// =========================================================
	// LOAD FOLLOWING DOCTORS
	// =========================================================

	if (uniqueFollowingIds.length > 0) {
		const {
			data: doctorsData,
			error: doctorsError
		} = await supabaseAdmin
			.from('profiles')
			.select(
				'id, full_name, specialization, organization'
			)
			.in(
				'id',
				uniqueFollowingIds
			);

		if (doctorsError) {
			console.error(
				'Error loading following doctors:',
				doctorsError
			);
		}

		followingDoctors =
			(doctorsData ?? []).map(
				(doc) => ({
					id: doc.id,
					name:
						doc.full_name ||
						'Doctor',
					specialization:
						doc.specialization ??
						null,
					organization:
						doc.organization ??
						null,
					avatar: null
				})
			);
	}

	// =========================================================
	// LOAD FOLLOWERS
	// =========================================================

	if (uniqueFollowerIds.length > 0) {
		const {
			data: followersData,
			error: followersError
		} = await supabaseAdmin
			.from('profiles')
			.select(
				'id, full_name, specialization, organization'
			)
			.in(
				'id',
				uniqueFollowerIds
			);

		if (followersError) {
			console.error(
				'Error loading followers:',
				followersError
			);
		}

		followerDoctors =
			(followersData ?? []).map(
				(doc) => ({
					id: doc.id,
					name:
						doc.full_name ||
						'Doctor',
					specialization:
						doc.specialization ??
						null,
					organization:
						doc.organization ??
						null,
					avatar: null
				})
			);
	}

	console.log(
		'Community:',
		{
			followingCount:
				followingDoctors.length,
			followersCount:
				followerDoctors.length,
			followingIds:
				uniqueFollowingIds,
			followerIds:
				uniqueFollowerIds
		}
	);

	// =========================================================
	// REVIEWER DATA
	// =========================================================

	let pendingArticles: any[] = [];
	let pendingResearch: any[] = [];

	if (profile.is_reviewer) {
		const [
			{
				data: pendingArtData,
				error: artErr
			},
			{
				data: pendingResData,
				error: resErr
			}
		] = await Promise.all([
			supabaseAdmin
				.from('articles')
				.select(
					'id, title, created_at, author_name_credentials'
				)
				.eq(
					'status',
					'under_review'
				),

			supabaseAdmin
				.from('research_articles')
				.select(
					'id, title, created_at, authors_and_affiliations'
				)
				.eq(
					'status',
					'under_review'
				)
		]);

		if (artErr) {
			console.error(
				'Error loading pending articles:',
				artErr
			);
		}

		if (resErr) {
			console.error(
				'Error loading pending research:',
				resErr
			);
		}

		pendingArticles =
			(pendingArtData ?? []).map(
				(a) => ({
					...a,
					author_name:
						a.author_name_credentials ||
						'Unknown Author'
				})
			);

		pendingResearch =
			(pendingResData ?? []).map(
				(r) => ({
					...r,
					author_name:
						r.authors_and_affiliations ||
						'Unknown Researcher'
				})
			);
	}

	// =========================================================
	// RETURN
	// =========================================================

	return {
		profile,
		stats,

		articles: allArticles,

		researchPapers:
			allResearchPapers,

		pendingArticles,
		pendingResearch,

		notifications:
			notifications ?? [],

		unreadCount:
			unreadCount ?? 0,

		// IMPORTANT
		// These are the two arrays the Svelte page will use.
		followingDoctors,
		followerDoctors,

		// Counts also returned separately
		followingCount:
			followingDoctors.length,

		followerCount:
			followerDoctors.length
	};
};