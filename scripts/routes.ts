import { organizations } from '../src/data/organizations'
import { mockEvents } from '../src/data/mock'

const STATIC_ROUTES = ['/', '/about', '/leadership', '/organizations', '/events', '/recweek', '/recweek/map']

/** Every crawlable site-relative path — the "not found" catch-all route is deliberately excluded. */
export function siteRoutes(): string[] {
  const orgRoutes = organizations.map((org) => `/organizations/${org.id}`)
  const eventRoutes = mockEvents.map((event) => `/events/${event.slug}`)
  return [...STATIC_ROUTES, ...orgRoutes, ...eventRoutes]
}
