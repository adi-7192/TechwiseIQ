import Image from 'next/image'
import Link from 'next/link'
import type { SceneName } from '@/components/immersive/ImmersiveShell'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import ServiceDemo from '@/components/immersive/home/ServiceDemo'
import { CASE_STUDIES } from '@/data/case-studies'
import { SERVICE_LIST, type ServiceId, type ServiceContent } from '@/data/services'
import { SERVICE_GUIDES } from '@/data/service-guides'
import { INSIGHTS } from '@/data/insights'
import styles from './ServiceDetailPage.module.css'
import ServiceWorkbench from './ServiceWorkbench'
import { DecisionLab, DeliveryJourney } from './ExperiencePanels'

export const SERVICE_SCENE: Record<ServiceId, SceneName> = {
  web: 'web',
  software: 'apps',
  ai: 'automation',
}

export default function ServiceDetailPage({ service }: { service: ServiceContent }) {
  const guide = SERVICE_GUIDES[service.id]
  const studies = service.proofSlugs
    .map((slug) => CASE_STUDIES.find((study) => study.slug === slug))
    .filter((study) => study !== undefined)
  const headline = {
    web: ['Made to', 'stand out.'],
    software: ['Built around', 'your business.'],
    ai: ['Make room', 'for better work.'],
  }[service.id]

  return (
    <div className={styles.experience} data-service-experience>
      <Section
        as="header"
        density="sparse"
        className={styles.hero}
        innerClassName={styles.heroInner}
      >
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span>{service.title}</span>
          </nav>
          <DisplayHeading as="h1" size="statement" className={styles.heroTitle}>
            {headline[0]}
            <br />
            <span>{headline[1]}</span>
          </DisplayHeading>
          <p className={styles.heroLede}>{service.description}</p>
          <div className={styles.heroActions}>
            <PrimaryCTA href="/contact">Bring us the problem</PrimaryCTA>
            <PrimaryCTA href="#capabilities" variant="ghost">
              What we build
            </PrimaryCTA>
          </div>
        </div>
        <div id="service-proof-object" data-testid="service-proof-object" className={styles.demo}>
          <ServiceDemo kind={service.id} />
          <p className={styles.demoCaption}>{guide.demoCaption}</p>
        </div>
        <nav className={styles.pageNav} aria-label="On this page">
          <span>Explore the service</span>
          <a href="#capabilities">
            What we build <span aria-hidden="true">↓</span>
          </a>
          <a href="#expertise">
            Our approach <span aria-hidden="true">↓</span>
          </a>
          <a href="#delivery">
            Delivery <span aria-hidden="true">↓</span>
          </a>
          <a href="#questions">
            Questions <span aria-hidden="true">↓</span>
          </a>
        </nav>
      </Section>

      <Section
        id="service-fit"
        ruled
        density="dense"
        data-testid="service-fit"
        aria-labelledby="fit-title"
      >
        <div className={styles.fitRibbon}>
          <div>
            <SectionLabel>Built for your next chapter</SectionLabel>
            <h2 id="fit-title">{guide.promise}</h2>
          </div>
          <div className={styles.fitTags}>
            {service.fitSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </div>
        <div className={styles.transformation} data-testid="outcome-flow" aria-label="What changes">
          {service.outcomes.map((outcome, index) => (
            <div key={outcome.title}>
              <span className={styles.meta}>0{index + 1}</span>
              <strong>{outcome.title}</strong>
              {index < 2 && <span aria-hidden="true">↗</span>}
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="capabilities"
        ruled
        density="sparse"
        data-testid="capability-river"
        aria-labelledby="capability-title"
      >
        <div className={styles.split}>
          <div>
            <SectionLabel index="02">What we can build</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="capability-title" className={styles.sectionTitle}>
              {guide.buildTitle}
            </DisplayHeading>
          </div>
          <p className={styles.sectionBody}>{guide.buildIntro}</p>
        </div>
        <ServiceWorkbench service={service} />
        <details className={styles.scopeNotes}>
          <summary>
            Explore the full scope <span aria-hidden="true">+</span>
          </summary>
          <div className={styles.scopeGrid}>
            {service.capabilities.map((capability) => (
              <div key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
                <p>{guide.examples[capability.title]}</p>
              </div>
            ))}
          </div>
        </details>
      </Section>

      <Section
        id="expertise"
        ruled
        density="dense"
        className={styles.expertise}
        aria-labelledby="expertise-title"
        data-testid="service-expertise"
      >
        <div className={styles.split}>
          <div>
            <SectionLabel index="03">The thinking behind the build</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="expertise-title" className={styles.sectionTitle}>
              {guide.expertiseTitle}
            </DisplayHeading>
            <p className={styles.sectionBody}>{guide.expertiseIntro}</p>
            <div className={styles.decisionNotes}>
              {guide.standards.map((standard) => (
                <details key={standard.title}>
                  <summary>
                    {standard.title}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{standard.body}</p>
                </details>
              ))}
            </div>
          </div>
          <DecisionLab kind={service.id} />
        </div>
      </Section>

      <Section
        id="delivery"
        ruled
        density="sparse"
        data-testid="connected-process"
        aria-labelledby="process-title"
      >
        <div className={styles.split}>
          <div>
            <SectionLabel index="04">From brief to handover</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="process-title" className={styles.sectionTitle}>
              Your call.
              <br />
              <span>At every step.</span>
            </DisplayHeading>
          </div>
          <p className={styles.sectionBody}>
            We gather your requirements, bring you options and say which we would pick. You choose,
            then we build exactly that, and you see it take shape every week.
          </p>
        </div>
        <DeliveryJourney service={service} handover={guide.handover} />
        <details className={styles.scopeNotes} data-testid="service-handover">
          <summary>
            What you take forward. <span aria-hidden="true">+</span>
          </summary>
          <ul>
            {guide.handover.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>Your written scope lists exactly what you get and what support follows.</p>
        </details>
      </Section>

      {guide.ownStack && (
        <Section
          id="own-automation"
          ruled
          density="dense"
          aria-labelledby="own-automation-title"
          data-testid="own-automation"
        >
          <div className={styles.split}>
            <div>
              <SectionLabel>Our own stack</SectionLabel>
              <DisplayHeading
                as="h2"
                size="h2"
                id="own-automation-title"
                className={styles.sectionTitle}
              >
                What we automate for ourselves.
              </DisplayHeading>
            </div>
            <p className={styles.sectionBody}>
              We don&apos;t have a client automation case study to show you yet. We do run our own
              business on these.
            </p>
          </div>
          <div className={`${styles.scopeGrid} ${styles.ownStack}`}>
            {guide.ownStack.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <p className={styles.meta}>Our own use. Not client work.</p>
        </Section>
      )}

      <Section
        id="work"
        ruled
        density="dense"
        data-testid="service-proof"
        aria-labelledby="related-title"
      >
        {studies.length > 0 && (
          <div className={styles.split}>
            <div>
              <SectionLabel index="05">Selected client work</SectionLabel>
              <DisplayHeading as="h2" size="h2" id="related-title" className={styles.sectionTitle}>
                Designed here.
                <br />
                <span>Out in the world.</span>
              </DisplayHeading>
            </div>
            <p className={styles.sectionBody}>{guide.reviewBody}</p>
          </div>
        )}
        {studies.length > 0 ? (
          <div className={styles.relatedGrid}>
            {studies.map((study) => (
              <Link href={`/work/${study.slug}`} key={study.slug} className={styles.relatedCard}>
                {study.coverImage && (
                  <div className={styles.relatedImage}>
                    <Image
                      src={study.coverImage}
                      alt={`${study.title} website preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className={styles.relatedCopy}>
                  <span className={styles.meta}>{study.industry}</span>
                  <h3>
                    {study.title}
                    <span aria-hidden="true">↗</span>
                  </h3>
                  <p>{study.workSummary?.decision ?? study.outcome}</p>
                  <span className={styles.textLink}>Read the case study →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.publishedNote}>
            <h2 id="related-title">Explore our published work.</h2>
            <p>
              The demos above are examples. Our published client projects so far are websites.
            </p>
            <Link className={styles.textLink} href="/work">
              See the projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </Section>

      <Section
        id="questions"
        ruled
        density="dense"
        data-testid="service-faq"
        aria-labelledby="questions-title"
      >
        <div className={styles.split}>
          <div>
            <SectionLabel index="06">Before we start</SectionLabel>
            <DisplayHeading as="h2" size="h2" id="questions-title" className={styles.sectionTitle}>
              The details
              <br />
              <span>worth knowing.</span>
            </DisplayHeading>
            <p className={styles.sectionBody}>{guide.brief}</p>
            <PrimaryCTA href="/contact" variant="ghost">
              Talk through your brief
            </PrimaryCTA>
            <p id="worth-a-read" className={`${styles.meta} ${styles.readsLabel}`}>
              Worth a read
            </p>
            <ul role="list" aria-labelledby="worth-a-read" className={styles.reads}>
              {INSIGHTS.filter((a) => a.service === service.id).map((a) => (
                <li key={a.slug}>
                  <Link href={`/insights/${a.slug}`} className={styles.textLink}>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.faqs}>
            {service.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
      <Section density="flush" className={styles.otherServices} aria-label="Other services">
        <div className={styles.otherInner}>
          <span className={styles.meta}>Connect the next part</span>
          {SERVICE_LIST.filter((item) => item.id !== service.id).map((item) => (
            <Link href={item.slug} key={item.id}>
              {item.title}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}
