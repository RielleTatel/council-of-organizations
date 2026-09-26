import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { blankDocument, singletonDefaults } from "./bootstrap";

const owner = "00000000-0000-0000-0000-000000000001";
const editor = "00000000-0000-0000-0000-000000000002";
let db: PGlite;
async function asStaff(id: string, sql: string) {
  await db.exec(
    `set role authenticated; select set_config('request.jwt.claim.sub', '${id}', false)`,
  );
  try {
    return await db.query(sql);
  } finally {
    await db.exec(
      "reset role; select set_config('request.jwt.claim.sub', '', false)",
    );
  }
}
const json = (value: unknown) =>
  `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
async function create(kind: string, slug: string, document: unknown) {
  const result = await asStaff(
    editor,
    `select to_jsonb(cms_create_entry('${kind}','${slug}',${json(document)})) as entry`,
  );
  return (result.rows[0] as { entry: { id: string } }).entry.id;
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema public, auth, storage to anon, authenticated;
    grant select, insert on storage.objects to anon, authenticated;
    insert into auth.users values ('${owner}', 'owner@example.com'), ('${editor}', 'editor@example.com');
  `);
  await db.exec(
    readFileSync(
      new URL(
        "../../../supabase/migrations/20260926000100_cms.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.exec(
    `insert into cms_staff(user_id,email,role) values ('${owner}','owner@example.com','owner'),('${editor}','editor@example.com','editor')`,
  );
});
afterAll(async () => {
  await db?.close();
});

