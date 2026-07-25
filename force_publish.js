import { createClient } from '@supabase/supabase-js';

const url = 'https://xgkyjboxtrvpgkcbjatp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3lqYm94dHJ2cGdrY2JqYXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ2NzgxNiwiZXhwIjoyMDk4MDQzODE2fQ.VpCjTCgs_E1ksKmN73JpXBy3B2eTThOl_re-aN4wYGY';
const supabase = createClient(url, key);

async function main() {
    console.log("Force publishing all legacy articles...");
    const { error: err1 } = await supabase.from('articles').update({ status: 'published' }).neq('status', 'published');
    if (err1) console.error("Error updating articles:", err1);
    else console.log("Legacy articles published.");

    console.log("Force publishing all research articles...");
    const { error: err2 } = await supabase.from('research_articles').update({ status: 'published' }).neq('status', 'published');
    if (err2) console.error("Error updating research articles:", err2);
    else console.log("Research articles published.");
}

main();
