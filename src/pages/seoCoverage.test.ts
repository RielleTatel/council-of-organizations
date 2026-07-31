import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const PAGES_WITH_STATIC_CANONICAL: Record<string, string> = {
  'Home.tsx': '/',
  'About.tsx': '/about',
  'Leadership.tsx': '/leadership',
  'Organizations.tsx': '/organizations',
  'RecWeek.tsx': '/recweek',
  'RecWeekMap.tsx': '/recweek/map',
  'Events.tsx': '/events',
}

const PAGES_WITH_NOINDEX = ['NotFound.tsx']

describe('every static page declares a canonical URL', () => {
  for (const [file, path] of Object.entries(PAGES_WITH_STATIC_CANONICAL)) {
    it(`${file} sets canonical="${path}"`, () => {
      const source = readFileSync(resolve(__dirname, file), 'utf-8')
      expect(source).toContain(`canonical="${path}"`)
    })
  }
})

describe('error/not-found pages are marked noindex', () => {
  for (const file of PAGES_WITH_NOINDEX) {
    it(`${file} sets noindex`, () => {
      const source = readFileSync(resolve(__dirname, file), 'utf-8')
      expect(source).toContain('noindex')
    })
  }

  it('OrganizationProfile.tsx sets noindex on its not-found branch and a dynamic canonical on its found branch', () => {
    const source = readFileSync(resolve(__dirname, 'OrganizationProfile.tsx'), 'utf-8')
    expect(source).toContain('noindex')
    expect(source).toContain('canonical={`/organizations/${organization.slug}`}')
  })

  it('EventDetail.tsx sets noindex on its not-found branch and a dynamic canonical on its found branch', () => {
    const source = readFileSync(resolve(__dirname, 'EventDetail.tsx'), 'utf-8')
    expect(source).toContain('noindex')
    expect(source).toContain('canonical={`/events/${event.slug}`}')
  })
})
