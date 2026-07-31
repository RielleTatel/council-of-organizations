# COA-Z SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every route on the COA-Z site meaningful, unique metadata, a discoverable/crawlable sitemap and robots policy, structured data for richer search results, and confirm the site's existing semantic HTML / internal linking meet the same bar — all without SSR, prerendering, or a framework migration.

**Architecture:** Everything here is either (a) a small addition to the existing `react-helmet-async`-based `<Seo>` component, (b) a build-time Node/Bun script that writes a static file into `public/` from data that already lives in `src/data/`, or (c) a source-level audit against the live codebase. No new client-side runtime behavior, no new routing.

**Tech Stack:** React 19, Vite, React Router v7, react-helmet-async (already installed), Bun (this repo's actual build tool — confirmed via `bun.lock` and the Netlify build log, which runs `bun run build`). No new dependencies.

## Global Constraints

- Production URL: `https://coa-z-adzu.netlify.app` (same domain confirmed and used in the prior Static Open Graph plan — `docs/superpowers/plans/2026-07-31-static-open-graph.md`).
- Single source of truth for that URL is `src/config/site.ts`'s `siteConfig.url` — every task that needs the site origin imports it from there. Never hardcode the domain a second time in application code.
- No new npm/bun dependencies for any task in this plan.
- No SSR, prerendering, or Netlify Edge Functions — confirmed out of scope by the spec this plan implements.
- Every new script or component gets a test. This codebase's existing test style is lightweight: pure functions get direct unit tests, and file-shaped output (HTML, generated XML) gets asserted by reading the file back and checking its content — follow that pattern, not React Testing Library (not installed, and not needed here).

## Scope note (read before starting)

The source spec bundles 10 phases (2 through 11 — Phase 1, Static Open Graph, already shipped) into one document. Following this plan's own guidance about not planning past what's actually knowable yet: **Tasks 1–13 below are fully specified and ready to implement now** — I already audited the live codebase while writing this plan and know exactly what needs to change. **Tasks 14–16 (Core Web Vitals, deeper Accessibility, Google Search Console) are audit-first** — Core Web Vitals and accessibility both require running real tools (Lighthouse, axe) against the live site before anything can honestly be prescribed, and GSC is a manual dashboard task, not code. Their tasks below define exactly how to run those audits and what to do with the results; a follow-up plan should be written once those results exist, rather than guessing now.

Two audit findings are worth knowing up front, because they change what "Phase 6: Semantic HTML" and "Phase 7: Image Optimization" actually require:

- **Semantic HTML is already in good shape.** `Navbar.tsx` already uses `<header>`/`<nav>`, `SiteLayout.tsx` already wraps routed content in `<main>`, `Footer.tsx` already uses `<footer>`, `EventCard.tsx` already uses `<article>`, and every page already renders exactly one `<h1>`. Task 11 locks this in with a regression test rather than rewriting anything.
- **Two large unused image files exist:** `public/header.png` (9.2MB) and `public/map.png` (6.2MB), both 6515×4342px and referenced nowhere in `src/`. Deleting them is a zero-risk ~15.5MB win, included in Task 12.

---

## File Structure

- `src/config/site.ts` — **modify.** Guard `siteConfig.url` so it resolves under both Vite (browser) and plain Bun/Node (build scripts) execution, with the production domain as a hard fallback.
- `src/components/Seo.tsx` — **modify.** Add `canonical` and `noindex` props.
- `src/components/Seo.test.ts` — **modify.** Extend existing source-inspection tests to cover the new props.
- 11 page files under `src/pages/` — **modify.** Pass `canonical`/`noindex` into their existing `<Seo>` calls.
- `scripts/generate-sitemap.ts` — **create.** Build-time script that writes `public/sitemap.xml` from `src/data/organizations.ts` and `src/data/mock.ts`.
- `src/scripts/generate-sitemap.test.ts` — **create.** Can't easily unit-test a script that writes to `public/` without side effects in CI, so instead this tests the pure route-list-building logic, factored out into `scripts/routes.ts`.
- `scripts/routes.ts` — **create.** Pure function producing the full list of site routes — the piece of `generate-sitemap.ts` that's actually worth unit testing.
- `tsconfig.scripts.json` — **create.** `scripts/` needs its own tsconfig (see Task 4 Step 7) — pulling it into the existing `tsconfig.node.json` project breaks, because that project's `nodenext` module resolution requires explicit file extensions on relative imports, which conflicts with how `src/data/mock.ts` already imports from `src/lib/contentful/types` (no extension, correct under `tsconfig.app.json`'s `bundler` resolution). A dedicated project avoids forcing a resolution-mode conflict onto existing `src/` files.
- `tsconfig.json` — **modify.** Add `tsconfig.scripts.json` as a third project reference.
- `package.json` — **modify.** Wire the sitemap generator into the `build` script.
- `public/robots.txt` — **create.**
- `src/lib/schema.ts` — **create.** Pure JSON-LD builder functions (`organizationSchema`, `educationalOrganizationSchema`, `eventSchema`, `breadcrumbListSchema`).
- `src/lib/schema.test.ts` — **create.**
- `src/components/JsonLd.tsx` — **create.** Tiny Helmet wrapper that serializes a schema object into a `<script type="application/ld+json">` tag.
- `src/pages/Home.tsx` — **modify.** Add Organization schema.
- `src/pages/OrganizationProfile.tsx` — **modify.** Add EducationalOrganization + BreadcrumbList schema.
- `src/pages/RecWeek.tsx` — **modify.** Add Event schema.
- `src/pages/EventDetail.tsx` — **modify.** Add BreadcrumbList schema.
- `src/pages/RecWeekMap.tsx` — **modify.** Add BreadcrumbList schema.
- `src/components/layout/SiteLayout.test.ts`, `src/components/layout/Navbar.test.ts`, `src/components/layout/Footer.test.ts`, `src/lib/h1Count.test.ts` — **create.** Regression tests locking in the semantic-HTML audit findings.
- `src/components/organizations/PinnedCard.tsx` — **modify.** Fix missing logo `alt` text.
- `public/header.png`, `public/map.png` — **delete.**
- `src/pages/Leadership.tsx`, `src/pages/About.tsx`, `src/pages/RecWeek.tsx` — **modify.** Add the missing internal links found in the Task 13 audit.

---

### Task 1: Fix `siteConfig.url` so it works in both the browser and build scripts

**Files:**
- Modify: `src/config/site.ts`

**Interfaces:**
- Produces: `siteConfig.url`, a non-empty string, resolvable whether the importing code runs under Vite (browser/app) or Bun (a plain build script like Task 4's sitemap generator).

- [ ] **Step 1: Write the failing test**

Create `src/config/site.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { siteConfig } from './site'

describe('siteConfig.url', () => {
  it('is a non-empty absolute URL', () => {
    expect(siteConfig.url).toMatch(/^https:\/\/.+/)
  })

  it('has no trailing slash, so path concatenation like `${url}${path}` never double-slashes', () => {
    expect(siteConfig.url.endsWith('/')).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bunx vitest run src/config/site.test.ts` (or `npx vitest run src/config/site.test.ts`)

Expected: currently `siteConfig.url` is `(import.meta.env.VITE_SITE_URL as string) ?? ''`, which evaluates to `''` since `VITE_SITE_URL` isn't set anywhere — so the first assertion fails (`''` doesn't match `/^https:\/\/.+/`).

- [ ] **Step 3: Fix `site.ts`**

Current:

