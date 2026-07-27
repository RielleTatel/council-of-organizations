import { useQuery } from '@tanstack/react-query'
import { leadershipKeys } from '../lib/contentful/queries'
import { getLeadership } from '../lib/contentful/services'

export function useLeadership() {
  return useQuery({
    queryKey: leadershipKeys.all,
    queryFn: getLeadership,
  })
}
