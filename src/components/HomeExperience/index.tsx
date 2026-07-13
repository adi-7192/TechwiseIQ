import Link from 'next/link'
import { BOOKING_URL, WHATSAPP_URL } from '@/lib/site'
import {
  DELIVERY_PROMISES,
  HOME_SERVICES,
  PROBLEM_SIGNALS,
  PROCESS_STEPS,
} from './home-content'
import ServiceVisual from './ServiceVisuals'
import HomeMotion from './HomeMotion'
import styles from './HomeExperience.module.css'

export default function HomeExperience() {
  return (
    <div
      className={styles.experience}
      data-home-experience
      data-testid="home-experience"
    >
      <HomeMotion />
      <section className={styles.problem} data-home-problem>
        <div className={styles.inner}>
          <div className={styles.problemGrid}>
            <div data-home-reveal>
              <span className={styles.sceneLabel}>01 / The problem we solve</span>
              <h2 className={styles.sceneTitle}>
                Your business shouldn&apos;t feel{' '}
                <span>this manual.</span>
              </h2>
              <p className={styles.sceneBody}>
                Growth gets expensive when the website undersells you, daily
                work depends on copy-paste, and every important answer lives in
                a different tool.
              </p>
            </div>
            <ul className={styles.signalList} aria-label="Common business bottlenecks">
              {PROBLEM_SIGNALS.map((signal) => (
                <li key={signal} data-home-signal>
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.servicesIntro} id="services">
        <div className={styles.inner} data-home-reveal>
          <span className={styles.sceneLabel}>02 / What we do</span>
          <h2 className={styles.sceneTitle}>
            Find the bottleneck.
            <br />
            <span>Build the way through.</span>
          </h2>
          <p className={styles.introBody}>
            Three services, used separately or together. You bring the business
            problem; we choose the technical path and ship it in working
            increments.
          </p>
          <ol className={styles.serviceIndex} aria-label="Our services">
            {HOME_SERVICES.map((service) => (
              <li key={service.id}>
                <a href={`#home-service-${service.id}`}>
                  <span>{service.number}</span> {service.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {HOME_SERVICES.map((service) => (
        <section
          key={service.id}
          id={`home-service-${service.id}`}
          className={`${styles.serviceScene} ${styles[service.id]}`}
          data-home-service={service.id}
        >
          <span className={styles.ghostNumber} aria-hidden="true">
            {service.number.slice(-2)}
          </span>
          <div className={styles.serviceInner}>
            <div className={styles.serviceCopy} data-home-reveal>
              <span className={styles.sceneLabel}>
                {service.number} / {service.outcome}
              </span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul className={styles.deliverables} aria-label={`${service.title} deliverables`}>
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
              <Link
                className={styles.serviceLink}
                href={service.href}
                aria-label={`Explore ${service.title}`}
              >
                Explore the service <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.serviceVisual}>
              <ServiceVisual id={service.id} />
            </div>
          </div>
        </section>
      ))}

      <section className={styles.difference} data-home-difference>
        <div className={styles.inner}>
          <div className={styles.differenceHead}>
            <div data-home-reveal>
              <span className={styles.sceneLabel}>03 / Why Techwise IQ</span>
              <h2 className={styles.sceneTitle}>
                Agencies sell{' '}
                <span className={styles.strikeWord}>
                  hours.
                  <i data-home-strike aria-hidden="true" />
                </span>
                <br />
                We sell{' '}
                <span data-home-outcomes>outcomes.</span>
              </h2>
            </div>
            <p className={styles.differenceBody} data-home-reveal>
              The product is not a parade of meetings. It is a website that
              sells, software that fits, or automation that hands your team its
              week back.
            </p>
          </div>

          <dl className={styles.promiseList}>
            {DELIVERY_PROMISES.map(([title, body]) => (
              <div key={title} data-home-promise>
                <dt>{title}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.processWrap}>
            <span
              className={styles.processCurrent}
              data-home-process-current
              aria-hidden="true"
            />
            <ol className={styles.processRoute}>
              {PROCESS_STEPS.map(([number, title, body]) => (
                <li key={number}>
                  <span
                    className={styles.processMarker}
                    data-home-process-marker
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.inner} data-home-reveal>
          <span className={styles.sceneLabel}>04 / Your move</span>
          <h2 className={styles.sceneTitle}>
            Bring us the <span>bottleneck.</span>
            <br />
            We&apos;ll bring the plan.
          </h2>
          <p className={styles.ctaBody}>
            Twenty focused minutes. You explain what is slowing the business
            down; we explain how we would approach it.
          </p>
          <div className={styles.ctaLinks}>
            <a
              className={`${styles.ctaLink} ${styles.primaryCta}`}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-home-cta-link
            >
              <small>Primary / 20 minutes</small>
              <strong>
                Book a call <span aria-hidden="true">→</span>
              </strong>
            </a>
            <a
              className={styles.ctaLink}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-home-cta-link
            >
              <small>Fastest reply</small>
              <strong>
                WhatsApp <span aria-hidden="true">↗</span>
              </strong>
            </a>
            <Link
              className={styles.ctaLink}
              href="/contact"
              data-home-cta-link
            >
              <small>Structured brief</small>
              <strong>
                Enquiry <span aria-hidden="true">→</span>
              </strong>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
