'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '96px 24px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-anton)',
          fontSize: 'clamp(64px, 12vw, 140px)',
          lineHeight: 1,
          color: 'var(--hot)',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
        }}
      >
        Something broke.
      </p>
      <p
        style={{
          fontFamily: 'var(--font-archivo)',
          fontSize: 'clamp(16px, 2vw, 22px)',
          fontWeight: 500,
          marginTop: '24px',
          marginBottom: '48px',
          maxWidth: '44ch',
        }}
      >
        Not on brand, we know. Try again — or email us and we&apos;ll fix it
        while you watch.
      </p>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Button variant="secondary" href="/">
          Go home
        </Button>
      </div>
    </main>
  )
}
