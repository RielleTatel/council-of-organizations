# Organization Discovery Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/organizations` directory as a handcrafted "community bulletin board" — a masonry of pinned paper artifacts (polaroids, notebook pages, manila cards) each tilted, pinned or taped, and filterable via a pinned search note and notebook-tab cluster filters — using only existing assets and the COA-Z Interwoven Beyond design language.

**Architecture:** Keep the existing `Organizations.tsx` PageHeader and 6 cluster-overview cards untouched. Replace only the directory section (search + filter pills + card grid) with a new `<DiscoveryBoard>` that owns the search/cluster state, reuses the existing `filterOrganizations` and data layer (`useOrganizations` → static `realOrganizations`), and renders cards through `react-masonry-css`. Each org's visual variation (tilt, paper style, fastener) is **deterministic per org id** via a pure `boardStyleFor()` helper so it never reshuffles across renders/filters; **color (pin, sticker, top edge) derives from the org's cluster**, not randomness.

**Tech Stack:** React 19 + TypeScript, react-router-dom v7, Tailwind v4 (`@theme` tokens in `src/index.css`), framer-motion (installed), lucide-react (installed), `react-masonry-css` (to install), vitest.

## Global Constraints

- **Design system:** Follow `docs/COA-Z_Interwoven_Beyond_Design_System.md`. Use only theme tokens from `src/index.css`: `--color-trust-blue #2e4a8f`, `--color-canvas-cream #f5f0e8`, `--color-linen-white #faf8f5`, `--color-fabric-dark #3d3d3d`, `--color-stitch-gray #8a8a8a`, `--color-shadow-thread rgba(46,74,143,.08)`, and the six thread colors (`--color-thread-red/blue/green/yellow/pink/purple`). Hex values for accents come from `threadHex` in `src/lib/assets.ts`.
- **Fonts (actual, not the doc's aspirational Playfair/Inter):** `--font-display` / `--font-body` = "Made Tommy"; `--font-accent` = "Omegle" (use for handwritten captions / the pinned note).
- **Color restraint (design system §2 rules):** never scatter rainbow color. A card's accent color (push-pin, sticker, thin top edge) is the **cluster's** `ThreadColor` — nothing random about color. Paper bodies stay neutral (linen / manila / white). Rotation, paper *style*, and pin-vs-tape are the only randomized-but-stable axes.
- **Determinism:** every per-card visual choice is a pure function of `org.id` (+ `hasLogo`). Same org ⇒ identical card every render and across filters. No `Math.random()` in render.
- **Reuse, don't fork:** keep `useOrganizations`, `filterOrganizations`, `clusters`/`clusterBySlug`, `threadHex`, `EmbroideredAccent`, `FloatingAccent`, `DriftingThread`, and the `/organizations/:slug` route unchanged. The shared `OrganizationCard` stays (still used on the profile page's related-orgs); the board uses a new `PinnedCard` instead.
- **Masonry reality:** `react-masonry-css` re-distributes children into columns on every render, so reliable per-card `AnimatePresence` *exit* animations are NOT feasible. Filter transitions use a **cluster-keyed whole-board cross-fade** (`AnimatePresence mode="wait"`) plus live search reconcile; individual cards animate on **enter/mount** only.
- **Accessibility:** each card is a real `<Link>` to the org profile with a visible focus ring (global stitch-dash `:focus-visible` — ensure `outline-offset` clears the rotated card). Pins, tape, and decorative flowers/yarn are `aria-hidden`/`role="presentation"`. Search keeps its `<label>`/`aria-label`; notebook tabs are `<button aria-pressed>`. Honor `prefers-reduced-motion` everywhere (via framer `useReducedMotion`): no drop-in, no hover transform, no pin bounce — cards render at their final tilt statically.
- **Copy (write from the user's side):** search placeholder `Find an organization`; card CTA `Learn more` (it opens the org's page, not a literal booth — keep it truthful); empty state `No organizations match — try another name or cluster.`
- **Commit cadence:** commit at the end of each task with the message shown in its final step.

## Design language (from the frontend-design brainstorm — build to this, don't drift generic)

- **Signature element:** the pinned paper artifact card — a polaroid / notebook page with a real push-pin (or masking tape) and a stable tiny tilt that *straightens and lifts* on hover. This is the one bold thing; everything around it (board substrate, yarn) stays quiet.
- **Substrate:** the board is `canvas-cream` with a faint warm corkboard wash (a very low-opacity radial tint) plus the existing paper texture. Near-invisible — the cards carry the tactility.
- **Type move:** org names on **polaroid** cards use the accent handwriting face (`font-accent`, Omegle) as a caption; sticker labels use tight uppercase `font-display`. On non-polaroid papers the name is `font-display` bold ink (`trust-blue`).
- **Decoration:** one or two `DriftingThread` yarns weave *behind* the masonry (z-below cards, `pointer-events-none`) and 2–3 `FloatingAccent` flowers overlap board corners — sparse, never over text.

