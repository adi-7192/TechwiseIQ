import Link from 'next/link'
import ServiceMotion, { ServiceCurrent } from '@/components/ServiceMotion'
import { CASE_STUDIES } from '@/data/case-studies'
import { SERVICE_LIST } from '@/data/services'
import ProblemNavigator from './ProblemNavigator'
import styles from './ServicesOverview.module.css'

const DELIVERY = [
  { title: 'Diagnose', body: 'Find the real constraint.' },
  { title: 'Scope', body: 'Define boundaries in writing.' },
  { title: 'Build', body: 'Show working progress weekly.' },
  { title: 'Run', body: 'Launch, document, and improve.' },
]

export default function ServicesOverview() {
  return (
    <div className={styles.experience} data-service-experience>
      <ServiceMotion />
      <ServiceCurrent />
      <section className={styles.hero}>
        <div className={styles.heroGhost} aria-hidden="true">
          FRICTION
        </div>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Services / Start with the problem</span>
          <h1>
            What&apos;s slowing
            <br />
            <span>you down?</span>
          </h1>
          <p>
            We turn bottlenecks into working websites, software, and
            automations—often using more than one discipline.
          </p>
        </div>
        <a href="#problems" className={styles.scrollCue}>
          Follow the friction <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="problems" className={styles.problemScene}>
        <div className={styles.sceneInner} data-service-reveal>
          <span className={styles.eyebrow}>Choose the closest problem</span>
          <h2>Point to the friction.</h2>
          <ProblemNavigator />
        </div>
      </section>

      <section className={styles.bridge} data-service-reveal>
        <span className={styles.eyebrow}>The three disciplines</span>
        <h2>
          One problem.
          <br />
          <span>Three ways through.</span>
        </h2>
        <p>
          The navigator suggests a starting point. The full service set stays
          visible because real business problems rarely fit into one box.
        </p>
        <span className={styles.flowDot} aria-hidden="true" />
      </section>

      <div className={styles.serviceActs}>
        {SERVICE_LIST.map((service, index) => (
          <section
            id={`service-${service.id}`}
            key={service.id}
            className={`${styles.serviceAct} ${styles[service.id]}`}
          >
            <span className={styles.ghostNumber} aria-hidden="true">
              {service.number}
            </span>
            <div className={styles.serviceActInner} data-service-reveal>
              <div className={styles.serviceCopy}>
                <span className={styles.eyebrow}>
                  {index === 0
                    ? 'Attention → action'
                    : index === 1
                      ? 'Friction → flow'
                      : 'Busywork → leverage'}
                </span>
                <h2>{service.title}</h2>
                <p className={styles.outcome}>{service.description}</p>
                <p className={styles.fitSignals}>
                  {service.fitSignals.join(' / ')}
                </p>
                <Link href={service.slug} className={styles.textLink}>
                  Explore the service <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className={styles.serviceVisual} aria-hidden="true">
                <div className={styles.visualCore}>
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <ul className={styles.capabilityTrail}>
                {service.capabilities.slice(0, 4).map((capability) => (
                  <li key={capability.title}>{capability.title}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section className={styles.delivery}>
        <div className={styles.deliveryInner} data-service-reveal>
          <span className={styles.eyebrow}>One delivery spine</span>
          <h2>
            Fluid experience.
            <br />
            <span>Controlled delivery.</span>
          </h2>
          <ol className={styles.deliveryTrack}>
            {DELIVERY.map((step, index) => (
              <li key={step.title}>
                <span className={styles.deliveryMarker}>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.proof}>
        <div className={styles.proofInner} data-service-reveal>
          <span className={styles.eyebrow}>Proof near the claim</span>
          <h2>
            Work that backs
            <br />
            <span>the promise.</span>
          </h2>
          <div className={styles.proofList}>
            {CASE_STUDIES.map((study, index) => (
              <Link key={study.slug} href={`/work/${study.slug}`}>
                <span>WEB / 0{index + 1}</span>
                <strong>{study.title}</strong>
                <em>View case study →</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta} data-service-reveal>
        <span className={styles.eyebrow}>Still not sure which route?</span>
        <h2>
          Bring us the
          <br />
          <span>bottleneck.</span>
        </h2>
        <p>
          You do not need to diagnose the solution. Tell us what is slow,
          broken, or missing.
        </p>
        <Link href="/contact" className={styles.primaryCta}>
          Start the conversation <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}
