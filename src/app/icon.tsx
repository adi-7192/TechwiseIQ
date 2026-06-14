import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#101010',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FF4D00',
          fontFamily: 'serif',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        T
      </div>
    ),
    { ...size },
  )
}
