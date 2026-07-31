import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Breadcrumb structured data', () => {
  it('EventDetail.tsx renders a BreadcrumbList', () => {
    const source = readFileSync(resolve(__dirname, 'EventDetail.tsx'), 'utf-8')
    expect(source).toContain('breadcrumbListSchema([')
  })

  it('RecWeekMap.tsx renders a BreadcrumbList', () => {
    const source = readFileSync(resolve(__dirname, 'RecWeekMap.tsx'), 'utf-8')
    expect(source).toContain('breadcrumbListSchema([')
  })
})
