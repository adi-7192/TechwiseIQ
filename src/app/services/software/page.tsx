import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { SiteHeader, SiteFooter } from '@/components/global'
import ServiceDetailPage, { SERVICE_SCENE } from '@/components/ServiceDetailPage'
import { createServiceJsonLd, SERVICES } from '@/data/services'
import { socialMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Custom Software',
  description:
    'Portals, dashboards, internal tools, integrations, and products shaped around how your business runs. Dubai-based, worldwide delivery.',
  alternates: { canonical: '/services/software' },
  ...socialMetadata({
    title: 'Custom Software | Techwise IQ',
    description:
      'Portals, dashboards, internal tools, integrations, and products shaped around how your business runs.',
    url: '/services/software',
  }),
}

export default function SoftwareServicePage() {
  const service = SERVICES.software

  return (
    <ImmersiveShell scene={SERVICE_SCENE[service.id]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createServiceJsonLd(service)),
        }}
      />
      <SiteHeader />
      <main id="main">
        <ServiceDetailPage service={service} />
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
