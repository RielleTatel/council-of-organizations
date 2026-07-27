import { useQuery } from '@tanstack/react-query'
import { siteSettingsKeys } from '../lib/contentful/queries'
import { getSiteSettings } from '../lib/contentful/services'

export function useSiteSettings() {
  return useQuery({
    queryKey: siteSettingsKeys.all,
    queryFn: getSiteSettings,
  })
}
