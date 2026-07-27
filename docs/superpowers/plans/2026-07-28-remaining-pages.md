# COA-Z Remaining Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the six remaining routed pages (`/about`, `/leadership`, `/organizations`, `/organizations/:slug`, `/events`, `/events/:slug`, and the `*` NotFound) in the same "Interwoven Beyond" design language as the finished Home page, backed by mock content so every page renders real-looking data until Contentful is wired.

**Architecture:** A shared `SiteLayout` route wrapper supplies Navbar + FabricTexture + Footer to every page (Home is refactored to stop rendering its own). Pages compose reusable brand primitives (already built: `Button`, `Reveal`, `EmbroideredAccent`, `ThreadBorder`, `ThreadDivider`) plus new shared building blocks (`Seo`, `PageHeader`, `ClusterBadge`, `OrganizationCard`, `OfficerCard`, `EventCard`). All list/selection logic runs through pure, unit-tested helpers. Content comes from a single mock module wired behind the existing Contentful service stubs, so the existing TanStack Query hooks work unchanged.

**Tech Stack:** Vite 8, React 19, TypeScript, Tailwind v4 (`@theme` tokens), TanStack Query v5, react-router-dom v7, react-helmet-async, lucide-react, class-variance-authority, Vitest.

---

## Design Read (design-taste-frontend §0.B)

**Reading this as:** the interior content pages of an institutional / community site for a student-organization council, serving students, org leaders, and university stakeholders, continuing the handcrafted-embroidery × modern-minimalism "Interwoven Beyond" language established on Home, leaning toward Vite + React + self-hosted Made Tommy / Omegle + Tailwind v4 tokens + restrained organic motion.

**Dials:** `DESIGN_VARIANCE: 6` / `MOTION_INTENSITY: 5` / `VISUAL_DENSITY: 3` (same as Home; these are continuation pages of one system).

**Overrides carried from the Home plan (unchanged):** single LIGHT theme lock (brand-driven), multi-thread-color accent system (brand "diversity spectrum"), lucide-react allowed (already a dependency), IntersectionObserver instead of the Motion library, Vite adaptations (no `next/font`/`next/image`/RSC). See `docs/superpowers/plans/2026-07-28-home-landing-page.md` for the full rationale.

---

## Global Constraints

Every task's requirements implicitly include this section. These match the Home build exactly so the two ship as one system.

