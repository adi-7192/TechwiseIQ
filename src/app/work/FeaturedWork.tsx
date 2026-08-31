import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CASE_STUDIES, SERVICE_LABELS } from '@/data/case-studies'
import type { CaseStudy } from '@/types'
import { CASE_ACCENT } from './case-accent'
import { getDeliveryMetrics, partitionProjects } from './work-projects'
import styles from './work.module.css'

function ProjectActions({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className={styles.projectActions}>
      <Link href={`/work/${caseStudy.slug}`} className={styles.projectPrimary}>
        Read full case study
        <span className="sr-only"> for {caseStudy.title}</span>{' '}
        <span aria-hidden="true">→</span>
      </Link>
      {caseStudy.liveUrl && (
        <a
          href={caseStudy.liveUrl}
          className={styles.projectSecondary}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit live site
          <span className="sr-only">
            {' '}
            for {caseStudy.title}, opens in a new tab
          </span>{' '}
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}

function FeaturedProject({
  caseStudy,
  index,
}: {
  caseStudy: CaseStudy
  index: number
}) {
  const accentStyle = {
    '--tw-accent': `var(--tw-${CASE_ACCENT[caseStudy.slug] ?? 'acid'})`,
  } as CSSProperties
  const reverse = index % 2 === 1

  return (
    <article
      className={`${styles.projectStage} ${reverse ? styles.projectStageReverse : ''}`}
      style={accentStyle}
      data-project-stage
      data-project-index={index}
      data-client-project
      data-featured-project
    >
      <div className={styles.projectVisual} data-project-image>
        {caseStudy.coverImage && (
          <Image
            src={caseStudy.coverImage}
            alt={`${caseStudy.title} website preview`}
            fill
            sizes="(max-width: 880px) 100vw, 55vw"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            className={styles.projectImage}
          />
        )}
      </div>

      <div className={styles.projectBody}>
        <p className={styles.projectMeta}>
          <span className={styles.projectIndex}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{SERVICE_LABELS[caseStudy.service]}</span>
          <span>{caseStudy.industry}</span>
          <span>{caseStudy.timeline}</span>
        </p>
        <h3 className={styles.projectTitle} data-project-title>
          {caseStudy.title}
        </h3>
        <p className={styles.projectOutcome}>{caseStudy.outcome}</p>

        <dl className={styles.proofCloud} aria-label={`${caseStudy.title} proof`}>
          {caseStudy.workSummary.proof.map((item) => (
            <div key={item.label} data-project-proof>
              <dd>{item.value}</dd>
              <dt>{item.label}</dt>
            </div>
          ))}
        </dl>

        <div className={styles.projectStory}>
          <div>
            <p className={styles.storyLabel}>Challenge</p>
            <p>{caseStudy.workSummary.challenge}</p>
          </div>
          <div>
            <p className={styles.storyLabel}>Decision</p>
            <p>{caseStudy.workSummary.decision}</p>
          </div>
          <ProjectActions caseStudy={caseStudy} />
        </div>
      </div>
    </article>
  )
}

export default function FeaturedWork() {
  const { featured } = partitionProjects(CASE_STUDIES)
  if (featured.length === 0) return null

  const deliveryMetrics = getDeliveryMetrics(CASE_STUDIES)

  return (
    <>
      <div className={styles.featuredRail} data-testid="featured-project-rail">
        {featured.map((caseStudy, index) => (
          <FeaturedProject
            key={caseStudy.slug}
            caseStudy={caseStudy}
            index={index}
          />
        ))}
      </div>

      {deliveryMetrics.length > 0 && (
        <dl className={styles.metrics} aria-label="Published work totals">
          {deliveryMetrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <dd>{metric.value}</dd>
              <dt>{metric.label}</dt>
            </div>
          ))}
        </dl>
      )}
    </>
  )
}
