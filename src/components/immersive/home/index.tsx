import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import HomeHero from './HomeHero'
import Chapter from './Chapter'
import SelectedWork from './SelectedWork'
import OperatingModel from './OperatingModel'
import FinalCta from './FinalCta'
import { CHAPTERS, FRAMING } from './home-content'
import styles from './home.module.css'

/**
 * The immersive homepage, assembled: hero → framing → four capability chapters
 * → selected work → operating model → final CTA. Server component, static-only
 * (no motion/WebGL at this phase). Mounted inside `ImmersiveShell` by the route.
 */
export default function ImmersiveHome() {
  return (
    <>
      {/* 1 · Hero */}
      <HomeHero />

      {/* 2 · Studio framing statement */}
      <Section ruled density="sparse" aria-labelledby="framing-title">
        <div className={styles.framingGrid}>
          <SectionLabel hideMark>{FRAMING.index}</SectionLabel>
          <DisplayHeading as="h2" size="chapter" id="framing-title">
            {FRAMING.titleLines.map((line, i) => (
              <span key={line} style={{ display: 'block' }}>
                {i === FRAMING.titleLines.length - 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </DisplayHeading>
          <p className={styles.framingAside}>{FRAMING.aside}</p>
        </div>
      </Section>

      {/* 3–6 · Capability chapters */}
      {CHAPTERS.map((chapter) => (
        <Chapter key={chapter.id} chapter={chapter} />
      ))}

      {/* 7 · Selected work (real) */}
      <SelectedWork />

      {/* 8 · Operating model */}
      <OperatingModel />

      {/* 9 · Final CTA */}
      <FinalCta />
    </>
  )
}
