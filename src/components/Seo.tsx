import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
}

/**
 * Sets the per-page browser tab title and SEO meta description.
 *
 * Deliberately does NOT touch og:* or twitter:* tags — those are static,
 * defined once in index.html, and shared by every page (see
 * docs/superpowers/plans/2026-07-31-static-open-graph.md). Setting them here
 * too would only affect clients that run JavaScript (most link-preview
 * scrapers don't), and would make those clients see a different preview
 * per page than everyone else, defeating the point of the static approach.
 */
export function Seo({ title, description }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}
