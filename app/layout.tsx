import type { Metadata } from 'next'
import './globals.css'
import SimpleBMCButton from '@/components/SimpleBMCButton'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: {
    default: 'Location Lookup - Find TV Show Episodes by Filming Location',
    template: '%s | Location Lookup'
  },
  description: 'Discover TV episodes filmed in your area. Search by state or city to find home buying show episodes shot in specific locations across the United States and internationally.',
  keywords: [
    'TV episodes',
    'filming locations', 
    'home buying shows',
    'reality TV',
    'episode guide',
    'filmed locations',
    'television',
    'real estate shows',
    'House Hunters',
    'House Hunters International',
    'TV show locations',
    'where was filmed',
    'episode finder',
    'location search'
  ].join(', '),
  authors: [{ name: 'Location Lookup' }],
  creator: 'Location Lookup',
  publisher: 'Location Lookup',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://location-lookup.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://location-lookup.vercel.app',
    title: 'Location Lookup - Find TV Show Episodes by Filming Location',
    description: 'Discover TV episodes filmed in your area. Search by state or city to find home buying show episodes shot in specific locations across the United States and internationally.',
    siteName: 'Location Lookup',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Location Lookup - TV Show Episode Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Location Lookup - Find TV Show Episodes by Filming Location',
    description: 'Discover TV episodes filmed in your area. Search by state or city to find home buying show episodes shot in specific locations.',
    images: ['/og-image.jpg'],
    creator: '@locationlookup',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Location Lookup",
              "description": "Find TV show episodes by filming location",
              "url": "https://location-lookup.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://location-lookup.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <SimpleBMCButton username="jdwalters85" />
        <Analytics />
      </body>
    </html>
  )
}