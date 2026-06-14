import Link from 'next/link'
import { CASE_STUDIES } from '@/data/case-studies'
import styles from './CaseStudySection.module.css'

export default function CaseStudySection() {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <span className={styles.label}>Selected work</span>
          <Link href="/work" className={styles.allLink}>
            All projects →
          </Link>
        </div>
        <div className={styles.grid}>
          {CASE_STUDIES.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className={`${styles.card} rv`}
            >
              <span className={styles.industry}>{cs.industry}</span>
              <h2 className={styles.client}>{cs.client}</h2>
              <p className={styles.outcome}>{cs.outcome}</p>
              <div className={styles.stack}>
                {cs.stack.map((tech) => (
                  <span key={tech} className={styles.tag}>
                    {tech}
                  </span>
                ))}
              </div>
              <span className={styles.viewLink}>View project →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
