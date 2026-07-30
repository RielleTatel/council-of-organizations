# RecWeek Interactive Booth Map — Design Spec

Date: 2026-07-30
Status: Approved for planning

## 1. Overview

`src/pages/RecWeek.tsx` is currently a stub (SEO tags only). This spec replaces the
three static floor-plan PNGs in `public/MAPS/` (`BC LOBBY & QUAD.png`,
`C LOBBY & GARDEN.png`, `PASEO DE MARIA.png`) with a fully interactive,
SVG-based booth map experience, per venue, styled to the
**COA-Z "Interwoven Beyond"** design system (`docs/COA-Z_Interwoven_Beyond_Design_System.md`).

The map is a visual companion to a curated organization list — not a GIS tool.
Users pan/zoom to explore, click a card to locate a booth, and see a floating
preview card with organization info. The three reference PNGs stay in
`public/MAPS/` as the source-of-truth layout reference during implementation
(not shown to end users) and can be deleted once the SVGs are verified to match.

## 2. Decisions from brainstorming

- **Icons:** reuse `lucide-react` (already a dependency, used site-wide). Do not
  install `react-icons` — it would duplicate an existing icon library for no
  benefit.
- **New dependency:** `react-zoom-pan-pinch` (pan/zoom/pinch, zoom-to-element).
  `framer-motion` is already installed and covers all animation needs.
- **Unmatched booths:** 11 booths across the three venues don't correspond to
  any entry in `src/data/organizations.ts` (likely guest exhibitors, university
  offices, or federations not tracked as COA-Z member orgs): `APC`, `JUDO`,
  `FABLE`, `ROTARACT`, `PSYCH iCARE`, `ALMS`, `ICPEP`, `NFJPIA`, `GLEE CLUB`,
  `SALT`, `APN`. These render as generic exhibitor booths on the map **and** in
  the sidebar list (acronym only, no description/link/preview-card CTA), so the
  map stays visually complete and accurate to the real floor plan.

## 3. Data layer

New file: `src/data/recweekBooths.ts`

```ts
export type BoothShape = {
  id: string;              // e.g. "bc-isoa" — unique per venue
  orgId?: string;           // FK into organizations.ts `id`, if matched
  acronym: string;          // display label, e.g. "ISOA"
  boothNumber?: string;     // optional, shown on card if venue signage assigns one
  x: number; y: number;     // normalized top-left, 0-100 space relative to venue viewBox
  width: number; height: number;
  rotation?: number;        // degrees, for angled booths (GLEE CLUB/ABV, TAZ/ARTCO)
};

export type Landmark = {
  id: string;
  type: "stage" | "tent" | "pond" | "pathway" | "church" | "statue" | "podium" | "entrance";
  label?: string;
  x: number; y: number; width: number; height: number;
  rotation?: number;
};

export type Venue = {
  id: "bc-lobby-quad" | "c-lobby-garden" | "paseo-de-maria";
  label: string;            // "BC Lobby & Quad"
  viewBox: string;          // SVG viewBox, tuned per venue aspect ratio
  landmarks: Landmark[];
  booths: BoothShape[];
};

export const venues: Venue[];
```

### 3.1 Organization matching (verified against `src/data/organizations.ts`)

