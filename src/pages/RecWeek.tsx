import { useCmsCopy, useSingleton } from "../lib/cms/public";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { JsonLd } from "../components/JsonLd";
import { eventSchema } from "../lib/schema";
import { siteConfig } from "../config/site";
import { RecWeekHero } from "../components/recweek/RecWeekHero";
import { RecWeekTimeline } from "../components/recweek/RecWeekTimeline";
import { RecWeekFaq } from "../components/recweek/RecWeekFaq";
import { buttonVariants } from "../components/ui/Button";

export default function RecWeek() {
  const copy = useCmsCopy("recweek", "RecWeek");
  const campaign = useSingleton("recweek");
  return (
    <>
      <Seo
        title={copy.title0}
        description={copy.description1}
        canonical="/recweek"
      />
      <JsonLd
        data={eventSchema({
          name: campaign.name,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          location: campaign.location,
          description: copy.description1,
          url: `${siteConfig.url}/recweek`,
        })}
      />
      <RecWeekHero />
      <RecWeekTimeline />
      <RecWeekFaq />
      <div className="flex justify-center pb-20">
        <Link
          to={copy.link2}
          className={buttonVariants({ variant: "secondary" })}
        >
          {copy.text3}
        </Link>
      </div>
    </>
  );
}
