import Link from 'next/link'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { SERVICE_LIST } from '@/data/services'
import ProblemNavigator from './ProblemNavigator'
import ConnectedSystem from './ConnectedSystem'
import styles from './ServicesOverview.module.css'

const ENGAGEMENT = [
  ['We gather your requirements', 'Your goals, users, tools and deadline. No technical brief needed.'],
  ['We bring you options', 'Several designs or solution routes, each with our honest recommendation.'],
  ['You choose', 'Pick what fits your goals, budget and timing. Scope and price in writing.'],
  ['We build your choice', 'Exactly what you picked, with progress you see every week, then handover.'],
]
const EDITORIAL = {
  web: {
    heading: 'Make the right first impression.',
    fit: 'For a new launch, a fresh look, or a website that needs to pull its weight.',
    output: 'A website customers enjoy and your team can update.',
  },
  software: {
    heading: 'Give your operation room to grow.',
    fit: 'For teams buried in spreadsheets, juggling tools, or stuck with software that doesn’t fit.',
    output: 'An app or internal tool built around how you actually work.',
  },
  ai: {
    heading: 'Put repetitive work on a better path.',
    fit: 'For piles of documents, copy-paste handoffs and overflowing inboxes.',
    output: 'Automations that do the busywork, with a person in control.',
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
            <strong>Websites</strong> that bring people in. <strong>Software</strong> that stops the
            spreadsheet juggling. <strong>Automation</strong> that hands your team their afternoons
            back.
          </p>
          <div className={styles.heroActions}>
            <PrimaryCTA href="/contact">Bring us the problem</PrimaryCTA>
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
              Three services.
              <br />
              <span>One team.</span>
            </DisplayHeading>
          </div>
          <p className={styles.sectionBody}>
            Start with what needs fixing. We make sure it <strong>works with everything around
            it</strong>.
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

      <Section id="engage" ruled density="dense" aria-labelledby="engage-title">
        <div className={styles.directoryIntro}>
          <div>
            <SectionLabel index="03">How we engage</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="engage-title" className={styles.sectionTitle}>
              You decide.
              <br />
              <span>We deliver.</span>
            </DisplayHeading>
          </div>
          <div>
            <p className={styles.sectionBody}>
              Every project starts with your requirements, not a package. We come back with
              options and tell you which one we would pick and why. The final call is always yours.
              No price list: each quote is for the option you choose.
            </p>
            <Link href="/contact" className={styles.directoryLink}>
              Bring us your requirement <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <ol className={styles.deliveryTrack}>
          {ENGAGEMENT.map(([title, body], index) => (
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
