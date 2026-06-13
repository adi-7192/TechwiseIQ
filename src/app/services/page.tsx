import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { RevealObserver } from '@/components/ui'
import styles from './services.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web development, custom software, and AI automation — scoped tight, shipped weekly, priced in writing. Based in Dubai, serving clients worldwide.',
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
      <RevealObserver />
      <Nav />
      <main>
        <section className={styles.hero}>
          <div className="wrap">
            <span className={styles.label}>What we do — 001 to 003</span>
            <h1 className={`${styles.title} rv`}>
              Three pillars.
              <br />
              <span className={styles.titleAccent}>One outcome.</span>
            </h1>
            <p className={`${styles.intro} rv rv-d1`}>
              Web development, custom software, AI automation. Each scoped tight,
              shipped weekly, priced in writing.
            </p>
          </div>
        </section>

        <section className={styles.list}>
          <div className="wrap">
            {SERVICES.map((svc, i) => (
              <Link
                key={svc.num}
                href={svc.href}
                className={`${styles.svc} rv${i === 1 ? ' rv-d1' : ''}${i === 2 ? ' rv-d2' : ''}`}
              >
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
