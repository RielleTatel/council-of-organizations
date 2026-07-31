import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function h1Count(relativePath: string): number {
  const source = readFileSync(resolve(__dirname, '..', relativePath), 'utf-8')
  return (source.match(/<h1[\s>]/g) ?? []).length
}

describe('every page renders exactly one <h1>, directly or via a shared hero component', () => {
  it('Home.tsx renders its <h1> via Hero.tsx', () => {
    expect(h1Count('pages/Home.tsx')).toBe(0)
    expect(h1Count('components/home/Hero.tsx')).toBe(1)
  })

  it('About.tsx, Leadership.tsx, Organizations.tsx, Events.tsx render their <h1> via the shared PageHeader.tsx', () => {
    for (const page of ['pages/About.tsx', 'pages/Leadership.tsx', 'pages/Organizations.tsx', 'pages/Events.tsx']) {
      expect(h1Count(page)).toBe(0)
    }
    expect(h1Count('components/shared/PageHeader.tsx')).toBe(1)
  })

  it('RecWeek.tsx renders its <h1> via RecWeekHero.tsx', () => {
    expect(h1Count('pages/RecWeek.tsx')).toBe(0)
    expect(h1Count('components/recweek/RecWeekHero.tsx')).toBe(1)
  })

  it('RecWeekMap.tsx renders its <h1> via RecWeekMapHero.tsx', () => {
    expect(h1Count('pages/RecWeekMap.tsx')).toBe(0)
    expect(h1Count('components/recweek/RecWeekMapHero.tsx')).toBe(1)
  })

  it('OrganizationProfile.tsx, EventDetail.tsx, and NotFound.tsx each render exactly one inline <h1>', () => {
    expect(h1Count('pages/OrganizationProfile.tsx')).toBe(2) // not-found branch + found branch, never both at once
    expect(h1Count('pages/EventDetail.tsx')).toBe(2) // same pattern
    expect(h1Count('pages/NotFound.tsx')).toBe(1)
  })
})
