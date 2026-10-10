import Image from 'next/image'
import Link from 'next/link'
import { CASE_STUDIES } from '@/data/case-studies'
import type { CaseStudy } from '@/types'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import BrowserBar from '@/components/BrowserBar'
import { getProjectStatus, partitionProjects } from './work-projects'
import styles from './work.module.css'

function ExternalLink({ caseStudy }: { caseStudy: CaseStudy }) {
  const href = caseStudy.liveUrl ?? caseStudy.previewUrl
  if (!href) return null
  return (
    <a
      href={href}
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
  )
}

function FeaturedProject({
  caseStudy,
  index,
}: {
  caseStudy: CaseStudy
  index: number
}) {
  const reverse = index % 2 === 1
  const { challenge, reported } = caseStudy.workSummary

  return (
    <article
      className={`${styles.projectStage} ${reverse ? styles.projectStageReverse : ''}`}
      data-project-stage
      data-project-index={index}
      data-client-project
      data-featured-project
    >
      {/* Pointer shortcut only; the "Read full case study" pill is the accessible link. */}
      <Link
        href={`/work/${caseStudy.slug}`}
        className={`${styles.projectVisual} ${styles.coverLink}`}
        tabIndex={-1}
        aria-hidden="true"
        data-project-image
      >
        {/* Featured studies are always live (unit-tested); the bar shows the real domain. */}
        <BrowserBar
          label={new URL(caseStudy.liveUrl!).hostname.replace(/^www\./, '')}
        />
        <div className={styles.projectShot}>
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
      </Link>

      <div className={styles.projectBody}>
        <p className={styles.projectMeta}>
          <span className={styles.projectIndex}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{caseStudy.industry.replaceAll(' / ', ' · ')}</span>
        </p>
        <h3 className={styles.projectTitle} data-project-title>
          {caseStudy.title}
        </h3>
        <p className={styles.projectOutcome}>{caseStudy.outcome}</p>

        <dl className={styles.proofCloud} aria-label={`${caseStudy.title} proof`}>
          {caseStudy.workSummary.proof.map((item) => (
            <div key={item.label} data-project-proof>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        {reported && (
          <dl className={styles.beforeResult}>
            <div>
              <dt className={`${styles.storyLabel} ${styles.storyLabelMuted}`}>
                Before
              </dt>
              <dd>{challenge}</dd>
            </div>
            <div className={styles.resultCol}>
              <dt className={styles.storyLabel}>
                <span aria-hidden="true">→</span> Result{' '}
                <span className={styles.reportedTag}>
                  <span aria-hidden="true">·</span> Client-reported
                </span>
              </dt>
              <dd>{reported}</dd>
            </div>
          </dl>
        )}

        <div className={styles.projectActions}>
          <Link href={`/work/${caseStudy.slug}`} className={styles.projectPrimary}>
            Read full case study
            <span className="sr-only"> for {caseStudy.title}</span>{' '}
            <span aria-hidden="true">→</span>
          </Link>
          <ExternalLink caseStudy={caseStudy} />
        </div>
      </div>
    </article>
  )
}

function MoreProject({ caseStudy }: { caseStudy: CaseStudy }) {
  const status = getProjectStatus(caseStudy)

  return (
    <article className={styles.moreProject} data-client-project data-more-project>
      <Link
        href={`/work/${caseStudy.slug}`}
        className={`${styles.moreThumb} ${styles.coverLink}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {caseStudy.coverImage && (
          <Image
            src={caseStudy.coverImage}
            alt={`${caseStudy.title} homepage preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.projectImage}
          />
        )}
      </Link>
      <p
        className={styles.statusChip}
        data-project-status={status.toLowerCase().replaceAll(' ', '-')}
      >
        {status}
      </p>
      <h4 className={styles.conceptTitle}>{caseStudy.title}</h4>
      <p className={styles.projectOutcome}>{caseStudy.outcome}</p>
      <div className={styles.moreLinks}>
        <Link href={`/work/${caseStudy.slug}`} className={styles.projectSecondary}>
          Read full case study
          <span className="sr-only"> for {caseStudy.title}</span>{' '}
          <span aria-hidden="true">→</span>
        </Link>
        <ExternalLink caseStudy={caseStudy} />
      </div>
    </article>
  )
}

export default function FeaturedWork() {
  const { featured, remaining } = partitionProjects(CASE_STUDIES)
  if (featured.length === 0) return null

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

      {remaining.length > 0 && (
        <div data-testid="more-client-work">
          <div className={styles.moreHead}>
            <div>
              <SectionLabel hideMark>More client work</SectionLabel>
              <h3 className={styles.principleTitle}>
                Client builds on preview links.
              </h3>
            </div>
            <p className={styles.projectOutcome}>
              Built for real clients. Not on their own domains yet, so we link
              the preview.
            </p>
          </div>
          <div className={styles.moreGrid}>
            {remaining.map((caseStudy) => (
              <MoreProject key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
