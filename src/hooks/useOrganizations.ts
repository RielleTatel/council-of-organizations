import { useQuery } from '@tanstack/react-query'
import { organizationsKeys } from '../lib/contentful/queries'
import { getOrganizations } from '../lib/contentful/services'

export function useOrganizations() {
  return useQuery({
    queryKey: organizationsKeys.all,
    queryFn: getOrganizations,
  })
}
