export const MAX_FEATURED_STORIES = 5;
export const FEATURED_STORY_INTERVAL_MS = 4000;

export function moveFeaturedStory(
  currentIndex: number,
  storyCount: number,
  direction: -1 | 1,
): number {
  if (storyCount <= 0) return 0;
  return (currentIndex + direction + storyCount) % storyCount;
}

export function scheduleFeaturedStoryAutoAdvance({
  storyCount,
  paused,
  reducedMotion,
  onAdvance,
}: {
  storyCount: number;
  paused: boolean;
  reducedMotion: boolean | null;
  onAdvance: () => void;
}): () => void {
  if (storyCount < 2 || paused || reducedMotion !== false) return () => {};
  const timeout = setTimeout(onAdvance, FEATURED_STORY_INTERVAL_MS);
  return () => clearTimeout(timeout);
}

interface FeaturedStory {
  id: string;
  isFeatured: boolean;
  featuredOrder?: number;
}

export function canFeatureAnotherStory(occupiedCount: number): boolean {
  return occupiedCount < MAX_FEATURED_STORIES;
}

export function isValidFeaturePosition(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isFeaturePositionAvailable(
  position: unknown,
  otherPositions: number[],
): boolean {
  return (
    position === undefined ||
    position === null ||
    (isValidFeaturePosition(position) && !otherPositions.includes(position))
  );
}

function carouselPosition(order?: number): number {
  return isValidFeaturePosition(order)
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
