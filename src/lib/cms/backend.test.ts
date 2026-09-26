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
      return Response.json({ id, email: "owner@coa.example.com" });
    if (path === "/auth/v1/invite")
      return Response.json({
        id: "00000000-0000-4000-8000-000000000008",
        email: "editor@coa.example.com",
      });
    if (path.includes("/auth/v1/admin/users/")) return Response.json({});
    if (path === "/rest/v1/cms_staff") {
      if (method === "POST")
        return failedInsert
          ? Response.json({ message: "failed" }, { status: 400 })
          : Response.json(null, { status: 201 });
      if (url.searchParams.has("email"))
        return Response.json(registered ? [{ user_id: id }] : []);
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
const invite = () =>
  new Request(`${origin}/api`, {
    method: "POST",
    headers: {
      Authorization: "Bearer staff-jwt",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "editor@coa.example.com",
      redirectTo: `${origin}/admin/reset`,
    }),
  });
describe("CMS backend endpoints", () => {
  it("requires a verified session and a currently active owner before any email is sent", async () => {
    for (const access of [{ role: "editor" }, { active: false }]) {
      const { client, calls } = fixture(access),
        response = await createAdminHandler(client, origin)(invite());
      expect(response.status).toBe(403);
      expect(calls.some((call) => call.path === "/auth/v1/invite")).toBe(false);
    }
    const { client, calls } = fixture(),
      response = await createAdminHandler(
        client,
        origin,
      )(new Request(`${origin}/api`, { method: "POST" }));
    expect(response.status).toBe(401);
    expect(calls).toHaveLength(0);
  });
  it("invites an editor and records staff access while restricting redirects and duplicate registration", async () => {
    const { client, calls } = fixture(),
      handler = createAdminHandler(client, origin);
    expect((await handler(invite())).status).toBe(200);
    expect(
      calls.find(
        (call) => call.path === "/rest/v1/cms_staff" && call.method === "POST",
      )?.body,
    ).toMatchObject({
      role: "editor",
      active: true,
      email: "editor@coa.example.com",
    });
    const response = await handler(
      new Request(`${origin}/api`, {
        method: "POST",
        headers: { Authorization: "Bearer staff-jwt" },
        body: JSON.stringify({
          email: "editor@coa.example.com",
          redirectTo: "https://attacker.example.com/admin/reset",
        }),
      }),
    );
    expect(response.status).toBe(400);
    const duplicate = fixture({ registered: true });
    expect(
      (await createAdminHandler(duplicate.client, origin)(invite())).status,
    ).toBe(409);
    expect(
      duplicate.calls.some((call) => call.path === "/auth/v1/invite"),
    ).toBe(false);
  });
  it("cleans up a new Auth account when staff registration fails", async () => {
    const { client, calls } = fixture({ failedInsert: true });
    expect((await createAdminHandler(client, origin)(invite())).status).toBe(
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
