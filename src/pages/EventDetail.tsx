import { useCmsCopy, CmsRichText } from "../lib/cms/public";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, ExternalLink, Mail } from "lucide-react";
import { Seo } from "../components/Seo";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbListSchema } from "../lib/schema";
import { Reveal } from "../components/ui/Reveal";
import { EventCard } from "../components/shared/EventCard";
import { EmbroideredAccent } from "../components/EmbroideredAccent";
import { ThreadBorder } from "../components/ThreadBorder";
import { SectionGlow } from "../components/ui/SectionGlow";
import { buttonVariants } from "../components/ui/Button";
import { useEvent } from "../hooks/useEvent";
import { useEvents } from "../hooks/useEvents";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventDetail() {
  const copy = useCmsCopy("settings", "EventDetail");
  const { slug = "" } = useParams();
  const { data: event, isLoading } = useEvent(slug);
  const { data: allEvents } = useEvents();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] px-6 pt-32 pb-20">
        <div className="aspect-[16/9] w-full animate-pulse rounded-[8px] bg-stitch-gray/20" />
      </div>
    );
  }

  if (!event) {
    return (
      <>
        <Seo title={copy.title0} description={copy.description1} noindex />
        <section className="mx-auto flex max-w-[700px] flex-col items-center gap-6 px-6 pt-32 pb-24 text-center">
          <EmbroideredAccent color="red" index={0} size={64} />
          <h1 className="font-display text-3xl font-bold text-trust-blue">
            {copy.text2}
          </h1>
          <div className="font-body text-lg text-fabric-dark">
            <CmsRichText value={copy.paragraph3} />
          </div>
          <Link
            to={copy.link4}
            className={buttonVariants({ variant: "secondary" })}
          >
            {copy.text5}
          </Link>
        </section>
      </>
    );
  }

  const related = (allEvents ?? [])
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);
  const body = event.body ?? [event.description];

  return (
    <>
      <Seo
        title={`${event.title} | COA-Z`}
        description={event.excerpt ?? event.description}
        canonical={`/events/${event.slug}`}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Event Highlights", path: "/events" },
          { name: event.title, path: `/events/${event.slug}` },
        ])}
      />

      <section className="bg-canvas-cream pt-24 md:pt-28">
        {event.image && (
          <div className="mx-auto max-w-[1200px] px-6">
            <img
              src={event.image}
              alt={event.imageAlt || event.title}
              className="aspect-[16/9] w-full rounded-[8px] object-cover shadow-[0_4px_20px_rgba(46,74,143,0.06)]"
              loading="eager"
            />
          </div>
        )}
      </section>

      <section className="relative bg-canvas-cream py-12 md:py-16">
        <SectionGlow className="left-0 top-0 h-56 w-56" />
        <Reveal className="relative mx-auto max-w-[68ch] px-6">
          {event.organization && (
            <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-thread-red">
              {event.organization}
            </span>
          )}
          <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.02em] text-trust-blue md:text-5xl">
            {event.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 font-body text-stitch-gray">
            <Calendar size={18} strokeWidth={1.75} />
            {formatDate(event.date)}
          </p>

          <div className="mt-8 flex flex-col gap-5 font-body text-lg leading-relaxed text-fabric-dark">
            {event.bodyHtml ? (
              <CmsRichText value={event.bodyHtml} />
            ) : (
              body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </div>

          {(event.credit || event.socialLinks) && (
            <div className="mt-10 flex flex-col gap-4 border-t border-dashed border-stitch-gray/40 pt-6">
              {event.credit && (
                <p className="font-body text-sm text-stitch-gray">
                  {event.credit}
                </p>
              )}
              {event.socialLinks && (
                <div className="flex flex-wrap items-center gap-5">
                  {event.socialLinks.facebook && (
                    <a
                      href={event.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      <ExternalLink size={16} strokeWidth={1.75} />
                      {copy.text6}
                    </a>
                  )}
                  {event.socialLinks.instagram && (
                    <a
                      href={event.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      <ExternalLink size={16} strokeWidth={1.75} />
                      {copy.text7}
                    </a>
                  )}
                  {event.socialLinks.email && (
                    <a
                      href={`mailto:${event.socialLinks.email}`}
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-trust-blue transition-colors hover:text-thread-red"
                    >
                      <Mail size={16} strokeWidth={1.75} />
                      {copy.text8}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="relative bg-linen-white py-16 md:py-20">
          <ThreadBorder
            color="green"
            edge="top"
            flip
            className="absolute left-[58%] top-0 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
          />
          <div className="mx-auto max-w-[1200px] px-6">
            <Reveal className="mb-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-trust-blue md:text-3xl">
                {copy.text9}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <Link
          to={copy.link10}
          className="inline-flex items-center gap-2 font-body font-medium text-trust-blue transition-colors hover:text-thread-red"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          {copy.text11}
        </Link>
      </div>
    </>
  );
}
