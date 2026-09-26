import { Helmet } from "react-helmet-async";
import { Link, Navigate, NavLink, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../components/admin/Auth";
import { AuthForms } from "../components/admin/AuthForms";
import { EntryList } from "../components/admin/EntryList";
import { EntryEditor } from "../components/admin/EntryEditor";
import { MediaLibrary } from "../components/admin/MediaLibrary";
import { StaffPage } from "../components/admin/StaffPage";
import { kindLabels, type EntryKind } from "../lib/cms/bootstrap";
import { requireSupabase, supabase } from "../lib/cms/client";
import { siteLogo } from "../lib/assets";
import { useState } from "react";

function AdminWorkspace() {
  const { session, staff, loading } = useAuth(),
    [error, setError] = useState("");
  async function signOut() {
    const { error } = await requireSupabase().auth.signOut();
    if (error) setError(error.message);
  }
  if (loading)
    return (
      <div className="cms-auth-card" role="status">
        Checking staff access…
      </div>
    );
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!staff)
    return (
      <div className="cms-auth-card">
        <h1>Staff access required</h1>
        <p>
          This account does not have active COA staff access. Contact a COA
          owner if you need access.
        </p>
        <button className="cms-btn" onClick={() => void signOut()}>
          Sign out
        </button>
        {error && <p className="cms-error">{error}</p>}
      </div>
    );
  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <Link to="/admin" className="cms-brand">
          <img src={siteLogo} alt="" />
          <span>
            COA CMS<small>Staff workspace</small>
          </span>
        </Link>
        <nav aria-label="CMS navigation">
          {(Object.keys(kindLabels) as EntryKind[]).map((kind) => (
            <NavLink key={kind} to={`/admin/content/${kind}`}>
              {kindLabels[kind]}
            </NavLink>
          ))}
          <NavLink to="/admin/media">Media library</NavLink>
          <NavLink to="/admin/trash">Trash</NavLink>
          {staff.role === "owner" && (
            <NavLink to="/admin/staff">Staff access</NavLink>
          )}
        </nav>
        <div className="cms-sidebar-footer">
          <p>
            {staff.email}
            <small>{staff.role}</small>
          </p>
          <Link to="/" target="_blank" rel="noreferrer">
            View website ↗
          </Link>
          <button className="cms-btn quiet" onClick={() => void signOut()}>
            Sign out
          </button>
          {error && <p className="cms-error">{error}</p>}
        </div>
      </aside>
      <main className="cms-main">
        <Routes>
          <Route
            index
            element={<Navigate to="content/organization" replace />}
          />
          <Route path="content/:kind" element={<EntryList />} />
          <Route path="edit/:id" element={<EntryEditor />} />
          <Route
            path="media"
            element={
              <section>
                <h1>Media library</h1>
                <p>Upload and reuse images across the website.</p>
                <MediaLibrary />
              </section>
            }
          />
          <Route path="trash" element={<EntryList trash />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
export default function Admin() {
  return (
    <div className="cms-root">
      <Helmet>
        <title>COA staff CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {!supabase ? (
        <div className="cms-auth-card">
          <span className="cms-eyebrow">COA CMS</span>
          <h1>Connect your Supabase project</h1>
          <p>
            Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your
            environment, then run the CMS setup documented in README.md.
          </p>
          <Link to="/">Return to the website</Link>
        </div>
      ) : (
        <AuthProvider>
          <Routes>
            <Route path="login" element={<AuthForms />} />
            <Route path="forgot" element={<AuthForms />} />
            <Route path="reset" element={<AuthForms />} />
            <Route path="*" element={<AdminWorkspace />} />
          </Routes>
        </AuthProvider>
      )}
    </div>
  );
}
