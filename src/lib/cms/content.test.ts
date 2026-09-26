import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createContentModule, resolveMedia } from "./content";
import { bootstrapEntries } from "./bootstrap";

const url = "https://cms.example.com",
  id = "00000000-0000-4000-8000-000000000003";
const client = (fetcher: typeof fetch) =>
  createClient(url, "public-key", {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetcher },
  });
describe("published content module", () => {
  it("preserves every current profile and returns independent bootstrap snapshots before configuration", async () => {
    const module = createContentModule(null, ""),
      first = await module.published();
    expect(first.filter((row) => row.kind === "organization")).toHaveLength(41);
    expect(first.filter((row) => row.kind === "story")).toHaveLength(2);
    expect(first).toEqual(bootstrapEntries);
    first[0].document.name = "Changed";
    expect((await module.published())[0].document.name).not.toBe("Changed");
  });
  it("reads only published snapshots and resolves nested media URLs and descriptions", async () => {
    const transport: typeof fetch = async (input) =>
      new URL(String(input)).pathname.includes("cms_published")
        ? Response.json([
            {
              entry_id: id,
              kind: "story",
              slug: "live",
              document: {
                title: "Live",
                image: `media:${id}`,
                imageAlt: "Students meeting",
              },
            },
          ])
        : Response.json([{ id, alt: "Students meeting" }]);
    const [record] = await createContentModule(
      client(transport),
      url,
    ).published();
    expect(record.document.image).toBe(
      `${url}/functions/v1/cms-media?id=${id}`,
    );
    expect(record.document.imageAlt).toBe("Students meeting");
    expect(
      resolveMedia(
        { gallery: [{ src: `media:${id}`, alt: "Specific caption" }] },
        url,
      ),
    ).toEqual({
      gallery: [
        {
          src: `${url}/functions/v1/cms-media?id=${id}`,
          alt: "Specific caption",
        },
      ],
    });
  });
  it("reports a configured backend failure instead of substituting approved bootstrap content", async () => {
    const transport: typeof fetch = async () =>
      Response.json({ message: "CMS is offline" }, { status: 400 });
    await expect(
      createContentModule(client(transport), url).published(),
    ).rejects.toThrow("CMS is offline");
  });
});
