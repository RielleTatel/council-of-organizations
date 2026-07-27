# COA-Z Website — Checkpoint (2026-07-28)

Snapshot of work completed on `main` so far. All commits below are local; `main` is **17 commits ahead of `origin/main`**, not yet pushed.

---

## 1. Design system foundation (commit `70aa5f5`)

Source doc: `docs/COA-Z_Interwoven_Beyond_Design_System.md` ("Interwoven Beyond").

- **Fonts wired** in `src/index.css` via `@font-face`: all 6 Made Tommy weights (Thin/Light/Regular/Medium/Bold/Black) + Omegle, served from `public/FONTS/`. Mapped to Tailwind v4 `@theme` tokens: `--font-display` / `--font-body` (Made Tommy), `--font-accent` (Omegle).
- **Color palette** wired as `@theme` tokens: `trust-blue`, `canvas-cream`, `linen-white`, six `thread-*` accents (red/blue/green/yellow/pink/purple), `fabric-dark`, `stitch-gray`.
- **Asset cleanup:** every file in `public/ELEMENTS/flowers/` and `public/ELEMENTS/yarn/` had cryptic export names (e.g. `Layer 1 + Background Color + COA-Z-...Image (7).png`, with a non-breaking space hidden in the filename). Opened each image individually to verify actual color/shape, then renamed to descriptive slugs (`flower-pink-bloom-1.png`, `thread-blue-wave-1.png`, etc). One image was caught and corrected mid-rename (a purple bloom initially mislabeled pink).
- **Asset registry:** `src/lib/assets.ts` — typed `ThreadColor` union, `flowersByColor`, `threadsByColor`, `hoopFrames` (10 embroidery-hoop frame photos), `orgFairLogo`.
- **Reusable primitives:** `EmbroideredAccent`, `ThreadBorder`, `ThreadDivider` in `src/components/`.

**Known caveat:** Made Tommy and Omegle font files are marked "PERSONAL USE" in their filenames — needs a commercial license check before public launch.

---

## 2. Implementation plan (commit `37603fa`)

Full plan at `docs/superpowers/plans/2026-07-28-home-landing-page.md`, written with the `writing-plans` skill and the `design-taste-frontend` taste-skill (anti-AI-slop landing page rules). Documents:

- Design read: institutional/community landing, `VARIANCE 6 / MOTION 5 / DENSITY 3`.
- Four deliberate, brand-justified overrides of the taste-skill's defaults (single light theme, multi-thread-color accents, lucide-react allowed, no Motion library).
- 15 bite-sized TDD tasks covering data helpers, base CSS, every section, and final composition.
- A layout-family ledger (8 sections, ≥4 distinct layout families, no repeats) and a full pre-flight checklist (zero em-dashes, contrast, hero constraints, etc).

---

## 3. Landing page implementation (commits `070b814` … `5bcb66e`)

Executed inline in an isolated worktree (`worktree-home-landing-page`), then fast-forward merged into `main`. All 15 plan tasks complete:

| # | Deliverable | File(s) |
|---|---|---|
| 1 | Tested pure helpers: `deriveHomeStats`, `selectFeaturedOrganization`, `selectUpcomingEvents` | `src/lib/home.ts`, `src/lib/home.test.ts` (7 Vitest tests) |
| 2 | Reveal/focus/reduced-motion base CSS | `src/index.css` |
| 3 | `HelmetProvider` wired app-wide | `src/main.tsx` |
| 4 | `Button`, `Reveal` (IntersectionObserver), `FabricTexture` | `src/components/ui/` |
| 5 | Data hooks composing TanStack Query + helpers | `src/hooks/useHomeData.ts` |
| 6 | Responsive navbar, active thread-underline, mobile sheet | `src/components/layout/Navbar.tsx` |
| 7 | Asymmetric split hero | `src/components/home/Hero.tsx` |
| 8 | Quick statistics band (loading skeletons) | `src/components/home/QuickStats.tsx` |
| 9 | About COA-Z editorial section | `src/components/home/AboutSection.tsx` |
| 10 | Our Purpose 2×2 bento | `src/components/home/PurposeSection.tsx` |
| 11 | Featured Organization spotlight (daily rotation) | `src/components/home/FeaturedOrganization.tsx` |
| 12 | Upcoming Events card grid (loading/empty states) | `src/components/home/UpcomingEvents.tsx` |
| 13 | Full-width CTA band | `src/components/home/HomeCTA.tsx` |
| 14 | Site footer | `src/components/layout/Footer.tsx` |
| 15 | Composed `/` route with SEO meta | `src/pages/Home.tsx` |

**Verification performed:** `bunx tsc -b` clean, `bun run lint` clean (2 pre-existing fast-refresh warnings only), `bun run build` succeeds, `bun run test` 7/7 passing, every referenced font/image asset confirmed to resolve at HTTP 200 against the dev server, zero em-dash/en-dash characters in visible copy (grep-verified).

**Fix made mid-implementation:** `lucide-react` 1.x dropped brand icons (`Facebook`, `Instagram` don't exist in this version). Footer social links use the generic `ExternalLink` icon instead of a hand-rolled brand mark.

---

## 4. Open items (not blocking, still true)

1. **Footer contact info is placeholder** — `mailto:info@coaz.org` and `siteConfig.socialLinks` (Facebook/Instagram/Twitter) are empty strings in `src/config/site.ts`. Needs real values.
2. **`Event` type has no `venue` field.** The content brief lists venue on event cards; `src/lib/contentful/types.ts` doesn't have it. Omitted rather than fabricated — adding it means touching the `Event` type and the Contentful mapper (`src/lib/contentful/mappers.ts`).
3. **Font licensing.** Made Tommy and Omegle are "PERSONAL USE" per their filenames — confirm a commercial license before COA-Z ships this publicly.
4. **Contentful is still stubbed.** `src/lib/contentful/services.ts` returns empty arrays/null for everything, so the live page currently renders zero stats, no featured org (section hides), and the empty-events state. This is expected until real Contentful content/credentials are wired in.
5. **Not pushed.** `main` is 17 commits ahead of `origin/main`. Push and/or PR whenever ready.

---

## 5. What's NOT started yet

The plan and this checkpoint cover only the **Home** (`/`) route. Other routed pages are still stub components with no design-system styling applied:
- `src/pages/About.tsx`
- `src/pages/Leadership.tsx`
- `src/pages/Organizations.tsx`
- `src/pages/OrganizationProfile.tsx`
- `src/pages/Events.tsx`
- `src/pages/EventDetail.tsx`
- `src/pages/NotFound.tsx`

Each would need its own brief and plan (Navbar/Footer already exist and are shared, so those don't need rebuilding per page).
