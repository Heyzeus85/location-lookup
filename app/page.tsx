'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import { getAllStatesData, searchLocations } from '@/lib/data'
import { SearchResult } from '@/types'

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

// Get state data at build time
const allStatesData = getAllStatesData()

// Create a map of state codes to episode counts for coloring
const stateEpisodeCounts = allStatesData.reduce((acc, state) => {
  acc[state.state] = state.totalEpisodes
  return acc
}, {} as Record<string, number>)

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [tooltipContent, setTooltipContent] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = searchLocations(query, 8)
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSearchQuery('')
  }

  // Get color based on episode count
  const getStateColor = (episodeCount: number) => {
    if (episodeCount === 0) return '#f3f4f6' // gray-100
    if (episodeCount <= 2) return '#dbeafe' // blue-100
    if (episodeCount <= 5) return '#93c5fd' // blue-300
    if (episodeCount <= 10) return '#3b82f6' // blue-500
    return '#1d4ed8' // blue-700
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Home Buying Episode Lookup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find home buying episodes by location. Click on a state or search for a specific city.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-8 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a state or city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
            <div className="absolute right-3 top-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
              {searchResults.map((result, index) => (
                <Link 
                  key={index} 
                  href={result.path}
                  onClick={handleResultClick}
                  className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-500">
                        {result.type === 'state' ? 'State' : 'City'}
                        {result.episodes && result.episodes.length > 0 && 
                          ` • ${result.episodes.length} episode${result.episodes.length !== 1 ? 's' : ''}`
                        }
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 hidden md:block">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Click on a State to View Episodes
          </h2>
          
          <div className="w-full max-w-4xl mx-auto">
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{
                scale: 1000,
              }}
              width={800}
              height={500}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    // Map state names to state codes
                    const stateNameToCode: Record<string, string> = {
                      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
                      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
                      'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
                      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
                      'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
                      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
                      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
                      'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
                      'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
                      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
                      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
                      'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
                      'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
                    }
                    
                    const stateName = geo.properties?.name
                    const stateCode = stateNameToCode[stateName]
                    const episodeCount = stateCode ? stateEpisodeCounts[stateCode] || 0 : 0
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getStateColor(episodeCount)}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        data-tooltip-id="state-tooltip"
                        data-tooltip-content={stateName ? `${stateName}: ${episodeCount} ${episodeCount === 1 ? 'episode' : 'episodes'}` : ''}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: "#f59e0b", 
                            outline: "none",
                            cursor: "pointer"
                          },
                          pressed: { outline: "none" },
                        }}
                        onClick={() => {
                          if (stateCode) {
                            window.location.href = `/states/${stateCode.toLowerCase()}`
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            <Tooltip id="state-tooltip" />
          </div>


          {/* Legend */}
          <div className="mt-6 flex justify-center">
            <div className="grid grid-cols-2 md:flex md:items-center md:space-x-6 gap-2 md:gap-0 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border mr-2"></div>
                <span className="whitespace-nowrap">No episodes</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 mr-2"></div>
                <span className="whitespace-nowrap">1-2 episodes</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-300 mr-2"></div>
                <span className="whitespace-nowrap">3-5 episodes</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span className="whitespace-nowrap">6-10 episodes</span>
              </div>
              <div className="flex items-center col-span-2 md:col-span-1 justify-center md:justify-start">
                <div className="w-4 h-4 bg-blue-700 mr-2"></div>
                <span className="whitespace-nowrap">10+ episodes</span>
              </div>
            </div>
          </div>
        </div>

        {/* State List - Mobile */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 md:hidden">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Select a Location
                </h2>
                
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                    {allStatesData
                    .filter(state => state.totalEpisodes > 0) // Only show states with episodes
                    .sort((a, b) => b.totalEpisodes - a.totalEpisodes) // Sort by episode count, highest first
                    .map((state) => (
                        <Link
                        key={state.state}
                        href={`/states/${state.state.toLowerCase()}`}
                        className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                        <div className="font-medium text-gray-900">
                            {state.stateName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {state.totalEpisodes} {state.totalEpisodes === 1 ? 'episode' : 'episodes'}
                        </div>
                        </Link>
                    ))}
                </div>
        </div>

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