import {
  canFeatureAnotherStory,
  FEATURED_STORY_INTERVAL_MS,
  isFeaturePositionAvailable,
  isValidFeaturePosition,
  MAX_FEATURED_STORIES,
} from "../../lib/eventStories";

interface StoryFeatureFieldsProps {
  isFeatured: boolean;
  featuredOrder?: number;
  otherFeaturedCount: number;
  otherFeaturedOrders: number[];
  onChange: (value: { isFeatured: boolean; featuredOrder?: number }) => void;
}

export function StoryFeatureFields({
  isFeatured,
  featuredOrder,
  otherFeaturedCount,
  otherFeaturedOrders,
  onChange,
}: StoryFeatureFieldsProps) {
  const canFeature = canFeatureAnotherStory(otherFeaturedCount);
  const availablePosition = Array.from(
    { length: MAX_FEATURED_STORIES },
    (_, index) => index + 1,
  ).find((position) => !otherFeaturedOrders.includes(position));
  const positionIsValid = isValidFeaturePosition(featuredOrder);
  const positionIsAvailable = isFeaturePositionAvailable(
    featuredOrder,
    otherFeaturedOrders,
  );
  const order = positionIsValid ? featuredOrder : undefined;
  const nextPosition =
    positionIsAvailable && order !== undefined
      ? order
      : (availablePosition ?? 1);

  return (
    <section
      className="cms-feature-settings"
      aria-labelledby="story-feature-title"
    >
      <h2 id="story-feature-title">Events page feature carousel</h2>
      <p>
        Feature up to {MAX_FEATURED_STORIES} stories. They rotate every{" "}
        {FEATURED_STORY_INTERVAL_MS / 1000} seconds after this story is
        published.
      </p>
      <label className="cms-check">
        <input
          type="checkbox"
          checked={isFeatured}
          disabled={!isFeatured && !canFeature}
          onChange={(event) => {
            const nextFeatured = event.target.checked;
            onChange({
              isFeatured: nextFeatured,
              featuredOrder: nextFeatured ? nextPosition : featuredOrder,
            });
          }}
        />
        Show this story in the feature carousel
      </label>
      {!isFeatured && !canFeature && (
        <p className="cms-feature-limit" role="status">
        {MAX_FEATURED_STORIES} stories are already featured. Unfeature
        another story before adding this one.
        </p>
      )}
      <label className="cms-field">
        Carousel position
        <input
          type="number"
          min="0"
          step="any"
          value={order ?? ""}
          disabled={!isFeatured}
          onChange={(event) =>
            onChange({
              isFeatured,
              featuredOrder: event.target.value
                ? Number(event.target.value)
                : undefined,
            })
          }
        />
      </label>
      <p className="cms-feature-help">
        Lower positions appear first. Use a unique number; decimals let you
        insert between stories. Leave blank to place this after numbered
        stories.
      </p>
      {isFeatured && !positionIsAvailable && (
        <p className="cms-feature-limit" role="alert">
          Another featured story already uses this position. Choose a different
          number before saving.
        </p>
      )}
      {isFeatured && featuredOrder !== undefined && !positionIsValid && (
        <p className="cms-feature-limit" role="alert">
          Position must be a finite, nonnegative number.
        </p>
      )}
    </section>
  );
}
