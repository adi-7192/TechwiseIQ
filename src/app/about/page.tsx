import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { RevealObserver } from '@/components/ui'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About Techwise IQ',
  description:
    'A digital engineering agency headquartered in Dubai. Senior engineers, fixed scope, working demos every Friday. We use the AI we sell.',
  openGraph: {
    title: 'About | Techwise IQ',
    description:
      'Senior engineers, fixed scope, working demos every Friday. We use the AI we sell.',
    url: 'https://techwiseiq.com/about',
  },
}

const PRINCIPLES = [
  {
    num: '01',
    title: 'Fixed scope',
    body: 'You get a written scope before we write a line of code. Fixed price, fixed timeline, fixed deliverables. If we underestimated, that\u2019s on us.',
  },
  {
    num: '02',
    title: 'Weekly demos',
    body: 'Working software every Friday. You click the product, not read status reports. If a week\u2019s work doesn\u2019t pass your eyes, it doesn\u2019t ship.',
  },
  {
    num: '03',
    title: 'No surprises',
    body: 'The price is the price. No scope creep surcharges, no hidden platform fees, no \u201Cthis took longer than expected\u201D emails.',
  },
]

const EVIDENCE = [
  'This website \u2014 built with AI-assisted engineering',
  'Code reviews \u2014 automated analysis on every change',
  'Project scoping \u2014 AI-drafted proposals from discovery notes',
  'Internal ops \u2014 automated deployments and notifications',
]

export default function AboutPage() {
  return (
    <>
      <RevealObserver />
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="wrap">
            <span className={styles.label}>About us</span>
            <h1 className={`${styles.title} rv`}>
              Built different.
              <br />
              <span className={styles.titleAccent}>On purpose.</span>
            </h1>
            <p className={`${styles.intro} rv rv-d1`}>
              A digital engineering agency headquartered in Dubai. We build
              websites, custom software, and AI automations for businesses that
              want outcomes &mdash; not process theater.
            </p>
          </div>
        </section>

        {/* Identity — Who we are */}
        <section className={styles.identity}>
          <div className="wrap">
            <div className={styles.identityGrid}>
              <h2 className={`${styles.sectionHead} rv`}>Who we are</h2>
              <div className={`${styles.identityBody} rv rv-d1`}>
                <p>
                  Small team. Senior engineers. Every project gets the people
                  who scoped it &mdash; not a bench of juniors cycling through
                  on rotation.
                </p>
                <p>
                  We opened in Dubai. We work with clients worldwide. Most
                  communication is async, with weekly demo calls where you click
                  working software &mdash; not watch slides.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy — How we think */}
        <section className={styles.philosophy}>
          <div className="wrap">
            <span className={styles.label}>How we think</span>
            <h2 className={`${styles.sectionHead} rv`}>
              Outcomes, not hours.
            </h2>
            <div className={styles.principles}>
              {PRINCIPLES.map((p, i) => (
                <div
                  key={p.num}
                  className={`${styles.principle} rv${i === 1 ? ' rv-d1' : ''}${i === 2 ? ' rv-d2' : ''}`}
                >
                  <span className={styles.principleNum}>{p.num}</span>
                  <h3 className={styles.principleTitle}>{p.title}</h3>
                  <p className={styles.principleBody}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI-first */}
        <section className={styles.aifirst}>
          <div className="wrap">
            <h2 className={`${styles.aifirstHeading} rv`}>
              We use the{' '}
              <span className={styles.aifirstAccent}>AI we sell.</span>
            </h2>
            <p className={`${styles.aifirstBody} rv rv-d1`}>
              This isn&apos;t a marketing claim. It&apos;s how we operate.
              Every workflow we automate for a client, we&apos;ve
              pressure-tested on ourselves first.
            </p>
            <ul className={`${styles.evidence} rv rv-d2`}>
              {EVIDENCE.map((item) => (
                <li key={item} className={styles.evidenceItem}>
                  <span className={styles.evidenceArrow} aria-hidden="true">
                    &rarr;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Founder note */}
        <section className={styles.founder}>
          <div className="wrap">
            <span className={styles.label}>A note from the founder</span>
            <div className={`${styles.founderQuote} rv`}>
              <p>
                I started Techwise IQ because I kept seeing the same pattern:
                businesses paying agency rates for junior work, wrapped in
                process theater. Kickoff meetings that produce decks.
                &ldquo;Discovery phases&rdquo; that discover nothing. Status
                updates that update nothing.
              </p>
              <p>
                The fix isn&apos;t complicated. Put senior engineers on the
                work. Scope it tight. Show progress every week. Use AI where it
                actually helps &mdash; in the build, not just in the pitch.
              </p>
              <p>
                We&apos;re new as a company. The people aren&apos;t new to the
                work. And we&apos;d rather show you two projects done right than
                pretend we&apos;ve done two hundred.
              </p>
            </div>
            <div className={`rv rv-d1`}>
              <p className={styles.founderSig}>Adi</p>
              <p className={styles.founderRole}>Founder, Techwise IQ</p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
