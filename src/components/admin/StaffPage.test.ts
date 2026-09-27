import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthForms } from "./AuthForms";
import { StaffPage } from "./StaffPage";

const state = vi.hoisted(() => ({ role: "owner", signedIn: true }));
vi.mock("./Auth", () => ({ useAuth: () => ({
  session: state.signedIn ? { user: { id: "owner-id" } } : null,
  staff: state.signedIn ? { user_id: "owner-id", role: state.role, active: true } : null,
  loading: false,
}) }));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  useQuery: () => ({ isPending: false, isError: false, data: [
    { user_id: "editor-id", email: "editor@example.com", role: "editor", active: true },
  ] }),
}));

describe("manual staff account controls", () => {
  it("shows owners email, password and role controls with password recovery for staff", () => {
    state.role = "owner"; state.signedIn = true;
    const html = renderToStaticMarkup(createElement(StaffPage));
    expect(html).toContain("Staff email");
    expect(html).toContain("Initial password");
    expect(html).toContain('type="password"');
    expect(html).toContain("Existing Supabase account");
    expect(html).toContain("Add staff");
    expect(html).toContain("Set password");
    expect(html).not.toContain("Invite editor");
  });
  it("does not expose account management controls to editors", () => {
    state.role = "editor"; state.signedIn = true;
    const html = renderToStaticMarkup(createElement(StaffPage));
    expect(html).toContain("Only owners");
    expect(html).not.toContain('<input');
  });
  it("directs forgotten passwords to owners without requesting an email", () => {
    state.signedIn = false;
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/admin/forgot"] }, createElement(AuthForms)));
    expect(html).toContain("Contact a COA owner");
    expect(html).not.toContain('<input');
    expect(html).not.toContain("Send reset link");
  });
  it("lets signed-in staff change their own password", () => {
    state.role = "editor"; state.signedIn = true;
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/admin/password"] }, createElement(AuthForms)));
    expect(html).toContain("Save password");
    expect(html).toContain('autoComplete="new-password"');
  });
});
