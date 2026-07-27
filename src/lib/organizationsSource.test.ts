import { describe, it, expect } from 'vitest'
import { realOrganizations } from './organizationsSource'
import { organizations as rawOrganizations } from '../data/organizations'
import { clusters } from '../config/clusters'

describe('realOrganizations adapter', () => {
  it('maps every raw organization exactly once', () => {
    expect(realOrganizations).toHaveLength(rawOrganizations.length)
  })

  it('assigns every organization to a known cluster', () => {
    const validSlugs = new Set(clusters.map((c) => c.slug))
    for (const org of realOrganizations) {
      expect(validSlugs.has(org.cluster.slug)).toBe(true)
    }
  })

  it('preserves the real name and description', () => {
    const beacon = realOrganizations.find((o) => o.id === 'the-beacon-publications')
    expect(beacon?.name).toBe('The Beacon Publications')
    expect(beacon?.cluster.slug).toBe('publications-communications')
  })

  it('leaves logo undefined for organizations with no matching asset', () => {
    const coaz = realOrganizations.find((o) => o.id === 'coaz')
    expect(coaz?.logo).toBeUndefined()
  })
})
