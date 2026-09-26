import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { requireSupabase } from "../../lib/cms/client";
import { useAuth } from "./Auth";

export function AuthForms() {
  const { session, staff, loading } = useAuth(),
    location = useLocation(),
    navigate = useNavigate();
  const recovery = location.pathname.endsWith("/forgot"),
    reset = location.pathname.endsWith("/reset");
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const auth = requireSupabase().auth;
      const result = reset
        ? await auth.updateUser({ password })
        : recovery
          ? await auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/admin/reset`,
            })
          : await auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (reset) navigate("/admin", { replace: true });
      else if (recovery)
        setMessage(
          "If your account exists, a password reset link has been sent.",
        );
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
  return (
    <form className="cms-auth-card" onSubmit={submit}>
      <span className="cms-eyebrow">COA staff</span>
      <h1>
        {reset
          ? "Choose your password"
          : recovery
            ? "Reset your password"
            : "Welcome back"}
      </h1>
      <p>
        {reset
          ? "Set a password to finish accepting your invitation or recover your account."
          : "Sign in with the email address invited by your COA owner."}
      </p>
      {reset && (!session || !staff) ? (
        <p className="cms-error">
          Open a valid invitation or recovery link from your email. Your account
          must have active COA staff access.
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
          {!recovery && (
            <label className="cms-field">
              Password
              <input
                type="password"
                autoComplete={reset ? "new-password" : "current-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          <button className="cms-btn primary" disabled={busy}>
            {busy
              ? "Please wait…"
              : reset
                ? "Save password"
                : recovery
                  ? "Send reset link"
                  : "Sign in"}
          </button>
        </>
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
      <Link to={recovery || reset ? "/admin/login" : "/admin/forgot"}>
        {recovery || reset ? "Back to sign in" : "Forgot your password?"}
      </Link>
      <Link to="/">Return to the website</Link>
    </form>
  );
}
