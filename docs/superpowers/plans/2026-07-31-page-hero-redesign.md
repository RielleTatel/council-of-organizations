# Page Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bland, empty-feeling page heroes (About, Leadership, Organizations, Events) with a single enriched, on-brand hero header that borrows the landing hero's decorative vocabulary at a calmer intensity.

**Architecture:** Enrich the one shared `PageHeader` component so About / Leadership / Organizations upgrade for free (they already consume it). Add an `ink` variant (trust-blue background, inverted text) so the one-off Events hero collapses into the same component. Extract the decorative layer into `PageHeaderDecor` and a deterministic `heroAccents()` placement helper (pure, unit-tested) so the ambient flowers stay balanced and stable across reloads instead of random-per-render.

**Tech Stack:** React 19 + TypeScript, Tailwind v4 (`@theme` tokens), framer-motion, vitest (node env). Reuses existing `ThreadBorder`, `ThreadDivider`, `EmbroideredAccent`, `FloatingAccent`, `SectionGlow`, `Reveal`.

## Global Constraints

- **Design system authority:** `docs/COA-Z_Interwoven_Beyond_Design_System.md`. Every visual decision traces to it.
- **60/30/10 color rule:** ~60% Canvas Cream `#F5F0E8` / Linen White `#FAF8F5`, ~30% Trust Blue `#2E4A8F`, ~10% thread accents. **Never more than 2–3 thread accent colors in a single viewport** (§2). Thread colors appear "woven together, not scattered randomly."
- **Threads frame, never fight:** decorative threads/flowers guide the eye inward toward the content and must never overlap or obscure the heading/description text (§1, §12).
- **Whitespace is fabric:** empty space should read as intentional untouched cloth, not dead space — achieved via framing (woven edges + corner motifs + glow), not by cramming decoration (§1, §12).
- **Motion is organic + slow:** ambient drift only, `ease-in-out`, multi-second durations. No fast/bouncy/mechanical motion (§6, §12).
- **Reduced motion:** every animated element must be guarded by `useReducedMotion()` (framer) or the global `prefers-reduced-motion` CSS. Existing wrappers (`FloatingAccent`, `Reveal`) already handle this — rely on them.
- **Mobile = minimal accents (§9):** ambient side-margin flowers and corner circles are desktop-only (`hidden lg:block`); the top woven edge + text remain on mobile.
- **A11y (§10):** all decorative imagery `aria-hidden` / `role="presentation"` with empty alt; single `<h1>` per header; text meets WCAG AA (Trust Blue on Cream and Linen White on Trust Blue both pass).
- **Determinism:** no `Math.random()` in render paths. `EmbroideredAccent` and `ThreadBorder` already accept an explicit `index` — always pass one from the hero so placement is stable.
- **Typography (§3):** display face, `font-bold`, `-0.02em` tracking, `leading-[1.1]` on the `<h1>`; body copy `text-lg leading-relaxed`, max ~60ch.

---

## Reference: what makes the landing hero (`src/components/home/Hero.tsx`) work

Port these devices (at lower intensity — a page header is not a full-viewport hero):
- **Woven thread borders** bleeding off the section edge (`ThreadBorder`, §5.A signature element).
- **Dashed stitch-circle corner motifs** (`Hero.tsx:71-84`) — large dashed circles half-off the corners give depth and a "frame."
- **Scattered drifting embroidered flowers** in the margins (`Hero.tsx:93-162`) — low opacity, slow float, 2–3 balanced colors.
- **Soft radial glow** behind the content (`SectionGlow`) so the title sits on depth, not flat color.
- **Staggered fade-up reveal** (`Reveal` already wraps the text).

**Out of scope (do NOT port):** full `100dvh` height, pointer-parallax, the logo centerpiece, the multi-second `delayChildren` load sequence. Page headers must stay compact and quick.

---

## File Structure

