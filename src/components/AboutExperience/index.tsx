import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import {
  CULTURE_PRINCIPLES,
  EXPERTISE_PATHS,
  WORKING_MODEL,
} from './about-content'
import styles from './AboutExperience.module.css'

export default function AboutExperience() {
  return (
    <div
      className={styles.experience}
      data-about-experience
      data-testid="about-experience"
    >
      <Section
        as="section"
        density="sparse"
        className={styles.hero}
        innerClassName={styles.heroInner}
        data-scene="advisory"
        aria-labelledby="about-title"
      >
        <div className={styles.heroCopy}>
          <SectionLabel>About Techwise IQ / Dubai</SectionLabel>
          <DisplayHeading
            as="h1"
            id="about-title"
            size="hero"
            className={styles.heroTitle}
          >
            We make complex <em>feel clear.</em>
          </DisplayHeading>
        </div>

        <div className={styles.heroThesis}>
          <p>
            Techwise IQ is a team of experts turning business bottlenecks into{' '}
            <strong>websites, software and AI systems</strong> that move the work
            forward.
          </p>
          <p className={styles.heroPromise}>
            You bring the goal. We sweat the technical path.
          </p>
        </div>

        <div className={styles.modelGrid} aria-label="How we work">
          {WORKING_MODEL.map((item, index) => (
            <article className={styles.modelCard} key={item.title}>
              <span className={styles.index} aria-hidden="true">
                0{index + 1}
              </span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
          <p className={styles.noRelay}>
            One team, one conversation. No game of telephone.
          </p>
        </div>
      </Section>

      <Section
        as="section"
        ruled
        density="dense"
        className={styles.expertise}
        aria-labelledby="about-expertise-title"
      >
        <div className={styles.sectionHead}>
          <SectionLabel index="01">What we bring</SectionLabel>
          <DisplayHeading
            as="h2"
            id="about-expertise-title"
            size="statement"
            className={styles.sectionTitle}
          >
            Technology should make the business simpler.
          </DisplayHeading>
          <p>Not give it more to manage.</p>
        </div>

        <ol className={styles.pathList}>
          {EXPERTISE_PATHS.map((path, index) => (
            <li className={styles.path} data-about-path key={path.problem}>
              <span className={styles.index} aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{path.problem}</h3>
              <span className={styles.pathArrow} aria-hidden="true">
                →
              </span>
              <p>{path.outcome}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        as="section"
        ruled
        density="sparse"
        className={styles.culture}
        aria-labelledby="about-culture-title"
      >
        <div className={styles.sectionHead}>
          <SectionLabel index="02">How we behave</SectionLabel>
          <DisplayHeading
            as="h2"
            id="about-culture-title"
            size="statement"
            className={styles.sectionTitle}
          >
            When the work gets <em>real.</em>
          </DisplayHeading>
        </div>

        <div className={styles.principles}>
          {CULTURE_PRINCIPLES.map((principle, index) => (
            <article className={styles.principle} key={principle.title}>
              <span className={styles.index} aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        as="section"
        ruled
        density="sparse"
        className={styles.closing}
        innerClassName={styles.closingInner}
        aria-labelledby="about-closing-title"
      >
        <SectionLabel>Dubai / Working beyond borders</SectionLabel>
        <DisplayHeading
          as="h2"
          id="about-closing-title"
          size="statement"
          className={styles.closingTitle}
        >
          Built in Dubai. <em>Working beyond borders.</em>
        </DisplayHeading>
        <p className={styles.closingBody}>
          Building for businesses in Dubai and beyond, turning big ideas
          into things that actually work.
        </p>
        <PrimaryCTA href="/contact">
          Bring us the problem
        </PrimaryCTA>
      </Section>
    </div>
  )
}
