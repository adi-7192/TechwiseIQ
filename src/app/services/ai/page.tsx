import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ServiceDetailPage from '@/components/ServiceDetailPage'
import { createServiceJsonLd, SERVICES } from '@/data/services'

export const metadata: Metadata = {
  title: 'AI Automation',
  description:
    'Workflow automation, AI assistants, document processing, and practical AI audits with visible human control. Based in Dubai.',
  alternates: { canonical: '/services/ai' },
  openGraph: {
    title: 'AI Automation | Techwise IQ',
    description:
      'Workflow automation, AI assistants, document processing, and practical AI audits with visible human control.',
    url: 'https://techwiseiq.com/services/ai',
  },
}

export default function AIServicePage() {
  const service = SERVICES.ai

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