| Venue | Acronym | orgId | Notes |
|---|---|---|---|
| BC | ECO WATCH | `the-ecowatch-organization` | |
| BC | APC | — | unmatched, generic booth |
| BC | JUDO | — | unmatched, generic booth |
| BC | FABLE | — | unmatched, generic booth |
| BC | LLHZ | `la-liga-historia-zamboanguena` | |
| BC | JJC | `junior-jaycees-chamber-adzu` | |
| BC | EF Ph | `el-fuente-ph` | |
| BC | IPAdZ | `ipadz` | |
| BC | APN | — | unmatched, generic booth |
| BC | USAD | `usad-adzu` | |
| BC | ROTARACT | — | unmatched, generic booth |
| BC | SADAQAH | `sadaqah` | |
| BC | St. Iggy | — | landmark (statue), not a booth |
| C | PSYCH iCARE | — | unmatched, generic booth |
| C | ALMS | — | unmatched, generic booth |
| C | FAST | `foundation-of-ateneo-student-tutors` | |
| C | ISSOA | `information-security-students-organization` | |
| C | ISOA | `international-studies-organization` | |
| C | JIECEP | `jieep-adzu` | |
| C | SPA | `samahang-pilosopiya-ng-ateneo` | |
| C | SAS | `society-of-ateneo-scholars` | |
| C | AICG | `aicg` | |
| C | ABS | `ateneo-biological-society` | |
| C | ADZU ICES | `adzu-ignatian-civil-engineering-students-organization` | |
| C | ICPEP | — | unmatched, generic booth |
| C | NFJPIA | — | unmatched, generic booth (distinct from JPIA, which has no booth here) |
| C | JMA | `jma-adzu` | |
| C | ADU | `ateneo-debate-union` | |
| C | BEACON | `the-beacon-publications` | |
| C | GLEE CLUB | — | unmatched, generic booth |
| C | ABV | `ateneo-blue-vigors` | |
| C | AE PEP | `ateneo-eagle-pep-squad` | |
| C | AMC | `ateneo-music-club` | |
| C | TAZ | `teatro-ateneo-de-zamboanga` | |
| C | ARTCO | `ateneo-art-company` | |
| Paseo | ACIL | `ateneo-catechetical-instruction-league` | |
| Paseo | ALECS | `ateneo-lectors-society` | |
| Paseo | ALS | `ateneo-liturgical-society` | |
| Paseo | CLC | `christian-life-community-adzu` | |
| Paseo | CFC | `cfc-youth-for-christ-adzu` | |
| Paseo | SKI | `society-of-the-knights-of-ignatius` | |
| Paseo | MSA | `muslim-students-association-adzu` | |
| Paseo | SALT | — | unmatched, generic booth |
| Paseo | PSALM | `psalm-adzu` | |

### 3.2 Layout structure per venue (implementation reference)

Exact SVG coordinates are calibrated during implementation by comparing the
rendered SVG side-by-side against the source PNGs in the browser (dev server),
not fabricated in this doc. Structural layout to preserve:

- **BC Lobby & Quad:** top-to-bottom — entrance dots + tent/stage block with a
  podium, quad booth row (ECO WATCH+APC left, JUDO+FABLE right) beneath the
  tent, "St. Iggy" statue landmark as a divider, then the BC Lobby area with
  two symmetric columns of stacked booth pairs (left: LLHZ/JJC and EF Ph/IPAdZ;
  right: APN/USAD and ROTARACT/SADAQAH).
- **C Lobby & Garden:** top-to-bottom — stage block (top-left) and pond
  landmark (top-right), a garden zone with two rows of paired booths
  (PSYCH iCARE/ALMS, FAST/ISSOA on the left column; ISOA/JIECEP and SPA/SAS
  centered) followed by a second garden row (AICG/ABS and ADZU ICES/ICPEP on
  the left; NFJPIA/JMA on the right), then the C-Lobby zone with ADU/BEACON
  centered and two angled corner booth pairs (GLEE CLUB/ABV bottom-left, angled
  ~-20°; TAZ/ARTCO bottom-right, angled ~20°) plus AE PEP/AMC centered.
- **Paseo de Maria:** a central horizontal "PATHWAY" corridor with a vertical
  side pathway; above it two rows of three-booth clusters (ACIL/ALECS/ALS,
  CLC/CFC/SKI); below it one three-booth cluster (MSA/SALT/PSALM) and a
  diagonal pathway leading to the University Church landmark (bottom-right).

## 4. Component architecture

```
src/pages/RecWeek.tsx                      — page shell; owns activeVenue, selectedBoothId, hoveredBoothId state
src/components/recweek/
  VenueTabs.tsx                            — segmented tab control (3 venues)
  BoothMap.tsx                             — react-zoom-pan-pinch TransformWrapper/TransformComponent, renders <svg>, MapControls, MapLegend
  BoothShape.tsx                           — single booth <motion.g><rect/></motion.g>; hover + selected animation states
  LandmarkShape.tsx                        — non-interactive stage/tent/pond/pathway/church/statue/podium shapes
  MapControls.tsx                          — floating +/-/reset, bottom-right
  MapLegend.tsx                            — compact legend, bottom-left
  OrganizationSidebar.tsx                  — scrollable list; collapses to accordion below `md`
  RecweekOrgCard.tsx                       — acronym, full name (if matched), booth number, color dot
  BoothPreviewCard.tsx                     — floating info card, framer-motion AnimatePresence, appears above map
```

