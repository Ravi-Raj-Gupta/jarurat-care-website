import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  "https://xgkyjboxtrvpgkcbjatp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3lqYm94dHJ2cGdrY2JqYXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ2NzgxNiwiZXhwIjoyMDk4MDQzODE2fQ.VpCjTCgs_E1ksKmN73JpXBy3B2eTThOl_re-aN4wYGY"
);