import { Seo } from '../components/Seo'
import { RecWeekHero } from '../components/recweek/RecWeekHero'
import { RecWeekTimeline } from '../components/recweek/RecWeekTimeline'
import { RecWeekFaq } from '../components/recweek/RecWeekFaq'
import { RecWeekCta } from '../components/recweek/RecWeekCta'

export default function RecWeek() {
  return (
    <>
      <Seo
        title="RecWeek | COA-Z"
        description="COA-Z Recruitment Week: discover accredited organizations, meet fellow Atenistas, and find your community at Ateneo de Zamboanga University."
      />
      <RecWeekHero />
      <RecWeekTimeline />
      <RecWeekFaq />
      <RecWeekCta />
    </>
  )
}
