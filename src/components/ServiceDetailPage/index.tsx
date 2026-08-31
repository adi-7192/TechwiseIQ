import Image from 'next/image'
import Link from 'next/link'
import type { SceneName } from '@/components/immersive/ImmersiveShell'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import ProofObject from '@/components/proof'
import type { ProofVariant } from '@/components/immersive/home/home-content'
import FAQSection from '@/components/FAQSection'
import { CASE_STUDIES } from '@/data/case-studies'
import type { ServiceId, ServiceContent } from '@/data/services'
import styles from './ServiceDetailPage.module.css'

/** Each service shares the global world but leads with its own signal scene. */
export const SERVICE_SCENE: Record<ServiceId, SceneName> = {
  web: 'web', // acid
  software: 'apps', // orange
  ai: 'automation', // violet
}

/** The interactive proof object that best demonstrates each service. */
const SERVICE_PROOF: Record<ServiceId, ProofVariant> = {
  web: 'website',
  software: 'console',
  ai: 'automation',
}

const PROOF_INTRO: Record<ServiceId, string> = {
  web: 'The argument order every site is built around: one sharp promise, real proof, a single next action.',
  software:
    'One role-shaped console around a real sequence of work — queue, review the automated checks, approve or return.',
  ai: 'A lead-intake pipeline where every step stays explicit: deterministic rules, bounded AI judgment, system action — and a person owns the edge cases.',
}

/**
 * The AI control model, made explicit next to the automation proof object.
 * Deterministic rules first, AI kept to bounded judgment, a human review path,
 * real integrations, and full traceability.
 */
const AI_CONTROL_MODEL: { term: string; body: string }[] = [
  {
    term: 'Deterministic rules first',
    body: 'Anything with a right answer is coded as an explicit rule — never left to a model to guess.',
  },
  {
    term: 'Bounded AI judgment',
    body: 'AI is used only for classification and drafting inside clear limits, with qualitative labels, not silent decisions.',
  },
  {
    term: 'Human review where it matters',
    body: 'Low confidence or high-stakes cases route to a person instead of auto-resolving.',
  },
  {
    term: 'Integrated with your tools',
    body: 'Flows connect to the CRM, inbox, and systems already running the operation, with clear fallbacks when an integration fails.',
  },
  {
    term: 'Traceable by default',
    body: 'Every input, rule result, and action is logged, so an automated outcome can always be explained and audited.',
  },
]

interface ServiceDetailPageProps {
  service: ServiceContent
}

