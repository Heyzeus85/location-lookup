import { Redis } from '@upstash/redis';
import { unstable_cache } from 'next/cache';
import { getAllStatesData, getMostFeaturedCities } from './data';
import { getAllInternationalCountriesData, getMostFeaturedInternationalCities } from './international-data';
import { toSlug } from './slug';
import { RankedCity } from '@/types';

export type PopularityScope = 'us' | 'int';

// Below this many recorded lookups the list is too noisy to call "popular"
const MIN_TOTAL_LOOKUPS = 25;

// Works with both the Vercel Marketplace (KV_*) and plain Upstash env var names
const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const leaderboardKey = (scope: PopularityScope) => `popular:${scope}`;

interface ResolvedCity {
  key: string;
  name: string;
  region: string;
  path: string;
}

// Map a (region code, city) pair to a canonical leaderboard entry, or null if it isn't in the data
export async function resolveCity(scope: PopularityScope, regionCode: string, city: string): Promise<ResolvedCity | null> {
  const citySlug = toSlug(city);
  const code = regionCode.toUpperCase();

  if (scope === 'us') {
    const state = (await getAllStatesData()).find(s => s.state.toUpperCase() === code);
    const match = state?.cities.find(c => toSlug(c.name) === citySlug);
    if (!state || !match || state.state === 'UL') return null;
    return {
      key: `${code}|${citySlug}`,
      name: match.name,
      region: state.stateName,
      path: `/states/${state.state.toLowerCase()}#${citySlug}`
    };
  }

  const country = (await getAllInternationalCountriesData()).find(c => c.country.toUpperCase() === code);
  const match = country?.cities.find(c => toSlug(c.name) === citySlug);
  if (!country || !match) return null;
  return {
    key: `${code}|${citySlug}`,
    name: match.name,
    region: country.countryName,
    path: `/int/countries/${toSlug(country.countryName)}#${citySlug}`
  };
}

export async function recordLookup(scope: PopularityScope, key: string): Promise<void> {
  if (!redis) return;
  await redis.zincrby(leaderboardKey(scope), 1, key);
}

// Returns true the first time a given fingerprint is seen within 24 hours
export async function isFirstLookupToday(fingerprint: string): Promise<boolean> {
  if (!redis) return true;
  const result = await redis.set(`seen:${fingerprint}`, 1, { nx: true, ex: 60 * 60 * 24 });
  return result === 'OK';
}

async function fetchTopCities(scope: PopularityScope, limit: number): Promise<RankedCity[] | null> {
  if (!redis) return null;

  const entries = await redis.zrange<(string | number)[]>(leaderboardKey(scope), 0, limit * 2 - 1, { rev: true, withScores: true });
  const pairs: { key: string; count: number }[] = [];
  for (let i = 0; i < entries.length; i += 2) {
    pairs.push({ key: String(entries[i]), count: Number(entries[i + 1]) });
  }

  const total = pairs.reduce((sum, p) => sum + p.count, 0);
  if (total < MIN_TOTAL_LOOKUPS) return null;

  const ranked: RankedCity[] = [];
  for (const { key, count } of pairs) {
    const [region, citySlug] = key.split('|');
    const city = await resolveCity(scope, region, citySlug);
    if (city) ranked.push({ name: city.name, region: city.region, path: city.path, count });
    if (ranked.length === limit) break;
  }
  return ranked;
}

const getCachedTopCities = unstable_cache(fetchTopCities, ['popular-cities'], { revalidate: 3600 });

// Most looked-up cities, falling back to the most featured ones until there is enough traffic
export async function getPopularCities(scope: PopularityScope, limit: number = 10): Promise<{ kind: 'popular' | 'featured'; cities: RankedCity[] }> {
  try {
    const popular = await getCachedTopCities(scope, limit);
    if (popular && popular.length > 0) return { kind: 'popular', cities: popular };
  } catch (error) {
    console.error('Failed to load popular cities:', error);
  }

  const featured = scope === 'us' ? await getMostFeaturedCities(limit) : await getMostFeaturedInternationalCities(limit);
  return { kind: 'featured', cities: featured };
}
