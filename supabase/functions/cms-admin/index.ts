import { createClient } from "@supabase/supabase-js";
import { createAdminHandler } from "../_shared/admin.ts";

const client = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
Deno.serve(createAdminHandler(client));