```typescript
export const siteConfig = {
  name: 'COA-Z',
  fullName: 'Council of Organizations of the Ateneo - Zamboanga',
  description:
    'The official website of the Council of Organizations of the Ateneo - Zamboanga.',
  url: (import.meta.env.VITE_SITE_URL as string) ?? '',
  email: 'cola@adzu.edu.ph',
  socialLinks: {
    facebook: 'https://www.facebook.com/coazadzu',
    instagram: '',
    twitter: '',
  },
}
```

Replace the `url` line with:

```typescript
export const siteConfig = {
  name: 'COA-Z',
  fullName: 'Council of Organizations of the Ateneo - Zamboanga',
  description:
    'The official website of the Council of Organizations of the Ateneo - Zamboanga.',
  // import.meta.env only exists under Vite; this file is also imported directly by
  // scripts/generate-sitemap.ts, which runs under plain Bun — so guard the access
  // and fall back to the real production domain either way.
  url: (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_SITE_URL || 'https://coa-z-adzu.netlify.app',
  email: 'cola@adzu.edu.ph',
  socialLinks: {
    facebook: 'https://www.facebook.com/coazadzu',
    instagram: '',
    twitter: '',
  },
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bunx vitest run src/config/site.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/config/site.ts src/config/site.test.ts
git commit -m "fix: make siteConfig.url resolve under both Vite and plain Bun scripts"
```

---

### Task 2: Add canonical URL and noindex support to Seo.tsx

**Files:**
- Modify: `src/components/Seo.tsx`
- Modify: `src/components/Seo.test.ts`

**Interfaces:**
- Consumes: `siteConfig.url` from Task 1.
- Produces: `<Seo title description canonical? noindex? />` — `canonical` is a site-relative path (e.g. `"/organizations/aicg"`); the component resolves it to an absolute URL. Every page in Task 3 relies on this exact prop shape.

- [ ] **Step 1: Write the failing test**

Current `src/components/Seo.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = readFileSync(resolve(__dirname, './Seo.tsx'), 'utf-8')

describe('Seo', () => {
  it('sets the page title and description', () => {
    expect(source).toContain('<title>{title}</title>')
    expect(source).toContain('name="description" content={description}')
  })

  it('does not set og:* or twitter:* tags, since those are static in index.html', () => {
    expect(source).not.toContain('og:title')
    expect(source).not.toContain('og:description')
    expect(source).not.toContain('twitter:card')
  })
})
```

Add two more tests to the same file (append inside the `describe` block, before the closing `})`):

```typescript
  it('renders a canonical link when canonical is provided', () => {
    expect(source).toContain('rel="canonical"')
    expect(source).toContain('siteConfig.url')
  })

  it('renders a noindex robots tag when noindex is true', () => {
    expect(source).toContain('noindex')
  })
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bunx vitest run src/components/Seo.test.ts`
Expected: FAIL — 2 new failures, since `Seo.tsx` doesn't reference `canonical`, `siteConfig`, or `noindex` yet.

- [ ] **Step 3: Update Seo.tsx**

Current:

```tsx
import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
}

/**
 * Sets the per-page browser tab title and SEO meta description.
 *
 * Deliberately does NOT touch og:* or twitter:* tags — those are static,
 * defined once in index.html, and shared by every page (see
 * docs/superpowers/plans/2026-07-31-static-open-graph.md). Setting them here
 * too would only affect clients that run JavaScript (most link-preview
 * scrapers don't), and would make those clients see a different preview
 * per page than everyone else, defeating the point of the static approach.
 */
export function Seo({ title, description }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}
```

Replace with:

```tsx
import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../config/site'

interface SeoProps {
  title: string
  description: string
  /** Site-relative path, e.g. "/organizations/aicg". Omit on pages with no single canonical URL (loading states, not-found states). */
  canonical?: string
  /** Set on not-found/error states so search engines don't index them. */
  noindex?: boolean
}

/**
 * Sets the per-page browser tab title, SEO meta description, canonical URL,
 * and (optionally) a noindex directive.
 *
 * Deliberately does NOT touch og:* or twitter:* tags — those are static,
 * defined once in index.html, and shared by every page (see
 * docs/superpowers/plans/2026-07-31-static-open-graph.md). Setting them here
 * too would only affect clients that run JavaScript (most link-preview
 * scrapers don't), and would make those clients see a different preview
 * per page than everyone else, defeating the point of the static approach.
 */
export function Seo({ title, description, canonical, noindex }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${siteConfig.url}${canonical}`} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bunx vitest run src/components/Seo.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Full suite + typecheck**

```bash
bun run build
bun run test
```
Expected: both clean (nothing else references `Seo` in a way this breaks — `canonical`/`noindex` are optional, so every existing `<Seo title description />` call still compiles).

- [ ] **Step 6: Commit**

```bash
git add src/components/Seo.tsx src/components/Seo.test.ts
git commit -m "feat: add canonical URL and noindex support to Seo"
```

---

### Task 3: Wire canonical/noindex into every page

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/Leadership.tsx`
- Modify: `src/pages/Organizations.tsx`
- Modify: `src/pages/OrganizationProfile.tsx`
- Modify: `src/pages/RecWeek.tsx`
- Modify: `src/pages/RecWeekMap.tsx`
- Modify: `src/pages/Events.tsx`
- Modify: `src/pages/EventDetail.tsx`
- Modify: `src/pages/NotFound.tsx`

**Interfaces:**
- Consumes: `Seo`'s `canonical`/`noindex` props from Task 2.

- [ ] **Step 1: Static pages — one canonical each**

`src/pages/Home.tsx` line 15, change:
```tsx
      <Seo title={defaultSeo.title} description={defaultSeo.description} />
```
to:
```tsx
      <Seo title={defaultSeo.title} description={defaultSeo.description} canonical="/" />
```

`src/pages/About.tsx` lines 65–68, change:
```tsx
      <Seo
        title="About COA-Z | COA-Z"
        description="Who we are, our purpose, vision, mission, and core principles as the alliance of accredited organizations of Ateneo de Zamboanga University."
      />
```
to:
```tsx
      <Seo
        title="About COA-Z | COA-Z"
        description="Who we are, our purpose, vision, mission, and core principles as the alliance of accredited organizations of Ateneo de Zamboanga University."
        canonical="/about"
      />
```

`src/pages/Leadership.tsx` lines 19–22, change:
```tsx
      <Seo
        title="Leadership | COA-Z"
        description="The Executive Board of COA-Z: five offices and the Buklod Atenista Envoy Committee serving the Council and its member organizations."
      />
```
to:
```tsx
      <Seo
        title="Leadership | COA-Z"
        description="The Executive Board of COA-Z: five offices and the Buklod Atenista Envoy Committee serving the Council and its member organizations."
        canonical="/leadership"
      />
```

`src/pages/Organizations.tsx` lines 29–32, change:
```tsx
      <Seo
        title="Organizations | COA-Z"
        description="Explore the accredited member organizations of COA-Z, grouped into eight clusters of student formation at Ateneo de Zamboanga University."
      />
```
to:
```tsx
      <Seo
        title="Organizations | COA-Z"
        description="Explore the accredited member organizations of COA-Z, grouped into eight clusters of student formation at Ateneo de Zamboanga University."
        canonical="/organizations"
      />
```

`src/pages/RecWeek.tsx` lines 8–11, change:
```tsx
      <Seo
        title="RecWeek 2026 | COA-Z"
        description="RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026."
      />
```
to:
```tsx
      <Seo
        title="RecWeek 2026 | COA-Z"
        description="RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026."
        canonical="/recweek"
      />
```

`src/pages/RecWeekMap.tsx` lines 31–34, change:
```tsx
      <Seo
        title="RecWeek Booth Map | COA-Z"
        description="Explore booth locations across the three RecWeek venues at Ateneo de Zamboanga University."
      />
