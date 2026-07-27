import { describe, it, expect } from 'vitest'
import { filterOrganizations, groupLeadersByOffice, splitEventsByTime, relatedOrganizations } from './directory'
import type { Organization, Leader, Event } from './contentful/types'

function org(slug: string, name: string, clusterSlug: string, description = ''): Organization {
  return {
    id: slug,
    name,
    slug,
    cluster: { id: clusterSlug, name: clusterSlug, slug: clusterSlug },
    description,
    logo: '',
    officers: [],
  }
}
function leader(id: string, office: string): Leader {
  return { id, name: `N${id}`, role: 'r', office, image: '', bio: '' }
}
function evt(id: string, date: string): Event {
  return { id, title: id, slug: id, date, description: '', image: '', isFeatured: false, isFlagship: false }
}

describe('filterOrganizations', () => {
  const orgs = [
    org('a', 'Ateneo Harana', 'culture'),
    org('b', 'The Beacon', 'pubs', 'campus journalism'),
    org('c', 'Green Movement', 'wellness'),
  ]

  it('returns all when query empty and cluster null', () => {
    expect(filterOrganizations(orgs, '', null)).toHaveLength(3)
  })
  it('matches name case-insensitively', () => {
    expect(filterOrganizations(orgs, 'beacon', null).map((o) => o.slug)).toEqual(['b'])
  })
  it('matches description', () => {
    expect(filterOrganizations(orgs, 'journalism', null).map((o) => o.slug)).toEqual(['b'])
  })
  it('filters by cluster', () => {
    expect(filterOrganizations(orgs, '', 'wellness').map((o) => o.slug)).toEqual(['c'])
  })
  it('combines query and cluster', () => {
    expect(filterOrganizations(orgs, 'green', 'wellness').map((o) => o.slug)).toEqual(['c'])
    expect(filterOrganizations(orgs, 'green', 'culture')).toHaveLength(0)
  })
})

describe('groupLeadersByOffice', () => {
  it('groups and orders by the given office order, dropping empty offices', () => {
    const leaders = [leader('1', 'B'), leader('2', 'A'), leader('3', 'A')]
    const result = groupLeadersByOffice(leaders, ['A', 'B', 'C'])
    expect(result.map((g) => g.office)).toEqual(['A', 'B'])
    expect(result[0].leaders.map((l) => l.id)).toEqual(['2', '3'])
  })
})

describe('splitEventsByTime', () => {
  const now = new Date('2026-07-28T00:00:00Z')
  it('splits upcoming (asc) and past (desc)', () => {
    const events = [evt('p1', '2026-05-01'), evt('u2', '2026-09-01'), evt('u1', '2026-08-01'), evt('p2', '2026-06-01')]
    const { upcoming, past } = splitEventsByTime(events, now)
    expect(upcoming.map((e) => e.id)).toEqual(['u1', 'u2'])
    expect(past.map((e) => e.id)).toEqual(['p2', 'p1'])
  })
})

describe('relatedOrganizations', () => {
  it('returns same-cluster orgs excluding the current, capped', () => {
    const orgs = [org('a', 'A', 'x'), org('b', 'B', 'x'), org('c', 'C', 'x'), org('d', 'D', 'y')]
    const result = relatedOrganizations(orgs, orgs[0], 2)
    expect(result.map((o) => o.slug)).toEqual(['b', 'c'])
  })
})
