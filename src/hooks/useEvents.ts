import { useQuery } from '@tanstack/react-query'
import { eventsKeys } from '../lib/contentful/queries'
import { getEvents } from '../lib/contentful/services'

export function useEvents() {
  return useQuery({
    queryKey: eventsKeys.all,
    queryFn: getEvents,
  })
}
