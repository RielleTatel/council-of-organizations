# COA-Z Home Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the COA-Z public landing page (`/`) as a fully-composed, on-brand "Interwoven Beyond" experience: hero, quick statistics, about, purpose, featured organization, upcoming events, CTA, plus site navbar and footer.

**Architecture:** A Vite + React 19 SPA. The page is one route component (`Home.tsx`) that composes eight presentational section components from `src/components/home/`, sharing reusable brand primitives (`Button`, `Reveal`, `EmbroideredAccent`, `ThreadDivider`, `ThreadBorder`) and drawing live data through existing TanStack Query hooks. All Contentful-derived numbers/selection run through pure, unit-tested helpers in `src/lib/home.ts`. Motion is CSS + IntersectionObserver only (no Motion library, no scroll listeners).

**Tech Stack:** Vite 8, React 19, TypeScript, Tailwind v4 (`@theme` tokens), TanStack Query v5, react-router-dom v7, react-helmet-async, lucide-react, class-variance-authority, Vitest (added in Task 1).

---

## Design Read (design-taste-frontend §0.B)

**Reading this as:** an institutional / community landing page for a student-organization council, serving students, org leaders, and university stakeholders, with a handcrafted-embroidery × modern-minimalism language (the "Interwoven Beyond" system), leaning toward Vite + React + self-hosted Made Tommy / Omegle + Tailwind v4 tokens + restrained organic motion.

**Dials (design-taste-frontend §1):** `DESIGN_VARIANCE: 6` / `MOTION_INTENSITY: 5` / `VISUAL_DENSITY: 3`. Reasoned from the brief: institutional trust-first pulls variance and density down; the design system's signature thread-draw / scroll-weave motion keeps motion mid-range, not static.

