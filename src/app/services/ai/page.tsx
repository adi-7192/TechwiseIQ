import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { SiteHeader, SiteFooter } from '@/components/global'
import ServiceDetailPage, { SERVICE_SCENE } from '@/components/ServiceDetailPage'
import { createServiceJsonLd, SERVICES } from '@/data/services'
import { socialMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'AI Automation',
  description:
    'Workflow automation, AI assistants, document processing, and practical AI audits with visible human control. Based in Dubai.',
  alternates: { canonical: '/services/ai' },
  ...socialMetadata({
    title: 'AI Automation | Techwise IQ',
    description:
      'Workflow automation, AI assistants, document processing, and practical AI audits with visible human control.',
    url: '/services/ai',
  }),
}

export default function AIServicePage() {
  const service = SERVICES.ai

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
