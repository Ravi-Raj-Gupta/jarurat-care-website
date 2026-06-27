import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xgkyjboxtrvpgkcbjatp.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3lqYm94dHJ2cGdrY2JqYXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0Njc4MTYsImV4cCI6MjA5ODA0MzgxNn0.lrog74tbqOlovhdxYT7_VtpVV5SUupRR3syFdMsWR9E"


export const cmsSupabase = createClient(supabaseUrl, supabaseKey)