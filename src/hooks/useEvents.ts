import { usePublished } from "../lib/cms/public";
import { eventsFrom } from "../lib/cms/readers";
export function useEvents() {
  return usePublished(eventsFrom);
}
