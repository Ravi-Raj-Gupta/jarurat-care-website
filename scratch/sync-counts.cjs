const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function syncCounts() {
	// Parse .env manually
	const envContent = fs.readFileSync('.env', 'utf-8');
	const envVars = {};
	envContent.split('\n').forEach(line => {
		const match = line.match(/^([^=]+)=(.*)$/);
		if (match) {
			envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
		}
	});

	const supabaseUrl = envVars.PUBLIC_CMS_SUPABASE_URL || envVars.PUBLIC_SUPABASE_URL;
	const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseKey) {
		console.error("Missing Supabase credentials in .env");
		return;
	}

	const supabase = createClient(supabaseUrl, supabaseKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});

	console.log("Starting database cleanup for views...\n");

	// ==========================================
	// 1. ARTICLES
	// ==========================================
	console.log("Fetching all standard articles...");
	const { data: articles, error: articlesError } = await supabase.from('articles').select('id, title, views');
	
	if (articlesError) {
		console.error("Error fetching articles:", articlesError);
	} else if (articles && articles.length > 0) {
		console.log(`Found ${articles.length} articles. Verifying and syncing views...`);
		
		for (const article of articles) {
			const { count: actualViews } = await supabase.from('analytics_events')
				.select('*', { count: 'exact', head: true })
				.eq('content_id', article.id)
				.eq('event_type', 'view');
			
			const newViews = actualViews || 0;
			
			if (article.views !== newViews) {
				console.log(`- Updating "${article.title.substring(0, 30)}..." | Views: ${article.views} -> ${newViews}`);
				await supabase.from('articles').update({ views: newViews }).eq('id', article.id);
			}
		}
	} else {
		console.log("No standard articles found.");
	}

	console.log("\n-----------------------------------\n");

	// ==========================================
	// 2. RESEARCH ARTICLES
	// ==========================================
	console.log("Fetching all research articles...");
	const { data: researchArticles, error: researchError } = await supabase.from('research_articles').select('id, title, views_count');
	
	if (researchError) {
		console.error("Error fetching research articles:", researchError);
	} else if (researchArticles && researchArticles.length > 0) {
		console.log(`Found ${researchArticles.length} research articles. Verifying and syncing views...`);
		
		for (const article of researchArticles) {
			const { count: actualViews } = await supabase.from('analytics_events')
				.select('*', { count: 'exact', head: true })
				.eq('content_id', article.id)
				.eq('event_type', 'view');
			
			const newViews = actualViews || 0;
			
			if (article.views_count !== newViews) {
				console.log(`- Updating "${article.title.substring(0, 30)}..." | Views: ${article.views_count} -> ${newViews}`);
				await supabase.from('research_articles').update({ views_count: newViews }).eq('id', article.id);
			}
		}
	} else {
		console.log("No research articles found.");
	}

	console.log("\nDatabase cleanup complete!");
}

syncCounts().catch(console.error);