export default function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const studies = service.proofSlugs
    .map((slug) => CASE_STUDIES.find((study) => study.slug === slug))
    .filter((study): study is (typeof CASE_STUDIES)[number] => Boolean(study))

  return (
    <div className={styles.experience} data-service-experience>
      {/* 1 · Service hero */}
      <Section as="header" density="sparse" innerClassName={styles.heroInner}>
        <div className={styles.breadcrumb}>
          <Link href="/services" className={styles.back}>
            Services
          </Link>
          <span aria-hidden="true">/</span>
          <span>{service.number}</span>
        </div>
        <DisplayHeading as="h1" size="hero" className={styles.heroTitle}>
          {service.title}
          <span className={styles.dot} aria-hidden="true" />
        </DisplayHeading>
        <p className={styles.heroLede}>{service.description}</p>
        <div className={styles.heroActions}>
          <PrimaryCTA href="/contact" variant="primary">
            Start a project
          </PrimaryCTA>
          <PrimaryCTA href="#service-proof-object" variant="secondary" arrow={false}>
            See it work
          </PrimaryCTA>
        </div>
      </Section>

      {/* 2 · Business friction */}
      <Section
        id="service-fit"
        ruled
        density="dense"
        data-testid="service-fit"
        aria-labelledby="fit-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="01">This service is for you when</SectionLabel>
          <DisplayHeading as="h2" size="h2" id="fit-title" className={styles.sectionTitle}>
            The friction is <span>visible.</span>
          </DisplayHeading>
        </div>
        <ol className={styles.symptomList}>
          {service.symptoms.map((symptom, index) => (
            <li key={symptom}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <p>{symptom}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 3 · Transformation */}
      <Section
        ruled
        density="dense"
        data-testid="outcome-flow"
        aria-labelledby="outcome-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="02">What changes</SectionLabel>
          <DisplayHeading as="h2" size="h2" id="outcome-title" className={styles.sectionTitle}>
            From current state to <span>working advantage.</span>
          </DisplayHeading>
        </div>
        <ol className={styles.outcomeFlow}>
          {service.outcomes.map((outcome, index) => (
            <li key={outcome.title}>
              <span className={styles.outcomeNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{outcome.title}</h3>
              <p>{outcome.body}</p>
              {index < service.outcomes.length - 1 && (
                <span className={styles.outcomeArrow} aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* 4 · Relevant proof object (interactive demonstration) */}
      <Section
        id="service-proof-object"
        ruled
        density="dense"
        data-testid="service-proof-object"
        aria-labelledby="proof-object-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="03">See it work</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="proof-object-title"
            className={styles.sectionTitle}
          >
            A working artifact, <span>not a screenshot.</span>
          </DisplayHeading>
          <p className={styles.sectionBody}>{PROOF_INTRO[service.id]}</p>
        </div>

        <ProofObject variant={SERVICE_PROOF[service.id]} />

        {service.id === 'ai' && (
          <dl className={styles.controlModel} aria-label="How the automation stays under control">
            {AI_CONTROL_MODEL.map((item) => (
              <div key={item.term} className={styles.controlItem}>
                <dt>{item.term}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      {/* 5 · Capabilities */}
      <Section
        ruled
        density="dense"
        data-testid="capability-river"
        aria-labelledby="capability-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="04">What we can build together</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="capability-title"
            className={styles.sectionTitle}
          >
            The parts work as <span>one system.</span>
          </DisplayHeading>
        </div>
        <div className={styles.capabilityGrid}>
          {service.capabilities.map((capability) => (
            <article key={capability.title} className={styles.capability}>
              <span className={styles.capabilityMark} aria-hidden="true">
                →
              </span>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 6 · Delivery model */}
      <Section
        ruled
        density="dense"
        data-testid="connected-process"
        aria-labelledby="process-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="05">How the work moves</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="process-title"
            className={styles.sectionTitle}
          >
            One continuous <span>build loop.</span>
          </DisplayHeading>
        </div>
        <ol className={styles.processTrack}>
          {service.process.map((step) => (
            <li key={step.num}>
              <span className={styles.processNumber} aria-hidden="true">
                {step.num}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 7 · Real related work */}
      <Section
        ruled
        density="dense"
        data-testid="service-proof"
        aria-labelledby="related-title"
      >
        <div className={styles.sectionIntro}>
          <SectionLabel index="06">Proof before the scope</SectionLabel>
          <DisplayHeading
            as="h2"
            size="h2"
            id="related-title"
            className={styles.sectionTitle}
          >
            See the standard. Then see <span>the system.</span>
          </DisplayHeading>
        </div>
        {studies.length > 0 ? (
          <div className={styles.relatedGrid}>
            {studies.map((study, index) => (
              <Link
                href={`/work/${study.slug}`}
                key={study.slug}
                className={styles.relatedCard}
              >
                {study.coverImage && (
                  <div className={styles.relatedImage}>
                    <Image
                      src={study.coverImage}
                      alt={`${study.title} website case study preview`}
                      fill
                      sizes="(max-width: 880px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className={styles.relatedCopy}>
                  <span className={styles.relatedMeta}>
                    Relevant project / {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{study.title}</h3>
                  <p>{study.outcome}</p>
                  <span className={styles.relatedLink}>
                    Read the case study <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.relatedFallback}>
            <p>
              Our published case studies currently show our web work. The same
              delivery standards apply here: clear scope, working demos, and a
              clean handover.
            </p>
            <PrimaryCTA href="/work" variant="ghost">
              See what we&apos;ve shipped
            </PrimaryCTA>
          </div>
        )}
      </Section>

      {/* 8 · FAQs */}
      <FAQSection
        faqs={service.faqs}
        heading="Clear answers. No sales fog."
        testId="service-faq"
      />

      {/* 9 · CTA */}
      <Section ruled density="sparse" innerClassName={styles.ctaInner} aria-labelledby="service-cta-title">
        <SectionLabel>Bring us the constraint</SectionLabel>
        <DisplayHeading
          as="h2"
          size="statement"
          id="service-cta-title"
          className={styles.ctaTitle}
        >
          Make the next interaction <span>count.</span>
        </DisplayHeading>
        <p className={styles.ctaBody}>
          Tell us what is slow, broken, or missing. We&apos;ll help shape the
          right route.
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
