# Leadership Page Redesign

## Context

The current Leadership page (`src/pages/Leadership.tsx`) lists offices and members in a plain, document-like layout: a heading, a description, and a grid of minimal `OfficerCard`s (circular placeholder, name, role). Without profile photos, the page reads flat compared to the rest of the site's embroidered/handcrafted visual language (seen in `OrganizationSpotlight`, `EmbroideredAccent`, `ThreadBorder`, `FloatingAccent`, `SectionGlow`).

This redesign strengthens layout, spacing, and decorative treatment using the site's existing embroidery design system, and updates the roster data from placeholder names to the real COA-Z officers.

## Data Layer

**`src/data/mock.ts`** — replace the fictional `mockLeaders` array with the real roster (15 members across 5 offices). Offices normalize onto the existing `src/config/leadership.ts` entries:

| Office (config) | Members |
|---|---|
| Office of the Chairperson | Aubrey Mae L. Tomong — Executive Secretary; Gina M. Salamuddin — Undersecretary for Internal Affairs; Ryle Xyrex L. Jumawan — Undersecretary for External Affairs; Marc Justin E. Casino — Chief Legal and Policy Adviser |
| Office of the Secretary-General | Ken S. Ordeniza — Secretary General; Jhan Drei T. Araña — Undersecretary for Transparency; Nolram Carpio — Undersecretary for Social Action and Advocacy |
| Office of Communications | Jamea Roushiana S. Rajah — Communications Head; Kristel Ricalde — Social Media Handler; Erika Sheena Lim — Content Manager; Khameela Jzanna M. Kasim — Content Manager |
| Office of Creatives and Branding | Leo Leireen C. Magpantay — Creatives Head (team: Creatives and Branding); Mico R. Morales — Creatives Associate (team: Creatives and Branding); Roy Lorenz C. Jaculan — Documentations Head (team: Documentation and Videography) |
| Office of Finance | David Isidore D.R. De Leon — Finance Head; Louise Anne O. Sieras — Treasurer; John Paul Miranda — Subsidy Officer; Queenie M. Raciles — Finance Associate |

Notes:
- Source data had duplicate/typo office labels ("OFFICE OF THE COMMUNICATION" vs "...COMMUNICATIONS", a second "OFFICE OF THE CHAIRPERSON" block, a second "OFFICE OF THE SECRETARY GENERAL" block) — these are merged into their single canonical office above.
- `Leader` type (`src/lib/contentful/types.ts`) gains an optional `team?: string` field, populated only for Creatives and Branding members.
- Existing office accent colors in `src/config/leadership.ts` are kept unchanged (Chairperson=red, Secretary-General=purple, Communications=yellow, Creatives and Branding=pink, Finance=green) — each office already has a unique color, satisfying the "office accent color" goal without renaming/reassigning.
- `getLeadership()` in `src/lib/contentful/services.ts` already returns `mockLeaders` directly (no live Contentful wiring yet), so this is the actual data source for the page today.

## Hero Section

Extend `PageHeader` usage in `Leadership.tsx` (or add page-specific props to `PageHeader` if needed) to include:
- A larger `EmbroideredAccent` emblem above the eyebrow/title.
- A short supporting paragraph beneath the title explaining the Executive Board's purpose (2-3 sentences, drawing on the tone of existing office descriptions).
- `ThreadDivider` beneath the intro copy (already used in `PageHeader`, keep it but ensure adequate spacing above/below).
- Increased top/bottom padding versus the current `pt-28 pb-12` to give the hero more presence relative to the content that follows.

## Office Sections

New component `src/components/shared/OfficeSection.tsx`:
- Wraps one office's heading + description + member grid.
- `bg-linen-white` rounded container, soft shadow, generous internal padding (`p-8 md:p-12`).
- `SectionGlow` positioned behind the office header as a subtle background anchor.
- Office-colored `ThreadBorder` on the top edge, alternating `flip` per office index so the thread visually "connects" from the section above (per office `color` from config) — satisfies both "background anchors" and "connect sections with threads" from the original brief in one mechanism, avoiding a separate thread-overlay layer.
- Increased margin between office sections (`space-y-12 md:space-y-16` on the parent list) versus tight internal member-grid spacing.