---

### Task 1: Install masonry + deterministic board-style helper

**Files:**
- Modify: `package.json` (add `react-masonry-css`)
- Create: `src/lib/boardStyle.ts`
- Test: `src/lib/boardStyle.test.ts`

**Interfaces:**
- Consumes: `threadHex`, `type ThreadColor` from `./assets`; `clusterBySlug` from `../config/clusters`.
- Produces:
  - `type PaperStyle = 'polaroid' | 'notebook' | 'manila' | 'grid' | 'plain'`
  - `type Fastener = 'pin' | 'tape'`
  - `interface BoardStyle { rotation: number; paper: PaperStyle; fastener: Fastener; fastenerOffset: number; color: ThreadColor; hex: string }`
  - `function boardStyleFor(orgId: string, clusterSlug: string, hasLogo: boolean): BoardStyle`

- [ ] **Step 1: Install react-masonry-css**

Run:
```bash
npm install react-masonry-css
```
Expected: adds `react-masonry-css` to `dependencies`, no peer-dependency errors (it's React-version-agnostic, ~2KB).

- [ ] **Step 2: Write the failing test**

Create `src/lib/boardStyle.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { boardStyleFor } from './boardStyle'
import { threadHex } from './assets'

describe('boardStyleFor', () => {
  it('is deterministic for the same inputs', () => {
    const a = boardStyleFor('ateneo-debate-union', 'publications-communications', true)
    const b = boardStyleFor('ateneo-debate-union', 'publications-communications', true)
    expect(a).toEqual(b)
  })

  it('keeps rotation within ±3 degrees and non-zero', () => {
    for (const id of ['a', 'bb', 'ccc', 'org-x', 'the-beacon-publications']) {
      const { rotation } = boardStyleFor(id, 'academics', true)
      expect(Math.abs(rotation)).toBeGreaterThanOrEqual(1)
      expect(Math.abs(rotation)).toBeLessThanOrEqual(3)
    }
  })

  it('never returns the polaroid paper when the org has no logo', () => {
    for (const id of ['a', 'bb', 'ccc', 'no-logo-org', 'zzz-1', 'zzz-2']) {
      expect(boardStyleFor(id, 'academics', false).paper).not.toBe('polaroid')
    }
  })

  it('derives color+hex from the cluster, not the id', () => {
    const s = boardStyleFor('anything', 'faith-formation', true)
    expect(s.color).toBe('purple')
    expect(s.hex).toBe(threadHex.purple)
  })

  it('falls back to blue for an unknown cluster slug', () => {
    const s = boardStyleFor('x', 'nonexistent-cluster', true)
    expect(s.color).toBe('blue')
  })

  it('only ever returns pin or tape', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      expect(['pin', 'tape']).toContain(boardStyleFor(id, 'academics', true).fastener)
    }
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/lib/boardStyle.test.ts`
Expected: FAIL — `Cannot find module './boardStyle'`.

- [ ] **Step 4: Create the helper**

Create `src/lib/boardStyle.ts`:
```ts
import { threadHex, type ThreadColor } from './assets'
import { clusterBySlug } from '../config/clusters'

export type PaperStyle = 'polaroid' | 'notebook' | 'manila' | 'grid' | 'plain'
export type Fastener = 'pin' | 'tape'

export interface BoardStyle {
  /** Stable tilt in degrees, within ±3, never 0. */
  rotation: number
  paper: PaperStyle
  fastener: Fastener
  /** Horizontal jitter (px) for the pin/tape, -18..18. */
  fastenerOffset: number
  /** Accent color — always the org's cluster color, never random. */
  color: ThreadColor
  hex: string
}

const ROTATIONS = [-3, -2, -1, 1, 2, 3]
/** Papers usable when there is no logo (polaroid needs a photo). */
const NON_POLAROID: PaperStyle[] = ['notebook', 'manila', 'grid', 'plain']

/** FNV-1a-style stable 32-bit hash → non-negative int. No deps, no randomness. */
function hash(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function boardStyleFor(orgId: string, clusterSlug: string, hasLogo: boolean): BoardStyle {
  const h = hash(orgId)
  const rotation = ROTATIONS[h % ROTATIONS.length]
  const fastener: Fastener = ((h >>> 3) & 3) === 0 ? 'tape' : 'pin' // ~1 in 4 taped
  const fastenerOffset = ((h >>> 5) % 37) - 18
  const paper: PaperStyle =
    hasLogo && (h >>> 7) % 3 !== 0 ? 'polaroid' : NON_POLAROID[(h >>> 9) % NON_POLAROID.length]
  const color = (clusterBySlug(clusterSlug)?.color ?? 'blue') as ThreadColor
  return { rotation, paper, fastener, fastenerOffset, color, hex: threadHex[color] }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/boardStyle.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/boardStyle.ts src/lib/boardStyle.test.ts
git commit -m "feat(orgs): add react-masonry-css and deterministic board-style helper"
```

---

### Task 2: Presentational atoms — PushPin, MaskingTape, CategorySticker

**Files:**
- Create: `src/components/organizations/PushPin.tsx`
- Create: `src/components/organizations/MaskingTape.tsx`
- Create: `src/components/organizations/CategorySticker.tsx`

**Interfaces:**
- Consumes: `clusterBySlug` from `../../config/clusters`; `threadHex` from `../../lib/assets`; `cn` from `../../lib/utils`.
- Produces:
  - `PushPin` props: `{ hex: string; offset?: number; className?: string }`
  - `MaskingTape` props: `{ offset?: number; className?: string }`
  - `CategorySticker` props: `{ slug: string; rotate?: number; className?: string }`

- [ ] **Step 1: Create PushPin**

Create `src/components/organizations/PushPin.tsx`. A small domed pin in the cluster color; purely decorative.
```tsx
import { cn } from '../../lib/utils'

interface PushPinProps {
  hex: string
  /** Horizontal jitter in px from center. */
  offset?: number
  className?: string
}

export function PushPin({ hex, offset = 0, className }: PushPinProps) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute -top-2 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rounded-full', className)}
      style={{
        marginLeft: offset,
        background: `radial-gradient(circle at 32% 30%, #ffffff9c, ${hex} 55%, ${hex} 100%)`,
        boxShadow: `0 2px 3px rgba(46,74,143,0.35), inset 0 -1px 2px rgba(0,0,0,0.25)`,
      }}
    />
  )
}
```

- [ ] **Step 2: Create MaskingTape**

Create `src/components/organizations/MaskingTape.tsx`. A translucent warm-white strip at the top; decorative.
```tsx
import { cn } from '../../lib/utils'

