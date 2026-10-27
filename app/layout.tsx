import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import SimpleBMCButton from '@/components/SimpleBMCButton'
import SiteHeader from '@/components/SiteHeader'
import { Analytics } from "@vercel/analytics/next"

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Location Lookup - Find TV Show Episodes by Filming Location',
    template: '%s | Location Lookup'
  },
  description: 'Find home buying episodes set in the cities that interest you. Search by city or state across the United States and internationally.',
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
  metadataBase: new URL('https://locationlookup.us'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://locationlookup.us',
    title: 'Location Lookup - Find TV Show Episodes by Filming Location',
    description: 'Find home buying episodes set in the cities that interest you. Search by city or state across the United States and internationally.',
    siteName: 'Location Lookup',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Location Lookup - Find TV Show Episodes by Filming Location',
    description: 'Find home buying episodes set in the cities that interest you. Search by city or state.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f766e" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Location Lookup",
              "description": "Find TV show episodes by filming location",
              "url": "https://locationlookup.us"
            })
          }}
        />
      </head>
      <body className="antialiased">
        <SiteHeader />
        {children}
        <SimpleBMCButton username="jdwalters85" />
        <Analytics />
      </body>
    </html>
  )
}