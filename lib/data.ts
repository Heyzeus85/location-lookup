import { StateData, ProcessedStateData, Episode, SearchResult, US_STATES } from '@/types';

// Fetch episodes data from private GitHub repo
async function fetchEpisodesData(): Promise<StateData[]> {
 if (!process.env.GITHUB_TOKEN) {
   throw new Error('GITHUB_TOKEN environment variable is required');
 }

 const response = await fetch(
   'https://api.github.com/repos/Heyzeus85/location-lookup-data/contents/episodes.json',
   {
     headers: {
       'Authorization': `token ${process.env.GITHUB_TOKEN}`,
       'Accept': 'application/vnd.github.v3.raw'
     },
     cache: 'no-store'
   }
 );
 
 if (!response.ok) {
   throw new Error(`Failed to fetch episodes data: ${response.status}`);
 }
 
 return response.json();
}

// Cache the data to avoid multiple API calls during build
let cachedData: StateData[] | null = null;

async function getHouseHuntersData(): Promise<StateData[]> {
 if (!cachedData) {
   cachedData = await fetchEpisodesData();
 }
 return cachedData;
}

// Process raw JSON data into a more usable format
export function processStateData(rawData: StateData[]): ProcessedStateData[] {
 return rawData.map(stateData => {
   const cities = stateData.cities.map(cityObj => {
     const cityName = Object.keys(cityObj)[0];
     const episodes = cityObj[cityName];
     
     return {
       name: cityName,
       episodes: episodes
     };
   });

   const totalEpisodes = cities.reduce((sum, city) => sum + city.episodes.length, 0);

   return {
     state: stateData.state,
     stateName: US_STATES[stateData.state] || stateData.state,
     cities,
     totalEpisodes
   };
 });
}

// Get all processed state data
export async function getAllStatesData(): Promise<ProcessedStateData[]> {
 const data = await getHouseHuntersData();
 return processStateData(data);
}

// Get data for a specific state
export async function getStateData(stateCode: string): Promise<ProcessedStateData | null> {
 const allStates = await getAllStatesData();
 
 // Handle URL-formatted state codes (convert hyphens back to spaces)
 const normalizedStateCode = stateCode.replace(/-/g, ' ');
 
 return allStates.find(state => 
   state.state.toLowerCase() === normalizedStateCode.toLowerCase()
 ) || null;
}

// Get all episodes across all states (for search)
export async function getAllEpisodes(): Promise<Episode[]> {
 const allStates = await getAllStatesData();
 const episodes: Episode[] = [];
 
 allStates.forEach(state => {
   state.cities.forEach(city => {
     episodes.push(...city.episodes);
   });
 });
 
 return episodes;
}

// Generate search results for autocomplete
export async function generateSearchIndex(): Promise<SearchResult[]> {
 const allStates = await getAllStatesData();
 const searchResults: SearchResult[] = [];
 
 // Add states to search index
 allStates.forEach(state => {
   searchResults.push({
     type: 'state',
     name: state.stateName,
     path: `/states/${state.state.toLowerCase()}`,
     episodes: []
   });
 });
 
 // Add cities to search index
 allStates.forEach(state => {
   state.cities.forEach(city => {
     searchResults.push({
       type: 'city',
       name: `${city.name}, ${state.stateName}`,
       state: state.state,
       path: `/states/${state.state.toLowerCase()}#${city.name.toLowerCase().replace(/\s+/g, '-')}`,
       episodes: city.episodes
     });
   });
 });
 
 return searchResults;
}

// Search function for autocomplete
export async function searchLocations(query: string, limit: number = 10): Promise<SearchResult[]> {
 if (!query || query.length < 2) return [];
 
 const searchIndex = await generateSearchIndex();
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

// Get static paths for all states (for Next.js static generation)
export async function getStaticPaths() {
 const allStates = await getAllStatesData();
 return allStates.map(state => ({
   params: { state: state.state.toLowerCase() }
 }));
}