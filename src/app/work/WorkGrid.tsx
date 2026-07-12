import Image from 'next/image'
import Link from 'next/link'
import { CASE_STUDIES, SERVICE_LABELS } from '@/data/case-studies'
import type { CaseStudy } from '@/types'
import styles from './work.module.css'
import { partitionProjects } from './work-projects'

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

function ProjectActions({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className={styles.projectActions}>
      <Link
        href={`/work/${caseStudy.slug}`}
        className={styles.projectPrimary}
        aria-label={`Read ${caseStudy.title} case study`}
      >
        Read full case study <span aria-hidden="true">→</span>
      </Link>
      {caseStudy.liveUrl && (
        <a
          href={caseStudy.liveUrl}
          className={styles.projectSecondary}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${caseStudy.title} live site (opens in a new tab)`}
        >
          Visit live site <span aria-hidden="true">↗</span>
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
  return (
    <article
      className={`${styles.projectStage} ${index % 2 === 1 ? styles.projectStageReverse : ''}`}
      data-project-stage
      data-project-index={index}
    >
      <span className={styles.projectGhost} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className={styles.projectVisual} data-project-image>
        {caseStudy.coverImage && (
          <Image
            src={caseStudy.coverImage}
            alt={`${caseStudy.title} website preview`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 86vw, 62vw"
            loading={index === 0 ? 'eager' : 'lazy'}
            className={styles.projectImage}
          />
        )}
      </div>

      <div className={styles.projectIdentity}>
        <p className={styles.projectMeta}>
          Project {String(index + 1).padStart(2, '0')} /{' '}
          {SERVICE_LABELS[caseStudy.service]} / {caseStudy.industry} /{' '}
          {caseStudy.timeline}
        </p>
        <h3 className={styles.projectTitle} data-project-title>
          {caseStudy.title}
        </h3>
        <p className={styles.projectOutcome}>{caseStudy.outcome}</p>
      </div>

      <dl className={styles.proofCloud} aria-label={`${caseStudy.title} proof`}>
        {caseStudy.workSummary.proof.map((item) => (
          <div key={item.label} className={styles.proofItem} data-project-proof>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
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
        <div>
          <p className={styles.storyLabel}>Outcome</p>
          <p>{caseStudy.workSummary.outcome}</p>
        </div>
        <ProjectActions caseStudy={caseStudy} />
      </div>
    </article>
  )
}

function WorkMetrics() {
  return (
    <dl className={styles.metrics} aria-label="Published work totals" data-work-reveal>
      {DELIVERY_METRICS.map((metric) => (
        <div key={metric.label} className={styles.metric}>
          <dd>{metric.value}</dd>
          <dt>{metric.label}</dt>
        </div>
      ))}
    </dl>
  )
}

function IndexedProject({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <article className={styles.indexedProject}>
      <div className={styles.indexedVisual}>
        {caseStudy.coverImage && (
          <Image
            src={caseStudy.coverImage}
            alt={`${caseStudy.title} website preview`}
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
            className={styles.projectImage}
          />
        )}
      </div>
      <div className={styles.indexedCopy}>
        <p className={styles.projectMeta}>
          {SERVICE_LABELS[caseStudy.service]} / {caseStudy.industry} /{' '}
          {caseStudy.timeline}
        </p>
        <h4>{caseStudy.title}</h4>
        <p>{caseStudy.outcome}</p>
        <ProjectActions caseStudy={caseStudy} />
      </div>
    </article>
  )
}

export default function WorkGrid() {
  const { featured, remaining } = partitionProjects(CASE_STUDIES)

  return (
    <div className={styles.projectExperience}>
      <div className={styles.featuredRail} data-testid="featured-project-rail">
        {featured.map((caseStudy, index) => (
          <div
            key={caseStudy.slug}
            className={styles.projectTrack}
            data-featured-project
          >
            <FeaturedProject caseStudy={caseStudy} index={index} />
          </div>
        ))}
      </div>

      <WorkMetrics />

      {remaining.length > 0 && (
        <section
          className={styles.projectIndex}
          data-testid="project-index"
          aria-labelledby="project-index-title"
        >
          <h3 id="project-index-title">More client work</h3>
          <div className={styles.projectIndexTrail}>
            {remaining.map((caseStudy) => (
              <IndexedProject key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