interface MaskingTapeProps {
  /** Horizontal jitter in px from center. */
  offset?: number
  className?: string
}

export function MaskingTape({ offset = 0, className }: MaskingTapeProps) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute -top-2 left-1/2 z-20 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[2px]', className)}
      style={{
        marginLeft: offset,
        background: 'repeating-linear-gradient(90deg, rgba(250,248,245,0.72) 0 6px, rgba(240,236,229,0.72) 6px 12px)',
        boxShadow: '0 1px 4px rgba(46,74,143,0.12)',
      }}
    />
  )
}
```

- [ ] **Step 3: Create CategorySticker**

Create `src/components/organizations/CategorySticker.tsx`. Sticker-style cluster label (rounded, tinted, slightly peeled). Distinct from `ClusterBadge` (which stays for the profile page).
```tsx
import { clusterBySlug } from '../../config/clusters'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'

interface CategoryStickerProps {
  slug: string
  /** Slight rotation in degrees for the peeled-sticker feel. */
  rotate?: number
  className?: string
}

export function CategorySticker({ slug, rotate = -2, className }: CategoryStickerProps) {
  const cluster = clusterBySlug(slug)
  if (!cluster) return null
  const hex = threadHex[cluster.color]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.08em]',
        className,
      )}
      style={{
        backgroundColor: `${hex}1f`,
        color: hex,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 4px rgba(46,74,143,0.10)',
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
      {cluster.name}
    </span>
  )
}
```

- [ ] **Step 4: Build to verify the atoms compile**

Run: `npm run build`
Expected: PASS (unused-component warnings do not occur — TS only errors on unused *locals*, not unused exports).

- [ ] **Step 5: Commit**

```bash
git add src/components/organizations/PushPin.tsx src/components/organizations/MaskingTape.tsx src/components/organizations/CategorySticker.tsx
git commit -m "feat(orgs): pushpin, masking-tape, and sticker atoms for the board"
```

---

### Task 3: PinnedCard — the paper artifact

**Files:**
- Create: `src/components/organizations/PinnedCard.tsx`

**Interfaces:**
- Consumes: `type Organization` from `../../lib/contentful/types`; `boardStyleFor`, `type PaperStyle` from `../../lib/boardStyle`; `PushPin`, `MaskingTape`, `CategorySticker`; `EmbroideredAccent` from `../EmbroideredAccent`; `Link` from `react-router-dom`; `ArrowRight` from `lucide-react`; `motion`, `useReducedMotion` from `framer-motion`; `cn` from `../../lib/utils`.
- Produces:
  - `PinnedCard` props: `{ organization: Organization; index: number }` (index drives the load stagger).

- [ ] **Step 1: Create the paper-surface style helper inside the component file**

The card renders one of five papers. Background treatments are pure CSS (no new image assets); every paper also carries the existing paper texture overlay for tactility.

Create `src/components/organizations/PinnedCard.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Organization } from '../../lib/contentful/types'
import { boardStyleFor, type PaperStyle } from '../../lib/boardStyle'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { PushPin } from './PushPin'
import { MaskingTape } from './MaskingTape'
import { CategorySticker } from './CategorySticker'
import { clusterBySlug } from '../../config/clusters'
import { cn } from '../../lib/utils'

