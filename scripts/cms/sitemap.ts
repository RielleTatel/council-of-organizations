export const publicRoutes = [
  "/",
  "/about",
  "/leadership",
  "/organizations",
  "/events",
  "/recweek",
];
export interface SitemapEntry {
  kind: string;
  slug: string;
  published_at?: string;
}
const escapeXml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
export function publishedSitemap(entries: SitemapEntry[], origin: string) {
  const routes = [
    ...publicRoutes.map((path) => ({
      path,
      date: undefined as string | undefined,
    })),
    ...entries
      .filter(
        (entry) => entry.kind === "organization" || entry.kind === "story",
      )
      .map((entry) => ({
        path: `/${entry.kind === "organization" ? "organizations" : "events"}/${encodeURIComponent(entry.slug)}`,
        date: entry.published_at,
      })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((row) => `  <url><loc>${escapeXml(new URL(row.path, origin).href)}</loc>${row.date && Number.isFinite(Date.parse(row.date)) ? `<lastmod>${new Date(row.date).toISOString()}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`;
}
