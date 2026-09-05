import Link from 'next/link'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { SERVICE_LIST } from '@/data/services'
import ProblemNavigator from './ProblemNavigator'
import ConnectedSystem from './ConnectedSystem'
import styles from './ServicesOverview.module.css'

const DELIVERY = [
  ['Diagnose', 'Find the real constraint before proposing a tool.'],
  ['Scope', 'Define boundaries, timeline and cost in writing.'],
  ['Build', 'See working progress every week.'],
  ['Run', 'Launch, document, hand over, and improve.'],
]
const EDITORIAL = {
  web: {
    heading: 'Make the right first impression.',
    fit: 'For a new launch, a stronger brand, or a website that needs to work harder.',
    output: 'A website your customers can use and your team can manage.',
  },
  software: {
    heading: 'Give your operation room to grow.',
    fit: 'For teams outgrowing spreadsheets, disconnected tools, or off-the-shelf limits.',
    output: 'A product or internal system shaped around your actual workflow.',
  },
  ai: {
    heading: 'Put repetitive work on a better path.',
    fit: 'For document-heavy processes, manual handoffs, and overloaded inboxes.',
    output: 'Connected workflows with useful AI and visible human control.',
  },
}

export default function ServicesOverview() {
  return (
    <div className={styles.experience} data-service-experience>
      <Section
        as="header"
        density="sparse"
        className={styles.hero}
        innerClassName={styles.heroInner}
      >
        <div className={styles.heroCopy}>
          <SectionLabel>Web / Software / AI</SectionLabel>
          <DisplayHeading as="h1" size="chapter" className={styles.heroTitle}>
            Your next move.
            <br />
            <span>Built right.</span>
          </DisplayHeading>
          <p className={styles.heroLede}>
            Websites that bring people in. Software that moves work forward. Automation that gives
            your team time back.
          </p>
          <div className={styles.heroActions}>
            <PrimaryCTA href="/contact">Discuss your project</PrimaryCTA>
            <PrimaryCTA href="#disciplines" variant="ghost">
              Explore services
            </PrimaryCTA>
          </div>
        </div>
        <ConnectedSystem />
        <div className={styles.heroFoot}>
          <span>Built in Dubai. Working worldwide.</span>
          <a href="#disciplines">
            Find your starting point <span aria-hidden="true">↓</span>
          </a>
        </div>
      </Section>

      <Section id="disciplines" ruled density="dense" aria-labelledby="directory-title">
        <div className={styles.directoryIntro}>
          <div>
            <SectionLabel index="01">What we build</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="directory-title" className={styles.sectionTitle}>
              Three disciplines.
              <br />
              <span>One connected business.</span>
            </DisplayHeading>
          </div>
          <p className={styles.sectionBody}>
            Start with the part that needs to change. We connect it to the systems, people, and work
            around it.
          </p>
        </div>
        <div className={styles.directory}>
          {SERVICE_LIST.map((service) => {
            const content = EDITORIAL[service.id]
            return (
              <article
                id={`service-${service.id}`}
                key={service.id}
                className={styles.directoryItem}
              >
                <div className={styles.directoryIdentity}>
                  <span className={styles.directoryNumber}>{service.number} /</span>
                  <h3>
                    <Link href={service.slug}>
                      {service.title}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </h3>
                  <p>{content.fit}</p>
                </div>
                <div className={styles.directoryCopy}>
                  <h4>{content.heading}</h4>
                  <p>{content.output}</p>
                  <ul className={styles.capabilities}>
                    {service.capabilities.slice(0, 4).map((capability) => (
                      <li key={capability.title}>{capability.title}</li>
                    ))}
                  </ul>
                  <Link href={service.slug} className={styles.directoryLink}>
                    Explore {service.title}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </Section>

      <Section id="problems" ruled density="sparse" aria-labelledby="navigator-title">
        <div className={styles.directoryIntro}>
          <div>
            <SectionLabel index="02">Find your starting point</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="navigator-title" className={styles.sectionTitle}>
              What&apos;s slowing
              <br />
              <span>you down?</span>
            </DisplayHeading>
          </div>
          <p className={styles.sectionBody}>
            You don&apos;t need a technical brief. Choose the closest problem to see where we would
            start.
          </p>
        </div>
        <ProblemNavigator />
        <p className={styles.navigatorNote}>
          More than one sounds familiar?{' '}
          <Link href="/contact">
            Let&apos;s work through it together <span aria-hidden="true">↗</span>
          </Link>
        </p>
      </Section>

      <Section ruled density="dense" aria-labelledby="delivery-title">
        <div className={styles.directoryIntro}>
          <div>
            <SectionLabel index="03">How it comes together</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="delivery-title" className={styles.sectionTitle}>
              Clear scope.
              <br />
              <span>Visible progress.</span>
            </DisplayHeading>
          </div>
          <div>
            <p className={styles.sectionBody}>
              One delivery process across every discipline. You know what we are building, why it
              matters, and what comes next.
            </p>
            <Link href="/work" className={styles.directoryLink}>
              See the work <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <ol className={styles.deliveryTrack}>
          {DELIVERY.map(([title, body], index) => (
            <li key={title}>
              <span className={styles.deliveryMarker}>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}
