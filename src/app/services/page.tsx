import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ServicesOverview from '@/components/ServicesOverview'
import { socialMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing. Based in Dubai, serving clients worldwide.',
  alternates: { canonical: '/services' },
  ...socialMetadata({
    title: 'Services | Techwise IQ',
    description:
      'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing.',
    url: '/services',
  }),
}

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main>
        <ServicesOverview />
      </main>
      <Footer />
    </>
  )
}