- **Platform:** Vite + React 19 SPA. No Next.js APIs. No path alias — use **relative imports** (`../lib/...`), never `@/`.
- **Theme:** LIGHT only. `bg-canvas-cream` page background; `bg-linen-white` elevated surfaces. No `dark:` variants, no section inverts.
- **Primary color:** `trust-blue` (#2E4A8F) for headers, links, primary CTAs — identical on every page.
- **Cluster→thread-color lock (NEW, used site-wide):** every organization cluster maps to one thread accent, applied consistently on Organizations, OrganizationProfile, and anywhere a cluster appears:
  - `culture-arts-multimedia` → pink
  - `faith-formation` → purple
  - `socio-civic-political` → red
  - `academics` → blue
  - `wellness-environmental` → green
  - `publications-communications` → yellow
- **Neutrals:** body `text-fabric-dark` #3D3D3D; secondary/captions `text-stitch-gray` #8A8A8A.
- **Fonts (already wired):** `font-display`/`font-body` = Made Tommy; `font-accent` = Omegle. Headings `font-display font-bold tracking-[-0.02em]`; handwritten callouts `font-accent`.
- **Corner-radius lock:** buttons/chips `rounded-full`; cards/surfaces/inputs `rounded-[8px]`. No other radii.
- **Shadows:** tinted only — `shadow-[0_4px_20px_rgba(46,74,143,0.06)]`. No pure-black shadows.
- **ZERO em-dashes (`—`) and en-dashes (`–`)** anywhere visible (design-taste-frontend §9.G). Brand name always hyphenated: "Council of the Organizations of the Ateneo - Zamboanga", "Ateneo de Zamboanga University". Verbatim content copy from `docs/content.md` that contains an em-dash MUST be rewritten to a hyphen, comma, colon, or two sentences before it ships.
- **Icons:** lucide-react only, `strokeWidth={1.75}`. No hand-rolled SVG icons. Note: lucide-react 1.x has no brand icons (`Facebook`/`Instagram` do not exist) — use `ExternalLink` for social links, matching the existing Footer.
- **Motion:** `Reveal` (IntersectionObserver) + CSS only. Collapses under `prefers-reduced-motion`. No `window` scroll listeners.
- **Layout:** content containers `max-w-[1200px] mx-auto px-6`; section padding `py-20 md:py-28` (`py-12` mobile). Never `h-screen` (use `min-h-[100dvh]` where a full-height area is needed).
- **Images:** mock content uses `https://picsum.photos/seed/{stable-seed}/{w}/{h}` (design-taste-frontend §4.8 placeholder path) except the Org Fair event, which uses the real `/ELEMENTS/OrgFair.png`. Every `<img>` sets `width`/`height` (or an aspect-ratio box) + `loading="lazy"` (except above-the-fold) + meaningful `alt`. Decorative flower/thread art uses `alt=""` + `role="presentation"`.
- **Names/data (design-taste-frontend §9.D):** mock people use realistic locale-appropriate Filipino names, never "John Doe". Mock orgs use plausible Ateneo-style names, never "Acme".
- **SEO:** every page renders `<Seo title description />`. Titles end with " | COA-Z".
- **Every task ends green:** `bunx tsc -b` and `bun run lint` (oxlint) pass before commit; the two pre-existing fast-refresh warnings on `Button.tsx`/`Reveal.tsx` are acceptable. Logic tasks also pass `bun run test`.

---

## File Structure

**Created:**
- `src/config/clusters.ts` — the 6 clusters (slug, name, thread color, description) + lookup.
- `src/config/leadership.ts` — the 5 executive offices (name, description, order) + Buklod committee blurb.
- `src/data/mock.ts` — `mockOrganizations`, `mockLeaders`, `mockEvents`.
- `src/lib/directory.ts` — pure helpers: `filterOrganizations`, `groupLeadersByOffice`, `splitEventsByTime`, `relatedOrganizations`.
- `src/lib/directory.test.ts` — Vitest tests for the above.
- `src/lib/contentful/services.test.ts` — Vitest tests for the mock-wired services.
- `src/hooks/useOrganization.ts` — by-slug org hook.
- `src/hooks/useEvent.ts` — by-slug event hook.
- `src/components/Seo.tsx` — Helmet wrapper.
- `src/components/layout/SiteLayout.tsx` — Navbar + FabricTexture + `<main>` Outlet + Footer.
- `src/components/shared/PageHeader.tsx` — standard interior-page title band.
- `src/components/shared/ClusterBadge.tsx` — cluster pill in its thread color.
- `src/components/shared/OrganizationCard.tsx` — directory/grid org card.
- `src/components/shared/OfficerCard.tsx` — leadership officer card.
- `src/components/shared/EventCard.tsx` — event card (shared by Home + Events).

**Modified:**
- `src/lib/contentful/services.ts` — return mock data instead of empty.
- `src/App.tsx` — nest all routes under `SiteLayout`.
- `src/pages/Home.tsx` — drop self-rendered Navbar/Footer/FabricTexture/`<main>` (now from layout); adopt `<Seo>`.
- `src/components/home/UpcomingEvents.tsx` — use shared `EventCard`.
- `src/pages/About.tsx`, `Leadership.tsx`, `Organizations.tsx`, `OrganizationProfile.tsx`, `Events.tsx`, `EventDetail.tsx`, `NotFound.tsx` — real implementations.

---

## Per-Page Layout-Family Ledger (design-taste-frontend §4.7, §9.C)

Each page uses ≥4 distinct layout families and repeats none within the page. Eyebrow budget per page = `ceil(sectionCount / 3)`; the `PageHeader` label counts as 1.

**/about:** PageHeader → Who We Are prose block → Our Purpose 6-function bento (3-col) → Vision + Mission two-panel split → Core Principles stitched vertical list (not cards).

**/leadership:** PageHeader → Executive Board intro → 5 office roster blocks (office header + officer-card grid, accent color rotates per office) → Buklod Atenista Envoy callout band.

**/organizations:** PageHeader → 6-cluster overview bento (2×3) → filter controls (search + cluster chips) + directory card grid → empty state.

**/organizations/:slug:** framed org spotlight header (hoop-framed image + name + cluster badge + description) → officers stitched list → related-orgs card grid → back link.

**/events:** PageHeader → Upcoming events card grid → Past events card grid (muted) → empty states.

**/events/:slug:** full-bleed banner header → event meta + description prose → other-upcoming card row → back link.

**/*  (NotFound):** centered composed 404 with embroidered accent + home link.

---

### Task 1: Cluster config

**Files:**
- Create: `src/config/clusters.ts`

**Interfaces:**
- Consumes: `ThreadColor` from `../lib/assets`.
- Produces:
  - `interface ClusterMeta { slug: string; name: string; color: ThreadColor; description: string }`
  - `clusters: ClusterMeta[]` (6, in display order)
  - `clusterBySlug(slug: string): ClusterMeta | undefined`

- [ ] **Step 1: Implement `clusters.ts`**

```ts
import type { ThreadColor } from '../lib/assets'

export interface ClusterMeta {
  slug: string
  name: string
  color: ThreadColor
  description: string
}

export const clusters: ClusterMeta[] = [
  {
    slug: 'culture-arts-multimedia',
    name: 'Culture, Arts, and Multimedia',
    color: 'pink',
    description:
      'Organizations centered on arts (theater, music, dance), multimedia (technology-driven creative expression), and culture (preservation and promotion of heritage and subcultures).',
  },
  {
    slug: 'faith-formation',
    name: 'Faith and Formation',
    color: 'purple',
    description:
      'Structured groups that organize and propagate beliefs, rituals, and practices associated with a particular faith, fostering community, worship, and moral guidance, including volunteerism and community service.',
  },
  {
    slug: 'socio-civic-political',
    name: 'Socio-Civic and Political',
    color: 'red',
    description:
      'Organizations dedicated to fostering social responsibility, civic engagement, and political awareness through community service projects, advocacy campaigns, and educational events.',
  },
  {
    slug: 'academics',
    name: 'Academics',
    color: 'blue',
    description:
      'Academic organizations from fields including Accountancy, Business and Management, STEM, and the Humanities and Social Sciences. Fosters intellectual development, critical thinking, and career formation.',
  },
  {
    slug: 'wellness-environmental',
    name: 'Wellness and Environmental',
    color: 'green',
    description:
      'Organizations promoting holistic well-being, healthy lifestyles, sports development, and environmental stewardship, advancing physical health, sportsmanship, emergency response, and care for the environment.',
  },
  {
    slug: 'publications-communications',
    name: 'Publications and Communications',
    color: 'yellow',
    description:
      'Media-related organizations including publications, broadcasting groups, and communications entities. A platform for disseminating information, news, and content through print, digital, and broadcast channels.',
  },
]

export function clusterBySlug(slug: string): ClusterMeta | undefined {
  return clusters.find((c) => c.slug === slug)
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/config/clusters.ts
git commit -m "feat: add cluster config with thread-color mapping"
```

---

### Task 2: Leadership office config

**Files:**
- Create: `src/config/leadership.ts`

**Interfaces:**
- Produces:
  - `interface OfficeMeta { name: string; description: string; color: ThreadColor }`
  - `offices: OfficeMeta[]` (5, in display order; `name` matches `Leader.office` in mock data exactly)
  - `buklodCommittee: { title: string; description: string }`

- [ ] **Step 1: Implement `leadership.ts`**

```ts
import type { ThreadColor } from '../lib/assets'

export interface OfficeMeta {
  name: string
  description: string
  color: ThreadColor
}

export const offices: OfficeMeta[] = [
  {
    name: 'Office of the Chairperson',
    description:
      "The Office of the Chairperson leads the Council, represents COA-Z to the university and external bodies, and sets the direction of the Council's programs and advocacies.",
    color: 'red',
  },
  {
    name: 'Office of the Secretary-General',
    description:
      'The Office of the Secretary-General oversees internal records, institutional memory, and the transparency functions that keep the Council accountable to its member organizations.',
    color: 'purple',
  },
  {
    name: 'Office of Communications',
    description:
      'The Office of Communications manages how COA-Z reaches and engages its constituents, from social media to content strategy.',
    color: 'yellow',
  },
  {
    name: 'Office of Creatives and Branding',
    description:
      "The Office of Creatives and Branding shapes the visual identity of COA-Z and documents the Council's events and milestones.",
    color: 'pink',
  },
  {
    name: 'Office of Finance',
    description:
      'The Office of Finance ensures the fiscal integrity of the Council, managing funds and supporting the financial needs of member organizations.',
    color: 'green',
  },
]

export const buklodCommittee = {
  title: 'Buklod Atenista Envoy Committee',
  description:
    'The Buklod Atenista Envoy Committee represents COA-Z in the national Buklod Atenista network, composed of the Chairperson and other key officers as appointed by the Chairperson.',
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/config/leadership.ts
git commit -m "feat: add leadership office config"
```

---

### Task 3: Mock content data

**Files:**
- Create: `src/data/mock.ts`

**Interfaces:**
- Consumes: `Organization`, `Event`, `Leader` from `../lib/contentful/types`; `clusters` from `../config/clusters`; `offices` from `../config/leadership`.
- Produces: `mockOrganizations: Organization[]`, `mockLeaders: Leader[]`, `mockEvents: Event[]`.

Notes: cluster refs are built from `clusters` config so slugs/names never drift. Officer `office` strings exactly equal `offices[n].name`. Event dates are relative to the project "today" of 2026-07-28: three upcoming, two past. Images are picsum seeds except the Org Fair banner.

- [ ] **Step 1: Implement `mock.ts`**

```ts
import type { Organization, Event, Leader } from '../lib/contentful/types'
import { clusters } from '../config/clusters'

function clusterRef(slug: string) {
  const c = clusters.find((x) => x.slug === slug)
  if (!c) throw new Error(`Unknown cluster: ${slug}`)
  return { id: c.slug, name: c.name, slug: c.slug }
}

function org(
  slug: string,
  name: string,
  clusterSlug: string,
  description: string,
  officers: string[],
): Organization {
  return {
    id: slug,
    name,
    slug,
    cluster: clusterRef(clusterSlug),
    description,
    logo: `https://picsum.photos/seed/coaz-${slug}/600/400`,
    officers,
  }
}

export const mockOrganizations: Organization[] = [
  org('ateneo-harana', 'Ateneo Harana', 'culture-arts-multimedia',
    'A student music guild reviving the Filipino tradition of serenade through choral and acoustic performance across campus events.',
    ['Maria Cristina Alonto', 'Jose Rafael Enriquez']),
  org('teatro-atenista', 'Teatro Atenista', 'culture-arts-multimedia',
    'The premier theater arts organization staging original and classic productions that explore Zamboangueño identity and social issues.',
    ['Patricia Nuñez', 'Karl Vincent Lim']),
  org('christian-life-community', 'Christian Life Community', 'faith-formation',
    'An Ignatian faith community forming students in discernment, prayer, and service rooted in the Spiritual Exercises.',
    ['Anna Katrina Salcedo', 'Miguel Antonio Reyes']),
  org('ignatian-volunteers', 'Ignatian Volunteers', 'faith-formation',
    'A service organization mobilizing students for outreach, relief operations, and sustained community immersion.',
    ['Bianca Marie Tan', 'Paulo Sebastian Cruz']),
  org('advocacy-circle', 'Ateneo Advocacy Circle', 'socio-civic-political',
    'A socio-civic organization advancing civic education, human rights awareness, and grassroots advocacy campaigns.',
    ['Danielle Grace Uy', 'Ramon Luis Fernandez']),
  org('sanggunian-forum', 'Sanggunian Political Forum', 'socio-civic-political',
    'A political discourse organization hosting debates, forums, and voter-education drives on national and local issues.',
    ['Isabela Mae Ledesma', 'Francis Gabriel Ong']),
  org('jpia', 'Junior Philippine Institute of Accountants', 'academics',
    'The accountancy student body building professional competency through reviews, seminars, and industry linkages.',
    ['Andrea Nicole Sy', 'Marco Emmanuel Diaz']),
  org('computer-society', 'Ateneo Computer Society', 'academics',
    'A STEM organization for computing students running hackathons, workshops, and open-source collaborations.',
    ['Kevin Joseph Tiu', 'Lara Sofia Mangahas']),
  org('green-movement', 'Ateneo Green Movement', 'wellness-environmental',
    'An environmental organization leading coastal cleanups, tree-growing, and campus sustainability initiatives.',
    ['Camille Andrea Roa', 'Nathaniel John Abad']),
  org('sports-circle', 'Ateneo Sports Circle', 'wellness-environmental',
    'A wellness organization promoting sportsmanship, fitness, and inter-organization athletic leagues.',
    ['Diego Alfonso Villar', 'Trisha Anne Gomez']),
  org('the-beacon', 'The Beacon', 'publications-communications',
    'The official student publication delivering campus journalism, investigative features, and literary work.',
    ['Regina Paula Castro', 'Emilio Santino Bautista']),
  org('broadcasting-circle', 'Ateneo Broadcasting Circle', 'publications-communications',
    'A communications organization producing campus radio, podcasts, and live event coverage.',
    ['Yasmin Clarisse Hassan', 'Joaquin Rafael Prieto']),
]

function leader(id: string, name: string, role: string, office: string): Leader {
  return {
    id,
    name,
    role,
    office,
    image: `https://picsum.photos/seed/coaz-officer-${id}/400/400`,
    bio: '',
  }
}

export const mockLeaders: Leader[] = [
  leader('chair', 'Sofia Margarita del Rosario', 'Chairperson', 'Office of the Chairperson'),
  leader('exec-sec', 'Lorenzo Miguel Aquino', 'Executive Secretary to the Chairperson', 'Office of the Chairperson'),
  leader('under-internal', 'Beatriz Camille Yulo', 'Undersecretary for Internal Affairs', 'Office of the Chairperson'),
  leader('under-external', 'Gabriel Ignacio Lozano', 'Undersecretary for External Affairs', 'Office of the Chairperson'),
  leader('legal', 'Andrea Lucille Panganiban', 'Chief Legal and Policy Adviser', 'Office of the Chairperson'),
  leader('sec-gen', 'Rafael Dominic Suarez', 'Secretary-General', 'Office of the Secretary-General'),
  leader('under-transparency', 'Ma. Angelica Ferrer', 'Undersecretary for Transparency', 'Office of the Secretary-General'),
  leader('comms-head', 'Julia Kristine Mercado', 'Communications Head', 'Office of Communications'),
  leader('social-media', 'Enzo Gabriel Villanueva', 'Social Media Handler', 'Office of Communications'),
  leader('content', 'Nadine Patricia Sison', 'Content Manager', 'Office of Communications'),
  leader('creatives-head', 'Sebastian Kyle Ramos', 'Creatives Head', 'Office of Creatives and Branding'),
  leader('docu-head', 'Alexandra Rose Chua', 'Documentation Head', 'Office of Creatives and Branding'),
  leader('creatives-assoc', 'Miguel Lorenzo Tanjuatco', 'Creatives Associate', 'Office of Creatives and Branding'),
  leader('docu-assoc', 'Chloe Isabelle Ang', 'Documentation Associate', 'Office of Creatives and Branding'),
  leader('finance-head', 'Vincent Carlo Magsino', 'Finance Head', 'Office of Finance'),
  leader('treasurer', 'Katrina Bianca Ocampo', 'Treasurer', 'Office of Finance'),
  leader('subsidy', 'Paolo Martin Guevarra', 'Subsidy Officer', 'Office of Finance'),
]

function event(
  slug: string,
  title: string,
  date: string,
  description: string,
  image: string,
  isFeatured = false,
  isFlagship = false,
): Event {
  return { id: slug, title, slug, date, description, image, isFeatured, isFlagship }
}

export const mockEvents: Event[] = [
  event('org-fair-2026', 'OrgFair 2026', '2026-08-15',
    'The annual organization fair where all accredited COA-Z member organizations welcome new members with booths, performances, and recruitment drives.',
    '/ELEMENTS/OrgFair.png', true, true),
  event('leadership-summit', 'COA-Z Leadership Summit', '2026-09-05',
    'A two-day formation summit gathering organization leaders for workshops on governance, collaboration, and Ignatian leadership.',
    'https://picsum.photos/seed/coaz-leadership-summit/800/500', true),
  event('cluster-night', 'Interwoven: Cluster Night', '2026-10-10',
    'A cultural showcase celebrating the six organization clusters through performances, exhibits, and shared advocacies.',
    'https://picsum.photos/seed/coaz-cluster-night/800/500'),
  event('general-assembly', 'COA-Z General Assembly', '2026-06-20',
    'The opening general assembly where member organizations ratified the Council agenda for the academic year.',
    'https://picsum.photos/seed/coaz-general-assembly/800/500'),
  event('service-caravan', 'Ignatian Service Caravan', '2026-05-12',
    'A community service caravan bringing member organizations together for outreach across partner communities in Zamboanga.',
    'https://picsum.photos/seed/coaz-service-caravan/800/500'),
]
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/data/mock.ts
git commit -m "feat: add mock organizations, leaders, and events"
```

---

### Task 4: Wire services to mock data (TDD)

**Files:**
- Modify: `src/lib/contentful/services.ts`
- Test: `src/lib/contentful/services.test.ts`

**Interfaces:**
- Consumes: `mockOrganizations`, `mockLeaders`, `mockEvents` from `../../data/mock`.
- Produces: existing service signatures unchanged, now returning mock data. `getSiteSettings` stays `null` (Footer uses `siteConfig`, not site settings).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/contentful/services.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import {
  getOrganizations,
  getOrganizationBySlug,
  getEvents,
  getEventBySlug,
  getLeadership,
} from './services'

describe('mock-wired services', () => {
  it('returns organizations', async () => {
    const orgs = await getOrganizations()
    expect(orgs.length).toBeGreaterThan(0)
  })

  it('finds an organization by slug', async () => {
    const org = await getOrganizationBySlug('the-beacon')
    expect(org?.name).toBe('The Beacon')
  })

  it('returns null for an unknown organization slug', async () => {
    expect(await getOrganizationBySlug('does-not-exist')).toBeNull()
  })

  it('returns events', async () => {
    expect((await getEvents()).length).toBeGreaterThan(0)
  })

  it('finds an event by slug', async () => {
    const evt = await getEventBySlug('org-fair-2026')
    expect(evt?.title).toBe('OrgFair 2026')
  })

  it('returns null for an unknown event slug', async () => {
    expect(await getEventBySlug('nope')).toBeNull()
  })

  it('returns leadership', async () => {
    expect((await getLeadership()).length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test`
Expected: FAIL (services still return `[]`/`null`).

- [ ] **Step 3: Implement the mock-wired services**

Replace `src/lib/contentful/services.ts` with:
```ts
import type { Event, Leader, Organization, SiteSettings } from './types'
import { mockOrganizations, mockEvents, mockLeaders } from '../../data/mock'

export async function getOrganizations(): Promise<Organization[]> {
  return mockOrganizations
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  return mockOrganizations.find((o) => o.slug === slug) ?? null
}

export async function getEvents(): Promise<Event[]> {
  return mockEvents
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return mockEvents.find((e) => e.slug === slug) ?? null
}

export async function getLeadership(): Promise<Leader[]> {
  return mockLeaders
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return null
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test`
Expected: PASS (all previous + these 7).

- [ ] **Step 5: Typecheck and commit**

Run: `bunx tsc -b`
```bash
git add src/lib/contentful/services.ts src/lib/contentful/services.test.ts
git commit -m "feat: wire Contentful service stubs to mock data"
```

Note: this makes the Home page render populated stats, a featured org, and upcoming events (previously empty/hidden). Expected and desirable.

---

### Task 5: Directory pure helpers (TDD)

**Files:**
- Create: `src/lib/directory.ts`
- Test: `src/lib/directory.test.ts`

**Interfaces:**
- Consumes: `Organization`, `Leader`, `Event` from `./contentful/types`.
- Produces:
  - `filterOrganizations(orgs: Organization[], query: string, clusterSlug: string | null): Organization[]`
  - `groupLeadersByOffice(leaders: Leader[], officeOrder: string[]): { office: string; leaders: Leader[] }[]`
  - `splitEventsByTime(events: Event[], now: Date): { upcoming: Event[]; past: Event[] }`
  - `relatedOrganizations(orgs: Organization[], current: Organization, count: number): Organization[]`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/directory.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { filterOrganizations, groupLeadersByOffice, splitEventsByTime, relatedOrganizations } from './directory'
import type { Organization, Leader, Event } from './contentful/types'

function org(slug: string, name: string, clusterSlug: string, description = ''): Organization {
  return {
    id: slug, name, slug,
    cluster: { id: clusterSlug, name: clusterSlug, slug: clusterSlug },
    description, logo: '', officers: [],
  }
}
function leader(id: string, office: string): Leader {
  return { id, name: `N${id}`, role: 'r', office, image: '', bio: '' }
}
function evt(id: string, date: string): Event {
  return { id, title: id, slug: id, date, description: '', image: '', isFeatured: false, isFlagship: false }
}

describe('filterOrganizations', () => {
  const orgs = [org('a', 'Ateneo Harana', 'culture'), org('b', 'The Beacon', 'pubs', 'campus journalism'), org('c', 'Green Movement', 'wellness')]

  it('returns all when query empty and cluster null', () => {
    expect(filterOrganizations(orgs, '', null)).toHaveLength(3)
  })
  it('matches name case-insensitively', () => {
    expect(filterOrganizations(orgs, 'beacon', null).map((o) => o.slug)).toEqual(['b'])
  })
  it('matches description', () => {
    expect(filterOrganizations(orgs, 'journalism', null).map((o) => o.slug)).toEqual(['b'])
  })
  it('filters by cluster', () => {
    expect(filterOrganizations(orgs, '', 'wellness').map((o) => o.slug)).toEqual(['c'])
  })
  it('combines query and cluster', () => {
    expect(filterOrganizations(orgs, 'green', 'wellness').map((o) => o.slug)).toEqual(['c'])
    expect(filterOrganizations(orgs, 'green', 'culture')).toHaveLength(0)
  })
})

describe('groupLeadersByOffice', () => {
  it('groups and orders by the given office order, dropping empty offices', () => {
    const leaders = [leader('1', 'B'), leader('2', 'A'), leader('3', 'A')]
    const result = groupLeadersByOffice(leaders, ['A', 'B', 'C'])
    expect(result.map((g) => g.office)).toEqual(['A', 'B'])
    expect(result[0].leaders.map((l) => l.id)).toEqual(['2', '3'])
  })
})

describe('splitEventsByTime', () => {
  const now = new Date('2026-07-28T00:00:00Z')
  it('splits upcoming (asc) and past (desc)', () => {
    const events = [evt('p1', '2026-05-01'), evt('u2', '2026-09-01'), evt('u1', '2026-08-01'), evt('p2', '2026-06-01')]
    const { upcoming, past } = splitEventsByTime(events, now)
    expect(upcoming.map((e) => e.id)).toEqual(['u1', 'u2'])
    expect(past.map((e) => e.id)).toEqual(['p2', 'p1'])
  })
})

describe('relatedOrganizations', () => {
  it('returns same-cluster orgs excluding the current, capped', () => {
    const orgs = [org('a', 'A', 'x'), org('b', 'B', 'x'), org('c', 'C', 'x'), org('d', 'D', 'y')]
    const result = relatedOrganizations(orgs, orgs[0], 2)
    expect(result.map((o) => o.slug)).toEqual(['b', 'c'])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test`
Expected: FAIL (module `./directory` not found).

- [ ] **Step 3: Implement `directory.ts`**

```ts
import type { Organization, Leader, Event } from './contentful/types'

export function filterOrganizations(
  orgs: Organization[],
  query: string,
  clusterSlug: string | null,
): Organization[] {
  const q = query.trim().toLowerCase()
  return orgs.filter((o) => {
    const matchesCluster = clusterSlug === null || o.cluster.slug === clusterSlug
    const matchesQuery =
      q === '' || o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
    return matchesCluster && matchesQuery
  })
}

export function groupLeadersByOffice(
  leaders: Leader[],
  officeOrder: string[],
): { office: string; leaders: Leader[] }[] {
  return officeOrder
    .map((office) => ({ office, leaders: leaders.filter((l) => l.office === office) }))
    .filter((group) => group.leaders.length > 0)
}

export function splitEventsByTime(
  events: Event[],
  now: Date,
): { upcoming: Event[]; past: Event[] } {
  const t = now.getTime()
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= t)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const past = events
    .filter((e) => new Date(e.date).getTime() < t)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return { upcoming, past }
}

export function relatedOrganizations(
  orgs: Organization[],
  current: Organization,
  count: number,
): Organization[] {
  return orgs
    .filter((o) => o.slug !== current.slug && o.cluster.slug === current.cluster.slug)
    .slice(0, count)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test`
Expected: PASS.

- [ ] **Step 5: Typecheck and commit**

Run: `bunx tsc -b`
```bash
git add src/lib/directory.ts src/lib/directory.test.ts
git commit -m "feat: add tested directory helpers (filter, group, split, related)"
```

---

### Task 6: By-slug hooks

**Files:**
- Create: `src/hooks/useOrganization.ts`
- Create: `src/hooks/useEvent.ts`

**Interfaces:**
- Consumes: `useQuery` from `@tanstack/react-query`; `organizationsKeys`/`eventsKeys` from `../lib/contentful/queries`; `getOrganizationBySlug`/`getEventBySlug` from `../lib/contentful/services`.
- Produces: `useOrganization(slug: string)`, `useEvent(slug: string)` — TanStack query results of `Organization | null` / `Event | null`.

- [ ] **Step 1: Implement `useOrganization.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { organizationsKeys } from '../lib/contentful/queries'
import { getOrganizationBySlug } from '../lib/contentful/services'

export function useOrganization(slug: string) {
  return useQuery({
    queryKey: organizationsKeys.bySlug(slug),
    queryFn: () => getOrganizationBySlug(slug),
  })
}
```

- [ ] **Step 2: Implement `useEvent.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { eventsKeys } from '../lib/contentful/queries'
import { getEventBySlug } from '../lib/contentful/services'

export function useEvent(slug: string) {
  return useQuery({
    queryKey: eventsKeys.bySlug(slug),
    queryFn: () => getEventBySlug(slug),
  })
}
```

- [ ] **Step 3: Typecheck and commit**

Run: `bunx tsc -b`
```bash
git add src/hooks/useOrganization.ts src/hooks/useEvent.ts
git commit -m "feat: add by-slug organization and event hooks"
```

---

### Task 7: Seo + PageHeader shared components

**Files:**
- Create: `src/components/Seo.tsx`
- Create: `src/components/shared/PageHeader.tsx`

**Interfaces:**
- `Seo` props: `{ title: string; description: string }`.
- `PageHeader` props: `{ eyebrow?: string; title: string; description?: string; accent?: ThreadColor }` — consumes `EmbroideredAccent`, `ThreadDivider`, `Reveal`, `ThreadColor`.

- [ ] **Step 1: Implement `Seo.tsx`**

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

- [ ] **Step 2: Implement `PageHeader.tsx`**

```tsx
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadDivider } from '../ThreadDivider'
import { Reveal } from '../ui/Reveal'
import type { ThreadColor } from '../../lib/assets'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  accent?: ThreadColor
}

export function PageHeader({ eyebrow, title, description, accent = 'blue' }: PageHeaderProps) {
  return (
    <section className="bg-canvas-cream pt-28 pb-12 md:pt-32 md:pb-16">
      <Reveal className="mx-auto max-w-[1200px] px-6 text-center">
        {eyebrow && (
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-stitch-gray">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-[62ch] font-body text-lg leading-relaxed text-fabric-dark">
            {description}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center">
          <ThreadDivider flowerColor={accent} className="w-full max-w-xs" />
        </div>
        <EmbroideredAccent color={accent} index={0} size={0} className="hidden" />
      </Reveal>
    </section>
  )
}
```

Note: the hidden `EmbroideredAccent` line above is a mistake to avoid — remove it. The final component ends at the `ThreadDivider` block. (Included here only to flag: do not add stray hidden accents. The `ThreadDivider` already renders an accent flower.)

Corrected final return has no trailing hidden accent:
```tsx
        <div className="mt-8 flex items-center justify-center">
          <ThreadDivider flowerColor={accent} className="w-full max-w-xs" />
        </div>
      </Reveal>
    </section>
```

- [ ] **Step 3: Typecheck, lint, commit**

Run: `bunx tsc -b && bun run lint`
```bash
git add src/components/Seo.tsx src/components/shared/PageHeader.tsx
git commit -m "feat: add Seo and PageHeader shared components"
```

---

### Task 8: SiteLayout + route/Home refactor

**Files:**
- Create: `src/components/layout/SiteLayout.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- `SiteLayout` renders `FabricTexture` + `Navbar` + `<main class="relative z-[2]"><Outlet/></main>` + `Footer`. Consumes `Outlet` from react-router-dom.
- Produces: shared chrome for all routes; `Home` no longer renders chrome.

- [ ] **Step 1: Implement `SiteLayout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FabricTexture } from '../ui/FabricTexture'

export function SiteLayout() {
  return (
    <>
      <FabricTexture />
      <Navbar />
      <main className="relative z-[2]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Refactor `App.tsx` to nest routes under the layout**

```tsx
import { Routes, Route } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import Home from './pages/Home'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Organizations from './pages/Organizations'
import OrganizationProfile from './pages/OrganizationProfile'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/:slug" element={<OrganizationProfile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 3: Refactor `Home.tsx` to drop self-rendered chrome and use `Seo`**

Replace the current file body so it renders only `Seo` + sections (layout now provides `FabricTexture`/`Navbar`/`<main>`/`Footer`):
```tsx
import { Seo } from '../components/Seo'
import { defaultSeo } from '../config/seo'
import { Hero } from '../components/home/Hero'
import { QuickStats } from '../components/home/QuickStats'
import { AboutSection } from '../components/home/AboutSection'
import { PurposeSection } from '../components/home/PurposeSection'
import { FeaturedOrganization } from '../components/home/FeaturedOrganization'
import { UpcomingEvents } from '../components/home/UpcomingEvents'
import { HomeCTA } from '../components/home/HomeCTA'

export default function Home() {
  return (
    <>
      <Seo title={defaultSeo.title} description={defaultSeo.description} />
      <Hero />
      <QuickStats />
      <AboutSection />
      <PurposeSection />
      <FeaturedOrganization />
      <UpcomingEvents />
      <HomeCTA />
    </>
  )
}
```

- [ ] **Step 4: Verify typecheck, lint, build, and dev smoke**

Run: `bunx tsc -b && bun run lint && bun run build`
Expected: PASS.
Then `bun run dev` and confirm `/` still shows navbar, all sections, footer once each (no duplicated chrome), no console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/SiteLayout.tsx src/App.tsx src/pages/Home.tsx
git commit -m "refactor: share Navbar/Footer via SiteLayout across all routes"
```

---

### Task 9: Shared cards (ClusterBadge, OrganizationCard, OfficerCard, EventCard) + Home adoption

**Files:**
- Create: `src/components/shared/ClusterBadge.tsx`
- Create: `src/components/shared/OrganizationCard.tsx`
- Create: `src/components/shared/OfficerCard.tsx`
- Create: `src/components/shared/EventCard.tsx`
- Modify: `src/components/home/UpcomingEvents.tsx` (use `EventCard`)

**Interfaces:**
- `ClusterBadge` props: `{ slug: string; className?: string }` — looks up `clusterBySlug`, renders a pill tinted in the cluster's thread color.
- `OrganizationCard` props: `{ organization: Organization }`.
- `OfficerCard` props: `{ leader: Leader }`.
- `EventCard` props: `{ event: Event }`.
- Thread-color tinting: because Tailwind cannot generate class names from runtime strings, use an inline style with a lookup from a small `threadHex` map (add to this file set) rather than dynamic class interpolation.

- [ ] **Step 1: Add a thread-hex lookup to `assets.ts`**

Append to `src/lib/assets.ts`:
```ts
export const threadHex: Record<ThreadColor, string> = {
  red: '#c41e3a',
  blue: '#1e5aa8',
  green: '#2d8a3e',
  yellow: '#e4c41a',
  pink: '#e85a9a',
  purple: '#7b3fa0',
}
```

- [ ] **Step 2: Implement `ClusterBadge.tsx`**

```tsx
import { clusterBySlug } from '../../config/clusters'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'

interface ClusterBadgeProps {
  slug: string
  className?: string
}

export function ClusterBadge({ slug, className }: ClusterBadgeProps) {
  const cluster = clusterBySlug(slug)
  if (!cluster) return null
  const hex = threadHex[cluster.color]
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium', className)}
      style={{ backgroundColor: `${hex}1a`, color: hex }}
    >
      {cluster.name}
    </span>
  )
}
```

Note: `${hex}1a` appends hex alpha `0x1a` (~10%) for a soft tinted fill; the text uses the full-strength color. Both pass AA at this size against the linen/cream surfaces (thread colors are all dark enough).

- [ ] **Step 3: Implement `OrganizationCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Organization } from '../../lib/contentful/types'
import { ClusterBadge } from './ClusterBadge'

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link
      to={`/organizations/${organization.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-transform hover:-translate-y-1"
    >
      <img
        src={organization.logo}
        alt={`${organization.name}`}
        width={600}
        height={400}
        loading="lazy"
        className="aspect-[3/2] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <ClusterBadge slug={organization.cluster.slug} className="self-start" />
        <h3 className="font-display text-xl font-bold text-trust-blue">{organization.name}</h3>
        <p className="line-clamp-3 font-body leading-relaxed text-fabric-dark">{organization.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors group-hover:text-thread-red">
          View Organization
          <ArrowRight size={16} strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Implement `OfficerCard.tsx`**

```tsx
import type { Leader } from '../../lib/contentful/types'

interface OfficerCardProps {
  leader: Leader
}

export function OfficerCard({ leader }: OfficerCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <img
        src={leader.image}
        alt={leader.name}
        width={200}
        height={200}
        loading="lazy"
        className="aspect-square w-28 rounded-full object-cover shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
      />
      <div>
        <p className="font-display text-base font-bold text-trust-blue">{leader.name}</p>
        <p className="mt-1 font-body text-sm text-stitch-gray">{leader.role}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Implement `EventCard.tsx`** (extracted from the Home inline card, plus a `muted` option for past events)

```tsx
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import type { Event } from '../../lib/contentful/types'
import { cn } from '../../lib/utils'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface EventCardProps {
  event: Event
  muted?: boolean
}

export function EventCard({ event, muted = false }: EventCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]',
        muted && 'opacity-80',
      )}
    >
      {event.image ? (
        <img
          src={event.image}
          alt={`${event.title} banner`}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[16/10] w-full bg-thread-yellow/15" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl font-bold text-trust-blue">{event.title}</h3>
        <p className="flex items-center gap-2 font-body text-sm text-stitch-gray">
          <Calendar size={16} strokeWidth={1.75} />
          {formatDate(event.date)}
        </p>
        <p className="line-clamp-3 font-body leading-relaxed text-fabric-dark">{event.description}</p>
        <Link
          to={`/events/${event.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
        >
          Learn More
          <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </div>
    </article>
  )
}
```

- [ ] **Step 6: Refactor `UpcomingEvents.tsx` to use `EventCard`**

In `src/components/home/UpcomingEvents.tsx`, remove the local `formatDate` and inline `<article>` markup; import and render `EventCard`:
```tsx
import { EventCard } from '../shared/EventCard'
```
Replace the mapped card block with:
```tsx
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
```
Keep the section wrapper, heading, loading skeletons, and empty state as they are. Remove the now-unused `Calendar`/`ArrowRight`/`Link` imports and the local `formatDate` if no longer referenced.

- [ ] **Step 7: Verify and commit**

Run: `bunx tsc -b && bun run lint && bun run build`
Expected: PASS. Confirm the `line-clamp-3` class appears in the built CSS (it did in the Home build).
```bash
git add src/lib/assets.ts src/components/shared/ClusterBadge.tsx src/components/shared/OrganizationCard.tsx src/components/shared/OfficerCard.tsx src/components/shared/EventCard.tsx src/components/home/UpcomingEvents.tsx
git commit -m "feat: add shared cluster/org/officer/event cards and adopt EventCard on Home"
```

---

### Task 10: About page

**Files:**
- Modify: `src/pages/About.tsx`

**Interfaces:**
- Consumes: `Seo`, `PageHeader`, `Reveal`, `EmbroideredAccent`, `ThreadDivider`, `clusters` (for thread-color cycling on function cards is optional; use a fixed 6-color array), `ThreadColor`.

Layout families: PageHeader → Who We Are prose → Our Purpose 6-function bento (3-col) → Vision + Mission split → Core Principles stitched list.

- [ ] **Step 1: Implement `About.tsx`**

```tsx
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { ThreadDivider } from '../components/ThreadDivider'
import type { ThreadColor } from '../lib/assets'

const FUNCTIONS: { title: string; body: string; color: ThreadColor }[] = [
  { title: 'As a Representative Body', color: 'red', body: 'COA-Z defends and advances the general welfare of its member organizations, ensuring their voices are heard in university-wide decision-making.' },
  { title: 'As an Administrative Body', color: 'blue', body: "COA-Z advances member organizations' welfare and advocacies, and upholds its rights within university committees such as the Central Assembly and El Consejo Atenista." },
  { title: 'As an Administrative Body', color: 'purple', body: 'COA-Z streamlines processes and archives relevant data to preserve efficiency in transitions and operations, both for the Council as a whole and for individual member organizations.' },
  { title: 'As a Formative Body', color: 'green', body: 'COA-Z fosters the enrichment of core competencies, advocacies, and organizational development toward the holistic formation of members and constituents.' },
  { title: 'As a Unitive Body', color: 'yellow', body: 'COA-Z provides platforms and fosters purposeful collaboration among member organizations and institutions, within and beyond Ateneo.' },
  { title: 'Through Service', color: 'pink', body: 'COA-Z fulfills its purpose through essential, effective, and adequate support services and initiatives, and as collective representative and liaison to external entities.' },
]

const PRINCIPLES: { title: string; body: string; color: ThreadColor }[] = [
  { title: 'Representative Democracy', color: 'red', body: 'All Ateneo student organizations are present and united in creating a collaborative community that develops student leaders to become empowered, active, competent, and holistically formed.' },
  { title: 'Equality and Accessibility', color: 'green', body: 'All Ateneo student organizations and their constituents receive fair and equal treatment, and benefit from and with each other in order to form a progressive and effective coalition.' },
  { title: 'Transparency and Accountability', color: 'blue', body: 'All Ateneo student organizations are held fully responsible for decisions that impact the community, with no exemptions.' },
]

export default function About() {
  return (
    <>
      <Seo title="About COA-Z | COA-Z" description="Who we are, our purpose, vision, mission, and core principles as the alliance of accredited organizations of Ateneo de Zamboanga University." />

      <PageHeader
        eyebrow="About"
        title="Who We Are"
        accent="green"
        description="The sole alliance of all Ateneo de Zamboanga University College-accredited organizations, and the primary bridge between El Consejo Atenista and the campus organizations it oversees."
      />

      {/* Who We Are prose */}
      <section className="bg-canvas-cream py-16 md:py-20">
        <Reveal className="mx-auto max-w-[68ch] px-6">
          <div className="flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            <p>
              The Council of the Organizations of the Ateneo - Zamboanga (COA-Z) unites all accredited
              organizations under a shared commitment to leadership, collaboration, and community. We serve
              as the primary bridge between El Consejo Atenista and the campus organizations it oversees.
            </p>
            <p>
              For years, COA-Z has been the central body that creates platforms and programs for meaningful
              collaboration among member organizations and with external institutions alike. We amplify
              proactive leadership, support student organizations' initiatives, and build spaces where
              Ateneans can work together toward a greater good.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Our Purpose: six functions */}
      <section className="bg-linen-white py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
              Our Purpose
            </h2>
            <p className="mx-auto mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark">
              COA-Z fulfills six core functions as the governing alliance of AdZU's accredited organizations.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FUNCTIONS.map((f, i) => (
              <Reveal key={`${f.title}-${i}`} delay={(i % 3) * 80}>
                <article className="relative h-full overflow-hidden rounded-[8px] border border-trust-blue/10 bg-canvas-cream p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  <EmbroideredAccent color={f.color} index={0} size={40} className="absolute right-5 top-5 opacity-90" />
                  <h3 className="max-w-[16ch] font-display text-xl font-bold text-trust-blue">{f.title}</h3>
                  <p className="mt-3 font-body leading-relaxed text-fabric-dark">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision + Mission split */}
      <section className="bg-canvas-cream py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-[8px] bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
            <span className="font-accent text-3xl text-thread-purple">Our Vision</span>
            <p className="font-body leading-relaxed text-fabric-dark">
              The Council of Organizations of Ateneo - Zamboanga envisions itself as an empowered and
              collaborative community of competent organizations and holistically-formed students, ready to
              proactively respond to the challenges of their time and initiate positive changes within the
              Ateneo community and in greater society, through the Ignatian tradition of service and excellence.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-4 rounded-[8px] bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
            <span className="font-accent text-3xl text-thread-green">Our Mission</span>
            <p className="font-body leading-relaxed text-fabric-dark">
              We develop organizations as formative spaces, providing Ateneans venues for critical
              socio-political discourse, business engagement, spiritual growth, environmental action, physical
              and mental health, cultural exploration, creative communication, artistic expression, social
              immersion, and innovation through science and technology. We empower organizations to be united,
              effective, collaborative, and sustainable through proper guidance, dialogue, and support.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Principles stitched list */}
      <section className="bg-linen-white py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
              Core Principles
            </h2>
          </Reveal>
          <div className="flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title}>
                <div className="flex flex-col items-center gap-3 py-8 text-center md:flex-row md:items-start md:gap-6 md:text-left">
                  <EmbroideredAccent color={p.color} index={0} size={48} className="shrink-0" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-trust-blue">{p.title}</h3>
                    <p className="mt-2 max-w-[60ch] font-body leading-relaxed text-fabric-dark">{p.body}</p>
                  </div>
                </div>
                {i < PRINCIPLES.length - 1 && <ThreadDivider className="mx-auto max-w-2xl" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `bunx tsc -b && bun run lint`
Expected: PASS. Grep the file for em/en-dashes: `grep -nP '[\x{2013}\x{2014}]' src/pages/About.tsx` returns nothing.
```bash
git add src/pages/About.tsx
git commit -m "feat: implement About COA-Z page"
```

---

### Task 11: Leadership page

**Files:**
- Modify: `src/pages/Leadership.tsx`

**Interfaces:**
- Consumes: `Seo`, `PageHeader`, `Reveal`, `OfficerCard`, `offices`/`buklodCommittee` from `../config/leadership`, `useLeadership`, `groupLeadersByOffice` from `../lib/directory`, `EmbroideredAccent`.

Layout: PageHeader → Executive Board intro → per-office roster blocks (office header + officer-card grid) → Buklod callout band. Loading = skeleton officer grid.

- [ ] **Step 1: Implement `Leadership.tsx`**

```tsx
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { OfficerCard } from '../components/shared/OfficerCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { offices, buklodCommittee } from '../config/leadership'
import { useLeadership } from '../hooks/useLeadership'
import { groupLeadersByOffice } from '../lib/directory'

export default function Leadership() {
  const { data, isLoading } = useLeadership()
  const officeOrder = offices.map((o) => o.name)
  const groups = groupLeadersByOffice(data ?? [], officeOrder)

  return (
    <>
      <Seo title="Leadership | COA-Z" description="The Executive Board of COA-Z: five offices and the Buklod Atenista Envoy Committee serving the Council and its member organizations." />

      <PageHeader
        eyebrow="Leadership"
        title="Executive Board"
        accent="red"
        description="The Executive Board of COA-Z comprises five offices, each addressing distinct organizational concerns of the Council."
      />

      <section className="bg-canvas-cream py-12 md:py-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-6">
          {isLoading
            ? offices.map((office) => (
                <div key={office.name} className="flex flex-col gap-6">
                  <div className="h-8 w-72 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="h-28 w-28 animate-pulse rounded-full bg-stitch-gray/20" />
                        <div className="h-4 w-24 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : groups.map((group) => {
                const meta = offices.find((o) => o.name === group.office)
                return (
                  <Reveal key={group.office} className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <EmbroideredAccent color={meta?.color ?? 'blue'} index={0} size={44} className="mt-1 shrink-0" />
                      <div>
                        <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                          {group.office}
                        </h2>
                        {meta && (
                          <p className="mt-2 max-w-[70ch] font-body leading-relaxed text-fabric-dark">
                            {meta.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                      {group.leaders.map((leader) => (
                        <OfficerCard key={leader.id} leader={leader} />
                      ))}
                    </div>
                  </Reveal>
                )
              })}
        </div>
      </section>

      {/* Buklod callout */}
      <section className="bg-trust-blue py-20 md:py-24">
        <Reveal className="mx-auto flex max-w-[800px] flex-col items-center gap-5 px-6 text-center">
          <EmbroideredAccent color="yellow" index={0} size={56} />
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

- [ ] **Step 2: Verify and commit**

Run: `bunx tsc -b && bun run lint`; grep for em/en-dashes returns nothing.
```bash
git add src/pages/Leadership.tsx
git commit -m "feat: implement Leadership page with office rosters"
```

---

### Task 12: Organizations page (directory + filter)

**Files:**
- Modify: `src/pages/Organizations.tsx`

**Interfaces:**
- Consumes: `Seo`, `PageHeader`, `Reveal`, `OrganizationCard`, `EmbroideredAccent`, `clusters` from `../config/clusters`, `threadHex` from `../lib/assets`, `useOrganizations`, `filterOrganizations` from `../lib/directory`, `useState` from react. Local state: `query: string`, `activeCluster: string | null`.

Layout: PageHeader → 6-cluster overview bento (2×3) → search input + cluster chips + directory grid → empty state.

- [ ] **Step 1: Implement `Organizations.tsx`**

```tsx
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { OrganizationCard } from '../components/shared/OrganizationCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { clusters } from '../config/clusters'
import { threadHex } from '../lib/assets'
import { useOrganizations } from '../hooks/useOrganizations'
import { filterOrganizations } from '../lib/directory'
import { cn } from '../lib/utils'

export default function Organizations() {
  const { data, isLoading } = useOrganizations()
  const [query, setQuery] = useState('')
  const [activeCluster, setActiveCluster] = useState<string | null>(null)
  const orgs = data ?? []
  const results = filterOrganizations(orgs, query, activeCluster)

  return (
    <>
      <Seo title="Organizations | COA-Z" description="Explore the accredited member organizations of COA-Z, grouped into six clusters of student formation at Ateneo de Zamboanga University." />

      <PageHeader
        eyebrow="Organizations"
        title="Member Organizations"
        accent="blue"
        description="COA-Z member organizations are grouped into six clusters based on their organizational vision and focus. Each cluster fosters a distinct sphere of student formation."
      />

      {/* Cluster overview */}
      <section className="bg-linen-white py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster, i) => {
              const count = orgs.filter((o) => o.cluster.slug === cluster.slug).length
              return (
                <Reveal key={cluster.slug} delay={(i % 3) * 80}>
                  <button
                    type="button"
                    onClick={() => setActiveCluster(cluster.slug)}
                    className="flex h-full w-full flex-col gap-3 rounded-[8px] border border-trust-blue/10 bg-canvas-cream p-6 text-left shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-transform hover:-translate-y-1"
                    style={{ borderTop: `4px solid ${threadHex[cluster.color]}` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-trust-blue">{cluster.name}</h3>
                      <EmbroideredAccent color={cluster.color} index={0} size={36} />
                    </div>
                    <p className="font-body text-sm leading-relaxed text-fabric-dark">{cluster.description}</p>
                    {!isLoading && (
                      <span className="mt-auto font-body text-xs font-medium text-stitch-gray">
                        {count} {count === 1 ? 'organization' : 'organizations'}
                      </span>
                    )}
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-8 flex flex-col gap-6">
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
              Organization Directory
            </h2>

            <div className="relative max-w-md">
              <Search size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-stitch-gray" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search organizations"
                aria-label="Search organizations"
                className="w-full rounded-[8px] border border-trust-blue/15 bg-linen-white py-3 pl-11 pr-4 font-body text-fabric-dark placeholder:text-stitch-gray focus-visible:border-trust-blue"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCluster(null)}
                className={cn(
                  'rounded-full border px-4 py-2 font-body text-sm font-medium transition-colors',
                  activeCluster === null
                    ? 'border-trust-blue bg-trust-blue text-linen-white'
                    : 'border-trust-blue/20 text-trust-blue hover:border-trust-blue',
                )}
              >
                All
              </button>
              {clusters.map((cluster) => (
                <button
                  key={cluster.slug}
                  type="button"
                  onClick={() => setActiveCluster(cluster.slug)}
                  className={cn(
                    'rounded-full border px-4 py-2 font-body text-sm font-medium transition-colors',
                    activeCluster === cluster.slug
                      ? 'border-trust-blue bg-trust-blue text-linen-white'
                      : 'border-trust-blue/20 text-trust-blue hover:border-trust-blue',
                  )}
                >
                  {cluster.name}
                </button>
              ))}
            </div>
          </Reveal>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  <div className="aspect-[3/2] animate-pulse bg-stitch-gray/20" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                    <div className="h-4 w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <Reveal className="flex flex-col items-center gap-4 py-12 text-center">
              <EmbroideredAccent color="yellow" index={1} size={56} />
              <p className="font-body text-lg text-stitch-gray">
                No organizations match your search. Try a different term or cluster.
              </p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((org, i) => (
                <Reveal key={org.slug} delay={(i % 3) * 60}>
                  <OrganizationCard organization={org} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `bunx tsc -b && bun run lint`; grep for em/en-dashes returns nothing.
```bash
git add src/pages/Organizations.tsx
git commit -m "feat: implement Organizations directory with cluster filter and search"
```

---

### Task 13: Organization profile page

**Files:**
- Modify: `src/pages/OrganizationProfile.tsx`

**Interfaces:**
- Consumes: `Seo`, `Reveal`, `ClusterBadge`, `OrganizationCard`, `EmbroideredAccent`, `useParams`/`Link` from react-router-dom, `useOrganization` (Task 6), `useOrganizations` + `relatedOrganizations`, `hoopFrames`, `buttonVariants`, `ArrowLeft` icon.

Layout: framed spotlight header → officers stitched list → related-orgs grid → back link. Loading skeleton; not-found composed message.

- [ ] **Step 1: Implement `OrganizationProfile.tsx`**

```tsx
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/ui/Reveal'
import { ClusterBadge } from '../components/shared/ClusterBadge'
import { OrganizationCard } from '../components/shared/OrganizationCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { buttonVariants } from '../components/ui/Button'
import { useOrganization } from '../hooks/useOrganization'
import { useOrganizations } from '../hooks/useOrganizations'
import { relatedOrganizations } from '../lib/directory'

export default function OrganizationProfile() {
  const { slug = '' } = useParams()
  const { data: organization, isLoading } = useOrganization(slug)
  const { data: allOrgs } = useOrganizations()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-20">
        <div className="h-80 w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
      </div>
    )
  }

  if (!organization) {
    return (
      <>
        <Seo title="Organization Not Found | COA-Z" description="The organization you are looking for could not be found." />
        <section className="mx-auto flex max-w-[700px] flex-col items-center gap-6 px-6 pt-32 pb-24 text-center">
          <EmbroideredAccent color="red" index={0} size={64} />
          <h1 className="font-display text-3xl font-bold text-trust-blue">Organization Not Found</h1>
          <p className="font-body text-lg text-fabric-dark">
            We could not find that organization. It may have been renamed or is no longer accredited.
          </p>
          <Link to="/organizations" className={buttonVariants({ variant: 'secondary' })}>
            Back to Organizations
          </Link>
        </section>
      </>
    )
  }

  const related = relatedOrganizations(allOrgs ?? [], organization, 3)

  return (
    <>
      <Seo title={`${organization.name} | COA-Z`} description={organization.description} />

      {/* Spotlight header */}
      <section className="bg-canvas-cream pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-sm">
            <img
              src={organization.logo}
              alt={organization.name}
              width={600}
              height={400}
              loading="eager"
              className="aspect-[3/2] w-full rounded-[8px] object-cover shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
            />
            <EmbroideredAccent color="pink" index={0} size={52} className="absolute -right-3 -top-4" />
          </Reveal>

          <Reveal delay={120} className="flex flex-col items-start gap-4">
            <ClusterBadge slug={organization.cluster.slug} />
            <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
              {organization.name}
            </h1>
            <p className="max-w-[54ch] font-body text-lg leading-relaxed text-fabric-dark">
              {organization.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Officers */}
      {organization.officers.length > 0 && (
        <section className="bg-linen-white py-16 md:py-20">
          <div className="mx-auto max-w-[1000px] px-6">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                Officers
              </h2>
              <ul className="mt-6 flex flex-col divide-y divide-dashed divide-stitch-gray/40">
                {organization.officers.map((officer) => (
                  <li key={officer} className="py-3 font-body text-lg text-fabric-dark">
                    {officer}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-canvas-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                More in {organization.cluster.name}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((org) => (
                <OrganizationCard key={org.slug} organization={org} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <Link to="/organizations" className="inline-flex items-center gap-2 font-body font-medium text-trust-blue transition-colors hover:text-thread-red">
          <ArrowLeft size={18} strokeWidth={1.75} />
          Back to Organizations
        </Link>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `bunx tsc -b && bun run lint`; grep for em/en-dashes returns nothing.
```bash
git add src/pages/OrganizationProfile.tsx
git commit -m "feat: implement organization profile page"
```

---

### Task 14: Events page

**Files:**
- Modify: `src/pages/Events.tsx`

**Interfaces:**
- Consumes: `Seo`, `PageHeader`, `Reveal`, `EventCard`, `EmbroideredAccent`, `useEvents`, `splitEventsByTime`.

Layout: PageHeader → Upcoming grid → Past grid (muted) → empty states. Loading skeletons.

- [ ] **Step 1: Implement `Events.tsx`**

```tsx
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Reveal } from '../components/ui/Reveal'
import { EventCard } from '../components/shared/EventCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { useEvents } from '../hooks/useEvents'
import { splitEventsByTime } from '../lib/directory'

export default function Events() {
  const { data, isLoading } = useEvents()
  const { upcoming, past } = splitEventsByTime(data ?? [], new Date())

  return (
    <>
      <Seo title="Events | COA-Z" description="Upcoming and past activities of COA-Z and its member organizations at Ateneo de Zamboanga University." />

      <PageHeader
        eyebrow="Events"
        title="Activities"
        accent="yellow"
        description="Programs, formations, and gatherings that bring COA-Z member organizations together throughout the year."
      />

      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                  <div className="aspect-[16/10] animate-pulse bg-stitch-gray/20" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                    <div className="h-4 w-1/2 animate-pulse rounded-[8px] bg-stitch-gray/20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-20">
              <div>
                <Reveal className="mb-8">
                  <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                    Upcoming
                  </h2>
                </Reveal>
                {upcoming.length === 0 ? (
                  <Reveal className="flex flex-col items-center gap-4 py-8 text-center">
                    <EmbroideredAccent color="yellow" index={1} size={56} />
                    <p className="font-body text-lg text-stitch-gray">
                      New activities are being woven together. Check back soon.
                    </p>
                  </Reveal>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {upcoming.map((event, i) => (
                      <Reveal key={event.id} delay={(i % 3) * 80}>
                        <EventCard event={event} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>

              {past.length > 0 && (
                <div>
                  <Reveal className="mb-8">
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                      Past Activities
                    </h2>
                  </Reveal>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {past.map((event, i) => (
                      <Reveal key={event.id} delay={(i % 3) * 80}>
                        <EventCard event={event} muted />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `bunx tsc -b && bun run lint`; grep for em/en-dashes returns nothing.
```bash
git add src/pages/Events.tsx
git commit -m "feat: implement Events page with upcoming and past grids"
```

---

### Task 15: Event detail page

**Files:**
- Modify: `src/pages/EventDetail.tsx`

**Interfaces:**
- Consumes: `Seo`, `Reveal`, `EventCard`, `EmbroideredAccent`, `buttonVariants`, `useParams`/`Link`, `useEvent` (Task 6), `useEvents` + `splitEventsByTime`, `Calendar`/`ArrowLeft` icons.

Layout: full-bleed banner header → meta + description prose → other-upcoming row → back link. Loading + not-found states.

- [ ] **Step 1: Implement `EventDetail.tsx`**

```tsx
import { useParams, Link } from 'react-router-dom'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Reveal } from '../components/ui/Reveal'
import { EventCard } from '../components/shared/EventCard'
import { EmbroideredAccent } from '../components/EmbroideredAccent'
import { buttonVariants } from '../components/ui/Button'
import { useEvent } from '../hooks/useEvent'
import { useEvents } from '../hooks/useEvents'
import { splitEventsByTime } from '../lib/directory'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function EventDetail() {
  const { slug = '' } = useParams()
  const { data: event, isLoading } = useEvent(slug)
  const { data: allEvents } = useEvents()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] px-6 pt-32 pb-20">
        <div className="aspect-[16/9] w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
      </div>
    )
  }

  if (!event) {
    return (
      <>
        <Seo title="Event Not Found | COA-Z" description="The event you are looking for could not be found." />
        <section className="mx-auto flex max-w-[700px] flex-col items-center gap-6 px-6 pt-32 pb-24 text-center">
          <EmbroideredAccent color="red" index={0} size={64} />
          <h1 className="font-display text-3xl font-bold text-trust-blue">Event Not Found</h1>
          <p className="font-body text-lg text-fabric-dark">
            We could not find that event. It may have been rescheduled or removed.
          </p>
          <Link to="/events" className={buttonVariants({ variant: 'secondary' })}>
            Back to Events
          </Link>
        </section>
      </>
    )
  }

  const others = splitEventsByTime(allEvents ?? [], new Date())
    .upcoming.filter((e) => e.slug !== event.slug)
    .slice(0, 3)

  return (
    <>
      <Seo title={`${event.title} | COA-Z`} description={event.description} />

      <section className="bg-canvas-cream pt-24 md:pt-28">
        {event.image && (
          <div className="mx-auto max-w-[1200px] px-6">
            <img
              src={event.image}
              alt={`${event.title} banner`}
              className="aspect-[16/9] w-full rounded-[8px] object-cover shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
              loading="eager"
            />
          </div>
        )}
      </section>

      <section className="bg-canvas-cream py-12 md:py-16">
        <Reveal className="mx-auto max-w-[68ch] px-6">
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
            {event.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 font-body text-stitch-gray">
            <Calendar size={18} strokeWidth={1.75} />
            {formatDate(event.date)}
          </p>
          <p className="mt-8 font-body text-lg leading-relaxed text-fabric-dark">{event.description}</p>
        </Reveal>
      </section>

      {others.length > 0 && (
        <section className="bg-linen-white py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                Other Upcoming Activities
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {others.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <Link to="/events" className="inline-flex items-center gap-2 font-body font-medium text-trust-blue transition-colors hover:text-thread-red">
          <ArrowLeft size={18} strokeWidth={1.75} />
          Back to Events
        </Link>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `bunx tsc -b && bun run lint`; grep for em/en-dashes returns nothing.
```bash
git add src/pages/EventDetail.tsx
git commit -m "feat: implement event detail page"
```

---

### Task 16: NotFound page + final verification

**Files:**
- Modify: `src/pages/NotFound.tsx`

**Interfaces:**
- Consumes: `Seo`, `Link`, `buttonVariants`, `EmbroideredAccent`.

- [ ] **Step 1: Implement `NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { buttonVariants } from '../components/ui/Button'
import { EmbroideredAccent } from '../components/EmbroideredAccent'

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | COA-Z" description="The page you are looking for could not be found." />
      <section className="mx-auto flex min-h-[60dvh] max-w-[700px] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <div className="flex items-center gap-3">
          <EmbroideredAccent color="pink" index={0} size={48} />
          <EmbroideredAccent color="blue" index={0} size={48} />
          <EmbroideredAccent color="yellow" index={0} size={48} />
        </div>
        <h1 className="font-display text-5xl font-black tracking-[-0.02em] text-trust-blue">404</h1>
        <p className="font-body text-lg leading-relaxed text-fabric-dark">
          This thread leads nowhere. The page you are looking for may have moved or no longer exists.
        </p>
        <Link to="/" className={buttonVariants({ variant: 'primary' })}>
          Return Home
        </Link>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Full verification**

Run: `bunx tsc -b && bun run lint && bun run test && bun run build`
Expected: typecheck clean, lint clean (only the two pre-existing fast-refresh warnings), all Vitest tests pass, build emits.

- [ ] **Step 3: Dev smoke across every route**

Run `bun run dev`, then confirm each renders with shared navbar + footer, no console errors, no horizontal scroll at 375/768/1280px:
- `/` (still correct after layout refactor; stats now populated, featured org + upcoming events show)
- `/about`, `/leadership`, `/organizations`, `/organizations/the-beacon`, `/events`, `/events/org-fair-2026`, `/some-garbage-url` (NotFound)
- On `/organizations`: type in search, click cluster chips and cluster cards, confirm the grid filters and the empty state shows for no matches.
- Toggle OS reduce-motion: reveals show instantly.

- [ ] **Step 4: Pre-Flight self-audit (design-taste-frontend §14)**

Confirm across all new pages: zero em/en-dashes (`grep -rnP '[\x{2013}\x{2014}]' src/pages src/components src/config src/data` returns nothing); one light theme; Trust Blue primary + consistent cluster colors; radius lock (pill buttons/chips, 8px cards/inputs); every CTA and chip readable (AA); no CTA wraps at desktop; eyebrow count within budget per page; ≥4 layout families per page with no repeats; no 3 consecutive image+text splits; real/mock images everywhere (no div fake screenshots, no hand-rolled SVG icons); loading + empty + not-found states present; lucide icons only; form input (search) has a visible label (`aria-label`) and AA-contrast placeholder. Fix any miss before committing.

- [ ] **Step 5: Commit**

```bash
git add src/pages/NotFound.tsx
git commit -m "feat: implement NotFound page"
```

---

## Self-Review (against docs/content.md and the routes)

- **/about** (Who We Are, Our Purpose 6 functions, Vision, Mission, Core Principles) → Task 10. Covered. Em-dashes in source copy rewritten to hyphens/commas.
- **/leadership** (Executive Board, 5 offices with positions, Buklod committee; officer names/photos dynamic) → Tasks 2, 3, 5, 11. Covered; static office copy in config, officers from mock data via `groupLeadersByOffice`.
- **/organizations** (6 clusters, directory grid, mock data with title/description/image, cluster filtering) → Tasks 1, 3, 5, 12. Covered; searchable + cluster-filterable.
- **/organizations/:slug** (org profile) → Task 13. Covered (content.md implies per-org profile via the directory note).
- **/events**, **/events/:slug** → Tasks 14, 15. Not in content.md, but required routes; built from the existing `Event` type + mock data, matching the Home Upcoming Events pattern.
- **/*  NotFound** → Task 16. Covered.
- **Shared design system** (Navbar/Footer on every page, PageHeader, tokens, motion, a11y) → Tasks 7, 8, 9. Covered via `SiteLayout`.

**Open items to confirm with the user (do not block the plan):**
1. **Mock data replaces empty Contentful stubs.** All mock people/orgs/events are invented placeholders; swap for real Contentful content when credentials are ready (single point: `src/data/mock.ts` + `src/lib/contentful/services.ts`).
2. **picsum.photos images require network at runtime.** Fine for dev/mock; real assets should replace them before launch.
3. **`content.md` had no `/events` copy** and ended mid-file (line 195 "For not, make mock-up data"); Events pages follow the Home pattern. Confirm desired Events content.
4. Same carry-overs from the Home plan still stand: real footer contact/socials, possible `Event.venue` field, and Made Tommy / Omegle "PERSONAL USE" font licensing.