```
to:
```tsx
      <Seo
        title="RecWeek Booth Map | COA-Z"
        description="Explore booth locations across the three RecWeek venues at Ateneo de Zamboanga University."
        canonical="/recweek/map"
      />
```

`src/pages/Events.tsx` lines 26–29, change:
```tsx
      <Seo
        title="Event Highlights | COA-Z"
        description="COA-Z's editorial newsroom: curated stories celebrating the accomplishments, initiatives, and activities of accredited student organizations."
      />
```
to:
```tsx
      <Seo
        title="Event Highlights | COA-Z"
        description="COA-Z's editorial newsroom: curated stories celebrating the accomplishments, initiatives, and activities of accredited student organizations."
        canonical="/events"
      />
```

- [ ] **Step 2: Dynamic pages — canonical when found, noindex when not**

`src/pages/OrganizationProfile.tsx` line 34 (not-found branch), change:
```tsx
        <Seo title="Organization Not Found | COA-Z" description="The organization you are looking for could not be found." />
```
to:
```tsx
        <Seo title="Organization Not Found | COA-Z" description="The organization you are looking for could not be found." noindex />
```

`src/pages/OrganizationProfile.tsx` line 55 (found branch), change:
```tsx
      <Seo title={`${organization.name} | COA-Z`} description={organization.description} />
```
to:
```tsx
      <Seo title={`${organization.name} | COA-Z`} description={organization.description} canonical={`/organizations/${organization.slug}`} />
```

`src/pages/EventDetail.tsx` line 35 (not-found branch), change:
```tsx
        <Seo title="Story Not Found | COA-Z" description="The story you are looking for could not be found." />
```
to:
```tsx
        <Seo title="Story Not Found | COA-Z" description="The story you are looking for could not be found." noindex />
```

`src/pages/EventDetail.tsx` line 55 (found branch), change:
```tsx
      <Seo title={`${event.title} | COA-Z`} description={event.excerpt ?? event.description} />
```
to:
```tsx
      <Seo title={`${event.title} | COA-Z`} description={event.excerpt ?? event.description} canonical={`/events/${event.slug}`} />
```

`src/pages/NotFound.tsx` line 10, change:
```tsx
      <Seo title="Page Not Found | COA-Z" description="The page you are looking for could not be found." />
```
to:
```tsx
      <Seo title="Page Not Found | COA-Z" description="The page you are looking for could not be found." noindex />
```

- [ ] **Step 3: Write the regression test**

Create `src/pages/seoCoverage.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const PAGES_WITH_STATIC_CANONICAL: Record<string, string> = {
  'Home.tsx': '/',
  'About.tsx': '/about',
  'Leadership.tsx': '/leadership',
  'Organizations.tsx': '/organizations',
  'RecWeek.tsx': '/recweek',
  'RecWeekMap.tsx': '/recweek/map',
  'Events.tsx': '/events',
}

const PAGES_WITH_NOINDEX = ['NotFound.tsx']

describe('every static page declares a canonical URL', () => {
  for (const [file, path] of Object.entries(PAGES_WITH_STATIC_CANONICAL)) {
    it(`${file} sets canonical="${path}"`, () => {
      const source = readFileSync(resolve(__dirname, file), 'utf-8')
      expect(source).toContain(`canonical="${path}"`)
    })
  }
})

describe('error/not-found pages are marked noindex', () => {
  for (const file of PAGES_WITH_NOINDEX) {
    it(`${file} sets noindex`, () => {
      const source = readFileSync(resolve(__dirname, file), 'utf-8')
      expect(source).toContain('noindex')
    })
  }

  it('OrganizationProfile.tsx sets noindex on its not-found branch and a dynamic canonical on its found branch', () => {
    const source = readFileSync(resolve(__dirname, 'OrganizationProfile.tsx'), 'utf-8')
    expect(source).toContain('noindex')
    expect(source).toContain('canonical={`/organizations/${organization.slug}`}')
  })

  it('EventDetail.tsx sets noindex on its not-found branch and a dynamic canonical on its found branch', () => {
    const source = readFileSync(resolve(__dirname, 'EventDetail.tsx'), 'utf-8')
    expect(source).toContain('noindex')
    expect(source).toContain('canonical={`/events/${event.slug}`}')
  })
})
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/pages/seoCoverage.test.ts`
Expected: PASS (11 tests)

- [ ] **Step 5: Full suite + typecheck**

```bash
bun run build
bun run test
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: add canonical URLs and noindex directives to every page"
```

---

### Task 4: Sitemap generation

**Files:**
- Create: `scripts/routes.ts`
- Create: `src/scripts/generate-sitemap.test.ts`
- Create: `scripts/generate-sitemap.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `organizations` from `src/data/organizations.ts` (each has `.id`), `mockEvents` from `src/data/mock.ts` (each has `.slug`), `siteConfig.url` from Task 1.
- Produces: `siteRoutes(): string[]` (pure, testable — the full list of site-relative paths), and `public/sitemap.xml` (the file `generate-sitemap.ts` writes using that list).

- [ ] **Step 1: Write the failing test**

