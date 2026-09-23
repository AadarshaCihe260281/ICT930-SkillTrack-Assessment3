import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.");
}

// Server-side client. The service-role key must NEVER be exposed to the browser.
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function connectDB() {
  const { error } = await supabase.from("courses").select("id").limit(1);
  if (error) throw new Error(`Supabase connection failed: ${error.message}`);
  console.log("Supabase PostgreSQL connected");
}

export default supabase;
