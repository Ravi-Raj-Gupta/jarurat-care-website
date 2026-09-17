const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xgkyjboxtrvpgkcbjatp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3lqYm94dHJ2cGdrY2JqYXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ2NzgxNiwiZXhwIjoyMDk4MDQzODE2fQ.VpCjTCgs_E1ksKmN73JpXBy3B2eTThOl_re-aN4wYGY';

const supabase = createClient(supabaseUrl, supabaseKey);

const wordBlock = 'This is a test research paper content to satisfy the three thousand words requirement. ';
let longContent = '';
for (let i = 0; i < 260; i++) {
    longContent += wordBlock;
}

async function run() {
  const emails = [
    'hajejoqy@fxzig.com',
    'balaximu@denipl.net',
    'nehif70246@archifun.com',
    'lsetyn2128@minitts.net'
  ];

  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('email', emails);

  if (pError) {
    console.error('Error fetching profiles:', pError);
    return;
  }

  console.log('Found profiles:', profiles.length);

  const insertData = [];

  for (const profile of profiles) {
    for (let i = 1; i <= 3; i++) {
      insertData.push({
        user_id: profile.id,
        title: `Clinical Research Paper ${i} by ${profile.full_name}`,
        subtitle: `A comprehensive study on medical findings ${i}`,
        authors_and_affiliations: profile.full_name,
        abstract: `This is an abstract for research paper ${i}. It discusses various medical findings.`,
        introduction: longContent,
        methods: 'We conducted a series of tests.',
        results: 'The results were positive.',
        discussion: longContent,
        conclusion: 'In conclusion, the findings are significant.',
        references_text: '1. Test Reference A\n2. Test Reference B',
        keywords: 'Cancer, Research, Test',
        status: 'under_review'
      });
    }
  }

  const { data, error } = await supabase
    .from('research_articles')
    .insert(insertData)
    .select('id');

  if (error) {
    console.error('Error inserting research papers:', error);
  } else {
    console.log(`Successfully inserted ${data.length} research papers.`);
  }
}
run();
