# Supabase CMS implementation plan

Spec: ../specs/2026-09-26-supabase-cms.md. All confirmation steps are auto-accepted by the user. Preserve the user's existing skill-install changes.

1. Build the content module and bootstrap documents. Prove published reads and media resolution at the module interface with focused tests. Capture all current editable content and stable URLs.
2. Add PostgreSQL migrations for staff, entries, drafts, published snapshots, media, and history. Implement guarded transactional save/publish/unpublish/trash/restore and version checks. Add meaningful permission/integration checks.
3. Add Supabase client configuration, invite/password/recovery flows, live staff guards, and owner-only invitation/access management. Keep privileged keys on the backend.
4. Add the admin shell, entry lists, structured editors, ordered arrays, rich text, private media library, history, trash, and publish controls. Reuse public brand tokens and accessible form patterns.
5. Connect all public content domains to the published content module. Preserve public design, add remote failure feedback, and remove the booth page and its dependencies. Redirect its former route.
6. Add idempotent existing-content import, initial-owner bootstrap, Resend SMTP configuration, backend deployment helpers, environment examples, a dynamic sitemap, and local setup instructions.
7. Run focused checks throughout, then the complete suite, production build, and UI inspection. Run the implement skill's parallel Standards/Spec reviews against the pre-implementation commit, address findings, and commit only task changes on the current branch.

Completion: all spec stories have implementation evidence; local checks pass; any live activation requirement is explicit and runnable; the user's unrelated changes remain outside the task commit.
