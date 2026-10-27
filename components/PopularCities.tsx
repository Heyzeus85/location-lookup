import Link from 'next/link'
import { getPopularCities, PopularityScope } from '@/lib/popularity'

interface PopularCitiesProps {
  scope: PopularityScope
}

export default async function PopularCities({ scope }: PopularCitiesProps) {
  const { kind, cities } = await getPopularCities(scope)
  if (cities.length === 0) return null

  const max = Math.max(...cities.map(city => city.count))
  const where = scope === 'us' ? 'US' : 'international'
  const title = kind === 'popular' ? `Most looked-up ${where} cities` : `Most featured ${where} cities`
  const subtitle = kind === 'popular' ? 'What visitors are searching for' : 'Cities with the most episodes'
  const unit = kind === 'popular' ? 'lookup' : 'episode'

  return (
    <section className="card p-6">
      <header className="mb-4">
        <h2 className="section-title">{title}</h2>
        <p className="text-sm text-ink-muted">{subtitle}</p>
      </header>

      <ol className="space-y-1">
        {cities.map((city, index) => (
          <li key={city.path}>
            <Link href={city.path} className="group grid grid-cols-[1.75rem_1fr_6rem] items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent-50">
              <span className="text-right font-display text-lg font-semibold tabular-nums text-ink-faint group-hover:text-accent-700">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-ink">
                  {city.name}
                  <span className="font-normal text-ink-muted">, {city.region}</span>
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-stone-100">
                  <span className="block h-full rounded-full bg-accent-500" style={{ width: `${Math.max((city.count / max) * 100, 4)}%` }} />
                </span>
              </span>
              <span className="text-right text-sm tabular-nums text-ink-muted">
                {city.count.toLocaleString('en-US')} {unit}{city.count !== 1 ? 's' : ''}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
