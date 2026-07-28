export interface OrganizationCluster {
  id: string
  name: string
  slug: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  cluster: OrganizationCluster
  description: string
  logo?: string
  officers: string[]
  link?: string
}

export interface Event {
  id: string
  title: string
  slug: string
  date: string
  description: string
  image: string
  isFeatured: boolean
  isFlagship: boolean
  /** Organization the story is about, e.g. "Junior Jaycees Chamber - AdZU". */
  organization?: string
  /** Short 1-2 sentence teaser shown on story cards. */
  excerpt?: string
  /** Full story body, one paragraph per entry. Falls back to `description` when absent. */
  body?: string[]
  /** Attribution line, e.g. "Caption by ... · Layout by ...". */
  credit?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    email?: string
  }
}

export interface Leader {
  id: string
  name: string
  role: string
  office: string
  image: string
  bio: string
}

export interface SiteSettings {
  siteName: string
  tagline: string
  logo: string
  socialLinks: Record<string, string>
}

export interface NavigationItem {
  label: string
  href: string
}

export interface FooterInfo {
  contactEmail: string
  socialLinks: Record<string, string>
  address: string
}
