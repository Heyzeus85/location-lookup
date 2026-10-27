import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStateData, getStaticPaths } from '@/lib/data'
import BackToTop from '@/components/BackToTop'
import EpisodeCard from '@/components/EpisodeCard'
import CityIndex from '@/components/CityIndex'
import { toSlug } from '@/lib/slug'
import type { Metadata } from 'next'

// Generate static paths for all states
export async function generateStaticParams() {
  const paths = await getStaticPaths()
  return paths.map((path) => ({
    state: path.params.state,
  }))
}

interface StatePageProps {
  params: {
    state: string
  }
}

// Generate dynamic metadata for each state
export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const stateData = await getStateData(params.state)
  
  if (!stateData) {
    return {
      title: 'State Not Found',
      description: 'The requested state could not be found.',
    }
  }

  const episodeCount = stateData.totalEpisodes
  const cityCount = stateData.cities.length
  
  return {
    title: `${stateData.stateName} TV Episodes`,
    description: `Find ${episodeCount} TV episodes filmed in ${stateData.stateName}. Explore ${cityCount} cities with home buying show episodes including House Hunters and House Hunters International.`,
    keywords: [
      `${stateData.stateName} TV episodes`,
      `${stateData.stateName} filming locations`,
      `${stateData.stateName} House Hunters`,
      `${stateData.stateName} reality TV`,
      'home buying shows',
      'TV show locations',
      'episode finder'
    ].join(', '),
    openGraph: {
      title: `${stateData.stateName} TV Episodes - Location Lookup`,
      description: `Find ${episodeCount} TV episodes filmed in ${stateData.stateName}. Explore ${cityCount} cities with home buying show episodes.`,
      url: `https://locationlookup.us/states/${params.state}/`,
    },
    twitter: {
      title: `${stateData.stateName} TV Episodes`,
      description: `Find ${episodeCount} TV episodes filmed in ${stateData.stateName}.`,
    },
    alternates: {
      canonical: `/states/${params.state}/`,
    },
  }
}

export default async function StatePage({ params }: StatePageProps) {
  const stateData = await getStateData(params.state)
  
  // Only reject if truly no data found
  if (!stateData) {
    notFound()
  }

  // Sort cities by name
  const sortedCities = [...stateData.cities].sort((a, b) => a.name.localeCompare(b.name))
  
  // Generate structured data for the state page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": stateData.stateName,
    "description": `TV episodes filmed in ${stateData.stateName}`,
    "containsPlace": stateData.cities.map(city => ({
      "@type": "Place",
      "name": city.name,
      "description": `${city.episodes.length} TV episodes filmed in ${city.name}, ${stateData.stateName}`,
      "numberOfEpisodes": city.episodes.length
    })),
    "numberOfEpisodes": stateData.totalEpisodes,
    "numberOfCities": stateData.cities.length
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 pb-16">
          <header className="mb-6 pt-10">
            <nav aria-label="Breadcrumb" className="mb-3 text-sm">
              <Link href="/" className="inline-flex items-center text-accent-700 hover:text-accent-900">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All states
              </Link>
            </nav>

            <h1 className="mb-3 text-4xl font-semibold text-ink sm:text-5xl">
              {stateData.stateName}
            </h1>

            <div className="flex flex-wrap gap-2">
              <span className="badge">
                {stateData.cities.length} {stateData.cities.length === 1 ? 'city' : 'cities'}
              </span>
              <span className="badge bg-accent-50 text-accent-700">
                {stateData.totalEpisodes} {stateData.totalEpisodes === 1 ? 'episode' : 'episodes'}
              </span>
            </div>
          </header>

          <div className="mb-10">
            <CityIndex
              scope="us"
              region={stateData.state}
              cities={sortedCities.map(city => ({ name: city.name, count: city.episodes.length }))}
            />
          </div>

          {/* Cities and Episodes */}
          <main className="space-y-14">
            {sortedCities.map((city) => (
              <section key={city.name} id={toSlug(city.name)}>
                <h2 className="mb-5 flex items-baseline gap-3 border-b border-stone-200 pb-2 text-2xl font-semibold text-ink">
                  {city.name}
                  <span className="font-sans text-base font-normal text-ink-faint">
                    {city.episodes.length} {city.episodes.length === 1 ? 'episode' : 'episodes'}
                  </span>
                </h2>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {[...city.episodes]
                    .sort((a, b) => (b.Date ? new Date(b.Date).getTime() : 0) - (a.Date ? new Date(a.Date).getTime() : 0))
                    .map((episode) => (
                      <EpisodeCard
                        key={`${episode.Season}-${episode.Episode}`}
                        title={episode.Title}
                        season={episode.Season}
                        episode={episode.Episode}
                        date={episode.Date}
                        description={episode.Description}
                      />
                    ))}
                </div>

                {/* Back to Top link after each city */}
                <BackToTop />
              </section>
            ))}
          </main>
        </div>
      </div>
    </>
  )
}
