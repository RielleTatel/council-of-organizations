import { createHash } from "node:crypto";
import type { PublishedEntry } from "../../src/lib/cms/bootstrap";

export function stableId(key: string): string {
  const bytes = createHash("sha256")
    .update(`coa-cms:${key}`)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function imagePaths(document: unknown): string[] {
  const found = new Set<string>();
  function visit(value: unknown) {
    if (
      typeof value === "string" &&
      value.startsWith("/") &&
      /\.(png|jpe?g|webp|gif|svg)$/i.test(value)
    )
      found.add(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object")
      Object.values(value).forEach(visit);
  }
  visit(document);
  return [...found];
}
export function imageDescriptions(document: unknown): Map<string, string> {
  const descriptions = new Map<string, string>();
  function visit(value: unknown) {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") {
      const item = value as Record<string, unknown>;
      for (const [key, source] of Object.entries(item)) {
        if (typeof source !== "string" || !source.startsWith("/")) continue;
        const numbered = /^image(\d+)$/.exec(key);
        const description =
          key === "src"
            ? item.alt
            : key === "image"
              ? item.imageAlt || item.title || item.name
              : key === "logo"
                ? item.logoAlt || item.fullName || item.name
                : numbered
                  ? item[`alt${Number(numbered[1]) + 1}`]
                  : undefined;
        if (typeof description === "string" && description.trim())
          descriptions.set(source, description.trim());
      }
      Object.values(item).forEach(visit);
    }
  }
  visit(document);
  return descriptions;
}
export function replaceImages(
  document: unknown,
  references: Map<string, string>,
): unknown {
  if (typeof document === "string") return references.get(document) ?? document;
  if (Array.isArray(document))
    return document.map((value) => replaceImages(value, references));
  if (document && typeof document === "object")
    return Object.fromEntries(
      Object.entries(document).map(([key, value]) => [
        key,
        replaceImages(value, references),
      ]),
    );
  return document;
}
export const prepareEntries = (
  entries: PublishedEntry[],
  images: Map<string, string>,
) =>
  entries.map((entry) => ({
    ...entry,
    entry_id: stableId(entry.entry_id),
    document: replaceImages(entry.document, images),
  }));

// Only newly inserted metadata is returned, so a rerun never overwrites staff edits,
// republishes trashed entries, or replaces existing publication history.
export const importSql = `
with seeds as (select * from jsonb_to_recordset($1::jsonb) as s(entry_id uuid,kind text,slug text,document jsonb)),
created as (
  insert into public.cms_entries(id,kind,slug,ever_published,published_version)
  select entry_id,kind,slug,true,1 from seeds on conflict do nothing returning id
), drafts as (
  insert into public.cms_drafts(entry_id,document) select id,document from created join seeds on entry_id=id returning entry_id
), published as (
  insert into public.cms_published(entry_id,kind,slug,document) select id,kind,slug,public.cms_materialize_media(document) from created join seeds on entry_id=id returning entry_id
), history as (
  insert into public.cms_history(entry_id,document,action) select id,public.cms_materialize_media(document),'import' from created join seeds on entry_id=id returning entry_id
)
select count(*)::integer as imported from created;
`;
