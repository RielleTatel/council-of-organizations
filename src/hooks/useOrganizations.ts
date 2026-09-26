import { usePublished } from "../lib/cms/public";
import { organizationsFrom } from "../lib/cms/readers";
export function useOrganizations() {
  return usePublished(organizationsFrom);
}
