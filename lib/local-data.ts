import { promises as fs } from 'fs';
import path from 'path';

// Development fallback: when LOCAL_DATA_DIR points at a checkout of
// location-lookup-data, read the JSON from disk instead of the GitHub API.
export async function readLocalDataFile<T>(fileName: string): Promise<T | null> {
  const dir = process.env.LOCAL_DATA_DIR;
  if (!dir) return null;
  const contents = await fs.readFile(path.join(dir, fileName), 'utf8');
  return JSON.parse(contents) as T;
}
