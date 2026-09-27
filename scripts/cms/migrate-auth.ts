import { configureStaffAuth } from "./auth-config";

async function main() {
  const projectUrl = process.env.VITE_SUPABASE_URL?.trim(),
    token = process.env.SUPABASE_ACCESS_TOKEN?.trim(),
    siteUrl = process.env.CMS_SITE_URL?.trim().replace(/\/$/, ""),
    localOrigin = (process.env.CMS_LOCAL_ORIGIN || "http://localhost:5173").replace(/\/$/, "");
  if (!projectUrl || !token || !siteUrl)
    throw new Error("Set VITE_SUPABASE_URL, SUPABASE_ACCESS_TOKEN and CMS_SITE_URL in .env.setup.local.");
  const url = new URL(projectUrl), ref = url.hostname.split(".")[0];
  if (!/^[a-z]{20}$/.test(ref) || url.hostname !== `${ref}.supabase.co` || url.protocol !== "https:")
    throw new Error("Use the standard Supabase project URL.");
  if (new URL(siteUrl).origin !== siteUrl || !siteUrl.startsWith("https://"))
    throw new Error("CMS_SITE_URL must be your HTTPS website origin.");
  await configureStaffAuth(async (path, method, body) => {
    const response = await fetch(`https://api.supabase.com/v1/projects/${ref}/${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Auth configuration failed (${response.status}). Check token permissions.`);
    return response.status === 204 ? null : response.json();
  }, siteUrl, localOrigin);
  console.log("Supabase Auth configured for owner-created staff accounts. Existing users and CMS content were preserved. No SMTP provider is required.");
}
main().catch((error) => { console.error((error as Error).message); process.exitCode = 1; });
