import { describe, it, expect } from 'vitest'
import { siteRoutes } from '../../scripts/routes'

describe('siteRoutes', () => {
  it('includes every static top-level route', () => {
    const routes = siteRoutes()
    expect(routes).toContain('/')
    expect(routes).toContain('/about')
    expect(routes).toContain('/leadership')
    expect(routes).toContain('/organizations')
    expect(routes).toContain('/events')
    expect(routes).toContain('/recweek')
    expect(routes).toContain('/recweek/map')
  })

  it('includes one route per organization', () => {
    const routes = siteRoutes()
    expect(routes).toContain('/organizations/el-consejo-atenista')
    expect(routes.filter((r) => r.startsWith('/organizations/')).length).toBeGreaterThanOrEqual(47)
  })

  it('includes one route per event highlight', () => {
    const routes = siteRoutes()
    expect(routes).toContain('/events/recweek-orgfair-2026')
  })

  it('has no duplicate routes', () => {
    const routes = siteRoutes()
    expect(new Set(routes).size).toBe(routes.length)
  })
})
