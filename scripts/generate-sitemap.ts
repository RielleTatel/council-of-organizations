import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/config/site'
import { siteRoutes } from './routes'

const routes = siteRoutes()

const urlEntries = routes
  .map((path) => `  <url>\n    <loc>${siteConfig.url}${path}</loc>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

const outPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
writeFileSync(outPath, xml)

console.log(`sitemap.xml: wrote ${routes.length} routes to ${outPath}`)
