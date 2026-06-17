import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xsxlgsqniqaouedceejn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzeGxnc3FuaXFhb3VlZGNlZWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjM0MDEsImV4cCI6MjA5NjEzOTQwMX0.6THlfnIJuObVY6Gi2qsgJdWKfwTjpBdnsNOHpkJPYD0"

export const cmsSupabase = createClient(supabaseUrl, supabaseKey)