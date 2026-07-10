import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Marquee from '@/components/Marquee'
import { ScrollAnimator } from '@/components/ui'
import { CASE_STUDIES } from '@/data/case-studies'
import { BOOKING_URL } from '@/lib/site'
import ConceptLab from './ConceptLab'
import WorkGrid from './WorkGrid'
import styles from './work.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ — web development, custom software, and AI automation.',
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

const CAPABILITIES = [
  ['Strategy', 'Positioning and information architecture'],
  ['UX / UI', 'Custom responsive interfaces'],
  ['Engineering', 'Production-ready web builds'],
  ['Content', 'Service narratives and case studies'],
  ['Conversion', 'WhatsApp and consultation flows'],
  ['Launch', 'SEO, analytics, and structured data'],
]

const PROCESS = [
  ['01', 'Align', 'Goals, audience, scope and success measures.'],
  ['02', 'Prototype', 'Structure and direction before full production.'],
  ['03', 'Build', 'Working software demonstrated every week.'],
  ['04', 'Ship', 'Quality assurance, launch and a clean handover.'],
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
  'Template-driven design sold as custom work',
  'Vague handover responsibilities',
]

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
            <p className={styles.label} data-animate="slide-up">
              Our work / Our way
            </p>
            <h1 className={styles.heroTitle} data-animate="slide-up">
              Proof, not <span>promises.</span>
            </h1>
            <p className={styles.heroIntro} data-animate="slide-up">
              Real launches, clear decisions and a delivery model clients can
              understand before the first call.
            </p>
            <span className={styles.heroMarker} aria-hidden="true" />
          </div>
        </section>

        <section className={styles.proofMarquee} aria-label="How we deliver">
          <Marquee duration={28}>
            <div className={styles.proofMarqueeSet}>
              <span>Live work</span><b aria-hidden="true">→</b>
              <span>5–6 week launches</span><b aria-hidden="true">→</b>
              <span>Weekly demos</span><b aria-hidden="true">→</b>
              <span>Direct access</span><b aria-hidden="true">→</b>
            </div>
          </Marquee>
        </section>

        <section className={styles.selectedWork}>
          <div className="wrap">
            <div className={styles.sectionIntro}>
              <p className={styles.label}>Selected work</p>
              <h2 className={styles.sectionTitle} data-animate="slide-up">
                Built for real <span>business.</span>
              </h2>
              <p className={styles.sectionBody} data-animate="slide-up">
                Two industries, two distinct challenges, one consistent
                approach: understand the business, make strong decisions and
                ship.
              </p>
            </div>
            <WorkGrid />
          </div>
        </section>

        <section className={styles.capabilities}>
          <div className="wrap">
            <div className={styles.sectionIntro}>
              <p className={styles.label}>Capabilities demonstrated</p>
              <h2 className={styles.sectionTitle} data-animate="slide-up">
                What the work <span>proves.</span>
              </h2>
              <p className={styles.sectionBody} data-animate="slide-up">
                Not a generic services list. These are capabilities visible in
                the projects above.
              </p>
            </div>
            <div
              className={styles.capabilityGrid}
              data-animate="slide-up"
              data-stagger="0.08"
            >
              {CAPABILITIES.map(([title, body], index) => (
                <div key={title} className={styles.capability}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ConceptLab />

        <section className={styles.process}>
          <div className="wrap">
            <div className={styles.sectionIntro}>
              <p className={styles.darkLabel}>How we work</p>
              <h2 className={styles.darkTitle} data-animate="slide-up">
                Clear from kickoff <span>to launch.</span>
              </h2>
              <p className={styles.darkBody} data-animate="slide-up">
                A straightforward process, visible progress and direct
                communication throughout.
              </p>
            </div>
            <div
              className={styles.processGrid}
              data-animate="slide-up"
              data-stagger="0.1"
            >
              {PROCESS.map(([number, title, body]) => (
                <div key={number} className={styles.processStep}>
                  <span aria-hidden="true">{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.principles}>
          <div className="wrap">
            <div className={styles.principlesGrid}>
              <div data-animate="slide-left">
                <p className={styles.label}>What clients get</p>
                <h2 className={styles.principleTitle}>Visible progress.</h2>
                <ul className={styles.principleList}>
                  {CLIENTS_GET.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div data-animate="slide-right">
                <p className={styles.label}>What we avoid</p>
                <h2 className={styles.principleTitle}>Delivery theatre.</h2>
                <ul className={styles.principleList}>
                  {WE_AVOID.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className="wrap">
            <div className={styles.sectionIntro}>
              <p className={styles.darkLabel}>Your project could be next</p>
              <h2 className={styles.darkTitle} data-animate="slide-up">
                Bring us the <span>problem.</span>
              </h2>
              <p className={styles.darkBody} data-animate="slide-up">
                Start with a focused 20-minute call. You explain the challenge;
                we explain how we would approach it.
              </p>
              <a
                href={BOOKING_URL}
                className={styles.ctaButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discuss your project <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
