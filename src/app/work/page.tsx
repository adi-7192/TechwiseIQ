import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import { SiteHeader, SiteFooter } from '@/components/global'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { CASE_STUDIES } from '@/data/case-studies'
import { socialMetadata } from '@/lib/metadata'
import ConceptLab from './ConceptLab'
import FeaturedWork from './FeaturedWork'
import { getDeliveryMetrics } from './work-projects'
import styles from './work.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ — web development, custom software, and AI automation.',
  alternates: { canonical: '/work' },
  ...socialMetadata({
    title: 'Work | Techwise IQ',
    description:
      'Real projects, real decisions, real results. Case studies from Techwise IQ.',
    url: '/work',
  }),
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

const OPERATING = [
  ['01', 'Requirements', 'Your goals, your audience, and what success looks like.'],
  ['02', 'Options', 'A few directions, with our pick. You choose.'],
  ['03', 'Build', 'Working builds shown every week. Not slide decks.'],
  ['04', 'Ship', 'Testing, launch, and a clean handover of everything.'],
]

export default function WorkPage() {
  const deliveryMetrics = getDeliveryMetrics(CASE_STUDIES)

  return (
    <ImmersiveShell scene="web" backdrop="checker">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" data-work-experience data-testid="work-experience">
        {/* 1 · Hero: orient, then prove */}
        <Section as="header" density="flush" innerClassName={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <SectionLabel>Our work</SectionLabel>
            <DisplayHeading as="h1" size="hero" className={styles.heroTitle}>
              Proof, not <span>promises.</span>
            </DisplayHeading>
            <p className={styles.heroIntro}>
              Real sites for real businesses. Open any of them and judge for
              yourself.
            </p>
          </div>
          {deliveryMetrics.length > 0 && (
            <dl className={styles.heroProof} aria-label="Published work totals">
              {deliveryMetrics.map((metric) => (
                <div key={metric.label} className={styles.metric}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className={styles.heroActions}>
            <PrimaryCTA href="/contact" variant="ghost">
              Bring us the problem
            </PrimaryCTA>
          </div>
        </Section>

        {/* 2 · Selected client work — visually dominant */}
        <Section
          id="selected-work"
          ruled
          density="dense"
          aria-labelledby="selected-work-title"
        >
          <div className={styles.workHead}>
            <div className={styles.sectionIntro}>
              <SectionLabel index="01">Selected client work</SectionLabel>
              <DisplayHeading
                as="h2"
                size="h2"
                id="selected-work-title"
                className={styles.sectionTitle}
              >
                Live client <span>sites.</span>
              </DisplayHeading>
            </div>
          </div>
          <FeaturedWork />
        </Section>

        {/* 3 · Concept Lab — self-initiated, clearly labelled */}
        <ConceptLab />

        {/* 4 · How we work */}
        <Section ruled density="sparse" aria-labelledby="operating-title">
          <div className={styles.sectionIntro}>
            <SectionLabel index="03">How we work</SectionLabel>
            <DisplayHeading
              as="h2"
              size="h2"
              id="operating-title"
              className={styles.sectionTitle}
            >
              Clear from kickoff <span>to launch.</span>
            </DisplayHeading>
            <p className={styles.sectionBody}>
              A simple process, progress you can see, and{' '}
              <strong>straight answers</strong> all the way.
            </p>
          </div>
          <div className={styles.operatingGrid}>
            {OPERATING.map(([index, title, body]) => (
              <div key={index} className={styles.operatingStep}>
                <span className={styles.operatingIndex}>{index}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5 · Final CTA: compact, about the work */}
        <Section
          ruled
          density="dense"
          innerClassName={styles.ctaGrid}
          aria-labelledby="work-cta-title"
        >
          <div>
            <SectionLabel>Your turn</SectionLabel>
            <DisplayHeading
              as="h2"
              size="h2"
              id="work-cta-title"
              className={styles.ctaTitle}
            >
              Want one like these? <span>Or something harder?</span>
            </DisplayHeading>
          </div>
          <div>
            <p className={styles.ctaBody}>
              Tell us what you need. We reply within 24 hours, then send a
              written scope after a short call.
            </p>
            <div className={styles.ctaActions}>
              <PrimaryCTA href="/contact" variant="primary">
                Bring us the problem
              </PrimaryCTA>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
