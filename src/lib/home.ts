import type { Organization, Event, Leader } from './contentful/types'

export interface HomeStats {
  organizations: number
  clusters: number
  offices: number
  leaders: number
}

export function deriveHomeStats(orgs: Organization[], leaders: Leader[]): HomeStats {
  return {
    organizations: orgs.length,
    clusters: new Set(orgs.map((o) => o.cluster.id)).size,
    offices: new Set(leaders.map((l) => l.office)).size,
    leaders: leaders.length,
  }
}

function dayIndex(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000)
}

export function selectFeaturedOrganization(orgs: Organization[], date: Date): Organization | null {
  if (orgs.length === 0) return null
  return orgs[dayIndex(date) % orgs.length]
}

export function selectUpcomingEvents(events: Event[], now: Date, count: number): Event[] {
  return events
    .filter((e) => new Date(e.date).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count)
}
