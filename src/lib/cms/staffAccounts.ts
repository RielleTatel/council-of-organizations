import { FunctionsHttpError, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabase } from "./client";

type StaffAccountAction =
  | { action: "create_staff"; email: string; password: string; role: "editor" | "owner" }
  | { action: "add_existing_staff"; email: string; role: "editor" | "owner" }
  | { action: "set_password"; userId: string; password: string };

export async function saveStaffAccount(
  body: StaffAccountAction,
  client: SupabaseClient = requireSupabase(),
) {
  const { data, error } = await client.functions.invoke("cms-admin", { body });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const response = await error.context.json().catch(() => null);
      if (typeof response?.error === "string") throw new Error(response.error);
    }
    throw error;
  }
  if (data?.error) throw new Error(data.error);
  if (body.action === "set_password" ? data?.passwordUpdated !== true : data?.created !== true)
    throw new Error("The account update was not confirmed. Refresh the staff list before retrying.");
}
