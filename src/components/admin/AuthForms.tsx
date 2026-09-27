import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { requireSupabase } from "../../lib/cms/client";
import { useAuth } from "./Auth";

export function AuthForms() {
  const { session, staff, loading } = useAuth(),
    location = useLocation(),
    navigate = useNavigate();
  const recovery = location.pathname.endsWith("/forgot"),
    reset = location.pathname.endsWith("/reset") || location.pathname.endsWith("/password");
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const auth = requireSupabase().auth;
      const result = reset
        ? await auth.updateUser({ password })
        : await auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (reset) navigate("/admin", { replace: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <div className="cms-auth-card" role="status">
        Checking your session…
      </div>
    );
  if (session && !reset && !recovery) return <Navigate to="/admin" replace />;
  if (recovery)
    return (
      <div className="cms-auth-card">
        <span className="cms-eyebrow">COA staff</span>
        <h1>Reset your password</h1>
        <p>Contact a COA owner. They can set a new password for you in Staff access and share it with you directly.</p>
        <p>If you are the only owner, ask the Supabase project administrator to reset your account password.</p>
        <Link to="/admin/login">Back to sign in</Link>
        <Link to="/">Return to the website</Link>
      </div>
    );
  return (
    <form className="cms-auth-card" onSubmit={submit}>
      <span className="cms-eyebrow">COA staff</span>
      <h1>{reset ? "Choose your password" : "Welcome back"}</h1>
      <p>
        {reset
          ? "Choose a new password for your COA staff account."
          : "Sign in with the email and password provided by your COA owner."}
      </p>
      {reset && (!session || !staff) ? (
        <p className="cms-error">
          Sign in with an active COA staff account before changing your password.
        </p>
      ) : (
        <>
          {!reset && (
            <label className="cms-field">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          )}
          <label className="cms-field">
            Password
            <input
              type="password"
              autoComplete={reset ? "new-password" : "current-password"}
              minLength={8}
              maxLength={reset ? 128 : undefined}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="cms-btn primary" disabled={busy}>
            {busy
              ? "Please wait…"
              : reset
                ? "Save password"
                : "Sign in"}
          </button>
        </>
      )}
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      <Link to={reset && session && staff ? "/admin" : reset ? "/admin/login" : "/admin/forgot"}>
        {reset ? "Back" : "Forgot your password?"}
      </Link>
      <Link to="/">Return to the website</Link>
    </form>
  );
}
