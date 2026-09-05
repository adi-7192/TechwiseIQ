import type { CSSProperties } from 'react'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import ProofObject from '@/components/proof'
import ChapterArtifacts from './ChapterArtifacts'
import { SCENE_ACCENT, type ChapterContent } from './home-content'
import styles from './home.module.css'

/**
 * A capability chapter: sparse head (kicker + display title + thesis) over a
 * static proof object and a dense capability matrix. The scene accent is set
 * locally so the whole chapter — dot, rules, proof, matrix — shifts colour
 * without any JavaScript.
 */
export default function Chapter({ chapter }: { chapter: ChapterContent }) {
  const accentStyle = {
    '--tw-accent': SCENE_ACCENT[chapter.scene],
  } as CSSProperties
  const titleId = `chapter-${chapter.id}`

  return (
    <Section
      as="section"
      id={chapter.id}
      ruled
      density="sparse"
      className={styles.chapter}
      style={accentStyle}
      data-scene={chapter.scene}
      aria-labelledby={titleId}
    >
      <div className={styles.chapterHead} data-home-reveal>
        <div className={styles.chapterTitleWrap}>
          <SectionLabel index={chapter.index}>{chapter.kicker}</SectionLabel>
          <DisplayHeading
            as="h2"
            size="chapter"
            id={titleId}
            className={styles.chapterTitle}
          >
            {chapter.title}
            <span className={styles.dot} aria-hidden="true" />
          </DisplayHeading>
        </div>

        <div className={styles.chapterThesis}>
          <h3 className={styles.thesisHead}>{chapter.thesis}</h3>
          <p className={styles.thesisBody}>{chapter.thesisBody}</p>
          <p className={styles.transformation}>
            <span>{chapter.transformation.from}</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
            <span className={styles.to}>{chapter.transformation.to}</span>
          </p>
          {chapter.link && (
            <div className={styles.chapterLink}>
              <PrimaryCTA href={chapter.link.href} variant="ghost">
                {chapter.link.label}
              </PrimaryCTA>
            </div>
          )}
        </div>
      </div>

      <div className={styles.proofReveal} data-home-reveal>
        <ChapterArtifacts scene={chapter.scene} />
        <div className={styles.proofDepth} data-home-proof>
          <ProofObject
            variant={chapter.proof}
            caption={chapter.proofCaption}
            surface="light"
          />
        </div>
      </div>

      <div className={styles.matrix} data-home-reveal>
        {chapter.capabilities.map((cap) => (
          <article className={styles.cap} key={cap.type}>
            <span className={styles.capType}>{cap.type}</span>
            <h4 className={styles.capHead}>{cap.head}</h4>
            <p className={styles.capBody}>{cap.body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
