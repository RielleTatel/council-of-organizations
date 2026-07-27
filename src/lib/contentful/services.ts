import type { Event, Leader, Organization, SiteSettings } from './types'

export async function getOrganizations(): Promise<Organization[]> {
  return []
}

export async function getOrganizationBySlug(_slug: string): Promise<Organization | null> {
  return null
}

export async function getEvents(): Promise<Event[]> {
  return []
}

export async function getEventBySlug(_slug: string): Promise<Event | null> {
  return null
}

export async function getLeadership(): Promise<Leader[]> {
  return []
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return null
}
