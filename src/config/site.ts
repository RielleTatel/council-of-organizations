export const siteConfig = {
  name: 'COA-Z',
  fullName: 'Council of Organizations of the Ateneo - Zamboanga',
  description:
    'The official website of the Council of Organizations of the Ateneo - Zamboanga.',
  // import.meta.env only exists under Vite; this file is also imported directly by
  // scripts/generate-sitemap.ts, which runs under plain Bun — so guard the access
  // and fall back to the real production domain either way.
  url: (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_SITE_URL || 'https://coa-z-adzu.netlify.app',
  email: 'cola@adzu.edu.ph',
  socialLinks: {
    facebook: 'https://www.facebook.com/coazadzu',
    instagram: '',
    twitter: '',
  },
}
