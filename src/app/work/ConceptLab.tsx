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
        {concept.tags.map((tag) => <li key={tag}>{tag}</li>)}
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

export default function ConceptLab() {
  if (CONCEPT_SITES.length === 0) return null

  return (
    <section className={styles.conceptLab} data-testid="concept-lab">
      <div className="wrap">
        <div className={styles.sectionIntro}>
          <p className={styles.label}>Concept Lab / Self-initiated</p>
          <h2 className={styles.sectionTitle} data-animate="slide-up">
            What else could we <span>build?</span>
          </h2>
          <p className={styles.sectionBody} data-animate="slide-up">
            Reserved spaces for coded website explorations across industries,
            visual languages and interaction patterns.
          </p>
          <p className={styles.conceptDisclosure}>
            Concept work — not client commissions
          </p>
        </div>

        <div
          className={styles.conceptGrid}
          data-animate="slide-up"
          data-stagger="0.08"
        >
          {CONCEPT_SITES.map((concept, index) => {
            if (
              concept.status === 'published' &&
              concept.previewImage &&
              concept.demoPath
            ) {
              return (
                <a
                  key={concept.slug}
                  href={concept.demoPath}
                  className={`${styles.conceptCard} ${styles.conceptPublished}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${concept.title} live HTML demo (opens in a new tab)`}
                >
                  <div className={styles.conceptPreview}>
                    <div className={styles.browserBar} aria-hidden="true">
                      <span /><span /><span />
                      <b>{concept.demoPath}</b>
                    </div>
                    <Image
                      src={concept.previewImage}
                      alt={`${concept.title} concept website preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={styles.conceptImage}
                    />
                  </div>
                  <ConceptCopy
                    concept={concept}
                    index={index}
                    published
                  />
                </a>
              )
            }

            return (
              <div
                key={concept.slug}
                className={`${styles.conceptCard} ${styles.conceptDraft}`}
                data-concept-status="draft"
              >
                <div className={styles.conceptPreview} aria-hidden="true">
                  <div className={styles.browserBar}>
                    <span /><span /><span />
                    <b>demo brief reserved</b>
                  </div>
                  <div className={styles.blueprint}>
                    <span className={styles.blueprintNav} />
                    <span className={styles.blueprintHeadline} />
                    <span className={styles.blueprintCopy} />
                    <span className={styles.blueprintMedia} />
                    <span className={styles.blueprintButton} />
                  </div>
                </div>
                <ConceptCopy
                  concept={concept}
                  index={index}
                  published={false}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