**Deliberate taste-skill overrides (all brand- or platform-driven, documented per §4.2 / §4.11 / §6.C / §3.C / §3.A):**
- **Single theme lock = LIGHT.** The "Interwoven Beyond" system commits to a warm Canvas Cream / Linen White canvas as core identity. No dark mode. This is the "brand insists on one mode" clause of §6.C, not an oversight.
- **Multi-accent brand override.** The brand is explicitly a "diversity spectrum" of thread colors ("Unity in Diversity"). Trust Blue is the single primary; thread accents appear in intentional clusters, max 2-3 per viewport, each section assigned one consistent thread color. This is the §4.2 brand-override path, not scattered rainbow slop.
- **lucide-react allowed.** §3.C discourages it, but the project already depends on it (the stated exception).
- **No Motion library.** §3.A prefers Motion for React, but this SPA's modest needs are met dependency-free with IntersectionObserver + CSS transitions, which still satisfies the §5.D ban on `window.addEventListener('scroll')`.
- **Vite, not Next.** No `next/font` (fonts self-hosted via `@font-face`, already done), no RSC, no `next/image` (plain `<img>` with explicit `width`/`height` + `loading`).

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Platform:** Vite + React 19 SPA. No Next.js APIs (`next/font`, `next/image`, RSC, `'use client'`). No path alias configured — use **relative imports** (`../lib/...`), never `@/`.
- **Theme:** LIGHT only. Background `bg-canvas-cream` (#F5F0E8); elevated surfaces `bg-linen-white` (#FAF8F5). No `dark:` variants, no section inverts.
- **Primary color:** `text-trust-blue` / `bg-trust-blue` (#2E4A8F) for headers, links, primary CTA. Used identically on every section.
- **Thread accents:** `thread-red` #C41E3A, `thread-blue` #1E5AA8, `thread-green` #2D8A3E, `thread-yellow` #E4C41A, `thread-pink` #E85A9A, `thread-purple` #7B3FA0. Max 2-3 per viewport. Section→color assignment (locked): Hero=purple+yellow, Stats=blue, About=green, Purpose cards=red/blue/green/purple (one each), Featured=pink, Events=yellow, CTA=red, Footer=blue.
- **Neutrals:** body text `text-fabric-dark` #3D3D3D; secondary/captions `text-stitch-gray` #8A8A8A.
- **Fonts (already wired in `src/index.css`):** `font-display` and `font-body` = "Made Tommy" (weights 100/300/400/500/700/900); `font-accent` = "Omegle". Headlines use `font-display font-bold tracking-[-0.02em]`; body uses `font-body`; handwritten callouts / hashtags use `font-accent`.
- **Corner-radius lock (§4.4):** interactive buttons `rounded-full` (pill); cards/surfaces/inputs `rounded-[8px]`. No other radii.
- **Shadows:** tinted only — `shadow-[0_4px_20px_rgba(46,74,143,0.06)]`. No pure-black shadows.
- **ZERO em-dashes (`—`) and en-dashes (`–`) anywhere visible** (§9.G). The organization's name uses a hyphen everywhere: **"Council of the Organizations of the Ateneo - Zamboanga"** and **"Ateneo de Zamboanga University"**. This matches existing `src/config/site.ts` and `src/config/seo.ts`.
- **Icons:** lucide-react only, one family, `strokeWidth={1.75}` standardized. No hand-rolled SVG icons. (Decorative thread/flower art is raster PNG assets, not icons — allowed.)
- **Motion:** IntersectionObserver + CSS transitions only. Animate `transform`/`opacity` only. Everything must collapse to static under `prefers-reduced-motion: reduce`. No `window` scroll listeners, no `useState` for continuous scroll values.
- **Layout:** content containers `max-w-[1200px] mx-auto px-6`; section vertical padding `py-20 md:py-28`, `py-12` on mobile. Hero uses `min-h-[100dvh]`, never `h-screen`.
- **Copy:** use the exact strings from the content brief (hyphen brand form). No invented stats, no filler verbs, no scroll cues, no version labels, no locale strips.
- **Every task ends green:** `bunx tsc -b` (typecheck) and `bun run lint` (oxlint) must pass before commit. Component tasks are additionally verified in the browser (`bun run dev`).

---

## File Structure

**Created:**
- `src/lib/home.ts` — pure helpers: stats derivation, featured-org selection, upcoming-events selection.
- `src/lib/home.test.ts` — Vitest unit tests for the above.
- `vitest.config.ts` — test runner config.
- `src/hooks/useHomeData.ts` — thin hooks composing existing query hooks + `home.ts` helpers.
- `src/components/ui/Button.tsx` — pill button (cva variants: primary/secondary).
- `src/components/ui/Reveal.tsx` — IntersectionObserver scroll-reveal wrapper + `useInView` hook.
- `src/components/ui/FabricTexture.tsx` — fixed, pointer-events-none paper-grain overlay.
- `src/components/layout/Navbar.tsx` — top navigation (desktop bar + mobile sheet).
- `src/components/layout/Footer.tsx` — site footer.
- `src/components/home/Hero.tsx`
- `src/components/home/QuickStats.tsx`
- `src/components/home/AboutSection.tsx`
- `src/components/home/PurposeSection.tsx`
- `src/components/home/FeaturedOrganization.tsx`
- `src/components/home/UpcomingEvents.tsx`
- `src/components/home/HomeCTA.tsx`

**Already created (verify/extend, do not recreate):**
- `src/index.css` — `@font-face` + `@theme` tokens (extend with base + reveal + focus CSS in Task 2).
- `src/lib/assets.ts` — flower/yarn/hoop registry.
- `src/components/EmbroideredAccent.tsx`, `src/components/ThreadDivider.tsx`, `src/components/ThreadBorder.tsx`.

**Modified:**
- `src/main.tsx` — wrap app in `HelmetProvider`.
- `src/pages/Home.tsx` — replace demo with the real composition.
- `package.json` — add `vitest` devDependency + `test` script.

---

## Layout-Family Ledger (design-taste-frontend §4.7, §9.C)

Eight visible sections, at least four distinct layout families, no family repeated, no 3 consecutive image+text splits:

| Section | Layout family |
|---|---|
| Hero | Asymmetric split (text left / hoop-framed asset right) |
| Quick Statistics | Stat band, stitch-divider separated numerals (NOT boxed cards) |
| About COA-Z | Editorial prose block, single column max-w-[65ch] + side flower accent |
| Our Purpose | Bento 2×2, each cell a distinct thread color |
| Featured Organization | Framed spotlight (hoop-framed logo + metadata list) |
| Upcoming Events | Event card grid (2-3 cells, banner image per card) |
| Call to Action | Full-width color band, centered manifesto |
| Footer | Multi-column footer |

Eyebrow budget (§4.7): `ceil(8/3) = 3` uppercase-tracking micro-labels max, hero badge counts as 1. Use eyebrows only on Hero (badge), Our Purpose, and one other. Prefer no eyebrow elsewhere.

---

### Task 1: Pure home-data helpers (TDD) + Vitest setup

**Files:**
- Modify: `package.json` (add devDependency + script)
- Create: `vitest.config.ts`
- Create: `src/lib/home.ts`
- Test: `src/lib/home.test.ts`

**Interfaces:**
- Consumes: `Organization`, `Event`, `Leader` from `src/lib/contentful/types.ts`.
- Produces:
  - `interface HomeStats { organizations: number; clusters: number; offices: number; leaders: number }`
  - `deriveHomeStats(orgs: Organization[], leaders: Leader[]): HomeStats`
  - `selectFeaturedOrganization(orgs: Organization[], date: Date): Organization | null` — deterministic daily rotation.
  - `selectUpcomingEvents(events: Event[], now: Date, count: number): Event[]` — future events, soonest first, capped at `count`.

- [ ] **Step 1: Add Vitest dependency and script**

Run:
```bash
bun add -d vitest
```
Then in `package.json` `"scripts"`, add:
```json
"test": "vitest run"
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 3: Write the failing tests**

Create `src/lib/home.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { deriveHomeStats, selectFeaturedOrganization, selectUpcomingEvents } from './home'
import type { Organization, Event, Leader } from './contentful/types'

function org(id: string, clusterId: string): Organization {
  return {
    id,
    name: `Org ${id}`,
    slug: `org-${id}`,
    cluster: { id: clusterId, name: `Cluster ${clusterId}`, slug: `c-${clusterId}` },
    description: 'x',
    logo: '',
    officers: [],
  }
}

function leader(id: string, office: string): Leader {
  return { id, name: `L${id}`, role: 'r', office, image: '', bio: '' }
}

function evt(id: string, date: string): Event {
  return { id, title: `E${id}`, slug: `e-${id}`, date, description: 'x', image: '', isFeatured: false, isFlagship: false }
}

describe('deriveHomeStats', () => {
  it('counts orgs, distinct clusters, distinct offices, and leaders', () => {
    const orgs = [org('1', 'a'), org('2', 'a'), org('3', 'b')]
    const leaders = [leader('1', 'President'), leader('2', 'President'), leader('3', 'VP')]
    expect(deriveHomeStats(orgs, leaders)).toEqual({
      organizations: 3,
      clusters: 2,
      offices: 2,
      leaders: 3,
    })
  })

  it('returns all zeros for empty input', () => {
    expect(deriveHomeStats([], [])).toEqual({ organizations: 0, clusters: 0, offices: 0, leaders: 0 })
  })
})

describe('selectFeaturedOrganization', () => {
  it('returns null for empty list', () => {
    expect(selectFeaturedOrganization([], new Date('2026-01-01'))).toBeNull()
  })

  it('is deterministic for the same day', () => {
    const orgs = [org('1', 'a'), org('2', 'a'), org('3', 'b')]
    const a = selectFeaturedOrganization(orgs, new Date('2026-03-10T08:00:00Z'))
    const b = selectFeaturedOrganization(orgs, new Date('2026-03-10T20:00:00Z'))
    expect(a?.id).toBe(b?.id)
  })

  it('rotates across days', () => {
    const orgs = [org('1', 'a'), org('2', 'b')]
    const day1 = selectFeaturedOrganization(orgs, new Date('2026-03-10T00:00:00Z'))
    const day2 = selectFeaturedOrganization(orgs, new Date('2026-03-11T00:00:00Z'))
    expect(day1?.id).not.toBe(day2?.id)
  })
})

describe('selectUpcomingEvents', () => {
  const now = new Date('2026-07-28T00:00:00Z')

  it('keeps only future events, soonest first', () => {
    const events = [evt('past', '2026-07-01'), evt('soon', '2026-08-01'), evt('later', '2026-09-01')]
    const result = selectUpcomingEvents(events, now, 3)
    expect(result.map((e) => e.id)).toEqual(['soon', 'later'])
  })

  it('caps at count', () => {
    const events = [evt('a', '2026-08-01'), evt('b', '2026-08-02'), evt('c', '2026-08-03')]
    expect(selectUpcomingEvents(events, now, 2).map((e) => e.id)).toEqual(['a', 'b'])
  })
})
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `bun run test`
Expected: FAIL (module `./home` has no such exports).

- [ ] **Step 5: Implement `src/lib/home.ts`**

```ts
import type { Organization, Event, Leader } from './contentful/types'

export interface HomeStats {
  organizations: number
  clusters: number
  offices: number
  leaders: number
}

export function deriveHomeStats(orgs: Organization[], leaders: Leader[]): HomeStats {
  return {
    organizations: orgs.length,
    clusters: new Set(orgs.map((o) => o.cluster.id)).size,
    offices: new Set(leaders.map((l) => l.office)).size,
    leaders: leaders.length,
  }
}

function dayIndex(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000)
}

export function selectFeaturedOrganization(orgs: Organization[], date: Date): Organization | null {
  if (orgs.length === 0) return null
  return orgs[dayIndex(date) % orgs.length]
}

export function selectUpcomingEvents(events: Event[], now: Date, count: number): Event[] {
  return events
    .filter((e) => new Date(e.date).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count)
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `bun run test`
Expected: PASS (all 7 tests green).

- [ ] **Step 7: Typecheck and commit**

Run: `bunx tsc -b`
Then:
```bash
git add package.json bun.lock vitest.config.ts src/lib/home.ts src/lib/home.test.ts
git commit -m "feat: add tested home-data helpers (stats, featured org, upcoming events)"
```

---

### Task 2: Base CSS — texture, reveal, focus ring, reduced motion

**Files:**
- Modify: `src/index.css` (append below existing `@theme` and base blocks)

**Interfaces:**
- Consumes: existing `@theme` tokens.
- Produces: utility classes `.reveal` / `.reveal-visible`; global `:focus-visible` stitch ring; reduced-motion reset. Consumed by `Reveal.tsx` (Task 4) and every section.

- [ ] **Step 1: Append base interaction + motion CSS**

Add to the end of `src/index.css`:
```css
/* Focus ring — stitch-dash pattern (design system §5.D) */
:focus-visible {
  outline: 3px dashed var(--color-stitch-gray);
  outline-offset: 3px;
}

/* Scroll reveal: content fades up 20px over 600ms ease-out (design system §6) */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
  will-change: opacity, transform;
}
.reveal-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Verify build compiles the CSS**

Run: `bunx tsc -b && bun run build`
Expected: build succeeds, no CSS errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add reveal, stitch focus ring, and reduced-motion base styles"
```

---

### Task 3: Wire HelmetProvider

**Files:**
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: `<Helmet>` support available app-wide, consumed by `Home.tsx` (Task 15).

- [ ] **Step 1: Add HelmetProvider around the app**

In `src/main.tsx`, add the import and wrap `<BrowserRouter>`:
```tsx
import { HelmetProvider } from 'react-helmet-async'
```
Change the render tree so `HelmetProvider` wraps `QueryClientProvider` (outermost inside StrictMode):
```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "feat: wire HelmetProvider for per-page SEO"
```

---

### Task 4: UI primitives — Button, Reveal, FabricTexture

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Reveal.tsx`
- Create: `src/components/ui/FabricTexture.tsx`

**Interfaces:**
- Consumes: `cn` from `../../lib/utils`; `cva` from `class-variance-authority`.
- Produces:
  - `Button` — props: `variant?: 'primary' | 'secondary'`, plus native `<button>` or, when `asChild`, renders an anchor via `@radix-ui/react-slot`. Signature: `({ variant, className, ...props }: ButtonProps)`. Keep it simple: support `as` link usage by exporting a `buttonClasses(variant)` helper too.
  - `Reveal` — props: `{ as?: 'div' | 'section'; delay?: number; className?; children }`. Wraps children, applies `.reveal` then `.reveal-visible` when scrolled into view.
  - `useInView(options?: IntersectionObserverInit): [ref, inView]`.
  - `FabricTexture` — zero-prop fixed grain overlay.

- [ ] **Step 1: Implement `Button.tsx`**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium transition-transform transition-colors duration-300 hover:-translate-y-0.5 active:translate-y-0 px-8 py-3 text-base whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-trust-blue text-linen-white hover:bg-thread-green',
        secondary: 'border-2 border-trust-blue text-trust-blue hover:border-thread-red hover:text-thread-red',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}
