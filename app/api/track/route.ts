import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isFirstLookupToday, recordLookup, resolveCity, PopularityScope } from '@/lib/popularity'

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  if (!userAgent || BOT_PATTERN.test(userAgent)) {
    return new NextResponse(null, { status: 204 })
  }

  let body: { scope?: string; region?: string; city?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { scope, region, city } = body
  if ((scope !== 'us' && scope !== 'int') || typeof region !== 'string' || typeof city !== 'string' || city.length > 100) {
    return NextResponse.json({ error: 'Invalid lookup' }, { status: 400 })
  }

  try {
    const resolved = await resolveCity(scope as PopularityScope, region, city)
    if (!resolved) {
      return NextResponse.json({ error: 'Unknown city' }, { status: 400 })
    }

    // Count each visitor once per city per day; only a hash is stored
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.ip || ''
    const fingerprint = createHash('sha256').update(`${ip}|${userAgent}|${scope}|${resolved.key}`).digest('hex')

    if (await isFirstLookupToday(fingerprint)) {
      await recordLookup(scope as PopularityScope, resolved.key)
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
