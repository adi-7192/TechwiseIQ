import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
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
      <div className={`tw-wrap ${styles.content}`}>
        <div data-hero-support>
          <SectionLabel>Techwise IQ / Dubai · Worldwide</SectionLabel>
        </div>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>
            <span data-hero-line>Technology that</span>
          </span>
          <span className={styles.line}>
            <em data-hero-line>moves the work.</em>
          </span>
        </h1>
        <div className={styles.row}>
          <p className={styles.body} data-hero-support>
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
      </div>
      <div className={`tw-wrap ${styles.bottom}`} data-hero-support>
        <span>IDEA → INTERFACE → IMPACT</span>
        <a href="#services">
          Discover what we build <span aria-hidden="true">↓</span>
        </a>
        <span>25.2048° N / 55.2708° E</span>
      </div>
    </section>
  )
}
