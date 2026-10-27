import { track } from '@vercel/analytics'

export type LookupScope = 'us' | 'int'

// Record that a visitor looked up a city (search pick, city link or deep link)
export function trackCityLookup(scope: LookupScope, region: string, city: string) {
  const payload = JSON.stringify({ scope, region, city })

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track/', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true })
    }
  } catch {
    // Tracking must never break navigation
  }

  track('city_lookup', { scope, region, city })
}
