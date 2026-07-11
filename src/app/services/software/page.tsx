import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ServiceDetailPage from '@/components/ServiceDetailPage'
import { createServiceJsonLd, SERVICES } from '@/data/services'

export const metadata: Metadata = {
  title: 'Custom Software',
  description:
    'Portals, dashboards, internal tools, integrations, and products shaped around how your business runs. Dubai-based, worldwide delivery.',
  alternates: { canonical: '/services/software' },
  openGraph: {
    title: 'Custom Software | Techwise IQ',
    description:
      'Portals, dashboards, internal tools, integrations, and products shaped around how your business runs.',
    url: 'https://techwiseiq.com/services/software',
  },
}

export default function SoftwareServicePage() {
  const service = SERVICES.software

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createServiceJsonLd(service)),
        }}
      />
      <Nav />
      <main>
        <ServiceDetailPage service={service} />
      </main>
      <Footer />
    </>
  )
}
