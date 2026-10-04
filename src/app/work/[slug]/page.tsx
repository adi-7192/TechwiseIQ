import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { SiteHeader, SiteFooter } from '@/components/global'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import {
  CASE_STUDIES,
  SERVICE_LABELS,
  getCaseStudy,
  getNextCaseStudy,
} from '@/data/case-studies'
import { BOOKING_URL, WHATSAPP_URL } from '@/lib/site'
import { socialMetadata } from '@/lib/metadata'
import { CASE_ACCENT, CASE_SCENE } from '../case-accent'
import { getProjectStatus } from '../work-projects'
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
    title: `${cs.title} — ${cs.outcome}`,
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
  const nextCaseStudy = getNextCaseStudy(slug)
  const scene = CASE_SCENE[cs.slug] ?? 'web'
  // The case accent may differ from the scene's default signal colour.
  const accentStyle = {
    '--tw-accent': `var(--tw-${CASE_ACCENT[cs.slug] ?? 'acid'})`,
  } as CSSProperties

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
    <ImmersiveShell scene={scene}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />
      <main
        id="main"
        className={styles.experience}
        style={accentStyle}
        data-testid="case-study-experience"
      >
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <div className={styles.breadcrumb}>
              <Link href="/work" className={styles.back}>
                Work
              </Link>
              <span aria-hidden="true">/</span>
              <span>{cs.title}</span>
            </div>
            <p className={styles.heroMeta}>
              {cs.industry} / {SERVICE_LABELS[cs.service]} / {cs.timeline}
            </p>
            <h1 className={styles.title}>
              {cs.title}
              <span aria-hidden="true">.</span>
            </h1>
            <p className={styles.outcome}>{cs.outcome}</p>
          </div>
        </section>

        {/* Project facts */}
        <section className={styles.facts} aria-label="Project facts">
          <div className={styles.wrap}>
            <dl className={styles.factsGrid}>
              <div className={styles.factItem}>
                <dt>Client</dt>
                <dd>{cs.client}</dd>
              </div>
              <div className={styles.factItem}>
                <dt>Industry</dt>
                <dd>{cs.industry}</dd>
              </div>
              <div className={styles.factItem}>
                <dt>Service</dt>
                <dd>{SERVICE_LABELS[cs.service]}</dd>
              </div>
              <div className={styles.factItem}>
                <dt>Timeline</dt>
                <dd>{cs.timeline}</dd>
              </div>
              <div className={styles.factItem}>
                <dt>Status</dt>
                <dd>{getProjectStatus(cs)}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Proof band */}
        {cs.stats && cs.stats.length > 0 && (
          <section className={styles.proofBand} aria-label="Project proof">
            <div className={styles.wrap}>
              <dl className={styles.proofGrid} data-testid="case-study-proof">
                {cs.stats.map((stat) => (
                  <div key={stat.label} className={styles.proofItem}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Hero artifact — real cover imagery */}
        {cs.coverImage && (
          <section className={styles.visualChapter}>
            <div className={styles.wrap}>
              <div className={styles.coverFrame}>
                <Image
                  src={cs.coverImage}
                  alt={`${cs.title} homepage screenshot`}
                  fill
                  sizes="(max-width: 768px) 92vw, 1152px"
                  loading="eager"
                  fetchPriority="high"
                  className={styles.coverImg}
                />
              </div>
              <div className={styles.coverCaption}>
                <p>{cs.liveUrl ? 'The launch' : 'The build'} / Homepage</p>
                <p>{cs.coverCaption}</p>
              </div>
            </div>
          </section>
        )}

        {/* Problem + constraints */}
        <section className={styles.chapter}>
          <div className={styles.wrap}>
            <div className={styles.challengeGrid}>
              <div>
                <p className={styles.sectionLabel}>01 / The challenge</p>
                <h2>{cs.storyTitle}</h2>
              </div>
              <div className={styles.challengeCopy}>
                <article>
                  <h3>The problem</h3>
                  <p>{cs.problem}</p>
                </article>
                <article>
                  <h3>The constraint</h3>
                  <p>{cs.constraints}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Key decisions */}
        <section className={styles.chapter}>
          <div className={styles.wrap}>
            <p className={styles.sectionLabel}>02 / The decisions</p>
            <h2 className={styles.sectionTitle}>
              What moved the work <span>forward.</span>
            </h2>
            <ol className={styles.decisionList} data-testid="case-study-decisions">
              {cs.decisions.map((decision, index) => (
                <li key={decision.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Delivered scope + full build imagery */}
        <section className={styles.chapter} data-testid="case-study-system">
          <div className={styles.wrap}>
            <p className={styles.sectionLabel}>03 / The shipped system</p>
            <h2 className={styles.sectionTitle}>
              One {cs.liveUrl ? 'launch' : 'build'}.{' '}
              <span>Every layer.</span>
            </h2>
            <div className={styles.systemGrid}>
              <div>
                <ul className={styles.deliverableCloud}>
                  {cs.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {cs.liveUrl ? (
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.liveLink}
                  >
                    Visit the live site
                    <span className="sr-only">
                      {' '}
                      for {cs.title}, opens in a new tab
                    </span>{' '}
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : cs.previewUrl ? (
                  <>
                    <a
                      href={cs.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.liveLink}
                      aria-describedby="preview-note"
                    >
                      View the preview
                      <span className="sr-only">
                        {' '}
                        for {cs.title}, opens in a new tab
                      </span>{' '}
                      <span aria-hidden="true">↗</span>
                    </a>
                    <p id="preview-note" className={styles.previewNote}>
                      Preview build. Not the client&apos;s live domain.
                    </p>
                  </>
                ) : null}
              </div>
              {cs.fullPageImage && (
                <div className={styles.browserFrame}>
                  <p>Full-page build / Scroll inside the frame ↓</p>
                  <div
                    className={styles.fullFrame}
                    role="region"
                    aria-label={`Full-page screenshot of the ${cs.title} website`}
                    tabIndex={0}
                  >
                    <Image
                      src={cs.fullPageImage.src}
                      alt={`Full-page screenshot of the ${cs.title} website`}
                      width={cs.fullPageImage.width}
                      height={cs.fullPageImage.height}
                      sizes="(max-width: 880px) 92vw, 48vw"
                      className={styles.fullImg}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Result */}
        <section className={styles.chapter}>
          <div className={styles.wrap}>
            <div className={styles.resultGrid}>
              <div>
                <p className={styles.sectionLabel}>04 / The result</p>
                <h2 className={styles.resultTitle}>
                  Credibility,{' '}
                  <span>{cs.liveUrl ? 'shipped.' : 'built.'}</span>
                </h2>
              </div>
              <div>
                <p className={styles.resultCopy}>{cs.result}</p>
                {cs.stats && (
                  <dl className={styles.resultStats}>
                    {cs.stats.map((stat) => (
                      <div key={stat.label}>
                        <dt>{stat.label}</dt>
                        <dd>{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Technology / stack */}
        <section className={styles.chapter}>
          <div className={styles.wrap}>
            <p className={styles.sectionLabel}>Built with</p>
            <div className={styles.stackList}>
              {cs.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Next case study */}
        {nextCaseStudy && (
          <section className={styles.nextChapter}>
            <div className={styles.wrap}>
              <p>Continue exploring</p>
              <h2>{nextCaseStudy.title}</h2>
              <Link
                href={`/work/${nextCaseStudy.slug}`}
                className={styles.nextLink}
                aria-label={`Next case study: ${nextCaseStudy.title}`}
              >
                Next case study <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* Project CTA */}
        <section className={styles.ctaChapter}>
          <div className={styles.wrap}>
            <div className={styles.ctaInner}>
              <p className={styles.sectionLabel}>Start a project like this</p>
              <h2 className={styles.ctaTitle}>Bring us the problem.</h2>
              <p className={styles.ctaBody}>
                Send the underperforming website, the manual workflow or the tool
                idea nobody has framed properly yet. We&apos;ll tell you how we
                would approach it.
              </p>
              <div className={styles.ctaActions}>
                <PrimaryCTA href="/contact" variant="primary">
                  Start a project
                </PrimaryCTA>
                <PrimaryCTA href={WHATSAPP_URL} variant="secondary">
                  WhatsApp
                </PrimaryCTA>
                <PrimaryCTA href={BOOKING_URL} variant="ghost">
                  Book a 20-minute call
                </PrimaryCTA>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
