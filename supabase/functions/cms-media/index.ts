import { createClient } from "@supabase/supabase-js";
import { createMediaHandler } from "../_shared/media.ts";

const client = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
Deno.serve(createMediaHandler(client));
