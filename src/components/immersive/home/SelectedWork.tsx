import Image from 'next/image'
import Link from 'next/link'
import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { CASE_STUDIES, SERVICE_LABELS } from '@/data/case-studies'
import styles from './home.module.css'

/**
 * Section 7 — real client work only. Cards read from `@/data/case-studies`
 * (the content source of truth) and link to the existing case-study routes.
 * The Concept Lab (self-initiated) is intentionally kept on /work, not here,
 * so this block leads with real proof.
 */
export default function SelectedWork() {
  const featured = CASE_STUDIES.filter((cs): cs is typeof cs & { coverImage: string } =>
    Boolean(cs.featured && cs.coverImage)
  )

  return (
    <Section
      id="selected-work"
      ruled
      density="dense"
      data-scene="intro"
      aria-labelledby="work-title"
    >
      <div className={styles.workHead} data-home-reveal>
        <div>
          <SectionLabel index="04">Selected work</SectionLabel>
          <DisplayHeading as="h2" size="h2" id="work-title" className={styles.chapterTitle}>
            Real projects, shipped.
          </DisplayHeading>
        </div>
        <PrimaryCTA href="/work" variant="ghost">
          See all work
        </PrimaryCTA>
      </div>

      <div className={styles.workGrid} data-home-reveal>
        {featured.map((cs) => (
          <Link key={cs.slug} href={`/work/${cs.slug}`} className={styles.workCard}>
            <div className={styles.workCover}>
              <Image
                src={cs.coverImage}
                alt={`${cs.title} — ${cs.coverCaption}`}
                width={1440}
                height={900}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div className={styles.workBody}>
              <p className={styles.workMeta}>
                <span>{cs.industry}</span>
                <span>{SERVICE_LABELS[cs.service]}</span>
                <span>{cs.timeline}</span>
              </p>
              <h3 className={styles.workTitle}>{cs.title}</h3>
              <p className={styles.workOutcome}>{cs.outcome}</p>
              <dl className={styles.workProof}>
                {cs.workSummary.proof.map((stat) => (
                  <div key={stat.label}>
                    <dd className={styles.proofValue}>{stat.value}</dd>
                    <dt className={styles.proofLabel}>{stat.label}</dt>
                  </div>
                ))}
              </dl>
              <p className={styles.workCta}>View case study →</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}
