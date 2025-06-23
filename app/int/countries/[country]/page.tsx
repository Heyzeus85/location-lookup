import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getInternationalCountryData, getInternationalStaticPaths } from '@/lib/international-data'
import { InternationalEpisode } from '@/types'
import BackToTop from '@/components/BackToTop'
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
      url: `https://location-lookup.vercel.app/int/countries/${params.country}/`,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${countryData.countryName} TV Episodes`,
        },
      ],
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

function InternationalEpisodeCard({ episode }: { episode: InternationalEpisode }) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <header className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {episode.Title}
        </h3>
        <div className="text-base font-bold text-gray-500 ml-4 flex-shrink-0">
          S{episode.Season} E{episode.Episode}
        </div>
      </header>
      
      <time className="text-sm text-gray-600 mb-3 block" dateTime={episode.Date || undefined}>
        {episode.Date ? new Date(episode.Date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Date not available'}
      </time>
      
      <p className="text-gray-700 text-sm leading-relaxed">
        {(() => {
          const description = episode.Description;
          if (description.length <= 120) return description;
          
          // Find the last sentence that fits within 120 characters
          const sentences = description.split('. ');
          let truncated = '';
          
          for (const sentence of sentences) {
            const test = truncated ? `${truncated}. ${sentence}` : sentence;
            if (test.length > 120) break;
            truncated = test;
          }
          
          return truncated ? `${truncated}...` : `${description.substring(0, 120)}...`;
        })()}
      </p>
      
      {/* Conditional location display */}
      {(episode.City || episode.Country) && (
        <footer className="mt-4 pt-3 border-t border-gray-100">
          <address className="flex items-center text-sm text-gray-500 not-italic">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {episode.City && episode.Country ? (
              `${episode.City}, ${episode.Country}`
            ) : episode.Country ? (
              episode.Country
            ) : (
              episode.City
            )}
          </address>
        </footer>
      )}
    </article>
  )
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <nav>
              <Link 
                href="/int" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                International Episodes
              </Link>
            </nav>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {countryData.countryName}
            </h1>
            
            <div className="flex items-center space-x-6 text-lg text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 3v18m6-18v18" />
                </svg>
                {countryData.cities.length} {countryData.cities.length === 1 ? 'City' : 'Cities'}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {countryData.totalEpisodes} {countryData.totalEpisodes === 1 ? 'Episode' : 'Episodes'}
              </div>
            </div>
          </header>

          {/* Cities and Episodes */}
          <main className="space-y-12">
            {sortedCities.map((city) => (
              <section key={city.name} id={city.name.toLowerCase().replace(/\s+/g, '-')}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  {city.name}
                  <span className="text-lg font-normal text-gray-500 ml-3">
                    ({city.episodes.length} {city.episodes.length === 1 ? 'episode' : 'episodes'})
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {city.episodes
                    .sort((a, b) => {
                      if (!a.Date) return 1;
                      if (!b.Date) return -1;
                      return new Date(b.Date).getTime() - new Date(a.Date).getTime()
                    })
                    .map((episode, index) => (
                      <InternationalEpisodeCard key={`${episode.Season}-${episode.Episode}`} episode={episode} />
                    ))}
                </div>

                {/* Back to Top link after each city */}
                <BackToTop />
              </section>
            ))}
          </main>

          {/* Back to top */}
          <footer className="mt-12 text-center">
            <Link 
              href="/int" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to International Episodes
            </Link>
          </footer>
        </div>
      </div>
    </>
  )
} 