import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Space_Mono } from 'next/font/google'
import Analytics from '@/components/Analytics'
import RouteFocusManager from '@/components/RouteFocusManager'
import WhatsAppButton from '@/components/WhatsAppButton'
import { socialMetadata } from '@/lib/metadata'
import './globals.css'

// One variable face for display and body (D-045); weights 400–680 come from the axis.
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Explicit (matches Next's default) so responsive behavior is auditable
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Techwise IQ — Web, Software & AI Engineering',
    template: '%s | Techwise IQ',
  },
  description:
    'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations. Agencies sell hours. We sell outcomes.',
  metadataBase: new URL('https://techwiseiq.com'),
  ...socialMetadata({
    title: 'Techwise IQ — Web, Software & AI Engineering',
    description:
      'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations. Agencies sell hours. We sell outcomes.',
    url: '/',
  }),
}

// Privacy-friendly analytics (Plausible), enabled only when the domain is
// configured — matches what the privacy policy promises (no cookies, no PII).
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${interTight.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Analytics />
        <RouteFocusManager />
        {children}
        <WhatsAppButton />
        {PLAUSIBLE_DOMAIN && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}',
              }}
            />
            <script
              defer
              data-domain={PLAUSIBLE_DOMAIN}
              src="https://plausible.io/js/script.js"
            />
          </>
        )}
      </body>
    </html>
  )
}
