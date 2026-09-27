import type { SupabaseClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};
export function createAdminHandler(client: SupabaseClient) {
  const respond = (value: unknown, status = 200) =>
    Response.json(value, { status, headers: cors });
  return async function handle(request: Request): Promise<Response> {
    if (request.method === "OPTIONS")
      return new Response(null, { headers: cors });
    if (request.method !== "POST") return respond({ error: "Use POST." }, 405);
    const token = request.headers
      .get("Authorization")
      ?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) return respond({ error: "Sign in to continue." }, 401);
    try {
      const user = await client.auth.getUser(token);
      if (user.error || !user.data.user)
        return respond({ error: "Your session is invalid." }, 401);
      const staff = await client
        .from("cms_staff")
        .select("role,active")
        .eq("user_id", user.data.user.id)
        .maybeSingle();
      if (staff.error) throw staff.error;
      if (!staff.data?.active || staff.data.role !== "owner")
        return respond({ error: "Only active owners can manage staff accounts." }, 403);
      const body = await request.json().catch(() => null);
      if (!body || !["create_staff", "add_existing_staff", "set_password"].includes(body.action))
        return respond({ error: "Choose a valid staff account action." }, 400);
      const password = typeof body.password === "string" ? body.password : "";
      if (body.action !== "add_existing_staff" && (password.length < 8 || password.length > 128))
        return respond({ error: "Use a password between 8 and 128 characters." }, 400);
      if (body.action === "set_password") {
        if (typeof body.userId !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.userId))
          return respond({ error: "Choose a valid staff account." }, 400);
        if (body.userId === user.data.user.id)
          return respond({ error: "Use Change password to update your own password." }, 400);
        const member = await client.from("cms_staff").select("user_id,active")
          .eq("user_id", body.userId).maybeSingle();
        if (member.error) throw member.error;
        if (!member.data?.active)
          return respond({ error: "Only active staff accounts can have their password reset." }, 400);
        const updated = await client.auth.admin.updateUserById(member.data.user_id, {
          password, email_confirm: true,
        });
        if (updated.error) {
          if (["weak_password", "same_password"].includes(updated.error.code ?? ""))
            return respond({ error: "Choose a stronger password that differs from the current one." }, 400);
          throw updated.error;
        }
        return respond({ passwordUpdated: true });
      }
      const email =
          typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
        return respond({ error: "Enter a valid staff email address." }, 400);
      const role = body.role ?? "editor";
      if (role !== "editor" && role !== "owner")
        return respond({ error: "Choose Editor or Owner for the staff role." }, 400);
      const existing = await client
        .from("cms_staff")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();
      if (existing.error) throw existing.error;
      if (existing.data)
        return respond(
          {
            error:
              "This email already belongs to staff. Manage its role or reactivate access below.",
          },
          409,
        );
      let existingUserId: string | undefined;
      if (body.action === "add_existing_staff") {
        for (let page = 1; !existingUserId; page++) {
          const accounts = await client.auth.admin.listUsers({ page, perPage: 1000 });
          if (accounts.error) throw accounts.error;
          existingUserId = accounts.data.users.find((account) => account.email?.toLowerCase() === email)?.id;
          if (accounts.data.users.length < 1000) break;
        }
        if (!existingUserId)
          return respond({ error: "No Supabase account has this email. Choose New account to create one." }, 404);
      }
      const account = existingUserId ? { data: { user: { id: existingUserId } }, error: null } : await client.auth.admin.createUser({
        email, password, email_confirm: true,
      });
      if (account.error) {
        if (["email_exists", "user_already_exists"].includes(account.error.code ?? ""))
          return respond({ error: "This email already has a Supabase account. Choose Existing account to grant it staff access while keeping its password." }, 409);
        if (account.error.code === "weak_password")
          return respond({ error: "Choose a stronger password." }, 400);
        throw account.error;
      }
      const created = account.data.user;
      if (!created)
        throw new Error("The account was not created.");
      const registration = await client
        .from("cms_staff")
        .insert({ user_id: created.id, email, role, active: true });
      if (registration.error) {
        // Only delete the new account created by this request.
        if (!existingUserId) await client.auth.admin.deleteUser(created.id);
        throw registration.error;
      }
      return respond({ created: true });
    } catch {
      // Provider errors may contain account details. Keep the public response concise.
      return respond(
        {
          error:
            "Could not save the staff account. Please retry or contact the project administrator.",
        },
        500,
      );
    }
  };
}
