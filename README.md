# Council of Organizations CMS

React + TypeScript + Vite frontend, hosted on Netlify. Supabase provides PostgreSQL, invited-staff Auth, private Storage, and backend functions. Resend delivers invitations and password recovery through Supabase Auth SMTP.

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
| `RESEND_API_KEY`                | Resend API key authorized to send email from your verified domain                                                                  |
| `RESEND_FROM_EMAIL`             | Sender address on that verified domain, e.g. `cms@your-domain.com`                                                                 |
| `CMS_OWNER_EMAIL`               | Email address that receives initial owner access                                                                                   |
| `CMS_SITE_URL`                  | Public frontend origin, currently `https://coa-z-adzu.netlify.app`                                                                 |
| `CMS_LOCAL_ORIGIN`              | Local frontend origin, normally `http://localhost:5173`                                                                            |

Setup secrets must never have a `VITE_` prefix. Vite exposes variables with that prefix in the browser bundle.

## Connect the existing Supabase project

1. Verify the sender domain in Resend and fill in both environment files.
2. Run:

   ```sh
   npm run cms:setup
   ```

3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Netlify's environment settings. Set `CMS_SITE_URL` there if using a different public domain. Deploy the frontend using the included `netlify.toml`.
4. Open the initial owner invitation and choose a password. Visit `/admin` to sign in.
5. In **Staff access**, invite COA editors. Owners may promote another editor to owner or revoke access; the database protects the last active owner.

The setup command applies versioned migrations, imports 41 organization profiles, two stories, and six singleton documents as published, imports their editorial images, configures Resend SMTP and invitation/recovery redirects, disables public signup, deploys `cms-admin` and `cms-media`, and bootstraps the owner. It keeps existing Auth redirect URLs. An existing Auth account matching `CMS_OWNER_EMAIL` receives owner access without another invitation and uses its existing password or password recovery.

Rerunning setup skips applied migrations and existing imported entries. It does not overwrite staff edits or republish entries moved to trash. It reapplies the requested Auth/SMTP configuration and deploys the backend functions. No staging environment is created. The Supabase CLI deploys through the API without requiring Docker.

If a step fails, correct its configuration and rerun. A missing environment value stops setup before any network writes. Deployment errors identify the function that failed. Owner invitation errors usually require checking the verified Resend sender, SMTP credentials, and Supabase Auth logs. If an invitation has expired, use `/admin/forgot` to request a recovery link.

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
- Backend invitation requests validate the caller's session and active owner role. The media endpoint uses an anonymous client and returns only published assets. Private previews use authenticated downloads.

```sh
npm run typecheck
npm test
npm run build
npm run lint
```

Database integration tests run the real SQL migration in embedded PostgreSQL (PGlite), with Supabase Auth/Storage infrastructure fixtures. Endpoint tests use the real Supabase SDK with an external HTTP adapter. They verify local behavior; live deployment, invitation delivery, and recovery emails require your project credentials and verified Resend sender.

## Provider references

- [Supabase React setup](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Resend with Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp)
- [Supabase Auth configuration API](https://supabase.com/docs/reference/api/v1-update-auth-service-config)
- [Supabase function deployment](https://supabase.com/docs/reference/cli/supabase-functions-deploy)
