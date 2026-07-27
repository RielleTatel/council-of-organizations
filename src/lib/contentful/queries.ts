export const organizationsKeys = {
  all: ['organizations'] as const,
  bySlug: (slug: string) => ['organizations', slug] as const,
}

export const eventsKeys = {
  all: ['events'] as const,
  bySlug: (slug: string) => ['events', slug] as const,
}

export const leadershipKeys = {
  all: ['leadership'] as const,
}

export const siteSettingsKeys = {
  all: ['siteSettings'] as const,
}
