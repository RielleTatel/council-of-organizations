import type { ClusterMeta } from "../../config/clusters";
import { RichEditor } from "./RichEditor";
import { ImageField } from "./MediaLibrary";

const labelOf = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\D)(\d)/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Html$/, "formatted");
function blankLike(value: unknown, key = ""): unknown {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, blankLike(v, k)]),
    );
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  if (key === "id") return crypto.randomUUID();
  if (key === "color") return value;
  return "";
}
interface FieldsProps {
  value: unknown;
  onChange: (value: unknown) => void;
  template?: unknown;
  name?: string;
  path?: string;
  lockedSlug?: boolean;
  clusters?: ClusterMeta[];
}
export function Fields({
  value,
  onChange,
  template,
  name = "Content",
  path = "",
  lockedSlug = false,
  clusters = [],
}: FieldsProps) {
  const textLabel =
    /^(text|paragraph|alt|image|link|title|description|eyebrow|badge)\d+$/.test(
      name,
    );
  const baseLabel = labelOf(
    textLabel
      ? name
          .replace(/\d+$/, "")
          .replace("alt", "Image description")
          .replace("link", "Link destination")
      : name,
  );
  const excerpt =
    typeof template === "string"
      ? template.replace(/<[^>]+>/g, "").slice(0, 64)
      : "";
  const label =
    textLabel && excerpt && !name.startsWith("image")
      ? `${baseLabel} — ${excerpt}${excerpt.length === 64 ? "…" : ""}`
      : baseLabel;
  const shared = { lockedSlug, clusters };
  if (Array.isArray(value)) {
    const itemTemplate = Array.isArray(template) ? template[0] : undefined;
    return (
      <fieldset className="cms-array">
        <legend>
          {label} <span>{value.length}</span>
        </legend>
        {value.map((item, i) => (
          <details key={i} className="cms-list-item" open={value.length < 4}>
            <summary>
              {item && typeof item === "object"
                ? String(
                    item.name ||
                      item.title ||
                      item.question ||
                      `${label} ${i + 1}`,
                  )
                : `${label} ${i + 1}`}
            </summary>
            <div className="cms-actions">
              <button
                type="button"
                className="cms-btn quiet"
                disabled={i === 0}
                onClick={() => {
                  const next = [...value];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
              >
                Move up
              </button>
              <button
                type="button"
                className="cms-btn quiet"
                disabled={i === value.length - 1}
                onClick={() => {
                  const next = [...value];
                  [next[i], next[i + 1]] = [next[i + 1], next[i]];
                  onChange(next);
                }}
              >
                Move down
              </button>
              <button
                type="button"
                className="cms-btn quiet"
                onClick={() =>
                  onChange(value.filter((_, index) => index !== i))
                }
              >
                Remove
              </button>
            </div>
            <Fields
              {...shared}
              name={`Item ${i + 1}`}
              value={item}
              template={itemTemplate}
              path={`${path}.${i}`}
              onChange={(next) =>
                onChange(value.map((old, index) => (index === i ? next : old)))
              }
            />
          </details>
        ))}
        <button
          className="cms-btn"
          type="button"
          onClick={() =>
            onChange([...value, blankLike(itemTemplate ?? value[0] ?? "")])
          }
        >
          Add {label.toLowerCase().replace(/s$/, "")}
        </button>
      </fieldset>
    );
  }
  if (value && typeof value === "object") {
    if (name === "cluster")
      return (
        <label className="cms-field">
          Cluster
          <select
            value={(value as { slug: string }).slug}
            onChange={(e) => {
              const cluster = clusters.find(
                (item) => item.slug === e.target.value,
              );
              if (cluster)
                onChange({
                  id: cluster.slug,
                  slug: cluster.slug,
                  name: cluster.name,
                });
            }}
          >
            {clusters.map((cluster) => (
              <option key={cluster.slug} value={cluster.slug}>
                {cluster.name}
              </option>
            ))}
          </select>
        </label>
      );
    const source = value as Record<string, unknown>,
      schema = (template ?? {}) as Record<string, unknown>;
    return (
      <div className="cms-fields">
        {Object.entries(source)
          .filter(
            ([key]) =>
              key !== "id" &&
              key !== "url" &&
              !(
                path === "" &&
                ["isFeatured", "featuredOrder", "isFlagship"].includes(key)
              ) &&
              !(key === "body" && "bodyHtml" in source),
          )
          .map(([key, item]) => {
            const field = (
              <Fields
                {...shared}
                key={key}
                name={key}
                value={item}
                template={schema[key]}
                path={`${path}.${key}`}
                onChange={(next) => onChange({ ...source, [key]: next })}
              />
            );
            return item && typeof item === "object" && !Array.isArray(item) ? (
              <details className="cms-group" key={key} open={key !== "copy"}>
                <summary>{labelOf(key)}</summary>
                {field}
              </details>
            ) : (
              field
            );
          })}
      </div>
    );
  }
  if (typeof value === "boolean")
    return (
      <label className="cms-check">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    );
  if (typeof value === "number")
    return (
      <label className="cms-field">
        {label}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    );
  const text = String(value ?? "");
  if (/^(image\d*|logo|src|ogImage)$/.test(name))
    return (
      <div className="cms-field">
        <span>{label}</span>
        <ImageField value={text} onChange={onChange} />
      </div>
    );
  if (
    /(Html$|^paragraph\d*$|^bio$|^body$|^answer$)/.test(name) ||
    path.includes(".body.")
  )
    return (
      <div className="cms-field">
        <span>{label}</span>
        <RichEditor label={label} value={text} onChange={onChange} />
      </div>
    );
  if (name === "color")
    return (
      <label className="cms-field">
        {label}
        <select value={text} onChange={(e) => onChange(e.target.value)}>
          {["red", "blue", "green", "yellow", "pink", "purple", "gold"].map(
            (color) => (
              <option key={color}>{color}</option>
            ),
          )}
        </select>
      </label>
    );
  return (
    <label className="cms-field">
      {label}
      {text.length > 120 ||
      ["description", "excerpt", "body", "answer"].includes(name) ? (
        <textarea
          rows={4}
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          value={text}
          disabled={path === ".slug" && lockedSlug}
          type={
            ["date", "startDate", "endDate"].includes(name) ? "date" : "text"
          }
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
