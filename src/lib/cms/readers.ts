import type { Event, Leader, Organization } from "./domain";
import type { PublishedEntry } from "./bootstrap";
import { contentModule } from "./content";

export function organizationsFrom(records: PublishedEntry[]): Organization[] {
  const clusters = records.find((r) => r.kind === "clusters")?.document
    .items as { slug: string; name: string }[] | undefined;
  return records
    .filter((r) => r.kind === "organization")
    .map((r) => {
      const org = r.document as unknown as Organization;
      const cluster = clusters?.find((c) => c.slug === org.cluster.slug);
      return {
        ...org,
        cluster: cluster
          ? { id: cluster.slug, slug: cluster.slug, name: cluster.name }
          : org.cluster,
      };
    });
}
export const eventsFrom = (records: PublishedEntry[]) =>
  records
    .filter((r) => r.kind === "story")
    .map((r) => r.document as unknown as Event);
export const leadershipFrom = (records: PublishedEntry[]) =>
  (records.find((r) => r.kind === "leadership")?.document.members ??
    []) as Leader[];
export const getOrganizations = async (reader = contentModule) =>
  organizationsFrom(await reader.published());
export const getOrganizationBySlug = async (slug: string, reader = contentModule) =>
  (await getOrganizations(reader)).find((o) => o.slug === slug) ?? null;
export const getEvents = async (reader = contentModule) =>
  eventsFrom(await reader.published());
export const getEventBySlug = async (slug: string, reader = contentModule) =>
  (await getEvents(reader)).find((e) => e.slug === slug) ?? null;
export const getLeadership = async (reader = contentModule) =>
  leadershipFrom(await reader.published());
export const getSiteSettings = async (reader = contentModule) =>
  (await reader.published()).find((r) => r.kind === "settings")
    ?.document ?? null;
