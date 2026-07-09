import Link from 'next/link'
import type { Service } from '@/types'
import { CASE_STUDIES } from '@/data/case-studies'
import styles from './ProofStrip.module.css'

interface Props {
  service: Service['id']
}

/**
 * Cross-links a service page to its proof: case studies for that service,
 * or the work index when none exist yet for the service.
 */
export default function ProofStrip({ service }: Props) {
  const studies = CASE_STUDIES.filter((cs) => cs.service === service)

  return (
    <section className={styles.proof}>
      <div className="wrap">
        <h2 className="sr-only">Proof</h2>
        <span className={styles.label} aria-hidden="true">
          Proof, not promises
        </span>
        {studies.length > 0 ? (
          <ul className={styles.list}>
            {studies.map((cs) => (
              <li key={cs.slug}>
                <Link href={`/work/${cs.slug}`} className={styles.item}>
                  <span className={styles.itemTitle}>{cs.title}</span>
                  <span className={styles.itemOutcome}>{cs.outcome}</span>
                  <span className={styles.itemCta}>
                    Read the case study <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.fallback}>
            Case studies for this service are in progress.{' '}
            <Link href="/work" className={styles.fallbackLink}>
              See what we&apos;ve shipped <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
