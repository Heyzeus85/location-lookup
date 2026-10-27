import React from 'react'
import Link from 'next/link'
import { getAllInternationalCountriesData, getLatestInternationalEpisodes } from '@/lib/international-data'
import { toSlug } from '@/lib/slug'
import LocationSearch from '@/components/LocationSearch'
import StatTile from '@/components/StatTile'
import PopularCities from '@/components/PopularCities'
import LatestEpisodes from '@/components/LatestEpisodes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'International TV Episodes',
  description: 'Explore home buying episodes from around the world. Find TV episodes filmed in international locations including House Hunters International and other reality TV shows.',
  keywords: [
    'international TV episodes',
    'House Hunters International',
    'international filming locations',
    'global TV shows',
    'international home buying shows',
    'TV episodes by country',
    'international reality TV',
    'episode finder international'
  ].join(', '),
  openGraph: {
    title: 'International TV Episodes - Location Lookup',
    description: 'Explore home buying episodes from around the world. Find TV episodes filmed in international locations.',
    url: 'https://locationlookup.us/int/',
  },
  twitter: {
    title: 'International TV Episodes',
    description: 'Explore home buying episodes from around the world.',
  },
  alternates: {
    canonical: '/int/',
  },
}

// Refresh hourly so the popular cities and recently aired lists stay current
export const revalidate = 3600

export default async function InternationalPage() {
  const [allCountriesData, latestEpisodes] = await Promise.all([
    getAllInternationalCountriesData(),
    getLatestInternationalEpisodes(6),
  ])

  const sortedCountries = [...allCountriesData].sort((a, b) => b.totalEpisodes - a.totalEpisodes)
  const cityCount = allCountriesData.reduce((sum, country) => sum + country.cities.length, 0)
  const episodeCount = allCountriesData.reduce((sum, country) => sum + country.totalEpisodes, 0)

  // Generate structured data for the international page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "International TV Episodes",
    "description": "Find TV episodes filmed in international locations",
    "url": "https://locationlookup.us/int/",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allCountriesData.length,
      "itemListElement": allCountriesData.map((country, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Place",
          "name": country.countryName,
          "description": `${country.totalEpisodes} TV episodes filmed in ${country.countryName}`,
          "url": `https://locationlookup.us/int/countries/${toSlug(country.countryName)}/`
        }
      }))
    }
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
          {/* Hero */}
          <header className="mx-auto max-w-3xl pb-10 pt-12 text-center sm:pt-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-700">House Hunters International</p>
            <h1 className="mb-4 text-4xl font-semibold text-ink sm:text-5xl">
              Home buying episodes from around the world
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-muted">
              Search {episodeCount.toLocaleString('en-US')} episodes across {allCountriesData.length} countries, or browse by country below.
            </p>
            <LocationSearch endpoint="/api/search-international/" placeholder="Search for a country or city..." />
          </header>

          {/* Stats Section */}
          <section className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
            <StatTile value={allCountriesData.length} label="Countries with episodes" />
            <StatTile value={cityCount} label="Cities featured" />
            <StatTile value={episodeCount} label="Total episodes" />
          </section>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PopularCities scope="int" />
            <LatestEpisodes episodes={latestEpisodes} />
          </div>

          {/* Countries Grid */}
          <main>
            <h2 className="section-title mb-4">All countries</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedCountries.map((country) => (
                <Link
                  key={country.country}
                  href={`/int/countries/${toSlug(country.countryName)}`}
                  className="card-interactive flex items-center justify-between px-5 py-4"
                >
                  <span className="font-medium text-ink">{country.countryName}</span>
                  <span className="text-right text-xs tabular-nums text-ink-muted">
                    <span className="block">{country.totalEpisodes} {country.totalEpisodes === 1 ? 'episode' : 'episodes'}</span>
                    <span className="block text-ink-faint">{country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}</span>
                  </span>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
