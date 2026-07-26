import type { Metadata } from 'next'
import AboutExperience from '@/components/AboutExperience'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import { socialMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  title: {
    absolute: 'About Techwise IQ | Business-First Engineering in Dubai',
  },
  description:
    'Techwise IQ turns business bottlenecks into websites, custom software, and AI systems. Built in Dubai and trusted by businesses beyond borders.',
  alternates: { canonical: '/about' },
  ...socialMetadata({
    title: 'About Techwise IQ | Business-First Engineering in Dubai',
    description:
      'You bring the business goal. We make the technical path clear and take responsibility for delivery.',
    url: '/about',
  }),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://techwiseiq.com/about',
  name: 'About Techwise IQ',
  description:
    'Dubai-based digital engineering company building websites, custom software, and AI systems around business outcomes.',
  mainEntity: { '@id': 'https://techwiseiq.com/#organization' },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <AboutExperience />
      </main>
      <Footer />
    </>
  )
}
