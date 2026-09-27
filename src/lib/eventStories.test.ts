import { describe, expect, it } from "vitest";
import {
  arrangeEventStories,
  canFeatureAnotherStory,
  FEATURED_STORY_INTERVAL_MS,
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
});
