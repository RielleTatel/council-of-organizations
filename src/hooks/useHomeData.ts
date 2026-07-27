import { useOrganizations } from './useOrganizations'
import { useLeadership } from './useLeadership'
import { useEvents } from './useEvents'
import { deriveHomeStats, selectFeaturedOrganization, selectUpcomingEvents, type HomeStats } from '../lib/home'

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

export function useUpcomingEvents(count = 3) {
  const events = useEvents()
  return {
    events: selectUpcomingEvents(events.data ?? [], new Date(), count),
    isLoading: events.isLoading,
  }
}
