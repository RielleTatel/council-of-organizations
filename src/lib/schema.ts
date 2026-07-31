import { siteConfig } from '../config/site'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/Icon.png`,
    description: siteConfig.description,
    sameAs: [siteConfig.socialLinks.facebook, siteConfig.socialLinks.instagram, siteConfig.socialLinks.twitter].filter(
      (link): link is string => Boolean(link),
    ),
  }
}

interface EducationalOrgInput {
  name: string
  description: string
  slug: string
  logo?: string
}

export function educationalOrganizationSchema(org: EducationalOrgInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: org.name,
    description: org.description,
    url: `${siteConfig.url}/organizations/${org.slug}`,
    logo: org.logo ? `${siteConfig.url}${org.logo}` : undefined,
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  }
}

interface EventInput {
  name: string
  startDate: string
  endDate: string
  description: string
  url: string
}

export function eventSchema(input: EventInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Ateneo de Zamboanga University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Zamboanga City',
        addressCountry: 'PH',
      },
    },
    description: input.description,
    url: input.url,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  }
}

export interface BreadcrumbItem {
  name: string
  /** Site-relative path, e.g. "/organizations/aicg". */
  path: string
}

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}
