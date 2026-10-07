import type { Metadata } from 'next'
import AboutExperience from '@/components/AboutExperience'
import { ABOUT_META } from '@/components/AboutExperience/about-content'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import SiteFooter from '@/components/global/SiteFooter'
import SiteHeader from '@/components/global/SiteHeader'
import { getClientCountries } from '@/app/work/work-projects'
import { CASE_STUDIES } from '@/data/case-studies'
import { socialMetadata } from '@/lib/metadata'

const description = ABOUT_META.description(
  getClientCountries(CASE_STUDIES).map((row) => row.country),
)

export const metadata: Metadata = {
  title: { absolute: ABOUT_META.title },
  description,
  alternates: { canonical: '/about' },
  ...socialMetadata({
    title: ABOUT_META.ogTitle,
    description: ABOUT_META.ogDescription,
    url: '/about',
  }),
}

// No founder, headcount, rating, review, award or price (D-003, D-005/D-034).
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://techwiseiq.com/about',
  name: 'About Techwise IQ',
  description: ABOUT_META.jsonLdDescription,
  mainEntity: { '@id': 'https://techwiseiq.com/#organization' },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* CSS atmosphere only: no WebGL on About (D-041). */}
      <ImmersiveShell scene="advisory">
        <SiteHeader />
        <main id="main">
          <AboutExperience />
        </main>
        <SiteFooter />
      </ImmersiveShell>
    </>
  )
}
