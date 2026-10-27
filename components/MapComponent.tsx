'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import { ProcessedStateData } from '@/types'
import { buildColorBuckets, colorForCount, MAP_EMPTY } from '@/lib/color-scale'

// From us-atlas@3.0.1 (ISC), served locally so the map does not depend on a third-party CDN
const geoUrl = "/maps/us-states-10m.json"

// Map state names (from the atlas) to state codes
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

interface MapComponentProps {
  allStatesData: ProcessedStateData[]
  stateEpisodeCounts: Record<string, number>
}

export default function MapComponent({ allStatesData, stateEpisodeCounts }: MapComponentProps) {
  const router = useRouter()

  const buckets = useMemo(
    () => buildColorBuckets(Object.entries(stateEpisodeCounts).filter(([code]) => code !== 'UL').map(([, count]) => count)),
    [stateEpisodeCounts]
  )

  return (
    <>
      {/* Map Section */}
      <div className="card hidden p-6 md:block">
        <h2 className="section-title mb-1 text-center">Explore by state</h2>
        <p className="mb-4 text-center text-sm text-ink-muted">Darker states have more episodes. Click one to see them.</p>

        <div className="mx-auto w-full max-w-4xl">
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
                  const stateName = geo.properties?.name
                  const stateCode = stateNameToCode[stateName]
                  const episodeCount = stateCode ? stateEpisodeCounts[stateCode] || 0 : 0

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorForCount(episodeCount, buckets)}
                      stroke="#ffffff"
                      strokeWidth={0.75}
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
                          router.push(`/states/${stateCode.toLowerCase()}`)
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
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-muted">
          <div className="flex items-center">
            <span className="mr-2 h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: MAP_EMPTY }} />
            None
          </div>
          {buckets.map(bucket => (
            <div key={bucket.label} className="flex items-center">
              <span className="mr-2 h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: bucket.color }} />
              <span className="whitespace-nowrap tabular-nums">{bucket.label}</span>
            </div>
          ))}
          <span className="text-ink-faint">episodes</span>
        </div>
      </div>

      {/* State List - Mobile */}
      <div className="card p-5 md:hidden">
        <h2 className="section-title mb-4 text-center">Browse by state</h2>

        <div className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto">
          {allStatesData
            .filter(state => state.totalEpisodes > 0) // Only show states with episodes
            .sort((a, b) => b.totalEpisodes - a.totalEpisodes) // Sort by episode count, highest first
            .map((state) => (
              <Link
                key={state.state}
                href={`/states/${state.state.toLowerCase()}`}
                className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3 transition-colors hover:border-accent-300 hover:bg-accent-50"
              >
                <span className="flex items-center gap-3 font-medium text-ink">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: colorForCount(state.totalEpisodes, buckets) }} />
                  {state.stateName}
                </span>
                <span className="text-sm tabular-nums text-ink-muted">
                  {state.totalEpisodes} {state.totalEpisodes === 1 ? 'episode' : 'episodes'}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </>
  )
}