State (`activeVenue`, `selectedBoothId`, `hoveredBoothId`) lives in `RecWeek.tsx`
and flows down as props — the tree is shallow enough that a context/store is
unnecessary.

## 5. Interactions

- **Venue switch:** fade-out current map (framer-motion `AnimatePresence`,
  ~200ms) → swap venue → fade-in new map → zoom/pan resets to 100%/centered.
- **Card hover:** booth gets a light highlight + glow (no pan/zoom) — per spec,
  avoid disruptive motion on hover.
- **Card click:** `transformRef.current.zoomToElement(boothId, scale≈1.6, animationTime=400)`
  (native to `react-zoom-pan-pinch`) pans/zooms to the booth → booth runs the
  scale→glow→pulse→rest sequence (framer-motion, ~0.5s total, no repeat) →
  `BoothPreviewCard` fades in above the map with org name, venue, booth number,
  and a "View Organization" link (routes to the existing org detail view/page
  if one exists, else the organizations directory anchored to that org).
- **Generic (unmatched) booths:** clicking still highlights + centers the
  booth, but the preview card shows only the acronym and "Exhibitor" — no
  description or link.
- **Zoom limits:** 100%–300%, wheel/pinch/drag/double-click all enabled via
  `react-zoom-pan-pinch` props (`minScale=1`, `maxScale=3`).

## 6. Visual system

Following `docs/COA-Z_Interwoven_Beyond_Design_System.md` tokens:

- Booth `<rect>`: `rx`/`ry` rounded corners, `fill: var(--color-canvas-cream)`,
  `stroke: var(--color-trust-blue)` at low opacity as the "thin embroidered
  outline," drop-shadow filter using `--color-shadow-thread`. Hover: scale
  1.03 (framer-motion `whileHover`), stroke opacity/width increases, shadow
  deepens, `cursor: pointer`.
- Landmarks (stage/tent/pond/pathway/church/statue/podium) use the site's
  thread-color palette per type, non-interactive (no hover/click), rendered
  behind booths in z-order.
- Map container: reuses `FabricTexture`/linen background, plus a radial
  gradient highlight behind the map at 8% opacity (cream → soft highlight →
  map → cards, per spec).
- Decorative embroidery (thread border, corner flowers) reuses existing
  `ThreadBorder`/`EmbroideredAccent` components, absolutely positioned outside
  the SVG's interactive viewBox so they never overlap booth hit areas.
- Legend and zoom controls styled as small linen cards: rounded-8,
  `border-trust-blue/10`, `shadow-[0_4px_20px_rgba(46,74,143,.06)]`, matching
  existing `OrganizationCard`/`Button` conventions.
- Organization sidebar cards follow the same card convention, plus a small
  color-coded dot (thread color) indicating venue/category.

## 7. Motion (framer-motion)

Animate: venue switch (fade), card hover (glow), booth selection
(scale→glow→pulse→rest, 0.5s, no loop), preview card (fade + slight y-shift),
map entrance (fade-in on mount), legend fade-in, zoom control fade-in. No
continuous/looping animations anywhere.

## 8. Responsive behavior

- **Desktop (`lg`+):** `grid-cols-[35%_65%]`, sidebar | map.
- **Tablet (`md`):** stacked, cards above map, both full-width.
- **Mobile (`sm` and below):** venue tabs → map → organization list collapsed
  into an accordion (custom-built to match existing site patterns; no new
  accordion dependency needed for this scope).

## 9. Testing

- Manual verification in-browser (dev server) for all three venues: pan/zoom/
  pinch/double-click, card hover/click → highlight/zoom/preview flow, venue
  switching animation, responsive breakpoints (desktop/tablet/mobile), and
  generic-booth fallback behavior.
- No new automated test infra proposed — this is a visual/interactive feature;
  existing project conventions (per prior specs) don't include component test
  coverage for page-level UI.

## 10. Out of scope

- Search/filter within the map (explicitly excluded per original brief — this
  is a visual companion, not a directory).
- Real-time booth availability/status.
- Editing booth data through a UI — data is static in `recweekBooths.ts`.
