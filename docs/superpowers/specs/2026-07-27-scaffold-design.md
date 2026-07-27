# COA-Z Website — Scaffold Design

**Date:** 2026-07-27
**Scope:** Initialize the Vite + React + TypeScript project, install all dependencies, create the full directory structure, and write minimal stub files. No feature implementation.

---

## 1. Project Initialization

### 1a. Scaffold with Bun + Vite

```bash
bun create vite . --template react-ts
```

Delete Vite demo files after scaffolding:
- `src/App.css`
- `src/assets/`
- `public/vite.svg`

### 1b. Runtime Dependencies

```bash
bun add react-router-dom @tanstack/react-query contentful react-helmet-async lucide-react posthog-js clsx tailwind-merge
```

### 1c. Dev Dependencies

```bash
bun add -d tailwindcss @tailwindcss/vite autoprefixer @types/react @types/react-dom
```

### 1d. shadcn/ui (install only — no init)

```bash
bun add @radix-ui/react-slot class-variance-authority
```

### 1e. Tailwind Configuration

- Add `@tailwindcss/vite` as a plugin in `vite.config.ts`
- Replace `src/index.css` with `@import "tailwindcss"`

---

## 2. Directory Structure

```
src/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── sections/
│   ├── shared/
│   └── ui/
├── config/
│   ├── contentful.ts
│   ├── navigation.ts
│   ├── seo.ts
│   └── site.ts
├── data/
│   └── .gitkeep
├── hooks/
│   ├── useOrganizations.ts
│   ├── useEvents.ts
│   ├── useLeadership.ts
│   └── useSiteSettings.ts
├── lib/
│   ├── contentful/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   ├── services.ts
│   │   ├── mappers.ts
│   │   └── types.ts
│   ├── analytics/
│   │   └── posthog.ts
│   └── utils.ts
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Leadership.tsx
│   ├── Organizations.tsx
│   ├── OrganizationProfile.tsx
│   ├── Events.tsx
│   ├── EventDetail.tsx
│   └── NotFound.tsx
├── utils/
│   └── .gitkeep
├── App.tsx
├── main.tsx
└── index.css
```

Root-level additions:
- `.env.example`
- `.env` (added to `.gitignore`)

---

## 3. Stub File Specifications

### Pages (`src/pages/`)

Each page exports a default React component returning `null`:

```tsx
export default function PageName() {
  return null
}
```

Pages: `Home`, `About`, `Leadership`, `Organizations`, `OrganizationProfile`, `Events`, `EventDetail`, `NotFound`.

---

### `src/lib/utils.ts`

Exports the `cn()` utility combining `clsx` and `tailwind-merge`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### `src/lib/contentful/types.ts`

TypeScript interfaces for all Contentful content types:
- `Organization` — id, name, slug, cluster, description, logo, officers
- `Event` — id, title, slug, date, description, image, isFeatured, isFlagship
- `Leader` — id, name, role, office, image, bio
- `OrganizationCluster` — id, name, slug
- `SiteSettings` — siteName, tagline, logo, socialLinks
- `NavigationItem` — label, href
- `FooterInfo` — contactEmail, socialLinks, address

---

### `src/lib/contentful/client.ts`

Creates and exports the Contentful delivery client using env var placeholders.

---

### `src/lib/contentful/queries.ts`

Exports a query key factory object with keys for each content type:
- `organizationsKeys`, `eventsKeys`, `leadershipKeys`, `siteSettingsKeys`

---

### `src/lib/contentful/services.ts`

Stub async functions — all return `Promise<any>`:
- `getOrganizations()`
- `getOrganizationBySlug(slug: string)`
- `getEvents()`
- `getEventBySlug(slug: string)`
- `getLeadership()`
- `getSiteSettings()`

---

### `src/lib/contentful/mappers.ts`

Stub mapper functions returning `null as any`:
- `mapOrganization(entry: any): Organization`
- `mapEvent(entry: any): Event`
- `mapLeader(entry: any): Leader`

---

### `src/lib/analytics/posthog.ts`

Stub exports:
- `initPostHog(): void`
- `trackEvent(event: string, properties?: Record<string, unknown>): void`

---

### `src/config/contentful.ts`

Exports `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` from `import.meta.env`.

### `src/config/navigation.ts`

Exports `NavItem` type and a `navItems: NavItem[]` array with placeholder routes.

### `src/config/seo.ts`

Exports `defaultSeo` object with placeholder title, description, and OG fields.

### `src/config/site.ts`

Exports `siteConfig` object: name, description, url, social links.

---

### `src/hooks/`

One hook per content type, each wrapping `useQuery` with the appropriate query key and service call:
- `useOrganizations()`
- `useEvents()`
- `useLeadership()`
- `useSiteSettings()`

---

### `src/components/`

Subdirectories created, no files. Component authoring is out of scope for this scaffold.

---

## 4. Environment Variables

### `.env.example`

```
VITE_CONTENTFUL_SPACE_ID=
VITE_CONTENTFUL_ACCESS_TOKEN=
VITE_CONTENTFUL_ENVIRONMENT=master
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://app.posthog.com
```

`.env` is added to `.gitignore` (Vite scaffolds this by default).

---

## 5. App Entry Points

### `src/main.tsx`

Wraps the app in:
1. `QueryClientProvider` (TanStack Query)
2. `BrowserRouter` (React Router)

Calls `initPostHog()` before rendering.

### `src/App.tsx`

Defines all routes using React Router `<Routes>`:

| Path | Component |
|------|-----------|
| `/` | `Home` |
| `/about` | `About` |
| `/leadership` | `Leadership` |
| `/organizations` | `Organizations` |
| `/organizations/:slug` | `OrganizationProfile` |
| `/events` | `Events` |
| `/events/:slug` | `EventDetail` |
| `*` | `NotFound` |

---

## 6. Out of Scope

- Component implementation
- Contentful content model setup
- shadcn/ui component installation (`npx shadcn init`)
- Actual API calls (services return stubs)
- SEO/Helmet wiring per page
- PostHog event tracking implementation
- Deployment configuration
