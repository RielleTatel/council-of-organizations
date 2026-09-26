# Supabase CMS migration

Status: ready-for-agent. The user approved the decisions and auto-accepted implementation choices. This local document is the spec source; no issue tracker publication is requested.

## Problem Statement

COA staff currently need source-code changes to maintain the public website. Its organization directory, editorial stories, leadership roster, Recruitment Week campaign, homepage, About page, images, and contact information are stored locally. Staff need a secure CMS that lets them maintain all public content while preserving the current React frontend and visual design.

## Solution

Add an invited-staff CMS backed by the user's existing Supabase project. Owners manage staff access. Editors create, edit, and publish content. Saved drafts remain separate from published content, so visitors see the previous published version until staff explicitly publish an update. Import the current content as published. Remove the interactive booth feature. Use Resend for invitation and password-recovery email delivery, keep Netlify hosting, and validate locally before production activation without a staging environment.

## User Stories

1. As a visitor, I want the familiar public website, so that migration preserves how I browse information.
2. As a visitor, I want current published organization information, so that I can discover communities.
3. As a visitor, I want existing organization and story URLs to remain usable, so that saved links keep working.
4. As a visitor, I want drafts to stay private, so that unfinished information is not presented as official.
5. As a visitor, I want the last published version during editing, so that staff work does not interrupt the site.
6. As a visitor, I want published story links in the sitemap, so that content can be discovered after publication.
7. As a visitor, I want useful loading and failure states, so that unavailable data is distinguishable from an empty directory.
8. As invited staff, I want to accept an invitation and choose a password, so that I can access the CMS.
9. As invited staff, I want email/password login and logout, so that I can maintain an authenticated session.
10. As invited staff, I want password recovery, so that losing a password does not require a developer.
11. As an owner, I want to invite editors, so that COA can maintain its own staffing.
12. As an owner, I want to change staff roles and revoke access, so that permissions follow current responsibilities.
13. As an owner, I want the last owner protected from removal, so that the CMS remains administrable.
14. As an editor, I want to create and edit organization profiles, so that descriptions, logos, links, and officers stay current.
15. As an editor, I want editable cluster descriptions and ordering, so that the directory reflects COA's taxonomy.
16. As an editor, I want to create and edit event stories, so that COA can publish editorial highlights.
17. As an editor, I want headings, emphasis, lists, and links in long text, so that content remains readable.
18. As an editor, I want to save a draft separately from publishing, so that I can prepare changes safely.
19. As an editor, I want conflicting edits detected, so that another staff member's changes are not silently overwritten.
20. As an editor, I want an explicit publish action, so that only intentional changes go live.
21. As an editor, I want organization profiles and stories published individually, so that unrelated records can be maintained independently.
22. As an editor, I want the leadership roster published together, so that visitors see a consistent council lineup.
23. As an editor, I want to overwrite the current leadership roster annually, so that yearly maintenance stays simple.
24. As an editor, I want Recruitment Week published as one campaign, so that its dates, timeline, FAQs, and copy agree.
25. As an editor, I want to overwrite the current campaign each year, so that I maintain one current Recruitment Week page.
26. As an editor, I want homepage and About content editable within fixed layouts, so that copy changes preserve the site design.
27. As an editor, I want to reorder repeatable content, so that galleries, FAQs, timelines, officers, and similar lists follow editorial order.
28. As an editor, I want to update branding, contact information, navigation labels, and social links, so that global information stays current.
29. As an editor, I want a media library with uploads and reusable images, so that image changes require no source-code edits.
30. As an editor, I want editable image descriptions, so that images have appropriate accessible text.
31. As an editor, I want new draft-only media protected, so that an unpublished upload is not available anonymously.
32. As an editor, I want published images accessible through stable URLs, so that public pages can display them reliably.
33. As an editor, I want to unpublish content separately, so that saving a draft does not unexpectedly hide a page.
34. As an editor, I want trash and restore, so that deletion mistakes can be reversed.
35. As an editor, I want publication history restored into a draft, so that recovery still requires deliberate publication.
36. As a maintainer, I want environment examples and repeatable setup, so that I can connect the existing Supabase project without editing application code.
37. As a maintainer, I want versioned migrations and an idempotent content import, so that setup does not overwrite subsequent staff edits.
38. As a maintainer, I want all current approved content imported as published, so that launch does not empty the public website.
39. As a visitor, I want old booth-map links directed to Recruitment Week, so that removal does not strand existing links.

