import { describe, it, expect } from 'vitest'
import {
  organizationSchema,
  educationalOrganizationSchema,
  eventSchema,
  breadcrumbListSchema,
} from './schema'

describe('organizationSchema', () => {
  it('describes COA-Z itself', () => {
    const schema = organizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('Council of Organizations of the Ateneo - Zamboanga')
    expect(schema.url).toBe('https://coa-z-adzu.netlify.app')
    expect(schema.sameAs).toContain('https://www.facebook.com/coazadzu')
  })
})

describe('educationalOrganizationSchema', () => {
  it('describes a member organization with a parentOrganization back-reference', () => {
    const schema = educationalOrganizationSchema({
      name: 'Ateneo Debate Union',
      description: 'Develops critical thinking and public speaking.',
      slug: 'ateneo-debate-union',
    })
    expect(schema['@type']).toBe('EducationalOrganization')
    expect(schema.name).toBe('Ateneo Debate Union')
    expect(schema.url).toBe('https://coa-z-adzu.netlify.app/organizations/ateneo-debate-union')
    expect(schema.parentOrganization).toMatchObject({ '@type': 'Organization', name: 'Council of Organizations of the Ateneo - Zamboanga' })
  })

  it('includes an absolute logo URL only when a logo path is given', () => {
    const withLogo = educationalOrganizationSchema({
      name: 'X',
      description: 'Y',
      slug: 'x',
      logo: '/logos/X.jpg',
    })
    expect(withLogo.logo).toBe('https://coa-z-adzu.netlify.app/logos/X.jpg')

    const withoutLogo = educationalOrganizationSchema({ name: 'X', description: 'Y', slug: 'x' })
    expect(withoutLogo.logo).toBeUndefined()
  })
})

describe('eventSchema', () => {
  it('describes a physical, scheduled event at AdZU', () => {
    const schema = eventSchema({
      name: 'Dia de Colores | RecWeek OrgFair 2026',
      startDate: '2026-08-03',
      endDate: '2026-08-07',
      description: 'RecWeek 2026 at Ateneo de Zamboanga University.',
      url: 'https://coa-z-adzu.netlify.app/recweek',
    })
    expect(schema['@type']).toBe('Event')
    expect(schema.startDate).toBe('2026-08-03')
    expect(schema.endDate).toBe('2026-08-07')
    expect(schema.eventStatus).toBe('https://schema.org/EventScheduled')
    expect(schema.location).toMatchObject({ '@type': 'Place', name: 'Ateneo de Zamboanga University' })
  })
})

describe('breadcrumbListSchema', () => {
  it('builds a positioned, absolute-URL breadcrumb trail', () => {
    const schema = breadcrumbListSchema([
      { name: 'Home', path: '/' },
      { name: 'Organizations', path: '/organizations' },
      { name: 'Ateneo Debate Union', path: '/organizations/ateneo-debate-union' },
    ])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toHaveLength(3)
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, name: 'Home', item: 'https://coa-z-adzu.netlify.app/' })
    expect(schema.itemListElement[2]).toMatchObject({
      position: 3,
      name: 'Ateneo Debate Union',
      item: 'https://coa-z-adzu.netlify.app/organizations/ateneo-debate-union',
    })
  })
})
