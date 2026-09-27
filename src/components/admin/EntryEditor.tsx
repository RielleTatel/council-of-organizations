import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bootstrapEntries, type Document } from "../../lib/cms/bootstrap";
import {
  entries,
  history,
  publishEntry,
  rpc,
  saveDraft,
  transitionEntry,
  type Draft,
  type Entry,
  type Revision,
} from "../../lib/cms/content";
import { publishedKey, useSingleton } from "../../lib/cms/public";
import { useEvents } from "../../hooks/useEvents";
import { MAX_FEATURED_STORIES } from "../../lib/eventStories";
import { Fields } from "./Fields";
import { StoryFeatureFields } from "./StoryFeatureFields";
import { entriesKey, entryStatus, entryTitle } from "./EntryList";

export function EntryEditor() {
  const { id } = useParams(),
    query = useQuery({ queryKey: entriesKey, queryFn: entries });
  if (query.isPending) return <p role="status">Loading editor…</p>;
  if (query.isError) return <p className="cms-error">{query.error.message}</p>;
  const entry = query.data.find((row) => row.id === id);
  if (!entry || entry.deleted_at)
    return (
      <p className="cms-empty">
        Content is missing or in trash.{" "}
        <Link to="/admin/trash">Open trash</Link>
      </p>
    );
  return (
    <DocumentEditor
      key={entry.id}
      initialEntry={entry}
      allEntries={query.data}
    />
  );
}
function DocumentEditor({
  initialEntry,
  allEntries,
}: {
  initialEntry: Entry;
  allEntries: Entry[];
}) {
  const [entry, setEntry] = useState(initialEntry),
    [document, setDocument] = useState<Document>(
      structuredClone(initialEntry.draft.document),
    );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [showHistory, setShowHistory] = useState(false);
  const { items: clusters } = useSingleton("clusters"),
    { data: publishedStories = [] } = useEvents(),
    cache = useQueryClient(),
    navigate = useNavigate();
  const revisions = useQuery({
    queryKey: ["cms", "admin", "history", entry.id],
    queryFn: () => history(entry.id),
    enabled: showHistory,
  });
  const dirty =
    JSON.stringify(document) !== JSON.stringify(entry.draft.document);
  const template =
    bootstrapEntries.find((row) => row.kind === entry.kind)?.document ??
    document;
  const reservedFeatured = new Map<string, number | undefined>();
  for (const story of publishedStories) {
    if (story.isFeatured) reservedFeatured.set(story.slug, story.featuredOrder);
  }
  for (const row of allEntries) {
    if (
      row.kind === "story" &&
      !row.deleted_at &&
      row.draft.document.isFeatured === true
    ) {
      const order = row.draft.document.featuredOrder;
      reservedFeatured.set(
        row.slug,
        typeof order === "number" ? order : undefined,
      );
    }
  }
  const otherFeaturedOrders = [...reservedFeatured.entries()]
    .filter(([slug]) => slug !== entry.slug)
    .map(([, order]) => order)
    .filter((order): order is number => typeof order === "number");
  const otherFeaturedCount = [...reservedFeatured.keys()].filter(
    (slug) => slug !== entry.slug,
  ).length;
  const featureLimitExceeded =
    entry.kind === "story" &&
    document.isFeatured === true &&
    otherFeaturedCount >= MAX_FEATURED_STORIES;
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);
  async function refresh() {
    const all = await entries(),
      latest = all.find((row) => row.id === entry.id);
    if (!latest) throw new Error("Content is missing.");
    setEntry(latest);
    setDocument(structuredClone(latest.draft.document));
  }
  async function act(
    action: "save" | "publish" | "unpublish" | "trash" | "reload",
    revision?: Revision,
  ) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (revision) {
        const draft = await rpc<Draft>("cms_restore_revision", {
          p_id: entry.id,
          p_revision_id: revision.id,
          p_expected_version: entry.draft.version,
        });
        setEntry({ ...entry, draft });
        setDocument(structuredClone(draft.document));
        setMessage("Revision restored into a draft. Publish to make it live.");
      } else if (action === "save") {
        const draft = await saveDraft(entry, document);
        setEntry({
          ...entry,
          slug: String(document.slug ?? entry.slug),
          draft,
        });
        setMessage("Draft saved. The published content stays as it was.");
      } else if (action === "publish") {
        await publishEntry(entry);
        setEntry({
          ...entry,
          ever_published: true,
          published_version: entry.draft.version,
        });
        setMessage("Published. Visitors can now see this version.");
      } else if (action === "reload") {
        await refresh();
        setMessage("Loaded the latest saved draft.");
      } else {
        await transitionEntry(entry, action);
        if (action === "trash") navigate(`/admin/content/${entry.kind}`);
        else {
          setEntry({ ...entry, published_version: null });
          setMessage("Unpublished. This entry is now a draft.");
        }
      }
      await Promise.all([
        cache.invalidateQueries({ queryKey: entriesKey }),
        cache.invalidateQueries({ queryKey: publishedKey }),
        cache.invalidateQueries({
          queryKey: ["cms", "admin", "history", entry.id],
        }),
      ]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const individual = entry.kind === "story" || entry.kind === "organization";
  return (
    <section>
      <Link to={`/admin/content/${entry.kind}`} className="cms-back">
        ← Back to content
      </Link>
      <div className="cms-heading">
        <div>
          <span className="cms-eyebrow">Content editor</span>
          <h1>{entryTitle(entry)}</h1>
          <p>
            <span className="cms-status">{entryStatus(entry)}</span> · Draft
            version {entry.draft.version}
            {dirty ? " · Unsaved changes" : ""}
          </p>
        </div>
      </div>
      {(entry.kind === "leadership" || entry.kind === "recweek") && (
        <p className="cms-note">
          Maintain one current{" "}
          {entry.kind === "leadership"
            ? "leadership roster"
            : "Recruitment Week campaign"}
          . All changes in this editor publish together.
        </p>
      )}
      <div className="cms-editor-actions cms-actions">
        <button
          className="cms-btn primary"
          disabled={busy || !dirty || featureLimitExceeded}
          onClick={() => void act("save")}
        >
          {busy ? "Working…" : "Save draft"}
        </button>
        <button
          className="cms-btn publish"
          disabled={busy || dirty || featureLimitExceeded}
          onClick={() => void act("publish")}
        >
          Publish
        </button>
        <button
          className="cms-btn quiet"
          disabled={busy}
          onClick={() => setShowHistory(!showHistory)}
        >
          History
        </button>
        <button
          className="cms-btn quiet"
          disabled={busy}
          onClick={() => void act("reload")}
        >
          Reload saved draft
        </button>
        {individual && entry.published_version !== null && (
          <button
            className="cms-btn quiet"
            disabled={busy || dirty}
            onClick={() => void act("unpublish")}
          >
            Unpublish
          </button>
        )}
        {individual && (
          <button
            className="cms-btn danger"
            disabled={busy || dirty}
            onClick={() => void act("trash")}
          >
            Move to trash
          </button>
        )}
      </div>
      {dirty && (
        <p className="cms-note">
          Save your changes before publishing or leaving this editor.
        </p>
      )}
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="cms-success" role="status">
          {message}
        </p>
      )}
      {featureLimitExceeded && (
        <p className="cms-error" role="alert">
          Five other stories are already featured. Remove this story from the
          carousel or unfeature another story before saving or publishing.
        </p>
      )}
      {showHistory && (
        <section className="cms-history">
          <h2>Publication history</h2>
          {revisions.isPending ? (
            <p>Loading history…</p>
          ) : revisions.isError ? (
            <p className="cms-error">{revisions.error.message}</p>
          ) : (
            <>
              {!revisions.data.length && <p>No publications yet.</p>}
              {revisions.data.map((revision) => (
                <article key={revision.id}>
                  <span>
                    {revision.action} ·{" "}
                    {new Date(revision.created_at).toLocaleString()}
                  </span>
                  <button
                    className="cms-btn"
                    disabled={busy || dirty}
                    onClick={() => void act("save", revision)}
                  >
                    Restore as draft
                  </button>
                </article>
              ))}
            </>
          )}
        </section>
      )}
      <fieldset className="cms-editor" disabled={busy}>
        {entry.kind === "story" && (
          <StoryFeatureFields
            isFeatured={document.isFeatured === true}
            featuredOrder={
              typeof document.featuredOrder === "number"
                ? document.featuredOrder
                : undefined
            }
            otherFeaturedCount={otherFeaturedCount}
            otherFeaturedOrders={otherFeaturedOrders}
            onChange={(value) => {
              setDocument((current) => ({ ...current, ...value }));
              setMessage("");
            }}
          />
        )}
        <Fields
          value={document}
          template={template}
          lockedSlug={entry.ever_published}
          clusters={clusters}
          onChange={(value) => {
            setDocument(value as Document);
            setMessage("");
          }}
        />
      </fieldset>
    </section>
  );
}
