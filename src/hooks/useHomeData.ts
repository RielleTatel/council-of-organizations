import { useOrganizations } from './useOrganizations'
import { useLeadership } from './useLeadership'
import { useEvents } from './useEvents'
import {
  deriveHomeStats,
  selectFeaturedOrganization,
  selectRecentEvents,
  selectSpotlightOrganizations,
  selectUpcomingEvents,
  type HomeStats,
} from '../lib/home'
import { clusters } from '../config/clusters'

export function useHomeStats(): { stats: HomeStats; isLoading: boolean } {
  const orgs = useOrganizations()
  const leaders = useLeadership()
  return {
    stats: deriveHomeStats(orgs.data ?? [], leaders.data ?? []),
    isLoading: orgs.isLoading || leaders.isLoading,
  }
}

export function useFeaturedOrganization() {
  const orgs = useOrganizations()
  return {
    organization: selectFeaturedOrganization(orgs.data ?? [], new Date()),
    isLoading: orgs.isLoading,
  }
}

export function useSpotlightOrganizations(count = 6) {
  const orgs = useOrganizations()
  return {
    organizations: selectSpotlightOrganizations(orgs.data ?? [], clusters.map((c) => c.slug)).slice(0, count),
    isLoading: orgs.isLoading,
  }
}

export function useUpcomingEvents(count = 3) {
  const events = useEvents()
  return {
    events: selectUpcomingEvents(events.data ?? [], new Date(), count),
    isLoading: events.isLoading,
  }
}

export function useRecentEvents(count = 3) {
  const events = useEvents()
  return {
    events: selectRecentEvents(events.data ?? [], count),
    isLoading: events.isLoading,
  }
}
