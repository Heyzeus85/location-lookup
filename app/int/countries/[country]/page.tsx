import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getInternationalCountryData, getInternationalStaticPaths } from '@/lib/international-data'
import BackToTop from '@/components/BackToTop'
import EpisodeCard from '@/components/EpisodeCard'
import CityIndex from '@/components/CityIndex'
import { toSlug } from '@/lib/slug'
import type { Metadata } from 'next'

// Generate static paths for all countries
export async function generateStaticParams() {
  const paths = await getInternationalStaticPaths()
  return paths.map((path) => ({
    country: path.params.country,
  }))
}

interface CountryPageProps {
  params: {
    country: string
  }
}

// Generate dynamic metadata for each country
export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const countryData = await getInternationalCountryData(params.country)
  
  if (!countryData) {
    return {
      title: 'Country Not Found',
      description: 'The requested country could not be found.',
    }
  }

  const episodeCount = countryData.totalEpisodes
  const cityCount = countryData.cities.length
  
  return {
    title: `${countryData.countryName} TV Episodes`,
    description: `Find ${episodeCount} international TV episodes filmed in ${countryData.countryName}. Explore ${cityCount} cities with home buying show episodes including House Hunters International.`,
    keywords: [
      `${countryData.countryName} TV episodes`,
      `${countryData.countryName} filming locations`,
      `${countryData.countryName} House Hunters International`,
      `${countryData.countryName} reality TV`,
      'international home buying shows',
      'TV show locations',
      'episode finder',
      'international episodes'
    ].join(', '),
    openGraph: {
      title: `${countryData.countryName} TV Episodes - Location Lookup`,
      description: `Find ${episodeCount} international TV episodes filmed in ${countryData.countryName}. Explore ${cityCount} cities with home buying show episodes.`,
      url: `https://locationlookup.us/int/countries/${params.country}/`,
    },
    twitter: {
      title: `${countryData.countryName} TV Episodes`,
      description: `Find ${episodeCount} international TV episodes filmed in ${countryData.countryName}.`,
    },
    alternates: {
      canonical: `/int/countries/${params.country}/`,
    },
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const countryData = await getInternationalCountryData(params.country)
  
  // Only reject if truly no data found
  if (!countryData) {
    notFound()
  }

  // Sort cities by name
  const sortedCities = [...countryData.cities].sort((a, b) => a.name.localeCompare(b.name))
  
  // Generate structured data for the country page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": countryData.countryName,
    "description": `International TV episodes filmed in ${countryData.countryName}`,
    "containsPlace": countryData.cities.map(city => ({
      "@type": "Place",
      "name": city.name,
      "description": `${city.episodes.length} international TV episodes filmed in ${city.name}, ${countryData.countryName}`,
      "numberOfEpisodes": city.episodes.length
    })),
    "numberOfEpisodes": countryData.totalEpisodes,
    "numberOfCities": countryData.cities.length
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
              <Link href="/int" className="inline-flex items-center text-accent-700 hover:text-accent-900">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All countries
              </Link>
            </nav>

            <h1 className="mb-3 text-4xl font-semibold text-ink sm:text-5xl">
              {countryData.countryName}
            </h1>

            <div className="flex flex-wrap gap-2">
              <span className="badge">
                {countryData.cities.length} {countryData.cities.length === 1 ? 'city' : 'cities'}
              </span>
              <span className="badge bg-accent-50 text-accent-700">
                {countryData.totalEpisodes} {countryData.totalEpisodes === 1 ? 'episode' : 'episodes'}
              </span>
            </div>
          </header>

          <div className="mb-10">
            <CityIndex
              scope="int"
              region={countryData.country}
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
