import Image from 'next/image'
import Link from 'next/link'
import type { SceneName } from '@/components/immersive/ImmersiveShell'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { FeatureSpace } from '@/components/immersive/home/Illustrations'
import {
  RefHero,
  RefIntro,
  Chapter,
  CapabilityGrid,
  Panel,
  PillNav,
  type Accent,
} from '@/components/immersive/reference'
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

const ACCENT: Record<ServiceId, Accent> = { web: 'acid', software: 'orange', ai: 'violet' }

const NAV = [
  ['capabilities', 'What we build'],
  ['expertise', 'Approach'],
  ['delivery', 'Delivery'],
  ['work', 'Work'],
  ['questions', 'Questions'],
] as const

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

  const accent = ACCENT[service.id]

  return (
    <div className={styles.experience} data-service-experience>
      <RefHero
        id="service-hero"
        crumb={
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span>{service.title}</span>
          </nav>
        }
        line={headline[0]}
        ghost={headline[1]}
        lead={service.description}
        primary={{ href: '/contact', label: 'Bring us the problem' }}
        secondary={{ href: '#capabilities', label: 'What we build' }}
      >
        <div
          id="service-proof-object"
          data-testid="service-proof-object"
          className={`${styles.demo} ${styles.heroDemo}`}
        >
          <Panel depth={18}>
            <ServiceDemo kind={service.id} />
          </Panel>
          <p className={styles.demoCaption}>{guide.demoCaption}</p>
        </div>
      </RefHero>
      <PillNav items={NAV} />

      <RefIntro
        id="service-fit"
        testId="service-fit"
        count="Built for your next chapter"
        line={guide.promise}
        aside={
          <span className={styles.fitTags}>
            {service.fitSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </span>
        }
      >
        <CapabilityGrid
          testId="outcome-flow"
          ariaLabel="What changes"
          items={service.outcomes.map((outcome, i) => ({
            label: `0${i + 1} / What changes`,
            title: outcome.title,
            body: outcome.body,
          }))}
        />
      </RefIntro>

      <Chapter
        id="capabilities"
        testId="capability-river"
        count="01 / What we can build"
        word="Build"
        title={guide.buildTitle}
        body={guide.buildIntro}
        accent={accent}
      >
        <FeatureSpace kind={service.id} />
        <div className={styles.workbenchWrap}>
          <ServiceWorkbench service={service} />
        </div>
        <CapabilityGrid
          items={service.capabilities.map((capability) => ({
            title: capability.title,
            body: (
              <>
                {capability.body} {guide.examples[capability.title]}
              </>
            ),
          }))}
        />
      </Chapter>

      <Chapter
        id="expertise"
        testId="service-expertise"
        count="02 / The thinking behind the build"
        word="Approach"
        title={guide.expertiseTitle}
        body={guide.expertiseIntro}
        accent={accent}
      >
        <div className={styles.split}>
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
          <Panel depth={22}>
            <DecisionLab kind={service.id} />
          </Panel>
        </div>
      </Chapter>

      <Chapter
        id="delivery"
        testId="connected-process"
        count="03 / From brief to handover"
        word="Delivery"
        title="Your call. At every step."
        body="We gather your requirements, bring you options and say which we would pick. You choose, then we build exactly that, and you see it take shape every week."
        accent={accent}
      >
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
      </Chapter>

      {guide.ownStack && (
        <section
          id="own-automation"
          className={styles.ownSection}
          aria-labelledby="own-automation-title"
          data-testid="own-automation"
        >
          <div className="tw-wrap">
            <div className={styles.split}>
              <h2 id="own-automation-title" className={styles.ownTitle}>
                What we automate for ourselves.
              </h2>
              <p className={styles.sectionBody}>
                We don&apos;t have a client automation case study to show you yet. We do run our own
                business on these.
              </p>
            </div>
            <CapabilityGrid
              items={guide.ownStack.map((item) => ({ title: item.title, body: item.body }))}
            />
            <p className={styles.meta}>Our own use. Not client work.</p>
          </div>
        </section>
      )}

      <Chapter
        id="work"
        testId="service-proof"
        count="04 / Selected client work"
        word="Proof"
        title={studies.length > 0 ? 'Designed here. Out in the world.' : 'Explore our published work.'}
        body={
          studies.length > 0
            ? guide.reviewBody
            : 'The demos above are examples. Our published client projects so far are websites.'
        }
        cta={studies.length > 0 ? undefined : { href: '/work', label: 'See the projects' }}
        accent={accent}
      >
        {studies.length > 0 && (
          <div className={styles.relatedGrid}>
            {studies.map((study, i) => (
              <Link
                href={`/work/${study.slug}`}
                key={study.slug}
                className={styles.relatedCard}
                data-depth={16 + i * 6}
              >
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
        )}
      </Chapter>

      <Chapter
        id="questions"
        testId="service-faq"
        count="05 / Before we start"
        word="Details"
        title="The details worth knowing."
        body={guide.brief}
        accent={accent}
      >
        <div className={styles.split}>
          <div>
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
            <PrimaryCTA href="/contact" variant="ghost">
              Talk through your brief
            </PrimaryCTA>
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
      </Chapter>

      <section className={styles.otherServices} aria-label="Other services">
        <div className={styles.otherInner}>
          <span className={styles.meta}>Connect the next part</span>
          {SERVICE_LIST.filter((item) => item.id !== service.id).map((item) => (
            <Link href={item.slug} key={item.id}>
              {item.title}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
