import type { Event, Leader, Organization, SiteSettings } from './types'
import { realOrganizations } from '../organizationsSource'
import { mockEvents, mockLeaders } from '../../data/mock'

export async function getOrganizations(): Promise<Organization[]> {
  return realOrganizations
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  return realOrganizations.find((o) => o.slug === slug) ?? null
}

export async function getEvents(): Promise<Event[]> {
  return mockEvents
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return mockEvents.find((e) => e.slug === slug) ?? null
}

export async function getLeadership(): Promise<Leader[]> {
  return mockLeaders
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return null
}
