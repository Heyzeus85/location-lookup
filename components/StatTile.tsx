'use client'

import { useEffect, useRef, useState } from 'react'

interface StatTileProps {
  value: number
  label: string
}

// Counts up from zero the first time the tile scrolls into view
export default function StatTile({ value, label }: StatTileProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()

      const duration = 900
      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.round(value * eased))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    })

    setDisplayValue(0)
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <div ref={ref} className="card px-2 py-4 text-center sm:px-6 sm:py-5">
      <div className="font-display text-2xl font-semibold sm:text-4xl tabular-nums text-accent-700">
        {displayValue.toLocaleString('en-US')}
      </div>
      <div className="mt-1 text-xs text-ink-muted sm:text-sm">{label}</div>
    </div>
  )
}
