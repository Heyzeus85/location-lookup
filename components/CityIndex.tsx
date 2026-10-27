'use client'

import { useEffect } from 'react'
import { toSlug } from '@/lib/slug'
import { trackCityLookup, LookupScope } from '@/lib/track'

interface CityIndexProps {
  scope: LookupScope
  region: string
  cities: { name: string; count: number }[]
}

// Jump links to each city section; also records deep links and city clicks as lookups
export default function CityIndex({ scope, region, cities }: CityIndexProps) {
  useEffect(() => {
    const bySlug = new Map(cities.map(city => [toSlug(city.name), city.name]))

    const trackHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1))
      const city = bySlug.get(slug)
      if (city) trackCityLookup(scope, region, city)
    }

    trackHash()
    window.addEventListener('hashchange', trackHash)
    return () => window.removeEventListener('hashchange', trackHash)
  }, [scope, region, cities])

  if (cities.length < 2) return null

  return (
    <nav aria-label="Cities" className="card p-4">
      <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-ink-faint font-sans">Jump to a city</h2>
      <ul className="flex flex-wrap gap-2">
        {cities.map(city => (
          <li key={city.name}>
            <a
              href={`#${toSlug(city.name)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-ink hover:border-accent-300 hover:bg-accent-50"
            >
              {city.name}
              <span className="text-xs tabular-nums text-ink-faint">{city.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
