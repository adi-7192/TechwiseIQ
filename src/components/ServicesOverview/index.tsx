import Link from 'next/link'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { SERVICE_LIST } from '@/data/services'
import ProblemNavigator from './ProblemNavigator'
import styles from './ServicesOverview.module.css'

/** The single delivery spine behind every engagement — kept compact here. */
const DELIVERY = [
  ['Diagnose', 'Find the real constraint before proposing a tool.'],
  ['Scope', 'Define boundaries, timeline and cost in writing.'],
  ['Build', 'Show working progress every week.'],
  ['Run', 'Launch, document, hand over, and improve.'],
]

const TRANSFORMS: Record<string, string> = {
  web: 'Attention → action',
  software: 'Friction → flow',
  ai: 'Busywork → leverage',
}

/**
 * Services index as a diagnosis tool — not a second homepage. It leads with the
 * buyer's problem (the ProblemNavigator), then keeps the three disciplines
 * visible as a compact directory, and closes on the shared delivery spine.
 */
export default function ServicesOverview() {
  return (
    <div className={styles.experience} data-service-experience>
      {/* Hero — frame the page as diagnosis */}
      <Section as="header" density="sparse" innerClassName={styles.heroInner}>
        <SectionLabel>Services / Start with the problem</SectionLabel>
        <DisplayHeading as="h1" size="hero" className={styles.heroTitle}>
          What&apos;s slowing <span>you down?</span>
        </DisplayHeading>
        <p className={styles.heroLede}>
          You don&apos;t need to pick a service. Describe the friction and
          we&apos;ll map it to the right route — web, custom software, AI
          automation, or a mix.
        </p>
      </Section>

      {/* The diagnostic tool */}
      <Section
        id="problems"
        ruled
        density="dense"
        aria-labelledby="navigator-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="01">Choose the closest problem</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="navigator-title"
            className={styles.sectionTitle}
          >
            Point to the <span>friction.</span>
          </DisplayHeading>
          <p className={styles.sectionBody}>
            Pick the problem that sounds closest. We&apos;ll suggest a starting
            discipline — but the full set stays visible, because real problems
            rarely fit one box.
          </p>
        </div>
        <ProblemNavigator />
      </Section>

      {/* Compact service directory */}
      <Section ruled density="dense" aria-labelledby="directory-title">
        <div className={styles.sectionIntro}>
          <SectionLabel index="02">The three disciplines</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="directory-title"
            className={styles.sectionTitle}
          >
            One problem. Three ways <span>through.</span>
          </DisplayHeading>
        </div>
        <div className={styles.directory}>
          {SERVICE_LIST.map((service) => (
            <article
              id={`service-${service.id}`}
              key={service.id}
              className={styles.directoryItem}
            >
              <span className={styles.directoryNumber} aria-hidden="true">
                {service.number}
              </span>
              <div className={styles.directoryCopy}>
                <span className={styles.directoryTransform}>
                  {TRANSFORMS[service.id]}
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p className={styles.fitSignals}>
                  {service.fitSignals.join(' / ')}
                </p>
                <Link href={service.slug} className={styles.directoryLink}>
                  Explore the service <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Delivery spine */}
      <Section ruled density="dense" aria-labelledby="delivery-title">
        <div className={styles.sectionIntro}>
          <SectionLabel index="03">One delivery spine</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="delivery-title"
            className={styles.sectionTitle}
          >
            Fluid experience. Controlled <span>delivery.</span>
          </DisplayHeading>
        </div>
        <ol className={styles.deliveryTrack}>
          {DELIVERY.map(([title, body], index) => (
            <li key={title}>
              <span className={styles.deliveryMarker} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Section ruled density="sparse" innerClassName={styles.ctaInner} aria-labelledby="services-cta-title">
        <SectionLabel>Still not sure which route?</SectionLabel>
        <DisplayHeading
          as="h2"
          size="statement"
          id="services-cta-title"
          className={styles.ctaTitle}
        >
          Bring us the <span>bottleneck.</span>
        </DisplayHeading>
        <p className={styles.ctaBody}>
          You don&apos;t need to diagnose the solution. Tell us what is slow,
          broken, or missing.
        </p>
        <div className={styles.ctaActions}>
          <PrimaryCTA href="/contact" variant="primary">
            Start the conversation
          </PrimaryCTA>
          <PrimaryCTA href="/work" variant="ghost">
            See the work
          </PrimaryCTA>
        </div>
      </Section>
    </div>
  )
}
