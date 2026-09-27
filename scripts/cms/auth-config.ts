type ManagementApi = (path: string, method: string, body?: unknown) => Promise<unknown>;

export async function configureStaffAuth(api: ManagementApi, siteUrl: string, localOrigin: string) {
  const previous = await api("config/auth", "GET") as { uri_allow_list?: string };
  const redirects = [...new Set([
    ...(previous.uri_allow_list || "").split(",").filter(Boolean),
    `${siteUrl}/admin/reset`,
    `${localOrigin}/admin/reset`,
  ])].join(",");
  await api("config/auth", "PATCH", {
    site_url: siteUrl,
    uri_allow_list: redirects,
    disable_signup: true,
    external_email_enabled: true,
    external_anonymous_users_enabled: false,
    mailer_autoconfirm: false,
    password_min_length: 8,
  });
}