/** Per-paper surface: base color + optional ruled/grid lines. Texture overlay added separately. */
function paperSurface(paper: PaperStyle): React.CSSProperties {
  switch (paper) {
    case 'notebook':
      return {
        backgroundColor: 'var(--color-linen-white)',
        backgroundImage:
          'repeating-linear-gradient(var(--color-linen-white) 0 26px, rgba(46,74,143,0.10) 26px 27px)',
      }
    case 'grid':
      return {
        backgroundColor: 'var(--color-linen-white)',
        backgroundImage:
          'repeating-linear-gradient(rgba(46,74,143,0.07) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(46,74,143,0.07) 0 1px, transparent 1px 22px)',
      }
    case 'manila':
      return { backgroundColor: '#ece1c9' }
    case 'polaroid':
      return { backgroundColor: '#ffffff' }
    case 'plain':
    default:
      return { backgroundColor: 'var(--color-linen-white)' }
  }
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

interface PinnedCardProps {
  organization: Organization
  index: number
}

export function PinnedCard({ organization, index }: PinnedCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const style = boardStyleFor(organization.id, organization.cluster.slug, Boolean(organization.logo))
  const cluster = clusterBySlug(organization.cluster.slug)

  const restRotate = shouldReduceMotion ? 0 : style.rotation
  const enter = shouldReduceMotion
    ? { opacity: 1, y: 0, rotate: restRotate }
    : { opacity: 1, y: 0, rotate: restRotate }
  const initial = shouldReduceMotion ? false : { opacity: 0, y: -24, rotate: 0 }

  const isPolaroid = style.paper === 'polaroid'

  return (
    <motion.div
      initial={initial}
      animate={enter}
      transition={{ duration: 0.45, ease: 'easeOut', delay: shouldReduceMotion ? 0 : Math.min(index, 14) * 0.04 }}
      whileHover={shouldReduceMotion ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      className="group relative"
      style={{ transformOrigin: 'center top' }}
    >
      {style.fastener === 'pin' ? (
        <PushPin hex={style.hex} offset={style.fastenerOffset} />
      ) : (
        <MaskingTape offset={style.fastenerOffset} />
      )}

      {/* corner flower — wiggles on hover */}
      {cluster && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-3 z-20"
          animate={shouldReduceMotion ? undefined : { rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ rotate: 12 }}
        >
          <EmbroideredAccent color={cluster.color} index={0} size={30} opacity={85} />
        </motion.div>
      )}

      <Link
        to={`/organizations/${organization.slug}`}
        className="relative block overflow-hidden rounded-[6px] shadow-[0_6px_20px_rgba(46,74,143,0.10)] outline-offset-4 transition-shadow duration-300 group-hover:shadow-[0_16px_34px_rgba(46,74,143,0.20)]"
        style={{ ...paperSurface(style.paper), borderTop: `3px solid ${style.hex}` }}
      >
        {/* paper texture overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: "url('/textures/paper-texture-1.webp')", backgroundSize: '260px' }}
        />

        {isPolaroid && organization.logo ? (
          <div className="relative p-3 pb-0">
            <img
              src={organization.logo}
              alt={organization.name}
              loading="lazy"
              className="aspect-square w-full rounded-[3px] bg-canvas-cream object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="px-1 pb-4 pt-3">
              <p className="font-accent text-2xl leading-none text-trust-blue">{organization.name}</p>
              <div className="mt-3 flex flex-col gap-2.5">
                <CategorySticker slug={organization.cluster.slug} className="self-start" />
                <p className="line-clamp-2 font-body text-sm leading-relaxed text-fabric-dark">{organization.description}</p>
                <span className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors group-hover:text-thread-red">
                  Learn more <ArrowRight size={15} strokeWidth={1.75} />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              {organization.logo ? (
                <img
                  src={organization.logo}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-full border border-trust-blue/10 bg-linen-white object-cover"
                />
              ) : (
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold"
                  style={{ backgroundColor: `${style.hex}1a`, color: style.hex }}
                >
                  {initials(organization.name)}
                </span>
              )}
              <CategorySticker slug={organization.cluster.slug} />
            </div>
            <h3 className="font-display text-lg font-bold leading-tight text-trust-blue">{organization.name}</h3>
            <p className="line-clamp-2 font-body text-sm leading-relaxed text-fabric-dark">{organization.description}</p>
            <span className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors group-hover:text-thread-red">
              Learn more <ArrowRight size={15} strokeWidth={1.75} />
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/organizations/PinnedCard.tsx
git commit -m "feat(orgs): PinnedCard paper artifact with polaroid/notebook/grid/manila variants"
```

---

### Task 4: PinnedSearchNote and NotebookTabs

**Files:**
- Create: `src/components/organizations/PinnedSearchNote.tsx`
- Create: `src/components/organizations/NotebookTabs.tsx`

**Interfaces:**
- Consumes: `Search` from `lucide-react`; `PushPin` from `./PushPin`; `clusters` from `../../config/clusters`; `threadHex` from `../../lib/assets`; `cn` from `../../lib/utils`.
- Produces:
  - `PinnedSearchNote` props: `{ value: string; onChange: (v: string) => void }`
  - `NotebookTabs` props: `{ activeCluster: string | null; onSelect: (slug: string | null) => void; counts: Record<string, number> }`

- [ ] **Step 1: Create PinnedSearchNote**

Create `src/components/organizations/PinnedSearchNote.tsx`. The search field styled as a pinned index card.
```tsx
import { Search } from 'lucide-react'
import { PushPin } from './PushPin'
import { threadHex } from '../../lib/assets'

interface PinnedSearchNoteProps {
  value: string
  onChange: (v: string) => void
}

export function PinnedSearchNote({ value, onChange }: PinnedSearchNoteProps) {
  return (
    <div className="relative mx-auto max-w-md -rotate-1">
      <PushPin hex={threadHex.red} />
      <div className="rounded-[6px] border border-trust-blue/10 bg-linen-white p-4 shadow-[0_8px_22px_rgba(46,74,143,0.12)]">
        <p className="mb-2 font-accent text-xl text-trust-blue">Find your organization</p>
        <div className="relative">
          <Search size={18} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-stitch-gray" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Find an organization"
            aria-label="Find an organization"
            className="w-full rounded-[6px] border border-trust-blue/15 bg-canvas-cream py-2.5 pl-10 pr-3 font-body text-fabric-dark placeholder:text-stitch-gray focus-visible:border-trust-blue"
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create NotebookTabs**

Create `src/components/organizations/NotebookTabs.tsx`. Cluster filters as notebook tabs; the active tab is clipped forward and colored.
```tsx
import { clusters } from '../../config/clusters'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'

interface NotebookTabsProps {
  activeCluster: string | null
  onSelect: (slug: string | null) => void
  counts: Record<string, number>
}

export function NotebookTabs({ activeCluster, onSelect, counts }: NotebookTabsProps) {
  const tab = (active: boolean, hex?: string) =>
    cn(
      'rounded-t-[8px] border border-b-0 px-4 py-2 font-body text-sm font-medium transition-all duration-200',
      active
        ? 'translate-y-0 bg-linen-white text-trust-blue shadow-[0_-3px_12px_rgba(46,74,143,0.10)]'
        : 'translate-y-1 border-trust-blue/15 bg-canvas-cream text-fabric-dark hover:-translate-y-0 hover:text-trust-blue',
    )

  return (
    <div role="tablist" aria-label="Filter by cluster" className="flex flex-wrap items-end gap-1.5 border-b border-trust-blue/15">
      <button
        role="tab"
        aria-pressed={activeCluster === null}
        onClick={() => onSelect(null)}
        className={tab(activeCluster === null)}
        style={activeCluster === null ? { borderTop: `3px solid ${threadHex.blue}` } : undefined}
      >
        All
      </button>
      {clusters.map((c) => {
        const active = activeCluster === c.slug
        return (
          <button
            key={c.slug}
            role="tab"
            aria-pressed={active}
            onClick={() => onSelect(c.slug)}
            className={tab(active)}
            style={active ? { borderTop: `3px solid ${threadHex[c.color]}` } : undefined}
          >
            {c.name}
            <span className="ml-1.5 text-xs text-stitch-gray">{counts[c.slug] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/organizations/PinnedSearchNote.tsx src/components/organizations/NotebookTabs.tsx
git commit -m "feat(orgs): pinned search note and notebook-tab cluster filters"
```

---

### Task 5: DiscoveryBoard (masonry + state + decor) and page wiring

**Files:**
- Create: `src/components/organizations/DiscoveryBoard.tsx`
- Modify: `src/pages/Organizations.tsx`
- Modify: `src/index.css` (masonry column classes)

**Interfaces:**
- Consumes: `type Organization` from `../../lib/contentful/types`; `filterOrganizations` from `../../lib/directory`; `clusters` from `../../config/clusters`; `PinnedSearchNote`, `NotebookTabs`, `PinnedCard`; `EmbroideredAccent`, `FloatingAccent`, `DriftingThread`; `threadsByColor` from `../../lib/assets`; `Masonry` (default) from `react-masonry-css`; `AnimatePresence`, `motion` from `framer-motion`.
- Produces:
  - `DiscoveryBoard` props: `{ organizations: Organization[]; isLoading: boolean }`

- [ ] **Step 1: Add masonry column CSS**

In `src/index.css`, append (after the existing utility rules):
```css
/* Discovery board masonry (react-masonry-css) */
.board-masonry {
  display: flex;
  width: auto;
  margin-left: -24px;
}
.board-masonry-col {
  padding-left: 24px;
  background-clip: padding-box;
}
.board-masonry-col > * {
  margin-bottom: 28px;
}
```

- [ ] **Step 2: Create DiscoveryBoard**

Create `src/components/organizations/DiscoveryBoard.tsx`:
```tsx
import { useMemo, useState } from 'react'
import Masonry from 'react-masonry-css'
import { AnimatePresence, motion } from 'framer-motion'
import type { Organization } from '../../lib/contentful/types'
import { filterOrganizations } from '../../lib/directory'
import { clusters } from '../../config/clusters'
import { threadsByColor } from '../../lib/assets'
import { PinnedSearchNote } from './PinnedSearchNote'
import { NotebookTabs } from './NotebookTabs'
import { PinnedCard } from './PinnedCard'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { DriftingThread } from '../ui/DriftingThread'

const BREAKPOINTS = { default: 4, 1100: 3, 700: 2, 500: 1 }

interface DiscoveryBoardProps {
  organizations: Organization[]
  isLoading: boolean
}

export function DiscoveryBoard({ organizations, isLoading }: DiscoveryBoardProps) {
  const [query, setQuery] = useState('')
  const [activeCluster, setActiveCluster] = useState<string | null>(null)

  const counts = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const c of clusters) acc[c.slug] = organizations.filter((o) => o.cluster.slug === c.slug).length
    return acc
  }, [organizations])

  const results = filterOrganizations(organizations, query, activeCluster)

  return (
    <section className="relative overflow-hidden bg-canvas-cream py-16 md:py-20">
      {/* faint corkboard wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ background: 'radial-gradient(120% 80% at 50% 0%, var(--color-thread-yellow), transparent 60%)' }}
      />
      {/* yarn woven behind the board */}
      <DriftingThread src={threadsByColor.blue[0]} className="pointer-events-none absolute left-[-3%] top-24 hidden w-40 opacity-40 lg:block" duration={7} />
      <DriftingThread src={threadsByColor.pink[0]} className="pointer-events-none absolute right-[-2%] top-1/2 hidden w-32 opacity-40 lg:block" duration={6.5} delay={0.4} />
      <FloatingAccent duration={6} distance={7} rotate={4} className="pointer-events-none absolute left-[4%] bottom-16 hidden opacity-70 md:block">
        <EmbroideredAccent color="green" index={0} size={36} />
      </FloatingAccent>

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mb-10">
          <PinnedSearchNote value={query} onChange={setQuery} />
        </div>

        <div className="mb-10">
          <NotebookTabs activeCluster={activeCluster} onSelect={setActiveCluster} counts={counts} />
        </div>

        {isLoading ? (
          <Masonry breakpointCols={BREAKPOINTS} className="board-masonry" columnClassName="board-masonry-col">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-[6px] bg-linen-white shadow-[0_6px_20px_rgba(46,74,143,0.08)]" />
            ))}
          </Masonry>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <EmbroideredAccent color="yellow" index={1} size={56} />
            <p className="font-body text-lg text-stitch-gray">No organizations match — try another name or cluster.</p>
          </div>
        ) : (
          // Whole-board cross-fade keyed by cluster (react-masonry-css can't do per-card exit);
          // search filters live within the current view via reconcile.
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCluster ?? 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Masonry breakpointCols={BREAKPOINTS} className="board-masonry" columnClassName="board-masonry-col">
                {results.map((org, i) => (
                  <PinnedCard key={org.slug} organization={org} index={i} />
                ))}
              </Masonry>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Wire into Organizations.tsx**

In `src/pages/Organizations.tsx`:
1. Remove now-unused imports: `Search` (lucide), `OrganizationCard`, `ThreadBorder`, `SectionGlow`, `filterOrganizations`, `cn`, and the `useState` for `query`/`activeCluster` (the board owns them now). Keep `clusters`, `threadHex`, `useOrganizations`, `Reveal`, `EmbroideredAccent`, `PageHeader`, `Seo`.
2. Add import: `import { DiscoveryBoard } from '../components/organizations/DiscoveryBoard'`.
3. Delete the entire second `<section>` (the one containing the search input, filter pills, and the `OrganizationCard` grid — from `<section className="relative bg-canvas-cream py-16 md:py-20">` through its closing `</section>`).
4. In its place render:
```tsx
<DiscoveryBoard organizations={orgs} isLoading={isLoading} />
```
Leave the first `<section>` (the 6 cluster-overview cards) and `PageHeader` exactly as they are.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS (no unused-import TS errors — verify all removed imports from step 3 are actually gone).

- [ ] **Step 5: Verify in the browser**

Run `npm run dev`, open `/organizations`. Confirm: the cluster-overview cards still render at top; below them the board shows the pinned search note, notebook tabs, and a masonry of tilted pinned cards (mix of polaroids and notebook/grid/manila papers, pins and occasional tape). Typing in the search filters live; clicking a notebook tab cross-fades the board to that cluster; clicking a card navigates to `/organizations/<slug>`; the empty state appears for a no-match query.

- [ ] **Step 6: Commit**

```bash
git add src/components/organizations/DiscoveryBoard.tsx src/pages/Organizations.tsx src/index.css
git commit -m "feat(orgs): discovery board masonry with pinned cards, replacing the directory grid"
```

---

### Task 6: Motion polish, responsive, accessibility, and final verification

**Files:**
- Modify: `src/components/organizations/PinnedCard.tsx` (pin-bounce on hover; reduced-motion audit)
- Modify: `src/components/organizations/DiscoveryBoard.tsx` (only if verification surfaces layout issues)

**Interfaces:**
- No new exports. Refines existing components.

- [ ] **Step 1: Add the pin/tape bounce on card hover**

In `PinnedCard.tsx`, make the fastener react to the card's group-hover. Wrap the `PushPin`/`MaskingTape` in a `motion.div` that bounces when hovered (skipped under reduced motion):
```tsx
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 z-20"
        whileHover={undefined}
        animate={{ y: 0 }}
      >
        {style.fastener === 'pin' ? (
          <PushPin hex={style.hex} offset={style.fastenerOffset} />
        ) : (
          <MaskingTape offset={style.fastenerOffset} />
        )}
      </motion.div>
```
Then drive a tiny bounce from the parent card's hover using a variant: add `whileHover="hover"` to the outer `motion.div` (the card root) and give the fastener wrapper `variants={{ hover: shouldReduceMotion ? {} : { y: [0, -3, 0], transition: { duration: 0.35 } } }}`. Keep it subtle (≤3px, one bounce). If this complicates the existing `whileHover` object on the card root, instead keep the card root's `whileHover` object and add a separate CSS transition on the pin (`group-hover:-translate-y-[3px]`); either is acceptable — pick the simpler one that builds cleanly.

- [ ] **Step 2: Reduced-motion audit**

With `prefers-reduced-motion: reduce` emulated (DevTools → Rendering → Emulate CSS prefers-reduced-motion), confirm: cards appear at their final tilt with no drop-in, no hover rotate/scale/lift, no pin bounce, no flower wiggle, and the board cross-fade on cluster change is instant/none. The `useReducedMotion()` guards in `PinnedCard` and the drifting/floating decor already handle this — verify no stray infinite animation remains.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Full cross-device verification**

Run `npm run dev`, `/organizations`:
- **Desktop:** 4-column masonry, varied card heights, tilts within ±3°, hover straightens + lifts + shadow grows + pin bounces + corner flower wiggles.
- **Determinism:** reload the page several times — each org keeps the *same* tilt, paper, and fastener every time (proves the seeded style).
- **Color discipline:** confirm pin/sticker/top-edge color matches each org's cluster (e.g. all Faith orgs purple, Academics blue) — no random rainbow.
- **Tablet (~800px):** 2–3 columns, decor simplified.
- **Mobile (~380px):** single column, cards full-width, no horizontal overflow, tabs wrap, search note fits.
- **Keyboard:** Tab through cards — each shows the stitch-dash focus ring (not clipped by the tilt/overflow); Enter navigates. Tab reaches the search input and every notebook tab.
- **Filtering:** notebook tab cross-fades the board; search narrows live; empty state copy shows and is legible.
- Re-run `npx vitest run` (full suite) — all green.

- [ ] **Step 5: Commit**

```bash
git add src/components/organizations/PinnedCard.tsx src/components/organizations/DiscoveryBoard.tsx
git commit -m "feat(orgs): board motion polish, reduced-motion, responsive + a11y verification"
```

---

## Self-Review

**Spec coverage** (against the Organization Discovery Board proposal):
- Masonry / Pinterest layout → Task 5 (`react-masonry-css`, `BREAKPOINTS`) ✓
- Corkboard background + reused flower/yarn decor woven behind cards → Task 5 (`DiscoveryBoard` wash + `DriftingThread`/`FloatingAccent`) ✓
- Paper variations (notebook, grid, colored/manila, polaroid, plain) → Task 3 (`paperSurface` + `PaperStyle`) ✓
- Slight randomized rotation ±3° → Task 1 (`ROTATIONS`, seeded) ✓
- Push pins (per-cluster color) + occasional masking tape → Tasks 2–3 (`PushPin`/`MaskingTape`, `fastener`) ✓
- Polaroid logo presentation → Task 3 (polaroid branch, hover photo scale) ✓
- Sticker-style category labels → Task 2 (`CategorySticker`) ✓
- Card content (logo, name, category, 2-line desc, CTA) → Task 3 ✓
- Card composition variants (polaroid vs. standard/landscape paper) → Task 3 (polaroid vs. inline-header papers) ✓ *(Large Poster / true Landscape folded into the polaroid + paper variants to keep scope sane; noted below.)*
- Hover choreography (lift, straighten, shadow, pin bounce, flower wiggle) → Tasks 3 & 6 ✓
- Load drop-in with stagger → Task 3 (`initial y:-24` + capped stagger) ✓
- Filtering reflow → Task 5 (cluster-keyed cross-fade + live search; **honest limit:** react-masonry-css can't slide individual cards, documented in Global Constraints) ✓
- Floating decorations overlapping cards → Task 3 (corner flower) + Task 5 (board decor) ✓
- Search as pinned note → Task 4 (`PinnedSearchNote`) ✓
- Filters as notebook tabs → Task 4 (`NotebookTabs`) ✓
- Reuse existing assets only → yes; papers are pure CSS + the existing texture, no new image files ✓
- Reduced motion / a11y / responsive → Task 6 + Global Constraints ✓

**Deliberate deviations from the literal spec (flagged for the reviewer):**
1. **Color is cluster-driven, not random** — per design-system §2 ("never scatter rainbow colors"; "2–3 accents per viewport") and frontend-design "structure = information." Randomizing pin/paper *color* across 44 cards would violate the brand and read as noise.
2. **No true per-card slide-reflow on filter** — `react-masonry-css` redistributes children each render, so a whole-board cross-fade (cluster) + live reconcile (search) is used instead. This was the explicitly chosen engine.
3. **"Large Poster" and "Landscape" composition variants** are folded into the polaroid (large photo) and inline-header paper layouts rather than adding two more bespoke layouts — keeps the card component maintainable; can be extended later if desired.

**Placeholder scan:** no TBD/TODO; every code step contains full component code; the seeded style values are real (rotation table, hash, bit-extraction), not placeholders.

**Type consistency:** `BoardStyle`/`PaperStyle`/`Fastener` defined in Task 1 and consumed unchanged in Tasks 2–3; `boardStyleFor(orgId, clusterSlug, hasLogo)` signature is stable across the card; `DiscoveryBoard` props `{ organizations, isLoading }` match the call site in `Organizations.tsx`; `Organization` type fields (`id`, `name`, `slug`, `cluster.slug`, `cluster.color` via `clusterBySlug`, `description`, `logo`) match `src/lib/contentful/types.ts`.
