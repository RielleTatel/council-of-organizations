import type { Organization, Leader, Event } from './contentful/types'

export function filterOrganizations(
  orgs: Organization[],
  query: string,
  clusterSlug: string | null,
): Organization[] {
  const q = query.trim().toLowerCase()
  return orgs.filter((o) => {
    const matchesCluster = clusterSlug === null || o.cluster.slug === clusterSlug
    const matchesQuery =
      q === '' || o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
    return matchesCluster && matchesQuery
  })
}

export function groupLeadersByOffice(
  leaders: Leader[],
  officeOrder: string[],
): { office: string; leaders: Leader[] }[] {
  return officeOrder
    .map((office) => ({ office, leaders: leaders.filter((l) => l.office === office) }))
    .filter((group) => group.leaders.length > 0)
}

export function splitEventsByTime(
  events: Event[],
  now: Date,
): { upcoming: Event[]; past: Event[] } {
  const t = now.getTime()
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= t)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const past = events
    .filter((e) => new Date(e.date).getTime() < t)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return { upcoming, past }
}

export function relatedOrganizations(
  orgs: Organization[],
  current: Organization,
  count: number,
): Organization[] {
  return orgs
    .filter((o) => o.slug !== current.slug && o.cluster.slug === current.cluster.slug)
    .slice(0, count)
}
