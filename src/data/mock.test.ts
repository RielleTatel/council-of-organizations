import { describe, it, expect } from 'vitest'
import { mockLeaders } from './mock'
import { offices } from '../config/leadership'

describe('mockLeaders', () => {
  const officeNames = offices.map((o) => o.name)

  it('every leader belongs to a known office', () => {
    for (const leader of mockLeaders) {
      expect(officeNames).toContain(leader.office)
    }
  })

  it('has 18 members across all 5 offices', () => {
    expect(mockLeaders).toHaveLength(18)
    expect(new Set(mockLeaders.map((l) => l.office)).size).toBe(5)
  })

  it('tags Creatives and Branding members with their sub-team', () => {
    const creatives = mockLeaders.filter((l) => l.office === 'Office of Creatives and Branding')
    expect(creatives).toHaveLength(3)
    for (const l of creatives) {
      expect(l.team).toBeTruthy()
    }
  })

  it('leaves team unset for members outside Creatives and Branding', () => {
    const others = mockLeaders.filter((l) => l.office !== 'Office of Creatives and Branding')
    for (const l of others) {
      expect(l.team).toBeUndefined()
    }
  })

  it('has unique ids', () => {
    const ids = mockLeaders.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