describe("CMS database interface", () => {
  it("keeps drafts private and preserves the live version until explicit publication", async () => {
    const created = await asStaff(
      editor,
      `select to_jsonb(cms_create_entry('story', 'first-story', ${json({ ...blankDocument("story", "first-story"), title: "Original" })})) as entry`,
    );
    const id = (created.rows[0] as { entry: { id: string } }).entry.id;
    await asStaff(editor, `select cms_publish('${id}', 1)`);
    await asStaff(
      editor,
      `select cms_save_draft('${id}', 1, ${json({ ...blankDocument("story", "first-story"), title: "Secret draft" })})`,
    );
    await db.exec("set role anon");
    try {
      const live = await db.query<{ document: { title: string } }>(
        "select document from cms_published",
      );
      expect(live.rows[0].document.title).toBe("Original");
      await expect(
        db.query("select document from cms_drafts"),
      ).rejects.toThrow();
    } finally {
      await db.exec("reset role");
    }
    await asStaff(editor, `select cms_publish('${id}', 2)`);
    expect(
      (
        await db.query<{ document: { title: string } }>(
          "select document from cms_published",
        )
      ).rows[0].document.title,
    ).toBe("Secret draft");
  });

  it("rejects stale saves and publishes without changing the newer draft", async () => {
    const document = { title: "First", slug: "conflict" },
      id = await create("story", "conflict", document);
    await asStaff(
      editor,
      `select cms_save_draft('${id}',1,${json({ ...document, title: "Second" })})`,
    );
    await expect(
      asStaff(
        editor,
        `select cms_save_draft('${id}',1,${json({ ...document, title: "Lost" })})`,
      ),
    ).rejects.toThrow("newer draft");
    await expect(
      asStaff(editor, `select cms_publish('${id}',1)`),
    ).rejects.toThrow("newer draft");
    expect(
      (
        await db.query<{ document: { title: string } }>(
          `select document from cms_drafts where entry_id='${id}'`,
        )
      ).rows[0].document.title,
    ).toBe("Second");
  });

  it("publishes a whole roster with history and restores history only into a draft", async () => {
    const roster = {
        ...singletonDefaults.leadership,
        members: [{ name: "Alice" }],
        offices: [{ name: "Council" }],
      },
      id = await create("leadership", "leadership", roster);
    await asStaff(editor, `select cms_publish('${id}',1)`);
    const revision = (
      await db.query<{ id: string }>(
        `select id from cms_history where entry_id='${id}'`,
      )
    ).rows[0].id;
    await asStaff(
      editor,
      `select cms_save_draft('${id}',1,${json({ ...roster, members: [{ name: "Bob" }] })})`,
    );
    await asStaff(editor, `select cms_publish('${id}',2)`);
    await asStaff(
      editor,
      `select cms_restore_revision('${id}','${revision}',2)`,
    );
    const live = (
      await db.query<{ document: typeof roster }>(
        `select document from cms_published where entry_id='${id}'`,
      )
    ).rows[0].document;
    const draft = (
      await db.query<{ document: typeof roster; version: number }>(
        `select document,version from cms_drafts where entry_id='${id}'`,
      )
    ).rows[0];
    expect(live.members[0].name).toBe("Bob");
    expect(draft.document.members[0].name).toBe("Alice");
    expect(draft.version).toBe(3);
  });

  it("keeps uploads private and rolls back a publication with a missing image", async () => {
    const uploaded = await asStaff(
      editor,
      `select to_jsonb(cms_register_media('photo.jpg','image/jpeg','An event')) as media`,
    );
    const media = (
      uploaded.rows[0] as { media: { id: string; storage_path: string } }
    ).media;
    const id = await create("story", "image-story", {
      ...blankDocument("story", "image-story"),
      title: "Story",
      slug: "image-story",
      image: `media:${media.id}`,
    });
    await expect(
      asStaff(editor, `select cms_publish('${id}',1)`),
    ).rejects.toThrow("uploading");
    expect(
      (
        await db.query<{ is_public: boolean }>(
          `select is_public from cms_media where id='${media.id}'`,
        )
      ).rows[0].is_public,
    ).toBe(false);
    expect(
      (await db.query(`select * from cms_history where entry_id='${id}'`)).rows,
    ).toHaveLength(0);
    await db.exec("set role anon");
    try {
      expect(
        (
          await db.query(
            `select id,is_public from cms_media where id='${media.id}'`,
          )
        ).rows,
      ).toHaveLength(0);
    } finally {
      await db.exec("reset role");
    }
    await asStaff(
      editor,
      `insert into storage.objects(bucket_id,name) values('cms-media','${media.storage_path}')`,
    );
    await asStaff(editor, `select cms_publish('${id}',1)`);
    await db.exec("set role anon");
    try {
      expect(
        (
          await db.query(
            `select id,is_public from cms_media where id='${media.id}'`,
          )
        ).rows,
      ).toHaveLength(1);
      expect(
        (
          await db.query(
            `select * from storage.objects where name='${media.storage_path}'`,
          )
        ).rows,
      ).toHaveLength(1);
    } finally {
      await db.exec("reset role");
    }
  });

  it("trashes and restores an entry without silently republishing it or changing its URL", async () => {
    const document = {
        ...blankDocument("story", "trash-story"),
        title: "Trash me",
        slug: "trash-story",
      },
      id = await create("story", "trash-story", document);
    await asStaff(editor, `select cms_publish('${id}',1)`);
    await expect(
      asStaff(
        editor,
        `select cms_save_draft('${id}',1,${json({ ...document, slug: "changed" })})`,
      ),
    ).rejects.toThrow("permanent");
    await asStaff(editor, `select cms_transition('${id}','trash',1)`);
    await expect(
      asStaff(editor, `select cms_publish('${id}',1)`),
    ).rejects.toThrow("trash");
    await asStaff(editor, `select cms_transition('${id}','restore',1)`);
    expect(
      (await db.query(`select * from cms_published where entry_id='${id}'`))
        .rows,
    ).toHaveLength(0);
    await asStaff(editor, `select cms_publish('${id}',1)`);
    expect(
      (await db.query(`select * from cms_published where entry_id='${id}'`))
        .rows,
    ).toHaveLength(1);
  });

  it("protects the last owner and denies editor account administration and direct writes", async () => {
    await expect(
      asStaff(owner, `select cms_manage_staff('${owner}','editor',true)`),
    ).rejects.toThrow("at least one");
    await expect(
      asStaff(owner, `select cms_manage_staff('${owner}','owner',false)`),
    ).rejects.toThrow("at least one");
    await expect(
      asStaff(editor, `select cms_manage_staff('${owner}','editor',true)`),
    ).rejects.toThrow("owner");
    await expect(
      asStaff(editor, `update cms_published set document='{}'`),
    ).rejects.toThrow("permission denied");
    await asStaff(owner, `select cms_manage_staff('${editor}','owner',true)`);
    await asStaff(owner, `select cms_manage_staff('${editor}','editor',true)`);
  });

  it("revokes existing sessions immediately for every staff operation and private read", async () => {
    await asStaff(owner, `select cms_manage_staff('${editor}','editor',false)`);
    await expect(
      asStaff(
        editor,
        `select cms_create_entry('story','revoked','{"title":"Hidden","slug":"revoked"}')`,
      ),
    ).rejects.toThrow("staff");
    expect(
      (await asStaff(editor, "select * from cms_drafts")).rows,
    ).toHaveLength(0);
    await expect(
      asStaff(
        editor,
        `select cms_register_media('photo.jpg','image/jpeg','Photo')`,
      ),
    ).rejects.toThrow("staff");
    await asStaff(owner, `select cms_manage_staff('${editor}','editor',true)`);
  });
  it("snapshots image descriptions and hides pending library metadata from anonymous reads", async () => {
    const registered = await asStaff(
      editor,
      "select cms_register_media('caption.jpg','image/jpeg','Approved caption') as media",
    );
    const media = (
      registered.rows[0] as { media: { id: string; storage_path: string } }
    ).media;
    await asStaff(
      editor,
      `insert into storage.objects(bucket_id,name) values('cms-media','${media.storage_path}')`,
    );
    const id = await create("story", "caption-story", {
      ...blankDocument("story", "caption-story"),
      title: "Caption story",
      image: `media:${media.id}`,
      imageAlt: "",
    });
    await asStaff(editor, `select cms_publish('${id}',1)`);
    await asStaff(
      editor,
      `select cms_update_media('${media.id}','Pending caption')`,
    );
    await db.exec("set role anon");
    try {
      expect(
        (
          await db.query<{ document: { imageAlt: string } }>(
            `select document from cms_published where entry_id='${id}'`,
          )
        ).rows[0].document.imageAlt,
      ).toBe("Approved caption");
      await expect(
        db.query(`select alt from cms_media where id='${media.id}'`),
      ).rejects.toThrow("permission denied");
    } finally {
      await db.exec("reset role");
    }
    await asStaff(editor, `select cms_publish('${id}',1)`);
    expect(
      (
        await db.query<{ document: { imageAlt: string } }>(
          `select document from cms_published where entry_id='${id}'`,
        )
      ).rows[0].document.imageAlt,
    ).toBe("Pending caption");
  });
});