- **Create** `src/lib/heroAccents.ts` — pure deterministic accent-placement helper (`AccentSpec`, `heroAccents()`).
- **Create** `src/lib/heroAccents.test.ts` — unit tests for the helper (node env).
- **Create** `src/components/shared/PageHeaderDecor.tsx` — the decorative layer (thread borders, corner circles, glow, drifting flowers). Keeps `PageHeader` readable.
- **Modify** `src/components/shared/PageHeader.tsx` — compose the decor layer, add `variant` prop, refine layout/type, invert colors for `ink`.
- **Modify** `src/pages/Events.tsx` — replace the one-off blue `<section>` header with `<PageHeader variant="ink" … />`; drop now-unused header imports.
- **Modify** `src/pages/About.tsx`, `src/pages/Organizations.tsx` — (optional polish) pass an `emblem` accent so all headers share the emblem treatment Leadership already uses. No structural change.
- **Cleanup** `src/components/home/Hero.tsx` — remove the leftover TEMP DEBUG badge (`Hero.tsx:60-63`) that currently renders on the live landing hero.

---

### Task 1: Deterministic accent-placement helper

**Files:**
- Create: `src/lib/heroAccents.ts`
- Test: `src/lib/heroAccents.test.ts`

**Interfaces:**
- Consumes: `ThreadColor` from `src/lib/assets.ts`.
- Produces:
  - `interface AccentSpec { color: ThreadColor; size: number; side: 'left' | 'right'; top: number; inset: number; duration: number; delay: number; distance: number; rotate: number }`
  - `function heroAccents(accent: ThreadColor): AccentSpec[]` — returns exactly 3 specs.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/heroAccents.test.ts
import { describe, it, expect } from 'vitest'
import { heroAccents } from './heroAccents'
import type { ThreadColor } from './assets'

const ALL: ThreadColor[] = ['red', 'blue', 'green', 'yellow', 'pink', 'purple']

