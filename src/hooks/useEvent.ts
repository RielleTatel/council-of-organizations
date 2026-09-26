import { usePublished } from "../lib/cms/public";
import { eventsFrom } from "../lib/cms/readers";
export function useEvent(slug: string) {
  return usePublished(
    (records) =>
      eventsFrom(records).find((event) => event.slug === slug) ?? null,
  );
}
