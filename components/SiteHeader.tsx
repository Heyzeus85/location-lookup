'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'United States', shortLabel: 'US', isActive: (path: string) => !path.startsWith('/int') },
  { href: '/int', label: 'International', shortLabel: 'Intl', isActive: (path: string) => path.startsWith('/int') },
]

export default function SiteHeader() {
  const pathname = usePathname() || '/'

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-paper/85 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <svg className="h-6 w-6 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
          </svg>
          <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight">Location Lookup</span>
        </Link>

        <nav aria-label="Episode collections" className="flex rounded-full bg-stone-100 p-1 text-sm font-medium">
          {tabs.map(tab => {
            const active = tab.isActive(pathname)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 transition-colors sm:px-4 ${
                  active ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