describe('heroAccents', () => {
  it('is deterministic for the same accent', () => {
    expect(heroAccents('blue')).toEqual(heroAccents('blue'))
  })

  it('returns exactly 3 balanced accents including the primary', () => {
    for (const c of ALL) {
      const specs = heroAccents(c)
      expect(specs).toHaveLength(3)
      expect(specs.some((s) => s.color === c)).toBe(true)
    }
  })

  it('never uses more than 3 distinct colors (design system §2)', () => {
    for (const c of ALL) {
      const colors = new Set(heroAccents(c).map((s) => s.color))
      expect(colors.size).toBeLessThanOrEqual(3)
    }
  })

  it('keeps every accent inside the side margins and band', () => {
    for (const c of ALL) {
      for (const s of heroAccents(c)) {
        expect(['left', 'right']).toContain(s.side)
        expect(s.top).toBeGreaterThanOrEqual(0)
        expect(s.top).toBeLessThanOrEqual(100)
        expect(s.inset).toBeGreaterThanOrEqual(0)
        expect(s.inset).toBeLessThanOrEqual(15)
      }
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/heroAccents.test.ts`
Expected: FAIL with "Failed to resolve import './heroAccents'".

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/heroAccents.ts
import type { ThreadColor } from './assets'

export interface AccentSpec {
  color: ThreadColor
  size: number
  /** Which margin the accent floats in. */
  side: 'left' | 'right'
  /** Vertical position within the header band, % from top. */
  top: number
  /** Horizontal inset from the edge, % of band width (kept small → stays in margin). */
  inset: number
  duration: number
  delay: number
  distance: number
  rotate: number
}

/**
 * Two supporting hues per primary that "weave together" with it (design system
 * §2: never more than 2–3 accents, woven not scattered). Analogous/adjacent
 * picks keep each viewport harmonious rather than rainbow.
 */
const COMPANIONS: Record<ThreadColor, [ThreadColor, ThreadColor]> = {
  blue: ['green', 'yellow'],
  red: ['pink', 'yellow'],
  green: ['blue', 'yellow'],
  yellow: ['green', 'pink'],
  pink: ['purple', 'blue'],
  purple: ['pink', 'blue'],
}

/**
 * Deterministic set of 3 ambient embroidered accents framing the centered hero
 * content from the side margins — never overlapping it. Pure (no Math.random)
 * so reloads stay stable and balanced.
 */
export function heroAccents(accent: ThreadColor): AccentSpec[] {
  const [c1, c2] = COMPANIONS[accent]
  return [
    { color: accent, size: 30, side: 'left', top: 24, inset: 6, duration: 6, delay: 0.2, distance: 8, rotate: 6 },
    { color: c1, size: 22, side: 'left', top: 68, inset: 12, duration: 7, delay: 0.5, distance: 7, rotate: -8 },
    { color: c2, size: 26, side: 'right', top: 34, inset: 8, duration: 6.5, delay: 0.35, distance: 9, rotate: 7 },
  ]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/heroAccents.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/heroAccents.ts src/lib/heroAccents.test.ts
git commit -m "feat(hero): deterministic accent-placement helper for page headers"
```

---

### Task 2: Decorative layer component

**Files:**
- Create: `src/components/shared/PageHeaderDecor.tsx`

**Interfaces:**
- Consumes: `heroAccents` + `AccentSpec` (Task 1); `ThreadBorder`, `EmbroideredAccent`, `FloatingAccent`, `SectionGlow`.
- Produces: `function PageHeaderDecor({ accent, variant }: { accent: ThreadColor; variant: 'cream' | 'ink' }): JSX.Element`.

- [ ] **Step 1: Write the component**

```tsx
// src/components/shared/PageHeaderDecor.tsx
import { motion } from 'framer-motion'
import { ThreadBorder } from '../ThreadBorder'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { SectionGlow } from '../ui/SectionGlow'
import { heroAccents } from '../../lib/heroAccents'
import type { ThreadColor } from '../../lib/assets'

interface PageHeaderDecorProps {
  accent: ThreadColor
  variant: 'cream' | 'ink'
}

/** Ambient, non-interactive decoration for a page hero: woven edges, dashed
 *  corner motifs, a soft glow, and drifting embroidered flowers in the margins.
 *  All desktop-only except the top woven edge (design system §9). */
export function PageHeaderDecor({ accent, variant }: PageHeaderDecorProps) {
  const accents = heroAccents(accent)
  const circle = variant === 'ink' ? 'border-linen-white/10' : 'border-stitch-gray/[0.10]'

  return (
    <>
      {/* Woven thread edges — signature element (§5.A) */}
      <ThreadBorder
        color={accent}
        edge="top"
        className="absolute -top-2 left-1/2 w-72 max-w-none -translate-x-1/2 opacity-50"
      />
      <ThreadBorder
        color={accent}
        edge="bottom"
        flip
        className="absolute -bottom-2 left-1/2 hidden w-72 max-w-none -translate-x-1/2 opacity-50 lg:block"
      />

      {/* Dashed stitch-circle corner motifs (mirrors landing hero) — depth + frame */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -right-24 -top-24 hidden h-72 w-72 rounded-full border-2 border-dashed lg:block ${circle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -bottom-20 -left-20 hidden h-64 w-64 rounded-full border-2 border-dashed lg:block ${circle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Soft radial glow so the title sits on depth, not flat color */}
      <SectionGlow className="left-1/2 top-6 -translate-x-1/2" />

      {/* Drifting flowers in the side margins — never over the text (§1) */}
      {accents.map((a, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute hidden lg:block"
          style={{ top: `${a.top}%`, [a.side]: `${a.inset}%` } as React.CSSProperties}
        >
          <FloatingAccent duration={a.duration} delay={a.delay} distance={a.distance} rotate={a.rotate} className="opacity-70">
            <EmbroideredAccent color={a.color} index={0} size={a.size} />
          </FloatingAccent>
        </div>
      ))}
    </>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/PageHeaderDecor.tsx
git commit -m "feat(hero): PageHeaderDecor ambient decoration layer"
```

---

### Task 3: Enrich the shared PageHeader

**Files:**
- Modify: `src/components/shared/PageHeader.tsx`

**Interfaces:**
- Consumes: `PageHeaderDecor` (Task 2); `threadHex` from `src/lib/assets.ts`.
- Produces: `PageHeader` with an added prop `variant?: 'cream' | 'ink'` (default `'cream'`). All existing props (`eyebrow`, `title`, `description`, `accent`, `emblem`, `spacious`) unchanged and backward-compatible.

- [ ] **Step 1: Replace the component body**

Replace the entire contents of `src/components/shared/PageHeader.tsx` with:

```tsx
import { ThreadDivider } from '../ThreadDivider'
import { EmbroideredAccent } from '../EmbroideredAccent'
import { FloatingAccent } from '../ui/FloatingAccent'
import { Reveal } from '../ui/Reveal'
import { PageHeaderDecor } from './PageHeaderDecor'
import { threadHex } from '../../lib/assets'
import { cn } from '../../lib/utils'
import type { ThreadColor } from '../../lib/assets'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  accent?: ThreadColor
  /** Renders a larger floating embroidered emblem above the eyebrow. */
  emblem?: ThreadColor
  /** Extra vertical padding for pages that want a more prominent hero. */
  spacious?: boolean
  /** 'cream' (default) = light canvas; 'ink' = trust-blue band with inverted text. */
  variant?: 'cream' | 'ink'
}

export function PageHeader({
  eyebrow,
  title,
  description,
  accent = 'blue',
  emblem,
  spacious = false,
  variant = 'cream',
}: PageHeaderProps) {
  const ink = variant === 'ink'

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        ink ? 'bg-trust-blue' : 'bg-canvas-cream',
        spacious ? 'pt-32 pb-20 md:pt-40 md:pb-24' : 'pt-28 pb-16 md:pt-32 md:pb-20',
      )}
    >
      <PageHeaderDecor accent={accent} variant={variant} />

      <Reveal className="relative mx-auto max-w-[760px] px-6 text-center">
        {emblem && (
          <FloatingAccent duration={6.5} distance={8} rotate={-6} className="mb-5 flex justify-center">
            <EmbroideredAccent color={emblem} index={0} size={64} />
          </FloatingAccent>
        )}

        {eyebrow && (
          <span
            className={cn(
              'inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.14em]',
              ink ? 'text-linen-white/70' : 'text-stitch-gray',
            )}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: threadHex[accent] }} />
            {eyebrow}
          </span>
        )}

        <h1
          className={cn(
            'mt-4 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] md:text-5xl',
            ink ? 'text-linen-white' : 'text-trust-blue',
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              'mx-auto mt-5 max-w-[60ch] font-body text-lg leading-relaxed',
              ink ? 'text-linen-white/85' : 'text-fabric-dark',
            )}
          >
            {description}
          </p>
        )}

        {!ink && (
          <div className="mt-8 flex items-center justify-center">
            <ThreadDivider flowerColor={accent} className="w-full max-w-xs" />
          </div>
        )}
      </Reveal>
    </section>
  )
}
```

Notes for the implementer:
- `threadHex` is the existing color-lookup in `src/lib/assets.ts` (used across the org board). If the export name differs, grep `assets.ts` for the hex map and use it.
- The `ink` variant intentionally omits the bottom `ThreadDivider` (the woven bottom edge from `PageHeaderDecor` closes the band instead).

- [ ] **Step 2: Verify existing pages still type-check and render**

Run: `npx tsc -b`
Expected: no errors. About / Leadership / Organizations already pass only existing props, so they compile unchanged and pick up the new decoration automatically.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/PageHeader.tsx
git commit -m "feat(hero): enrich shared PageHeader with decoration layer + ink variant"
```

---

### Task 4: Migrate Events to the shared header + emblem polish

**Files:**
- Modify: `src/pages/Events.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/Organizations.tsx`

**Interfaces:**
- Consumes: `PageHeader` with `variant="ink"` (Task 3).

- [ ] **Step 1: Replace the Events one-off header**

In `src/pages/Events.tsx`, replace the entire `<section … bg-trust-blue …>…</section>` hero block (the one containing the "Event Highlights" eyebrow and headline) with:

```tsx
<PageHeader
  variant="ink"
  eyebrow="Event Highlights"
  accent="yellow"
  title="Celebrating student leadership, service, innovation, and the stories that shape the COA-Z community."
/>
```

Add the import at the top:

```tsx
import { PageHeader } from '../components/shared/PageHeader'
```

Then remove imports that the deleted block used and nothing else references. Check each before deleting — `EmbroideredAccent` and `Reveal` are still used lower in the file (empty state / cards), so keep those. `ThreadBorder` and `SectionGlow` were only in the old hero: remove them **only if** `grep -n "ThreadBorder\|SectionGlow" src/pages/Events.tsx` shows no remaining usage.

- [ ] **Step 2: Give About and Organizations the emblem treatment**

Leadership already passes `emblem="red"`. For visual parity, add a matching emblem to the other two.

In `src/pages/About.tsx`, add `emblem="blue"` to its `<PageHeader … />` props.
In `src/pages/Organizations.tsx`, add `emblem="blue"` to its `<PageHeader … />` props.

(Accent colors stay as they are: About/Organizations `blue`, Leadership `red`. This keeps each header to 2–3 woven accent colors.)

- [ ] **Step 3: Type-check + build**

Run: `npx tsc -b && npm run build`
Expected: build succeeds, no unused-import errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Events.tsx src/pages/About.tsx src/pages/Organizations.tsx
git commit -m "feat(hero): adopt shared PageHeader for Events (ink) + emblem parity"
```

---

### Task 5: Cleanup, verification, and finish

**Files:**
- Modify: `src/components/home/Hero.tsx` (remove leftover debug badge)

- [ ] **Step 1: Remove the landing-hero debug badge**

In `src/components/home/Hero.tsx`, delete the TEMP DEBUG block (currently `Hero.tsx:60-63`):

```tsx
{/* TEMP DEBUG — remove after diagnosing mobile motion issue */}
<div className="fixed left-2 top-2 z-[9999] rounded bg-black px-2 py-1 font-mono text-[10px] text-white">
  reducedMotion: {String(shouldReduceMotion)}
</div>
```

- [ ] **Step 2: Full test suite**

Run: `npm test`
Expected: all suites pass (existing 52 + the 4 new `heroAccents` tests).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 4: Visual verification (dev server)**

Run `npm run dev`, then check each hero at desktop width:
- `/about`, `/leadership`, `/organizations` — cream variant: top + bottom woven edges, dashed corner circles, 3 balanced drifting flowers in the margins (not over text), radial glow, emblem flower above eyebrow, accent bullet before eyebrow. Empty space now reads as framed fabric.
- `/events` — ink variant: trust-blue band, linen-white text, yellow woven edge, yellow/green companion flowers, no bottom divider.
- Confirm no decorative element overlaps the heading or description at `lg`, `md`, and mobile widths.
- Confirm mobile (`< lg`): corner circles, bottom edge, and side flowers are hidden; top edge + text remain.
- Toggle OS "reduce motion" and reload: flowers/glow are static, no drift, content still fully visible.

**Environment caveat:** if browser automation cannot truly change `window.innerWidth` (a known limitation in this workspace), verify the responsive classes (`hidden lg:block`) by reading the DOM and note that true device-width confirmation is recommended manually.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Hero.tsx
git commit -m "chore(hero): remove leftover reduced-motion debug badge"
```

- [ ] **Step 6: Finish the branch**

Use superpowers:finishing-a-development-branch to verify the green suite and present integration options. (Session convention: work is on `main`; confirm before any merge/PR step.)

---

## Self-Review

**Spec coverage:**
- "Too much empty space / bland" → framing devices (woven edges, corner circles, glow, margin flowers) turn void into intentional fabric (Tasks 2–3). ✓
- "Reference the landing hero" → explicit device list ported at lower intensity; full-viewport/parallax/logo explicitly excluded (Reference section). ✓
- "Reference the design system" → Global Constraints pin the 60/30/10 rule, 2–3-accent cap, frame-not-fight, organic motion, mobile minimalism, a11y — each cited to a section. ✓
- All four bland heroes covered: three via shared `PageHeader` (free), Events via `variant="ink"` migration (Task 4). ✓

**Placeholder scan:** every code step contains complete, runnable code. No TBD/"add styling here". ✓

**Type consistency:** `AccentSpec`/`heroAccents` (Task 1) consumed by `PageHeaderDecor` (Task 2), consumed by `PageHeader` (Task 3), consumed by pages (Task 4). `variant: 'cream' | 'ink'` identical across `PageHeaderDecor` and `PageHeader`. `threadHex` flagged with a grep-fallback in case the export name differs. ✓
