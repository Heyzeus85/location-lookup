import React from 'react'
import Link from 'next/link'
import { getAllInternationalCountriesData } from '@/lib/international-data'
import InternationalSearch from '@/components/InternationalSearch'
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

export default async function InternationalPage() {
  // Fetch international data server-side
  const allCountriesData = await getAllInternationalCountriesData()

  // Create a map of country codes to episode counts for potential future coloring
  const countryEpisodeCounts = allCountriesData.reduce((acc, country) => {
    acc[country.country] = country.totalEpisodes
    return acc
  }, {} as Record<string, number>)

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
          "url": `https://locationlookup.us/int/countries/${country.countryName.toLowerCase().replace(/\s+/g, '-')}/`
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <nav>
              <Link 
                href="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
            </nav>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              International Home Buying Episodes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore home buying episodes from around the world. Click on a country to see episodes from its cities.
            </p>
          </header>

          {/* Search Component */}
          <InternationalSearch />

          {/* Countries Grid */}
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {allCountriesData
              .sort((a, b) => b.totalEpisodes - a.totalEpisodes) // Sort by episode count descending
              .map((country) => (
                <Link
                  key={country.country}
                  href={`/int/countries/${country.countryName.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow hover:scale-105 transform duration-200"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {country.countryName}
                    </h2>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 3v18m6-18v18" />
                        </svg>
                        {country.cities.length} {country.cities.length === 1 ? 'City' : 'Cities'}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {country.totalEpisodes} {country.totalEpisodes === 1 ? 'Episode' : 'Episodes'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </main>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {allCountriesData.length}
              </div>
              <div className="text-gray-600">Countries with Episodes</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {allCountriesData.reduce((sum, country) => sum + country.cities.length, 0)}
              </div>
              <div className="text-gray-600">Cities Featured</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {allCountriesData.reduce((sum, country) => sum + country.totalEpisodes, 0)}
              </div>
              <div className="text-gray-600">Total Episodes</div>
            </div>
          </section>

          {/* Back to home */}
          <footer className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to US Episodes
            </Link>
          </footer>
        </div>
      </div>
    </>
  )
} 