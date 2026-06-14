import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: "This page doesn't exist. Or we murdered it.",
}

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '96px 24px',
          borderBottom: '3px solid var(--ink)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(120px, 20vw, 200px)',
            lineHeight: 1,
            color: 'var(--hot)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          404
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
          This page doesn&apos;t exist. Or we murdered it.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" href="/">
            Go home
          </Button>
          <Button variant="secondary" href="/#services">
            What we do ↓
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
