import { CONCEPT_SITES, type ConceptSite } from '@/data/concept-sites'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import BrowserBar from '@/components/BrowserBar'
import styles from './work.module.css'
import LiveConceptPreview from './LiveConceptPreview'
import {
  getConceptPresentationStatus,
  type ConceptPresentationStatus,
} from './concept-presentation'

function ConceptCopy({
  concept,
  index,
  status,
}: {
  concept: ConceptSite
  index: number
  status: ConceptPresentationStatus
}) {
  const published = status === 'published'
  return (
    <div className={styles.conceptCopy}>
      <p className={styles.conceptIndex}>
        Concept {String(index + 1).padStart(2, '0')} · {concept.category}
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
            Open the live demo <span aria-hidden="true">↗</span>
          </>
        ) : (
          status === 'unavailable' ? 'Demo unavailable' : 'Brief pending'
        )}
      </p>
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
    <Section ruled density="dense" className={styles.conceptLab}>
      <div data-testid="concept-lab">
        <div className={styles.sectionIntro}>
          <SectionLabel index="02">Concept Lab / Self-initiated</SectionLabel>
          <DisplayHeading as="h2" size="h2" className={styles.sectionTitle}>
            What else could we <span>build?</span>
          </DisplayHeading>
          <p className={styles.sectionBody}>
            Sites we built for ourselves to try new looks, industries and
            ideas.
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
            const presentationStatus = getConceptPresentationStatus(concept)

            if (presentationStatus === 'published' && concept.demoPath) {
              return (
                <article
                  key={concept.slug}
                  className={`${styles.conceptStage} ${styles.conceptPublished}`}
                  data-concept-stage
                  data-concept-status="published"
                  data-concept-index={index}
                  data-concept-slug={concept.slug}
                >
                  <LiveConceptPreview
                    demoPath={concept.demoPath}
                    title={concept.title}
                  />
                  <a
                    href={concept.demoPath}
                    className={styles.conceptPublishedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open the live demo: ${concept.title} (opens in a new tab)`}
                  >
                    <ConceptCopy
                      concept={concept}
                      index={index}
                      status="published"
                    />
                  </a>
                </article>
              )
            }

            return (
              <article
                key={concept.slug}
                className={`${styles.conceptStage} ${styles.conceptDraft}`}
                data-concept-stage
                data-concept-status={presentationStatus}
                data-concept-index={index}
              >
                <ConceptBlueprint />
                <ConceptCopy
                  concept={concept}
                  index={index}
                  status={presentationStatus}
                />
              </article>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
