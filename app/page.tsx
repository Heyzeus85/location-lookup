import React from 'react'
import MapComponent from '@/components/MapComponent'
import LocationSearch from '@/components/LocationSearch'
import StatTile from '@/components/StatTile'
import PopularCities from '@/components/PopularCities'
import LatestEpisodes from '@/components/LatestEpisodes'
import { getAllStatesData, getLatestEpisodes } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Buying Episode Lookup',
  description: 'Find home buying episodes by location. Search by state or city to discover TV episodes filmed in specific locations across the United States.',
  keywords: [
    'home buying episodes',
    'TV show locations',
    'House Hunters episodes',
    'reality TV locations',
    'episode finder',
    'filming locations',
    'home buying shows',
    'TV episode search'
  ].join(', '),
  openGraph: {
    title: 'Home Buying Episode Lookup - Find TV Episodes by Location',
    description: 'Find home buying episodes by location. Search by state or city to discover TV episodes filmed in specific locations.',
    url: 'https://locationlookup.us/',
  },
  twitter: {
    title: 'Home Buying Episode Lookup',
    description: 'Find home buying episodes by location. Search by state or city.',
  },
  alternates: {
    canonical: '/',
  },
}

// Refresh hourly so the popular cities and recently aired lists stay current
export const revalidate = 3600

export default async function Home() {
  // Fetch data server-side
  const [allStatesData, latestEpisodes] = await Promise.all([getAllStatesData(), getLatestEpisodes(6)])

  // Create a map of state codes to episode counts for coloring
  const stateEpisodeCounts = allStatesData.reduce((acc, state) => {
    acc[state.state] = state.totalEpisodes
    return acc
  }, {} as Record<string, number>)

  // Generate structured data for the home page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Home Buying Episode Lookup",
    "description": "Find TV episodes filmed in your area",
    "url": "https://locationlookup.us/",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allStatesData.filter(state => state.state !== 'DC' && state.state !== 'UL').length,
      "itemListElement": allStatesData
        .filter(state => state.state !== 'DC' && state.state !== 'UL')
        .map((state, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Place",
            "name": state.stateName,
            "description": `${state.totalEpisodes} TV episodes filmed in ${state.stateName}`,
            "url": `https://locationlookup.us/states/${state.state.toLowerCase()}/`,
            "numberOfEpisodes": state.totalEpisodes,
            "numberOfCities": state.cities.length
          }
        }))
    }
  }

  const stateCount = allStatesData.filter(state => state.state !== 'DC' && state.state !== 'UL').length
  const cityCount = allStatesData.reduce((sum, state) => sum + state.cities.length, 0)
  const episodeCount = allStatesData.reduce((sum, state) => sum + state.totalEpisodes, 0)

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
          {/* Hero */}
          <header className="mx-auto max-w-3xl pb-10 pt-12 text-center sm:pt-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-700">House Hunters, by location</p>
            <h1 className="mb-4 text-4xl font-semibold text-ink sm:text-5xl">
              Find the episodes filmed near you
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-muted">
              Search {episodeCount.toLocaleString('en-US')} home buying episodes by state or city, or pick a state on the map.
            </p>
            <LocationSearch endpoint="/api/search/" placeholder="Search for a state or city..." />
          </header>

          {/* Stats Section */}
          <section className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
            <StatTile value={stateCount} label="States with episodes" />
            <StatTile value={cityCount} label="Cities featured" />
            <StatTile value={episodeCount} label="Total episodes" />
          </section>

          {/* Map Component */}
          <main className="mb-8">
            <MapComponent
              allStatesData={allStatesData}
              stateEpisodeCounts={stateEpisodeCounts}
            />
          </main>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PopularCities scope="us" />
            <LatestEpisodes episodes={latestEpisodes} />
          </div>
        </div>
      </div>
    </>
  )
}
