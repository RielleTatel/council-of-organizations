# RecWeek Interactive Booth Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stub RecWeek page with a per-venue, SVG-based interactive booth map (pan/zoom, hover/click-to-locate, floating org preview) styled to the COA-Z "Interwoven Beyond" design system.

**Architecture:** A single page (`RecWeek.tsx`) owns three pieces of state — `activeVenue`, `selectedBoothId`, `hoveredBoothId` — and passes them to a `BoothMap` (react-zoom-pan-pinch wrapper around an `<svg>`) and an `OrganizationSidebar`. Booth/venue/landmark data is static in `src/data/recweekBooths.ts`, deriving org full names and Facebook links from the existing `src/data/organizations.ts` roster by `orgId`. All animation uses the already-installed `framer-motion`.

**Tech Stack:** React 19 + TypeScript, react-router-dom v7, Tailwind v4 (`@theme` tokens in `src/index.css`), framer-motion (installed), lucide-react (installed), `react-zoom-pan-pinch` (to install), vitest.

## Global Constraints

- **Design system:** Follow `docs/COA-Z_Interwoven_Beyond_Design_System.md`. Use only theme tokens from `src/index.css`: `--color-trust-blue #2e4a8f`, `--color-canvas-cream #f5f0e8`, `--color-linen-white #faf8f5`, `--color-fabric-dark #3d3d3d`, `--color-stitch-gray #8a8a8a`, `--color-shadow-thread rgba(46,74,143,.08)`, thread colors (`--color-thread-red/blue/green/yellow/pink/purple`). Fonts: `--font-display`/`--font-body` = "Made Tommy", `--font-accent` = "Omegle".
- **Icons:** use `lucide-react` only. Do NOT install `react-icons`.
- **Card convention (reuse verbatim):** `rounded-[8px]`, `bg-linen-white`, `border border-trust-blue/10`, `shadow-[0_4px_20px_rgba(46,74,143,0.06)]`, hover `-translate-y-1`.
- **Zoom limits:** `minScale={1}` (100%), `maxScale={3}` (300%).
- **No looping animations.** Booth-select sequence total ~0.5s, runs once.
- **Unmatched booths** (`APC`, `JUDO`, `FABLE`, `ROTARACT`, `PSYCH iCARE`, `ALMS`, `ICPEP`, `NFJPIA`, `GLEE CLUB`, `SALT`, `APN`): render on map AND in sidebar as generic exhibitor booths (acronym only, no full name/link/CTA).
- **"View Organization" link:** uses the matched org's external `link` (Facebook) from `organizations.ts`, `target="_blank" rel="noopener noreferrer"`. Do NOT route to `/organizations/:slug` (that directory is Contentful-slug-driven and won't match static ids).
- **Import style:** relative imports (no `@/` alias configured), e.g. `../../data/recweekBooths`.
- **Commit cadence:** commit at the end of each task with the message shown in its final step.

---

### Task 1: Dependency + booth/venue data model

**Files:**
- Modify: `package.json` (add `react-zoom-pan-pinch`)
- Create: `src/data/recweekBooths.ts`
- Test: `src/data/recweekBooths.test.ts`

**Interfaces:**
- Consumes: `organizations` and `Organization` from `../data/organizations` (fields `id`, `name`, `link?`).
- Produces:
  - `type BoothShape = { id: string; orgId?: string; acronym: string; boothNumber?: string; x: number; y: number; width: number; height: number; rotation?: number }`
  - `type LandmarkType = "stage" | "tent" | "pond" | "pathway" | "church" | "statue" | "podium" | "entrance"`
  - `type Landmark = { id: string; type: LandmarkType; label?: string; x: number; y: number; width: number; height: number; rotation?: number }`
  - `type Venue = { id: VenueId; label: string; viewBox: string; landmarks: Landmark[]; booths: BoothShape[] }`
  - `type VenueId = "bc-lobby-quad" | "c-lobby-garden" | "paseo-de-maria"`
  - `const venues: Venue[]`
  - `function boothOrg(booth: BoothShape): Organization | undefined` — resolves `orgId` against the roster.
  - `function boothFullName(booth: BoothShape): string | undefined`
  - `function boothHref(booth: BoothShape): string | undefined`

- [ ] **Step 1: Install the pan/zoom library**

Run:
```bash
npm install react-zoom-pan-pinch
```
Expected: adds `react-zoom-pan-pinch` to `dependencies` in `package.json`, no peer-dependency errors (it supports React 18/19).

- [ ] **Step 2: Write the failing data-integrity test**

Create `src/data/recweekBooths.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { venues, boothOrg, boothFullName, boothHref, type BoothShape } from './recweekBooths'
import { organizations } from './organizations'

const allBooths: BoothShape[] = venues.flatMap((v) => v.booths)

const UNMATCHED = new Set([
  'APC', 'JUDO', 'FABLE', 'ROTARACT', 'PSYCH iCARE',
  'ALMS', 'ICPEP', 'NFJPIA', 'GLEE CLUB', 'SALT', 'APN',
])

describe('recweek venues', () => {
  it('has the three venues in canonical order', () => {
    expect(venues.map((v) => v.id)).toEqual([
      'bc-lobby-quad', 'c-lobby-garden', 'paseo-de-maria',
    ])
  })

  it('gives every booth a unique id', () => {
    const ids = allBooths.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every venue a valid "minX minY width height" viewBox', () => {
    for (const v of venues) {
      expect(v.viewBox).toMatch(/^-?\d+(\.\d+)?( -?\d+(\.\d+)?){3}$/)
    }
  })

  it('links every orgId to a real organization', () => {
    const orgIds = new Set(organizations.map((o) => o.id))
    for (const b of allBooths) {
      if (b.orgId) expect(orgIds).toContain(b.orgId)
    }
  })

  it('leaves the known exhibitor booths unmatched', () => {
    for (const b of allBooths) {
      if (UNMATCHED.has(b.acronym)) expect(b.orgId).toBeUndefined()
    }
  })

  it('resolves full name + href only for matched booths', () => {
    for (const b of allBooths) {
      if (b.orgId) {
        expect(boothOrg(b)).toBeDefined()
        expect(boothFullName(b)).toBeTruthy()
      } else {
        expect(boothOrg(b)).toBeUndefined()
        expect(boothFullName(b)).toBeUndefined()
        expect(boothHref(b)).toBeUndefined()
      }
    }
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/data/recweekBooths.test.ts`
Expected: FAIL — `Cannot find module './recweekBooths'`.

