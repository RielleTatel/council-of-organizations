import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { StoryFeatureFields } from "./StoryFeatureFields";

describe("story feature editor controls", () => {
  it("lets an editor feature and assign a fractional manual position", () => {
    const html = renderToStaticMarkup(
      createElement(StoryFeatureFields, {
        isFeatured: true,
        featuredOrder: 1.5,
        otherFeaturedCount: 2,
        otherFeaturedOrders: [1, 2],
        onChange: vi.fn(),
      }),
    );

    expect(html).toContain('type="checkbox" checked=""');
    expect(html).toContain('type="number" min="0" step="any" value="1.5"');
    expect(html).toContain("decimals let you insert between stories");
  });

  it("blocks adding a sixth featured story", () => {
    const html = renderToStaticMarkup(
      createElement(StoryFeatureFields, {
        isFeatured: false,
        otherFeaturedCount: 5,
        otherFeaturedOrders: [1, 2, 3, 4, 5],
        onChange: vi.fn(),
      }),
    );

    expect(html).toContain('type="checkbox" disabled=""');
    expect(html).toContain("5 stories are already featured");
  });

  it("warns when a featured story is assigned an occupied position", () => {
    const html = renderToStaticMarkup(
      createElement(StoryFeatureFields, {
        isFeatured: true,
        featuredOrder: 2,
        otherFeaturedCount: 2,
        otherFeaturedOrders: [1, 2],
        onChange: vi.fn(),
      }),
    );

    expect(html).toContain("Another featured story already uses this position");
  });
});
