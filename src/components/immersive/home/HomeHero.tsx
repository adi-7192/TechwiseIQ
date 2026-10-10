import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { HeroOrbit } from './Illustrations'
import styles from './HeroStage.module.css'

export default function HomeHero() {
  return (
    <section
      id="top"
      className={styles.hero}
      data-scene="intro"
      data-journey="hero"
      aria-labelledby="hero-title"
    >
      {/* The orbit is anchored to this box, which is as wide as the h1 (spec §1). */}
      <div className={styles.stage}>
        <HeroOrbit />
        <div className={styles.eyebrow} data-hero-support>
          <SectionLabel hideMark>Techwise IQ / Dubai · Worldwide</SectionLabel>
        </div>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>
            <span data-hero-line>Technology that</span>
          </span>{' '}
          <span className={styles.line}>
            <span className={styles.ghost} data-hero-line>
              moves the work.
            </span>
          </span>
        </h1>
        <p className={styles.lead} data-hero-support>
          <strong>Websites</strong> people remember. <strong>Software</strong> that fits like it
          was measured. <strong>AI</strong> that does the boring bits.
        </p>
        <div className={styles.actions} data-hero-support>
          <PrimaryCTA href="/contact">Bring us the problem</PrimaryCTA>
          <PrimaryCTA href="/work" variant="secondary" className={styles.onScene}>
            Explore our work
          </PrimaryCTA>
        </div>
      </div>
      <a href="#services" className={styles.scrollNote} data-hero-support>
        Discover what we build <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
