import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { contentModule } from "./content";
import type { PublishedEntry, SingletonKind } from "./bootstrap";
import { singletonDefaults } from "./bootstrap";

export const publishedKey = ["cms", "published"] as const;
export function usePublished<T>(select: (records: PublishedEntry[]) => T) {
  return useQuery({
    queryKey: publishedKey,
    queryFn: contentModule.published,
    select,
    staleTime: 30_000,
  });
}
export function useSingleton<K extends SingletonKind>(
  kind: K,
): (typeof singletonDefaults)[K] {
  const result = usePublished(
    (records) => records.find((record) => record.kind === kind)?.document,
  );
  if (result.isPending) return singletonDefaults[kind];
  if (!result.data)
    throw new Error(`${kind} content is currently unavailable.`);
  return result.data as unknown as (typeof singletonDefaults)[K];
}
export function useCmsCopy(
  kind: Exclude<SingletonKind, "clusters">,
  scope: string,
): Record<string, string> {
  return (
    (
      useSingleton(kind).copy as unknown as Record<
        string,
        Record<string, string>
      >
    )[scope] ?? {}
  );
}
export function CmsRichText({
  value,
  className = "",
}: {
  value?: string;
  className?: string;
}) {
  return (
    <div
      className={`cms-rich-text ${className}`}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(value ?? "", {
          ALLOWED_TAGS: [
            "p",
            "h2",
            "h3",
            "strong",
            "em",
            "ul",
            "ol",
            "li",
            "a",
            "br",
          ],
          ALLOWED_ATTR: ["href"],
        }),
      }}
    />
  );
}
