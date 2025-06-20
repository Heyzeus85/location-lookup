import { countryCodeToName } from './country-codes';
import { 
  InternationalCountryData, 
  ProcessedInternationalCountryData, 
  InternationalEpisode, 
  InternationalSearchResult 
} from '@/types';

// Fetch international episodes data from private GitHub repo
async function fetchInternationalEpisodesData(): Promise<InternationalCountryData[]> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const response = await fetch(
    'https://api.github.com/repos/Heyzeus85/location-lookup-data/contents/int_episodes.json',
    {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw'
      },
      cache: 'no-store'
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch international episodes data: ${response.status}`);
  }
  
  const rawData = await response.json();

  return rawData.map((countryData: any) => {
    const cities = countryData.cities.map((cityObj: any) => {
      const episodes: InternationalEpisode[] = cityObj.episodes.map((rawEpisode: any) => ({
        Season: rawEpisode.season,
        Episode: rawEpisode.episode_number,
        Date: rawEpisode.air_date,
        Title: rawEpisode.title,
        Description: rawEpisode.description,
        City: rawEpisode.city,
        Country: rawEpisode.country_code,
      }));
      return { [cityObj.city]: episodes };
    });

    return {
      country: countryData.country_code,
      cities: cities,
    };
  });
}

// Cache the data to avoid multiple API calls during build
let cachedInternationalData: InternationalCountryData[] | null = null;

async function getInternationalHouseHuntersData(): Promise<InternationalCountryData[]> {
  if (!cachedInternationalData) {
    cachedInternationalData = await fetchInternationalEpisodesData();
  }
  return cachedInternationalData;
}

// Process raw JSON data into a more usable format
export function processInternationalCountryData(rawData: InternationalCountryData[]): ProcessedInternationalCountryData[] {
  return rawData.map(countryData => {
    const cities = countryData.cities.map(cityObj => {
      const cityName = Object.keys(cityObj)[0];
      const episodes = cityObj[cityName];
      
      return {
        name: cityName,
        episodes: episodes
      };
    });

    const totalEpisodes = cities.reduce((sum, city) => sum + city.episodes.length, 0);

    const countryCode = countryData.country.toUpperCase();

    return {
      country: countryData.country,
      countryName: countryCodeToName[countryCode] || countryData.country,
      cities,
      totalEpisodes
    };
  });
}

// Get all processed international country data
export async function getAllInternationalCountriesData(): Promise<ProcessedInternationalCountryData[]> {
  const data = await getInternationalHouseHuntersData();
  return processInternationalCountryData(data);
}

// Get data for a specific country
export async function getInternationalCountryData(countrySlug: string): Promise<ProcessedInternationalCountryData | null> {
  const allCountries = await getAllInternationalCountriesData();
  
  // Handle URL-formatted country codes (convert hyphens back to spaces)
  const normalizedCountryName = countrySlug.replace(/-/g, ' ');
  
  return allCountries.find(country => 
    country.countryName.toLowerCase() === normalizedCountryName.toLowerCase()
  ) || null;
}

// Get all international episodes across all countries (for search)
export async function getAllInternationalEpisodes(): Promise<InternationalEpisode[]> {
  const allCountries = await getAllInternationalCountriesData();
  const episodes: InternationalEpisode[] = [];
  
  allCountries.forEach(country => {
    country.cities.forEach(city => {
      episodes.push(...city.episodes);
    });
  });
  
  return episodes;
}

// Generate search results for international autocomplete
export async function generateInternationalSearchIndex(): Promise<InternationalSearchResult[]> {
  const allCountries = await getAllInternationalCountriesData();
  const searchResults: InternationalSearchResult[] = [];
  
  // Add countries to search index
  allCountries.forEach(country => {
    const countryPath = country.countryName.toLowerCase().replace(/\s+/g, '-');
    searchResults.push({
      type: 'country',
      name: country.countryName,
      path: `/int/countries/${countryPath}`,
      episodes: []
    });
  });
  
  // Add cities to search index
  allCountries.forEach(country => {
    const countryPath = country.countryName.toLowerCase().replace(/\s+/g, '-');
    country.cities.forEach(city => {
      searchResults.push({
        type: 'city',
        name: `${city.name}, ${country.countryName}`,
        country: country.country,
        path: `/int/countries/${countryPath}#${city.name.toLowerCase().replace(/\s+/g, '-')}`,
        episodes: city.episodes
      });
    });
  });
  
  return searchResults;
}

// Search function for international autocomplete
export async function searchInternationalLocations(query: string, limit: number = 10): Promise<InternationalSearchResult[]> {
  if (!query || query.length < 2) return [];
  
  const searchIndex = await generateInternationalSearchIndex();
  const lowerQuery = query.toLowerCase();
  
  const matches = searchIndex.filter(item =>
    item.name.toLowerCase().includes(lowerQuery)
  );
  
  // Sort by relevance (exact matches first, then starts-with, then contains)
  matches.sort((a, b) => {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    
    if (aLower === lowerQuery) return -1;
    if (bLower === lowerQuery) return 1;
    if (aLower.startsWith(lowerQuery) && !bLower.startsWith(lowerQuery)) return -1;
    if (bLower.startsWith(lowerQuery) && !aLower.startsWith(lowerQuery)) return 1;
    
    return a.name.localeCompare(b.name);
  });
  
  return matches.slice(0, limit);
}

// Get static paths for all countries (for Next.js static generation)
export async function getInternationalStaticPaths() {
  const allCountries = await getAllInternationalCountriesData();
  return allCountries.map(country => ({
    params: { country: country.countryName.toLowerCase().replace(/\s+/g, '-') }
  }));
} 