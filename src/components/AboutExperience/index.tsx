import { BOOKING_URL } from '@/lib/site'
import AboutMotion from './AboutMotion'
import {
  ABOUT_PROBLEMS,
  CULTURE_PRINCIPLES,
  EXPERTISE_PATHS,
} from './about-content'
import styles from './AboutExperience.module.css'

export default function AboutExperience() {
  return (
    <div
      className={styles.experience}
      data-about-experience
      data-testid="about-experience"
    >
      <AboutMotion />

      <section className={styles.hero} data-about-hero>
        <div className={styles.heroStage}>
          <ul
            className="sr-only"
            aria-label="Business bottlenecks we help resolve"
          >
            {ABOUT_PROBLEMS.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <div className={styles.fragmentField} aria-hidden="true">
            {ABOUT_PROBLEMS.map((problem) => (
              <span
                className={styles.fragment}
                data-about-fragment
                key={problem}
              >
                {problem}
              </span>
            ))}
          </div>
          <div className={styles.heroContent}>
            <p className={styles.sceneLabel}>About Techwise IQ / Dubai</p>
            <h1 className={styles.heroTitle}>
              We make complex <em>feel clear.</em>
            </h1>
            <p className={styles.heroBody}>
              Techwise IQ turns business bottlenecks into websites, software
              and AI systems that move the work forward. You bring the goal. We
              own the technical path.
            </p>
            <span className={styles.scrollCue} aria-hidden="true">
              Scroll to bring the pieces together ↓
            </span>
          </div>
        </div>
      </section>

      <section className={styles.expertise} data-about-expertise>
        <div className={styles.inner}>
          <p className={styles.sceneLabel}>What we bring to the problem</p>
          <h2 className={styles.sectionTitle}>
            Technology should make the business simpler—not give it more to
            manage.
          </h2>
          <ol className={styles.pathList}>
            {EXPERTISE_PATHS.map((path, index) => (
              <li className={styles.path} data-about-path key={path.problem}>
                <span className={styles.pathNumber}>0{index + 1}</span>
                <strong>{path.problem}</strong>
                <span className={styles.pathArrow} aria-hidden="true">
                  →
                </span>
                <p>{path.outcome}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.culture} data-about-culture>
        <div className={styles.cultureStage}>
          <div className={styles.cultureIntro}>
            <p className={styles.sceneLabel}>
              How we behave when the work gets real
            </p>
            <h2 className="sr-only">Our operating culture</h2>
          </div>
          <div className={styles.culturePanels}>
            {CULTURE_PRINCIPLES.map((principle, index) => (
              <article
                className={styles.culturePanel}
                data-about-culture-panel
                key={principle.title}
              >
                <span>0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.closing} data-about-closing>
        <div className={styles.targetMotif} aria-hidden="true" />
        <div className={styles.closingContent} data-about-closing-content>
          <p className={styles.sceneLabel}>Dubai / Working beyond borders</p>
          <h2 className={styles.closingTitle}>
            Built in Dubai. <em>Working beyond borders.</em>
          </h2>
          <p className={styles.closingBody}>
            Trusted by businesses in Dubai and beyond to turn important ideas
            into working digital products.
          </p>
          <a className={styles.cta} href={BOOKING_URL}>
            Bring us the business problem <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  )
}
