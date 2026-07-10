import type { Metadata } from 'next'
import { Anton, Archivo, Space_Mono } from 'next/font/google'
import WhatsAppButton from '@/components/WhatsAppButton'
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

export const metadata: Metadata = {
  title: {
    default: 'Techwise IQ — Web, Software & AI Engineering',
    template: '%s | Techwise IQ',
  },
  description:
    'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations. Agencies sell hours. We sell outcomes.',
  metadataBase: new URL('https://techwiseiq.com'),
  openGraph: {
    siteName: 'Techwise IQ',
    type: 'website',
    locale: 'en_AE',
  },
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
      className={`${anton.variable} ${archivo.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
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
