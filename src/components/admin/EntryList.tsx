import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  blankDocument,
  kindLabels,
  type EntryKind,
} from "../../lib/cms/bootstrap";
import {
  entries,
  rpc,
  transitionEntry,
  type Entry,
} from "../../lib/cms/content";

export const entriesKey = ["cms", "admin", "entries"] as const;
export const entryTitle = (entry: Entry) =>
  String(
    entry.draft.document.name ||
      entry.draft.document.title ||
      kindLabels[entry.kind],
  );
export const entryStatus = (entry: Entry) =>
  entry.deleted_at
    ? "In trash"
    : entry.published_version === null
      ? "Draft"
      : entry.published_version === entry.draft.version
        ? "Published"
        : "Published · draft changes";
export function EntryList({ trash = false }: { trash?: boolean }) {
  const { kind = "organization" } = useParams(),
    navigate = useNavigate(),
    cache = useQueryClient(),
    query = useQuery({ queryKey: entriesKey, queryFn: entries });
  const [search, setSearch] = useState(""),
    [slug, setSlug] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const selected = kind as EntryKind;
  if (!trash && !(selected in kindLabels)) return <p>Unknown content area.</p>;
  const rows = (query.data ?? []).filter(
    (row) =>
      (trash ? !!row.deleted_at : !row.deleted_at && row.kind === selected) &&
      entryTitle(row).toLowerCase().includes(search.toLowerCase()),
  );
  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const row = await rpc<Entry>("cms_create_entry", {
        p_kind: selected,
        p_slug: slug,
        p_document: blankDocument(selected as "organization" | "story", slug),
      });
      await cache.invalidateQueries({ queryKey: entriesKey });
      navigate(`/admin/edit/${row.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function restore(entry: Entry) {
    try {
      await transitionEntry(entry, "restore");
      await cache.invalidateQueries({ queryKey: entriesKey });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <section>
      <div className="cms-heading">
        <div>
          <span className="cms-eyebrow">Website content</span>
          <h1>{trash ? "Trash" : kindLabels[selected]}</h1>
          <p>
            {trash
              ? "Restore entries as drafts, then publish when ready."
              : "Save a draft to prepare changes. Publish when you want visitors to see them."}
          </p>
        </div>
      </div>
      <label className="cms-field cms-search">
        Search
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find content…"
        />
      </label>
      {!trash && (selected === "organization" || selected === "story") && (
        <form className="cms-create cms-actions" onSubmit={create}>
          <label className="cms-field">
            New URL slug
            <input
              required
              pattern="[a-z0-9][a-z0-9-]*"
              placeholder="new-story"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <button className="cms-btn primary" disabled={busy}>
            Create draft
          </button>
        </form>
      )}
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      {query.isError && (
        <p className="cms-error" role="alert">
          {query.error.message}
          <button className="cms-btn" onClick={() => void query.refetch()}>
            Retry
          </button>
        </p>
      )}
      {query.isPending ? (
        <p role="status">Loading content…</p>
      ) : (
        <div className="cms-entry-list">
          {rows.map((entry) => (
            <article key={entry.id}>
              <div>
                <h2>{entryTitle(entry)}</h2>
                <p>
                  {entry.kind === "organization"
                    ? "/organizations/"
                    : entry.kind === "story"
                      ? "/events/"
                      : ""}
                  {entry.slug}
                </p>
                <span className="cms-status">{entryStatus(entry)}</span>
              </div>
              {trash ? (
                <button className="cms-btn" onClick={() => void restore(entry)}>
                  Restore draft
                </button>
              ) : (
                <Link className="cms-btn" to={`/admin/edit/${entry.id}`}>
                  Edit content
                </Link>
              )}
            </article>
          ))}
          {!rows.length && !query.isError && (
            <p className="cms-empty">
              {trash
                ? "The trash is empty."
                : "No content matches your search."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
