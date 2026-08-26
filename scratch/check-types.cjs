const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
	const match = line.match(/^([^=]+)=(.*)$/);
	if (match) envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
});

const supabase = createClient(envVars.PUBLIC_CMS_SUPABASE_URL || envVars.PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('cms_content').select('content_type').then(({data}) => {
	if (data) {
		const uniqueTypes = [...new Set(data.map(d => d.content_type))];
		console.log("Types in cms_content:", uniqueTypes);
	}
});