```

Note: for link-styled CTAs use `<Link className={buttonVariants({ variant })}>` directly from the section (react-router `Link`); do not fight the type system with polymorphic props.

- [ ] **Step 2: Implement `Reveal.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

export function useInView(options?: IntersectionObserverInit): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, ...options },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, inView]
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={cn('reveal', inView && 'reveal-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Implement `FabricTexture.tsx`**

```tsx
// Subtle woven-linen grain, per design system §1 (canvas texture at low opacity).
// Fixed + pointer-events-none so it never triggers repaints on scroll (taste §6.E).
const TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function FabricTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-multiply"
      style={{ backgroundImage: TEXTURE }}
    />
  )
}
```

- [ ] **Step 4: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui
git commit -m "feat: add Button, Reveal (IntersectionObserver), and FabricTexture primitives"
```

---

### Task 5: Home data hooks

**Files:**
- Create: `src/hooks/useHomeData.ts`

**Interfaces:**
- Consumes: `useOrganizations`, `useLeadership`, `useEvents` (existing, each returns a TanStack `UseQueryResult` of `Organization[]` / `Leader[]` / `Event[]`); helpers from `src/lib/home.ts` (Task 1).
- Produces:
  - `useHomeStats(): { stats: HomeStats; isLoading: boolean }`
  - `useFeaturedOrganization(): { organization: Organization | null; isLoading: boolean }`
  - `useUpcomingEvents(count?: number): { events: Event[]; isLoading: boolean }`

- [ ] **Step 1: Implement the hooks**

```tsx
import { useOrganizations } from './useOrganizations'
import { useLeadership } from './useLeadership'
import { useEvents } from './useEvents'
import { deriveHomeStats, selectFeaturedOrganization, selectUpcomingEvents, type HomeStats } from '../lib/home'

export function useHomeStats(): { stats: HomeStats; isLoading: boolean } {
  const orgs = useOrganizations()
  const leaders = useLeadership()
  return {
    stats: deriveHomeStats(orgs.data ?? [], leaders.data ?? []),
    isLoading: orgs.isLoading || leaders.isLoading,
  }
}

export function useFeaturedOrganization() {
  const orgs = useOrganizations()
  return {
    organization: selectFeaturedOrganization(orgs.data ?? [], new Date()),
    isLoading: orgs.isLoading,
  }
}

export function useUpcomingEvents(count = 3) {
  const events = useEvents()
  return {
    events: selectUpcomingEvents(events.data ?? [], new Date(), count),
    isLoading: events.isLoading,
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHomeData.ts
git commit -m "feat: add home data hooks composing queries and pure helpers"
```

---

### Task 6: Navbar

**Files:**
- Create: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `navItems` from `../../config/navigation`; `NavLink`/`Link` from react-router-dom; `Menu`, `X` from lucide-react; `siteConfig` from `../../config/site`; `cn` from `../../lib/utils`.
- Produces: `<Navbar />`, consumed by `Home.tsx`.

Design: single-line desktop bar (height 72px, `h-18`), logo left, links right with active thread-underline (2px `thread-red`); on scroll the bar is already `bg-linen-white` with a soft tinted shadow (static, no scroll listener — keep it always-elevated to avoid a scroll handler). Mobile: hamburger opens a full-screen overlay with stitch-line dividers between items.

- [ ] **Step 1: Implement Navbar**

```tsx
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { cn } from '../../lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-linen-white/95 shadow-[0_2px_16px_rgba(46,74,143,0.06)] backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="font-display text-xl font-black tracking-[-0.02em] text-trust-blue">
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red',
                    isActive && 'border-b-2 border-thread-red pb-1',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden text-trust-blue"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu strokeWidth={1.75} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-canvas-cream md:hidden">
          <div className="flex h-18 items-center justify-between px-6">
            <span className="font-display text-xl font-black text-trust-blue">{siteConfig.name}</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="text-trust-blue">
              <X strokeWidth={1.75} />
            </button>
          </div>
          <ul className="flex flex-col px-6">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-dashed border-stitch-gray/50">
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-lg font-medium text-trust-blue"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
```

Note: `h-18` = 72px. If Tailwind v4 lacks `h-18`, use `h-[72px]`.

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add responsive navbar with active thread-underline and mobile sheet"
```

---

### Task 7: Hero section

**Files:**
- Create: `src/components/home/Hero.tsx`

**Interfaces:**
- Consumes: `Link` from react-router-dom; `buttonVariants` from `../ui/Button`; `EmbroideredAccent`; `ThreadBorder`; `hoopFrames` from `../../lib/assets`; `Reveal`.
- Produces: `<Hero />`.

Layout: asymmetric split, `min-h-[100dvh]`, text column left, embroidery-hoop framed asset right. Hero stack = 4 elements max: badge (eyebrow #1), headline (2 lines), subtext, CTAs (primary + secondary). No tagline strip, no scroll cue.

- [ ] **Step 1: Implement Hero**

```tsx
import { Link } from 'react-router-dom'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadBorder } from '../ThreadBorder'
import { Reveal } from '../ui/Reveal'
import { hoopFrames } from '../../lib/assets'

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-canvas-cream">
      <ThreadBorder color="purple" edge="top" className="absolute left-6 top-24 hidden lg:block" />

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="flex flex-col gap-6 text-center lg:text-left">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-linen-white px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.14em] text-trust-blue shadow-[0_4px_20px_rgba(46,74,143,0.06)] lg:mx-0">
            Council of the Organizations of the Ateneo - Zamboanga
          </span>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-trust-blue md:text-5xl lg:text-6xl">
            Empowering Student Organizations. Inspiring Collaborative Leadership.
          </h1>

          <p className="mx-auto max-w-[60ch] font-body text-lg leading-relaxed text-fabric-dark lg:mx-0">
            The official alliance of all accredited college organizations of Ateneo de Zamboanga
            University, strengthening collaboration and empowering student leaders to create meaningful impact.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
            <Link to="/organizations" className={buttonVariants({ variant: 'primary' })}>
              Explore Organizations
            </Link>
            <Link to="/about" className={buttonVariants({ variant: 'secondary' })}>
              Learn More About COA-Z
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto w-full max-w-md">
          <img
            src={hoopFrames[0]}
            alt="Embroidery hoop stretched with linen canvas, symbolizing the COA-Z community fabric"
            width={1200}
            height={1200}
            loading="eager"
            className="h-auto w-full"
          />
          <EmbroideredAccent color="yellow" index={0} size={64} className="absolute -left-4 top-8" />
          <EmbroideredAccent color="pink" index={0} size={56} className="absolute -right-2 bottom-10" />
        </Reveal>
      </div>
    </section>
  )
}
```

Note: the subtext is a trimmed 2-sentence version (≤ the hero ≤ 4-line / ≤ ~35-word cap). The full paragraph from the brief lives in the About section. The badge is the hero's single eyebrow.

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Hero.tsx
git commit -m "feat: add asymmetric split hero with hoop asset and embroidered accents"
```

---

### Task 8: Quick Statistics section

**Files:**
- Create: `src/components/home/QuickStats.tsx`

**Interfaces:**
- Consumes: `useHomeStats` (Task 5); `Reveal`; `ThreadDivider`.
- Produces: `<QuickStats />`.

Layout: stat band (NOT boxed cards). Four stats in a row on desktop, 2×2 on mobile, separated by vertical stitch dividers. Big Made Tommy numerals in Trust Blue, label in Stitch Gray below. Loading = skeleton bar; empty data renders `0`.

- [ ] **Step 1: Implement QuickStats**

```tsx
import { useHomeStats } from '../../hooks/useHomeData'
import { Reveal } from '../ui/Reveal'

const LABELS = [
  { key: 'organizations', label: 'Accredited Organizations' },
  { key: 'clusters', label: 'Organization Clusters' },
  { key: 'offices', label: 'Executive Offices' },
  { key: 'leaders', label: 'Student Leaders' },
] as const

export function QuickStats() {
  const { stats, isLoading } = useHomeStats()

  return (
    <section className="bg-linen-white py-16 md:py-20">
      <Reveal className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-6 md:grid-cols-4 md:divide-x md:divide-dashed md:divide-stitch-gray/40">
        {LABELS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2 px-4 text-center">
            {isLoading ? (
              <span className="h-12 w-16 animate-pulse rounded-[8px] bg-stitch-gray/20" aria-hidden />
            ) : (
              <span className="font-display text-5xl font-black tracking-[-0.02em] text-trust-blue">
                {stats[key]}
              </span>
            )}
            <span className="font-body text-sm font-medium text-stitch-gray">{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/QuickStats.tsx
git commit -m "feat: add quick statistics band with loading skeletons"
```

---

### Task 9: About section

**Files:**
- Create: `src/components/home/AboutSection.tsx`

**Interfaces:**
- Consumes: `Link`; `buttonVariants`; `EmbroideredAccent`; `ThreadDivider`; `Reveal`.
- Produces: `<AboutSection />`.

Layout family: editorial prose block (single column, `max-w-[65ch]`, left-aligned) with a green flower side accent and a stitch divider. Distinct from the Featured spotlight. Green thread color. CTA "Learn More" links to `/about`.

- [ ] **Step 1: Implement AboutSection**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { ThreadDivider } from '../ThreadDivider'
import { Reveal } from '../ui/Reveal'

export function AboutSection() {
  return (
    <section className="relative bg-canvas-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="relative mx-auto max-w-[68ch]">
          <EmbroideredAccent color="green" index={0} size={56} className="absolute -left-6 -top-10 hidden md:block" />

          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Building a Stronger Community of Student Organizations
          </h2>

          <ThreadDivider flowerColor="green" className="my-8 max-w-xs" />

          <div className="flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            <p>
              COA-Z serves as the collective voice of accredited student organizations in Ateneo de
              Zamboanga University. By fostering collaboration, supporting organizational initiatives,
              and representing the interests of its member organizations, the council helps create
              opportunities for leadership, service, and holistic student formation.
            </p>
            <p>
              Rather than working independently, organizations become part of a united community that
              shares resources, develops future leaders, and contributes to a more vibrant Ateneo
              experience.
            </p>
          </div>

          <Link to="/about" className={`${buttonVariants({ variant: 'secondary' })} mt-8`}>
            Learn More
            <ArrowRight size={18} strokeWidth={1.75} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/AboutSection.tsx
git commit -m "feat: add About COA-Z editorial section"
```

---

### Task 10: Our Purpose section (2×2 bento)

**Files:**
- Create: `src/components/home/PurposeSection.tsx`

**Interfaces:**
- Consumes: `EmbroideredAccent`; `Reveal`; `type ThreadColor` from `../../lib/assets`; `cn`.
- Produces: `<PurposeSection />`.

Layout family: bento 2×2, four cells (exact count = 4 items). Each cell `bg-linen-white rounded-[8px]` with a distinct thread-color flower corner accent and a top hover-stitch border. Section heading "What We Do" with the second permitted eyebrow ("Our Purpose").

- [ ] **Step 1: Implement PurposeSection**

```tsx
import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'
import type { ThreadColor } from '../../lib/assets'

interface Purpose {
  title: string
  body: string
  color: ThreadColor
}

const PURPOSES: Purpose[] = [
  { title: 'Represent', body: 'Advocate for the welfare, interests, and voices of accredited student organizations within the university.', color: 'red' },
  { title: 'Support', body: 'Provide guidance, administrative assistance, and essential resources that strengthen organizational operations.', color: 'blue' },
  { title: 'Develop', body: 'Promote leadership formation, organizational growth, and the continuous development of student leaders.', color: 'green' },
  { title: 'Connect', body: 'Create opportunities for collaboration among organizations, university offices, and external partners.', color: 'purple' },
]

export function PurposeSection() {
  return (
    <section className="bg-canvas-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-12 text-center">
          <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-thread-purple">
            Our Purpose
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            What We Do
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PURPOSES.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <article className="group relative h-full overflow-hidden rounded-[8px] border border-trust-blue/10 bg-linen-white p-8 shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
                <EmbroideredAccent color={p.color} index={0} size={44} className="absolute right-5 top-5 opacity-90" />
                <h3 className="font-display text-2xl font-bold text-trust-blue">{p.title}</h3>
                <p className="mt-3 max-w-[42ch] font-body leading-relaxed text-fabric-dark">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/PurposeSection.tsx
git commit -m "feat: add Our Purpose 2x2 bento with thread-color accents"
```

---

### Task 11: Featured Organization section

**Files:**
- Create: `src/components/home/FeaturedOrganization.tsx`

**Interfaces:**
- Consumes: `useFeaturedOrganization` (Task 5); `Link`; `buttonVariants`; `hoopFrames`; `EmbroideredAccent`; `Reveal`.
- Produces: `<FeaturedOrganization />`.

Layout family: framed spotlight — hoop-framed org logo left, metadata (name, cluster, description, link) right. Pink thread color. States: loading skeleton; if `organization` is null, render nothing (section hidden) so an empty Contentful space does not show a broken block.

- [ ] **Step 1: Implement FeaturedOrganization**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFeaturedOrganization } from '../../hooks/useHomeData'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'
import { hoopFrames } from '../../lib/assets'

export function FeaturedOrganization() {
  const { organization, isLoading } = useFeaturedOrganization()

  if (!isLoading && !organization) return null

  return (
    <section className="bg-linen-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Organization Spotlight
          </h2>
        </Reveal>

        <Reveal className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-sm">
            <img
              src={hoopFrames[2]}
              alt=""
              role="presentation"
              width={1200}
              height={1200}
              loading="lazy"
              className="h-auto w-full"
            />
            {isLoading ? (
              <span className="absolute inset-1/4 animate-pulse rounded-full bg-stitch-gray/20" aria-hidden />
            ) : organization?.logo ? (
              <img
                src={organization.logo}
                alt={`${organization.name} logo`}
                className="absolute left-1/2 top-1/2 w-2/5 -translate-x-1/2 -translate-y-1/2 object-contain"
                loading="lazy"
              />
            ) : null}
            <EmbroideredAccent color="pink" index={0} size={52} className="absolute -right-3 top-6" />
          </div>

          <div className="flex flex-col gap-4 text-center md:text-left">
            {isLoading ? (
              <>
                <span className="mx-auto h-8 w-56 animate-pulse rounded-[8px] bg-stitch-gray/20 md:mx-0" />
                <span className="mx-auto h-4 w-32 animate-pulse rounded-[8px] bg-stitch-gray/20 md:mx-0" />
              </>
            ) : organization ? (
              <>
                <h3 className="font-display text-3xl font-bold text-trust-blue">{organization.name}</h3>
                <span className="font-accent text-2xl text-thread-pink">{organization.cluster.name}</span>
                <p className="max-w-[52ch] font-body leading-relaxed text-fabric-dark">
                  {organization.description}
                </p>
                <Link
                  to={`/organizations/${organization.slug}`}
                  className={`${buttonVariants({ variant: 'secondary' })} mt-2 self-center md:self-start`}
                >
                  View Organization
                  <ArrowRight size={18} strokeWidth={1.75} />
                </Link>
              </>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/FeaturedOrganization.tsx
git commit -m "feat: add rotating featured organization spotlight"
```

---

### Task 12: Upcoming Events section

**Files:**
- Create: `src/components/home/UpcomingEvents.tsx`

**Interfaces:**
- Consumes: `useUpcomingEvents` (Task 5); `Link`; `EmbroideredAccent`; `Reveal`; `MapPin`, `Calendar`, `ArrowRight` from lucide-react.
- Produces: `<UpcomingEvents />`.

Layout family: event card grid (up to 3 cells, exact = number of events). Each card: banner image, title, formatted date, venue, short description, "Learn More" link. States: loading skeletons; empty (no upcoming events) renders a composed empty state with a yellow flower and a line of copy. Note: `Event` type has no `venue` field, so venue is omitted gracefully (do not fabricate). Yellow thread color.

- [ ] **Step 1: Implement UpcomingEvents**

```tsx
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { useUpcomingEvents } from '../../hooks/useHomeData'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function UpcomingEvents() {
  const { events, isLoading } = useUpcomingEvents(3)

  return (
    <section className="bg-canvas-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-trust-blue md:text-4xl">
            Upcoming Activities
          </h2>
        </Reveal>

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
        ) : events.length === 0 ? (
          <Reveal className="flex flex-col items-center gap-4 py-8 text-center">
            <EmbroideredAccent color="yellow" index={1} size={56} />
            <p className="font-body text-lg text-stitch-gray">
              New activities are being woven together. Check back soon.
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-[8px] bg-linen-white shadow-[0_4px_20px_rgba(46,74,143,0.06)]">
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
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

Note: `line-clamp-3` requires the `@tailwindcss/line-clamp` behavior, which is built into Tailwind v4 core. If it does not apply, use `overflow-hidden` with a max height.

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/UpcomingEvents.tsx
git commit -m "feat: add upcoming events card grid with loading and empty states"
```

---

### Task 13: Call to Action section

**Files:**
- Create: `src/components/home/HomeCTA.tsx`

**Interfaces:**
- Consumes: `Link`; `buttonVariants`; `ThreadBorder`; `EmbroideredAccent`; `Reveal`.
- Produces: `<HomeCTA />`.

Layout family: full-width color band (Trust Blue background, Linen White text), centered manifesto. Red thread accent. This is the single primary-intent CTA of the page ("Explore Organizations"); it shares the same label as the hero primary CTA, which is correct (one label per intent, §4.5), not a duplicate-intent violation.

- [ ] **Step 1: Implement HomeCTA**

```tsx
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '../ui/Button'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { Reveal } from '../ui/Reveal'

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-trust-blue py-24 md:py-28">
      <EmbroideredAccent color="red" index={0} size={72} className="absolute left-8 top-10 opacity-70" />
      <EmbroideredAccent color="yellow" index={2} size={64} className="absolute bottom-10 right-10 opacity-70" />

      <Reveal className="mx-auto flex max-w-[800px] flex-col items-center gap-6 px-6 text-center">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-linen-white md:text-4xl">
          Discover the Organizations That Make Ateneo Thrive
        </h2>
        <p className="max-w-[60ch] font-body text-lg leading-relaxed text-linen-white/85">
          From academic and professional organizations to cultural, socio-civic, faith-based, and
          environmental groups, COA-Z brings together diverse communities that shape student life at
          Ateneo de Zamboanga University. Explore their advocacies and discover ways to get involved.
        </p>
        <Link
          to="/organizations"
          className={`${buttonVariants({ variant: 'primary' })} bg-linen-white text-trust-blue hover:bg-thread-yellow hover:text-fabric-dark`}
        >
          Explore Organizations
          <ArrowRight size={18} strokeWidth={1.75} />
        </Link>
      </Reveal>
    </section>
  )
}
```

Note: the CTA button overrides to Linen White bg + Trust Blue text for contrast on the blue band (WCAG AA verified: #FAF8F5 on #2E4A8F, and text #2E4A8F on #FAF8F5, both > 4.5:1).

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HomeCTA.tsx
git commit -m "feat: add full-width CTA band"
```

---

### Task 14: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `Link`; `navItems`; `siteConfig`; `Mail`, `Facebook`, `Instagram` from lucide-react; `EmbroideredAccent`.
- Produces: `<Footer />`.

Layout family: multi-column footer on a linen surface with a top thread border. Columns: brand blurb, Quick Links (nav), Contact (email + socials). Copyright row. Blue thread color. Uses `siteConfig.socialLinks` (may be empty strings — render a link only when the value is non-empty).

- [ ] **Step 1: Implement Footer**

```tsx
import { Link } from 'react-router-dom'
import { Mail, Facebook, Instagram } from 'lucide-react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { EmbroideredAccent } from '../EmbroideredAccent'

export function Footer() {
  const year = new Date().getFullYear()
  const { facebook, instagram } = siteConfig.socialLinks

  return (
    <footer className="border-t border-dashed border-stitch-gray/40 bg-linen-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="font-display text-lg font-black text-trust-blue">
            Council of the Organizations of the Ateneo - Zamboanga
          </span>
          <EmbroideredAccent color="blue" index={0} size={40} />
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-trust-blue">Quick Links</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="font-body text-fabric-dark transition-colors hover:text-thread-red">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-trust-blue">Contact</h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a href="mailto:info@coaz.org" className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red">
                <Mail size={18} strokeWidth={1.75} />
                Email
              </a>
            </li>
            {facebook && (
              <li>
                <a href={facebook} className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red">
                  <Facebook size={18} strokeWidth={1.75} />
                  Facebook
                </a>
              </li>
            )}
            {instagram && (
              <li>
                <a href={instagram} className="inline-flex items-center gap-2 font-body text-fabric-dark transition-colors hover:text-thread-red">
                  <Instagram size={18} strokeWidth={1.75} />
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-dashed border-stitch-gray/40">
        <p className="mx-auto max-w-[1200px] px-6 py-6 text-center font-body text-sm text-stitch-gray">
          {`© ${year} Council of the Organizations of the Ateneo - Zamboanga. All Rights Reserved.`}
        </p>
      </div>
    </footer>
  )
}
```

Note: `mailto:info@coaz.org` is a placeholder address; replace with the real COA-Z email when available (do not invent a different one).

- [ ] **Step 2: Typecheck and lint**

Run: `bunx tsc -b && bun run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add site footer with quick links and contact"
```

---

### Task 15: Compose Home page + SEO + full verification

**Files:**
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: every section component (Tasks 6-14); `Helmet` from react-helmet-async; `defaultSeo` from `../config/seo`; `FabricTexture`.
- Produces: the finished `/` route.

- [ ] **Step 1: Implement Home composition**

```tsx
import { Helmet } from 'react-helmet-async'
import { defaultSeo } from '../config/seo'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { FabricTexture } from '../components/ui/FabricTexture'
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
      <Helmet>
        <title>{defaultSeo.title}</title>
        <meta name="description" content={defaultSeo.description} />
        <meta property="og:title" content={defaultSeo.og.title} />
        <meta property="og:description" content={defaultSeo.og.description} />
        <meta name="twitter:card" content={defaultSeo.twitter.card} />
      </Helmet>

      <FabricTexture />
      <Navbar />
      <main className="relative z-[2]">
        <Hero />
        <QuickStats />
        <AboutSection />
        <PurposeSection />
        <FeaturedOrganization />
        <UpcomingEvents />
        <HomeCTA />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Full typecheck, lint, build**

Run: `bunx tsc -b && bun run lint && bun run build`
Expected: all PASS, production build emits.

- [ ] **Step 3: Browser verification**

Run: `bun run dev`, open the served URL. Confirm:
- Fonts load: headings render in Made Tommy (rounded geometric), cluster/accent text in Omegle.
- All eight blocks render top to bottom; navbar sticky; footer present.
- Stats show `0` (Contentful stubs return empty) with no layout shift; Featured section is hidden (null org); Events shows the empty state.
- No console errors; no horizontal scrollbar at 375px, 768px, 1280px.
- Toggle OS "reduce motion": reveals show instantly, nothing animates.
- Tab through the page: stitch-dashed focus ring visible on links/buttons.

- [ ] **Step 4: Pre-Flight self-audit (design-taste-frontend §14)**

Confirm each: zero em/en-dashes in visible copy; one light theme; Trust Blue accent consistent; radius lock (pill buttons, 8px cards); every CTA readable (AA); no CTA wraps at desktop; eyebrow count ≤ 3 (Hero badge, Our Purpose, and none other → 2, within budget); ≥ 4 distinct layout families; no 3 consecutive image+text splits; hero ≤ 2-line headline + short subtext, no scroll cue; real images (hoops/flowers/Contentful), no div fake screenshots; loading + empty states present; lucide icons only. Fix any miss before committing.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: compose COA-Z home landing page with SEO"
```

---

## Self-Review (against the content brief)

- **Navigation** → Task 6 (navbar) + Task 14 (footer quick links). Covered.
- **Hero: badge, heading, description, two primary actions** → Task 7. Covered (description trimmed for hero cap; full text in About).
- **Quick Statistics (4 stats, dynamic from Contentful)** → Tasks 1 (derivation) + 8 (band). Covered.
- **About COA-Z (heading, 2 paragraphs, Learn More CTA)** → Task 9. Covered.
- **Our Purpose (What We Do, 4 cards)** → Task 10. Covered.
- **Featured Organization (spotlight, rotates, Contentful)** → Tasks 1 (rotation) + 11. Covered.
- **Upcoming Events (next 2-3, card fields)** → Tasks 1 (selection) + 12. Covered. Note: `venue` is not on the `Event` type; omitted rather than fabricated. If venue is required, the `Event` type + Contentful mapper must add it (out of scope for this plan; flag to user).
- **Call to Action (heading, description, button)** → Task 13. Covered.
- **Footer (brand, quick links, contact, socials, copyright)** → Task 14. Covered.
- **Design system fidelity** (colors, fonts, thread borders, embroidered accents, stitch dividers, cards, buttons, motion, reduced-motion, a11y) → Tasks 2, 4, and every section. Covered.

**Open items to confirm with the user (do not block the plan):**
1. Real COA-Z contact email and social URLs (footer currently uses a placeholder mailto + `siteConfig.socialLinks`, which are empty strings).
2. Whether `Event` needs a `venue` field (brief lists venue on event cards; type lacks it).
3. Font licensing: "Made Tommy" and "Omegle" files are marked PERSONAL USE. Confirm a commercial license before public launch.