Create `src/scripts/generate-sitemap.test.ts` (this lives under `src/` so Vitest's existing `include: ['src/**/*.test.ts']` picks it up, even though the code it tests lives in `scripts/`):

```typescript
import { describe, it, expect } from 'vitest'
import { siteRoutes } from '../../scripts/routes'

describe('siteRoutes', () => {
  it('includes every static top-level route', () => {
    const routes = siteRoutes()
    expect(routes).toContain('/')
    expect(routes).toContain('/about')
    expect(routes).toContain('/leadership')
    expect(routes).toContain('/organizations')
    expect(routes).toContain('/events')
    expect(routes).toContain('/recweek')
    expect(routes).toContain('/recweek/map')
  })

  it('includes one route per organization', () => {
    const routes = siteRoutes()
    expect(routes).toContain('/organizations/el-consejo-atenista')
    expect(routes.filter((r) => r.startsWith('/organizations/')).length).toBeGreaterThanOrEqual(47)
  })

  it('includes one route per event highlight', () => {
    const routes = siteRoutes()
    expect(routes).toContain('/events/recweek-orgfair-2026')
  })

  it('has no duplicate routes', () => {
    const routes = siteRoutes()
    expect(new Set(routes).size).toBe(routes.length)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bunx vitest run src/scripts/generate-sitemap.test.ts`
Expected: FAIL — `scripts/routes.ts` doesn't exist yet.

- [ ] **Step 3: Write `scripts/routes.ts`**

```typescript
import { organizations } from '../src/data/organizations'
import { mockEvents } from '../src/data/mock'

const STATIC_ROUTES = ['/', '/about', '/leadership', '/organizations', '/events', '/recweek', '/recweek/map']

/** Every crawlable site-relative path — the "not found" catch-all route is deliberately excluded. */
export function siteRoutes(): string[] {
  const orgRoutes = organizations.map((org) => `/organizations/${org.id}`)
  const eventRoutes = mockEvents.map((event) => `/events/${event.slug}`)
  return [...STATIC_ROUTES, ...orgRoutes, ...eventRoutes]
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/scripts/generate-sitemap.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Write `scripts/generate-sitemap.ts`**

```typescript
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/config/site'
import { siteRoutes } from './routes'

const routes = siteRoutes()

const urlEntries = routes
  .map((path) => `  <url>\n    <loc>${siteConfig.url}${path}</loc>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

const outPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
writeFileSync(outPath, xml)

console.log(`sitemap.xml: wrote ${routes.length} routes to ${outPath}`)
```

- [ ] **Step 6: Run it manually and inspect the output**

```bash
bun scripts/generate-sitemap.ts
cat public/sitemap.xml | head -20
grep -c "<url>" public/sitemap.xml
```

Expected: prints `sitemap.xml: wrote 56 routes to .../public/sitemap.xml` (7 static + 47 orgs + 2 events at the time of writing this plan — re-verify the exact count against the current data files, since this number grows as orgs/events are added), and `grep -c` matches that count.

- [ ] **Step 7: Give `scripts/` its own tsconfig project**

`bun run build` runs `tsc -b`, which typechecks via project references in `tsconfig.json` — but `scripts/` isn't included in either existing project (`tsconfig.app.json` only includes `src`; `tsconfig.node.json` only includes `vite.config.ts`), so without this step, type errors in `scripts/routes.ts` or `scripts/generate-sitemap.ts` would silently never be caught by `bun run build`.

Adding `scripts` to `tsconfig.node.json`'s `include` does **not** work — verified while writing this plan: that project uses `"module": "nodenext"`, which requires explicit file extensions on relative imports (`from '../src/data/mock.ts'`, not `from '../src/data/mock'`), and pulling `src/data/mock.ts` into that project (transitively, since `routes.ts` imports it) breaks, because `mock.ts` itself imports `from '../lib/contentful/types'` with no extension — correct under `tsconfig.app.json`'s `"moduleResolution": "bundler"`, but a hard error once type-checked under `nodenext`. Create a dedicated project instead so `scripts/` gets its own resolution rules without forcing changes onto `src/`.

Create `tsconfig.scripts.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.scripts.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["node"],
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "skipLibCheck": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["scripts"]
}
```

`tsconfig.json` currently:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Change to:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.scripts.json" }
  ]
}
```

This also means `scripts/generate-sitemap.ts`'s import of `siteConfig` from `src/config/site.ts` gets typechecked under this new project — which is exactly what surfaces the need for Task 1's fix: without it, `tsc -b` fails here with `Property 'env' does not exist on type 'ImportMeta'`, since `tsconfig.scripts.json` doesn't carry the `vite/client` type augmentation that makes `import.meta.env` valid under `tsconfig.app.json`. (Confirmed by reproducing this error directly, then fixing it with the Task 1 change, while writing this plan — Task 1 must land before this step will pass.)

- [ ] **Step 8: Verify `tsc -b` now typechecks scripts/, and actually catches errors**

```bash
npx tsc -b
```

Expected: clean, no output. Then confirm it isn't silently skipping the new files — introduce a deliberate error and confirm it's caught:

```bash
sed -i '' 's/org.id/org.nonexistentField/' scripts/routes.ts
npx tsc -b
```

Expected: `error TS2339: Property 'nonexistentField' does not exist on type 'Organization'.` Then revert it:

```bash
sed -i '' 's/org.nonexistentField/org.id/' scripts/routes.ts
npx tsc -b
```

Expected: clean again.

- [ ] **Step 9: Wire the generator into the build**

`package.json` currently has:

```json
    "build": "tsc -b && vite build",
```

Change to:

```json
    "build": "bun scripts/generate-sitemap.ts && tsc -b && vite build",
```

(Runs before `tsc -b`/`vite build` so the freshly generated `public/sitemap.xml` gets both typechecked-around and copied into `dist/` along with everything else in `public/`.)

- [ ] **Step 10: Verify the full build picks it up**

```bash
bun run build
ls -la dist/sitemap.xml
grep -c "<url>" dist/sitemap.xml
```

Expected: file exists in `dist/`, same route count as Step 6. (Verified end-to-end while writing this plan — `bun run build` succeeds cleanly with all of Tasks 1 and 4 applied together.)

- [ ] **Step 11: Commit**

```bash
git add scripts/routes.ts scripts/generate-sitemap.ts tsconfig.scripts.json tsconfig.json src/scripts/generate-sitemap.test.ts package.json public/sitemap.xml
git commit -m "feat: generate sitemap.xml at build time from real route data"
```

(`public/sitemap.xml` is committed here as the current snapshot; every future `bun run build` regenerates it, so it never goes stale in a deployed build even if someone forgets to regenerate it locally before committing other changes.)

---

### Task 5: robots.txt

**Files:**
- Create: `public/robots.txt`

**Interfaces:** none — static file.

- [ ] **Step 1: Create the file**

```txt
User-agent: *
Allow: /

Sitemap: https://coa-z-adzu.netlify.app/sitemap.xml
```

- [ ] **Step 2: Verify it ships in the build**

```bash
bun run build
cat dist/robots.txt
```

Expected: prints the file contents unchanged (Vite copies everything in `public/` as-is).

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt"
```

---

### Task 6: JSON-LD schema builders

**Files:**
- Create: `src/lib/schema.ts`
- Create: `src/lib/schema.test.ts`
- Create: `src/components/JsonLd.tsx`

**Interfaces:**
- Consumes: `siteConfig` from `src/config/site.ts`.
- Produces: `organizationSchema()`, `educationalOrganizationSchema(org)`, `eventSchema(input)`, `breadcrumbListSchema(items)` — all pure functions returning plain JSON-LD objects — and `<JsonLd data={...} />`, consumed by Tasks 7–10.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/schema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  organizationSchema,
  educationalOrganizationSchema,
  eventSchema,
  breadcrumbListSchema,
} from './schema'

describe('organizationSchema', () => {
  it('describes COA-Z itself', () => {
    const schema = organizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('Council of Organizations of the Ateneo - Zamboanga')
    expect(schema.url).toBe('https://coa-z-adzu.netlify.app')
    expect(schema.sameAs).toContain('https://www.facebook.com/coazadzu')
  })
})

describe('educationalOrganizationSchema', () => {
  it('describes a member organization with a parentOrganization back-reference', () => {
    const schema = educationalOrganizationSchema({
      name: 'Ateneo Debate Union',
      description: 'Develops critical thinking and public speaking.',
      slug: 'ateneo-debate-union',
    })
    expect(schema['@type']).toBe('EducationalOrganization')
    expect(schema.name).toBe('Ateneo Debate Union')
    expect(schema.url).toBe('https://coa-z-adzu.netlify.app/organizations/ateneo-debate-union')
    expect(schema.parentOrganization).toMatchObject({ '@type': 'Organization', name: 'Council of Organizations of the Ateneo - Zamboanga' })
  })

  it('includes an absolute logo URL only when a logo path is given', () => {
    const withLogo = educationalOrganizationSchema({
      name: 'X',
      description: 'Y',
      slug: 'x',
      logo: '/logos/X.jpg',
    })
    expect(withLogo.logo).toBe('https://coa-z-adzu.netlify.app/logos/X.jpg')

    const withoutLogo = educationalOrganizationSchema({ name: 'X', description: 'Y', slug: 'x' })
    expect(withoutLogo.logo).toBeUndefined()
  })
})

describe('eventSchema', () => {
  it('describes a physical, scheduled event at AdZU', () => {
    const schema = eventSchema({
      name: 'Dia de Colores | RecWeek OrgFair 2026',
      startDate: '2026-08-03',
      endDate: '2026-08-07',
      description: 'RecWeek 2026 at Ateneo de Zamboanga University.',
      url: 'https://coa-z-adzu.netlify.app/recweek',
    })
    expect(schema['@type']).toBe('Event')
    expect(schema.startDate).toBe('2026-08-03')
    expect(schema.endDate).toBe('2026-08-07')
    expect(schema.eventStatus).toBe('https://schema.org/EventScheduled')
    expect(schema.location).toMatchObject({ '@type': 'Place', name: 'Ateneo de Zamboanga University' })
  })
})

