import React from 'react'
import Link from 'next/link'
import MapComponent from '@/components/MapComponent'
import { getAllStatesData } from '@/lib/data'

export default async function Home() {
  // Fetch data server-side
  const allStatesData = await getAllStatesData()

  // Create a map of state codes to episode counts for coloring
  const stateEpisodeCounts = allStatesData.reduce((acc, state) => {
    acc[state.state] = state.totalEpisodes
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Home Buying Episode Lookup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Find home buying episodes by location. Click on a state or search for a specific city.
          </p>
          
          {/* Navigation Links */}
          <div className="flex justify-center space-x-4 mb-6">
            <Link 
              href="/int" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              International Episodes
            </Link>
          </div>
        </div>

        {/* Map Component (handles search and interactivity) */}
        <MapComponent 
          allStatesData={allStatesData}
          stateEpisodeCounts={stateEpisodeCounts}
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
                {allStatesData.filter(state => state.state !== 'DC' && state.state !== 'UL').length}
            </div>
            <div className="text-gray-600">States with Episodes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {allStatesData.reduce((sum, state) => sum + state.cities.length, 0)}
            </div>
            <div className="text-gray-600">Cities Featured</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {allStatesData.reduce((sum, state) => sum + state.totalEpisodes, 0)}
            </div>
            <div className="text-gray-600">Total Episodes</div>
          </div>
        </div>
      </div>
    </div>
  )
}