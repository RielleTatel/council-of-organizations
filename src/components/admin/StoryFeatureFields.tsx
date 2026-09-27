import {
  canFeatureAnotherStory,
  FEATURED_STORY_INTERVAL_MS,
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
  const order =
    typeof featuredOrder === "number" &&
    Number.isInteger(featuredOrder) &&
    featuredOrder >= 1 &&
    featuredOrder <= MAX_FEATURED_STORIES
      ? featuredOrder
      : undefined;

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
              featuredOrder: nextFeatured
                ? (order ?? availablePosition ?? 1)
                : featuredOrder,
            });
          }}
        />
        Show this story in the feature carousel
      </label>
      {!isFeatured && !canFeature && (
        <p className="cms-feature-limit" role="status">
          All {MAX_FEATURED_STORIES} feature positions are in use. Unfeature
          another story before adding this one.
        </p>
      )}
      <label className="cms-field">
        Carousel position
        <select
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
        >
          <option value="">After numbered stories</option>
          {Array.from({ length: MAX_FEATURED_STORIES }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              Position {index + 1}
            </option>
          ))}
        </select>
      </label>
      <p className="cms-feature-help">
        Lower positions appear first. Stories with the same or blank position
        follow their published story order.
      </p>
    </section>
  );
}
