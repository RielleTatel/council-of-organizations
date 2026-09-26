import { createClient } from "@supabase/supabase-js";

const env =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {};
export const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const publishableKey =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "";
function configure() {
  if (Boolean(supabaseUrl) !== Boolean(publishableKey))
    return {
      client: null,
      error:
        "Set both VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to connect the CMS.",
    };
  try {
    return {
      client:
        supabaseUrl && publishableKey
          ? createClient(supabaseUrl, publishableKey)
          : null,
      error: null,
    };
  } catch {
    return {
      client: null,
      error: "Check that VITE_SUPABASE_URL is a valid project URL.",
    };
  }
}
const configuration = configure();
export const supabase = configuration.client;
export const configurationError = configuration.error;
export function requireSupabase() {
  if (!supabase)
    throw new Error(
      configurationError ??
        "Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your environment to connect the CMS.",
    );
  return supabase;
}
