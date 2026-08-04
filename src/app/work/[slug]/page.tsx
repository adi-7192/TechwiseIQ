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
  getNextCaseStudy,
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
  const nextCaseStudy = getNextCaseStudy(slug)

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
      <main
        className={styles.experience}
        data-testid="case-study-experience"
      >
        <section className={styles.hero} data-ghost="PROOF">
          <div className={styles.heroInner}>
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

        {cs.stats && cs.stats.length > 0 && (
          <section className={styles.proofBand} aria-label="Project proof">
            <dl className={styles.proofGrid} data-testid="case-study-proof">
              {cs.stats.map((stat) => (
                <div key={stat.label} className={styles.proofItem}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {cs.coverImage && (
          <section className={styles.visualChapter}>
            <div className="wrap">
              <div className={styles.coverFrame} data-animate="slide-up">
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
                <p>The launch / Homepage</p>
                <p>{cs.coverCaption}</p>
              </div>
            </div>
          </section>
        )}

        <section className={styles.challengeChapter}>
          <div className={styles.chapterGrid}>
            <div data-animate="slide-up">
              <p className={styles.darkLabel}>01 / The challenge</p>
              <h2>{cs.storyTitle}</h2>
            </div>
            <div className={styles.challengeCopy} data-animate="slide-up">
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
        </section>

        <section className={styles.decisionsChapter}>
          <div className="wrap">
            <p className={styles.sectionLabel}>02 / The decisions</p>
            <h2 className={styles.sectionTitle} data-animate="slide-up">
              What moved the work <span>forward.</span>
            </h2>
            <ol
              className={styles.decisionList}
              data-testid="case-study-decisions"
              data-animate="slide-up"
              data-stagger="0.08"
            >
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

        <section
          className={styles.systemChapter}
          data-testid="case-study-system"
        >
          <div className="wrap">
            <p className={styles.sectionLabel}>03 / The shipped system</p>
            <h2 className={styles.sectionTitle} data-animate="slide-up">
              One launch. <span>Every layer.</span>
            </h2>
            <div className={styles.systemGrid}>
              <div>
                <ul
                  className={styles.deliverableCloud}
                  data-animate="slide-up"
                >
                  {cs.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {cs.liveUrl && (
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.liveLink}
                    aria-label={`Visit the ${cs.title} live site (opens in a new tab)`}
                  >
                    Visit the live site <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              {cs.fullPageImage && (
                <div className={styles.browserFrame} data-animate="slide-up">
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
                      sizes="(max-width: 1024px) 92vw, 56vw"
                      className={styles.fullImg}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.resultChapter}>
          <div className={styles.resultGrid}>
            <div data-animate="slide-up">
              <p className={styles.sectionLabel}>04 / The result</p>
              <h2 className={styles.resultTitle}>
                Credibility, <span>shipped.</span>
              </h2>
            </div>
            <div data-animate="slide-up">
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
        </section>

        <section className={styles.stackChapter}>
          <div className="wrap">
            <p className={styles.sectionLabel}>Built with</p>
            <div className={styles.stackList} data-animate="slide-up">
              {cs.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {nextCaseStudy && (
          <section className={styles.nextChapter} data-ghost="NEXT">
            <div className={styles.nextInner}>
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

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
