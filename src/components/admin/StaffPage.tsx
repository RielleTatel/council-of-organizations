import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listStaff, rpc, type Staff } from "../../lib/cms/content";
import { saveStaffAccount } from "../../lib/cms/staffAccounts";
import { useAuth } from "./Auth";

export function StaffPage() {
  const { staff } = useAuth(),
    cache = useQueryClient(),
    query = useQuery({
      queryKey: ["cms", "admin", "staff"],
      queryFn: listStaff,
      enabled: staff?.role === "owner",
    });
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [role, setRole] = useState<Staff["role"]>("editor"),
    [existingAccount, setExistingAccount] = useState(false),
    [resetMember, setResetMember] = useState<Staff | null>(null),
    [resetPassword, setResetPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  if (staff?.role !== "owner")
    return <p className="cms-error">Only owners can manage staff access.</p>;
  async function createStaff(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await saveStaffAccount(existingAccount ? { action: "add_existing_staff", email, role } : { action: "create_staff", email, password, role });
      setEmail("");
      setRole("editor");
      setMessage(
        existingAccount ? "Staff access granted. This person can sign in with their existing Supabase password. If they need a new password, use Set password below." : "Staff account created. Share the email and password directly with this staff member. They can sign in now and change their password in the CMS.",
      );
      await cache.invalidateQueries({ queryKey: ["cms", "admin", "staff"] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPassword("");
      setBusy(false);
    }
  }
  async function changeStaffPassword(event: FormEvent) {
    event.preventDefault();
    if (!resetMember) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await saveStaffAccount({ action: "set_password", userId: resetMember.user_id, password: resetPassword });
      setMessage(`Password updated for ${resetMember.email}. Share the new password directly with them.`);
      setResetMember(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setResetPassword("");
      setBusy(false);
    }
  }
  async function update(member: Staff, role: Staff["role"], active: boolean) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await rpc("cms_manage_staff", {
        p_user_id: member.user_id,
        p_role: role,
        p_active: active,
      });
      await cache.invalidateQueries({ queryKey: ["cms", "admin", "staff"] });
      await cache.invalidateQueries({ queryKey: ["cms", "staff"] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <span className="cms-eyebrow">Owner tools</span>
      <h1>Staff access</h1>
      <p>
        Add COA staff with an email and password. Share their login details directly;
        no email invitation is sent. Owners can manage roles and access. At
        least one active owner is required.
      </p>
      <form className="cms-create cms-actions" onSubmit={createStaff}>
        <label className="cms-field">
          Account
          <select disabled={busy} value={existingAccount ? "existing" : "new"} onChange={(e) => {
            setExistingAccount(e.target.value === "existing"); setPassword("");
          }}>
            <option value="new">New account</option>
            <option value="existing">Existing Supabase account</option>
          </select>
        </label>
        <label className="cms-field">
          Staff email
          <input
            type="email"
            autoComplete="off"
            disabled={busy}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {!existingAccount && <label className="cms-field">
          Initial password
          <input type="password" autoComplete="new-password" minLength={8} maxLength={128}
            required disabled={busy} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>}
        <label className="cms-field">
          Role
          <select disabled={busy} value={role} onChange={(e) => setRole(e.target.value as Staff["role"])}>
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
        </label>
        <button className="cms-btn primary" disabled={busy}>
          {busy ? "Saving…" : "Add staff"}
        </button>
      </form>
      {resetMember && (
        <form className="cms-create cms-actions" onSubmit={changeStaffPassword}>
          <label className="cms-field">
            New password for {resetMember.email}
            <input type="password" autoComplete="new-password" minLength={8} maxLength={128}
              required disabled={busy} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
          </label>
          <button className="cms-btn primary" disabled={busy}>Save new password</button>
          <button type="button" className="cms-btn" disabled={busy}
            onClick={() => { setResetMember(null); setResetPassword(""); }}>Cancel</button>
        </form>
      )}
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="cms-success" role="status">
          {message}
        </p>
      )}
      {query.isPending ? (
        <p>Loading staff…</p>
      ) : query.isError ? (
        <p className="cms-error">{query.error.message}</p>
      ) : (
        <div className="cms-entry-list">
          {query.data.map((member) => (
            <article key={member.user_id}>
              <div>
                <h2>{member.email}</h2>
                <span className="cms-status">
                  {member.active ? "Active" : "Access revoked"}
                </span>
              </div>
              <div className="cms-actions">
                <label className="cms-field">
                  Role
                  <select
                    disabled={busy}
                    value={member.role}
                    onChange={(e) =>
                      void update(
                        member,
                        e.target.value as Staff["role"],
                        member.active,
                      )
                    }
                  >
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>
                </label>
                <button
                  className="cms-btn"
                  disabled={busy}
                  onClick={() =>
                    void update(member, member.role, !member.active)
                  }
                >
                  {member.active ? "Revoke access" : "Reactivate"}
                </button>
                {member.active && member.user_id !== staff.user_id && (
                  <button className="cms-btn" disabled={busy} onClick={() => {
                    setResetMember(member); setResetPassword(""); setError(""); setMessage("");
                  }}>Set password</button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
