import SceneLoader from '@/components/immersive/SceneLoader'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import styles from './HeroStage.module.css'
import HeroFieldPoster from './HeroFieldPoster'

export default function HomeHero() {
  return (
    <section id="top" className={styles.hero} data-scene="intro" aria-labelledby="hero-title">
      <HeroFieldPoster />
      <SceneLoader className={styles.scene} />
      <div className={styles.orbit} aria-hidden="true">
        <div className={`${styles.artifact} ${styles.website}`} data-home-artifact>
          <span className={styles.artifactLabel}>01 / WEB EXPERIENCE</span>
          <div className={styles.sitePreview}>
            <span>FORM®</span>
            <b>
              A different
              <br />
              perspective.
            </b>
            <i />
            <small>EXPLORE WHAT’S NEXT ↗</small>
          </div>
        </div>
        <div className={`${styles.artifact} ${styles.software}`} data-home-artifact>
          <span className={styles.artifactLabel}>02 / SOFTWARE SYSTEMS</span>
          <div className={styles.code}>
            <span>&lt;your-next-move&gt;</span>
            <span>&nbsp; design.withPurpose()</span>
            <span>&nbsp; build.forPeople()</span>
            <span>&lt;/your-next-move&gt;</span>
          </div>
          <div className={styles.artifactFoot}>
            <i /> Built around your business
          </div>
        </div>
        <div className={`${styles.artifact} ${styles.automation}`} data-home-artifact>
          <span className={styles.artifactLabel}>03 / CONNECTED WORKFLOWS</span>
          <div className={styles.flow}>
            <span>Input</span>
            <i>→</i>
            <span>Think</span>
            <i>→</i>
            <b>Action</b>
          </div>
          <div className={styles.artifactFoot}>
            <i /> Ideas into working systems
          </div>
        </div>
      </div>
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
        <p className={styles.body} data-hero-support>
          Websites that make an impression. Software that fits.
          <br className={styles.desktopBreak} /> AI that puts your business in motion.
        </p>
        <div className={styles.actions} data-hero-support>
          <PrimaryCTA href="/contact">Bring us the problem</PrimaryCTA>
          <PrimaryCTA href="/work" variant="secondary">
            Explore our work
          </PrimaryCTA>
        </div>
      </div>
      <div className={`tw-wrap ${styles.bottom}`} data-hero-support>
        <span>IDEA → INTERFACE → IMPACT</span>
        <a href="#services">
          Discover what we build <span aria-hidden="true">↓</span>
        </a>
        <span>SCROLL TO EXPLORE</span>
      </div>
    </section>
  )
}
