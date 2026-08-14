import { supabaseAdmin } from '$lib/supabaseAdmin';

export async function getSuperAdminAnalytics() {
	try {
		// =====================================================
		// USERS
		// =====================================================

		const { data: users } = await supabaseAdmin
			.from('profiles')
			.select('id, role');

		const allUsers = users || [];

		const totalUsers = allUsers.length;

		const totalDoctors = allUsers.filter(
			(user) => user.role === 'Doctor'
		).length;

		const totalReaders = allUsers.filter(
			(user) => user.role === 'Reader'
		).length;

		const totalAdmins = allUsers.filter(
			(user) =>
				user.role === 'Admin' ||
				user.role === 'Super_Admin'
		).length;

		// =====================================================
		// CONTENT COUNTS
		// =====================================================

		const { data: articles } = await supabaseAdmin
			.from('articles')
			.select(
				'id, title, category, views, likes_count, saves_count, created_at, cover_image_url, author_id'
			);

		const { data: researchArticles } =
			await supabaseAdmin
				.from('research_articles')
				.select(
					'id, title, created_at, author_id'
				);

		const { data: cmsContent } =
			await supabaseAdmin
				.from('cms_content')
				.select(
					'id, title, content_type, created_at'
				);

		const allArticles = articles || [];
		const allResearch = researchArticles || [];
		const allCMSContent = cmsContent || [];

		const totalArticles = allArticles.length;

		const totalResearchPapers =
			allResearch.length;

		const totalCMSContent =
			allCMSContent.length;

		// =====================================================
		// ANALYTICS EVENTS
		// =====================================================

		const { data: events, error: eventsError } =
			await supabaseAdmin
				.from('analytics_events')
				.select(
					'id, user_id, event_type, content_id, content_type, session_id, created_at'
				)
				.order('created_at', {
					ascending: true
				});

		if (eventsError) {
			console.error(
				'Analytics events error:',
				eventsError
			);
		}

		const analyticsEvents = events || [];

		// =====================================================
		// EVENT COUNTS
		// =====================================================

		const totalViews =
			analyticsEvents.filter(
				(event) =>
					event.event_type === 'view'
			).length;

		const totalLikes =
			analyticsEvents.filter(
				(event) =>
					event.event_type === 'like'
			).length;

		const totalSaves =
			analyticsEvents.filter(
				(event) =>
					event.event_type === 'save'
			).length;

		const totalShares =
			analyticsEvents.filter(
				(event) =>
					event.event_type === 'share'
			).length;

		const totalDownloads =
			analyticsEvents.filter(
				(event) =>
					event.event_type === 'download'
			).length;

		// =====================================================
		// UNIQUE VISITORS
		// =====================================================

		const uniqueSessionIds =
			new Set(
				analyticsEvents
					.map(
						(event) =>
							event.session_id
					)
					.filter(Boolean)
			);

		const uniqueVisitors =
			uniqueSessionIds.size;

		// =====================================================
		// DAILY ACTIVE USERS
		// =====================================================

		const dailyUsersMap =
			new Map<string, Set<string>>();

		analyticsEvents.forEach((event) => {
			if (!event.user_id) return;

			const date =
				new Date(
					event.created_at
				)
					.toISOString()
					.split('T')[0];

			if (!dailyUsersMap.has(date)) {
				dailyUsersMap.set(
					date,
					new Set()
				);
			}

			dailyUsersMap
				.get(date)!
				.add(event.user_id);
		});

		const dailyActiveUsers =
			Array.from(
				dailyUsersMap.entries()
			)
				.map(
					([date, users]) => ({
						date,
						users: users.size
					})
				)
				.sort((a, b) =>
					a.date.localeCompare(
						b.date
					)
				);

		// =====================================================
		// POPULAR CONTENT
		// =====================================================

		const contentStats = new Map<
			string,
			{
				id: string;
				title: string;
				type: string;
				views: number;
				likes: number;
				saves: number;
				shares: number;
				downloads: number;
			}
		>();

		// -----------------------------
		// Articles
		// -----------------------------

		allArticles.forEach((article) => {
			contentStats.set(article.id, {
				id: article.id,
				title:
					article.title ||
					'Untitled Article',
				type: 'Article',
				views: 0,
				likes: 0,
				saves: 0,
				shares: 0,
				downloads: 0
			});
		});

		// -----------------------------
		// Research Papers
		// -----------------------------

		allResearch.forEach((research) => {
			contentStats.set(research.id, {
				id: research.id,
				title:
					research.title ||
					'Untitled Research Paper',
				type: 'Research Paper',
				views: 0,
				likes: 0,
				saves: 0,
				shares: 0,
				downloads: 0
			});
		});

		// -----------------------------
		// Apply events
		// -----------------------------

		analyticsEvents.forEach((event) => {
			if (!event.content_id) return;

			const content =
				contentStats.get(
					event.content_id
				);

			if (!content) return;

			switch (event.event_type) {
				case 'view':
					content.views++;
					break;

				case 'like':
					content.likes++;
					break;

				case 'save':
					content.saves++;
					break;

				case 'share':
					content.shares++;
					break;

				case 'download':
					content.downloads++;
					break;
			}
		});

		const mostPopularContent =
			Array.from(
				contentStats.values()
			)
				.map((content) => ({
					...content,
					engagement:
						content.views +
						content.likes +
						content.saves +
						content.shares +
						content.downloads
				}))
				.sort(
					(a, b) =>
						b.engagement -
						a.engagement
				)
				.slice(0, 10);

		// =====================================================
		// ENGAGEMENT TREND
		// =====================================================

		const trendMap = new Map<
			string,
			{
				views: number;
				likes: number;
				saves: number;
				shares: number;
				downloads: number;
				comments: number;
			}
		>();

		analyticsEvents.forEach((event) => {
			const date =
				new Date(
					event.created_at
				)
					.toISOString()
					.split('T')[0];

			if (!trendMap.has(date)) {
				trendMap.set(date, {
					views: 0,
					likes: 0,
					saves: 0,
					shares: 0,
					downloads: 0,
					comments: 0
				});
			}

			const day =
				trendMap.get(date)!;

			switch (event.event_type) {
				case 'view':
					day.views++;
					break;

				case 'like':
					day.likes++;
					break;

				case 'save':
					day.saves++;
					break;

				case 'share':
					day.shares++;
					break;

				case 'download':
					day.downloads++;
					break;
			}
		});

		// =====================================================
		// COMMENTS
		// =====================================================

		const { data: comments } =
			await supabaseAdmin
				.from('article_comments')
				.select(
					'id, created_at'
				);

		const allComments =
			comments || [];

		const totalComments =
			allComments.length;

		allComments.forEach(
			(comment) => {
				const date =
					new Date(
						comment.created_at
					)
						.toISOString()
						.split('T')[0];

				if (!trendMap.has(date)) {
					trendMap.set(
						date,
						{
							views: 0,
							likes: 0,
							saves: 0,
							shares: 0,
							downloads: 0,
							comments: 0
						}
					);
				}

				trendMap
					.get(date)!
					.comments++;
			}
		);

		const engagementTrend =
			Array.from(
				trendMap.entries()
			)
				.map(
					([date, values]) => ({
						date,
						...values
					})
				)
				.sort((a, b) =>
					a.date.localeCompare(
						b.date
					)
				);

		// =====================================================
		// TOTAL ENGAGEMENT
		// =====================================================

		const totalEngagement =
			totalLikes +
			totalSaves +
			totalShares +
			totalDownloads +
			totalComments;

		// =====================================================
		// RESULT
		// =====================================================

		return {
			totalUsers,
			totalDoctors,
			totalReaders,
			totalAdmins,

			totalArticles,
			totalResearchPapers,
			totalCMSContent,

			totalViews,
			uniqueVisitors,

			totalLikes,
			totalSaves,
			totalShares,
			totalDownloads,

			totalComments,
			totalEngagement,

			dailyActiveUsers,

			mostPopularContent,

			engagementTrend
		};
	} catch (error) {
		console.error(
			'Super Admin Analytics Error:',
			error
		);

		return {
			totalUsers: 0,
			totalDoctors: 0,
			totalReaders: 0,
			totalAdmins: 0,

			totalArticles: 0,
			totalResearchPapers: 0,
			totalCMSContent: 0,

			totalViews: 0,
			uniqueVisitors: 0,

			totalLikes: 0,
			totalSaves: 0,
			totalShares: 0,
			totalDownloads: 0,

			totalComments: 0,
			totalEngagement: 0,

			dailyActiveUsers: [],

			mostPopularContent: [],

			engagementTrend: []
		};
	}
}