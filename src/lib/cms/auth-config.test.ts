import { describe, expect, it } from "vitest";
import { configureStaffAuth } from "../../../scripts/cms/auth-config";

describe("manual staff Auth migration", () => {
  it("preserves redirect URLs and disables signup without configuring an email provider", async () => {
    const calls: { method: string; body?: unknown }[] = [];
    await configureStaffAuth(async (path, method, body) => {
      expect(path).toBe("config/auth");
      calls.push({ method, body });
      return method === "GET" ? { uri_allow_list: "https://previous.example.com/reset,https://coa.example.com/admin/reset" } : null;
    }, "https://coa.example.com", "http://localhost:5173");
    expect(calls[1].body).toMatchObject({ disable_signup: true, password_min_length: 8, external_email_enabled: true });
    expect((calls[1].body as { uri_allow_list: string }).uri_allow_list.split(",")).toEqual([
      "https://previous.example.com/reset", "https://coa.example.com/admin/reset", "http://localhost:5173/admin/reset",
    ]);
    expect(Object.keys(calls[1].body as object).some((key) => key.startsWith("smtp"))).toBe(false);
  });
});
