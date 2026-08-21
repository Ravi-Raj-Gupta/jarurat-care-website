import { createClient } from '@supabase/supabase-js';

const cmsSupabase = createClient(
  'https://xgkyjboxtrvpgkcbjatp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3lqYm94dHJ2cGdrY2JqYXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ2NzgxNiwiZXhwIjoyMDk4MDQzODE2fQ.VpCjTCgs_E1ksKmN73JpXBy3B2eTThOl_re-aN4wYGY'
);

async function checkViews() {
  const { data: cms } = await cmsSupabase.from('cms_content').select('*').limit(1).single();
  console.log('CMS columns:', cms ? Object.keys(cms) : 'None');

  const { data: arts } = await cmsSupabase.from('articles').select('*').limit(1).single();
  console.log('Articles columns:', arts ? Object.keys(arts) : 'None');

  const { data: res } = await cmsSupabase.from('research_articles').select('*').limit(1).single();
  console.log('Research columns:', res ? Object.keys(res) : 'None');
}

checkViews();
