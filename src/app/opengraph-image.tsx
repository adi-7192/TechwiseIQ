import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'Techwise IQ — Web, Software & AI Engineering. Dubai, serving clients worldwide.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#101010'
const BONE = '#F2F0E9'
const HOT = '#FF4D00'
const SOFT_DARK = '#9A9A92'

export default async function OpengraphImage() {
  const anton = await readFile(
    join(process.cwd(), 'src/assets/fonts/Anton-Regular.ttf'),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: INK,
          fontFamily: 'Anton',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '56px 64px 0',
          }}
        >
          <div style={{ width: 22, height: 22, background: HOT }} />
          <div
            style={{
              fontSize: 26,
              color: SOFT_DARK,
              letterSpacing: 6,
            }}
          >
            TECHWISE IQ — DUBAI, UAE
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 64px',
            lineHeight: 1.02,
          }}
        >
          <div style={{ fontSize: 104, color: BONE }}>WE BUILD IT.</div>
          <div style={{ fontSize: 104, color: BONE }}>WE SHIP IT.</div>
          <div style={{ fontSize: 104, color: HOT }}>
            YOU OWN THE OUTCOME.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: HOT,
            color: INK,
            padding: '26px 64px',
            fontSize: 34,
            letterSpacing: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div>WEBSITES</div>
            <div style={{ width: 12, height: 12, background: INK }} />
            <div>SOFTWARE</div>
            <div style={{ width: 12, height: 12, background: INK }} />
            <div>AI AUTOMATION</div>
          </div>
          <div>TECHWISEIQ.COM</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Anton', data: anton, weight: 400, style: 'normal' }],
    },
  )
}
