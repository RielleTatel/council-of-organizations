import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createAdminHandler } from "../../../supabase/functions/_shared/admin";
import { createMediaHandler } from "../../../supabase/functions/_shared/media";

const id = "00000000-0000-4000-8000-000000000007",
  origin = "https://coa.example.com";
function fixture({
  role = "owner",
  active = true,
  registered = false,
  failedInsert = false,
  existingAccount = false,
  targetActive = true,
  targetExists = true,
  invalidSession = false,
  publicMedia = false,
} = {}) {
  const calls: { path: string; method: string; body: unknown }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(String(input)),
      path = url.pathname,
      method = init?.method ?? "GET";
    calls.push({
      path,
      method,
      body: init?.body ? JSON.parse(String(init.body)) : null,
    });
    if (path === "/auth/v1/user")
      return invalidSession ? Response.json({ message: "Invalid token" }, { status: 401 }) : Response.json({ id, email: "owner@coa.example.com" });
    if (path === "/auth/v1/admin/users") {
      if (method === "GET") return Response.json({ users: existingAccount ? [{ id: "00000000-0000-4000-8000-000000000008", email: "editor@coa.example.com" }] : [], aud: "authenticated" });
      return existingAccount ? Response.json({ error_code: "email_exists", msg: "Already registered" }, { status: 422 }) : Response.json({
        id: "00000000-0000-4000-8000-000000000008",
        email: "editor@coa.example.com",
      });
    }
    if (path.includes("/auth/v1/admin/users/")) return Response.json({});
    if (path === "/rest/v1/cms_staff") {
      if (method === "POST")
        return failedInsert
          ? Response.json({ message: "failed" }, { status: 400 })
          : Response.json(null, { status: 201 });
      if (url.searchParams.has("email"))
        return Response.json(registered ? [{ user_id: id }] : []);
      if (url.searchParams.get("user_id") === "eq.00000000-0000-4000-8000-000000000008")
        return Response.json(targetExists ? [{ user_id: "00000000-0000-4000-8000-000000000008", active: targetActive }] : []);
      return Response.json([{ role, active }]);
    }
    if (path === "/rest/v1/cms_media")
      return Response.json(
        publicMedia
          ? [{ storage_path: `${id}/image.jpg`, mime_type: "image/jpeg" }]
          : [],
      );
    if (path.startsWith("/storage/v1/object/"))
      return new Response("image", {
        headers: { "Content-Type": "image/jpeg" },
      });
    throw new Error(`Unexpected backend request: ${path}`);
  };
  const client = createClient("https://cms.example.com", "service-key", {
    global: { fetch: fetcher },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return { client, calls };
}
const accountRequest = (body: unknown = {
  action: "create_staff", email: "editor@coa.example.com", password: "initial-password", role: "editor",
}) =>
  new Request(`${origin}/api`, {
    method: "POST",
    headers: {
      Authorization: "Bearer staff-jwt",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
describe("CMS backend endpoints", () => {
  it("requires a verified session and a currently active owner before managing accounts", async () => {
    for (const access of [{ role: "editor" }, { active: false }, { invalidSession: true }]) {
      const { client, calls } = fixture(access),
        response = await createAdminHandler(client)(accountRequest());
      expect(response.status).toBe(access.invalidSession ? 401 : 403);
      expect(calls.some((call) => call.path.startsWith("/auth/v1/admin"))).toBe(false);
    }
    const { client, calls } = fixture(),
      response = await createAdminHandler(
        client,
      )(new Request(`${origin}/api`, { method: "POST" }));
    expect(response.status).toBe(401);
    expect(calls).toHaveLength(0);
  });
  it("creates confirmed staff with a password without sending an email", async () => {
    const { client, calls } = fixture(),
      handler = createAdminHandler(client);
    const response = await handler(accountRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ created: true });
    expect(calls.find((call) => call.path === "/auth/v1/admin/users")?.body).toMatchObject({
      email: "editor@coa.example.com", password: "initial-password", email_confirm: true,
    });
    expect(calls.some((call) => /invite|recover|generate_link/.test(call.path))).toBe(false);
    expect(
      calls.find(
        (call) => call.path === "/rest/v1/cms_staff" && call.method === "POST",
      )?.body,
    ).toMatchObject({
      role: "editor",
      active: true,
      email: "editor@coa.example.com",
    });
  });
  it("rejects invalid account input before writing to Auth", async () => {
    for (const body of [null, { action: "invite" },
      { action: "create_staff", email: "bad", password: "initial-password" },
      { action: "create_staff", email: "editor@coa.example.com", password: "short" },
      { action: "create_staff", email: "editor@coa.example.com", password: "x".repeat(129) },
      { action: "create_staff", email: "editor@coa.example.com", password: "initial-password", role: "superadmin" },
    ]) {
      const { client, calls } = fixture();
      expect((await createAdminHandler(client)(accountRequest(body))).status).toBe(400);
      expect(calls.some((call) => call.path.startsWith("/auth/v1/admin"))).toBe(false);
    }
  });
  it("rejects duplicate staff and never overwrites an existing Auth account", async () => {
    const duplicate = fixture({ registered: true });
    expect(
      (await createAdminHandler(duplicate.client)(accountRequest())).status,
    ).toBe(409);
    expect(
      duplicate.calls.some((call) => call.path.startsWith("/auth/v1/admin")),
    ).toBe(false);
    const existing = fixture({ existingAccount: true });
    expect((await createAdminHandler(existing.client)(accountRequest())).status).toBe(409);
    expect(existing.calls.some((call) => ["PUT", "DELETE"].includes(call.method))).toBe(false);
  });
  it("allows owners to create another owner with the selected role", async () => {
    const { client, calls } = fixture();
    expect((await createAdminHandler(client)(accountRequest({ action: "create_staff", email: "new-owner@coa.example.com", password: "initial-password", role: "owner" }))).status).toBe(200);
    expect(calls.find((call) => call.path === "/rest/v1/cms_staff" && call.method === "POST")?.body).toMatchObject({ role: "owner" });
  });
  it("grants existing Auth accounts staff access without replacing their password", async () => {
    const body = { action: "add_existing_staff", email: "editor@coa.example.com", role: "editor" };
    for (const failedInsert of [false, true]) {
      const { client, calls } = fixture({ existingAccount: true, failedInsert });
      expect((await createAdminHandler(client)(accountRequest(body))).status).toBe(failedInsert ? 500 : 200);
      expect(calls.some((call) => call.path.startsWith("/auth/v1/admin") && call.method !== "GET")).toBe(false);
    }
    const { client } = fixture();
    expect((await createAdminHandler(client)(accountRequest(body))).status).toBe(404);
  });
  it("resets passwords only for another active staff account", async () => {
    const target = "00000000-0000-4000-8000-000000000008";
    const body = { action: "set_password", userId: target, password: "replacement-password" };
    const { client, calls } = fixture();
    const response = await createAdminHandler(client)(accountRequest(body));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ passwordUpdated: true });
    expect(calls.find((call) => call.method === "PUT")?.body).toMatchObject({ password: "replacement-password", email_confirm: true });
    for (const options of [{ targetActive: false }, { targetExists: false }, { role: "editor" }, { active: false }]) {
      const denied = fixture(options);
      expect((await createAdminHandler(denied.client)(accountRequest(body))).status).toBe(options.role || options.active === false ? 403 : 400);
      expect(denied.calls.some((call) => call.method === "PUT")).toBe(false);
    }
    expect((await createAdminHandler(client)(accountRequest({ ...body, userId: id }))).status).toBe(400);
    expect((await createAdminHandler(client)(accountRequest({ ...body, userId: "invalid" }))).status).toBe(400);
  });
  it("accepts browser preflight without a session", async () => {
    const { client, calls } = fixture();
    const response = await createAdminHandler(client)(new Request(`${origin}/api`, { method: "OPTIONS" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(calls).toHaveLength(0);
  });
  it("cleans up a new Auth account when staff registration fails", async () => {
    const { client, calls } = fixture({ failedInsert: true });
    expect((await createAdminHandler(client)(accountRequest())).status).toBe(
      500,
    );
    expect(
      calls.some(
        (call) =>
          call.method === "DELETE" &&
          call.path.includes("/auth/v1/admin/users/"),
      ),
    ).toBe(true);
  });
  it("does not deliver private uploads, even when the caller supplies a staff token", async () => {
    const { client, calls } = fixture();
    const response = await createMediaHandler(client)(
      new Request(`${origin}/media?id=${id}`, {
        headers: { Authorization: "Bearer staff-jwt" },
      }),
    );
    expect(response.status).toBe(404);
    expect(calls.some((call) => call.path.startsWith("/storage/"))).toBe(false);
    const published = fixture({ publicMedia: true }),
      image = await createMediaHandler(published.client)(
        new Request(`${origin}/media?id=${id}`),
      );
    expect(image.status).toBe(200);
    expect(image.headers.get("Content-Type")).toBe("image/jpeg");
    expect(await image.text()).toBe("image");
  });
});
