import { readFile, readdir, stat } from "node:fs/promises";
import { basename, resolve, extname } from "node:path";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { bootstrapEntries } from "../../src/lib/cms/bootstrap";
import { configureStaffAuth } from "./auth-config";
import {
  imagePaths,
  imageDescriptions,
  importSql,
  prepareEntries,
  stableId,
} from "./import";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (
    !value ||
    value === "replace-me" ||
    value.includes("your-project-ref") ||
    /@your-(verified-)?domain\.com$/.test(value)
  )
    throw new Error(`Set ${name} in .env.setup.local before running setup.`);
  return value;
}
function check<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
async function main() {
  const projectUrl = required("VITE_SUPABASE_URL"),
    publicKey = required("VITE_SUPABASE_PUBLISHABLE_KEY");
  const token = required("SUPABASE_ACCESS_TOKEN"),
    secret = required("SUPABASE_SERVICE_ROLE_KEY");
  const ownerEmail = required("CMS_OWNER_EMAIL").toLowerCase();
  const siteUrl = required("CMS_SITE_URL").replace(/\/$/, ""),
    localOrigin = (
      process.env.CMS_LOCAL_ORIGIN || "http://localhost:5173"
    ).replace(/\/$/, "");
  const parsed = new URL(projectUrl),
    ref = parsed.hostname.split(".")[0];
  if (
    !/^[a-z]{20}$/.test(ref) ||
    parsed.hostname !== `${ref}.supabase.co` ||
    parsed.protocol !== "https:"
  )
    throw new Error("Use the standard Supabase project URL for setup.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))
    throw new Error("Set a valid owner email address.");
  if (!siteUrl.startsWith("https://") || new URL(siteUrl).pathname !== "/")
    throw new Error("CMS_SITE_URL must be your HTTPS website origin.");
  const api = async (path: string, method: string, body?: unknown) => {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${ref}/${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      },
    );
    // SQL request errors can echo input. Do not print responses containing secrets.
    if (!response.ok)
      throw new Error(
        `Supabase ${path} failed (${response.status}). Check token permissions and project status.`,
      );
    return response.status === 204 ? null : await response.json();
  };
  const sql = (query: string, parameters: unknown[] = []) =>
    api("database/query", "POST", { query, parameters });
  const ownerAccounts = await sql("select id from auth.users where lower(email)=$1", [ownerEmail]) as { id: string }[];
  const ownerPassword = ownerAccounts.length ? undefined : required("CMS_OWNER_PASSWORD");
  if (ownerPassword && (ownerPassword.length < 8 || ownerPassword.length > 128))
    throw new Error("CMS_OWNER_PASSWORD must contain 8 to 128 characters.");
  console.log("Applying CMS database migrations…");
  await sql(
    "create schema if not exists cms_setup; revoke all on schema cms_setup from public,anon,authenticated; create table if not exists cms_setup.migrations(version text primary key,applied_at timestamptz default now());",
  );
  const applied = (await sql("select version from cms_setup.migrations")) as {
    version: string;
  }[];
  for (const file of (await readdir("supabase/migrations"))
    .filter((file) => file.endsWith(".sql"))
    .sort()) {
    if (applied.some((row) => row.version === file)) continue;
    const migration = await readFile(`supabase/migrations/${file}`, "utf8");
    await sql(
      `begin; ${migration}\ninsert into cms_setup.migrations(version) values('${file.replaceAll("'", "''")}'); commit;`,
    );
    console.log(`Applied ${file}`);
  }
  const client = createClient(projectUrl, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  console.log("Importing existing public images…");
  const references = new Map<string, string>(),
    paths = imagePaths(bootstrapEntries),
    descriptions = imageDescriptions(bootstrapEntries);
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  for (const source of paths) {
    const id = stableId(`media:${source}`),
      filename = basename(source),
      storagePath = `${id}/${filename}`,
      absolute = resolve("public", source.slice(1));
    if (!(await stat(absolute)).isFile())
      throw new Error(`Bootstrap image is missing: ${source}`);
    if ((await stat(absolute)).size > 10 * 1024 * 1024)
      throw new Error(`Bootstrap image exceeds 10 MB: ${source}`);
    const mime = mimeTypes[extname(source).toLowerCase()];
    const known = check(
      await client.from("cms_media").select("id").eq("id", id).maybeSingle(),
    );
    if (!known) {
      // Ignore a duplicate object left by an interrupted prior run; never overwrite it.
      const uploaded = await client.storage
        .from("cms-media")
        .upload(storagePath, await readFile(absolute), {
          contentType: mime,
          upsert: false,
        });
      if (
        uploaded.error &&
        !["409", "Duplicate"].includes(String(uploaded.error.statusCode)) &&
        !/already exists|duplicate/i.test(uploaded.error.message)
      )
        throw new Error(`Image upload failed for ${source}.`);
      check(
        await client.from("cms_media").insert({
          id,
          storage_path: storagePath,
          filename,
          mime_type: mime,
          alt:
            descriptions.get(source) ??
            filename.replace(/[-_]/g, " ").replace(/\.[^.]+$/, ""),
          is_public: true,
        }),
      );
    }
    references.set(source, `media:${id}`);
  }
  const seeded = (await sql(importSql, [
    JSON.stringify(prepareEntries(bootstrapEntries, references)),
  ])) as { imported: number }[];
  console.log(
    `Imported ${seeded[0]?.imported ?? 0} new published entries. Existing entries were preserved.`,
  );
  console.log("Configuring owner-managed Supabase Auth…");
  await configureStaffAuth(api, siteUrl, localOrigin);
  await api("secrets", "POST", [
    { name: "CMS_SITE_URL", value: siteUrl },
    { name: "CMS_LOCAL_ORIGIN", value: localOrigin },
  ]);
  console.log("Deploying CMS backend functions…");
  for (const name of ["cms-admin", "cms-media"]) {
    const deployed = spawnSync(
      resolve("node_modules/.bin/supabase"),
      [
        "functions",
        "deploy",
        name,
        "--project-ref",
        ref,
        "--use-api",
        "--no-verify-jwt",
      ],
      {
        stdio: "inherit",
        env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
      },
    );
    if (deployed.status !== 0)
      throw new Error(
        `Deploy ${name} failed. Rerun setup after resolving the CLI error.`,
      );
  }
  console.log("Bootstrapping initial owner…");
  const existing = (await sql(
    "select s.user_id,s.role,s.active from public.cms_staff s where lower(email)=$1",
    [ownerEmail],
  )) as { user_id: string; role: string; active: boolean }[];
  if (existing.length) {
    if (existing[0].role !== "owner" || !existing[0].active)
      throw new Error(
        "CMS_OWNER_EMAIL is already registered without active owner access. Ask an existing owner to update its role.",
      );
    console.log("Initial owner already exists; its password was preserved.");
  } else {
    const users = ownerAccounts;
    let id = users[0]?.id;
    if (!id) {
      const account = await client.auth.admin.createUser({
        email: ownerEmail, password: ownerPassword, email_confirm: true,
      });
      if (account.error) throw new Error("Owner account creation failed. Check the email and password requirements.");
      id = account.data.user?.id;
      if (!id) throw new Error("Owner account creation failed.");
    }
    try {
      await sql(
        "insert into public.cms_staff(user_id,email,role,active) values($1::uuid,$2,'owner',true) on conflict(user_id) do nothing",
        [id, ownerEmail],
      );
    } catch (error) {
      if (!users.length) await client.auth.admin.deleteUser(id);
      throw error;
    }
    console.log(
      users.length
        ? "Existing Auth account granted owner access."
        : "Owner account created. Sign in using CMS_OWNER_PASSWORD, then change it in the CMS.",
    );
  }
  const publicClient = createClient(projectUrl, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  check(await publicClient.from("cms_published").select("entry_id").limit(1));
  console.log(
    `CMS setup complete. Open ${siteUrl}/admin after adding the two VITE_ variables to Netlify and deploying the frontend.`,
  );
}
main().catch((error) => {
  console.error((error as Error).message);
  process.exitCode = 1;
});
