import Image from 'next/image'
import Link from 'next/link'
import FAQSection from '@/components/FAQSection'
import { CASE_STUDIES } from '@/data/case-studies'
import type { ServiceContent } from '@/data/services'
import ServiceMotif from './ServiceMotif'
import styles from './ServiceDetailPage.module.css'

interface ServiceDetailPageProps {
  service: ServiceContent
}

export default function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const studies = service.proofSlugs
    .map((slug) => CASE_STUDIES.find((study) => study.slug === slug))
    .filter((study): study is (typeof CASE_STUDIES)[number] => Boolean(study))

  return (
    <div
      className={`${styles.experience} ${styles[service.motif]}`}
      data-service-experience
    >
      <section className={styles.hero}>
        <ServiceMotif motif={service.motif} />
        <div className={styles.heroInner} data-service-reveal>
          <div className={styles.breadcrumb}>
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span>{service.number}</span>
          </div>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <Link href="/contact" className={styles.primaryCta}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </div>
        <a href="#service-fit" className={styles.scrollCue}>
          See what changes <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section
        id="service-fit"
        className={styles.fitSection}
        data-testid="service-fit"
      >
        <div className={styles.sectionInner} data-service-reveal>
          <span className={styles.eyebrow}>This service is for you when</span>
          <h2>
            The friction is visible.
            <br />
            <span>So is the way through.</span>
          </h2>
          <ol className={styles.symptomList}>
            {service.symptoms.map((symptom, index) => (
              <li key={symptom}>
                <span>0{index + 1}</span>
                {symptom}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.outcomes} data-testid="outcome-flow">
        <div className={styles.sectionInner} data-service-reveal>
          <span className={styles.eyebrow}>What changes</span>
          <h2>
            From current state
            <br />
            <span>to working advantage.</span>
          </h2>
          <ol className={styles.outcomeFlow}>
            {service.outcomes.map((outcome, index) => (
              <li key={outcome.title}>
                <span className={styles.outcomeNumber}>0{index + 1}</span>
                <h3>{outcome.title}</h3>
                <p>{outcome.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.proof} data-testid="service-proof">
        <div className={styles.sectionInner} data-service-reveal>
          <span className={styles.eyebrow}>Proof before the scope</span>
          <h2>
            See the standard.
            <br />
            <span>Then see the system.</span>
          </h2>
          {studies.length > 0 ? (
            <div className={styles.projectList}>
              {studies.map((study, index) => (
                <article className={styles.project} key={study.slug}>
                  <div className={styles.projectCopy}>
                    <span className={styles.eyebrow}>
                      Relevant project / 0{index + 1}
                    </span>
                    <h3>{study.title}</h3>
                    <p>{study.outcome}</p>
                    <Link href={`/work/${study.slug}`}>
                      Read the case study <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  {study.coverImage ? (
                    <div className={styles.projectImage}>
                      <Image
                        src={study.coverImage}
                        alt={`${study.title} website case study preview`}
                        fill
                        sizes="(max-width: 760px) 90vw, 48vw"
                      />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.proofFallback}>
              <p>
                Our published case studies currently show our web work. The
                same delivery standards apply here: clear scope, working demos,
                and a clean handover.
              </p>
              <Link href="/work">
                See what we&apos;ve shipped <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.capabilities} data-testid="capability-river">
        <div className={styles.sectionInner} data-service-reveal>
          <span className={styles.eyebrow}>What we can build together</span>
          <h2>
            The parts work
            <br />
            <span>as one system.</span>
          </h2>
          <div className={styles.capabilityRiver}>
            {service.capabilities.map((capability) => (
              <article key={capability.title}>
                <span aria-hidden="true">→</span>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process} data-testid="connected-process">
        <div className={styles.sectionInner} data-service-reveal>
          <span className={styles.eyebrow}>How the work moves</span>
          <h2>
            One continuous
            <br />
            <span>build loop.</span>
          </h2>
          <ol className={styles.processTrack}>
            {service.process.map((step) => (
              <li key={step.num}>
                <span className={styles.processNumber}>{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FAQSection
        faqs={service.faqs}
        heading="Clear answers. No sales fog."
        testId="service-faq"
      />

      <section className={styles.finalCta} data-service-reveal>
        <span className={styles.eyebrow}>Bring us the constraint</span>
        <h2>
          Make the next
          <br />
          <span>interaction count.</span>
        </h2>
        <p>
          Tell us what is slow, broken, or missing. We&apos;ll help shape the
          right route.
        </p>
        <Link href="/contact" className={styles.primaryCta}>
          Start the conversation <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}
