interface EpisodeCardProps {
  title: string
  season: number
  episode: number
  date: string | null
  description: string
  location?: string
}

function formatAirDate(date: string | null): string | null {
  if (!date) return null
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

// Trim to the last full sentence that fits within the limit
function truncateDescription(description: string, limit: number = 160): string {
  if (description.length <= limit) return description

  let truncated = ''
  for (const sentence of description.split('. ')) {
    const candidate = truncated ? `${truncated}. ${sentence}` : sentence
    if (candidate.length > limit) break
    truncated = candidate
  }

  return truncated ? `${truncated}...` : `${description.substring(0, limit)}...`
}

export default function EpisodeCard({ title, season, episode, date, description, location }: EpisodeCardProps) {
  const airDate = formatAirDate(date)

  return (
    <article className="card flex flex-col p-6 transition-shadow hover:shadow-lift">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="badge bg-accent-50 text-accent-700">S{season} · E{episode}</span>
        {airDate ? (
          <time className="badge" dateTime={date ?? undefined}>{airDate}</time>
        ) : (
          <span className="badge">Air date unknown</span>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold leading-snug text-ink">{title}</h3>

      <p className="text-sm leading-relaxed text-ink-muted">{truncateDescription(description)}</p>

      {location && (
        <address className="mt-auto flex items-center gap-1 pt-4 text-sm not-italic text-ink-faint">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </address>
      )}
    </article>
  )
}
