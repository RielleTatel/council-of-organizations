import { bootstrapEntries } from "../../src/lib/cms/bootstrap";
import { publishedSitemap, type SitemapEntry } from "../../scripts/cms/sitemap";

export default async function handle() {
  const url = process.env.VITE_SUPABASE_URL,
    key =
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;
  const origin =
    process.env.CMS_SITE_URL ||
    process.env.URL ||
    "https://coa-z-adzu.netlify.app";
  try {
    let entries: SitemapEntry[] = bootstrapEntries;
    if (url || key) {
      if (!url || !key) throw new Error("Incomplete CMS configuration");
      entries = [];
      for (let offset = 0; ; offset += 1000) {
        const response = await fetch(
          `${url.replace(/\/$/, "")}/rest/v1/cms_published?select=kind,slug,published_at&kind=in.(organization,story)&order=entry_id&offset=${offset}&limit=1000`,
          { headers: { apikey: key }, signal: AbortSignal.timeout(10_000) },
        );
        if (!response.ok) throw new Error("CMS unavailable");
        const page = (await response.json()) as SitemapEntry[];
        entries.push(...page);
        if (page.length < 1000) break;
      }
    }
    return new Response(publishedSitemap(entries, origin), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new Response("Published sitemap is temporarily unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
