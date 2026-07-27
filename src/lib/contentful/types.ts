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
  logo: string
  officers: string[]
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
