import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import ServicesSection from '@/components/ServicesSection'
import Ticker from '@/components/Ticker'
import ProcessSection from '@/components/ProcessSection'
import ShoutSection from '@/components/ShoutSection'
import CTASection from '@/components/CTASection'
import { RevealObserver, VelocitySkewObserver } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Techwise IQ — Web, Software & AI Engineering | Dubai',
  description:
    'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations. Agencies sell hours. We sell outcomes.',
  openGraph: {
    title: 'Techwise IQ — Web, Software & AI Engineering | Dubai',
    description:
      'Dubai-based digital engineering agency. We build fast websites, custom software, and AI automations.',
    url: 'https://techwiseiq.com',
  },
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
        email: 'hello@techwiseiq.com',
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RevealObserver />
      <VelocitySkewObserver />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <ServicesSection />
        <Ticker />
        <ProcessSection />
        <ShoutSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
