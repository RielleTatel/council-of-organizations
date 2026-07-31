import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('OrganizationProfile structured data', () => {
  it('renders EducationalOrganization and BreadcrumbList JSON-LD', () => {
    const source = readFileSync(resolve(__dirname, 'OrganizationProfile.tsx'), 'utf-8')
    expect(source).toContain('educationalOrganizationSchema(')
    expect(source).toContain('breadcrumbListSchema([')
    expect((source.match(/<JsonLd/g) ?? []).length).toBeGreaterThanOrEqual(2)
  })
})
