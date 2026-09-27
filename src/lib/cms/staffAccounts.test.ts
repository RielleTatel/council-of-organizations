import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { saveStaffAccount } from "./staffAccounts";

describe("staff account requests", () => {
  it("submits manual credentials to the owner endpoint", async () => {
    let submitted: unknown;
    const client = createClient("https://cms.example.com", "public-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: async (input, init) => {
        expect(String(input)).toBe("https://cms.example.com/functions/v1/cms-admin");
        submitted = JSON.parse(String(init?.body));
        return Response.json({ created: true });
      } },
    });
    const body = { action: "create_staff" as const, email: "editor@example.com", password: "initial-password", role: "editor" as const };
    await saveStaffAccount(body, client);
    expect(submitted).toEqual(body);
  });
  it("shows the actionable backend message for non-2xx responses", async () => {
    const client = createClient("https://cms.example.com", "public-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: async () => Response.json({ error: "This email already belongs to staff." }, { status: 409 }) },
    });
    await expect(saveStaffAccount({ action: "create_staff", email: "editor@example.com", password: "initial-password", role: "editor" }, client))
      .rejects.toThrow("This email already belongs to staff.");
  });
  it("requires confirmation that a password update succeeded", async () => {
    const client = createClient("https://cms.example.com", "public-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: async () => Response.json({ created: true }) },
    });
    await expect(saveStaffAccount({ action: "set_password", userId: "staff-id", password: "replacement-password" }, client))
      .rejects.toThrow("not confirmed");
  });
});
