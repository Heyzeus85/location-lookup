import { MetadataRoute } from 'next'
import { getAllStatesData, getStaticPaths } from '@/lib/data'
import { getAllInternationalCountriesData, getInternationalStaticPaths } from '@/lib/international-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://location-lookup.vercel.app'
  
  // Get all states data
  const allStatesData = await getAllStatesData()
  const statePaths = await getStaticPaths()
  
  // Get all international countries data
  const allCountriesData = await getAllInternationalCountriesData()
  const countryPaths = await getInternationalStaticPaths()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/int/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]
  
  // State pages
  const statePages = statePaths.map((path) => ({
    url: `${baseUrl}/states/${path.params.state}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  
  // Country pages
  const countryPages = countryPaths.map((path) => ({
    url: `${baseUrl}/int/countries/${path.params.country}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  
  return [...staticPages, ...statePages, ...countryPages]
} 