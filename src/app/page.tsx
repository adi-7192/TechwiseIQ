import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { SiteHeader, SiteFooter } from '@/components/global'
import ImmersiveHome from '@/components/immersive/home'
import { socialMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Techwise IQ — Web, Software & AI Engineering | Dubai',
  description:
    'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations. Agencies sell hours. We sell outcomes.',
  alternates: { canonical: '/' },
  ...socialMetadata({
    title: 'Techwise IQ — Web, Software & AI Engineering | Dubai',
    description:
      'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations.',
    url: '/',
  }),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://techwiseiq.com/#organization',
      name: 'Techwise IQ Technologies',
      url: 'https://techwiseiq.com',
      description:
        'Dubai-based digital engineering agency specialising in web development, custom software, and AI automation.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'Info@techwiseiqtechnologies.ae',
        telephone: '+971567760667',
        contactType: 'sales',
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://techwiseiq.com/#service',
      name: 'Techwise IQ Technologies',
      url: 'https://techwiseiq.com',
      provider: { '@id': 'https://techwiseiq.com/#organization' },
      areaServed: ['Dubai', 'United Arab Emirates', 'Worldwide'],
      serviceType: [
        'Web Development',
        'Custom Software Engineering',
        'AI Automation',
      ],
      description:
        'End-to-end web development, custom software engineering, and AI automation services. Fixed scope, weekly demos, no surprise invoices.',
    },
  ],
}

export default function Home() {
  return (
    <ImmersiveShell scene="intro">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main">
        <ImmersiveHome />
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