describe('breadcrumbListSchema', () => {
  it('builds a positioned, absolute-URL breadcrumb trail', () => {
    const schema = breadcrumbListSchema([
      { name: 'Home', path: '/' },
      { name: 'Organizations', path: '/organizations' },
      { name: 'Ateneo Debate Union', path: '/organizations/ateneo-debate-union' },
    ])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toHaveLength(3)
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, name: 'Home', item: 'https://coa-z-adzu.netlify.app/' })
    expect(schema.itemListElement[2]).toMatchObject({
      position: 3,
      name: 'Ateneo Debate Union',
      item: 'https://coa-z-adzu.netlify.app/organizations/ateneo-debate-union',
    })
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bunx vitest run src/lib/schema.test.ts`
Expected: FAIL — `src/lib/schema.ts` doesn't exist yet.

- [ ] **Step 3: Write `src/lib/schema.ts`**

```typescript
import { siteConfig } from '../config/site'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/Icon.png`,
    description: siteConfig.description,
    sameAs: [siteConfig.socialLinks.facebook, siteConfig.socialLinks.instagram, siteConfig.socialLinks.twitter].filter(
      (link): link is string => Boolean(link),
    ),
  }
}

interface EducationalOrgInput {
  name: string
  description: string
  slug: string
  logo?: string
}

export function educationalOrganizationSchema(org: EducationalOrgInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: org.name,
    description: org.description,
    url: `${siteConfig.url}/organizations/${org.slug}`,
    logo: org.logo ? `${siteConfig.url}${org.logo}` : undefined,
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  }
}

interface EventInput {
  name: string
  startDate: string
  endDate: string
  description: string
  url: string
}

export function eventSchema(input: EventInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Ateneo de Zamboanga University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Zamboanga City',
        addressCountry: 'PH',
      },
    },
    description: input.description,
    url: input.url,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  }
}

export interface BreadcrumbItem {
  name: string
  /** Site-relative path, e.g. "/organizations/aicg". */
  path: string
}

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/lib/schema.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Write `src/components/JsonLd.tsx`**

```tsx
import { Helmet } from 'react-helmet-async'

interface JsonLdProps {
  data: object
}

/** Injects a JSON-LD structured data block into the page head. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
```

- [ ] **Step 6: Typecheck**

```bash
bun run build
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/schema.ts src/lib/schema.test.ts src/components/JsonLd.tsx
git commit -m "feat: add JSON-LD schema builders and JsonLd component"
```

---

### Task 7: Organization schema on the homepage

**Files:**
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `organizationSchema()` and `<JsonLd>` from Task 6.

- [ ] **Step 1: Read the current file**

`src/pages/Home.tsx` currently (relevant lines):

```tsx
import { Seo } from '../components/Seo'
import { defaultSeo } from '../config/seo'
...
export default function Home() {
  return (
    <>
      <Seo title={defaultSeo.title} description={defaultSeo.description} canonical="/" />
      <Hero />
      ...
```

(Assumes Task 3 already landed, so `canonical="/"` is already there.)

- [ ] **Step 2: Add the schema**

Add the import:

```tsx
import { JsonLd } from '../components/JsonLd'
import { organizationSchema } from '../lib/schema'
```

Add `<JsonLd data={organizationSchema()} />` immediately after the `<Seo ... />` line:

```tsx
      <Seo title={defaultSeo.title} description={defaultSeo.description} canonical="/" />
      <JsonLd data={organizationSchema()} />
      <Hero />
```

- [ ] **Step 3: Write the regression test**

Create `src/pages/homeSchema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Home page structured data', () => {
  it('renders the Organization JSON-LD schema', () => {
    const source = readFileSync(resolve(__dirname, 'Home.tsx'), 'utf-8')
    expect(source).toContain('organizationSchema()')
    expect(source).toContain('<JsonLd')
  })
})
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/pages/homeSchema.test.ts && bun run build`

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/homeSchema.test.ts
git commit -m "feat: add Organization JSON-LD schema to the homepage"
```

---

### Task 8: EducationalOrganization schema on organization profile pages

**Files:**
- Modify: `src/pages/OrganizationProfile.tsx`

**Interfaces:**
- Consumes: `educationalOrganizationSchema()`, `breadcrumbListSchema()`, `<JsonLd>` from Task 6.

- [ ] **Step 1: Add the imports**

In `src/pages/OrganizationProfile.tsx`, add:

```tsx
import { JsonLd } from '../components/JsonLd'
import { educationalOrganizationSchema, breadcrumbListSchema } from '../lib/schema'
```

- [ ] **Step 2: Add both schemas after the Seo tag**

Current (found branch, after Task 3 lands):

```tsx
      <Seo title={`${organization.name} | COA-Z`} description={organization.description} canonical={`/organizations/${organization.slug}`} />

      <section className="relative bg-canvas-cream pt-28 pb-16 md:pt-32 md:pb-20">
```

Change to:

```tsx
      <Seo title={`${organization.name} | COA-Z`} description={organization.description} canonical={`/organizations/${organization.slug}`} />
      <JsonLd
        data={educationalOrganizationSchema({
          name: organization.name,
          description: organization.description,
          slug: organization.slug,
          logo: organization.logo,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Organizations', path: '/organizations' },
          { name: organization.name, path: `/organizations/${organization.slug}` },
        ])}
      />

      <section className="relative bg-canvas-cream pt-28 pb-16 md:pt-32 md:pb-20">
```

- [ ] **Step 3: Write the regression test**

Create `src/pages/organizationProfileSchema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('OrganizationProfile structured data', () => {
  it('renders EducationalOrganization and BreadcrumbList JSON-LD', () => {
    const source = readFileSync(resolve(__dirname, 'OrganizationProfile.tsx'), 'utf-8')
    expect(source).toContain('educationalOrganizationSchema(')
    expect(source).toContain('breadcrumbListSchema([')
    expect((source.match(/<JsonLd/g) ?? []).length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/pages/organizationProfileSchema.test.ts && bun run build`

- [ ] **Step 5: Commit**

```bash
git add src/pages/OrganizationProfile.tsx src/pages/organizationProfileSchema.test.ts
git commit -m "feat: add EducationalOrganization and BreadcrumbList JSON-LD to organization pages"
```

---

### Task 9: Event schema on the RecWeek page

**Files:**
- Modify: `src/pages/RecWeek.tsx`

**Interfaces:**
- Consumes: `eventSchema()`, `<JsonLd>` from Task 6, `siteConfig.url` from Task 1.

- [ ] **Step 1: Read the current file**

`src/pages/RecWeek.tsx` (relevant lines, after Task 3 lands):

```tsx
import { Seo } from '../components/Seo'
...
      <Seo
        title="RecWeek 2026 | COA-Z"
        description="RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026."
        canonical="/recweek"
      />
      <RecWeekHero />
```

- [ ] **Step 2: Add the schema**

Add imports:

```tsx
import { JsonLd } from '../components/JsonLd'
import { eventSchema } from '../lib/schema'
import { siteConfig } from '../config/site'
```

Add the `<JsonLd>` call right after `<Seo>`, using the confirmed real dates from `docs/Organization Fair (RecWeek) 2026 Guidelines.pdf` (August 3–7, 2026 — already reflected in the page copy above):

```tsx
      <Seo
        title="RecWeek 2026 | COA-Z"
        description="RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026."
        canonical="/recweek"
      />
      <JsonLd
        data={eventSchema({
          name: 'Dia de Colores | RecWeek OrgFair 2026',
          startDate: '2026-08-03',
          endDate: '2026-08-07',
          description:
            "RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026.",
          url: `${siteConfig.url}/recweek`,
        })}
      />
      <RecWeekHero />
```

- [ ] **Step 3: Write the regression test**

Create `src/pages/recWeekSchema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('RecWeek structured data', () => {
  it('renders Event JSON-LD with the correct dates', () => {
    const source = readFileSync(resolve(__dirname, 'RecWeek.tsx'), 'utf-8')
    expect(source).toContain('eventSchema(')
    expect(source).toContain("startDate: '2026-08-03'")
    expect(source).toContain("endDate: '2026-08-07'")
  })
})
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/pages/recWeekSchema.test.ts && bun run build`

- [ ] **Step 5: Commit**

```bash
git add src/pages/RecWeek.tsx src/pages/recWeekSchema.test.ts
git commit -m "feat: add Event JSON-LD schema to the RecWeek page"
```

---

### Task 10: BreadcrumbList on Event Detail and RecWeek Map

**Files:**
- Modify: `src/pages/EventDetail.tsx`
- Modify: `src/pages/RecWeekMap.tsx`

**Interfaces:**
- Consumes: `breadcrumbListSchema()`, `<JsonLd>` from Task 6.

- [ ] **Step 1: EventDetail.tsx**

Add imports:

```tsx
import { JsonLd } from '../components/JsonLd'
import { breadcrumbListSchema } from '../lib/schema'
```

Current (found branch, after Task 3 lands):

```tsx
      <Seo title={`${event.title} | COA-Z`} description={event.excerpt ?? event.description} canonical={`/events/${event.slug}`} />

      <section className="bg-canvas-cream pt-24 md:pt-28">
```

Change to:

```tsx
      <Seo title={`${event.title} | COA-Z`} description={event.excerpt ?? event.description} canonical={`/events/${event.slug}`} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Event Highlights', path: '/events' },
          { name: event.title, path: `/events/${event.slug}` },
        ])}
      />

      <section className="bg-canvas-cream pt-24 md:pt-28">
```

- [ ] **Step 2: RecWeekMap.tsx**

Add imports:

```tsx
import { JsonLd } from '../components/JsonLd'
import { breadcrumbListSchema } from '../lib/schema'
```

Current (after Task 3 lands):

```tsx
      <Seo
        title="RecWeek Booth Map | COA-Z"
        description="Explore booth locations across the three RecWeek venues at Ateneo de Zamboanga University."
        canonical="/recweek/map"
      />
      <RecWeekMapHero />
```

Change to:

```tsx
      <Seo
        title="RecWeek Booth Map | COA-Z"
        description="Explore booth locations across the three RecWeek venues at Ateneo de Zamboanga University."
        canonical="/recweek/map"
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'RecWeek', path: '/recweek' },
          { name: 'Booth Map', path: '/recweek/map' },
        ])}
      />
      <RecWeekMapHero />
```

- [ ] **Step 3: Write the regression test**

Create `src/pages/breadcrumbSchema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Breadcrumb structured data', () => {
  it('EventDetail.tsx renders a BreadcrumbList', () => {
    const source = readFileSync(resolve(__dirname, 'EventDetail.tsx'), 'utf-8')
    expect(source).toContain('breadcrumbListSchema([')
  })

  it('RecWeekMap.tsx renders a BreadcrumbList', () => {
    const source = readFileSync(resolve(__dirname, 'RecWeekMap.tsx'), 'utf-8')
    expect(source).toContain('breadcrumbListSchema([')
  })
})
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/pages/breadcrumbSchema.test.ts && bun run build`

- [ ] **Step 5: Commit**

```bash
git add src/pages/EventDetail.tsx src/pages/RecWeekMap.tsx src/pages/breadcrumbSchema.test.ts
git commit -m "feat: add BreadcrumbList JSON-LD to event detail and booth map pages"
```

---

### Task 11: Lock in the existing semantic HTML with regression tests

**Files:**
- Create: `src/components/layout/semanticLandmarks.test.ts`
- Create: `src/lib/h1Count.test.ts`

**Interfaces:** none — read-only source assertions.

This task exists because the audit (see "Scope note" above) found the semantic HTML already correct. The goal here is to make sure it *stays* correct, not to change anything.

- [ ] **Step 1: Write the landmark test**

Create `src/components/layout/semanticLandmarks.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('site-wide semantic landmarks', () => {
  it('Navbar renders <header> and <nav>', () => {
    const source = readFileSync(resolve(__dirname, './Navbar.tsx'), 'utf-8')
    expect(source).toContain('<header')
    expect(source).toContain('<nav')
  })

  it('SiteLayout wraps routed page content in <main>', () => {
    const source = readFileSync(resolve(__dirname, './SiteLayout.tsx'), 'utf-8')
    expect(source).toContain('<main')
  })

  it('Footer renders <footer>', () => {
    const source = readFileSync(resolve(__dirname, './Footer.tsx'), 'utf-8')
    expect(source).toContain('<footer')
  })
})
```

- [ ] **Step 2: Run it to verify it passes immediately**

Run: `bunx vitest run src/components/layout/semanticLandmarks.test.ts`
Expected: PASS (3 tests) — no code changes needed, this locks in existing behavior.

- [ ] **Step 3: Write the one-`<h1>`-per-page test**

Create `src/lib/h1Count.test.ts`. This checks every page file plus the shared hero components pages render through, since several pages get their `<h1>` from a shared component (`PageHeader.tsx`) rather than inline:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function h1Count(relativePath: string): number {
  const source = readFileSync(resolve(__dirname, '..', relativePath), 'utf-8')
  return (source.match(/<h1[\s>]/g) ?? []).length
}

describe('every page renders exactly one <h1>, directly or via a shared hero component', () => {
  it('Home.tsx renders its <h1> via Hero.tsx', () => {
    expect(h1Count('pages/Home.tsx')).toBe(0)
    expect(h1Count('components/home/Hero.tsx')).toBe(1)
  })

  it('About.tsx, Leadership.tsx, Organizations.tsx, Events.tsx render their <h1> via the shared PageHeader.tsx', () => {
    for (const page of ['pages/About.tsx', 'pages/Leadership.tsx', 'pages/Organizations.tsx', 'pages/Events.tsx']) {
      expect(h1Count(page)).toBe(0)
    }
    expect(h1Count('components/shared/PageHeader.tsx')).toBe(1)
  })

  it('RecWeek.tsx renders its <h1> via RecWeekHero.tsx', () => {
    expect(h1Count('pages/RecWeek.tsx')).toBe(0)
    expect(h1Count('components/recweek/RecWeekHero.tsx')).toBe(1)
  })

  it('RecWeekMap.tsx renders its <h1> via RecWeekMapHero.tsx', () => {
    expect(h1Count('pages/RecWeekMap.tsx')).toBe(0)
    expect(h1Count('components/recweek/RecWeekMapHero.tsx')).toBe(1)
  })

  it('OrganizationProfile.tsx, EventDetail.tsx, and NotFound.tsx each render exactly one inline <h1>', () => {
    expect(h1Count('pages/OrganizationProfile.tsx')).toBe(2) // not-found branch + found branch, never both at once
    expect(h1Count('pages/EventDetail.tsx')).toBe(2) // same pattern
    expect(h1Count('pages/NotFound.tsx')).toBe(1)
  })
})
```

- [ ] **Step 4: Run it to verify it passes**

Run: `bunx vitest run src/lib/h1Count.test.ts`
Expected: PASS (5 tests). If any fail, that means the audit's assumptions are stale (a page changed since this plan was written) — investigate the actual current heading structure of that file before adjusting the test, don't just change the expected number to make it pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/semanticLandmarks.test.ts src/lib/h1Count.test.ts
git commit -m "test: lock in existing semantic HTML landmarks and one-h1-per-page structure"
```

---

### Task 12: Image optimization fixes

**Files:**
- Delete: `public/header.png`
- Delete: `public/map.png`
- Modify: `src/components/organizations/PinnedCard.tsx`

**Interfaces:** none.

- [ ] **Step 1: Confirm the two large files are truly unused before deleting**

```bash
grep -rn "header.png\|map.png" src public/*.html index.html 2>/dev/null
```

Expected: no output. (Already confirmed while writing this plan — re-check here in case something changed.)

- [ ] **Step 2: Delete them**

```bash
git rm public/header.png public/map.png
```

- [ ] **Step 3: Fix the missing alt text on PinnedCard's logo**

`src/components/organizations/PinnedCard.tsx` (in the directory/pinboard-style card used by `DiscoveryBoard.tsx` on the Organizations page), current:

```tsx
            <img
              src={organization.logo}
              alt=""
              loading="lazy"
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
```

Change to:

```tsx
            <img
              src={organization.logo}
              alt={organization.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
```

This matches the same pattern already correctly used by `OrganizationCard.tsx` (`alt={organization.name}`) and the inner logo circle in `OrganizationSpotlight.tsx` (`alt={`${org.name} logo`}`) — `PinnedCard.tsx` was the one inconsistent spot.

- [ ] **Step 4: Write the regression test**

Create `src/components/organizations/PinnedCard.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('PinnedCard', () => {
  it('gives the organization logo a descriptive alt, not an empty one', () => {
    const source = readFileSync(resolve(__dirname, './PinnedCard.tsx'), 'utf-8')
    expect(source).toContain('alt={organization.name}')
  })
})
```

- [ ] **Step 5: Run it to verify it passes**

Run: `bunx vitest run src/components/organizations/PinnedCard.test.ts`

- [ ] **Step 6: Note for follow-up, not fixed here (needs your confirmation, not assumed)**

Several images across the codebase (`EventCard.tsx`, `Events.tsx`'s featured image, `EventDetail.tsx`'s hero image, `RecWeekTimeline.tsx`'s milestone photos, `OrganizationSpotlight.tsx`'s hoop-frame background) are deliberately marked `alt="" role="presentation"` — both attributes set together, consistently, which reads as an intentional prior decision (treating these photos as decorative flourishes, with the real content carried by adjacent text) rather than an oversight. Giving them descriptive alt text (e.g. an event's photo captioned with the event title) would help image search visibility, but would reverse an existing, consistently-applied choice — flag this to whoever owns visual/content decisions before changing it, rather than silently overriding it here.

- [ ] **Step 7: Verify the build is smaller**

```bash
du -sh public/
bun run build
du -sh dist/
```

Expected: `public/` drops by ~15.5MB compared to before Step 2.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "fix: remove unused 15.5MB of orphaned images, fix PinnedCard logo alt text"
```

---

### Task 13: Internal linking gaps

**Files:**
- Modify: `src/pages/Leadership.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/RecWeek.tsx`

**Interfaces:** none — these are `<Link>` additions using React Router, already used throughout the app.

The audit (grep for `<Link to=` across `src/pages`) found that `Leadership.tsx`, `About.tsx`, and `RecWeek.tsx` currently have **zero** in-content links to other pages — only the global nav/footer link elsewhere. `Home.tsx` already links to `/organizations` (via the spotlight section's "View All Organizations" link), `OrganizationProfile.tsx` and `EventDetail.tsx` already link back to their list pages, and `RecWeekMap.tsx` is already linked *from* `RecWeek.tsx`'s timeline CTA. This task closes the three real gaps.

- [ ] **Step 1: Read the end of Leadership.tsx to find where to add the link**

`src/pages/Leadership.tsx` currently ends with the Buklod Atenista Envoy Committee section:

```tsx
      <section className="relative bg-trust-blue py-20 md:py-24">
        <ThreadBorder
          color="yellow"
          edge="top"
          className="absolute left-1/2 top-0 w-56 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90"
        />
        <Reveal className="mx-auto flex max-w-[800px] flex-col items-center gap-5 px-6 text-center">
          <FloatingAccent duration={6.5} distance={8} rotate={-6}>
            <EmbroideredAccent color="yellow" index={0} size={56} />
          </FloatingAccent>
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-linen-white md:text-3xl">
            {buklodCommittee.title}
          </h2>
          <p className="max-w-[60ch] font-body text-lg leading-relaxed text-linen-white/85">
            {buklodCommittee.description}
          </p>
        </Reveal>
      </section>
    </>
  )
}
```

Add a `Link` import at the top of the file if not already present:

```tsx
import { Link } from 'react-router-dom'
```

Add a link inside the closing `<Reveal>`, after the description paragraph:

```tsx
          <p className="max-w-[60ch] font-body text-lg leading-relaxed text-linen-white/85">
            {buklodCommittee.description}
          </p>
          <Link
            to="/organizations"
            className="font-body font-medium text-linen-white underline decoration-linen-white/50 underline-offset-4 transition-colors hover:text-thread-yellow"
          >
            Explore the organizations these leaders represent →
          </Link>
        </Reveal>
      </section>
```

- [ ] **Step 2: Add a link from About.tsx**

Read `src/pages/About.tsx`'s existing structure first (`grep -n "section\|Reveal" src/pages/About.tsx`) to find its final section, then add — inside that last section, after its closing paragraph — a link to Leadership:

```tsx
          <Link
            to="/leadership"
            className="inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
          >
            Meet the people leading COA-Z →
          </Link>
```

Add `import { Link } from 'react-router-dom'` at the top if not already present.

- [ ] **Step 3: Add a link from RecWeek.tsx**

`src/pages/RecWeek.tsx` already links to `/recweek/map` via the timeline's Organization Fair milestone CTA (`cta: { label: 'Explore Booth Locations', href: '/recweek/map' }` in `src/data/recweek.ts`, rendered by `RecWeekTimeline.tsx`). Add a second link to `/organizations` near the end of the page (check the current end of the file — likely after the FAQ section) so visitors reading about RecWeek can jump straight to browsing organizations without waiting for the fair:

```tsx
        <Link
          to="/organizations"
          className={buttonVariants({ variant: 'secondary' })}
        >
          Browse Accredited Organizations
        </Link>
```

Add the necessary imports (`Link` from `react-router-dom`, `buttonVariants` from `../components/ui/Button`) if not already present in the file.

- [ ] **Step 4: Write the regression test**

Create `src/pages/internalLinking.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('internal linking', () => {
  it('Leadership.tsx links to Organizations', () => {
    const source = readFileSync(resolve(__dirname, 'Leadership.tsx'), 'utf-8')
    expect(source).toContain('to="/organizations"')
  })

  it('About.tsx links to Leadership', () => {
    const source = readFileSync(resolve(__dirname, 'About.tsx'), 'utf-8')
    expect(source).toContain('to="/leadership"')
  })

  it('RecWeek.tsx links to Organizations', () => {
    const source = readFileSync(resolve(__dirname, 'RecWeek.tsx'), 'utf-8')
    expect(source).toContain('to="/organizations"')
  })
})
```

- [ ] **Step 5: Run it to verify it passes**

Run: `bunx vitest run src/pages/internalLinking.test.ts`

- [ ] **Step 6: Visually verify in the browser**

Start the dev server and click through: Leadership → Organizations, About → Leadership, RecWeek → Organizations. Confirm each link lands on the right page and looks visually consistent with the rest of that page (matches the surrounding section's color/style, not a jarring insert).

- [ ] **Step 7: Full suite + typecheck**

```bash
bun run build
bun run test
```

- [ ] **Step 8: Commit**

```bash
git add src/pages/Leadership.tsx src/pages/About.tsx src/pages/RecWeek.tsx src/pages/internalLinking.test.ts
git commit -m "feat: close internal linking gaps between Leadership, About, RecWeek, and Organizations"
```

---

### Task 14: Core Web Vitals — audit first

**Files:** none yet — this task's output is a follow-up plan, not code.

Core Web Vitals can't be honestly optimized without measuring first — guessing at fixes risks spending effort on something that wasn't actually the bottleneck. This task defines exactly how to get real numbers.

- [ ] **Step 1: Build and serve production output locally**

```bash
bun run build
bun run preview
```

- [ ] **Step 2: Run Lighthouse against the local preview**

In Chrome DevTools on `http://localhost:4173/`: Lighthouse tab → Mode: Navigation → Categories: Performance → Device: Mobile (mobile is the stricter, more representative target) → Analyze page load. Repeat for `/organizations` (grid-heavy) and `/organizations/<any-slug>` (image-heavy) since Home alone won't surface every issue.

- [ ] **Step 3: Record the three Core Web Vitals scores per page tested**

For each page: LCP (Largest Contentful Paint), INP (Interaction to Next Paint — Lighthouse may report TBT as a proxy in lab data), CLS (Cumulative Layout Shift). Write these down.

- [ ] **Step 4: For each metric that misses the "Good" threshold, identify the specific Lighthouse-flagged cause**

Lighthouse's report links each metric to specific opportunities (e.g., "Largest Contentful Paint element" tells you exactly which image/text block is the LCP element; "Avoid large layout shifts" names the exact element). Don't guess — use what it reports.

- [ ] **Step 5: Write a follow-up plan**

Once real numbers and specific flagged elements exist, write `docs/superpowers/plans/<date>-core-web-vitals.md` using this same writing-plans process, with concrete tasks like "preload the LCP image on OrganizationProfile.tsx" or "reserve explicit width/height on the hero image in Hero.tsx to eliminate a CLS shift at line N" — each grounded in an actual Lighthouse finding, not a guess.

---

### Task 15: Accessibility — audit first

**Files:** none yet — same reasoning as Task 14.

- [ ] **Step 1: Run an automated pass**

In Chrome DevTools: Lighthouse tab → Categories: Accessibility → Analyze page load, on Home, Organizations, an Organization Profile page, and Leadership (form-adjacent, if any forms exist — check first).

- [ ] **Step 2: Manual keyboard-navigation pass**

On the live dev server, unplug the mouse (or just don't touch it) and Tab through: the navbar (including the mobile hamburger menu), the Organizations filter tabs, every card grid, and any interactive booth-map elements on `/recweek/map`. Confirm: every interactive element is reachable, has a visible focus ring, and the tab order matches visual reading order.

- [ ] **Step 3: Color contrast check**

Lighthouse's accessibility audit flags failing contrast automatically; cross-check anything it flags against the actual rendered color (some of this app's decorative text — e.g. low-opacity dashed circles, watermark text — may intentionally fail contrast because it's non-essential decoration, not real content; distinguish those from real failures before "fixing" them).

- [ ] **Step 4: Write a follow-up plan**

Same process as Task 14 — `docs/superpowers/plans/<date>-accessibility.md`, with tasks grounded in the actual audit findings from Steps 1–3.

---

### Task 16: Google Search Console setup (manual, no code)

**Files:** none — this is an external dashboard task.

- [ ] **Step 1: Verify domain ownership**

Go to https://search.google.com/search-console, add property `https://coa-z-adzu.netlify.app` (or the real custom domain, once/if one is set up — see the note about `coaz.ph` in the Static Open Graph plan). Verify via the HTML tag method (add the provided `<meta name="google-site-verification" ...>` tag to `index.html`'s `<head>`) since that requires no DNS access — a real code change, small enough to do inline here once Google provides the actual tag value.

- [ ] **Step 2: Submit the sitemap**

In Search Console → Sitemaps → submit `sitemap.xml` (the one Task 4 generates).

- [ ] **Step 3: Monitor indexing over the following days/weeks**

Search Console → Pages: confirm pages move from "Discovered" to "Indexed". Investigate anything that lands in an error/excluded bucket.

- [ ] **Step 4: Review Search Queries periodically**

Search Console → Performance: what people actually search to find the site, and which pages rank for what — informs future content/metadata decisions, not something to act on immediately.

- [ ] **Step 5: Resolve crawl issues as they appear**

Search Console surfaces crawl errors (404s it tried to index, robots.txt blocks it didn't expect, etc.) under Coverage/Pages — check periodically, not a one-time task.

---

## Sprint Mapping

Mirrors the source spec's own sprint breakdown:

- **Sprint 1:** Static Open Graph (done, prior plan) + Tasks 1–3 (Dynamic Page Metadata).
- **Sprint 2:** Tasks 4–5 (Sitemap, robots.txt) + Task 16 (Google Search Console).
- **Sprint 3:** Tasks 6–10 (Structured Data) + Task 11 (Semantic HTML).
- **Sprint 4:** Task 12 (Image Optimization) + Tasks 14–15 (Core Web Vitals, Accessibility audits).
- **Sprint 5:** Task 13 (Internal Linking) + the follow-up plans Tasks 14/15 produce + a final Lighthouse re-run to confirm improvement.

---

## Self-Review

**Spec coverage:**
- Phase 2 (Dynamic Page Metadata: title/description/canonical, all listed pages) → Tasks 1–3. Every page in the spec's list is covered; "Contact (if applicable)" doesn't exist as a route in this app, so it's correctly omitted rather than invented.
- Phase 3 (Sitemap) → Task 4, improved beyond the spec's literal "hand-maintained static XML" into a build-time generator sourced from real data, explicitly to satisfy the spec's own stated requirement ("update the sitemap whenever new pages are introduced") without relying on someone remembering to.
- Phase 4 (robots.txt) → Task 5.
- Phase 5 (Structured Data — Organization, EducationalOrganization, Event, BreadcrumbList) → Tasks 6–10. FAQPage is explicitly listed under the spec's own "Future additions," so it's correctly left out — though worth noting `src/data/recweek.ts` already exports a `faqs` array that would be a natural fit whenever that's picked up.
- Phase 6 (Semantic HTML) → Task 11, structured as regression-locking rather than rewriting, because the audit found it already correct.
- Phase 7 (Image Optimization) → Task 12. WebP/AVIF conversion of the ~35MB of existing logos/photos is deliberately **not** included as a blind bulk-conversion task — that's exactly the kind of thing that needs the Task 14 Lighthouse audit to confirm it's actually worth the effort/risk (some of these images are already reasonably small) before spending time on it; the two clear, zero-risk wins found during audit (orphaned files, one broken alt) are done now.
- Phase 8 (Core Web Vitals) → Task 14, audit-first by necessity.
- Phase 9 (Accessibility) → Task 15, audit-first by necessity.
- Phase 10 (Google Search Console) → Task 16.
- Phase 11 (Internal Linking) → Task 13, grounded in an actual `grep` audit rather than assumed gaps.
- Expected Outcome section → every bullet maps to a task above except "Faster loading performance," which depends on Tasks 14/15's follow-up plans landing.
- Out of Scope section (dynamic per-page OG previews, SSR, etc.) → correctly not attempted anywhere in this plan, consistent with the prior Static OG plan.

**Placeholder scan:** no TBD/TODO markers. Tasks 14–16 are explicitly audit-first/manual rather than fake-detailed, which is a deliberate scoping choice (see "Scope note"), not a placeholder — each still has concrete, actionable, checkable steps.

**Type consistency:** `Seo`'s new `canonical`/`noindex` props (Task 2) are used identically across every call site in Task 3. `schema.ts`'s four function signatures (Task 6) are used with matching argument shapes in Tasks 7–10 — verified against each call site while writing them.
