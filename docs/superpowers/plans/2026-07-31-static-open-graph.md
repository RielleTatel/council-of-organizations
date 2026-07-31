# Static Open Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every page on the COA-Z site the same branded Open Graph / Twitter Card preview (title, description, image) when shared on Facebook, Messenger, Discord, LinkedIn, Slack, Teams, etc.

**Architecture:** Static Open Graph. One 1200×630 banner image (`public/og-banner.png`) plus a fixed set of `<meta>` tags hardcoded into `index.html`. No per-route metadata, no SSR, no prerendering — this works because Netlify serves the same `index.html` for every route, and social-media link scrapers read that raw HTML without executing JavaScript.

**Tech Stack:** Plain HTML/CSS for the banner source, macOS `sips` for image verification/resizing, Vitest for a regression test on `index.html`'s tag content. No new npm dependencies.

## Global Constraints

- Banner dimensions: exactly 1200 × 630 px, PNG, saved at `public/og-banner.png`.
- Production URL for all absolute links in meta tags: `https://coa-z-adzu.netlify.app` (confirmed with the project owner — the domain in the original spec, `https://coaz.ph`, is not actually configured anywhere in this repo).
- All routes share identical `og:title`, `og:description`, `og:image` — this is intentional per the "static OG" approach; do not attempt per-page values.
- No Netlify config changes required or allowed — the existing `public/_redirects` (`/* /index.html 200`) already serves this `index.html` for every route, and static files under `public/` (like `og-banner.png`) are served directly by Netlify before that catch-all rule applies.
- No new runtime dependencies (no Playwright/Puppeteer install) — the banner is rendered once, manually, using a browser already available in the dev environment.

---

## Codebase-Specific Gotcha (read before starting)

This app already has a dynamic SEO mechanism: `src/components/Seo.tsx` uses `react-helmet-async` to inject `<title>`, `meta[name=description]`, `meta[property=og:title]`, `meta[property=og:description]`, and `meta[name=twitter:card]` **per page**, and every page (`Home.tsx`, `About.tsx`, etc.) renders `<Seo title=... description=... />` with page-specific copy.

Two problems this causes for "static OG":

1. **It doesn't help crawlers.** Helmet only updates tags after React hydrates in a real browser. Facebook/LinkedIn/Discord/Slack scrapers fetch the raw HTML and do not run JavaScript, so they never see Helmet's tags — they only ever see what's physically written in `index.html`. This is *why* the static-OG approach in this spec is necessary at all.
2. **It breaks "every page shares the same preview" for anyone whose client *does* run JS** (a human opening the page directly, or the handful of scrapers that do render JS). Helmet would overwrite the static `og:title`/`og:description` with a different value per page, contradicting the goal.

Task 5 below removes the OG/Twitter-specific tags from `Seo.tsx` so the static tags in `index.html` remain authoritative everywhere, while keeping the per-page `<title>` and `meta[name=description]` (those aren't Open Graph tags — they're the browser tab title and regular SEO description, and stay dynamic/per-page).

---

## File Structure

- `scripts/og-banner/banner.html` — **create.** Self-contained HTML/CSS source for the banner, referencing existing brand assets via relative `file://`-safe paths. Kept in the repo so the banner can be re-rendered later if branding changes.
- `public/og-banner.png` — **create.** The rendered 1200×630 banner, committed as a binary asset.
- `index.html` — **modify.** Add the static Open Graph + Twitter Card `<meta>` tags to `<head>`.
- `src/openGraph.test.ts` — **create.** Regression test asserting the required tags exist in root `index.html` with the right values.
- `src/components/Seo.tsx` — **modify.** Drop the `og:title`/`og:description`/`twitter:card` tags Helmet was injecting per page (see gotcha above). Keep `<title>` and `meta[name=description]`.
- `src/config/seo.ts` — **modify.** Remove the unused `og` / `twitter` sub-objects (dead code — nothing reads them today, and after Task 5 nothing ever will; leaving them in place would mislead future readers into thinking they control Open Graph output).

---

### Task 1: Create the Open Graph banner image

**Files:**
- Create: `scripts/og-banner/banner.html`
- Create: `public/og-banner.png`

**Interfaces:**
- Produces: `public/og-banner.png`, a 1200×630 PNG, consumed by `index.html`'s `og:image`/`twitter:image` tags in Task 3.

- [ ] **Step 1: Write the banner HTML source**

Create `scripts/og-banner/banner.html` with this exact content:

```html
<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  @font-face {
    font-family: "Made Tommy";
    src: url("../../public/FONTS/MADE TOMMY BOLD_PERSONAL USE.OTF") format("opentype");
    font-weight: 700;
  }
  @font-face {
    font-family: "Made Tommy";
    src: url("../../public/FONTS/MADE TOMMY MEDIUM_PERSONAL USE.OTF") format("opentype");
    font-weight: 500;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background-color: #f5f0e8;
    font-family: "Made Tommy", sans-serif;
  }

  .texture {
    position: absolute;
    inset: 0;
    background-image: url("../../public/textures/paper-texture-1.webp");
    background-repeat: repeat;
    background-size: 400px;
    opacity: 0.10;
    mix-blend-mode: multiply;
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 120px;
  }

  .logo {
    width: 110px;
    height: 110px;
    margin-bottom: 28px;
  }

  h1 {
    font-weight: 700;
    font-size: 46px;
    color: #2e4a8f;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  .tagline {
    margin-top: 20px;
    font-weight: 500;
    font-size: 22px;
    color: #3d3d3d;
    line-height: 1.5;
  }

  .accent {
    position: absolute;
  }
  .accent img { display: block; }
  .flower-tl { top: 48px; left: 64px; width: 64px; }
  .flower-tr { top: 56px; right: 72px; width: 48px; }
  .flower-bl { bottom: 64px; left: 90px; width: 40px; }
  .flower-br { bottom: 52px; right: 64px; width: 56px; }

  .thread-bottom {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) scaleX(-1);
    width: 260px;
    opacity: 0.5;
  }
</style>
</head>
<body>
  <div class="texture"></div>

  <div class="accent flower-tl"><img src="../../public/ELEMENTS/flowers/flower-pink-bloom-1.png" /></div>
  <div class="accent flower-tr"><img src="../../public/ELEMENTS/flowers/flower-yellow-1.png" /></div>
  <div class="accent flower-bl"><img src="../../public/ELEMENTS/flowers/flower-blue-bud-2.png" /></div>
  <div class="accent flower-br"><img src="../../public/ELEMENTS/flowers/flower-purple-bloom-1.png" /></div>
  <img class="thread-bottom" src="../../public/ELEMENTS/yarn/thread-blue-wave-1.png" />

  <div class="content">
    <img class="logo" src="../../public/Icon.png" />
    <h1>Council of Organizations<br />of the Ateneo &ndash; Zamboanga</h1>
    <p class="tagline">Empowering Student Organizations.<br />Inspiring Collaborative Leadership.</p>
  </div>
</body>
</html>
```

This uses the same brand tokens as the live site (`--color-trust-blue: #2e4a8f`, `--color-canvas-cream: #f5f0e8`, `--color-fabric-dark: #3d3d3d`, "Made Tommy" font) plus real embroidery/thread PNGs and the paper-texture overlay already in `public/`, so it matches the site's look without inventing new assets.

- [ ] **Step 2: Render it to a screenshot**

Open `scripts/og-banner/banner.html` directly in Chrome (double-click it, or `open scripts/og-banner/banner.html` on macOS). Using DevTools' device toolbar (Cmd+Shift+M), set a **custom viewport size of exactly 1200 × 630** with device pixel ratio **1** (not 2 — Retina capture will double the output size and get corrected in Step 3, but starting at DPR 1 avoids that). Use DevTools' "Capture screenshot" command (Cmd+Shift+P → "Capture screenshot") and save the file as `public/og-banner.png`.

- [ ] **Step 3: Normalize to exactly 1200×630**

Regardless of how the capture came out, force it to the exact target dimensions:

```bash
sips -z 630 1200 public/og-banner.png
```

- [ ] **Step 4: Verify the dimensions**

```bash
sips -g pixelWidth -g pixelHeight public/og-banner.png
```

Expected output:
```
  pixelWidth: 1200
  pixelHeight: 630
```

- [ ] **Step 5: Commit**

```bash
git add scripts/og-banner/banner.html public/og-banner.png
git commit -m "feat: add static Open Graph banner image"
```

---

### Task 2: Add static Open Graph and Twitter Card meta tags to index.html

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `public/og-banner.png` from Task 1 (referenced by absolute URL).
- Produces: the static `<meta>` tags Task 4's test asserts against.

- [ ] **Step 1: Add the tags**

Open `index.html`. It currently looks like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/Icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>COA-Z | Council of Organizations of the Ateneo - Zamboanga</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Replace the `<head>` contents with:

```html
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/Icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>COA-Z | Council of Organizations of the Ateneo - Zamboanga</title>

    <!-- Static Open Graph — same preview on every route, since this index.html
         is served for all paths and social-media scrapers don't execute JS. -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="COA-Z" />
    <meta property="og:url" content="https://coa-z-adzu.netlify.app" />
    <meta property="og:title" content="Council of Organizations of the Ateneo – Zamboanga" />
    <meta
      property="og:description"
      content="The official alliance of all accredited student organizations of Ateneo de Zamboanga University."
    />
    <meta property="og:image" content="https://coa-z-adzu.netlify.app/og-banner.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="COA-Z — Council of Organizations of the Ateneo - Zamboanga" />

    <!-- Twitter Card — recognized by several non-Twitter platforms too -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Council of Organizations of the Ateneo – Zamboanga" />
    <meta
      name="twitter:description"
      content="The official alliance of all accredited student organizations of Ateneo de Zamboanga University."
    />
    <meta name="twitter:image" content="https://coa-z-adzu.netlify.app/og-banner.png" />
  </head>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add static Open Graph and Twitter Card meta tags"
```

