import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion, motion } from "framer-motion";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "../../lib/cms/domain";
import {
  moveFeaturedStory,
  scheduleFeaturedStoryAutoAdvance,
} from "../../lib/eventStories";
import { buttonVariants } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeaturedStoriesCarousel({
  stories,
  readStoryLabel,
}: {
  stories: Event[];
  readStoryLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const paused = hovered || focused;

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, stories.length - 1)));
  }, [stories.length]);

  useEffect(() => {
    return scheduleFeaturedStoryAutoAdvance({
      storyCount: stories.length,
      paused,
      reducedMotion: shouldReduceMotion,
      onAdvance: () =>
        setActiveIndex((index) => moveFeaturedStory(index, stories.length, 1)),
    });
  }, [activeIndex, paused, shouldReduceMotion, stories.length]);

  if (!stories.length) return null;

  const story = stories[activeIndex] ?? stories[0];
  const previous = () =>
    setActiveIndex((index) => moveFeaturedStory(index, stories.length, -1));
  const next = () =>
    setActiveIndex((index) => moveFeaturedStory(index, stories.length, 1));

  return (
    <Reveal className="relative mb-20">
      <section
        className="overflow-hidden rounded-[8px] bg-linen-white shadow-[0_8px_40px_rgba(46,74,143,0.1)]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured event stories"
        aria-live="off"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setFocused(false);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={story.id}
            className="relative"
            role="group"
            aria-roledescription="slide"
            aria-label={`${activeIndex + 1} of ${stories.length}`}
            initial={shouldReduceMotion !== false ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion !== false ? 0 : 0.25 }}
          >
            <img
              src={story.image}
              alt={story.imageAlt || `${story.title} featured story`}
              className="aspect-[16/9] w-full object-cover"
              loading={activeIndex === 0 ? "eager" : "lazy"}
            />
            <div className="flex flex-col gap-4 p-8 md:p-12">
              {story.organization && (
                <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-thread-red">
                  {story.organization}
                </span>
              )}
              <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-trust-blue md:text-4xl">
                {story.title}
              </h2>
              <p className="flex items-center gap-2 font-body text-sm text-stitch-gray">
                <Calendar size={16} strokeWidth={1.75} />
                {formatDate(story.date)}
              </p>
              <p className="max-w-[70ch] font-body text-lg leading-relaxed text-fabric-dark">
                {story.excerpt ?? story.description}
              </p>
              <Link
                to={`/events/${story.slug}`}
                className={`${buttonVariants({ variant: "primary" })} mt-2 self-center md:self-start`}
              >
                {readStoryLabel}
                <ArrowRight size={18} strokeWidth={1.75} />
              </Link>
            </div>
          </motion.article>
        </AnimatePresence>
        {stories.length > 1 && (
          <div className="events-carousel-controls">
            <button
              type="button"
              className="events-carousel-arrow"
              aria-label="Previous featured story"
              onClick={previous}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div className="events-carousel-dots" role="group" aria-label="Choose featured story">
              {stories.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="events-carousel-dot"
                  aria-label={`Show featured story ${index + 1}: ${item.title}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="events-carousel-arrow"
              aria-label="Next featured story"
              onClick={next}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </Reveal>
  );
}
