import type { SupabaseClient } from "@supabase/supabase-js";
import {
  bootstrapEntries,
  type Document,
  type EntryKind,
  type PublishedEntry,
} from "./bootstrap";
import {
  supabase,
  supabaseUrl,
  requireSupabase,
  configurationError,
} from "./client";

export interface Draft {
  entry_id: string;
  document: Document;
  version: number;
  updated_at: string;
}
export interface Entry {
  id: string;
  kind: EntryKind;
  slug: string;
  ever_published: boolean;
  published_version: number | null;
  deleted_at: string | null;
  updated_at: string;
  draft: Draft;
}
export interface Media {
  id: string;
  storage_path: string;
  filename: string;
  alt: string;
  mime_type: string;
  is_public: boolean;
}
export interface Staff {
  user_id: string;
  email: string;
  role: "owner" | "editor";
  active: boolean;
}
export interface Revision {
  id: string;
  document: Document;
  action: string;
  created_at: string;
}

export function resolveMedia(value: unknown, url: string): unknown {
  if (typeof value === "string" && /^media:[\da-f-]{36}$/i.test(value))
    return `${url}/functions/v1/cms-media?id=${value.slice(6)}`;
  if (Array.isArray(value)) return value.map((v) => resolveMedia(v, url));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, resolveMedia(v, url)]),
    );
  }
  return value;
}
function assertResult<T>(result: {
  data: T;
  error: { message: string } | null;
}): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
export function createContentModule(
  client: SupabaseClient | null,
  url: string,
  configurationError: string | null = null,
) {
  return {
    async published(): Promise<PublishedEntry[]> {
      if (configurationError) throw new Error(configurationError);
      if (!client) return structuredClone(bootstrapEntries);
      const data =
        assertResult(
          await client
            .from("cms_published")
            .select("*")
            .order("published_at", { ascending: true }),
        ) ?? [];
      return data.map((row) => ({
        ...row,
        document: resolveMedia(row.document, url),
      })) as PublishedEntry[];
    },
  };
}
export const contentModule = createContentModule(
  supabase,
  supabaseUrl,
  configurationError,
);
export async function entries(): Promise<Entry[]> {
  const data =
    assertResult(
      await requireSupabase()
        .from("cms_entries")
        .select("*,draft:cms_drafts(*)")
        .order("updated_at", { ascending: false }),
    ) ?? [];
  return data as Entry[];
}
export async function rpc<T>(
  name: string,
  params: Record<string, unknown>,
): Promise<T> {
  return assertResult(await requireSupabase().rpc(name, params)) as T;
}
export const saveDraft = (entry: Entry, document: Document) =>
  rpc<Draft>("cms_save_draft", {
    p_id: entry.id,
    p_expected_version: entry.draft.version,
    p_document: document,
  });
export const publishEntry = (entry: Entry) =>
  rpc<void>("cms_publish", {
    p_id: entry.id,
    p_expected_version: entry.draft.version,
  });
export const transitionEntry = (
  entry: Entry,
  action: "trash" | "restore" | "unpublish",
) =>
  rpc<void>("cms_transition", {
    p_id: entry.id,
    p_action: action,
    p_expected_version: entry.draft.version,
  });
export const history = async (id: string) =>
  (assertResult(
    await requireSupabase()
      .from("cms_history")
      .select("*")
      .eq("entry_id", id)
      .order("created_at", { ascending: false }),
  ) ?? []) as Revision[];
export const mediaLibrary = async () =>
  (assertResult(
    await requireSupabase()
      .from("cms_media")
      .select("*")
      .order("created_at", { ascending: false }),
  ) ?? []) as Media[];
export const listStaff = async () =>
  (assertResult(
    await requireSupabase().from("cms_staff").select("*").order("created_at"),
  ) ?? []) as Staff[];
export async function uploadImage(file: File, alt: string): Promise<Media> {
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Choose an image smaller than 10 MB.");
  const row = await rpc<Media>("cms_register_media", {
    p_filename: file.name,
    p_mime_type: file.type,
    p_alt: alt,
  });
  assertResult(
    await requireSupabase()
      .storage.from("cms-media")
      .upload(row.storage_path, file, {
        contentType: file.type,
        upsert: false,
      }),
  );
  return row;
}
export async function privateImage(media: Media): Promise<string> {
  const blob = assertResult(
    await requireSupabase()
      .storage.from("cms-media")
      .download(media.storage_path),
  );
  if (!blob) throw new Error("Image is unavailable.");
  return URL.createObjectURL(blob);
}