---

### Task 3: Add a regression test for the static tags

**Files:**
- Create: `src/openGraph.test.ts`

**Interfaces:**
- Consumes: root `index.html` (read from disk, not imported as a module).

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8')

describe('static Open Graph tags in index.html', () => {
  it('declares the required Open Graph tags', () => {
    expect(html).toContain('property="og:type" content="website"')
    expect(html).toContain('property="og:site_name" content="COA-Z"')
    expect(html).toContain('property="og:url" content="https://coa-z-adzu.netlify.app"')
    expect(html).toContain(
      'property="og:title" content="Council of Organizations of the Ateneo – Zamboanga"',
    )
    expect(html).toContain(
      'property="og:image" content="https://coa-z-adzu.netlify.app/og-banner.png"',
    )
  })

  it('declares the required Twitter Card tags', () => {
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
    expect(html).toContain(
      'name="twitter:image" content="https://coa-z-adzu.netlify.app/og-banner.png"',
    )
  })

  it('references an image URL that is absolute, not relative', () => {
    const ogImageMatch = html.match(/property="og:image" content="([^"]+)"/)
    expect(ogImageMatch?.[1]).toMatch(/^https:\/\//)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/openGraph.test.ts`
Expected: FAIL — `index.html` doesn't have the tags yet (unless Task 2 was already done; if so this should already pass, which is fine — the point is confirming the assertions are meaningful, so temporarily comment out one `<meta>` line in `index.html` and re-run to see a real failure, then restore it).

- [ ] **Step 3: Run it to verify it passes**

Run: `npx vitest run src/openGraph.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 4: Commit**

```bash
git add src/openGraph.test.ts
git commit -m "test: assert static Open Graph tags are present in index.html"
```

---

### Task 4: Stop Seo.tsx from overriding the static OG tags per page

**Files:**
- Modify: `src/components/Seo.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `<Seo title description />` still renders `<title>` and `meta[name=description]` per page (used elsewhere in `About.tsx`, `Home.tsx`, `Leadership.tsx`, `Organizations.tsx`, `RecWeek.tsx`, `EventDetail.tsx`, `OrganizationProfile.tsx`, etc.) — no other file's usage of `<Seo>` needs to change.

- [ ] **Step 1: Write the failing test**

Add to a new file `src/components/Seo.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { Helmet } from 'react-helmet-async'
import { Seo } from './Seo'

describe('Seo', () => {
  it('sets the page title and description, but no og:* or twitter:* tags', () => {
    const helmetContext: { helmet?: ReturnType<typeof Helmet.peek> } = {}
    renderToStaticMarkup(
      <HelmetProvider context={helmetContext}>
        <Seo title="Test Page | COA-Z" description="A test description." />
      </HelmetProvider>,
    )

    const head = helmetContext.helmet!
    expect(head.title.toString()).toContain('Test Page | COA-Z')
    expect(head.meta.toString()).toContain('name="description" content="A test description."')
    expect(head.meta.toString()).not.toContain('property="og:title"')
    expect(head.meta.toString()).not.toContain('property="og:description"')
    expect(head.meta.toString()).not.toContain('name="twitter:card"')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/Seo.test.tsx`
Expected: FAIL — the current `Seo.tsx` still emits `og:title`, `og:description`, and `twitter:card`, so the three `not.toContain` assertions fail.

- [ ] **Step 3: Update Seo.tsx**

`src/components/Seo.tsx` currently reads:

```tsx
import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
}

export function Seo({ title, description }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}
```

Replace it with:

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

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/Seo.test.tsx`
Expected: PASS

- [ ] **Step 5: Run the full test suite to check nothing else broke**

Run: `npx vitest run`
Expected: all test files pass (no other test references `og:title`/`og:description`/`twitter:card` from `Seo.tsx` today, so this should be a clean pass).

- [ ] **Step 6: Commit**

```bash
git add src/components/Seo.tsx src/components/Seo.test.tsx
git commit -m "fix: stop Seo.tsx from overriding the static per-page Open Graph tags"
```

---

### Task 5: Remove dead `og`/`twitter` config

**Files:**
- Modify: `src/config/seo.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `defaultSeo.title` and `defaultSeo.description`, the only two fields anything reads (confirmed via `grep -rn "defaultSeo" src` — only `src/pages/Home.tsx` imports it, using just `.title` and `.description`).

- [ ] **Step 1: Update the file**

`src/config/seo.ts` currently reads:

```typescript
export const defaultSeo = {
  title: 'COA-Z | Council of Organizations of the Ateneo - Zamboanga',
  description:
    'The official website of the Council of Organizations of the Ateneo - Zamboanga.',
  og: {
    title: 'COA-Z',
    description: 'The official website of COA-Z.',
    image: '',
    url: '',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

Replace it with:

```typescript
export const defaultSeo = {
  title: 'COA-Z | Council of Organizations of the Ateneo - Zamboanga',
  description:
    'The official website of the Council of Organizations of the Ateneo - Zamboanga.',
}
```

(The `og`/`twitter` fields were never read by any component — Open Graph output is now controlled entirely by the static tags in `index.html`, per Task 2.)

- [ ] **Step 2: Confirm nothing referenced the removed fields**

```bash
grep -rn "defaultSeo.og\|defaultSeo.twitter" src
```

Expected: no output.

- [ ] **Step 3: Run the full test suite and typecheck**

```bash
npx tsc -b
npx vitest run
```

Expected: both clean.

- [ ] **Step 4: Commit**

```bash
git add src/config/seo.ts
git commit -m "chore: remove unused og/twitter fields from seo config"
```

---

### Task 6: Build verification and manual QA

**Files:** none (verification only).

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: builds cleanly (this repo's `build` script runs `tsc -b && vite build`).

- [ ] **Step 2: Confirm the built HTML carries the tags**

```bash
grep -c 'property="og:image"' dist/index.html
```

Expected: `1`

- [ ] **Step 3: Confirm the banner file lands in the build output at the right path**

```bash
ls -la dist/og-banner.png
sips -g pixelWidth -g pixelHeight dist/og-banner.png
```

Expected: file exists, `1200 x 630`.

- [ ] **Step 4: Smoke-test with a local preview server**

```bash
npm run preview
```

In another terminal:

```bash
curl -s http://localhost:4173/ | grep -o '<meta property="og:image"[^>]*>'
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/og-banner.png
```

Expected: the `og:image` meta tag prints, and the image request returns `200`.

- [ ] **Step 5: Deploy and verify with the real scrapers**

After this branch is merged and deployed to `https://coa-z-adzu.netlify.app`:

1. Facebook Sharing Debugger — `https://developers.facebook.com/tools/debug/` — paste the production URL, click **Scrape Again**, confirm the banner/title/description appear.
2. LinkedIn Post Inspector — `https://www.linkedin.com/post-inspector/` — paste the production URL, confirm the same.
3. `https://www.opengraph.dev/` — paste the production URL, confirm the same.
4. Repeat for at least one non-root route (e.g. `https://coa-z-adzu.netlify.app/about`) to confirm the same static preview appears there too.

- [ ] **Step 6: Note on cache refresh**

Whenever `public/og-banner.png` or the meta tag content in `index.html` changes after this initial rollout, Facebook's cache must be refreshed manually: open the Sharing Debugger, paste the URL, click **Scrape Again**. This applies to every future change to the banner or copy, not just this rollout — document it here so it isn't rediscovered from scratch later.

---

## Self-Review

**Spec coverage:**
- Step 1 (banner, 1200×630 PNG, `public/og-banner.png`, brand-consistent) → Task 1.
- Step 2 (OG meta tags in `index.html`) → Task 2.
- Step 3 (Twitter Card tags) → Task 2 (bundled — same file, same edit, no reason to split).
- Step 4 (deploy, no Netlify config changes) → Global Constraints + Task 6 confirms no config changes were needed.
- Step 5 (test with Facebook/LinkedIn/opengraph.dev debuggers) → Task 6, Step 5.
- Step 6 (cache refresh instructions) → Task 6, Step 6.
- Expected Result (same preview across all routes) → guaranteed structurally by Task 2 (tags live in the one shared `index.html`) and protected against regression by Task 3's test and Task 4 (which stops per-page divergence for JS-executing clients).
- "Notes" section (static-only, no SSR/prerendering/Edge Functions, no routing changes) → honored throughout; explicitly out of scope, not attempted anywhere in this plan.

**Gap not in the original spec, added anyway:** the spec didn't mention `Seo.tsx`'s existing Helmet-based per-page tags, which would have silently undermined "every page shares the same preview" for any JS-executing viewer. Task 4 closes that gap. Task 5 is small included cleanup so `config/seo.ts` doesn't keep dead fields that look like they control Open Graph.

**Placeholder scan:** no TBD/TODO markers; every step has literal file contents or literal commands.

**Type consistency:** `Seo` component's public interface (`{ title: string; description: string }`) is unchanged, so no caller elsewhere in the app needs to change.
