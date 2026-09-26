import { usePublished } from "../lib/cms/public";
import { leadershipFrom } from "../lib/cms/readers";
export function useLeadership() {
  return usePublished(leadershipFrom);
}
