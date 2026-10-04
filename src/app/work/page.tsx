import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import { SiteHeader, SiteFooter } from '@/components/global'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { CASE_STUDIES } from '@/data/case-studies'
import { BOOKING_URL, WHATSAPP_URL } from '@/lib/site'
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
  ['01', 'Align', 'Goals, audience, scope and success measures agreed up front.'],
  ['02', 'Prototype', 'Structure and direction proven before full production.'],
  ['03', 'Build', 'Working software demonstrated every week — not status decks.'],
  ['04', 'Ship', 'Quality assurance, launch and a clean handover of everything.'],
]

const CLIENTS_GET = [
  'Clear scope and ownership',
  'Direct access to the people building',
  'Weekly working demonstrations',
  'Decisions explained in plain language',
]

const WE_AVOID = [
  'Black-box project management',
  'Weeks without a working build',
  'Template design sold as custom work',
  'Vague handover responsibilities',
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
            Real launches, clear decisions and a delivery model clients can
            understand before the first call. Client work leads; self-initiated
            concepts sit clearly apart.
          </p>
          <div className={styles.heroActions}>
            <PrimaryCTA href="#selected-work" variant="secondary" arrow={false}>
              See the work
            </PrimaryCTA>
            <PrimaryCTA href="/contact" variant="ghost">
              Start a project
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
              A straightforward process, visible progress and direct
              communication throughout.
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
            Bring us the <span>problem.</span>
          </DisplayHeading>
          <p className={styles.ctaBody}>
            Start with a focused 20-minute call. You explain the challenge; we
            explain how we would approach it.
          </p>
          <div className={styles.ctaActions}>
            <PrimaryCTA href={BOOKING_URL} variant="primary">
              Discuss your project
            </PrimaryCTA>
            <PrimaryCTA href={WHATSAPP_URL} variant="secondary">
              WhatsApp
            </PrimaryCTA>
            <PrimaryCTA href="/contact" variant="ghost" arrow={false}>
              Contact form
            </PrimaryCTA>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