## Implementation Decisions

- Preserve React, TypeScript, Vite, the existing public layouts, and Netlify frontend hosting. Supabase supplies PostgreSQL, Auth, Storage, and privileged backend functions.
- Establish one content module interface for published reads and editorial operations. Existing public content shapes remain usable; the module hides Supabase transport, snapshots, and media resolution.
- Model organization profiles and stories as individual entries; leadership, Recruitment Week, homepage, About, settings, and cluster configuration are singleton entries containing structured ordered content.
- Separate draft documents, published documents, entry metadata, staff permissions, media metadata, and publication history. Anonymous reads expose published documents only.
- Protect all CMS operations with live active-staff checks in PostgreSQL policies and functions. Owner-only account administration additionally authorizes the caller in the backend. Route guards provide UX and do not grant database permissions.
- Publish a complete document and its publication-history entry in one database transaction. Use expected draft versions to reject stale saves and publishes. Restoring history creates a draft rather than changing the public version.
- Keep one current leadership roster and one current Recruitment Week campaign. Publication history is recovery data, not an academic-year archive.
- Use fixed layouts and structured fields with repeatable ordered lists. Rich text permits headings, bold, italic, lists, and links and is sanitized when rendered.
- Keep new uploads in private Storage. Publication makes referenced assets publicly readable through controlled delivery; draft preview requires staff authorization. Existing public assets can be imported and reused.
- Use Supabase Auth invitations, password login, and password recovery. Disable public signup. Configure Supabase Auth SMTP with Resend and a verified sender domain. Browser configuration includes only the project URL and publishable key.
- Privileged setup and invitation credentials stay outside the browser bundle. Bootstrap the initial owner through setup, and protect the last active owner.
- Remove the interactive booth-map page, booth assignments, map-only UI and dependency, and map links. Retain Recruitment Week and accurate prose about the physical organization fair. Redirect the former map URL to Recruitment Week.
- Replace the source-array sitemap dependency with a published-content sitemap for deployment; maintain a local bootstrap sitemap for unconfigured development.
- Existing content is imported as published using stable identifiers and URLs. Setup is repeatable and leaves existing edited entries intact.
- A configured remote-content failure produces an explicit error; it must not silently substitute bootstrap content. Bootstrap content supports development before environment configuration.
- Use local validation and production activation against the existing project. No staging environment or issue-tracker posting is part of delivery.

## Testing Decisions

- Test observable behavior through the content module interface: published reads, draft isolation, stale-version rejection, publish/history/restore, and media resolution.
- Test database permissions through the externally exposed tables/functions using anonymous, editor, owner, and revoked-staff roles. Check draft confidentiality, forbidden writes, last-owner protection, and complete-group publication.
- Test authentication/account administration at its external interface; use a mock adapter for the true external Supabase transport when a real local backend is unavailable.
- Existing Vitest content, route, sitemap, and SEO checks provide prior art. Update booth-related assertions to reflect removal and preserve the remaining routes.
- Follow red/green development for meaningful content and authorization behavior. Run focused tests and typechecks during implementation; run the complete suite and production build before delivery.
- Local tests must distinguish what was verified locally from what still requires the user's project credentials, verified Resend domain, and live environment.

## Out of Scope

- Public signup, student accounts, organization self-service, multi-person approval, scheduled publication, scheduled-event calendars, and RSVP/registration.
- Public-site redesign, framework migration, arbitrary page builders, booth maps, booth assignments, and venue-layout editing.
- Academic-year editions and public annual archives. Publication-history recovery remains included.
- A staging environment, issue-tracker publication, unrelated skill-install changes, or emailing unspecified recipients.

## Further Notes

The user will supply environment values for the existing Supabase project. Environment values alone do not provision tables, policies, Storage, backend functions, or Auth SMTP; the implementation includes setup tooling and documentation for those operations. Production activation and actual email delivery can only be verified once valid project configuration and the verified Resend sender are available.
