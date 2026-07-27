import posthog from 'posthog-js'

export function initPostHog(): void {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  const host = (import.meta.env.VITE_POSTHOG_HOST as string) ?? 'https://app.posthog.com'
  if (!key) return
  posthog.init(key, { api_host: host })
}

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  posthog.capture(event, properties)
}
