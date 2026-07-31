import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../config/site'

interface SeoProps {
  title: string
  description: string
  /** Site-relative path, e.g. "/organizations/aicg". Omit on pages with no single canonical URL (loading states, not-found states). */
  canonical?: string
  /** Set on not-found/error states so search engines don't index them. */
  noindex?: boolean
}

/**
 * Sets the per-page browser tab title, SEO meta description, canonical URL,
 * and (optionally) a noindex directive.
 *
 * Deliberately does NOT touch og:* or twitter:* tags — those are static,
 * defined once in index.html, and shared by every page (see
 * docs/superpowers/plans/2026-07-31-static-open-graph.md). Setting them here
 * too would only affect clients that run JavaScript (most link-preview
 * scrapers don't), and would make those clients see a different preview
 * per page than everyone else, defeating the point of the static approach.
 */
export function Seo({ title, description, canonical, noindex }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${siteConfig.url}${canonical}`} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
