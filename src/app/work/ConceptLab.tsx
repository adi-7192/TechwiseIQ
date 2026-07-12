import Image from 'next/image'
import { CONCEPT_SITES, type ConceptSite } from '@/data/concept-sites'
import styles from './work.module.css'

function ConceptCopy({
  concept,
  index,
  published,
}: {
  concept: ConceptSite
  index: number
  published: boolean
}) {
  return (
    <div className={styles.conceptCopy}>
      <p className={styles.conceptIndex}>
        Demo slot {String(index + 1).padStart(2, '0')} / {concept.category}
      </p>
      <h3 className={styles.conceptTitle}>{concept.title}</h3>
      <p className={styles.conceptSummary}>{concept.summary}</p>
      <ul className={styles.conceptTags} aria-label="Capabilities explored">
        {concept.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <p className={published ? styles.conceptOpen : styles.conceptPending}>
        {published ? (
          <>
            Open live HTML demo <span aria-hidden="true">↗</span>
          </>
        ) : (
          'Brief pending'
        )}
      </p>
    </div>
  )
}

function BrowserBar({ label }: { label: string }) {
  return (
    <div className={styles.browserBar} aria-hidden="true">
      <span />
      <span />
      <span />
      <b>{label}</b>
    </div>
  )
}

function ConceptPreview({ concept }: { concept: ConceptSite }) {
  if (!concept.previewImage || !concept.demoPath) return null

  return (
    <div className={styles.conceptPreview}>
      <BrowserBar label={concept.demoPath} />
      <Image
        src={concept.previewImage}
        alt={`${concept.title} concept website preview`}
        fill
        sizes="(max-width: 767px) 100vw, 62vw"
        className={styles.conceptImage}
      />
    </div>
  )
}

function ConceptBlueprint() {
  return (
    <div className={styles.conceptPreview} aria-hidden="true">
      <BrowserBar label="demo brief reserved" />
      <div className={styles.blueprint}>
        <span className={styles.blueprintNav} />
        <span className={styles.blueprintHeadline} />
        <span className={styles.blueprintCopy} />
        <span className={styles.blueprintMedia} />
        <span className={styles.blueprintButton} />
      </div>
    </div>
  )
}

export default function ConceptLab() {
  if (CONCEPT_SITES.length === 0) return null

  return (
    <section className={styles.conceptLab} data-testid="concept-lab">
      <div className="wrap">
        <div className={styles.sectionIntro} data-work-reveal>
          <p className={styles.label}>Concept Lab / Self-initiated</p>
          <h2 className={styles.sectionTitle}>
            What else could we <span>build?</span>
          </h2>
          <p className={styles.sectionBody}>
            Reserved spaces for coded website explorations across industries,
            visual languages and interaction patterns.
          </p>
          <p className={styles.conceptDisclosure}>
            Concept work — not client commissions
          </p>
        </div>

        <div
          className={styles.conceptTrail}
          data-testid="concept-exhibition"
        >
          {CONCEPT_SITES.map((concept, index) => {
            const published = Boolean(
              concept.status === 'published' &&
                concept.previewImage &&
                concept.demoPath,
            )

            if (published && concept.demoPath) {
              return (
                <a
                  key={concept.slug}
                  href={concept.demoPath}
                  className={`${styles.conceptStage} ${styles.conceptPublished}`}
                  data-concept-stage
                  data-concept-status="published"
                  data-concept-index={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${concept.title} live HTML demo (opens in a new tab)`}
                >
                  <ConceptPreview concept={concept} />
                  <ConceptCopy concept={concept} index={index} published />
                </a>
              )
            }

            return (
              <article
                key={concept.slug}
                className={`${styles.conceptStage} ${styles.conceptDraft}`}
                data-concept-stage
                data-concept-status="draft"
                data-concept-index={index}
              >
                <ConceptBlueprint />
                <ConceptCopy
                  concept={concept}
                  index={index}
                  published={false}
                />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
