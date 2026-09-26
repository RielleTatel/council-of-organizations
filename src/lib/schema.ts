import { siteConfig } from "../config/site";

export function organizationSchema(
  settings: {
    name: string;
    fullName: string;
    description: string;
    logo?: string;
    socialLinks: { facebook?: string; instagram?: string; twitter?: string };
  } = siteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.fullName,
    alternateName: settings.name,
    url: siteConfig.url,
    logo: new URL(settings.logo ?? "/Icon.png", siteConfig.url).href,
    description: settings.description,
    sameAs: [
      settings.socialLinks.facebook,
      settings.socialLinks.instagram,
      settings.socialLinks.twitter,
    ].filter((link): link is string => Boolean(link)),
  };
}

interface EducationalOrgInput {
  name: string;
  description: string;
  slug: string;
  logo?: string;
}

export function educationalOrganizationSchema(org: EducationalOrgInput) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: org.name,
    description: org.description,
    url: `${siteConfig.url}/organizations/${org.slug}`,
    logo: org.logo ? new URL(org.logo, siteConfig.url).href : undefined,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  };
}

interface EventInput {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  url: string;
  location?: string;
}

export function eventSchema(input: EventInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: input.location ?? "Ateneo de Zamboanga University",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Zamboanga City",
        addressCountry: "PH",
      },
    },
    description: input.description,
    url: input.url,
    organizer: {
      "@type": "Organization",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path, e.g. "/organizations/aicg". */
  path: string;
}

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