`Leadership.tsx` maps `groupLeadersByOffice(...)` output through `OfficeSection` instead of rendering the heading/grid inline.

## Office Headers

New component `src/components/shared/OfficeHeader.tsx`, used inside `OfficeSection`:
- `EmbroideredAccent` (office color, small-medium size) beside or above the title.
- Office title (existing `font-display` treatment).
- Office description (existing copy from config, unchanged).
- `ThreadDivider` beneath, before the member grid begins.

## Member Cards

Redesign `src/components/shared/OfficerCard.tsx`:
- Rounded card (`rounded-2xl`), soft resting shadow, `hover:shadow-lg hover:-translate-y-1 transition` lift.
- Office-colored accent border (2px top or left border using the office's thread color via CSS var, matching the pattern already used in `OrganizationCard`/`OrganizationSpotlight` for `--accent`).
- Small `EmbroideredAccent` at low opacity/small size tucked in one card corner as a decorative flourish (not obstructing text).
- New `src/components/shared/InitialsAvatar.tsx` replacing the current blank circular placeholder:
  - Circular badge, dashed stitch-style ring in the office thread color (reusing `.stitch-divider`-style dashed border treatment, applied as a circular border).
  - Member's initials centered, `font-display font-bold`, colored `text-trust-blue` (consistent with existing name styling).
- When `team` is set (Creatives and Branding office only), render a small sub-team tag/label under the role text (e.g. `text-xs text-stitch-gray uppercase tracking-wide`) reading "Creatives and Branding" or "Documentation and Videography".

## Grid & Spacing

- Loosen horizontal gaps in the member grid (`gap-x-8 gap-y-6` vs current uniform `gap-4`/`gap-6`), keeping the responsive `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` breakpoints.
- Reduce padding *inside* each card slightly to offset the added visual weight from the border/corner accent, keeping cards compact while the surrounding whitespace does the work of feeling "gallery-like."

## Vertical Rhythm (cross-cutting)

Applied throughout the above rather than as a separate component:
- Larger gap before each `OfficeSection` (handled by the `space-y-12 md:space-y-16` on the section list).
- Breathing room after office descriptions (`OfficeHeader`'s own margin before the `ThreadDivider`).
- Tighter spacing within cards (see Grid & Spacing).
- The closing "Buklod Atenista Envoy Committee" band (`bg-trust-blue`) is unchanged structurally but gets slightly more top margin to read as a distinct closing section rather than a continuation.

## Out of Scope

- No new photography/illustration assets — everything reuses existing `EmbroideredAccent`, `ThreadBorder`, `ThreadDivider`, `SectionGlow`, and thread-color tokens already in `src/lib/assets.ts`.
- No changes to `groupLeadersByOffice`, Contentful service wiring, or the `Leader`/office data model beyond adding the optional `team` field.
- No scroll-triggered animation beyond what `Reveal`/`FloatingAccent` already provide (optional micro-interactions from the brief are limited to card hover, not new scroll choreography).

## Implementation Order

1. Data: update `mock.ts`, extend `Leader` type with `team`.
2. `OfficeSection` + `OfficeHeader` components, wire into `Leadership.tsx`.
3. Grid/spacing pass within the new section structure.
4. `OfficerCard` redesign (border, shadow, hover, corner accent, sub-team tag).
5. `InitialsAvatar` component, swap into `OfficerCard`.
6. Confirm office accent colors render correctly per section (no new token work needed).
7. Background anchor (`SectionGlow`) and connecting `ThreadBorder` per `OfficeSection` (already folded into step 2, verify visually).
8. Hero section enhancement in `PageHeader`/`Leadership.tsx`.
