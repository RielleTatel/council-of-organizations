import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Events from "./Events";
import { useEvents } from "../hooks/useEvents";

vi.mock("../components/Seo", () => ({ Seo: () => null }));
vi.mock("../components/ui/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) =>
    createElement("div", null, children),
}));
vi.mock("../hooks/useEvents", () => ({ useEvents: vi.fn() }));
vi.mock("../lib/cms/public", () => ({
  CmsRichText: ({ value }: { value: string }) => value,
  useCmsCopy: () => ({
    title0: "Event highlights",
    description1: "Stories from the community",
    eyebrow2: "Stories",
    title3: "Celebrating our community",
    badge4: "Featured",
    description5: "Read what organizations have been doing.",
    paragraph6: "Stories coming soon.",
    text7: "Read Story",
    text8: "More stories",
  }),
}));

const stories = [
  {
    id: "story-one",
    title: "First featured story",
    slug: "first-featured-story",
    date: "2026-08-03",
    description: "A story from the first organization.",
    image: "/story-one.jpg",
    imageAlt: "Students at the first event",
    isFeatured: true,
    featuredOrder: 1,
    isFlagship: false,
  },
  {
    id: "story-two",
    title: "Second featured story",
    slug: "second-featured-story",
    date: "2026-08-04",
    description: "A story from the second organization.",
    image: "/story-two.jpg",
    imageAlt: "Students at the second event",
    isFeatured: true,
    featuredOrder: 2,
    isFlagship: false,
  },
];

describe("/events featured stories", () => {
  beforeEach(() => {
    vi.mocked(useEvents).mockReturnValue({ data: stories, isLoading: false } as ReturnType<typeof useEvents>);
  });

  it("renders the carousel, current published story, and navigation to its story page", () => {
    const html = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        { initialEntries: ["/events"] },
        createElement(Events),
      ),
    );

    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain('aria-label="Featured event stories"');
    expect(html).toContain("First featured story");
    expect(html).toContain('href="/events/first-featured-story"');
    expect(html).toContain('aria-label="Next featured story"');
    expect(html).toContain('aria-label="Show featured story 2: Second featured story"');
  });
});
