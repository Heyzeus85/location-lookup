import { ImageResponse } from 'next/og'

export const alt = 'Location Lookup - Find TV show episodes by filming location'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#2563EB">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#1F2937' }}>Location Lookup</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 800, color: '#111827', lineHeight: 1.1, letterSpacing: -1.5 }}>
            Find home buying show episodes by filming location
          </div>
          <div style={{ fontSize: 32, color: '#4B5563' }}>
            Search any U.S. state, city, or country around the world.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', padding: '12px 24px', borderRadius: 12, background: '#2563EB', color: 'white', fontSize: 26, fontWeight: 600 }}>
              United States
            </div>
            <div style={{ display: 'flex', padding: '12px 24px', borderRadius: 12, background: '#16A34A', color: 'white', fontSize: 26, fontWeight: 600 }}>
              International
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#2563EB' }}>locationlookup.us</div>
        </div>
      </div>
    ),
    size
  )
}
