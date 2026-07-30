import { Seo } from '../components/Seo'
import { RecWeekHero } from '../components/recweek/RecWeekHero'
import { RecWeekTimeline } from '../components/recweek/RecWeekTimeline'

export default function RecWeek() {
  return (
    <>
      <Seo
        title="RecWeek 2026 | COA-Z"
        description="RecWeek 2026: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University, August 11–13, 2026."
      />
      <RecWeekHero />
      <RecWeekTimeline />
    </>
  )
}
