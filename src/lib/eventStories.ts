export const MAX_FEATURED_STORIES = 5;
export const FEATURED_STORY_INTERVAL_MS = 4000;

interface FeaturedStory {
  id: string;
  isFeatured: boolean;
  featuredOrder?: number;
}

export function canFeatureAnotherStory(occupiedCount: number): boolean {
  return occupiedCount < MAX_FEATURED_STORIES;
}

function carouselPosition(order?: number): number {
  return typeof order === "number" &&
    Number.isInteger(order) &&
    order >= 1 &&
    order <= MAX_FEATURED_STORIES
    ? order
    : Number.POSITIVE_INFINITY;
}

export function arrangeEventStories<T extends FeaturedStory>(stories: T[]) {
  const selected = stories
    .map((story, sourceOrder) => ({ story, sourceOrder }))
    .filter(({ story }) => story.isFeatured)
    .sort((left, right) => {
      const leftOrder = carouselPosition(left.story.featuredOrder);
      const rightOrder = carouselPosition(right.story.featuredOrder);
      return leftOrder === rightOrder
        ? left.sourceOrder - right.sourceOrder
        : leftOrder - rightOrder;
    })
    .slice(0, MAX_FEATURED_STORIES)
    .map(({ story }) => story);

  const featured = selected.length ? selected : stories.slice(0, 1);
  const featuredIds = new Set(featured.map((story) => story.id));

  return {
    featured,
    rest: stories.filter((story) => !featuredIds.has(story.id)),
  };
}
