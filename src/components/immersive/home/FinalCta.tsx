import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { FINAL_CTA } from './home-content'
import styles from './home.module.css'

/** Section 9 — final CTA. Preserves the existing contact destinations (/contact, WhatsApp, email). */
export default function FinalCta() {
  return (
    <Section
      ruled
      density="sparse"
      innerClassName={styles.ctaInner}
      aria-labelledby="cta-title"
    >
      <div data-home-reveal>
        <SectionLabel className={styles.ctaSup}>{FINAL_CTA.index}</SectionLabel>
        <DisplayHeading
          as="h2"
          size="statement"
          id="cta-title"
          className={styles.ctaTitle}
        >
          {FINAL_CTA.titleLead}
          <em className={styles.tail}>{FINAL_CTA.titleTail}</em>
        </DisplayHeading>
        <p className={styles.ctaSupport}>{FINAL_CTA.support}</p>
        <div className={styles.ctaActions}>
          <PrimaryCTA href={FINAL_CTA.primary.href} variant="primary">
            {FINAL_CTA.primary.label}
          </PrimaryCTA>
          <PrimaryCTA href={FINAL_CTA.secondary.href} variant="secondary">
            {FINAL_CTA.secondary.label}
          </PrimaryCTA>
        </div>
      </div>
    </Section>
  )
}
