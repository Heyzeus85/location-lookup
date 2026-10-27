export const MAP_RAMP = ['#ccfbf1', '#5eead4', '#14b8a6', '#0f766e', '#134e4a'];
export const MAP_EMPTY = '#e7e5e4';

const NICE_STEPS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000];

export interface ColorBucket {
  min: number;
  max: number;
  color: string;
  label: string;
}

function niceRound(value: number): number {
  return NICE_STEPS.reduce((best, step) => (Math.abs(step - value) < Math.abs(best - value) ? step : best), NICE_STEPS[0]);
}

// Split counts into quantile buckets (rounded to readable thresholds) so the map shows a real gradient
export function buildColorBuckets(counts: number[]): ColorBucket[] {
  const sorted = counts.filter(count => count > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return [];

  const thresholds: number[] = [];
  for (let i = 1; i < MAP_RAMP.length; i++) {
    const quantile = sorted[Math.floor((i / MAP_RAMP.length) * (sorted.length - 1))];
    const threshold = niceRound(quantile);
    if (threshold > (thresholds[thresholds.length - 1] ?? 0) && threshold < sorted[sorted.length - 1]) {
      thresholds.push(threshold);
    }
  }

  const buckets: ColorBucket[] = [];
  let min = 1;
  thresholds.forEach(threshold => {
    buckets.push({ min, max: threshold, color: '', label: '' });
    min = threshold + 1;
  });
  buckets.push({ min, max: Infinity, color: '', label: '' });

  // Spread the ramp so the darkest color is always used for the top bucket
  return buckets.map((bucket, index) => ({
    ...bucket,
    color: MAP_RAMP[Math.round((index / Math.max(buckets.length - 1, 1)) * (MAP_RAMP.length - 1))],
    label: bucket.max === Infinity ? `${bucket.min}+` : `${bucket.min}–${bucket.max}`,
  }));
}

export function colorForCount(count: number, buckets: ColorBucket[]): string {
  if (count <= 0) return MAP_EMPTY;
  return buckets.find(bucket => count <= bucket.max)?.color ?? MAP_EMPTY;
}
