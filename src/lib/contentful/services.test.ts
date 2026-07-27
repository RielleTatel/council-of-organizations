import { describe, it, expect } from 'vitest'
import {
  getOrganizations,
  getOrganizationBySlug,
  getEvents,
  getEventBySlug,
  getLeadership,
} from './services'

describe('data-wired services', () => {
  it('returns organizations', async () => {
    const orgs = await getOrganizations()
    expect(orgs.length).toBeGreaterThan(0)
  })

  it('finds an organization by slug', async () => {
    const org = await getOrganizationBySlug('the-beacon-publications')
    expect(org?.name).toBe('The Beacon Publications')
  })

  it('returns null for an unknown organization slug', async () => {
    expect(await getOrganizationBySlug('does-not-exist')).toBeNull()
  })

  it('returns events', async () => {
    expect((await getEvents()).length).toBeGreaterThan(0)
  })

  it('finds an event by slug', async () => {
    const evt = await getEventBySlug('org-fair-2026')
    expect(evt?.title).toBe('OrgFair 2026')
  })

  it('returns null for an unknown event slug', async () => {
    expect(await getEventBySlug('nope')).toBeNull()
  })

  it('returns leadership', async () => {
    expect((await getLeadership()).length).toBeGreaterThan(0)
  })
})
