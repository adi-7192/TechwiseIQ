import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import { ScrollAnimator } from '@/components/ui'
import {
  CASE_STUDIES,
  SERVICE_LABELS,
  getCaseStudy,
} from '@/data/case-studies'
import { socialMetadata } from '@/lib/metadata'
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
    alternates: { canonical: `/work/${cs.slug}` },
    ...socialMetadata({
      title: `${cs.title} | Techwise IQ`,
      description: cs.outcome,
      url: `/work/${cs.slug}`,
    }),
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Work',
        item: 'https://techwiseiq.com/work',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: cs.title,
        item: `https://techwiseiq.com/work/${cs.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ScrollAnimator />
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
            <h1 className={styles.title} data-animate="slide-up">{cs.title}</h1>
            <p className={styles.outcome} data-animate="slide-up">{cs.outcome}</p>
          </div>
        </section>

        {/* Snapshot */}
        <section className={styles.snapshot}>
          <div className="wrap">
            <div className={styles.snapGrid} data-animate="slide-up">
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
                  <Link
                    href={`/services/${cs.service}`}
                    className={styles.snapLink}
                  >
                    {SERVICE_LABELS[cs.service] ?? cs.service}
                  </Link>
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

        {/* Cover */}
        {cs.coverImage && (
          <section className={styles.cover}>
            <div className="wrap">
              <div className={styles.coverFrame} data-animate="slide-up">
                <Image
                  src={cs.coverImage}
                  alt={`${cs.title} website screenshot`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1152px"
                  priority
                  className={styles.coverImg}
                />
              </div>
            </div>
          </section>
        )}

        {/* The problem */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={styles.sectionLabel} data-animate="slide-up">The problem</p>
            <p className={styles.sectionBody} data-animate="slide-up">{cs.problem}</p>
          </div>
        </section>

        {/* Constraints */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={styles.sectionLabel} data-animate="slide-up">Constraints</p>
            <p className={styles.sectionBody} data-animate="slide-up">
              {cs.constraints}
            </p>
          </div>
        </section>

        {/* What we did */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={styles.sectionLabel} data-animate="slide-up">What we did</p>
            <ul className={styles.approachList} data-animate="slide-up">
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

        {/* What we delivered */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={styles.sectionLabel} data-animate="slide-up">What we delivered</p>
            <ul className={styles.deliverablesList} data-animate="slide-up">
              {cs.deliverables.map((item) => (
                <li key={item} className={styles.deliverableItem}>
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
            <p className={styles.sectionLabel} data-animate="slide-up">The result</p>
            <p className={styles.sectionBody} data-animate="slide-up">{cs.result}</p>
            {cs.stats && (
              <dl
                className={styles.statsGrid}
                data-animate="slide-up"
                data-stagger="0.12"
              >
                {cs.stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <dt className={styles.statLabel}>{stat.label}</dt>
                    <dd className={styles.statValue}>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        {/* The full build */}
        {cs.fullPageImage && (
          <section className={styles.section}>
            <div className="wrap">
              <p className={styles.sectionLabel} data-animate="slide-up">
                The full build — scroll the page we shipped
              </p>
              <div
                className={styles.fullFrame}
                data-animate="slide-up"
                role="region"
                aria-label={`Full-page screenshot of the ${cs.title} website`}
                tabIndex={0}
              >
                <Image
                  src={cs.fullPageImage.src}
                  alt={`Full-page screenshot of the ${cs.title} website`}
                  width={cs.fullPageImage.width}
                  height={cs.fullPageImage.height}
                  sizes="(max-width: 1200px) 100vw, 1152px"
                  className={styles.fullImg}
                />
              </div>
            </div>
          </section>
        )}

        {/* Stack */}
        <section className={styles.section}>
          <div className="wrap">
            <p className={styles.sectionLabel} data-animate="slide-up">Built with</p>
            <div className={styles.stackList} data-animate="slide-up">
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
