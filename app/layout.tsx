import type { Metadata } from 'next'
import './globals.css'
import SimpleBMCButton from '@/components/SimpleBMCButton'


export const metadata: Metadata = {
    title: 'Location Lookup - Find TV Show Episodes by Filming Location',
    description: 'Discover TV episodes filmed in your area. Search by state or city to find home buying show episodes shot in specific locations across the United States.',
    keywords: 'TV episodes, filming locations, home buying shows, reality TV, episode guide, filmed locations, television, real estate shows',
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <SimpleBMCButton username="jdwalters85" />
      </body>
    </html>
  )
}