import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mediaLibrary,
  privateImage,
  rpc,
  uploadImage,
  type Media,
} from "../../lib/cms/content";

export function MediaThumbnail({ media }: { media: Media }) {
  const [url, setUrl] = useState(""),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    let objectUrl = "";
    setUrl("");
    setFailed(false);
    privateImage(media)
      .then((value) => {
        objectUrl = value;
        if (alive) setUrl(value);
        else URL.revokeObjectURL(value);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [media]);
  return url ? (
    <img src={url} alt={media.alt} loading="lazy" />
  ) : failed ? (
    <span className="cms-empty">
      Upload unavailable. Upload the file again.
    </span>
  ) : (
    <span className="cms-skeleton" aria-label="Loading image" />
  );
}
export function MediaLibrary({
  onSelect,
}: {
  onSelect?: (ref: string) => void;
}) {
  const cache = useQueryClient(),
    query = useQuery({
      queryKey: ["cms", "admin", "media"],
      queryFn: mediaLibrary,
    });
  const [alt, setAlt] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      await uploadImage(file, alt);
      setAlt("");
      await cache.invalidateQueries({ queryKey: ["cms", "admin", "media"] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <div className="cms-upload">
        <label className="cms-field">
          Image description
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for readers"
          />
        </label>
        <label className="cms-btn">
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={busy}
            onChange={(e) => {
              void upload(e.target.files?.[0]);
              e.target.value = "";
            }}
            className="cms-file"
          />
        </label>
        <p>
          JPEG, PNG, WebP, or GIF · up to 10 MB. New uploads remain private
          until published.
        </p>
      </div>
      {error && (
        <p className="cms-error" role="alert">
          {error}
        </p>
      )}
      {query.isError && (
        <p className="cms-error" role="alert">
          {query.error.message}
        </p>
      )}
      {query.isPending ? (
        <div className="cms-skeleton" />
      ) : !query.data?.length ? (
        <p className="cms-empty">
          Upload your first image to start the media library.
        </p>
      ) : (
        <div className="cms-media-grid">
          {query.data.map((media) => (
            <article key={media.id}>
              <MediaThumbnail media={media} />
              <p className="cms-media-name">{media.filename}</p>
              <span className="cms-status">
                {media.is_public ? "Published image" : "Private upload"}
              </span>
              <label className="cms-field">
                Description
                <input
                  defaultValue={media.alt}
                  onBlur={async (e) => {
                    try {
                      await rpc("cms_update_media", {
                        p_id: media.id,
                        p_alt: e.target.value,
                      });
                      await cache.invalidateQueries({
                        queryKey: ["cms", "admin", "media"],
                      });
                    } catch (e) {
                      setError((e as Error).message);
                    }
                  }}
                />
              </label>
              {onSelect && (
                <button
                  className="cms-btn"
                  type="button"
                  onClick={() => onSelect(`media:${media.id}`)}
                >
                  Use image
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const query = useQuery({
    queryKey: ["cms", "admin", "media"],
    queryFn: mediaLibrary,
  });
  const media = query.data?.find((item) => `media:${item.id}` === value);
  return (
    <div className="cms-image-field">
      {media ? (
        <MediaThumbnail media={media} />
      ) : value ? (
        <img src={value} alt="Selected image" />
      ) : null}
      <div className="cms-actions">
        <button
          className="cms-btn"
          type="button"
          onClick={() => setOpen(!open)}
        >
          {value ? "Change image" : "Choose image"}
        </button>
        {value && (
          <button
            className="cms-btn quiet"
            type="button"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        )}
      </div>
      {open && (
        <MediaLibrary
          onSelect={(ref) => {
            onChange(ref);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
