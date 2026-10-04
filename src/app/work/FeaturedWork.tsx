import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CASE_STUDIES, SERVICE_LABELS } from '@/data/case-studies'
import type { CaseStudy } from '@/types'
import { CASE_ACCENT } from './case-accent'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import {
  getDeliveryMetrics,
  getProjectStatus,
  partitionProjects,
} from './work-projects'
import styles from './work.module.css'

function ProjectActions({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className={styles.projectActions}>
      <Link href={`/work/${caseStudy.slug}`} className={styles.projectPrimary}>
        Read full case study
        <span className="sr-only"> for {caseStudy.title}</span>{' '}
        <span aria-hidden="true">→</span>
      </Link>
      {(caseStudy.liveUrl || caseStudy.previewUrl) && (
        <a
          href={caseStudy.liveUrl ?? caseStudy.previewUrl}
          className={styles.projectSecondary}
          target="_blank"
          rel="noopener noreferrer"
        >
          {caseStudy.liveUrl ? 'Visit live site' : 'View preview'}
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

function MoreProject({ caseStudy }: { caseStudy: CaseStudy }) {
  const status = getProjectStatus(caseStudy)

  return (
    <article className={styles.moreItem} data-client-project data-more-project>
      <div className={styles.moreThumb}>
        {caseStudy.coverImage && (
          <Image
            src={caseStudy.coverImage}
            alt={`${caseStudy.title} homepage preview`}
            fill
            sizes="(max-width: 768px) 256px, 192px"
            className={styles.projectImage}
          />
        )}
      </div>
      <div className={styles.moreBody}>
        <p className={styles.projectMeta}>
          <span>
            {caseStudy.industry} · {caseStudy.timeline}
          </span>
        </p>
        <h4 className={styles.conceptTitle}>{caseStudy.title}</h4>
        <p
          className={styles.statusChip}
          data-project-status={status.toLowerCase().replaceAll(' ', '-')}
        >
          {status}
        </p>
        <p className={styles.projectOutcome}>{caseStudy.outcome}</p>
        <ProjectActions caseStudy={caseStudy} />
      </div>
    </article>
  )
}

export default function FeaturedWork() {
  const { featured, remaining } = partitionProjects(CASE_STUDIES)
  if (featured.length === 0) return null

  // Totals count live client sites only; previews are shown, never counted.
  const deliveryMetrics = getDeliveryMetrics(
    CASE_STUDIES.filter((cs) => cs.liveUrl),
  )

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

      {remaining.length > 0 && (
        <div className={styles.moreWork} data-testid="more-client-work">
          <div>
            <SectionLabel hideMark>More client work</SectionLabel>
            <h3 className={styles.principleTitle}>Built. Not launched yet.</h3>
            <p className={styles.projectOutcome}>
              Client builds that aren&apos;t on the client&apos;s own domain
              yet. The previews show the work.
            </p>
          </div>
          <div className={styles.moreList}>
            {remaining.map((caseStudy) => (
              <MoreProject key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
