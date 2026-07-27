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
