import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { ScrollAnimator } from '@/components/ui'
import { CASE_STUDIES } from '@/data/case-studies'
import WorkGrid from './WorkGrid'
import styles from './work.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ \u2014 web development, custom software, and AI automation.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Work | Techwise IQ',
    description:
      'Real projects, real decisions, real results. Case studies from Techwise IQ.',
    url: 'https://techwiseiq.com/work',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://techwiseiq.com/work',
  name: 'Work — Techwise IQ case studies',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: CASE_STUDIES.map((cs, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: cs.title,
      url: `https://techwiseiq.com/work/${cs.slug}`,
    })),
  },
}

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollAnimator />
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className="wrap">
            <span className={styles.label}>Our work</span>
            <h1 className={styles.title} data-animate="slide-up">
              Proof, not
              <br />
              <span className={styles.titleAccent}>promises.</span>
            </h1>
            <p className={styles.intro} data-animate="slide-up">
              Real projects. Real decisions. Real results. No stock screenshots,
              no invented case studies.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <WorkGrid />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
