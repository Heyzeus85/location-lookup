'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { InternationalSearchResult } from '@/types'

export default function InternationalSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<InternationalSearchResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      try {
        const response = await fetch(`/api/search-international?q=${encodeURIComponent(query)}&limit=8`)
        const results = await response.json()
        setSearchResults(results)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
        setShowResults(false)
      }
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleResultClick = () => {
    setShowResults(false)
    setSearchQuery('')
  }

  return (
    <div className="max-w-md mx-auto mb-8 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a country or city..."
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
                    {result.type === 'country' ? 'Country' : 'City'}
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
  )
} 