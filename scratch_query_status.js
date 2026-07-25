import { createClient } from '@supabase/supabase-js';

const url = 'https://xgkyjboxtrvpgkcbjatp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3lqYm94dHJ2cGdrY2JqYXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ2NzgxNiwiZXhwIjoyMDk4MDQzODE2fQ.VpCjTCgs_E1ksKmN73JpXBy3B2eTThOl_re-aN4wYGY';
const supabase = createClient(url, key);

async function main() {
    console.log("Fetching latest 5 articles:");
    const { data: articles, error: err1 } = await supabase.from('articles').select('id, title, status, review_feedback, is_featured, hidden, created_at').order('created_at', { ascending: false }).limit(5);
    console.log(articles || err1);

    console.log("\nFetching latest 5 research articles:");
    const { data: research, error: err2 } = await supabase.from('research_articles').select('id, title, status, admin_feedback, created_at').order('created_at', { ascending: false }).limit(5);
    console.log(research || err2);
}

main();
