import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requireSupabase } from "../../lib/cms/client";
import { listStaff, rpc, type Staff } from "../../lib/cms/content";
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
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  if (staff?.role !== "owner")
    return <p className="cms-error">Only owners can manage staff access.</p>;
  async function invite(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data, error } = await requireSupabase().functions.invoke(
        "cms-admin",
        {
          body: { email, redirectTo: `${window.location.origin}/admin/reset` },
        },
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEmail("");
      setMessage(
        "Invitation sent. The new editor can choose a password from the email link.",
      );
      await cache.invalidateQueries({ queryKey: ["cms", "admin", "staff"] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function update(member: Staff, role: Staff["role"], active: boolean) {
    setBusy(true);
    setError("");
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
        Invite COA staff as editors. Owners can manage roles and access. At
        least one active owner is required.
      </p>
      <form className="cms-create cms-actions" onSubmit={invite}>
        <label className="cms-field">
          Staff email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button className="cms-btn primary" disabled={busy}>
          Invite editor
        </button>
      </form>
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
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