- [ ] **Step 4: Create the data module**

Create `src/data/recweekBooths.ts`. Coordinates below are a structurally-correct first pass in each venue's own viewBox space (BC is portrait, C is portrait, Paseo is landscape); they are refined visually against the source PNGs in Task 3. Booth rects are `w:10 h:7` unless the PNG shows a wider/rotated cell.

```ts
import { organizations, type Organization } from './organizations'

export type BoothShape = {
  id: string
  orgId?: string
  acronym: string
  boothNumber?: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export type LandmarkType =
  | 'stage' | 'tent' | 'pond' | 'pathway' | 'church' | 'statue' | 'podium' | 'entrance'

export type Landmark = {
  id: string
  type: LandmarkType
  label?: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export type VenueId = 'bc-lobby-quad' | 'c-lobby-garden' | 'paseo-de-maria'

export type Venue = {
  id: VenueId
  label: string
  viewBox: string
  landmarks: Landmark[]
  booths: BoothShape[]
}

const byId = new Map(organizations.map((o) => [o.id, o]))

export function boothOrg(booth: BoothShape): Organization | undefined {
  return booth.orgId ? byId.get(booth.orgId) : undefined
}
export function boothFullName(booth: BoothShape): string | undefined {
  return boothOrg(booth)?.name
}
export function boothHref(booth: BoothShape): string | undefined {
  return boothOrg(booth)?.link
}

export const venues: Venue[] = [
  {
    id: 'bc-lobby-quad',
    label: 'BC Lobby & Quad',
    viewBox: '0 0 100 145',
    landmarks: [
      { id: 'bc-tent', type: 'tent', label: 'Tent', x: 9, y: 8, width: 82, height: 40 },
      { id: 'bc-podium', type: 'podium', label: 'Podium', x: 45, y: 42, width: 10, height: 5 },
      { id: 'bc-quad', type: 'entrance', label: 'BC Quad', x: 4, y: 5, width: 92, height: 58 },
      { id: 'bc-statue', type: 'statue', label: 'St. Iggy', x: 38, y: 66, width: 24, height: 9 },
      { id: 'bc-lobby', type: 'entrance', label: 'BC Lobby', x: 12, y: 80, width: 76, height: 60 },
    ],
    booths: [
      { id: 'bc-ecowatch', orgId: 'the-ecowatch-organization', acronym: 'ECO WATCH', x: 12, y: 54, width: 9, height: 7 },
      { id: 'bc-apc', acronym: 'APC', x: 21, y: 54, width: 9, height: 7 },
      { id: 'bc-judo', acronym: 'JUDO', x: 70, y: 54, width: 9, height: 7 },
      { id: 'bc-fable', acronym: 'FABLE', x: 79, y: 54, width: 9, height: 7 },
      { id: 'bc-jjc', orgId: 'junior-jaycees-chamber-adzu', acronym: 'JJC', x: 15, y: 92, width: 7, height: 14, rotation: 90 },
      { id: 'bc-llhz', orgId: 'la-liga-historia-zamboanguena', acronym: 'LLHZ', x: 22, y: 92, width: 7, height: 14, rotation: 90 },
      { id: 'bc-ipadz', orgId: 'ipadz', acronym: 'IPAdZ', x: 15, y: 114, width: 7, height: 14, rotation: 90 },
      { id: 'bc-efph', orgId: 'el-fuente-ph', acronym: 'EF Ph', x: 22, y: 114, width: 7, height: 14, rotation: 90 },
      { id: 'bc-usad', orgId: 'usad-adzu', acronym: 'USAD', x: 71, y: 92, width: 7, height: 14, rotation: 90 },
      { id: 'bc-apn', acronym: 'APN', x: 78, y: 92, width: 7, height: 14, rotation: 90 },
      { id: 'bc-sadaqah', orgId: 'sadaqah', acronym: 'SADAQAH', x: 71, y: 114, width: 7, height: 14, rotation: 90 },
      { id: 'bc-rotaract', acronym: 'ROTARACT', x: 78, y: 114, width: 7, height: 14, rotation: 90 },
    ],
  },
  {
    id: 'c-lobby-garden',
    label: 'C Lobby & Garden',
    viewBox: '0 0 100 150',
    landmarks: [
      { id: 'c-stage', type: 'stage', label: 'Stage', x: 28, y: 6, width: 44, height: 16 },
      { id: 'c-pond', type: 'pond', label: 'Pond', x: 80, y: 8, width: 14, height: 30 },
      { id: 'c-lobby', type: 'entrance', label: 'C - Lobby', x: 6, y: 118, width: 88, height: 28 },
    ],
    booths: [
      { id: 'c-psych', acronym: 'PSYCH iCARE', x: 10, y: 26, width: 7, height: 14, rotation: 90 },
      { id: 'c-alms', acronym: 'ALMS', x: 10, y: 33, width: 7, height: 14, rotation: 90 },
      { id: 'c-fast', orgId: 'foundation-of-ateneo-student-tutors', acronym: 'FAST', x: 10, y: 48, width: 7, height: 14, rotation: 90 },
      { id: 'c-issoa', orgId: 'information-security-students-organization', acronym: 'ISSOA', x: 10, y: 44, width: 7, height: 14, rotation: 90 },
      { id: 'c-isoa', orgId: 'international-studies-organization', acronym: 'ISOA', x: 30, y: 56, width: 9, height: 7 },
      { id: 'c-jiecep', orgId: 'jieep-adzu', acronym: 'JIECEP', x: 39, y: 56, width: 9, height: 7 },
      { id: 'c-spa', orgId: 'samahang-pilosopiya-ng-ateneo', acronym: 'SPA', x: 58, y: 56, width: 9, height: 7 },
      { id: 'c-sas', orgId: 'society-of-ateneo-scholars', acronym: 'SAS', x: 67, y: 56, width: 9, height: 7 },
      { id: 'c-aicg', orgId: 'aicg', acronym: 'AICG', x: 10, y: 78, width: 7, height: 14, rotation: 90 },
      { id: 'c-abs', orgId: 'ateneo-biological-society', acronym: 'ABS', x: 10, y: 85, width: 7, height: 14, rotation: 90 },
      { id: 'c-ices', orgId: 'adzu-ignatian-civil-engineering-students-organization', acronym: 'ADZU ICES', x: 10, y: 100, width: 7, height: 14, rotation: 90 },
      { id: 'c-icpep', acronym: 'ICPEP', x: 10, y: 93, width: 7, height: 14, rotation: 90 },
      { id: 'c-nfjpia', acronym: 'NFJPIA', x: 84, y: 78, width: 7, height: 14, rotation: 90 },
      { id: 'c-jma', orgId: 'jma-adzu', acronym: 'JMA', x: 84, y: 85, width: 7, height: 14, rotation: 90 },
      { id: 'c-adu', orgId: 'ateneo-debate-union', acronym: 'ADU', x: 40, y: 104, width: 9, height: 7 },
      { id: 'c-beacon', orgId: 'the-beacon-publications', acronym: 'BEACON', x: 49, y: 104, width: 9, height: 7 },
      { id: 'c-glee', acronym: 'GLEE CLUB', x: 10, y: 122, width: 9, height: 7, rotation: -20 },
      { id: 'c-abv', orgId: 'ateneo-blue-vigors', acronym: 'ABV', x: 16, y: 128, width: 9, height: 7, rotation: -20 },
      { id: 'c-aepep', orgId: 'ateneo-eagle-pep-squad', acronym: 'AE PEP', x: 40, y: 128, width: 9, height: 7 },
      { id: 'c-amc', orgId: 'ateneo-music-club', acronym: 'AMC', x: 49, y: 128, width: 9, height: 7 },
      { id: 'c-taz', orgId: 'teatro-ateneo-de-zamboanga', acronym: 'TAZ', x: 74, y: 128, width: 9, height: 7, rotation: 20 },
      { id: 'c-artco', orgId: 'ateneo-art-company', acronym: 'ARTCO', x: 80, y: 122, width: 9, height: 7, rotation: 20 },
    ],
  },
  {
    id: 'paseo-de-maria',
    label: 'Paseo de Maria',
    viewBox: '0 0 150 100',
    landmarks: [
      { id: 'p-path-h', type: 'pathway', label: 'Pathway', x: 22, y: 38, width: 118, height: 30 },
      { id: 'p-path-v', type: 'pathway', label: 'Path Way', x: 96, y: 8, width: 12, height: 30 },
      { id: 'p-path-d', type: 'pathway', label: 'Path Way', x: 70, y: 68, width: 40, height: 28, rotation: 35 },
      { id: 'p-church', type: 'church', label: 'Univ Church', x: 108, y: 78, width: 40, height: 20 },
    ],
    booths: [
      { id: 'p-acil', orgId: 'ateneo-catechetical-instruction-league', acronym: 'ACIL', x: 26, y: 24, width: 10, height: 9 },
      { id: 'p-alecs', orgId: 'ateneo-lectors-society', acronym: 'ALECS', x: 36, y: 24, width: 10, height: 9 },
      { id: 'p-als', orgId: 'ateneo-liturgical-society', acronym: 'ALS', x: 46, y: 24, width: 10, height: 9 },
      { id: 'p-clc', orgId: 'christian-life-community-adzu', acronym: 'CLC', x: 62, y: 24, width: 10, height: 9 },
      { id: 'p-cfc', orgId: 'cfc-youth-for-christ-adzu', acronym: 'CFC', x: 72, y: 24, width: 10, height: 9 },
      { id: 'p-ski', orgId: 'society-of-the-knights-of-ignatius', acronym: 'SKI', x: 82, y: 24, width: 10, height: 9 },
      { id: 'p-msa', orgId: 'muslim-students-association-adzu', acronym: 'MSA', x: 40, y: 72, width: 10, height: 9 },
      { id: 'p-salt', acronym: 'SALT', x: 50, y: 72, width: 10, height: 9 },
      { id: 'p-psalm', orgId: 'psalm-adzu', acronym: 'PSALM', x: 60, y: 72, width: 10, height: 9 },
    ],
  },
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/data/recweekBooths.test.ts`
Expected: PASS (all 6 tests). If "links every orgId" fails, an `orgId` is misspelled — fix against `src/data/organizations.ts`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/data/recweekBooths.ts src/data/recweekBooths.test.ts
git commit -m "feat(recweek): add booth/venue data model and react-zoom-pan-pinch"
```

---

### Task 2: Page shell, venue tabs, and routing

**Files:**
- Modify: `src/pages/RecWeek.tsx`
- Modify: `src/App.tsx` (add route if missing)
- Create: `src/components/recweek/VenueTabs.tsx`

**Interfaces:**
- Consumes: `venues`, `type VenueId` from `../../data/recweekBooths`; `PageHeader` from `../shared/PageHeader`; `Seo` from `../Seo`.
- Produces:
  - `VenueTabs` props: `{ venues: Venue[]; activeVenueId: VenueId; onSelect: (id: VenueId) => void }`
  - `RecWeek.tsx` owns `useState` for `activeVenueId` (`VenueId`), `selectedBoothId` (`string | null`), `hoveredBoothId` (`string | null`) — wired fully in Tasks 3–4; this task renders tabs + a placeholder map/sidebar grid.

- [ ] **Step 1: Verify (or add) the RecWeek route**

Run: `grep -n "RecWeek\|recweek" src/App.tsx`
If no `<Route ... element={<RecWeek />} />` line exists, add the import `import RecWeek from './pages/RecWeek'` and a route `<Route path="/recweek" element={<RecWeek />} />` alongside the existing routes (mirror the `/organizations` line's placement). If it already exists, make no change.

- [ ] **Step 2: Create VenueTabs**

Create `src/components/recweek/VenueTabs.tsx`:
```tsx
import type { Venue, VenueId } from '../../data/recweekBooths'
import { cn } from '../../lib/utils'

