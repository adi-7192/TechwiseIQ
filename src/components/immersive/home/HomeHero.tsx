import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { HERO } from './home-content'
import styles from './home.module.css'

/* Tiny static hero artifacts — abstract system marks, purely decorative. */
function ChipRoadmap() {
  return (
    <svg viewBox="0 0 148 92" role="img" aria-hidden="true">
      <line x1="18" y1="24" x2="130" y2="24" stroke="var(--tw-line)" />
      <line x1="18" y1="48" x2="130" y2="48" stroke="var(--tw-line)" />
      <line x1="18" y1="72" x2="130" y2="72" stroke="var(--tw-line)" />
      <rect
        x="18"
        y="19"
        width="46"
        height="10"
        rx="3"
        fill="var(--tw-accent)"
      />
      <rect
        x="72"
        y="43"
        width="34"
        height="10"
        rx="3"
        fill="rgb(242 244 239 / 0.14)"
      />
      <rect
        x="34"
        y="67"
        width="40"
        height="10"
        rx="3"
        fill="rgb(242 244 239 / 0.14)"
      />
    </svg>
  )
}
function ChipCode() {
  return (
    <svg viewBox="0 0 148 92" role="img" aria-hidden="true">
      <rect
        x="14"
        y="16"
        width="60"
        height="6"
        rx="3"
        fill="rgb(242 244 239 / 0.16)"
      />
      <rect
        x="26"
        y="30"
        width="88"
        height="6"
        rx="3"
        fill="rgb(242 244 239 / 0.10)"
      />
      <rect
        x="26"
        y="44"
        width="54"
        height="6"
        rx="3"
        fill="var(--tw-accent)"
      />
      <rect
        x="26"
        y="58"
        width="72"
        height="6"
        rx="3"
        fill="rgb(242 244 239 / 0.10)"
      />
      <rect
        x="14"
        y="72"
        width="40"
        height="6"
        rx="3"
        fill="rgb(242 244 239 / 0.16)"
      />
    </svg>
  )
}
function ChipScore() {
  return (
    <svg viewBox="0 0 148 92" role="img" aria-hidden="true">
      <circle
        cx="34"
        cy="46"
        r="22"
        fill="none"
        stroke="var(--tw-line)"
        strokeWidth="6"
      />
      <path
        d="M34 24 a22 22 0 0 1 19 33"
        fill="none"
        stroke="var(--tw-accent)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect
        x="72"
        y="34"
        width="58"
        height="7"
        rx="3"
        fill="rgb(242 244 239 / 0.14)"
      />
      <rect
        x="72"
        y="50"
        width="40"
        height="7"
        rx="3"
        fill="rgb(242 244 239 / 0.10)"
      />
    </svg>
  )
}
function ChipFlow() {
  return (
    <svg viewBox="0 0 148 92" role="img" aria-hidden="true">
      <rect
        x="12"
        y="34"
        width="30"
        height="24"
        rx="4"
        fill="none"
        stroke="var(--tw-line)"
      />
      <rect
        x="59"
        y="34"
        width="30"
        height="24"
        rx="4"
        fill="none"
        stroke="var(--tw-line)"
      />
      <rect
        x="106"
        y="34"
        width="30"
        height="24"
        rx="4"
        fill="none"
        stroke="var(--tw-accent)"
      />
      <line x1="42" y1="46" x2="59" y2="46" stroke="var(--tw-line)" />
      <line x1="89" y1="46" x2="106" y2="46" stroke="var(--tw-line)" />
    </svg>
  )
}

/** Section 1 — immersive hero. Real page <h1> lives here. */
export default function HomeHero() {
  return (
    <section
      id="top"
      className={styles.hero}
      data-scene="intro"
      aria-labelledby="hero-title"
    >
      <div className={styles.heroOrbit} aria-hidden="true">
        <div
          className={`${styles.orbitChip} ${styles.o1}`}
          data-home-artifact
          data-depth="0.8"
        >
          <ChipRoadmap />
        </div>
        <div
          className={`${styles.orbitChip} ${styles.o2}`}
          data-home-artifact
          data-depth="1.1"
        >
          <ChipScore />
        </div>
        <div
          className={`${styles.orbitChip} ${styles.o3}`}
          data-home-artifact
          data-depth="0.65"
        >
          <ChipFlow />
        </div>
        <div
          className={`${styles.orbitChip} ${styles.o4}`}
          data-home-artifact
          data-depth="0.95"
        >
          <ChipCode />
        </div>
      </div>

      <div className={styles.heroInner} data-home-reveal>
        <SectionLabel className={styles.heroSup}>{HERO.sup}</SectionLabel>
        <DisplayHeading
          as="h1"
          size="hero"
          id="hero-title"
          className={styles.heroTitle}
        >
          {HERO.titleLead}
          <span className={styles.tail}>{HERO.titleTail}</span>
        </DisplayHeading>
        <p className={styles.heroSupport}>{HERO.support}</p>
        <div className={styles.heroActions}>
          <PrimaryCTA href={HERO.primary.href} variant="primary">
            {HERO.primary.label}
          </PrimaryCTA>
          <PrimaryCTA href={HERO.secondary.href} variant="secondary">
            {HERO.secondary.label}
          </PrimaryCTA>
        </div>
      </div>

      <span className={styles.scrollNote} aria-hidden="true">
        {HERO.scrollNote} ↓
      </span>
    </section>
  )
}
