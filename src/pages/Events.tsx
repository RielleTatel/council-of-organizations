import { useCmsCopy, CmsRichText } from "../lib/cms/public";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/ui/Reveal";
import { EventCard } from "../components/shared/EventCard";
import { EmbroideredAccent } from "../components/EmbroideredAccent";
import { SectionGlow } from "../components/ui/SectionGlow";
import { PageHeader } from "../components/shared/PageHeader";
import { useEvents } from "../hooks/useEvents";
import { arrangeEventStories } from "../lib/eventStories";
import { FeaturedStoriesCarousel } from "../components/events/FeaturedStoriesCarousel";

export default function Events() {
  const copy = useCmsCopy("settings", "Events");
  const { data, isLoading } = useEvents();
  const stories = data ?? [];
  const { featured, rest } = arrangeEventStories(stories);

  return (
    <>
      <Seo
        title={copy.title0}
        description={copy.description1}
        canonical="/events"
      />

      <PageHeader
        variant="ink"
        eyebrow={copy.eyebrow2}
        accent="yellow"
        title={copy.title3}
        badge={copy.badge4}
        description={copy.description5}
      />

      <section className="bg-canvas-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          {isLoading ? (
            <div className="aspect-[16/9] w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
          ) : !featured.length ? (
            <Reveal className="flex flex-col items-center gap-4 py-12 text-center">
              <EmbroideredAccent color="yellow" index={1} size={56} />
              <div className="font-body text-lg text-stitch-gray">
                <CmsRichText value={copy.paragraph6} />
              </div>
            </Reveal>
          ) : (
            <>
              <FeaturedStoriesCarousel
                stories={featured}
                readStoryLabel={copy.text7}
              />

              {rest.length > 0 && (
                <div>
                  <Reveal className="relative mb-8">
                    <SectionGlow className="left-0 top-0 h-48 w-48" />
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                      {copy.text8}
                    </h2>
                  </Reveal>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {rest.map((story, i) => (
                      <Reveal key={story.id} delay={(i % 2) * 100}>
                        <EventCard event={story} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
