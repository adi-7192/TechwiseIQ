import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ServiceDetailPage from '@/components/ServiceDetailPage'
import { createServiceJsonLd, SERVICES } from '@/data/services'
import { socialMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Web Development',
  description:
    'Custom websites engineered to load fast, rank well, and turn visitor attention into action. Based in Dubai, serving clients worldwide.',
  alternates: { canonical: '/services/web' },
  ...socialMetadata({
    title: 'Web Development | Techwise IQ',
    description:
      'Custom websites engineered to load fast, rank well, and turn visitor attention into action.',
    url: '/services/web',
  }),
}

export default function WebServicePage() {
  const service = SERVICES.web

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
