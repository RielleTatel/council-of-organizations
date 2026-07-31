import { Seo } from '../components/Seo'
import { JsonLd } from '../components/JsonLd'
import { eventSchema } from '../lib/schema'
import { siteConfig } from '../config/site'
import { RecWeekHero } from '../components/recweek/RecWeekHero'
import { RecWeekTimeline } from '../components/recweek/RecWeekTimeline'

export default function RecWeek() {
  return (
    <>
      <Seo
        title="RecWeek 2026 | COA-Z"
        description="RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026."
        canonical="/recweek"
      />
      <JsonLd
        data={eventSchema({
          name: 'Dia de Colores | RecWeek OrgFair 2026',
          startDate: '2026-08-03',
          endDate: '2026-08-07',
          description:
            "RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 3–7, 2026.",
          url: `${siteConfig.url}/recweek`,
        })}
      />
      <RecWeekHero />
      <RecWeekTimeline />
    </>
  )
}
