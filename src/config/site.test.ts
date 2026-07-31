import { describe, it, expect } from 'vitest'
import { siteConfig } from './site'

describe('siteConfig.url', () => {
  it('is a non-empty absolute URL', () => {
    expect(siteConfig.url).toMatch(/^https:\/\/.+/)
  })

  it('has no trailing slash, so path concatenation like `${url}${path}` never double-slashes', () => {
    expect(siteConfig.url.endsWith('/')).toBe(false)
  })
})
