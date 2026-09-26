import { describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { bootstrapEntries } from "./bootstrap";
import {
  imagePaths,
  imageDescriptions,
  importSql,
  prepareEntries,
  stableId,
} from "../../../scripts/cms/import";
import { publishedSitemap } from "../../../scripts/cms/sitemap";

describe("initial content import and sitemap", () => {
  it("uses stable IDs and imports all initial content once without replacing subsequent drafts", async () => {
    const db = new PGlite();
    try {
      await db.exec(
        `create role anon;create role authenticated;create role service_role;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$select null::uuid$$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(bucket_id text,name text);`,
      );
      await db.exec(
        readFileSync(
          new URL(
            "../../../supabase/migrations/20260926000100_cms.sql",
            import.meta.url,
          ),
          "utf8",
        ),
      );
      const prepared = prepareEntries(bootstrapEntries, new Map()),
        expectedId = stableId(bootstrapEntries[0].entry_id);
      expect(prepared[0].entry_id).toBe(expectedId);
      expect(
        (
          await db.query<{ imported: number }>(importSql, [
            JSON.stringify(prepared),
          ])
        ).rows[0].imported,
      ).toBe(49);
      await db.query(
        `update cms_drafts set document=jsonb_set(document,'{name}','"Staff edit"') where entry_id=$1`,
        [expectedId],
      );
      expect(
        (
          await db.query<{ imported: number }>(importSql, [
            JSON.stringify(prepared),
          ])
        ).rows[0].imported,
      ).toBe(0);
      expect(
        (
          await db.query<{ name: string }>(
            "select document->>'name' as name from cms_drafts where entry_id=$1",
            [expectedId],
          )
        ).rows[0].name,
      ).toBe("Staff edit");
      expect((await db.query("select * from cms_published")).rows).toHaveLength(
        49,
      );
    } finally {
      await db.close();
    }
  });
  it("finds editorial images and makes a published sitemap without admin or removed booth routes", () => {
    expect(imagePaths(bootstrapEntries)).toContain("/Icon.png");
    expect(
      imageDescriptions({
        gallery: [{ src: "/gallery/community.jpg", alt: "COA community" }],
        logo: "/logo.png",
        name: "COA",
      }),
    ).toEqual(
      new Map([
        ["/logo.png", "COA"],
        ["/gallery/community.jpg", "COA community"],
      ]),
    );
    const xml = publishedSitemap(
      [
        { kind: "story", slug: "new-story", published_at: "2026-09-26" },
        { kind: "organization", slug: "org" },
        { kind: "settings", slug: "settings" },
      ],
      "https://coa.example.com",
    );
    expect(xml).toContain("/events/new-story");
    expect(xml).toContain("/organizations/org");
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/recweek/map");
    expect(xml).not.toContain("/settings");
  });
});
