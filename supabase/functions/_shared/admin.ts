import type { SupabaseClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
export function createAdminHandler(
  client: SupabaseClient,
  siteUrl: string,
  localOrigin = "http://localhost:5173",
) {
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
        return respond({ error: "Only active owners can invite staff." }, 403);
      const body = await request.json(),
        email =
          typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
        return respond({ error: "Enter a valid staff email address." }, 400);
      const allowed = [
        `${siteUrl.replace(/\/$/, "")}/admin/reset`,
        `${localOrigin.replace(/\/$/, "")}/admin/reset`,
      ];
      if (!allowed.includes(body.redirectTo))
        return respond(
          { error: "This invitation redirect is not allowed." },
          400,
        );
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
      const invitation = await client.auth.admin.inviteUserByEmail(email, {
        redirectTo: body.redirectTo,
      });
      if (invitation.error) throw invitation.error;
      const invited = invitation.data.user;
      if (!invited)
        throw new Error("The invitation did not create an account.");
      const registration = await client
        .from("cms_staff")
        .insert({ user_id: invited.id, email, role: "editor", active: true });
      if (registration.error) {
        // An unusable invitation must not leave a half-created staff account.
        await client.auth.admin.deleteUser(invited.id);
        throw registration.error;
      }
      return respond({ invited: true });
    } catch {
      // Provider errors may contain account details. Keep the public response concise.
      return respond(
        {
          error:
            "Invitation failed. Check Auth SMTP and the Supabase function logs, then retry.",
        },
        500,
      );
    }
  };
}
