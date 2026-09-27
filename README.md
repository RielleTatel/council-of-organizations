# Council of Organizations CMS

React + TypeScript + Vite frontend, hosted on Netlify. Supabase provides PostgreSQL, staff Auth, private Storage, and backend functions. CMS owners create staff accounts with an email and password and share the login details directly. Resend, SMTP, and a custom domain are not required.

The agreed [spec](docs/specs/2026-09-26-supabase-cms.md) and [implementation plan](docs/plans/2026-09-26-supabase-cms.md) are local Markdown documents.

## Development

```sh
npm install
npm run dev
```

Node 22+ and Bun are required. With no Supabase environment values, the public site shows the current approved bootstrap content and `/admin` shows connection instructions. Once configured, the public site reads published snapshots from Supabase; a backend failure shows an error.

## Environment files

Create these two files in the project root. Both are ignored by Git.

### `.env.local`: frontend

Copy `.env.example` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Get these from the existing Supabase project's Connect dialog / API Keys settings. A legacy anon key is also supported through `VITE_SUPABASE_ANON_KEY`. Keep the existing optional PostHog values if using analytics. Set `VITE_SITE_URL` if the site's public origin changes.

### `.env.setup.local`: provisioning

Copy `.env.setup.example` and fill in:

| Variable                        | Source / purpose                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Same standard project URL as the frontend                                                                                          |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same public key as the frontend                                                                                                    |
| `SUPABASE_ACCESS_TOKEN`         | Supabase account personal access token; authorizes Management API migrations, Auth configuration, secrets, and function deployment |
| `SUPABASE_SERVICE_ROLE_KEY`     | Project's backend service role key; used only by setup for Auth administration and Storage import                                  |
| `CMS_OWNER_EMAIL`               | Email address for initial owner access                                                                                             |
| `CMS_OWNER_PASSWORD`            | Initial password (8–128 characters), required only when creating a new owner Auth account; existing passwords are preserved         |
| `CMS_SITE_URL`                  | Public frontend origin, currently `https://coa-z-adzu.netlify.app`                                                                 |
| `CMS_LOCAL_ORIGIN`              | Local frontend origin, normally `http://localhost:5173`                                                                            |

Setup secrets must never have a `VITE_` prefix. Vite exposes variables with that prefix in the browser bundle.

## Connect the existing Supabase project

1. Fill in both environment files. If the initial owner has no Supabase Auth account yet, set `CMS_OWNER_PASSWORD` in `.env.setup.local`.
2. Run:

   ```sh
   npm run cms:setup
   ```

3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Netlify's environment settings. Set `CMS_SITE_URL` there if using a different public domain. Deploy the frontend using the included `netlify.toml`.
4. Visit `/admin` and sign in with the existing owner's password, or `CMS_OWNER_PASSWORD` for a newly created owner. Use **Change password** after signing in.
5. In **Staff access**, select **New account**, enter an email, initial password and role, then **Add staff**. Share the login details directly. Select **Existing Supabase account** to grant access without changing that person's password. Owners can update roles or revoke access; the database protects the last active owner.

The setup command applies versioned migrations, imports 41 organization profiles, two stories, and six singleton documents as published, imports their editorial images, disables public signup, deploys `cms-admin` and `cms-media`, and bootstraps the owner. It keeps existing Auth redirect URLs. An existing Auth account matching `CMS_OWNER_EMAIL` receives owner access with its existing password. New accounts are confirmed by the owner and can sign in immediately; no email is sent. Passwords are managed by Supabase Auth and never stored in CMS tables.

Rerunning setup skips applied migrations and existing imported entries. It does not overwrite staff edits or republish entries moved to trash. It reapplies the requested Auth configuration and deploys the backend functions. No staging environment is created. The Supabase CLI deploys through the API without requiring Docker.

If a step fails, correct its configuration and rerun. A missing environment value stops setup before any network writes. Deployment errors identify the function that failed. Account creation errors require checking the email, password requirements and Supabase Auth logs.

## Migrate an existing CMS away from email invitations

No database schema change or account recreation is needed. Existing staff roles, passwords and published content stay in place.

```sh
npm run cms:migrate-auth
SUPABASE_TELEMETRY_DISABLED=1 bun --env-file=.env.setup.local ./node_modules/.bin/supabase functions deploy cms-admin --project-ref YOUR_PROJECT_REF --use-api --no-verify-jwt
```

Deploy the updated frontend to Netlify as well. The Auth migration only configures the login provider and disables public signup; it does not seed content, reset passwords or change an existing SMTP configuration. `RESEND_API_KEY` and `RESEND_FROM_EMAIL` can be removed from local setup files because the CMS no longer uses them.

Owners use **Set password** on another active staff member to recover their access, including an account created by an old invitation. Staff can then choose their own password using **Change password**. `/admin/forgot` explains how to contact an owner and does not send an email. If the only owner loses access, the Supabase project administrator must reset that account through the Dashboard or the server-side Auth admin API.

## Staff workflow

- Edit an entry, then **Save draft**. Visitors continue seeing its last published version.
- **Publish** explicitly makes the saved draft live. Leadership publishes as one roster; Recruitment Week publishes as one campaign.
- Each year, overwrite the current leadership members and current Recruitment Week campaign. Update the campaign's dates, date label, timeline, headline, and page copy in the same draft. There are no academic-year editions.
- Organizations and stories publish individually. Published slugs are permanent, preserving existing links.
- Ordered lists support adding, removing, and moving items. Long text supports headings, emphasis, lists, and links in the formatted editor.
- Choose images from **Media library**. New uploads remain private until first used in published content. Once published, an image remains public and reusable, including after the entry is unpublished.
- **Unpublish** hides an individual entry. **Move to trash** hides it and preserves recovery data. Restoring trash or publication history restores a draft; publish it deliberately to make it live again.
- If another staff member saved a newer version, the database rejects a stale save or publication. Reload the saved draft and reapply the intended changes.

The booth feature is removed. `/recweek/map` redirects to `/recweek`. Netlify serves a dynamic `/sitemap.xml` from published organization/story records, so new publications appear without rebuilding the frontend. The generated local sitemap remains available during unconfigured development.

## Architecture and checks

- Published reads and media resolution are behind the content module.
- PostgreSQL tables separate drafts, published snapshots, history, staff, and media. RLS protects reads. Security-definer RPCs authorize active staff and perform transactional publication and version checks.
- Staff roles are checked against current database state, so revocation does not depend on waiting for a JWT refresh.
- Backend account creation and password reset requests validate the caller's session and active owner role. Password resets are limited to another active staff account. Adding an existing account preserves its password. The media endpoint uses an anonymous client and returns only published assets. Private previews use authenticated downloads.

```sh
npm run typecheck
npm test
npm run build
npm run lint
```

Database integration tests run the real SQL migration in embedded PostgreSQL (PGlite), with Supabase Auth/Storage infrastructure fixtures. Endpoint tests use the real Supabase SDK with an external HTTP adapter. They verify local behavior; live deployment and staff sign-in checks require your project credentials. No email provider is needed.

## Provider references

- [Supabase React setup](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase server-side account creation](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
- [Supabase server-side password updates](https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid)
- [Supabase Auth configuration API](https://supabase.com/docs/reference/api/v1-update-auth-service-config)
- [Supabase function deployment](https://supabase.com/docs/reference/cli/supabase-functions-deploy)