interface VenueTabsProps {
  venues: Venue[]
  activeVenueId: VenueId
  onSelect: (id: VenueId) => void
}

export function VenueTabs({ venues, activeVenueId, onSelect }: VenueTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="RecWeek venues"
      className="mx-auto flex max-w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-trust-blue/10 bg-linen-white p-1.5 shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
    >
      {venues.map((v) => {
        const active = v.id === activeVenueId
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(v.id)}
            className={cn(
              'rounded-full px-5 py-2 font-body text-sm font-medium transition-all duration-300',
              active
                ? 'bg-trust-blue text-linen-white shadow-[0_2px_10px_rgba(46,74,143,0.18)]'
                : 'text-fabric-dark hover:text-trust-blue',
            )}
          >
            {v.label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Rewrite the RecWeek page shell**

Replace `src/pages/RecWeek.tsx` with:
```tsx
import { useState } from 'react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { VenueTabs } from '../components/recweek/VenueTabs'
import { venues, type VenueId } from '../data/recweekBooths'

export default function RecWeek() {
  const [activeVenueId, setActiveVenueId] = useState<VenueId>('bc-lobby-quad')
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null)
  const [hoveredBoothId, setHoveredBoothId] = useState<string | null>(null)

  const venue = venues.find((v) => v.id === activeVenueId) ?? venues[0]

  const changeVenue = (id: VenueId) => {
    setActiveVenueId(id)
    setSelectedBoothId(null)
    setHoveredBoothId(null)
  }

  return (
    <>
      <Seo title="RecWeek | COA-Z" description="Explore booth locations across the three RecWeek venues at Ateneo de Zamboanga University." />
      <PageHeader
        eyebrow="Org Fair 2026"
        title="RecWeek Booth Locations"
        description="Explore booth locations across the three RecWeek venues."
        accent="blue"
      />
      <section className="bg-canvas-cream pb-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <VenueTabs venues={venues} activeVenueId={activeVenueId} onSelect={changeVenue} />

          {/* Sidebar | Map — wired in Tasks 3-4 */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[35%_65%]">
            <div className="rounded-[8px] border border-trust-blue/10 bg-linen-white p-4 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
              <p className="font-body text-sm text-stitch-gray">{venue.booths.length} booths</p>
            </div>
            <div className="min-h-[420px] rounded-[8px] border border-trust-blue/10 bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]" />
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Build to verify types compile**

Run: `npm run build`
Expected: PASS (no TS errors). This runs `tsc -b && vite build`.

- [ ] **Step 5: Verify in browser**

Run `npm run dev`, open `/recweek`. Confirm: page header renders, three venue tabs show, clicking a tab swaps the "N booths" count, empty map panel sits to the right on desktop and stacks on narrow widths.

- [ ] **Step 6: Commit**

```bash
git add src/pages/RecWeek.tsx src/App.tsx src/components/recweek/VenueTabs.tsx
git commit -m "feat(recweek): page shell, venue tabs, and route"
```

---

### Task 3: SVG map with landmarks, static booths, zoom/pan, controls, legend

**Files:**
- Create: `src/components/recweek/BoothMap.tsx`
- Create: `src/components/recweek/LandmarkShape.tsx`
- Create: `src/components/recweek/BoothShape.tsx`
- Create: `src/components/recweek/MapControls.tsx`
- Create: `src/components/recweek/MapLegend.tsx`
- Modify: `src/pages/RecWeek.tsx` (mount `BoothMap`)

**Interfaces:**
- Consumes: `type Venue`, `type BoothShape`, `type Landmark` from `../../data/recweekBooths`; `TransformWrapper`, `TransformComponent`, `useControls` (or `ReactZoomPanPinchRef`) from `react-zoom-pan-pinch`; icons `Plus`, `Minus`, `RotateCcw` from `lucide-react`.
- Produces:
  - `BoothMap` props: `{ venue: Venue; selectedBoothId: string | null; hoveredBoothId: string | null; onBoothSelect: (id: string) => void; onBoothHover: (id: string | null) => void }`
  - `LandmarkShape` props: `{ landmark: Landmark }`
  - `BoothShape` (component; alias the type import to avoid a name clash) props: `{ booth: BoothShapeData; isSelected: boolean; isHovered: boolean; onSelect: (id: string) => void; onHover: (id: string | null) => void }`
  - `MapControls` props: `{ onZoomIn: () => void; onZoomOut: () => void; onReset: () => void }`
  - `MapLegend` — no props.

- [ ] **Step 1: Create LandmarkShape**

Create `src/components/recweek/LandmarkShape.tsx`. Non-interactive backdrop shapes; color by type via thread tokens; rounded rects; label centered.
```tsx
import type { Landmark, LandmarkType } from '../../data/recweekBooths'

const FILL: Record<LandmarkType, string> = {
  stage: 'var(--color-thread-green)',
  tent: 'var(--color-thread-green)',
  pond: 'var(--color-thread-green)',
  pathway: 'var(--color-canvas-cream)',
  church: 'var(--color-thread-yellow)',
  statue: 'var(--color-stitch-gray)',
  podium: 'var(--color-stitch-gray)',
  entrance: 'var(--color-thread-yellow)',
}

export function LandmarkShape({ landmark }: { landmark: Landmark }) {
  const { x, y, width, height, rotation = 0, label, type } = landmark
  const cx = x + width / 2
  const cy = y + height / 2
  return (
    <g transform={`rotate(${rotation} ${cx} ${cy})`} opacity={type === 'entrance' ? 0.35 : 0.7}>
      <rect x={x} y={y} width={width} height={height} rx={2} fill={FILL[type]} stroke="var(--color-trust-blue)" strokeOpacity={0.15} strokeWidth={0.3} />
      {label && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={type === 'entrance' ? 3.5 : 4.5} fontWeight={700} fill="var(--color-fabric-dark)" style={{ fontFamily: 'var(--font-display)' }}>
          {label}
        </text>
      )}
    </g>
  )
}
```

- [ ] **Step 2: Create BoothShape (static states first)**

Create `src/components/recweek/BoothShape.tsx`. Import the data type under an alias so the component name is free. Selected-booth animation is added in Task 4; here implement normal + hover.
```tsx
import { motion } from 'framer-motion'
import type { BoothShape as BoothShapeData } from '../../data/recweekBooths'

interface BoothShapeProps {
  booth: BoothShapeData
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function BoothShape({ booth, isSelected, isHovered, onSelect, onHover }: BoothShapeProps) {
  const { id, acronym, x, y, width, height, rotation = 0 } = booth
  const cx = x + width / 2
  const cy = y + height / 2
  const active = isSelected || isHovered

  return (
    <motion.g
      role="button"
      aria-label={acronym}
      tabIndex={0}
      style={{ cursor: 'pointer', transformBox: 'fill-box', transformOrigin: 'center' }}
      transform={`rotate(${rotation} ${cx} ${cy})`}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      animate={{ scale: active ? 1.03 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <rect
        x={x} y={y} width={width} height={height} rx={1.6}
        fill="var(--color-canvas-cream)"
        stroke="var(--color-trust-blue)"
        strokeOpacity={active ? 0.9 : 0.5}
        strokeWidth={active ? 0.7 : 0.4}
        style={{ filter: active ? 'drop-shadow(0 1px 2px rgba(46,74,143,0.25))' : 'drop-shadow(0 0.5px 1px rgba(46,74,143,0.12))' }}
      />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={2.6} fontWeight={700} fill="var(--color-trust-blue)" style={{ fontFamily: 'var(--font-display)', pointerEvents: 'none' }}>
        {acronym}
      </text>
    </motion.g>
  )
}
```

- [ ] **Step 3: Create MapControls**

Create `src/components/recweek/MapControls.tsx`:
```tsx
import { Plus, Minus, RotateCcw } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  const btn = 'flex h-9 w-9 items-center justify-center rounded-full border border-trust-blue/10 bg-linen-white text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)] transition-all hover:-translate-y-0.5 hover:text-thread-green'
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
      <button aria-label="Zoom in" className={btn} onClick={onZoomIn}><Plus size={18} /></button>
      <button aria-label="Zoom out" className={btn} onClick={onZoomOut}><Minus size={18} /></button>
      <button aria-label="Reset zoom" className={btn} onClick={onReset}><RotateCcw size={16} /></button>
    </div>
  )
}
```

- [ ] **Step 4: Create MapLegend**

Create `src/components/recweek/MapLegend.tsx`:
```tsx
const ITEMS: { label: string; color: string }[] = [
  { label: 'Booth', color: 'var(--color-canvas-cream)' },
  { label: 'Stage / Tent', color: 'var(--color-thread-green)' },
  { label: 'Pathway', color: 'var(--color-canvas-cream)' },
  { label: 'Landmark', color: 'var(--color-thread-yellow)' },
  { label: 'Statue', color: 'var(--color-stitch-gray)' },
]

export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-[8px] border border-trust-blue/10 bg-linen-white/90 p-3 shadow-[0_4px_20px_rgba(46,74,143,0.06)] backdrop-blur-sm">
      <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.1em] text-trust-blue">Legend</p>
      <ul className="space-y-1">
        {ITEMS.map((it) => (
          <li key={it.label} className="flex items-center gap-2 font-body text-xs text-fabric-dark">
            <span className="inline-block h-3 w-3 rounded-[3px] border border-trust-blue/30" style={{ backgroundColor: it.color }} />
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 5: Create BoothMap (zoom/pan wrapper + SVG)**

Create `src/components/recweek/BoothMap.tsx`. Uses a ref for the zoom controls; `zoomToElement` is used in Task 4.
```tsx
import { useRef } from 'react'
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import type { Venue } from '../../data/recweekBooths'
import { LandmarkShape } from './LandmarkShape'
import { BoothShape } from './BoothShape'
import { MapControls } from './MapControls'
import { MapLegend } from './MapLegend'

interface BoothMapProps {
  venue: Venue
  selectedBoothId: string | null
  hoveredBoothId: string | null
  onBoothSelect: (id: string) => void
  onBoothHover: (id: string | null) => void
}

export function BoothMap({ venue, selectedBoothId, hoveredBoothId, onBoothSelect, onBoothHover }: BoothMapProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  return (
    <div className="relative overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
      <TransformWrapper ref={transformRef} minScale={1} maxScale={3} doubleClick={{ mode: 'zoomIn' }} wheel={{ step: 0.15 }} centerOnInit>
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full">
          <svg viewBox={venue.viewBox} className="h-auto w-full" role="img" aria-label={`${venue.label} booth map`}>
            {venue.landmarks.map((l) => <LandmarkShape key={l.id} landmark={l} />)}
            {venue.booths.map((b) => (
              <BoothShape
                key={b.id}
                booth={b}
                isSelected={selectedBoothId === b.id}
                isHovered={hoveredBoothId === b.id}
                onSelect={onBoothSelect}
                onHover={onBoothHover}
              />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>
      <MapControls
        onZoomIn={() => transformRef.current?.zoomIn()}
        onZoomOut={() => transformRef.current?.zoomOut()}
        onReset={() => transformRef.current?.resetTransform()}
      />
      <MapLegend />
    </div>
  )
}
```

- [ ] **Step 6: Mount BoothMap in the page**

In `src/pages/RecWeek.tsx`, replace the placeholder map `<div className="min-h-[420px] ...

 />` with:
```tsx
<BoothMap
  venue={venue}
  selectedBoothId={selectedBoothId}
  hoveredBoothId={hoveredBoothId}
  onBoothSelect={setSelectedBoothId}
  onBoothHover={setHoveredBoothId}
/>
```
And add the import: `import { BoothMap } from '../components/recweek/BoothMap'`.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 8: Calibrate coordinates in the browser**

Run `npm run dev`, open `/recweek`. For EACH of the three venues, open `public/MAPS/<venue>.png` side-by-side and adjust the `x/y/width/height/rotation` values in `src/data/recweekBooths.ts` until booth and landmark positions visually match the PNG (relative layout, not pixel-perfection). Verify: mouse-wheel zoom, drag-to-pan, double-click zoom, pinch on a touch device/emulator; `+`/`-`/reset controls work; legend shows bottom-left; booths scale on hover; zoom clamps at 100%–300%. Re-run `npx vitest run src/data/recweekBooths.test.ts` after edits (must still pass).

- [ ] **Step 9: Commit**

```bash
git add src/components/recweek/ src/pages/RecWeek.tsx src/data/recweekBooths.ts
git commit -m "feat(recweek): interactive SVG map with zoom, pan, controls, legend"
```

---

### Task 4: Sidebar, hover/select wiring, zoom-to-booth, selection animation, preview card

**Files:**
- Create: `src/components/recweek/OrganizationSidebar.tsx`
- Create: `src/components/recweek/RecweekOrgCard.tsx`
- Create: `src/components/recweek/BoothPreviewCard.tsx`
- Modify: `src/components/recweek/BoothShape.tsx` (selected animation sequence)
- Modify: `src/components/recweek/BoothMap.tsx` (zoomToElement on select; render preview card)
- Modify: `src/pages/RecWeek.tsx` (mount sidebar)

**Interfaces:**
- Consumes: `boothFullName`, `boothHref`, `boothOrg` from `../../data/recweekBooths`; `MapPin`, `ExternalLink`, `X` from `lucide-react`; `AnimatePresence`, `motion` from `framer-motion`.
- Produces:
  - `OrganizationSidebar` props: `{ venue: Venue; selectedBoothId: string | null; hoveredBoothId: string | null; onBoothSelect: (id: string) => void; onBoothHover: (id: string | null) => void }`
  - `RecweekOrgCard` props: `{ booth: BoothShapeData; isSelected: boolean; isHovered: boolean; onSelect: (id: string) => void; onHover: (id: string | null) => void }`
  - `BoothPreviewCard` props: `{ booth: BoothShapeData | null; venueLabel: string; onClose: () => void }`

- [ ] **Step 1: Create RecweekOrgCard**

Create `src/components/recweek/RecweekOrgCard.tsx`. Color dot = trust-blue for matched orgs, stitch-gray for generic exhibitors.
```tsx
import { boothFullName } from '../../data/recweekBooths'
import type { BoothShape as BoothShapeData } from '../../data/recweekBooths'
import { cn } from '../../lib/utils'

interface RecweekOrgCardProps {
  booth: BoothShapeData
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function RecweekOrgCard({ booth, isSelected, isHovered, onSelect, onHover }: RecweekOrgCardProps) {
  const fullName = boothFullName(booth)
  return (
    <button
      onClick={() => onSelect(booth.id)}
      onMouseEnter={() => onHover(booth.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'flex w-full items-start gap-3 rounded-[8px] border bg-linen-white p-3 text-left transition-all duration-300',
        'shadow-[0_4px_20px_rgba(46,74,143,0.06)] hover:-translate-y-0.5',
        isSelected ? 'border-trust-blue ring-1 ring-trust-blue/40' : 'border-trust-blue/10',
        isHovered && !isSelected && 'border-trust-blue/40',
      )}
    >
      <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', fullName ? 'bg-trust-blue' : 'bg-stitch-gray')} />
      <span className="min-w-0">
        <span className="block font-display text-sm font-bold text-trust-blue">{booth.acronym}</span>
        <span className="block truncate font-body text-xs text-fabric-dark">
          {fullName ?? 'Exhibitor booth'}
        </span>
        {booth.boothNumber && <span className="mt-0.5 block font-body text-[11px] text-stitch-gray">Booth {booth.boothNumber}</span>}
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Create OrganizationSidebar (accordion below `md`)**

Create `src/components/recweek/OrganizationSidebar.tsx`. Uses a native `<details>` for the mobile accordion so no new dependency is needed; open by default on desktop via `md:open` is not valid, so render two layouts and toggle with Tailwind `hidden`/`md:block`.
```tsx
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Venue } from '../../data/recweekBooths'
import { RecweekOrgCard } from './RecweekOrgCard'
import { cn } from '../../lib/utils'

interface OrganizationSidebarProps {
  venue: Venue
  selectedBoothId: string | null
  hoveredBoothId: string | null
  onBoothSelect: (id: string) => void
  onBoothHover: (id: string | null) => void
}

export function OrganizationSidebar({ venue, selectedBoothId, hoveredBoothId, onBoothSelect, onBoothHover }: OrganizationSidebarProps) {
  const [open, setOpen] = useState(false)
  const sorted = [...venue.booths].sort((a, b) => a.acronym.localeCompare(b.acronym))

  const list = (
    <div className="flex flex-col gap-2">
      {sorted.map((b) => (
        <RecweekOrgCard
          key={b.id}
          booth={b}
          isSelected={selectedBoothId === b.id}
          isHovered={hoveredBoothId === b.id}
          onSelect={onBoothSelect}
          onHover={onBoothHover}
        />
      ))}
    </div>
  )

  return (
    <div>
      {/* Mobile accordion */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="mb-2 flex w-full items-center justify-between rounded-[8px] border border-trust-blue/10 bg-linen-white p-3 font-display text-sm font-bold text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
        >
          Organizations ({venue.booths.length})
          <ChevronDown size={18} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
        {open && list}
      </div>
      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-trust-blue">Organizations</p>
        <div className="max-h-[560px] overflow-y-auto pr-1">{list}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add the selection animation to BoothShape**

In `src/components/recweek/BoothShape.tsx`, replace the `animate`/`transition` props on `motion.g` with a keyframe sequence that runs once on select (scale→settle) while keeping the lighter hover behavior:
```tsx
      animate={
        isSelected
          ? { scale: [1, 1.12, 1.05] }
          : { scale: isHovered ? 1.03 : 1 }
      }
      transition={isSelected ? { duration: 0.5, times: [0, 0.5, 1] } : { duration: 0.2 }}
```
And on the `<rect>`, when `isSelected`, strengthen the glow filter:
```tsx
        style={{ filter: isSelected
          ? 'drop-shadow(0 0 3px rgba(46,74,143,0.55))'
          : active ? 'drop-shadow(0 1px 2px rgba(46,74,143,0.25))' : 'drop-shadow(0 0.5px 1px rgba(46,74,143,0.12))' }}
```
(Keep `const active = isSelected || isHovered`.)

- [ ] **Step 4: Create BoothPreviewCard**

Create `src/components/recweek/BoothPreviewCard.tsx`:
```tsx
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, ExternalLink, X } from 'lucide-react'
import { boothFullName, boothHref } from '../../data/recweekBooths'
import type { BoothShape as BoothShapeData } from '../../data/recweekBooths'

interface BoothPreviewCardProps {
  booth: BoothShapeData | null
  venueLabel: string
  onClose: () => void
}

export function BoothPreviewCard({ booth, venueLabel, onClose }: BoothPreviewCardProps) {
  return (
    <AnimatePresence>
      {booth && (
        <motion.div
          key={booth.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="absolute left-1/2 top-4 z-20 w-[min(90%,320px)] -translate-x-1/2 rounded-[8px] border border-trust-blue/10 bg-linen-white/95 p-4 shadow-[0_10px_28px_rgba(46,74,143,0.18)] backdrop-blur-sm"
        >
          <button aria-label="Close" onClick={onClose} className="absolute right-2 top-2 text-stitch-gray hover:text-trust-blue"><X size={16} /></button>
          <p className="font-display text-lg font-bold text-trust-blue">{booth.acronym}</p>
          <p className="mt-0.5 font-body text-sm text-fabric-dark">{boothFullName(booth) ?? 'Exhibitor booth'}</p>
          <p className="mt-2 flex items-center gap-1.5 font-body text-xs text-stitch-gray"><MapPin size={13} /> {venueLabel}{booth.boothNumber ? ` · Booth ${booth.boothNumber}` : ''}</p>
          {boothHref(booth) && (
            <a href={boothHref(booth)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-trust-blue px-4 py-1.5 font-body text-xs font-medium text-linen-white transition-all hover:-translate-y-0.5 hover:bg-thread-green">
              View Organization <ExternalLink size={13} />
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 5: Wire zoom-to-booth + preview card into BoothMap**

In `src/components/recweek/BoothMap.tsx`:
1. Add imports: `import { useEffect } from 'react'` and `import { BoothPreviewCard } from './BoothPreviewCard'`.
2. After selection changes, pan/zoom to the booth. Add inside the component, before `return`:
```tsx
  useEffect(() => {
    if (selectedBoothId) {
      transformRef.current?.zoomToElement(`booth-${selectedBoothId}`, 1.8, 400)
    }
  }, [selectedBoothId])

  const selectedBooth = venue.booths.find((b) => b.id === selectedBoothId) ?? null
```
3. Give each booth group a DOM id target. In `BoothShape.tsx`, add `id={`booth-${id}`}` to the `motion.g`. (zoomToElement looks up by element id.)
4. Render the preview card inside the outer relative `<div>`, after `<MapLegend />`:
```tsx
      <BoothPreviewCard booth={selectedBooth} venueLabel={venue.label} onClose={() => onBoothSelect('')} />
```
Note: `onBoothSelect('')` clears selection because no booth has an empty id; in `RecWeek.tsx` the setter accepts the empty string and `find` returns undefined. To keep types clean, change `onBoothSelect` handling in the page so an empty string maps to `null` (see Step 6).

- [ ] **Step 6: Mount sidebar and normalize clear-selection in the page**

In `src/pages/RecWeek.tsx`:
1. Import: `import { OrganizationSidebar } from '../components/recweek/OrganizationSidebar'`.
2. Replace the placeholder sidebar `<div>...N booths...</div>` with:
```tsx
<OrganizationSidebar
  venue={venue}
  selectedBoothId={selectedBoothId}
  hoveredBoothId={hoveredBoothId}
  onBoothSelect={setSelectedBoothId}
  onBoothHover={setHoveredBoothId}
/>
```
3. Wrap the select setter so `''` clears to `null`. Define above the return:
```tsx
const selectBooth = (id: string) => setSelectedBoothId(id === '' ? null : id)
```
Pass `onBoothSelect={selectBooth}` to both `BoothMap` and `OrganizationSidebar`.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 8: Verify interaction in the browser**

Run `npm run dev`, `/recweek`. For a matched org (e.g. ISOA) and a generic booth (e.g. APC) confirm: hovering a sidebar card highlights the booth (no pan/zoom); clicking a card pans+zooms to the booth (~1.8×), booth runs the scale/glow settle once, preview card fades in above the map; matched booth shows full name + working "View Organization" (opens Facebook in new tab); generic booth shows "Exhibitor booth" and NO link; close (X) dismisses the card; clicking a booth directly in the SVG does the same; switching venues clears selection and resets zoom.

- [ ] **Step 9: Commit**

```bash
git add src/components/recweek/ src/pages/RecWeek.tsx
git commit -m "feat(recweek): sidebar, hover/select wiring, zoom-to-booth, preview card"
```

---

### Task 5: Embroidery decoration, radial glow, venue-switch animation, final polish

**Files:**
- Modify: `src/components/recweek/BoothMap.tsx` (radial glow layer, decorative accents)
- Modify: `src/pages/RecWeek.tsx` (venue-switch fade via AnimatePresence)

**Interfaces:**
- Consumes: `AnimatePresence`, `motion` from `framer-motion`; existing `EmbroideredAccent` from `../EmbroideredAccent`; `SectionGlow` from `../ui/SectionGlow` (reuse; verify props by reading the file).

- [ ] **Step 1: Add radial glow + corner embroidery to the map**

Read `src/components/ui/SectionGlow.tsx` and `src/components/EmbroideredAccent.tsx` to confirm prop names. In `BoothMap.tsx`, inside the outer relative `<div>` (before `TransformWrapper`), add a non-interactive glow layer at ~8% opacity and two corner accents positioned OUTSIDE the SVG interactive area (top-left and bottom-right corners, `pointer-events-none`, `aria-hidden`):
```tsx
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-[0.08]" style={{ background: 'radial-gradient(60% 50% at 50% 40%, var(--color-trust-blue), transparent 70%)' }} />
      <div aria-hidden className="pointer-events-none absolute -left-3 -top-3 z-0 opacity-70"><EmbroideredAccent color="blue" index={0} size={40} /></div>
      <div aria-hidden className="pointer-events-none absolute -bottom-3 -right-3 z-0 opacity-70"><EmbroideredAccent color="green" index={0} size={40} /></div>
```
Ensure the `TransformWrapper`'s wrapper sits at `z-[1]` or higher so booths remain clickable above the glow (add `className="relative z-[1]"` to `TransformComponent`'s `wrapperClass` if needed). Confirm accents never overlap booth rects (they sit in the outer padding/corners).

- [ ] **Step 2: Add venue-switch fade animation**

In `src/pages/RecWeek.tsx`, wrap the map column's `<BoothMap ... />` in `AnimatePresence` keyed by `activeVenueId` so switching fades out/in:
```tsx
import { AnimatePresence, motion } from 'framer-motion'
// ...
<AnimatePresence mode="wait">
  <motion.div
    key={activeVenueId}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <BoothMap venue={venue} selectedBoothId={selectedBoothId} hoveredBoothId={hoveredBoothId} onBoothSelect={selectBooth} onBoothHover={setHoveredBoothId} />
  </motion.div>
</AnimatePresence>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Full cross-venue verification**

Run `npm run dev`, `/recweek`. Confirm across ALL THREE venues: radial glow is subtle (not washing out booths), corner embroidery shows and never overlaps a booth, venue switch fades smoothly and resets zoom + clears selection + preview, responsive layout at desktop (35/65) / tablet (stacked, cards above map) / mobile (tabs → map → accordion). Re-run `npx vitest run` (full suite) — all green.

- [ ] **Step 5: Commit**

```bash
git add src/components/recweek/BoothMap.tsx src/pages/RecWeek.tsx
git commit -m "feat(recweek): embroidery decoration, radial glow, venue-switch animation"
```

---

## Self-Review

**Spec coverage** (against `2026-07-30-recweek-booth-map-design.md`):
- §3 data layer → Task 1 ✓
- §4 components (VenueTabs, BoothMap, BoothShape, LandmarkShape, MapControls, MapLegend, OrganizationSidebar, RecweekOrgCard, BoothPreviewCard) → Tasks 2–4 ✓
- §5 interactions (venue fade, card hover, click zoom-to-element, generic-booth fallback, zoom limits) → Tasks 3–5 ✓
- §6 visual system (booth style, landmarks, radial glow, embroidery corners, legend/controls cards, sidebar dot) → Tasks 3–5 ✓
- §7 motion (all listed, no loops) → Tasks 3–5 ✓
- §8 responsive (desktop 35/65, tablet stack, mobile accordion) → Tasks 2, 4, 5 ✓
- §9 testing (data vitest test; manual browser verification) → Task 1 test + per-task verify steps ✓
- §10 out of scope (no search/filter, static data) → honored ✓
- Global constraint deviations from original brief (lucide over react-icons; Facebook link over Contentful profile route) → documented in spec §2 and plan Global Constraints ✓

**Placeholder scan:** no TBD/TODO; all code steps contain full code; coordinates are real starter values refined via the calibration step (Task 3 Step 8), not placeholders.

**Type consistency:** `BoothShape` (data type) is aliased to `BoothShapeData` wherever the component `BoothShape` is also in scope; `VenueId`, `Venue`, `Landmark`, `LandmarkType` used consistently; `selectBooth`/`onBoothSelect` signature `(id: string) => void` with `''` → `null` normalization is consistent between page, map, and sidebar; `zoomToElement` target id `booth-${id}` matches the `id` set on `motion.g`.
