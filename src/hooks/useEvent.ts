import { useQuery } from '@tanstack/react-query'
import { eventsKeys } from '../lib/contentful/queries'
import { getEventBySlug } from '../lib/contentful/services'

export function useEvent(slug: string) {
  return useQuery({
    queryKey: eventsKeys.bySlug(slug),
    queryFn: () => getEventBySlug(slug),
  })
}
