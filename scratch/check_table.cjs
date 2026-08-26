const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
	const match = line.match(/^([^=]+)=(.*)$/);
	if (match) envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
});

const supabase = createClient(envVars.PUBLIC_CMS_SUPABASE_URL || envVars.PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('research_article_comments').select('id').limit(1).then(({ error }) => {
	if (error) {
		console.log('Error:', error.message);
	} else {
		console.log('Table exists!');
	}
});
