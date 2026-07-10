import Image from 'next/image'
import Link from 'next/link'
import { CASE_STUDIES, SERVICE_LABELS } from '@/data/case-studies'
import styles from './work.module.css'

const pageTotal = CASE_STUDIES.reduce((total, caseStudy) => {
  const pages = caseStudy.workSummary.proof.find(
    (item) => item.label === 'pages',
  )
  return total + Number.parseInt(pages?.value ?? '0', 10)
}, 0)

const deliveryWeeks = CASE_STUDIES.map((caseStudy) =>
  Number.parseInt(caseStudy.timeline, 10),
).filter(Number.isFinite)

const DELIVERY_METRICS = [
  { value: String(pageTotal), label: 'Pages shipped' },
  {
    value: `${Math.min(...deliveryWeeks)}–${Math.max(...deliveryWeeks)}`,
    label: 'Week launches',
  },
  {
    value: String(CASE_STUDIES.filter((caseStudy) => caseStudy.liveUrl).length),
    label: 'Live projects',
  },
]

export default function WorkGrid() {
  return (
    <div className={styles.projects}>
      {CASE_STUDIES.map((cs, index) => (
        <div key={cs.slug}>
          <article
            className={`${styles.project} ${index % 2 === 1 ? styles.projectReverse : ''}`}
          >
            <div
              className={styles.projectVisual}
              data-animate={index % 2 === 1 ? 'slide-right' : 'slide-left'}
            >
              {cs.coverImage && (
                <Image
                  src={cs.coverImage}
                  alt={`${cs.title} website preview`}
                  fill
                  sizes="(max-width: 880px) 100vw, 50vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={styles.projectImage}
                />
              )}
            </div>

            <div
              className={styles.projectContent}
              data-animate={index % 2 === 1 ? 'slide-left' : 'slide-right'}
            >
              <p className={styles.projectMeta}>
                Project {String(index + 1).padStart(2, '0')} /{' '}
                {SERVICE_LABELS[cs.service]} / {cs.industry} / {cs.timeline}
              </p>
              <h3 className={styles.projectTitle}>{cs.title}</h3>
              <p className={styles.projectOutcome}>{cs.outcome}</p>

              <dl className={styles.proofGrid}>
                {cs.workSummary.proof.map((item) => (
                  <div key={item.label} className={styles.proofItem}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>

              <div className={styles.storyGrid}>
                <div>
                  <p className={styles.storyLabel}>Challenge</p>
                  <p>{cs.workSummary.challenge}</p>
                </div>
                <div>
                  <p className={styles.storyLabel}>Decision</p>
                  <p>{cs.workSummary.decision}</p>
                </div>
                <div>
                  <p className={styles.storyLabel}>Outcome</p>
                  <p>{cs.workSummary.outcome}</p>
                </div>
              </div>

              <div className={styles.projectActions}>
                <Link
                  href={`/work/${cs.slug}`}
                  className={styles.projectPrimary}
                  aria-label={`Read ${cs.title} case study`}
                >
                  Read full case study <span aria-hidden="true">→</span>
                </Link>
                {cs.liveUrl && (
                  <a
                    href={cs.liveUrl}
                    className={styles.projectSecondary}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${cs.title} live site (opens in a new tab)`}
                  >
                    Visit live site <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>

          {index === 0 && (
            <dl
              className={styles.metrics}
              data-animate="slide-up"
              data-stagger="0.1"
              aria-label="Published work totals"
            >
              {DELIVERY_METRICS.map((metric) => (
                <div key={metric.label} className={styles.metric}>
                  <dd>{metric.value}</dd>
                  <dt>{metric.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </div>
  )
}
