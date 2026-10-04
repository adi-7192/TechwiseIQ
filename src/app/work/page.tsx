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

const CLIENTS_GET = [
  'A clear scope, and everything is yours',
  'Direct access to the people building',
  'Something working to see every week',
  'Decisions explained in plain English',
]

const WE_AVOID = [
  'Projects you can’t see into',
  'Weeks with nothing to show',
  'Templates sold as custom design',
  'A handover nobody owns',
]

export default function WorkPage() {
  return (
    <ImmersiveShell scene="web">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" data-work-experience data-testid="work-experience">
        {/* 1 · Hero */}
        <Section as="header" density="sparse" innerClassName={styles.heroInner}>
          <SectionLabel>Proof archive / Our way</SectionLabel>
          <DisplayHeading as="h1" size="hero" className={styles.heroTitle}>
            Proof, not <span>promises.</span>
          </DisplayHeading>
          <p className={styles.heroIntro}>
            <strong>Real sites for real clients</strong>, and how we made them.
            Our own experiments are clearly labelled further down.
          </p>
          <div className={styles.heroActions}>
            <PrimaryCTA href="#selected-work" variant="secondary" arrow={false}>
              See the work
            </PrimaryCTA>
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
                Built for real <span>business.</span>
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
            <SectionLabel index="02">How we work</SectionLabel>
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

          <div className={styles.principlesGrid}>
            <div>
              <SectionLabel hideMark>What clients get</SectionLabel>
              <h3 className={styles.principleTitle}>Visible progress.</h3>
              <ul className={styles.principleList}>
                {CLIENTS_GET.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <SectionLabel hideMark>What we avoid</SectionLabel>
              <h3 className={styles.principleTitle}>Delivery theatre.</h3>
              <ul className={styles.principleList}>
                {WE_AVOID.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 5 · Final CTA */}
        <Section ruled density="sparse" innerClassName={styles.ctaInner} aria-labelledby="work-cta-title">
          <SectionLabel>Your project could be next</SectionLabel>
          <DisplayHeading
            as="h2"
            size="statement"
            id="work-cta-title"
            className={styles.ctaTitle}
          >
            Got a knot? <span>We like knots.</span>
          </DisplayHeading>
          <p className={styles.ctaBody}>
            Twenty minutes. You explain the mess; we explain how we&apos;d
            untangle it.
          </p>
          <div className={styles.ctaActions}>
            <PrimaryCTA href="/contact" variant="primary">
              Bring us the problem
            </PrimaryCTA>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
