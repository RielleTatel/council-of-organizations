import { describe, it, expect } from 'vitest'
import { venues, boothOrg, boothFullName, boothHref, venueBySlug, type BoothShape } from './recweekBooths'
import { organizations } from './organizations'

const allBooths: BoothShape[] = venues.flatMap((v) => v.booths)

const UNMATCHED = new Set([
  'APC', 'ALMS', 'ICPEP', 'NFJPIA', 'FAST', 'ISSOA',
])

describe('recweek venues', () => {
  it('has the three venues in canonical order', () => {
    expect(venues.map((v) => v.id)).toEqual([
      'bc-lobby-quad', 'c-lobby-garden', 'paseo-de-maria',
    ])
  })

  it('gives every booth a unique id', () => {
    const ids = allBooths.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every venue a valid "minX minY width height" viewBox', () => {
    for (const v of venues) {
      expect(v.viewBox).toMatch(/^-?\d+(\.\d+)?( -?\d+(\.\d+)?){3}$/)
    }
  })

  it('gives every venue a unique slug matching the expected query-param values', () => {
    expect(venues.map((v) => v.slug)).toEqual(['bc', 'cgarden', 'paseo'])
  })

  it('resolves a venue by slug and falls back to undefined for unknown/null slugs', () => {
    expect(venueBySlug('bc')?.id).toBe('bc-lobby-quad')
    expect(venueBySlug('cgarden')?.id).toBe('c-lobby-garden')
    expect(venueBySlug('paseo')?.id).toBe('paseo-de-maria')
    expect(venueBySlug('nonexistent')).toBeUndefined()
    expect(venueBySlug(null)).toBeUndefined()
  })

  it('links every orgId to a real organization', () => {
    const orgIds = new Set(organizations.map((o) => o.id))
    for (const b of allBooths) {
      if (b.orgId) expect(orgIds).toContain(b.orgId)
    }
  })

  it('leaves the known exhibitor booths unmatched', () => {
    for (const b of allBooths) {
      if (UNMATCHED.has(b.acronym)) expect(b.orgId).toBeUndefined()
    }
  })

  it('resolves full name + href only for matched booths', () => {
    for (const b of allBooths) {
      if (b.orgId) {
        expect(boothOrg(b)).toBeDefined()
        expect(boothFullName(b)).toBeTruthy()
      } else {
        expect(boothOrg(b)).toBeUndefined()
        expect(boothFullName(b)).toBeUndefined()
        expect(boothHref(b)).toBeUndefined()
      }
    }
  })
})
