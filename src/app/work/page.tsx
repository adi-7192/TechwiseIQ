import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { RevealObserver } from '@/components/ui'
import WorkGrid from './WorkGrid'
import styles from './work.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ \u2014 web development, custom software, and AI automation.',
  openGraph: {
    title: 'Work | Techwise IQ',
    description:
      'Real projects, real decisions, real results. Case studies from Techwise IQ.',
    url: 'https://techwiseiq.com/work',
  },
}

export default function WorkPage() {
  return (
    <>
      <RevealObserver />
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className="wrap">
            <span className={styles.label}>Our work</span>
            <h1 className={`${styles.title} rv`}>
              Proof, not
              <br />
              <span className={styles.titleAccent}>promises.</span>
            </h1>
            <p className={`${styles.intro} rv rv-d1`}>
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
