import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { RevealObserver } from '@/components/ui'
import { CASE_STUDIES, getCaseStudy } from '@/data/case-studies'
import styles from './case-study.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}

  return {
    title: `${cs.title} \u2014 ${cs.outcome}`,
    description: cs.problem,
    openGraph: {
      title: `${cs.title} | Techwise IQ`,
      description: cs.outcome,
      url: `https://techwiseiq.com/work/${cs.slug}`,
    },
  }
}

const SERVICE_LABELS: Record<string, string> = {
  web: 'Web Development',
  software: 'Custom Software',
  ai: 'AI Automation',
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return (
    <>
      <RevealObserver />
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="wrap">
            <div className={styles.breadcrumb}>
              <Link href="/work" className={styles.back}>
                Work
              </Link>
              <span className={styles.sep}>/</span>
              <span className={styles.current}>{cs.title}</span>
            </div>
            <h1 className={`${styles.title} rv`}>{cs.title}</h1>
            <p className={`${styles.outcome} rv rv-d1`}>{cs.outcome}</p>
          </div>
        </section>

        {/* Snapshot */}
        <section className={styles.snapshot}>
          <div className="wrap">
            <div className={`${styles.snapGrid} rv`}>
              <div className={styles.snapItem}>
                <p className={styles.snapLabel}>Client</p>
                <p className={styles.snapValue}>{cs.client}</p>
              </div>
              <div className={styles.snapItem}>
                <p className={styles.snapLabel}>Industry</p>
                <p className={styles.snapValue}>{cs.industry}</p>
              </div>
              <div className={styles.snapItem}>
                <p className={styles.snapLabel}>Service</p>
                <p className={styles.snapValue}>
                  {SERVICE_LABELS[cs.service] ?? cs.service}
                </p>
              </div>
              <div className={styles.snapItem}>
                <p className={styles.snapLabel}>Timeline</p>
                <p className={styles.snapValue}>{cs.timeline}</p>
              </div>
              {cs.liveUrl && (
                <div className={styles.snapItem}>
                  <p className={styles.snapLabel}>Live</p>
                  <p className={styles.snapValue}>
                    <a
                      href={cs.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.snapLink}
                    >
                      Visit site &rarr;
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={`${styles.sectionLabel} rv`}>The problem</p>
            <p className={`${styles.sectionBody} rv rv-d1`}>{cs.problem}</p>
          </div>
        </section>

        {/* Constraints */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={`${styles.sectionLabel} rv`}>Constraints</p>
            <p className={`${styles.sectionBody} rv rv-d1`}>
              {cs.constraints}
            </p>
          </div>
        </section>

        {/* What we did */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={`${styles.sectionLabel} rv`}>What we did</p>
            <ul className={`${styles.approachList} rv rv-d1`}>
              {cs.approach.map((item) => (
                <li key={item} className={styles.approachItem}>
                  <span className={styles.approachArrow} aria-hidden="true">
                    &rarr;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The result */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={`${styles.sectionLabel} rv`}>The result</p>
            <p className={`${styles.sectionBody} rv rv-d1`}>{cs.result}</p>
          </div>
        </section>

        {/* Stack */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={`${styles.sectionLabel} rv`}>Built with</p>
            <div className={`${styles.stackList} rv rv-d1`}>
              {cs.stack.map((tech) => (
                <span key={tech} className={styles.stackTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
