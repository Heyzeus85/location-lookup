import Link from 'next/link'
import { LatestEpisode } from '@/types'

interface LatestEpisodesProps {
  episodes: LatestEpisode[]
}

export default function LatestEpisodes({ episodes }: LatestEpisodesProps) {
  if (episodes.length === 0) return null

  return (
    <section className="card p-6">
      <header className="mb-4">
        <h2 className="section-title">Recently aired</h2>
        <p className="text-sm text-ink-muted">The newest episodes in the collection</p>
      </header>

      <ul className="divide-y divide-stone-100">
        {episodes.map(episode => (
          <li key={`${episode.season}-${episode.episode}-${episode.path}`}>
            <Link href={episode.path} className="flex items-start justify-between gap-4 rounded-xl px-2 py-3 hover:bg-accent-50">
              <span className="min-w-0">
                <span className="block font-medium leading-snug text-ink">{episode.title}</span>
                <span className="block truncate text-sm text-ink-muted">{episode.place}</span>
              </span>
              <span className="shrink-0 text-right text-xs text-ink-faint">
                <span className="block">
                  {new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </span>
                <span className="block">S{episode.season} · E{episode.episode}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
