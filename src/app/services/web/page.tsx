import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { SiteHeader, SiteFooter } from '@/components/global'
import ServiceDetailPage, { SERVICE_SCENE } from '@/components/ServiceDetailPage'
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
