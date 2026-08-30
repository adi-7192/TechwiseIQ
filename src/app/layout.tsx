import type { Metadata, Viewport } from 'next'
import { Anton, Archivo, Manrope, Space_Mono } from 'next/font/google'
import RouteFocusManager from '@/components/RouteFocusManager'
import WhatsAppButton from '@/components/WhatsAppButton'
import { socialMetadata } from '@/lib/metadata'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Immersive display grotesk (variable, high x-height) — carries the large
// chapter/hero type of the redesign. Added alongside the Kinetic faces during
// the page-by-page migration; Anton is retired once no route references it.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
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
      className={`${anton.variable} ${archivo.variable} ${spaceMono.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body>
        <RouteFocusManager />
        <WhatsAppButton />
        {children}
        {PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  )
}
