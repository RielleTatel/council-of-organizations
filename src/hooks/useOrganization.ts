import { usePublished } from "../lib/cms/public";
import { organizationsFrom } from "../lib/cms/readers";
export function useOrganization(slug: string) {
  return usePublished(
    (records) =>
      organizationsFrom(records).find(
        (organization) => organization.slug === slug,
      ) ?? null,
  );
}
