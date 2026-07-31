import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8')

describe('static Open Graph tags in index.html', () => {
  it('declares the required Open Graph tags', () => {
    expect(html).toContain('property="og:type" content="website"')
    expect(html).toContain('property="og:site_name" content="COA-Z"')
    expect(html).toContain('property="og:url" content="https://coa-z-adzu.netlify.app"')
    expect(html).toContain(
      'property="og:title" content="Council of Organizations of the Ateneo – Zamboanga"',
    )
    expect(html).toContain(
      'property="og:image" content="https://coa-z-adzu.netlify.app/og-banner.png"',
    )
  })

  it('declares the required Twitter Card tags', () => {
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
    expect(html).toContain(
      'name="twitter:image" content="https://coa-z-adzu.netlify.app/og-banner.png"',
    )
  })

  it('references an image URL that is absolute, not relative', () => {
    const ogImageMatch = html.match(/property="og:image" content="([^"]+)"/)
    expect(ogImageMatch?.[1]).toMatch(/^https:\/\//)
  })
})
