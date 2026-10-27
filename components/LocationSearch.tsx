'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResultItem {
  type: 'state' | 'country' | 'city'
  name: string
  path: string
  episodes?: unknown[]
}

interface LocationSearchProps {
  endpoint: string
  placeholder: string
}

const DEBOUNCE_MS = 200

export default function LocationSearch({ endpoint, placeholder }: LocationSearchProps) {
  const router = useRouter()
  const listboxId = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced fetch; aborting the previous request keeps stale responses from overwriting newer ones
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(trimmed)}&limit=8`, { signal: controller.signal })
        const data = await response.json()
        setResults(Array.isArray(data) ? data : [])
        setActiveIndex(-1)
        setIsLoading(false)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        console.error('Search error:', error)
        setResults([])
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, endpoint])

  // Close when clicking outside the search box
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  // City lookups are recorded by CityIndex when the destination page opens at the city's anchor
  const selectResult = () => {
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex(index => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      const result = results[activeIndex >= 0 ? activeIndex : 0]
      if (isOpen && result) {
        event.preventDefault()
        selectResult()
        router.push(result.path)
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const showDropdown = isOpen && query.trim().length >= 2
  const activeId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      <div className="relative">
        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={placeholder}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-full border border-stone-300 bg-white py-3.5 pl-12 pr-5 text-lg text-ink shadow-card outline-none transition placeholder:text-ink-faint focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lift">
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" className="max-h-80 overflow-y-auto py-1">
              {results.map((result, index) => {
                const episodeCount = result.episodes?.length ?? 0
                return (
                  <li key={result.path} id={`${listboxId}-option-${index}`} role="option" aria-selected={index === activeIndex}>
                    <Link
                      href={result.path}
                      onClick={selectResult}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center justify-between px-5 py-3 ${index === activeIndex ? 'bg-accent-50' : ''}`}
                    >
                      <div>
                        <div className="font-medium text-ink">{result.name}</div>
                        <div className="text-sm text-ink-muted">
                          {result.type === 'city' ? 'City' : result.type === 'state' ? 'State' : 'Country'}
                          {episodeCount > 0 && ` · ${episodeCount} episode${episodeCount !== 1 ? 's' : ''}`}
                        </div>
                      </div>
                      <svg className="h-5 w-5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div id={listboxId} role="listbox" className="px-5 py-4 text-sm text-ink-muted">
              {isLoading ? 'Searching…' : `No matches for “${query.trim()}”`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
