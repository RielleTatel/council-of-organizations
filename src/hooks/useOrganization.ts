import { useQuery } from '@tanstack/react-query'
import { organizationsKeys } from '../lib/contentful/queries'
import { getOrganizationBySlug } from '../lib/contentful/services'

export function useOrganization(slug: string) {
  return useQuery({
    queryKey: organizationsKeys.bySlug(slug),
    queryFn: () => getOrganizationBySlug(slug),
  })
}
