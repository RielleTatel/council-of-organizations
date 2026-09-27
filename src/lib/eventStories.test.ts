import { describe, expect, it, vi } from "vitest";
import {
  arrangeEventStories,
  canFeatureAnotherStory,
  FEATURED_STORY_INTERVAL_MS,
  isFeaturePositionAvailable,
  moveFeaturedStory,
  scheduleFeaturedStoryAutoAdvance,
  isValidFeaturePosition,
  MAX_FEATURED_STORIES,
} from "./eventStories";

function story(id: string, isFeatured = false, featuredOrder?: number) {
  return { id, slug: id, isFeatured, featuredOrder };
}

describe("featured event stories", () => {
  it("orders featured stories manually, caps the carousel at five, and leaves the rest in the story list", () => {
    const stories = [
      story("published-first", true, 4),
      story("unfeatured"),
      story("published-second", true, 1),
      story("third", true, 2),
      story("fourth", true, 3),
      story("fifth", true, 5),
      story("overflow", true, 6),
    ];

    const result = arrangeEventStories(stories);

    expect(result.featured.map(({ id }) => id)).toEqual([
      "published-second",
      "third",
      "fourth",
      "published-first",
      "fifth",
    ]);
    expect(result.rest.map(({ id }) => id)).toEqual([
      "unfeatured",
      "overflow",
    ]);
  });

  it("uses the first published story as the feature when none are selected", () => {
    const result = arrangeEventStories([story("first"), story("second")]);

    expect(result.featured.map(({ id }) => id)).toEqual(["first"]);
    expect(result.rest.map(({ id }) => id)).toEqual(["second"]);
  });

  it("uses publication order to break equal or blank carousel positions", () => {
    const result = arrangeEventStories([
      story("first-published", true, 1),
      story("second-published", true, 1),
      story("ranked-second", true, 2),
      story("unranked", true),
    ]);

    expect(result.featured.map(({ id }) => id)).toEqual([
      "first-published",
      "second-published",
      "ranked-second",
      "unranked",
    ]);
  });

  it("allows editors to select up to five stories", () => {
    expect(MAX_FEATURED_STORIES).toBe(5);
    expect(FEATURED_STORY_INTERVAL_MS).toBe(4000);
    expect(canFeatureAnotherStory(4)).toBe(true);
    expect(canFeatureAnotherStory(5)).toBe(false);
  });

  it("accepts free-form nonnegative positions and detects collisions", () => {
    expect(isValidFeaturePosition(1.5)).toBe(true);
    expect(isValidFeaturePosition(-0.1)).toBe(false);
    expect(isValidFeaturePosition(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isFeaturePositionAvailable(1.5, [1, 2])).toBe(true);
    expect(isFeaturePositionAvailable(1, [1, 2])).toBe(false);
    expect(isFeaturePositionAvailable(undefined, [1, 2])).toBe(true);
  });

  it("auto-advances once after four seconds and cancels the timer when paused", () => {
    vi.useFakeTimers();
    try {
      const onAdvance = vi.fn();
      const stop = scheduleFeaturedStoryAutoAdvance({
        storyCount: 2,
        paused: false,
        reducedMotion: false,
        onAdvance,
      });

      vi.advanceTimersByTime(FEATURED_STORY_INTERVAL_MS - 1);
      expect(onAdvance).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(onAdvance).toHaveBeenCalledOnce();
      stop();

      const pausedAdvance = vi.fn();
      const stopPaused = scheduleFeaturedStoryAutoAdvance({
        storyCount: 2,
        paused: false,
        reducedMotion: false,
        onAdvance: pausedAdvance,
      });
      stopPaused();
      vi.advanceTimersByTime(FEATURED_STORY_INTERVAL_MS);
      expect(pausedAdvance).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps autoplay disabled for pause, reduced motion, unknown motion preference, and one story", () => {
    vi.useFakeTimers();
    try {
      for (const options of [
        { storyCount: 2, paused: true, reducedMotion: false },
        { storyCount: 2, paused: false, reducedMotion: true },
        { storyCount: 2, paused: false, reducedMotion: null },
        { storyCount: 1, paused: false, reducedMotion: false },
      ]) {
        const onAdvance = vi.fn();
        scheduleFeaturedStoryAutoAdvance({ ...options, onAdvance });
        vi.advanceTimersByTime(FEATURED_STORY_INTERVAL_MS);
        expect(onAdvance).not.toHaveBeenCalled();
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it("wraps previous and next navigation around the featured story list", () => {
    expect(moveFeaturedStory(0, 3, -1)).toBe(2);
    expect(moveFeaturedStory(2, 3, 1)).toBe(0);
    expect(moveFeaturedStory(0, 0, 1)).toBe(0);
  });
});
