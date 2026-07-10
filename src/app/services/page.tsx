import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import RobotVideo from '@/components/RobotVideo'
import { ScrollAnimator } from '@/components/ui'
import styles from './services.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing. Based in Dubai, serving clients worldwide.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Techwise IQ',
    description:
      'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing.',
    url: 'https://techwiseiq.com/services',
  },
}

const SERVICES = [
  {
    num: '001',
    title: 'Web Development',
    tagline: 'Marketing sites, e-commerce, CMS — custom design every time',
    href: '/services/web',
  },
  {
    num: '002',
    title: 'Custom Software',
    tagline: 'Portals, dashboards, APIs, mobile apps — built for how you operate',
    href: '/services/software',
  },
  {
    num: '003',
    title: 'AI Automation',
    tagline: 'Workflow automation, AI assistants, document processing',
    href: '/services/ai',
  },
]

export default function ServicesPage() {
  return (
    <>
      <ScrollAnimator />
      <Nav />
      <main>
        <section className={styles.hero}>
          <RobotVideo />
          <div className={styles.overlay} aria-hidden="true" />
          <div className={`wrap ${styles.heroContent}`}>
            <span className={styles.label}>What we do — 001 to 003</span>
            <h1 className={styles.title} data-animate="slide-up">
              Three pillars.
              <br />
              <span className={styles.titleAccent}>One outcome.</span>
            </h1>
            <p className={styles.intro} data-animate="slide-up">
              Web development, custom software, AI automation. Each scoped tight,
              shipped weekly, priced in writing.
            </p>
            <p className={styles.taglineQuote} data-animate="slide-up">
              Agencies sell hours. We sell outcomes.
            </p>
            <div className={styles.actions}>
              <Link href="/contact" className={styles.actionLink}>
                <span className={styles.actionArrow} aria-hidden="true">→</span>
                Start a project
              </Link>
              <Link href="/work" className={styles.actionLink}>
                <span className={styles.actionArrow} aria-hidden="true">→</span>
                See our work
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.list}>
          <div className="wrap" data-animate="slide-up" data-stagger="0.12">
            {SERVICES.map((svc) => (
              <Link key={svc.num} href={svc.href} className={styles.svc}>
                <div className={styles.row}>
                  <span className={styles.num}>{svc.num}</span>
                  <div style={{ flex: 1 }}>
                    <span className={styles.svcTitle}>{svc.title}</span>
                    <span className={styles.tagline}>{svc.tagline}</span>
                  </div>
                  <span className={styles.arr} aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
