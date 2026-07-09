import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const anton = await readFile(
    join(process.cwd(), 'src/assets/fonts/Anton-Regular.ttf'),
  )

  return new ImageResponse(
    (
      <div
        style={{
          background: '#101010',
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Anton',
          fontSize: 76,
          letterSpacing: 1,
        }}
      >
        <div style={{ color: '#F2F0E9' }}>T</div>
        <div style={{ color: '#FF4D00' }}>IQ</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Anton', data: anton, weight: 400, style: 'normal' }],
    },
  )
}
